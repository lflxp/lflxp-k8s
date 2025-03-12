package model

import (
	"encoding/json"
	"fmt"
	"os"
	"time"

	"github.com/lflxp/lflxp-k8s/utils"

	"gopkg.in/yaml.v2"
)

var (
	serverConfig *Data
	ipAddress    string
)

func init() {
	go func() {
		cmdTicker := time.NewTicker(10 * time.Second)
		defer cmdTicker.Stop()

		for range cmdTicker.C {
			if IsServer {
				err := getConfigByFile()
				if err != nil {
					fmt.Println("Server 获取配置失败", err)
				}
			} else {
				err := refreshConfig()
				if err != nil {
					fmt.Println("Agent 获取配置失败", err)
				}
			}
		}
	}()
}

func GetLocalIP() string {
	if ipAddress != "" {
		return ipAddress
	}

	ip, err := utils.GetHostIP()
	if err != nil {
		fmt.Println("获取本地IP失败", err)
		return ""
	}

	ipAddress = ip
	return ip
}

func GetConfig() *Data {
	if serverConfig == nil {
		if IsServer {
			err := getConfigByFile()
			if err != nil {
				fmt.Println("Server 获取配置失败", err)
			}
		} else {
			err := refreshConfig()
			if err != nil {
				fmt.Println("Agent 获取配置失败", err)
			}
		}
	}
	return serverConfig
}

func refreshConfig() error {
	data, err := SyncConfig()
	if err != nil {
		fmt.Println("获取配置失败", err)
		return err
	}

	serverConfig = &data.Data
	return nil
}

func getConfigByFile() error {
	var config Data
	file, err := os.Open(Path)
	if err != nil {
		fmt.Printf("打开配置文件 %s 失败: %s\n", Path, err)
		file, err = os.Create(Path)
		if err != nil {
			fmt.Printf("创建配置文件 %s 失败: %s\n", Path, err)
			return err
		}

		_, err = file.Write([]byte(Demo))
		if err != nil {
			fmt.Printf("写入配置文件 %s 失败: %s\n", Path, err)
			return err
		}
	}
	defer file.Close()

	decoder := yaml.NewDecoder(file)

	err = decoder.Decode(&config)
	if err != nil {
		fmt.Printf("解析配置文件 %s 失败: %s\n", Path, err)
		return err
	}
	SetConfig(&config)
	return nil
}

// 同步配置
func SyncConfig() (Result, error) {
	var data Result
	// 获取配置
	code := 0
	body := ""

	var url string
	if Https {
		url = fmt.Sprintf("https://%s%s", Host, ConfigUrl)
	} else {
		url = fmt.Sprintf("http://%s%s", Host, ConfigUrl)
	}

	err := utils.NewGoutClient().
		GET(url).
		BindBody(&body).
		Code(&code).
		Do()

	if err != nil {
		fmt.Println("同步配置失败", url, err)
		return data, err
	}

	err = json.Unmarshal([]byte(body), &data)
	if err != nil {
		fmt.Println("解析配置失败", err)
		return data, err
	}

	return data, nil
}

func SetConfig(data *Data) {
	serverConfig = data
}
