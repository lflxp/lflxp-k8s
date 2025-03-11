package tty

import (
	"github.com/lflxp/lflxp-tty/pkg"
)

func RegisterTTY() {
	args := &pkg.Tty{
		EnableTLS:      false,
		CrtPath:        "",
		KeyPath:        "",
		IsProf:         false,
		IsXsrf:         true,
		IsAudit:        false,
		IsPermitWrite:  true,
		MaxConnections: 10,
		IsReconnect:    true,
		IsDebug:        false,
		Username:       "",
		Password:       "",
		Port:           "19999",
		Host:           "0.0.0.0",
		Cmds:           []string{"bash"},
		Url:            "/",
	}

	err := args.Execute()
	if err != nil {
		panic(err)
	}
	// pkg.RegisterTty(router, args)
}
