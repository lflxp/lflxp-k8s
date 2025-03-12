package model

var (
	Port       string
	Https      bool
	Host       string
	ConfigSync int    // 配置同步
	CmdSync    int    // 命令同步
	HeartSync  int    // 心跳同步
	ServerSync int    // 服务探活
	Path       string // 配置文件路径
	IsServer   bool
)

const (
	ConfigUrl    = "/alive/api/config"
	HeartbeatUrl = "/alive/api/heartbeat"
	SseUrl       = "/alive/api/sse"
	RunTimes     = 10 // 并发执行次数
	Demo         = `---
kind: Config
agent:
  - name: demo
    commands:
      - name: cmddemo 
        command: wmic.exe process get Commandline
        regex: ".*-jar agent.jar.*"
    http:
      - name: httpdemo
        url: http://localhost:8002/alive/api/serverdemo
        jsonpath: "data.store.book.1.category"
        regex: "fiction"
        method: GET
    tcp:
      - name: tcpdemo
        host: localhost
        port: 8080
        protocol: tcp
        timeout: 1000
webhook: http://localhost:8002/alive/api/webhooktest
thirdparty:
  - name: sonarqube
    tcp:
      - name: servercheck
        host: www.baidu.com
        port: 32385
        protocol: tcp
        timeout: 1000`
	ServerDemo = "/alive/api/serverdemo"
	AgentPost  = "/alive/api/agent"
	TimeLayout = "2006-01-02 15:04:05"
)
