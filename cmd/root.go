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
	"os"
	"strings"

	"github.com/lflxp/lflxp-k8s/core/middlewares/jwt/framework"

	log "github.com/go-eden/slf4go"

	"github.com/lflxp/lflxp-k8s/core"

	"github.com/spf13/cobra"

	"github.com/lflxp/lflxp-tty/pkg"
	"github.com/spf13/viper"
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
	port           string
	host           string
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
		go func() {
			tty := pkg.Tty{
				EnableTLS:      enableTLS,
				CrtPath:        crtPath,
				KeyPath:        keyPath,
				IsProf:         isProf,
				IsXsrf:         isXsrf,
				IsAudit:        isAudit,
				IsPermitWrite:  isPermitWrite,
				MaxConnections: MaxConnections,
				IsReconnect:    isReconnect,
				IsDebug:        isDebug,
				Username:       username,
				Password:       password,
				Port:           port,
				Host:           host,
				Cmds:           args,
			}
			err := tty.Execute()
			if err != nil {
				panic(err)
			}
		}()

		core.Run(isHttps)
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
	rootCmd.Flags().StringVarP(&port, "port", "P", "8001", "http bind port")
	rootCmd.Flags().BoolVarP(&isDebug, "debug", "d", false, "debug log mode")
	rootCmd.Flags().BoolVarP(&isReconnect, "reconnect", "R", false, "是否自动重连")
	rootCmd.Flags().BoolVarP(&isPermitWrite, "write", "w", false, "是否开启写入模式")
	rootCmd.Flags().BoolVarP(&isAudit, "audit", "a", false, "是否开启审计")
	rootCmd.Flags().BoolVarP(&isXsrf, "xsrf", "x", false, "是否开启xsrf,默认开启")
	rootCmd.Flags().BoolVarP(&isProf, "prof", "f", false, "是否开启pprof性能分析")
	rootCmd.Flags().BoolVarP(&enableTLS, "tls", "t", false, "是否开启https")
	rootCmd.Flags().StringVarP(&crtPath, "crt", "c", "./server.crt", "*.crt文件路径")
	rootCmd.Flags().StringVarP(&keyPath, "key", "k", "./server.key", "*.key文件路径")
	rootCmd.Flags().Int64VarP(&MaxConnections, "maxconnect", "m", 0, "最大连接数")
}

// initConfig reads in config file and ENV variables if set.
func initConfig() {
	if cfgFile != "" {
		// Use config file from the flag.
		viper.SetConfigFile(cfgFile)
	} else {
		// Find home directory.
		home, err := os.Getwd()
		if err != nil {
			panic(err)
		}

		// Search config in home directory with name ".gin-template" (without extension).
		viper.AddConfigPath(home)
		viper.SetConfigType("yaml")
		viper.SetConfigName("lflxp-k8s")
	}

	viper.AutomaticEnv() // read in environment variables that match

	// If a config file is found, read it in.
	if err := viper.ReadInConfig(); err == nil {
		fmt.Fprintln(os.Stderr, "Using config file:", viper.ConfigFileUsed())
	}

	initLog()
}

func initLog() {
	level := viper.GetString("log.level")
	if level == "debug" {
		log.SetLevel(log.DebugLevel)
	} else if level == "trace" {
		log.SetLevel(log.TraceLevel)
	} else if level == "info" {
		log.SetLevel(log.InfoLevel)
	} else if level == "warn" {
		log.SetLevel(log.WarnLevel)
	} else if level == "error" {
		log.SetLevel(log.ErrorLevel)
	} else if level == "panic" {
		log.SetLevel(log.PanicLevel)
	}
}
