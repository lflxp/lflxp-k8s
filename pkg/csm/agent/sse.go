package agent

import (
	"crypto/tls"
	"encoding/json"
	"fmt"
	"io"
	"net/http"

	"github.com/lflxp/lflxp-k8s/pkg/csm/model"
	"github.com/lflxp/lflxp-k8s/utils"
)

func ConnectServer() error {
	tr := &http.Transport{
		TLSClientConfig: &tls.Config{InsecureSkipVerify: true},
	}

	client := &http.Client{Transport: tr}

	var url string
	if model.Https {
		url = fmt.Sprintf("https://%s%s", model.Host, model.SseUrl)
	} else {
		url = fmt.Sprintf("http://%s%s", model.Host, model.SseUrl)
	}

	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		fmt.Println("ConnectServer 创建请求失败", err)
		return err
	}

	// 设置请求头
	ips, err := utils.GetHostIP()
	if err != nil {
		fmt.Println("ConnectServer 获取本地IP失败", err)
		return err
	}
	req.Header.Set("X-Real-Ip", ips)

	resp, err := client.Do(req)
	if err != nil {
		fmt.Println("ConnectServer 请求失败", err)
		return err
	}
	defer resp.Body.Close()

	for {
		buf := make([]byte, 1024)
		n, err := resp.Body.Read(buf)
		if err != nil && err != io.EOF {
			fmt.Println("ConnectServer 读取数据失败", err)
			return fmt.Errorf("ConnectServer 读取数据失败 %s", err)
		}
		if n > 0 {
			fmt.Println("ConnectServer 获取服务端的主动探测信息 ", string(buf[:n]))
			var sse model.SSE
			err = json.Unmarshal(buf[:n], &sse)
			if err != nil {
				fmt.Println("ConnectServer 解析数据失败", err)
				continue
			}

			if sse.IP == ips {
				// TODO 发送心跳
				// fmt.Println("收到心跳消息")
				if sse.Heartbeat {
					err = heartbeat()
					if err != nil {
						fmt.Println("SSE 发送心跳失败", err)
					}
					fmt.Println("ConnectServer 发送心跳")
				} else {
					err = start()
					if err != nil {
						fmt.Println("SSE Agent探活失败", err)
					}
					fmt.Println("ConnectServer Agent探活")
				}
			}
		}
		if err == io.EOF {
			break
		}
	}
	return nil
}
