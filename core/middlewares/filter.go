package middlewares

import (
	"encoding/json"
	"log/slog"
	"net/http"
	"regexp"
	"strings"

	"github.com/lflxp/lflxp-k8s/core/model/admin"

	jwts "github.com/lflxp/lflxp-k8s/core/middlewares/jwt/framework"
	js "github.com/lflxp/lflxp-k8s/core/middlewares/jwt/services"

	"github.com/gin-gonic/gin"
	"github.com/lflxp/tools/httpclient"
)

func JwtTokenFilter() gin.HandlerFunc {
	return func(c *gin.Context) {
		if !isWhilteUrl(c) {
			token, err := jwts.NewGinJwtMiddlewares(js.AllUserAuthorizator).ParseToken(c)
			if err != nil {
				c.JSONP(401, gin.H{
					"error": err.Error(),
					"code":  "token is invaild",
				})
				return
			}

			info, err := json.Marshal(token)
			if err != nil {
				c.JSONP(401, gin.H{
					"error": err.Error(),
					"code":  "json.Marshal error",
				})
				return
			}

			var user admin.User
			err = json.Unmarshal(info, &user)
			if err != nil {
				c.JSONP(401, gin.H{
					"error": err.Error(),
					"code":  "json.Unmarshal error",
					"info":  string(info),
				})
				return
			}

			c.Request.Header.Set("username", user.Username)
			c.Request.Header.Set("token", user.Token)
			c.Next()
		} else {
			c.Next()
		}
	}
}

func TokenFilter() gin.HandlerFunc {
	return func(c *gin.Context) {
		// token := jwt.ExtractClaims(c)
		// log.Debug("ExtractClaims token ", token)

		if !isWhilteUrl(c) {
			user, err := js.ParseJWTToken(c)
			if err != nil {
				if strings.Contains(err.Error(), "named cookie not present") {
					// c.Redirect(http.StatusFound, "/d2admin/#/login?url="+c.Request.RequestURI)
					httpclient.SendErrorMessage(c, http.StatusUnauthorized, "token invalid", "/d2admin/#/login?url="+c.Request.RequestURI)
					c.Abort()
					return
				}
				c.AbortWithStatusJSON(http.StatusUnauthorized, httpclient.Result{
					Success:      false,
					Data:         "Token is not vaild!",
					ErrorCode:    "tokenError",
					ErrorMessage: err.Error(),
					Host:         c.Request.Host,
					TraceId:      "",
					ShowType:     "filter",
				})
				return
			}

			c.Request.Header.Set("username", user.Username)
			c.Request.Header.Set("name", user.Name)
			c.Request.Header.Set("userid", user.UserId)
			c.Request.Header.Set("email", user.Email)
			c.Request.Header.Set("token", user.Token)
			c.Request.Header.Set("refreshtoken", user.RefreshToken)
		} else {
			c.Next()
		}
	}
}

// `^/api/*`, // for debug only
// `^/ws/*`,
func isWhilteUrl(c *gin.Context) bool {
	var rs bool
	url := []string{
		`^/$`,
		`^/swagger/*`,
		`^/login`,
		`^/adminfs2/*`,
		`^/favicon.ico`,
		`^/auth/*`,
		`^/v3/*`,
		`^/metrics`,
		`^/cloud/xterm`,
		`^/cloud/log`,
		`^/dashboard/*`,
		`^/d2admin/*`,
		`^/script/*`,
		`^/admin/auth/login`,
		`^/api/login`,
		`^/apis/*`,
		`^/node_modules/*`,
		// `^/monitor/*`,
	}

	for _, x := range url {
		rs, _ = regexp.MatchString(x, c.Request.URL.Path)
		if rs {
			break
		}
	}

	slog.Debug("method [%s] isWhite %v path %s Url.Path %s ", c.Request.Method, rs, c.Request.RequestURI, c.Request.URL.Path)
	return rs
}
