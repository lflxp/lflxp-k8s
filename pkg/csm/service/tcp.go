package service

import (
	"fmt"
	"sync"
	"time"

	"github.com/lflxp/lflxp-k8s/pkg/csm/model"
	"github.com/lflxp/lflxp-k8s/utils"

	"github.com/panjf2000/ants/v2"
)

var tcpHistory *sync.Map

func TcpCheck(data []model.Tcp) []model.RecordList {
	if tcpHistory == nil {
		tcpHistory = new(sync.Map)
	}

	if len(data) == 0 {
		return nil
	}

	var wg sync.WaitGroup
	result := make([]model.RecordList, 0)

	// Use the pool with a function,
	// set 10 to the capacity of goroutine pool and 1 second for expired duration.
	p, _ := ants.NewPoolWithFunc(model.RunTimes, func(i interface{}) {
		result = append(result, TcpReduce(i.(model.Tcp)))
		wg.Done()
	})

	defer p.ReleaseTimeout(time.Duration(model.CmdSync) * time.Second)
	// defer p.Release()

	for _, v := range data {
		// result = append(result, CommandReduce(v))
		wg.Add(1)
		_ = p.Invoke(v)
	}

	wg.Wait()

	return result
}

func TcpReduce(data model.Tcp) model.RecordList {
	tmp := model.RecordList{
		Name:   data.Name,
		Kind:   "tcp",
		Config: data,
	}

	var (
		history model.History
	)

	if v, ok := tcpHistory.Load(data.Name); ok {
		history = v.(model.History)
	} else {
		history = model.History{}
	}

	defer func() {
		tcpHistory.Store(data.Name, history)
	}()

	if data.Protocol == "" {
		data.Protocol = "tcp"
	} else if data.Protocol != "tcp" && data.Protocol != "udp" {
		data.Protocol = "tcp"
	}

	if data.Timeout == 0 {
		data.Timeout = 3
	}

	// 检查服务端口
	if data.Host != "" && data.Port != 0 {
		start := time.Now()
		isok, err := utils.ProbePort(data.Protocol, data.Host, data.Port, time.Duration(data.Timeout)*time.Millisecond)
		if err != nil || !isok {
			tmp.Error = err.Error()
			tmp.Message = err.Error()
			model.HistoryParse(&history, false)
			tmp.History = history
			tmp.Time = time.Now()
			return tmp
		}

		elasped := time.Since(start)
		tmp.Message = fmt.Sprintf("连接成功, 耗时 %s", elasped.String())
		tmp.Status = true
		model.HistoryParse(&history, true)
		tmp.History = history
		tmp.Time = time.Now()
	}

	return tmp
}
