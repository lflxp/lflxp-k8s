/*
Copyright © 2021 NAME HERE <EMAIL ADDRESS>

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

	http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
package cmd

import (
	"fmt"
	"log/slog"
	"os"
	"path/filepath"
	"strings"

	"github.com/lflxp/lflxp-k8s/core/middlewares/jwt/framework"
	"github.com/lflxp/lflxp-k8s/pkg/csm/model"
	"github.com/lflxp/lflxp-k8s/pkg/helm"
	"github.com/lflxp/lflxp-k8s/utils"

	"github.com/lflxp/lflxp-k8s/core"
	"github.com/lflxp/lflxp-tty/pkg"

	"github.com/spf13/cobra"

	"github.com/spf13/viper"
	"k8s.io/client-go/util/homedir"
)

var (
	cfgFile        string
	isHttps        bool
	enableTLS      bool
	crtPath        string
	keyPath        string
	isProf         bool
	isXsrf         bool
	isAudit        bool
	isPermitWrite  bool
	MaxConnections int64
	isReconnect    bool
	isDebug        bool
	username       string
	password       string
	ttyport        string
	host           string
	lvl            slog.LevelVar
	port           string
)

// rootCmd represents the base command when called without any subcommands
var rootCmd = &cobra.Command{
	Use:   "gorails",
	Short: "A brief description of your application",
	Long: `A longer description that spans multiple lines and likely contains
examples and usage of using your application. For example:

Cobra is a CLI library for Go that empowers applications.
This application is a tool to generate the needed files
to quickly create a Cobra application.`,
	// Uncomment the following line if your bare application
	// has an action associated with it:
	Run: func(cmd *cobra.Command, args []string) {
		if len(args) == 0 {
			args = []string{"bash"}
			isPermitWrite = true
		} else if strings.Contains(strings.Join(args, " "), "hello world") {
			args = []string{"bash"}
			isPermitWrite = true
		}
		// go func() {
		// 	tty := pkg.Tty{
		// 		EnableTLS:      enableTLS,
		// 		CrtPath:        crtPath,
		// 		KeyPath:        keyPath,
		// 		IsProf:         isProf,
		// 		IsXsrf:         isXsrf,
		// 		IsAudit:        isAudit,
		// 		IsPermitWrite:  isPermitWrite,
		// 		MaxConnections: MaxConnections,
		// 		IsReconnect:    isReconnect,
		// 		IsDebug:        isDebug,
		// 		Username:       username,
		// 		Password:       password,
		// 		Port:           ttyport,
		// 		Host:           host,
		// 		Cmds:           args,
		// 	}
		// 	err := tty.Execute()
		// 	if err != nil {
		// 		panic(err)
		// 	}
		// }()

		tty := pkg.Tty{
			EnableTLS:      enableTLS,
			CrtPath:        crtPath,
			KeyPath:        keyPath,
			IsProf:         isProf,
			IsXsrf:         true,
			IsAudit:        isAudit,
			IsPermitWrite:  isPermitWrite,
			MaxConnections: MaxConnections,
			IsReconnect:    true,
			IsDebug:        isDebug,
			Username:       username,
			Password:       password,
			Port:           ttyport,
			Host:           host,
			Cmds:           args,
			Url:            "/tty",
		}

		core.Run(isHttps, port, &tty)
	},
}

// @title Gin Template
// @version 1.0
// @description Gin API 接口模板服务

// @contact.name API Support
// @contact.url http://www.swagger.io/support

// @license.name Apache 2.0
// @license.url http://www.apache.org/licenses/LICENSE-2.0.html

// @host 127.0.0.1:8888
// @BasePath

// @securityDefinitions.apikey ApiKeyAuth
// @in header
// @name Authorization
func Execute() {
	cobra.CheckErr(rootCmd.Execute())
}

func init() {
	cobra.OnInitialize(initConfig)

	// Here you will define your flags and configuration settings.
	// Cobra supports persistent flags, which, if defined here,
	// will be global for your application.

	rootCmd.PersistentFlags().StringVar(&cfgFile, "config", "", "config file (default is $HOME/lflxp-k8s.yaml)")

	// Cobra also supports local flags, which will only run
	// when this action is called directly.
	rootCmd.Flags().BoolP("toggle", "T", false, "Help message for toggle")
	rootCmd.Flags().BoolVarP(&isHttps, "https", "s", false, "是否开启https")
	rootCmd.Flags().BoolVarP(&framework.IsRancherLogin, "rancher", "r", false, "是否切换为Rancher登录")
	rootCmd.Flags().StringVarP(&username, "username", "u", "", "BasicAuth 用户名")
	rootCmd.Flags().StringVarP(&password, "password", "p", "", "BasicAuth 密码")
	rootCmd.Flags().StringVarP(&host, "host", "H", "0.0.0.0", "http bind host")
	rootCmd.Flags().StringVarP(&ttyport, "ttyport", "P", "19999", "tty http bind port")
	rootCmd.Flags().StringVarP(&port, "port", "G", "8002", "server http bind port")
	rootCmd.Flags().BoolVarP(&isDebug, "debug", "d", false, "debug log mode")
	// rootCmd.Flags().BoolVarP(&isReconnect, "reconnect", "R", false, "是否自动重连")
	rootCmd.Flags().BoolVarP(&isPermitWrite, "write", "w", false, "是否开启写入模式")
	rootCmd.Flags().BoolVarP(&isAudit, "audit", "a", false, "是否开启审计")
	// rootCmd.Flags().BoolVarP(&isXsrf, "xsrf", "x", true, "是否开启xsrf,默认开启")
	rootCmd.Flags().BoolVarP(&isProf, "prof", "f", false, "是否开启pprof性能分析")
	rootCmd.Flags().BoolVarP(&enableTLS, "tls", "t", false, "是否开启https")
	rootCmd.Flags().StringVarP(&crtPath, "crt", "c", "./server.crt", "*.crt文件路径")
	rootCmd.Flags().StringVarP(&keyPath, "key", "k", "./server.key", "*.key文件路径")
	rootCmd.Flags().Int64VarP(&MaxConnections, "maxconnect", "m", 0, "最大连接数")
	rootCmd.Flags().IntVarP(&model.ConfigSync, "configSync", "X", 10, "配置同步时间 单位秒")
	rootCmd.Flags().IntVarP(&model.CmdSync, "cmdSync", "Y", 30, "命令同步 单位秒")
	rootCmd.Flags().IntVarP(&model.HeartSync, "heartSync", "Z", 60, "心跳同步 单位秒")
	rootCmd.Flags().IntVarP(&model.ServerSync, "serverSync", "V", 60, "服务端服务探活，单位秒")
	rootCmd.Flags().StringVarP(&model.Path, "path", "W", "config.yaml", "配置文件路径 单位秒")
	rootCmd.Flags().StringVarP(&helm.HelmHome, "helmhome", "O", "/home/lixueping/.cache/helm", "helm home path")
	rootCmd.Flags().StringVarP(&helm.HelmKubeConfig, "kubeconfig", "K", "/home/lixueping/.kube/config", "kubeconfig path")
	rootCmd.Flags().StringVarP(&helm.HelmBin, "helmbin", "D", "/usr/local/bin/helm", "helm bin path")

	model.Host = fmt.Sprintf("localhost:%s", port)
	model.Https = isHttps
	model.IsServer = true
}

// initConfig reads in config file and ENV variables if set.
func initConfig() {
	if cfgFile != "" {
		// Use config file from the flag.
		viper.SetConfigFile(cfgFile)
	} else {
		// Find home directory.
		home := homedir.HomeDir()
		target := filepath.Join(home, ".lflxp-k8s.yaml")
		if !utils.IsPathExists(target) {
			file, err := os.OpenFile(target, os.O_CREATE|os.O_WRONLY, 0666)
			if err != nil {
				panic(err)
			}
			defer file.Close()

			_, err = file.WriteString(`account:
	admin:
		claim: '[{"id":1,"auth":"admin","type":"nav","value":"dashboard"}]'
		password: admin
admin: true
app:
	- test
global:
	Name: demo 
	Pkg: demo
host: 0.0.0.0
log:
	level: info 
meili:
	apikey: masterKey
	enable: false
	host: http://127.0.0.1:7700
port: 8002
snakemapper: admin_
auth:
	dev: false 
	url: http://192.168.64.2:30137
proxy:
#   grafana: http://grafana.monitoring:3000
	grafana: http://grafana2.ks.x
#   prometheus: http://prometheus-k8s.monitoring:9090
	prometheus: http://prometheus.ks.x`)
			if err != nil {
				panic(err)
			}

		}

		// Search config in home directory with name ".gin-template" (without extension).
		viper.AddConfigPath(home)
		viper.SetConfigType("yaml")
		viper.SetConfigName(".lflxp-k8s")
	}

	viper.AutomaticEnv() // read in environment variables that match

	// If a config file is found, read it in.
	if err := viper.ReadInConfig(); err != nil {
		// fmt.Fprintln(os.Stderr, "Using config file:", viper.ConfigFileUsed())
		slog.Error(err.Error())
	}

	initLog()
}

func initLog() {
	// 日志配置
	lvl.Set(slog.LevelInfo)
	opts := slog.HandlerOptions{
		AddSource: true,
		Level:     &lvl,
	}

	// slog.SetDefault(slog.New((slog.NewJSONHandler(os.Stdout, &opts))))
	slog.SetDefault(slog.New((slog.NewTextHandler(os.Stdout, &opts))))
}
