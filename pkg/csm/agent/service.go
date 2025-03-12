package agent

import (
	"errors"
	"fmt"
	"sync"
	"time"

	"github.com/lflxp/lflxp-k8s/pkg/csm/model"
	"github.com/lflxp/lflxp-k8s/pkg/csm/service"
	"github.com/lflxp/lflxp-k8s/utils"
)

var resultHistory *sync.Map

func Server() {
	if resultHistory == nil {
		resultHistory = new(sync.Map)
	}

	go Heartbeat()

	// 定时执行命令
	cmdTicker := time.NewTicker(time.Duration(model.CmdSync) * time.Second)
	defer cmdTicker.Stop()

	err := start()
	if err != nil {
		fmt.Println("Agent探活失败", err)
	}

	go func() {
		for range cmdTicker.C {
			err := start()
			if err != nil {
				fmt.Println("Agent探活失败", err)
			}
		}
	}()

	for {
		fmt.Println("Sse 连接服务端 ", time.Now())
		err := ConnectServer()
		if err != nil {
			fmt.Println("Sse 连接服务端连接失败, 3秒后重试 ", err)
			time.Sleep(3 * time.Second)
		}
	}
}

func start() error {
	// 判断是否有配置
	if model.GetConfig() == nil {
		fmt.Println("配置为空")
		return errors.New("配置为空")
	}

	if len(model.GetConfig().Agent) == 0 {
		fmt.Println("Agent配置为空")
		return errors.New("Agent配置为空")
	}

	result := map[string]model.Record{}

	errCount := 0
	for _, v := range model.GetConfig().Agent {
		var history model.History

		if tmp, ok := resultHistory.Load(v.Name); !ok {
			history = model.History{}
		} else {
			history = tmp.(model.History)
		}

		// 执行Agent
		record := model.Record{
			Name:       v.Name,
			Kind:       "agent",
			Host:       fmt.Sprintf("%s:%s", model.GetLocalIP(), model.Port),
			RecordList: make([]model.RecordList, 0),
			Status:     true,
		}

		if len(v.Http) > 0 {
			record.RecordList = append(record.RecordList, service.ServerCheck(v.Http)...)
		}

		if len(v.Commands) > 0 {
			record.RecordList = append(record.RecordList, AgentCheck(v.Commands)...)
		}

		if len(v.TCP) > 0 {
			record.RecordList = append(record.RecordList, service.TcpCheck(v.TCP)...)
		}

		// 遍历结果状态
		for _, vv := range record.RecordList {
			if !vv.Status {
				errCount++
				record.Status = false
				break
			}
		}

		if record.Status {
			model.HistoryParse(&history, true)
		} else {
			model.HistoryParse(&history, false)
		}
		record.History = history
		record.Time = time.Now()

		result[v.Name] = record
		resultHistory.Store(v.Name, history)
	}

	// 发送数据
	code := 0
	body := ""

	var url string
	if model.Https {
		url = fmt.Sprintf("https://%s%s", model.Host, model.AgentPost)
	} else {
		url = fmt.Sprintf("http://%s%s", model.Host, model.AgentPost)
	}

	err := utils.NewGoutClient().
		POST(url).
		SetJSON(result).
		SetHeader(map[string]string{"X-Real-Ip": model.GetLocalIP()}).
		BindBody(&body).
		Code(&code).
		Do()

	if err != nil {
		fmt.Println("发送Agent Http检测结果失败 ", err)
		return err
	}

	if code != 200 {
		fmt.Printf("发送Agent Http检测结果Code %d 异常 %s\n", code, body)
		return fmt.Errorf("发送Agent Http检测结果Code %d 异常 %s", code, body)
	}
	fmt.Printf("Agent %d 探活完毕，探活异常次数 %d %v\n", len(model.GetConfig().Agent), errCount, time.Now())
	return nil
}
