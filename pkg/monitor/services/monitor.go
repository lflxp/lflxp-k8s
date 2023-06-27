package services

import (
	"encoding/json"
	"fmt"

	"github.com/lflxp/lflxp-k8s/utils"

	log "github.com/go-eden/slf4go"
	"github.com/guonaihong/gout"
	"github.com/spf13/viper"
)

// const PROMETHEUS_SERVICES = "prometheus-k8s.monitoring:9090"
// http://192.168.99.115:8002/monitor/prometheus/api/v1/query?query=up
func GetPrometheus(path, query string) (*map[string]interface{}, int, error) {
	prometheus := viper.GetString("proxy.prometheus")

	var resp *map[string]interface{}
	body := ""
	code := 0

	url := fmt.Sprintf("%s%s?%s", prometheus, path, query)
	log.Infof("url %s", url)
	err := utils.NewGoutClient().
		GET(url).
		Debug(true).
		BindBody(&body).
		SetHeader(gout.H{
			"Accept": "application/json",
			// "Accept-Encoding": "gzip, deflate",
			// "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
			// "Connection":      "Keep-Alive",
		}).
		Code(&code).
		Do()

	if err != nil {
		log.Error(err)
		return resp, code, err
	}

	if code < 400 {
		err = json.Unmarshal([]byte(body), &resp)
		if err != nil {
			log.Error(err)
			return resp, code, fmt.Errorf("json解析错误: %s", err.Error())
		}

		// log.Debugf("resp %s", resp)
		return resp, code, nil
	} else {
		return resp, code, fmt.Errorf("code %d, error: %s", code, string(body))
	}
}
