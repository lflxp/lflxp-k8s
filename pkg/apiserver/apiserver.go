package apiserver

import (
	"log/slog"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/lflxp/lflxp-k8s/asset"
	"github.com/lflxp/lflxp-k8s/pkg/apiserver/model"
	"github.com/lflxp/tools/httpclient"
	"github.com/lflxp/tools/sdk/clientgo"
)

const (
	GVR_GET_LIST      string = "/gvr/list"
	GVR_OTHER         string = "/gvr"
	GVR_PATCH_OTHER   string = "/gvr/patchstrate"
	GVR_GET_GET       string = "/gvr/get"
	GVR_GET_ALL       string = "/gvr/all"
	GVR_GET_NAMESPACE string = "/gvr/namespace"
	INSTALL_MONITOR   string = "/install/monitor"
)

func RegisterApiserver(router *gin.Engine) {
	keycloakGroup := router.Group("/api")
	{
		keycloakGroup.POST(GVR_GET_GET, gvr_get_get)
		keycloakGroup.POST(GVR_GET_LIST, gvr_get_list)
		keycloakGroup.GET(GVR_GET_ALL, gvr_all)
		keycloakGroup.GET(GVR_GET_NAMESPACE, get_namespaces)
		keycloakGroup.DELETE(GVR_OTHER, gvr_delete_del)
		keycloakGroup.PATCH(GVR_OTHER, gvr_patch_edit)
		keycloakGroup.PATCH(GVR_PATCH_OTHER, gvr_patch_strate)
		keycloakGroup.PUT(GVR_OTHER, gvr_put_update)
		keycloakGroup.POST(GVR_OTHER, gvr_post_add)
		keycloakGroup.GET(INSTALL_MONITOR, install_monitor)
	}
}

func install_monitor(c *gin.Context) {
	err := asset.RunYaml("yaml/monitor/manifests/setup")
	if err != nil {
		httpclient.SendErrorMessage(c, http.StatusInternalServerError, "install yaml/monitor/manifests/setup error", err.Error())
		return
	}
	err = asset.RunYaml("yaml/monitor/manifests")
	if err != nil {
		httpclient.SendErrorMessage(c, http.StatusInternalServerError, "install yaml/monitor/manifests error", err.Error())
		return
	}
	httpclient.SendSuccessMessage(c, 200, "install monitor success")
}

func get_namespaces(c *gin.Context) {
	var data model.CoreV1
	namespacelist, err := data.Namespaces()
	if err != nil {
		httpclient.SendErrorMessage(c, http.StatusBadRequest, "get namespace error", err.Error())
		return
	}
	httpclient.SendSuccessMessage(c, 200, namespacelist)
}

// https://blog.csdn.net/boling_cavalry/article/details/113800054
func gvr_all(c *gin.Context) {
	cli := clientgo.InitClientDiscovery()
	apigroup, apiresourceListSlice, err := cli.ServerGroupsAndResources()
	if err != nil {
		httpclient.SendSuccessMessage(c, 200, gin.H{
			"apigroup":             apigroup,
			"apiresourceListSlice": apiresourceListSlice,
			"error":                err.Error(),
		})
	} else {
		httpclient.SendSuccessMessage(c, 200, gin.H{
			"apigroup":             apigroup,
			"apiresourceListSlice": apiresourceListSlice,
			"error":                nil,
		})
	}

}

// @Summary  本地登录接口
// @Description 后端服务登录接口
// @Tags Auth
// @Security ApiKeyAuth
// @Success 200 {string} string "success"
// @Router /apis/gvr/list [post]
func gvr_get_list(c *gin.Context) {
	var data model.GetGVR
	if err := c.BindJSON(&data); err != nil {
		httpclient.SendErrorMessage(c, http.StatusBadRequest, "not found", err.Error())
		return
	}

	list, err := data.List()
	if err != nil {
		slog.Error("list error: %s", err.Error())
		httpclient.SendErrorMessage(c, 500, "list error", err.Error())
		return
	}

	httpclient.SendSuccessMessage(c, 200, list)
}

func gvr_get_get(c *gin.Context) {
	var data model.GetGVR
	if err := c.BindJSON(&data); err != nil {
		httpclient.SendErrorMessage(c, http.StatusBadRequest, "not found", err.Error())
		return
	}

	list, err := data.Get()
	if err != nil {
		slog.Error("get error: %s", err.Error())
		httpclient.SendErrorMessage(c, 500, "get error", err.Error())
		return
	}

	httpclient.SendSuccessMessage(c, 200, list)
}

func gvr_post_add(c *gin.Context) {
	var data model.GetGVR
	if err := c.BindJSON(&data); err != nil {
		httpclient.SendErrorMessage(c, http.StatusBadRequest, "not found", err.Error())
		return
	}

	list, err := data.Post()
	if err != nil {
		slog.Error("post error: %s", err.Error())
		httpclient.SendErrorMessage(c, 500, "post error", err.Error())
		return
	}

	httpclient.SendSuccessMessage(c, 200, list)
}

func gvr_patch_edit(c *gin.Context) {
	var data model.GetGVR
	if err := c.BindJSON(&data); err != nil {
		httpclient.SendErrorMessage(c, http.StatusBadRequest, "not found", err.Error())
		return
	}

	list, err := data.Patch()
	if err != nil {
		slog.Error("patch error: %s", err.Error())
		httpclient.SendErrorMessage(c, 500, "patcg error", err.Error())
		return
	}

	httpclient.SendSuccessMessage(c, 200, list)
}

func gvr_patch_strate(c *gin.Context) {
	var data model.GetGVR
	if err := c.BindJSON(&data); err != nil {
		httpclient.SendErrorMessage(c, http.StatusBadRequest, "not found", err.Error())
		return
	}

	list, err := data.PatchStrate()
	if err != nil {
		slog.Error("patch error: %s", err.Error())
		httpclient.SendErrorMessage(c, 500, "patcg error", err.Error())
		return
	}

	httpclient.SendSuccessMessage(c, 200, list)
}

func gvr_put_update(c *gin.Context) {
	var data model.GetGVR
	if err := c.BindJSON(&data); err != nil {
		httpclient.SendErrorMessage(c, http.StatusBadRequest, "not found", err.Error())
		return
	}

	list, err := data.Put()
	if err != nil {
		slog.Error("put error: %s", err.Error())
		httpclient.SendErrorMessage(c, 500, "put error", err.Error())
		return
	}

	httpclient.SendSuccessMessage(c, 200, list)
}

func gvr_delete_del(c *gin.Context) {
	var data model.GetGVR
	if err := c.BindJSON(&data); err != nil {
		httpclient.SendErrorMessage(c, http.StatusBadRequest, "not found", err.Error())
		return
	}

	err := data.Delete()
	if err != nil {
		slog.Error("delete error: %s", err.Error())
		httpclient.SendErrorMessage(c, 500, "delete error", err.Error())
		return
	}

	httpclient.SendSuccessMessage(c, 200, "deleted successfully")
}
