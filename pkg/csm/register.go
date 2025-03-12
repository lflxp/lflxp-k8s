package csm

import (
	"encoding/json"
	"fmt"
	"sort"
	"time"

	"github.com/lflxp/lflxp-k8s/pkg/csm/model"
	"github.com/lflxp/lflxp-k8s/pkg/csm/server"
	"github.com/lflxp/lflxp-k8s/pkg/csm/service"
	"github.com/lflxp/lflxp-k8s/utils"

	"github.com/gin-gonic/gin"
)

var (
	AgentRecord map[string]map[string]model.Record
	// Sse客户端连接管理
	sseClients = make(map[string]chan model.SSE)
)

func RegisterCSM(router *gin.Engine) {
	// 服务端探活
	serverTicker := time.NewTicker(time.Duration(model.ServerSync) * time.Second)
	defer serverTicker.Stop()

	service.ThirdPartyCheck()

	go func() {
		for range serverTicker.C {
			service.ThirdPartyCheck()
		}
	}()

	group := router.Group("/alive/api")
	{
		group.GET("/sse", Sse)
		group.POST("/sse", SseSend)
		group.GET("/config", server.Data)
		group.GET("/config/raw", server.ConfigRaw)
		group.PUT("/config/raw", server.ConfigPut)
		group.GET("/thirdparty", ThirdParty)
		group.POST("/heartbeat", Heartbeat)
		group.POST("/agent", Record)
		group.GET("/agent", Agent)
		group.GET("/agent/:name", AgentByName)
		group.GET("/agent/type/:name", AgentByType)
		group.GET("/hbcheck", HeartbeatCheck)
		group.GET("/hbcheck/:name", HeartbeatByName)
		group.POST("/webhooktest", func(c *gin.Context) {
			utils.SendSuccessMessage(c, 200, "success")
		})
		group.GET("/serverdemo", func(c *gin.Context) {
			utils.SendSuccessMessage(c, 200, gin.H{
				"header":  c.Request.Header,
				"message": "serverdemo",
				"data": []string{
					"1", "2", "3",
				},
				"code": 200,
				"store": map[string]interface{}{
					"book": []map[string]interface{}{
						{
							"category": "reference",
							"author":   "Nigel Rees",
							"title":    "Sayings of the Century",
							"price":    8.95,
						},
						{
							"category": "fiction",
							"author":   "Evelyn Waugh",
							"title":    "Sword of Honour",
							"price":    12.99,
						},
						{
							"category": "fiction",
							"author":   "Herman Melville",
							"title":    "Moby Dick",
							"isbn":     "0-553-21311-3",
							"price":    8.99,
						},
						{
							"category": "fiction",
							"author":   "J. R. R. Tolkien",
							"title":    "The Lord of the Rings",
							"isbn":     "0-395-19395-8",
							"price":    22.99,
						},
					},
					"bicycle": map[string]interface{}{
						"color": "red",
						"price": 19.95,
					},
				},
				"expensive": 10,
			})
		})
	}
}

func Ping(c *gin.Context) {
	c.JSON(200, gin.H{
		"message": "pong",
	})
}

// 内存缓存
// map[主机名]map[命令名]记录
var RecordList map[string]map[string]model.Record

// @Summary  Agent数据下发
// @Description Agent数据下发
// @Tags Sse
// @Success 200 {string} string "success"
// @Security ApiKeyAuth
// @Router /alive/api/sse [get]
func Sse(c *gin.Context) {
	// 创建一个新的SSE通道

	client := make(chan model.SSE)
	sseClients[c.ClientIP()] = client

	c.Header("Content-Type", "text/event-stream")
	c.Header("Cache-Control", "no-cache")
	c.Header("Connection", "keep-alive")
	c.Header("Access-Control-Allow-Origin", "*")

	// 确保连接关闭时清理资源
	defer func() {
		close(client)
		delete(sseClients, c.ClientIP())
	}()

	// 持续监听通道，向客户端发送数据
	for {
		msg, ok := <-client
		if !ok {
			fmt.Println("client closed")
			delete(sseClients, c.ClientIP())
			break
		}

		fmt.Printf("%s 发送拨测信号到客户端 %s \n", time.Now().Format("2006-01-02 15:04:05"), c.ClientIP())
		info, err := json.Marshal(msg)
		if err != nil {
			fmt.Printf("json marshal failed, err:%v\n", err)
			continue
		}

		info = append(info, []byte("\n\n")...)
		_, err = c.Writer.Write(info)
		if err != nil {
			return
		}
		c.Writer.Flush()
	}
}

// @Summary  Agent数据下发
// @Description Agent数据下发
// @Tags Sse
// @Param request body model.SSE true "新增配置"
// @Success 200 {string} string "success"
// @Security ApiKeyAuth
// @Router /alive/api/sse [post]
func SseSend(c *gin.Context) {
	var data model.SSE
	if err := c.ShouldBindJSON(&data); err != nil {
		utils.SendErrorMessage(c, 400, "BadRequest", err.Error())
		return
	}

	if data.IP == "" {
		utils.SendErrorMessage(c, 400, "BadRequest", "ip is required")
		return
	}

	data.T = time.Now().Format("2006-01-02 15:04:05")

	// 向所有客户端发送消息
	if target, ok := sseClients[data.IP]; ok {
		target <- data
	} else {
		utils.SendErrorMessage(c, 404, "NotFound", fmt.Sprintf("ip %s not found", data.IP))
		return
	}

	utils.SendSuccessMessage(c, 200, "success")
}

// @Summary  记录上报接口
// @Description 记录上报接口
// @Tags Agent
// @Param type path string true "探活类型"
// @Param request body map[string]model.Record true "新增配置"
// @Success 200 {string} string "success"
// @Security ApiKeyAuth
// @Router /alive/api/agent [post]
func Record(c *gin.Context) {
	if AgentRecord == nil {
		AgentRecord = make(map[string]map[string]model.Record)
	}

	var data map[string]model.Record
	if err := c.ShouldBindJSON(&data); err != nil {
		utils.SendErrorMessage(c, 400, "BadRequest", err.Error())
		return
	}

	now := time.Now()
	for k, v := range data {
		v.Time = now
		data[k] = v
	}
	AgentRecord[c.ClientIP()] = data

	utils.SendSuccessMessage(c, 200, "success")
}

// @Summary  查询记录状态
// @Description 查询记录状态
// @Tags Agent
// @Param fast query string false "是否快速查询 默认 false || true || quick"
// @Success 200 {string} string "success"
// @Security ApiKeyAuth
// @Router /alive/api/agent [get]
func Agent(c *gin.Context) {
	fast := c.Query("fast")
	if fast == "quick" {
		result := map[string]map[string]interface{}{}
		now := time.Now()
		for k, v := range AgentRecord {
			result[k] = map[string]interface{}{}
			for kk, vv := range v {
				tmp := map[string]interface{}{
					"status":  vv.Status,
					"history": vv.History,
					"host":    vv.Host,
					"ip":      k,
				}

				if vv.Status {
					if now.Sub(vv.Time) > time.Duration(model.CmdSync+15)*time.Second {
						tmp["status"] = false
					}
				}
				result[k][kk] = tmp
			}
		}
		utils.SendSuccessMessage(c, 200, result)
		return
	} else if fast == "true" {
		now := time.Now()
		rs := []map[string]interface{}{}
		// 根据工具查看记录
		for ip, value := range AgentRecord {
			for k, v := range value {
				tmp := map[string]interface{}{
					"ip":      ip,
					"status":  v.Status,
					"history": v.History,
					"last":    v.Time.Format("2006-01-02 15:04:05"),
					"host":    v.Host,
					"name":    k,
				}

				if v.Status {
					if now.Sub(v.Time) > time.Duration(model.CmdSync+15)*time.Second {
						tmp["status"] = false
					}
				}
				rs = append(rs, tmp)
			}
		}

		// 排序
		sort.Slice(rs, func(i, j int) bool {
			return fmt.Sprintf("%s%s", rs[i]["ip"], rs[i]["name"]) < fmt.Sprintf("%s%s", rs[j]["ip"], rs[j]["name"])
		})

		utils.SendSuccessMessage(c, 200, rs)
		return
	}
	utils.SendSuccessMessage(c, 200, AgentRecord)
}

// @Summary  查询记录状态
// @Description 查询记录状态
// @Tags Agent
// @Param name path string true "探活类型"
// @Param fast query string false "是否快速查询 默认 false || true"
// @Success 200 {string} string "success"
// @Security ApiKeyAuth
// @Router /alive/api/agent/{name} [get]
func AgentByName(c *gin.Context) {
	name := c.Param("name")
	if name == "" {
		utils.SendErrorMessage(c, 400, "BadRequest", "name is required")
		return
	}

	if value, ok := AgentRecord[name]; ok {
		fast := c.Query("fast")
		if fast == "true" {
			result := map[string]interface{}{}
			for k, v := range value {
				result[k] = map[string]interface{}{
					"status":  v.Status,
					"history": v.History,
					"host":    v.Host,
				}
			}

			utils.SendSuccessMessage(c, 200, result)
			return
		}
		utils.SendSuccessMessage(c, 200, value)
	} else {
		utils.SendErrorMessage(c, 404, "NotFound", "not found")
	}
}

// @Summary  根据工具查看记录
// @Description 根据工具查看记录
// @Tags Agent
// @Param name path string true "被探活工具"
// @Success 200 {string} string "success"
// @Security ApiKeyAuth
// @Router /alive/api/agent/type/{name} [get]
func AgentByType(c *gin.Context) {
	name := c.Param("name")
	if name == "" {
		utils.SendErrorMessage(c, 400, "BadRequest", "name is required")
		return
	}

	rs := []map[string]interface{}{}
	// 根据工具查看记录
	now := time.Now()
	for ip, value := range AgentRecord {
		if v, ok := value[name]; ok {
			tmp := map[string]interface{}{
				"ip":      ip,
				"status":  v.Status,
				"history": v.History,
				"last":    v.Time.Format("2006-01-02 15:04:05"),
				"host":    v.Host,
			}

			if v.Status {
				if now.Sub(v.Time) > time.Duration(model.CmdSync+15)*time.Second {
					fmt.Printf("超时 原始数据%s timeNOw %s sub[%d] %v\n", v.Time.Format("2006-01-02 15:04:05"), now.Format("2006-01-02 15:04:05"), model.CmdSync+5, now.Sub(v.Time))
					tmp["status"] = false
				}
			}
			rs = append(rs, tmp)
		}
	}

	// 排序
	sort.Slice(rs, func(i, j int) bool {
		return rs[i]["ip"].(string) < rs[j]["ip"].(string)
	})

	utils.SendSuccessMessage(c, 200, rs)
}

// 心跳缓存
var HeartbeatList map[string]model.Heartbeat

// @Summary  上报Agent心跳
// @Description 上报Agent心跳
// @Tags Heartbeat
// @Param request body model.Heartbeat true "新增配置"
// @Success 200 {string} string "success"
// @Security ApiKeyAuth
// @Router /alive/api/heartbeat [post]
func Heartbeat(c *gin.Context) {
	if HeartbeatList == nil {
		HeartbeatList = make(map[string]model.Heartbeat)
	}

	var data model.Heartbeat
	if err := c.ShouldBindJSON(&data); err != nil {
		utils.SendErrorMessage(c, 400, "BadRequest", err.Error())
		return
	}

	data.Host = c.ClientIP()
	data.Time = time.Now()

	HeartbeatList[c.ClientIP()] = data
	utils.SendSuccessMessage(c, 200, "success")
}

// @Summary  服务端探活查询接口
// @Description 服务端探活查询接口
// @Tags ThirdParty
// @Param fast query string false "是否快速查询 默认 false || true"
// @Success 200 {string} string "success"
// @Security ApiKeyAuth
// @Router /alive/api/thirdparty [get]
func ThirdParty(c *gin.Context) {
	fast := c.Query("fast")
	if fast == "true" {
		result := map[string]interface{}{}
		for k, v := range service.ServerCheckData {
			result[k] = v.Status
		}
		utils.SendSuccessMessage(c, 200, result)
		return
	}
	utils.SendSuccessMessage(c, 200, service.ServerCheckData)
}

// @Summary  心跳检查结果
// @Description 心跳检查结果
// @Tags Heartbeat
// @Success 200 {string} string "success"
// @Security ApiKeyAuth
// @Router /alive/api/hbcheck [get]
func HeartbeatCheck(c *gin.Context) {
	if HeartbeatList == nil {
		HeartbeatList = make(map[string]model.Heartbeat)
		c.JSON(200, nil)
		return
	}

	now := time.Now()

	result := []model.Heartbeat{}
	for _, v := range HeartbeatList {
		if v.Status {
			if now.Sub(v.Time) > time.Duration(model.HeartSync+15)*time.Second {
				v.Status = false
				v.Message = fmt.Sprintf("心跳上报超时 %d", model.HeartSync)
			} else {
				v.Status = true
			}
		}

		v.Last = v.Time.Format("2006-01-02 15:04:05")
		result = append(result, v)
	}

	// 排序
	sort.Slice(result, func(i, j int) bool {
		return result[i].Host < result[j].Host
	})
	utils.SendSuccessMessage(c, 200, result)
}

// @Summary  心跳检查结果
// @Description 心跳检查结果
// @Tags Heartbeat
// @Param name path string true "主机名"
// @Success 200 {string} string "success"
// @Security ApiKeyAuth
// @Router /alive/api/hbcheck/{name} [get]
func HeartbeatByName(c *gin.Context) {
	if HeartbeatList == nil {
		HeartbeatList = make(map[string]model.Heartbeat)
		c.JSON(200, nil)
		return
	}

	name := c.Param("name")
	if name == "" {
		c.JSON(400, gin.H{"error": "name is required"})
		return
	}

	now := time.Now()

	if value, ok := HeartbeatList[name]; ok {
		if value.Status {
			if now.Sub(value.Time) > time.Duration(model.HeartSync+15)*time.Second {
				value.Status = false
				value.Message = fmt.Sprintf("心跳上报超时 %d", model.HeartSync)
			} else {
				value.Status = true
			}
		}

		value.Last = value.Time.Format("2006-01-02 15:04:05")
		utils.SendSuccessMessage(c, 200, value)
	} else {
		utils.SendErrorMessage(c, 404, "NotFound", "not found")
	}
}
