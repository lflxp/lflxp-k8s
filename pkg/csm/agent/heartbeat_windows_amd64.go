//go:build windows
// +build windows

package agent

import (
	"fmt"
	"strings"
	"time"

	"github.com/lflxp/lflxp-k8s/pkg/csm/model"
	"github.com/lflxp/lflxp-k8s/utils"

	"syscall"

	"github.com/shirou/gopsutil/v4/cpu"
	"github.com/shirou/gopsutil/v4/disk"
	"github.com/shirou/gopsutil/v4/mem"
)

// 最近一次中断时间 错误记录之记录第一次错误时间，直到下次成功后再次错误更新时间
// 最近一次连接时间 如果正常则应该保持最新时间 如果不正常就保留最近的一次连接时间
var heartHistory *model.History

func Heartbeat() {
	if heartHistory == nil {
		heartHistory = new(model.History)
	}

	// 定时同步配置
	configTicker := time.NewTicker(time.Duration(model.ConfigSync) * time.Second)
	defer configTicker.Stop()

	data, err := model.SyncConfig()
	if err != nil {
		fmt.Println("同步配置失败", err)
	}
	model.SetConfig(&data.Data)

	go func() {
		for range configTicker.C {
			// fmt.Println(serverConfig.Datas)
			data, err := model.SyncConfig()
			if err != nil {
				fmt.Println("同步配置失败", err)
				continue
			}
			model.SetConfig(&data.Data)
		}
	}()

	// 定时发送心跳
	heartbeatTicker := time.NewTicker(time.Duration(model.HeartSync) * time.Second)
	defer heartbeatTicker.Stop()

	err = heartbeat()
	if err != nil {
		fmt.Println("发送心跳失败", err)
	}
	for range heartbeatTicker.C {
		err := heartbeat()
		if err != nil {
			fmt.Println("发送心跳失败", err)
		}
	}
}

// 获取控盘符
func getFreeDriveLetters() ([]string, error) {
	kernel32, err := syscall.LoadLibrary("kernel32.dll")
	if err != nil {
		return nil, err
	}
	defer syscall.FreeLibrary(kernel32)

	getLogicalDrives, err := syscall.GetProcAddress(kernel32, "GetLogicalDrives")
	if err != nil {
		return nil, err
	}

	ret, _, _ := syscall.Syscall(uintptr(getLogicalDrives), 0, 0, 0, 0)
	if ret == 0 {
		return nil, fmt.Errorf("failed to get logical drives")
	}

	var freeDrives []string
	for i := 0; i < 26; i++ {
		if ret&(1<<uint(i)) == 0 {
			freeDrives = append(freeDrives, string('A'+i)+":")
		}
	}

	return freeDrives, nil
}

// 统计java -jar agent.jar
func getJavaAgent() bool {
	cmd := "wmic process get Commandline"
	rs, err := utils.ExecCommandWindows(cmd)
	if err != nil {
		fmt.Println("获取Java Agent.jar进程失败 ", err)
		return false
	}

	if strings.Contains(string(rs), "-jar agent.jar -url") {
		return true
	}

	fmt.Println("=====> [JenkinsError] ", string(rs))
	return false
}

func heartbeat() error {
	fmt.Println("发送心跳", time.Now())
	// 发送心跳
	code := 0
	body := ""
	var url string

	if model.Https {
		url = fmt.Sprintf("https://%s%s", model.Host, model.HeartbeatUrl)
	} else {
		url = fmt.Sprintf("http://%s%s", model.Host, model.HeartbeatUrl)
	}

	// 获取资源
	demo := AgentResource()

	err := utils.NewGoutClient().
		POST(url).
		SetJSON(demo).
		SetHeader(map[string]string{"X-Real-Ip": model.GetLocalIP()}).
		BindBody(&body).
		Code(&code).
		Do()

	if err != nil {
		fmt.Println("发送心跳失败", err)
		return err
	}

	if code != 200 {
		fmt.Println("发送心跳失败", code, body)
		return fmt.Errorf("发送心跳失败 %d %s", code, body)
	}

	if model.GetConfig().Webhook != "" {
		fmt.Println("发送Webhook ", model.GetConfig().Webhook)
		// 发送Webhook
		err = utils.NewGoutClient().
			POST(model.GetConfig().Webhook).
			SetHeader(map[string]string{"X-Real-Ip": model.GetLocalIP()}).
			SetJSON(demo).
			BindBody(&body).
			Code(&code).
			Do()

		if err != nil {
			fmt.Println("发送Webhook失败", err)
			return err
		}

		if code != 200 {
			fmt.Println("发送Webhook失败", code, body)
			return fmt.Errorf("发送Webhook失败 %d %s", code, body)
		}
	}

	return nil
}

func AgentResource() model.Heartbeat {
	data := model.Heartbeat{
		Port: model.Port,
		Disk: []model.DiskResource{},
	}

	// 获取内存
	v, err := mem.VirtualMemory()
	if err != nil {
		data.Message = fmt.Sprintf("获取内存失败 %s", err.Error())
		model.HistoryParse(heartHistory, false)
		data.History = *heartHistory
		return data
	}

	data.Memory.Total = int64(v.Total)
	data.Memory.Used = int64(v.Used)
	data.Memory.Free = int64(v.Free)
	data.Memory.Percent = utils.Decimal(v.UsedPercent)

	// 获取磁盘
	infos, err := disk.Partitions(true)
	if err != nil {
		data.Message = fmt.Sprintf("获取磁盘失败 %s", err.Error())
		model.HistoryParse(heartHistory, false)
		data.History = *heartHistory
		return data
	}

	for _, info := range infos {
		// fmt.Println(info)
		tmp := model.DiskResource{}

		v, err := disk.Usage(info.Mountpoint)
		if err != nil {
			data.Message = fmt.Sprintf("获取磁盘失败 %s", err.Error())
			model.HistoryParse(heartHistory, false)
			data.History = *heartHistory
			return data
		}

		tmp.Path = info.Mountpoint
		tmp.Total = int64(v.Total)
		tmp.Used = int64(v.Used)
		tmp.Free = int64(v.Free)
		tmp.Fstype = v.Fstype
		tmp.Percent = utils.Decimal(v.UsedPercent)
		data.Disk = append(data.Disk, tmp)
	}

	// 获取CPU
	physical, err := cpu.Counts(false)
	if err != nil {
		data.Message = fmt.Sprintf("获取CPU失败 %s", err.Error())
		model.HistoryParse(heartHistory, false)
		data.History = *heartHistory
		return data
	}

	data.Cpu.Physical = physical

	logical, err := cpu.Counts(true)
	if err != nil {
		data.Message = fmt.Sprintf("获取CPU失败 %s", err.Error())
		model.HistoryParse(heartHistory, false)
		data.History = *heartHistory
		return data
	}

	data.Cpu.Logical = logical
	totalPercent, err := cpu.Percent(3*time.Second, false)
	if err != nil {
		data.Message = fmt.Sprintf("获取CPU使用率失败 %s", err.Error())
		model.HistoryParse(heartHistory, false)
		data.History = *heartHistory
		return data
	}

	data.Cpu.Percent = utils.Decimal(totalPercent[0])

	cpus, _ := cpu.Times(false)
	data.Cpu.Total = int64(cpus[0].Total())
	data.Cpu.Used = int64(cpus[0].User + cpus[0].System)
	data.Cpu.Idle = int64(cpus[0].Idle)
	data.Cpu.IOwait = int64(cpus[0].Iowait)

	freeDrives, err := getFreeDriveLetters()
	if err != nil {
		fmt.Println("Error:", err)
		data.Message = fmt.Sprintf("获取Windows空闲盘符失败 %s", err.Error())
		model.HistoryParse(heartHistory, false)
		data.History = *heartHistory
		return data
	}

	data.DiskFreeDrives = freeDrives

	// if getJavaAgent() {
	// 	data.Status = true
	// 	data.Message = "success"
	// 	model.HistoryParse(heartHistory, true)
	// } else {
	// 	data.Status = false
	// 	data.Message = "Java Agent.jar not found"
	// 	model.HistoryParse(heartHistory, false)
	// }

	data.Status = true
	data.Message = "success"
	model.HistoryParse(heartHistory, true)

	data.History = *heartHistory

	return data
}
