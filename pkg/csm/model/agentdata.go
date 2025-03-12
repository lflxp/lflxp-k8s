package model

// Record map[IP]map[类型]记录
var AgentData map[string]map[string]Record

func GetAgentData() map[string]map[string]Record {
	if AgentData == nil {
		AgentData = make(map[string]map[string]Record)
	}
	return AgentData
}
