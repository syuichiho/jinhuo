package main

import (
	"github.com/gogf/gf/v2/os/gctx"
	_ "github.com/gogf/gf/contrib/drivers/pgsql/v2"
	
	"jinhuo-tech/backend/internal/cmd"
)

func main() {
	cmd.Main.Run(gctx.New())
}