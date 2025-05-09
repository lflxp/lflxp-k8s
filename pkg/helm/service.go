package helm

import (
	"fmt"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/lflxp/lflxp-k8s/utils"
)

// @Summary  获取repo列表
// @Description 获取repo列表
// @Tags Helm
// @Success 200 {string} string "success"
// @Security ApiKeyAuth
// @Router /api/helm/repo/list [get]
func helmRepoList(c *gin.Context) {
	data := NewHelm()
	info, err := data.RepoList()
	if err != nil {
		utils.SendErrorMessage(c, 500, "helm repo list error", err.Error())
		return
	}
	result := []map[string]string{}

	// fmt.Println(string(info))

	for index, line := range strings.Split(string(info), "\n") {
		if len(line) == 0 || len(line) < 3 {
			continue
		}
		tmp := strings.Split(line, "|")
		rs := make(map[string]string)
		rs["id"] = fmt.Sprintf("%d", index)
		rs["name"] = strings.TrimSpace(tmp[0])
		rs["url"] = strings.TrimSpace(tmp[1])
		result = append(result, rs)
	}
	utils.SendSuccessMessage(c, 200, result)
}

// @Summary  获取repo软件列表
// @Description 获取repo软件列表
// @Tags Helm
// @Param name path string true "repo name"
// @Param fast query string false "最新版本"
// @Success 200 {string} string "success"
// @Security ApiKeyAuth
// @Router /api/helm/release/list/{name} [get]
func helmReleaseList(c *gin.Context) {
	name := c.Param("name")
	if name == "" {
		utils.SendErrorMessage(c, 400, "BadRequest", "repo name is empty")
		return
	}
	fast := c.Query("fast")
	data := NewHelm()
	info, err := data.RepoListLocal(name)
	if err != nil {
		utils.SendErrorMessage(c, 500, "helm repo list error", err.Error())
		return
	}

	if fast == "" {
		utils.SendSuccessMessage(c, 200, info)
		return
	}

	for k, v := range info.Entries {
		info.Entries[k] = []Entry{v[0]}
	}

	utils.SendSuccessMessage(c, 200, info)
}

// @Summary  获取安装列表
// @Description 获取安装列表
// @Tags Helm
// @Success 200 {string} string "success"
// @Security ApiKeyAuth
// @Router /api/helm/install/list [get]
func helmInstallList(c *gin.Context) {
	data, err := GetReleaseAllParse()
	if err != nil {
		utils.SendErrorMessage(c, 500, "helm release list error", err.Error())
		return
	}
	utils.SendSuccessMessage(c, 200, data)
}
