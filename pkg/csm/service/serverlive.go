package service

import (
	"fmt"
	"sync"
	"time"

	"github.com/lflxp/lflxp-k8s/pkg/csm/model"
)

var (
	ServerCheckData   map[string]model.Record
	thirdPartyHistory *sync.Map
)

// 服务端拨测第三方服务
func ThirdPartyCheck() {
	if ServerCheckData == nil {
		ServerCheckData = make(map[string]model.Record)
	}

	if thirdPartyHistory == nil {
		thirdPartyHistory = new(sync.Map)
	}

	if model.GetConfig() == nil {
		fmt.Println("服务端检测配置为空")
		return
	}

	// 删除不存在的服务
	for k := range ServerCheckData {
		exists := false
		for _, v := range model.GetConfig().ThirdParty {
			if k == v.Name {
				exists = true
				break
			}
		}

		if !exists {
			delete(ServerCheckData, k)
		}
	}

	// 检测服务
	errCount := 0
	for _, v := range model.GetConfig().ThirdParty {
		var history model.History

		if tmp, ok := thirdPartyHistory.Load(v.Name); !ok {
			history = model.History{}
		} else {
			history = tmp.(model.History)
		}

		record := model.Record{
			Name:       v.Name,
			Kind:       "agent",
			Host:       fmt.Sprintf("%s:%s", model.GetLocalIP(), model.Port),
			RecordList: make([]model.RecordList, 0),
			Status:     true,
		}

		if len(v.Http) > 0 {
			record.RecordList = append(record.RecordList, ServerCheck(v.Http)...)
		}

		if len(v.TCP) > 0 {
			record.RecordList = append(record.RecordList, TcpCheck(v.TCP)...)
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
		ServerCheckData[v.Name] = record

		thirdPartyHistory.Store(v.Name, history)
	}
}
