package appshop

import (
	"encoding/json"
	"fmt"

	"github.com/gin-gonic/gin"
	log "github.com/go-eden/slf4go"
	"github.com/guonaihong/gout"
	"github.com/lflxp/tools/httpclient"
	"github.com/spf13/viper"
)

const (
	REPO_LIST = "/shop/list"
)

func RegisterShop(router *gin.Engine) {
	shopGroup := router.Group("/api")
	{
		shopGroup.GET(REPO_LIST, repo_list)
	}
}

func repo_list(c *gin.Context) {
	token := c.Request.Header.Get("token")
	host := viper.GetString("auth.url")
	url := fmt.Sprintf("%s/api/v1/addons", host)
	code := 0
	body := ""
	err := httpclient.NewGoutClient().
		GET(url).
		Debug(true).
		SetHeader(gout.H{
			"Content-Type":  "application/json",
			"Authorization": "Bearer " + token,
		}).
		BindBody(&body).
		Code(&code).
		Do()

	if err != nil {
		httpclient.SendErrorMessage(c, code, "http request failed", err.Error())
		return
	}

	if code != 200 {
		log.Error(body)
		httpclient.SendErrorMessage(c, code, fmt.Sprintf("%d", code), body)
		return
	}

	var data interface{}
	err = json.Unmarshal([]byte(body), &data)
	if err != nil {
		log.Error(body)
		httpclient.SendErrorMessage(c, 200, "json parse error", err.Error())
		return
	}

	httpclient.SendSuccessMessage(c, 200, data)
}
