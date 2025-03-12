package model

type SSE struct {
	IP        string `json:"ip"`
	Heartbeat bool   `json:"heartbeat"`
	T         string `json:"t"`
}
