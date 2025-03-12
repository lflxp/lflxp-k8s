package model

import (
	"testing"
	"time"
)

func Test_HistoryParse(t *testing.T) {
	data := History{}
	HistoryParse(&data, true)
	if data.Success == "" {
		t.Error("Success should not be empty")
	}

	tmpsuccess := data.Success

	time.Sleep(1 * time.Second)
	// 第二次依旧正常
	// 查看时间是否修改
	HistoryParse(&data, true)
	if data.Success != tmpsuccess {
		t.Error("Success should not be modified")
	}

	time.Sleep(1 * time.Second)
	// 第一次中断
	HistoryParse(&data, false)
	if data.Error == "" {
		t.Error("Error should not be empty")
	}
	tmperror := data.Error

	time.Sleep(1 * time.Second)
	// 第三次由中断切换为正常
	// 查看时间是否修改
	HistoryParse(&data, true)
	if data.Success == tmpsuccess {
		t.Error("Success should not be modified")
	}

	time.Sleep(1 * time.Second)
	// 第二次中断
	HistoryParse(&data, false)
	if data.Error == tmperror {
		t.Error("Error should not be modified")
	}
}
