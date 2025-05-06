package apiserver

import (
	"encoding/json"
	"log/slog"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/lflxp/lflxp-k8s/asset"
	"github.com/lflxp/lflxp-k8s/pkg/apiserver/model"
	"github.com/lflxp/lflxp-k8s/utils"
	"github.com/lflxp/tools/sdk/clientgo"
	v1 "k8s.io/api/apps/v1"
	v1c "k8s.io/api/core/v1"
	v1m "k8s.io/apimachinery/pkg/apis/meta/v1"
	v1b "k8s.io/api/batch/v1"
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
		utils.SendErrorMessage(c, http.StatusInternalServerError, "install yaml/monitor/manifests/setup error", err.Error())
		return
	}
	err = asset.RunYaml("yaml/monitor/manifests")
	if err != nil {
		utils.SendErrorMessage(c, http.StatusInternalServerError, "install yaml/monitor/manifests error", err.Error())
		return
	}
	utils.SendSuccessMessage(c, 200, "install monitor success")
}

func get_namespaces(c *gin.Context) {
	var data model.CoreV1
	namespacelist, err := data.Namespaces()
	if err != nil {
		utils.SendErrorMessage(c, http.StatusBadRequest, "get namespace error", err.Error())
		return
	}
	utils.SendSuccessMessage(c, 200, namespacelist)
}

// https://blog.csdn.net/boling_cavalry/article/details/113800054
func gvr_all(c *gin.Context) {
	cli := clientgo.InitClientDiscovery()
	apigroup, apiresourceListSlice, err := cli.ServerGroupsAndResources()
	if err != nil {
		utils.SendSuccessMessage(c, 200, gin.H{
			"apigroup":             apigroup,
			"apiresourceListSlice": apiresourceListSlice,
			"error":                err.Error(),
		})
	} else {
		utils.SendSuccessMessage(c, 200, gin.H{
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
		utils.SendErrorMessage(c, http.StatusBadRequest, "not found", err.Error())
		return
	}

	list, err := data.List()
	if err != nil {
		slog.With("Error", err.Error()).Error("list error")
		utils.SendErrorMessage(c, 500, "list error", err.Error())
		return
	}

	if data.Fast {
		result := make([]map[string]interface{}, 0)
		// 平铺基础数据
		for index, item := range list.Items {
			switch item.GetObjectKind().GroupVersionKind().Kind {
			case "Pod":
				var data v1c.Pod

				toBytes, err := item.MarshalJSON()
				if err != nil {
					slog.Error("Error marshalling namespace %s: %v", data.Namespace, err)
					utils.SendErrorMessage(c, 500, "error marshalling namespace", err.Error())
					return
				}

				if err := json.Unmarshal(toBytes, &data); err != nil {
					slog.Error("Error unmarshalling namespace %s: %v")
					utils.SendErrorMessage(c, 500, "error Unmarshal", err.Error())
					return
				}

				tmp := map[string]interface{}{
					// "crd":       data,
					"id":        index,
					"name":      data.Name,
					"namespace": data.Namespace,
					"status":    data.Status.Phase,
					// "restart":           data.Status.ContainerStatuses[0].RestartCount,
					"hostip":     data.Status.HostIP,
					"podip":      data.Status.PodIP,
					"createtime": data.CreationTimestamp.Format("2006-01-02 15:04:05"),
					"statuss":    data.Status,
					"raw":        data,
				}

				if data.OwnerReferences != nil {
					tmp["controller"] = data.OwnerReferences
				} else {
					tmp["controller"] = []v1m.OwnerReference{}
				}

				if data.Status.ContainerStatuses != nil {
					for _, item := range data.Status.ContainerStatuses {
						tmp["image"] = item.Image
						tmp["ready"] = item.Ready
						tmp["restart"] = item.RestartCount
						// tmp["status"] = item.State
						break
					}
					tmp["containerStatuses"] = data.Status.ContainerStatuses
				} else {
					tmp["containerStatuses"] = []v1c.ContainerStatus{}
					tmp["image"] = ""
					tmp["ready"] = false
					tmp["restart"] = 0
				}
				result = append(result, tmp)
			case "Deployment":
				var data v1.Deployment
				toBytes, err := item.MarshalJSON()
				if err != nil {
					slog.Error("Error marshalling namespace %s: %v", data.Namespace, err)
					utils.SendErrorMessage(c, 500, "error marshalling namespace", err.Error())
					return
				}

				if err := json.Unmarshal(toBytes, &data); err != nil {
					slog.Error("Error unmarshalling namespace %s: %v")
					utils.SendErrorMessage(c, 500, "error Unmarshal", err.Error())
					return
				}

				tmp := map[string]interface{}{
					"crd":       data,
					"name":      data.Name,
					"namespace": data.Namespace,
					"status":    data.Status,
				}

				result = append(result, tmp)
			case "DaemonSet":
				var data v1.DaemonSet
				toBytes, err := item.MarshalJSON()
				if err != nil {
					slog.Error("Error marshalling namespace %s: %v", data.Namespace, err)
					utils.SendErrorMessage(c, 500, "error marshalling namespace", err.Error())
					return
				}
				if err := json.Unmarshal(toBytes, &data); err != nil {
					slog.Error("Error unmarshalling namespace %s: %v")
					utils.SendErrorMessage(c, 500, "error Unmarshal", err.Error())
					return
				}
				tmp := map[string]interface{}{
					"crd":       data,
					"name":      data.Name,
					"namespace": data.Namespace,
					"status":    data.Status,
				}

				result = append(result, tmp)
			case "StatefulSet":
				var data v1.StatefulSet
				toBytes, err := item.MarshalJSON()
				if err != nil {
					slog.Error("Error marshalling namespace %s: %v", data.Namespace, err)
					utils.SendErrorMessage(c, 500, "error marshalling namespace", err.Error())
					return
				}
				if err := json.Unmarshal(toBytes, &data); err != nil {
					slog.Error("Error unmarshalling namespace %s: %v", data.Namespace, err)
					utils.SendErrorMessage(c, 500, "error Unmarshal", err.Error())
					return
				}
				tmp := map[string]interface{}{
					"crd":       data,
					"name":      data.Name,
					"namespace": data.Namespace,
					"status":    data.Status,
				}

				result = append(result, tmp)
			case "ConfigMap":
				var data v1c.ConfigMap
				toBytes, err := item.MarshalJSON()
				if err != nil {
					slog.Error("Error marshalling namespace %s: %v", data.Namespace, err)
					utils.SendErrorMessage(c, 500, "error marshalling namespace", err.Error())
					return
				}
				if err := json.Unmarshal(toBytes, &data); err != nil {
					slog.Error("Error unmarshalling namespace %s: %v", data.Namespace, err)
					utils.SendErrorMessage(c, 500, "error Unmarshal", err.Error())
					return
				}
				tmp := map[string]interface{}{
					"crd":       data,
					"name":      data.Name,
					"namespace": data.Namespace,
				}

				result = append(result, tmp)
			case "Secret":
				var data v1c.Secret
				toBytes, err := item.MarshalJSON()
				if err != nil {
					slog.Error("Error marshalling namespace %s: %v", data.Namespace, err)
					utils.SendErrorMessage(c, 500, "error marshalling namespace", err.Error())
					return
				}
				if err := json.Unmarshal(toBytes, &data); err != nil {
					slog.Error("Error unmarshalling namespace %s: %v", data.Namespace, err)
					utils.SendErrorMessage(c, 500, "error Unmarshal", err.Error())
					return
				}
				tmp := map[string]interface{}{
					"crd":       data,
					"name":      data.Name,
					"namespace": data.Namespace,
				}

				result = append(result, tmp)
			case "Job":
				var data v1b.Job
				toBytes, err := item.MarshalJSON()
				if err != nil {
					slog.Error("Error marshalling namespace %s: %v", data.Namespace, err)
					utils.SendErrorMessage(c, 500, "error marshalling namespace", err.Error())
					return
				}
				if err := json.Unmarshal(toBytes, &data); err != nil {
					slog.Error("Error unmarshalling namespace %s: %v", data.Namespace, err)
					utils.SendErrorMessage(c, 500, "error Unmarshal", err.Error())
					return
				}
				tmp := map[string]interface{}{
					"crd":       data,
					"name":      data.Name,
					"namespace": data.Namespace,
				}

				result = append(result, tmp)
			case "CronJob":
				var data v1b.CronJob
				toBytes, err := item.MarshalJSON()
				if err != nil {
					slog.Error("Error marshalling namespace %s: %v", data.Namespace, err)
					utils.SendErrorMessage(c, 500, "error marshalling namespace", err.Error())
					return
				}
				if err := json.Unmarshal(toBytes, &data); err != nil {
					slog.Error("Error unmarshalling namespace %s: %v", data.Namespace, err)
					utils.SendErrorMessage(c, 500, "error Unmarshal", err.Error())
					return
				}
				tmp := map[string]interface{}{
					"crd":       data,
					"name":      data.Name,
					"namespace": data.Namespace,
				}

				result = append(result, tmp)
			}

		}
		utils.SendSuccessMessage(c, 200, result)
		return
	}

	utils.SendSuccessMessage(c, 200, list)
}

func gvr_get_get(c *gin.Context) {
	var data model.GetGVR
	if err := c.BindJSON(&data); err != nil {
		utils.SendErrorMessage(c, http.StatusBadRequest, "not found", err.Error())
		return
	}

	list, err := data.Get()
	if err != nil {
		slog.Error("get error: %s", err.Error())
		utils.SendErrorMessage(c, 500, "get error", err.Error())
		return
	}

	utils.SendSuccessMessage(c, 200, list)
}

func gvr_post_add(c *gin.Context) {
	var data model.GetGVR
	if err := c.BindJSON(&data); err != nil {
		utils.SendErrorMessage(c, http.StatusBadRequest, "not found", err.Error())
		return
	}

	list, err := data.Post()
	if err != nil {
		slog.With("Error", err.Error()).Error("post error")
		utils.SendErrorMessage(c, 500, "post error", err.Error())
		return
	}

	utils.SendSuccessMessage(c, 200, list)
}

func gvr_patch_edit(c *gin.Context) {
	var data model.GetGVR
	if err := c.BindJSON(&data); err != nil {
		utils.SendErrorMessage(c, http.StatusBadRequest, "not found", err.Error())
		return
	}

	list, err := data.Patch()
	if err != nil {
		slog.Error("patch error: %s", err.Error())
		utils.SendErrorMessage(c, 500, "patcg error", err.Error())
		return
	}

	utils.SendSuccessMessage(c, 200, list)
}

func gvr_patch_strate(c *gin.Context) {
	var data model.GetGVR
	if err := c.BindJSON(&data); err != nil {
		utils.SendErrorMessage(c, http.StatusBadRequest, "not found", err.Error())
		return
	}

	list, err := data.PatchStrate()
	if err != nil {
		slog.Error("patch error: %s", err.Error())
		utils.SendErrorMessage(c, 500, "patcg error", err.Error())
		return
	}

	utils.SendSuccessMessage(c, 200, list)
}

func gvr_put_update(c *gin.Context) {
	var data model.GetGVR
	if err := c.BindJSON(&data); err != nil {
		utils.SendErrorMessage(c, http.StatusBadRequest, "not found", err.Error())
		return
	}

	list, err := data.Put()
	if err != nil {
		slog.Error("put error: %s", err.Error())
		utils.SendErrorMessage(c, 500, "put error", err.Error())
		return
	}

	utils.SendSuccessMessage(c, 200, list)
}

func gvr_delete_del(c *gin.Context) {
	var data model.GetGVR
	if err := c.BindJSON(&data); err != nil {
		utils.SendErrorMessage(c, http.StatusBadRequest, "not found", err.Error())
		return
	}

	err := data.Delete()
	if err != nil {
		slog.Error("delete error: %s", err.Error())
		utils.SendErrorMessage(c, 500, "delete error", err.Error())
		return
	}

	utils.SendSuccessMessage(c, 200, "deleted successfully")
}
