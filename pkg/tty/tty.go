package tty

import (
	"github.com/gin-gonic/gin"
	"github.com/lflxp/lflxp-tty/pkg"
)

func RegisterTTY(router *gin.Engine, tty *pkg.Tty) {
	// tty_data := pkg.Tty{
	// 	IsPermitWrite:  true,
	// 	MaxConnections: 10,
	// 	IsReconnect:    true,
	// 	Cmds:           []string{"sh"},
	// 	IsXsrf:         true,
	// 	Url:            "/tty",
	// }

	pkg.RegisterTty(router, tty)
}
