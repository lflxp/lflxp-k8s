package helm

import (
	"github.com/gin-gonic/gin"
)

const (
	HELM_REPO_LIST_GET string = "/repo/list"
	HELM_INSTALL_GET   string = "/install/list"
	HELM_RELEASE_GET   string = "/release/list/:name"
)

func RegisterApiserverHelm(router *gin.Engine) {
	helmGroup := router.Group("/api/helm")
	{
		helmGroup.GET(HELM_REPO_LIST_GET, helmRepoList)
		helmGroup.GET(HELM_INSTALL_GET, helmInstallList)
		helmGroup.GET(HELM_RELEASE_GET, helmReleaseList)
	}
}
