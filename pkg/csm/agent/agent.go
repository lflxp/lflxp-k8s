//go:build linux || darwin
// +build linux darwin

package agent

import (
	"fmt"
	"regexp"
	"sync"
	"time"

	"github.com/lflxp/lflxp-k8s/pkg/csm/model"
	"github.com/lflxp/lflxp-k8s/utils"

	"github.com/panjf2000/ants/v2"
)

var agentHistory *sync.Map

func AgentCheck(data []model.Command) []model.RecordList {
	if agentHistory == nil {
		agentHistory = new(sync.Map)
	}

	if len(data) == 0 {
		fmt.Println("Commands检测配置为空")
		return nil
	}

	var wg sync.WaitGroup
	result := make([]model.RecordList, 0)

	// Use the pool with a function,
	// set 10 to the capacity of goroutine pool and 1 second for expired duration.
	p, _ := ants.NewPoolWithFunc(model.RunTimes, func(i interface{}) {
		result = append(result, CommandReduce(i.(model.Command)))
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

func CommandReduce(data model.Command) model.RecordList {
	tmp := model.RecordList{
		Name:   data.Name,
		Kind:   "command",
		Config: data,
	}

	var (
		history model.History
	)

	if tmp, ok := agentHistory.Load(data.Name); !ok {
		history = model.History{}
	} else {
		history = tmp.(model.History)
	}

	defer func() {
		agentHistory.Store(data.Name, history)
	}()

	// 检查服务
	if data.Cmd != "" {
		output, err := utils.ExecCommandEnv(data.Cmd, data.Command)
		tmp.Result = utils.ConvertByte2String(output, utils.GB18030)
		if err != nil {
			tmp.Error = err.Error()
			tmp.Message = err.Error()
		}
	} else {
		output, err := utils.ExecCommandLinux(data.Command)
		tmp.Result = utils.ConvertByte2String(output, utils.GB18030)
		if err != nil {
			tmp.Error = err.Error()
			tmp.Message = err.Error()
		}
	}

	matched, err := regexp.MatchString(data.Regex, tmp.Result)
	if err != nil {
		tmp.Message = fmt.Sprintf("正则匹配错误: %s", err.Error())
		// 自动匹配Error信息
		matched, err = regexp.MatchString(data.Regex, tmp.Error)
		if err != nil {
			tmp.Message = fmt.Sprintf("正则匹配错误: %s", err.Error())
			tmp.Error = err.Error()
			model.HistoryParse(&history, false)
			tmp.History = history
			tmp.Time = time.Now()
			return tmp
		}
	}

	if !matched {
		tmp.Message = fmt.Sprintf("正则匹配 %s 失败: %s", data.Regex, tmp.Result)
		model.HistoryParse(&history, false)
		tmp.History = history
		tmp.Time = time.Now()
		return tmp
	}

	tmp.Status = true
	model.HistoryParse(&history, true)
	tmp.History = history
	tmp.Time = time.Now()

	return tmp
}
