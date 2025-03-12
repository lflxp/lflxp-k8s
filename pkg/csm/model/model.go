package model

import (
	"fmt"
	"time"
)

type Data struct {
	Kind       string  `json:"kind"`
	Agent      []Agent `json:"agent"`
	ThirdParty []Agent `json:"thirdparty"`
	Webhook    string  `json:"webhook"`
}

type Agent struct {
	Name     string       `json:"name"`
	Commands []Command    `json:"commands"`
	Http     []ThirdParty `json:"http"`
	TCP      []Tcp        `json:"tcp"`
	Status   bool         `json:"status"`
}

type Tcp struct {
	Name     string `json:"name"`
	Host     string `json:"host"`
	Port     int    `json:"port"`
	Protocol string `json:"protocol"`
	Timeout  int    `json:"timeout"`
}

type ThirdParty struct {
	Name     string            `json:"name"`
	Url      string            `json:"url"`
	JsonPath string            `json:"jsonpath"`
	Regex    string            `json:"regex"`
	Method   string            `json:"method"`
	Header   map[string]string `json:"header"`
	Debug    bool              `json:"debug"`
}

type Command struct {
	Name    string `json:"name"`
	Command string `json:"command"`
	Regex   string `json:"regex"` // 结果正则表达式
	Cmd     string `json:"cmd"`   // 命令
}

type Record struct {
	Name       string       `json:"name"`
	Kind       string       `json:"kind"`
	Status     bool         `json:"status"`
	Host       string       `json:"host"`
	RecordList []RecordList `json:"checklist"`
	Time       time.Time    `json:"time"`
	History    History      `json:"history"`
}

type RecordList struct {
	Name    string      `json:"name"`
	Result  string      `json:"result"`
	Status  bool        `json:"status"`
	Message string      `json:"message"`
	Kind    string      `json:"kind"`
	Config  interface{} `json:"config"`
	Error   string      `json:"error"`
	Time    time.Time   `json:"time"`
	History History     `json:"history"`
}

type Resource struct {
	Total   int64   `json:"total"`
	Used    int64   `json:"used"`
	Free    int64   `json:"free"`
	Percent float64 `json:"percent"`
}

type CpuResource struct {
	Physical int `json:"physical"`
	Logical  int `json:"logical"`

	Total   int64   `json:"total"`
	Used    int64   `json:"used"`
	Idle    int64   `json:"idle"`
	IOwait  int64   `json:"iowait"`
	Percent float64 `json:"percent"`
}

type DiskResource struct {
	Path    string  `json:"path"`
	Total   int64   `json:"total"`
	Used    int64   `json:"used"`
	Free    int64   `json:"free"`
	Percent float64 `json:"percent"`
	Fstype  string  `json:"fstype"`
}

type Heartbeat struct {
	Host           string         `json:"host"`
	Port           string         `json:"port"`
	Time           time.Time      `json:"time"`
	Cpu            CpuResource    `json:"cpu"`
	Memory         Resource       `json:"memory"`
	Disk           []DiskResource `json:"disk"`
	DiskFreeDrives []string       `json:"diskFreeDrives"`
	Status         bool           `json:"status"`
	Last           string         `json:"last"`
	Message        string         `json:"message"`
	History        History        `json:"history"`
}

type Result struct {
	Success      bool   `json:"success"`
	Data         Data   `json:"data"`
	ErrorCode    string `json:"errorCode"`
	ErrorMessage string `json:"message"`
	Host         string `json:"host"`
	TraceId      string `json:"traceid"`
	ShowType     string `json:"showtype"`
	Code         string `json:"code"`
}

type History struct {
	Error   string `json:"error"`
	Success string `json:"success"`
}

// 时间判断
// 保留最近的中断转连接时间
// 保留最近的连接转中断时间
// 时间均需保留，无删除
func HistoryParse(data *History, isSuccess bool) *History {
	if isSuccess {
		if data.Success == "" && data.Error == "" {
			data.Success = time.Now().Format("2006-01-02 15:04:05")
		} else if data.Success == "" && data.Error != "" {
			data.Success = time.Now().Format("2006-01-02 15:04:05")
		} else if data.Success != "" && data.Error != "" {
			// 比较成功和错误时间
			// 判断是状态切换还是保持不变
			success, err := time.Parse(TimeLayout, data.Success)
			if err != nil {
				fmt.Printf("Success 时间 %s 转换失败 %s\n", data.Success, err)
				return data
			}

			etime, err := time.Parse(TimeLayout, data.Error)
			if err != nil {
				fmt.Printf("Error 时间 %s 转换失败 %s\n", data.Error, err)
				return data
			}
			// 判断成功时间是否在错误时间之后
			// 如果成功时间在错误时间之后证明当前是正常状态 ，则无需修改保持
			if etime.After(success) {
				data.Success = time.Now().Format("2006-01-02 15:04:05")
			}
		}
	} else {
		if data.Success == "" && data.Error == "" {
			data.Error = time.Now().Format("2006-01-02 15:04:05")
		} else if data.Success != "" && data.Error == "" {
			data.Error = time.Now().Format("2006-01-02 15:04:05")
		} else if data.Success != "" && data.Error != "" {
			// 比较成功和错误时间
			// 判断是状态切换还是保持不变
			success, err := time.Parse(TimeLayout, data.Success)
			if err != nil {
				fmt.Printf("Success 时间 %s 转换失败 %s\n", data.Success, err)
				return data
			}

			etime, err := time.Parse(TimeLayout, data.Error)
			if err != nil {
				fmt.Printf("Error 时间 %s 转换失败 %s\n", data.Error, err)
				return data
			}
			// 判断成功时间是否在错误时间之后
			// 如果成功时间在错误时间之后证明当前是正常状态 ，则无需修改保持
			if success.After(etime) {
				data.Error = time.Now().Format("2006-01-02 15:04:05")
			}
		}
	}

	return data
}
