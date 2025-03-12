//go:build linux || darwin
// +build linux darwin

package agent

import (
	"fmt"
	"time"

	"github.com/lflxp/lflxp-k8s/pkg/csm/model"
	"github.com/lflxp/lflxp-k8s/utils"

	"github.com/shirou/gopsutil/v4/cpu"
	"github.com/shirou/gopsutil/v4/disk"
	"github.com/shirou/gopsutil/v4/mem"
)

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
		SetHeader(map[string]string{"X-Real-Ip": model.GetLocalIP()}).
		SetJSON(demo).
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

	data.Message = "success"
	// data.History = model.History{Success: time.Now().Format("2006-01-02 15:04:05")}
	data.Status = true
	model.HistoryParse(heartHistory, true)

	data.History = *heartHistory
	return data
}
