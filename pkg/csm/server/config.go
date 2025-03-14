package server

import (
	"os"

	"github.com/lflxp/lflxp-k8s/pkg/csm/model"
	"github.com/lflxp/lflxp-k8s/utils"

	"github.com/gin-gonic/gin"
	"gopkg.in/yaml.v3"
)

// @Summary  获取配置
// @Description 获取配置
// @Tags Config
// @Success 200 {string} string "success"
// @Security ApiKeyAuth
// @Router /api/alive/config [get]
func Data(c *gin.Context) {
	utils.SendSuccessMessage(c, 200, model.GetConfig())
}

// @Summary  获取原始配置
// @Description 获取原始配置
// @Tags Config
// @Success 200 {string} string "success"
// @Security ApiKeyAuth
// @Router /api/alive/config/raw [get]
func ConfigRaw(c *gin.Context) {
	rs, err := yaml.Marshal(model.GetConfig())
	if err != nil {
		utils.SendErrorMessage(c, 500, "ServerError", err.Error())
		return
	}
	// utils.SendSuccessMessage(c, 200, string(rs))
	c.String(200, string(rs))
}

// @Summary  修改配置
// @Description 修改配置
// @Tags Config
// @Param request body string true "修改配置"
// @Success 200 {string} string "success"
// @Security ApiKeyAuth
// @Router /api/alive/config/raw [put]
func ConfigPut(c *gin.Context) {
	// 读取request body上传的string文本
	body, err := c.GetRawData()
	if err != nil {
		utils.SendErrorMessage(c, 400, "BadRequest", err.Error())
		return
	}

	var data model.Data
	if err := yaml.Unmarshal(body, &data); err != nil {
		utils.SendErrorMessage(c, 400, "BadRequest", err.Error())
		return
	}

	// 更新配置
	model.SetConfig(&data)

	// 写入配置文件
	file, err := os.OpenFile(model.Path, os.O_WRONLY|os.O_TRUNC|os.O_CREATE, 0644)
	if err != nil {
		utils.SendErrorMessage(c, 500, "ServerError", err.Error())
		return
	}

	defer file.Close()

	_, err = file.Write(body)
	if err != nil {
		utils.SendErrorMessage(c, 500, "ServerError", err.Error())
		return
	}

	utils.SendSuccessMessage(c, 200, "success")
}
