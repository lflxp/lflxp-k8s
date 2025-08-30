/*
Copyright © 2025 NAME HERE <EMAIL ADDRESS>
*/
package cmd

import (
	"github.com/lflxp/lflxp-k8s/pkg/csm/model"
	"github.com/spf13/cobra"
)

// agentCmd represents the agent command
var agentCmd = &cobra.Command{
	Use:   "agent",
	Short: "A brief description of your command",
	Long: `A longer description that spans multiple lines and likely contains examples
and usage of using your command. For example:

Cobra is a CLI library for Go that empowers applications.
This application is a tool to generate the needed files
to quickly create a Cobra application.`,
	Run: func(cmd *cobra.Command, args []string) {
		// agent.Server()
	},
}

func init() {
	rootCmd.AddCommand(agentCmd)

	// Here you will define your flags and configuration settings.

	// Cobra supports Persistent Flags which will work for this command
	// and all subcommands, e.g.:
	// agentCmd.PersistentFlags().String("foo", "", "A help for foo")

	// Cobra supports local flags which will only run when this command
	// is called directly, e.g.:
	// agentCmd.Flags().BoolP("toggle", "t", false, "Help message for toggle")
	agentCmd.Flags().StringVarP(&model.Host, "host", "H", "localhost:9888", "服务端地址")
	agentCmd.Flags().IntVarP(&model.ConfigSync, "config-sync", "c", 60, "配置同步时间")
	agentCmd.Flags().IntVarP(&model.HeartSync, "heart-sync", "k", 60, "心跳同步时间")
	agentCmd.Flags().IntVarP(&model.CmdSync, "cmd-sync", "m", 60, "命令同步时间")
	agentCmd.Flags().StringVarP(&model.Path, "path", "p", "/tmp", "Agent路径")
	agentCmd.Flags().BoolVarP(&model.Https, "https", "s", false, "是否启用https")
	agentCmd.Flags().BoolVarP(&model.IsServer, "isserver", "S", false, "是否运行服务端")
	agentCmd.Flags().StringVarP(&model.Port, "port", "P", "9888", "Agent端口")
	agentCmd.Flags().IntVarP(&model.ServerSync, "server-sync", "j", 60, "服务端同步时间")
}
