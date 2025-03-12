package service

import (
	"fmt"
	"regexp"
	"sync"
	"time"

	"github.com/lflxp/lflxp-k8s/pkg/csm/model"
	"github.com/lflxp/lflxp-k8s/utils"

	"github.com/guonaihong/gout/dataflow"
	"github.com/panjf2000/ants/v2"
	"github.com/tidwall/gjson"
)

var (
	serverHistory *sync.Map
)

// 服务端拨测第三方服务
func ServerCheck(data []model.ThirdParty) []model.RecordList {
	if serverHistory == nil {
		serverHistory = new(sync.Map)
	}

	if len(data) == 0 {
		fmt.Println("Http检测配置为空")
		return nil
	}

	var wg sync.WaitGroup
	result := make([]model.RecordList, 0)

	// Use the pool with a function,
	// set 10 to the capacity of goroutine pool and 1 second for expired duration.
	p, _ := ants.NewPoolWithFunc(model.RunTimes, func(i interface{}) {
		result = append(result, Reduce(i.(model.ThirdParty)))
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

// 分布执行
func Reduce(data model.ThirdParty) model.RecordList {

	result := model.RecordList{
		Name:   data.Name,
		Time:   time.Now(),
		Kind:   "http",
		Config: data,
	}

	var (
		history model.History
	)

	if tmp, ok := serverHistory.Load(data.Name); !ok {
		history = model.History{}
	} else {
		history = tmp.(model.History)
	}
	defer func() {
		serverHistory.Store(data.Name, history)
	}()

	// 检查服务
	code := 0
	body := ""
	client := utils.NewGoutClient()

	var cc *dataflow.DataFlow
	if data.Method == "GET" {
		cc = client.GET(data.Url)
	} else if data.Method == "POST" {
		cc = client.POST(data.Url)
	} else if data.Method == "PUT" {
		cc = client.PUT(data.Url)
	} else if data.Method == "DELETE" {
		cc = client.DELETE(data.Url)
	} else {
		cc = client.GET(data.Url)
	}

	if data.Header != nil {
		cc.SetHeader(data.Header)
	}

	if data.Debug {
		cc.Debug(true)
	}

	err := cc.
		BindBody(&body).
		Code(&code).
		Do()

	result.Result = body

	if err != nil {
		fmt.Println("Agent Http Error检测错误 ", err)
		result.Error = err.Error()
		result.Message = err.Error()
		model.HistoryParse(&history, false)
		result.History = history
		return result
	}

	if code != 200 {
		fmt.Println("Agent Http Code检测错误 ", code)
		result.Result = body
		result.Message = fmt.Sprintf("http code %d", code)
		model.HistoryParse(&history, false)
		result.History = history
		return result
	}

	value := gjson.Get(body, data.JsonPath)
	if !value.Exists() {
		fmt.Println("JsonPath not exists : ", data.JsonPath)
		result.Message = "JsonPath not exists"
		model.HistoryParse(&history, false)
		result.History = history
		return result
	}

	// 正则判断
	matched, err := regexp.MatchString(data.Regex, value.String())
	if err != nil {
		fmt.Println("正则匹配错误 ", err)
		result.Error = err.Error()
		result.Message = fmt.Sprintf("正则匹配错误 %s", err.Error())
		model.HistoryParse(&history, false)
		result.History = history
		return result
	}

	if !matched {
		fmt.Println("正则匹配失败 ", value.String())
		result.Message = fmt.Sprintf("正则匹配 %s 失败, 返回结果为 %s", data.Regex, value.String())
		model.HistoryParse(&history, false)
		result.History = history
		return result
	}

	result.Status = true
	result.Message = fmt.Sprintf("正则匹配 %s 成功, 返回结果为 %s", data.Regex, value.String())
	model.HistoryParse(&history, true)
	result.History = history
	return result
}
