package admin

import (
	"github.com/lflxp/lflxp-k8s/core/middlewares/template"
)

func init() {
	// vpn := Vpn{}s
	template.Register(new(Tenant))
}

type Tenant struct {
	Id       int64  `xorm:"id pk not null autoincr" name:"id"`
	Uuid     string `xorm:"uuid" name:"uuid" verbose_name:"UUID" list:"true" search:"true"`
	Name     string `xorm:"name" name:"name" verbose_name:"名称" list:"true" search:"true"`
	ShowName string `xorm:"showname" name:"password" verbose_name:"显示名称" colType:"password" list:"true" search:"true"`
	Admin    string `xorm:"admin" name:"admin" verbose_name:"租户管理员" list:"true" search:"true"`
	Cluster  string `xorm:"cluster" name:"cluster" verbose_name:"集群" list:"true" search:"true"`
	Status   string `xorm:"status" name:"status" verbose_name:"状态" list:"true" search:"false" colType:"radio" radio:"有效|1,无效|0"`
	Created  string `json:"created" xorm:"created"`
	Updated  string `json:"updated" xorm:"updated"`
}
