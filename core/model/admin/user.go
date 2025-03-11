package admin

type User struct {
	Id        int64    `xorm:"id pk not null autoincr" name:"id"`
	Username  string   `xorm:"username" name:"username" verbose_name:"用户名" list:"true" search:"true"`
	Password  string   `xorm:"password" name:"password" verbose_name:"密码" colType:"password" list:"true" search:"true"`
	Name      string   `xorm:"name" name:"name" verbose_name:"名字" list:"true" search:"true"`
	FirstName string   `xorm:"firstname" name:"firstname" verbose_name:"姓氏" list:"true" search:"true"`
	Email     string   `xorm:"email" name:"email" verbose_name:"电子邮件" list:"true" search:"true"`
	IsVaild   string   `xorm:"isvaild" name:"isvaild" verbose_name:"有效" list:"true" search:"false" colType:"radio" radio:"有效|1,无效|0"`
	Status    string   `xorm:"status" name:"status" verbose_name:"状态" list:"true" search:"false" colType:"radio" radio:"有效|1,无效|0"`
	IsAdmin   string   `xorm:"isadmin" name:"isadmin" verbose_name:"超级用户状态" list:"true" search:"false" colType:"radio" radio:"是|1,不是|0"`
	Claims    []Claims `xorm:"claims_id int(11)" colType:"o2m" o2m:"claims|id,auth,type,value" verbose_name:"权限配置" name:"claims_id"`
	Token     string   `xorm:"token" name:"token" verbose_name:"Token"`
	Tenant    `xorm:"tenant_id int(11)" colType:"o2o" o2o:"tenant|id,uuid" verbose_name:"tenant外键" name:"tenant_id"`
	Created   string `json:"created" xorm:"created"`
	Updated   string `json:"updated" xorm:"updated"`
}

// 用户权限表
type Claims struct {
	Id    int64  `xorm:"id pk not null autoincr" name:"id"`
	Auth  string `xorm:"auth varchar(255) unique(only)" name:"auth" verbose_name:"权限" list:"true" search:"true"`               // 对应Auth => Username  eg: admin
	Type  string `json:"type" xorm:"type varchar(255) unique(only)" name:"type" verbose_name:"类型" list:"true" search:"true"`   // 权限类型 eg: nav
	Value string `json:"value" xorm:"value varchar(255) unique(only)" name:"value" verbose_name:"值" list:"true" search:"true"` // 权限指 eg: dashboard
}
