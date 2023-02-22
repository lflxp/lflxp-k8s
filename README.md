# 介绍

快速开发项目的脚手架，基于golang gin + vue d2-admin + tauri组成,可以实现快速的B/S or C/S架构

# TODO

1、切换git提交的username和email
2、切换项目名称，叫脚手架比较好听
3、修改go mod名称和代码import名
4、统一后端接口路径以/api开头，/admin忽略
5、应用商店：初始化、接口联调CRUD、UI界面
6、k8s pod container详情页面
  * containers
  * conditions
  * recent Events
  * Related Resources
  * deployment -> pods
  * cronJob -> pods
  * job -> pods
  * sts -> pods
  * ds -> pods
10、监控
  * prometheus
  * grafana
  * metrics-server
  * grafana-template
  * job安装prometheus+grafana+servicemonitor+metric-server
11、node节点 cordon 污点等功能

# 功能列表

* JWT
* 登陆页面
* Django Admin后台
* tauri app
* Dockerfile
* 一个二进制文件启动

# 安装前准备

* npm 
* swag
* [showme](https://github.com/lflxp/showme)
* [fhst](https://gitee.com/lflxp/fhst)

# 桌面app tauri

## 调试tauri

> cargo tauri dev

or 

> make tauridev

## 打包

`有BUG`：无法访问axum服务，是直接访问的tauri://localhost/admin/userinfo的接口

> cargo tarui build

or 

> make tauribuild

## 快速打包 ko

前提：配置好~/.docker/config认证文件

- export KO_DOCKER_REPO=harbor.ks.x/eclipse-che ko build

## 快速编译 goreleaser

- go install github.com/goreleaser/goreleaser@latest
- goreleaser init
- goreleaser release --snapshot --rm-dist

## 参考

- https://goreleaser.com/install/

# 前端框架

- elementUI
- D2-admin

# Golang后端

## helm api

> https://helm.sh/zh/docs/topics/advanced/

> https://pkg.go.dev/helm.sh/helm/v3 

> kubectl get secret --all-namespaces -l "owner=helm"

> https://fluxcd.io/flux/installation/

> https://kubevela.stoplight.io/docs/kubevela/b908ff637ac96-prepare-the-user-s-cloud-shell-environment

> https://kubevela.net/zh/docs/platform-engineers/openapi/overview

## 可以将helm二进制文件打包进embed或者将二进制文件上传到gitee或者github

## 自动化安装kubevela

## 安装

`make`

```bash
➜  demo git:(master) ✗ make
rm -rf asset/dashboard
cd frontend && npm install && npm run build:prod && mv dist ../asset/dashboard

up to date in 1s

112 packages are looking for funding
  run `npm fund` for details

> vue-admin-template@4.4.0 build:prod
> vue-cli-service build


⠼  Building for production...

 WARNING  Compiled with 2 warnings                                                                                                                                      11:25:54

 warning  

asset size limit: The following asset(s) exceed the recommended size limit (244 KiB).
This can impact web performance.
Assets: 
  static/js/chunk-elementUI.6f38d267.js (654 KiB)
  static/js/chunk-libs.de09490f.js (313 KiB)

 warning  

entrypoint size limit: The following entrypoint(s) combined asset size exceeds the recommended limit (244 KiB). This can impact web performance.
Entrypoints:
  app (1.23 MiB)
      static/css/chunk-elementUI.68c70ad5.css
      static/js/chunk-elementUI.6f38d267.js
      static/css/chunk-libs.3dfb7769.css
      static/js/chunk-libs.de09490f.js
      static/css/app.b7cb370e.css
      static/js/app.cd60c8ed.js


  File                                      Size             Gzipped

  dist/static/js/chunk-elementUI.6f38d26    654.28 KiB       160.37 KiB
  7.js
  dist/static/js/chunk-libs.de09490f.js     313.25 KiB       109.68 KiB
  dist/static/js/app.cd60c8ed.js            56.04 KiB        16.85 KiB
  dist/static/js/chunk-06801562.02b4eb3d    3.08 KiB         1.25 KiB
  .js
  dist/static/js/chunk-9ea35268.2d9add8d    2.97 KiB         0.97 KiB
  .js
  dist/static/js/chunk-2d0e4b0c.18f2d803    2.06 KiB         0.84 KiB
  .js
  dist/static/js/chunk-94d3c3c4.10d1f40a    1.74 KiB         0.73 KiB
  .js
  dist/static/js/chunk-6db766a0.a9b17b0f    1.58 KiB         0.72 KiB
  .js
  dist/static/js/chunk-2d0d0f79.e0fc0e48    1.19 KiB         0.61 KiB
  .js
  dist/static/js/chunk-2d0c8bf7.104337da    0.41 KiB         0.31 KiB
  .js
  dist/static/js/chunk-2d0e4e1f.d1fe687e    0.41 KiB         0.31 KiB
  .js
  dist/static/js/chunk-2d226cab.3aff06e4    0.39 KiB         0.29 KiB
  .js
  dist/static/js/chunk-2d229205.daeadf1b    0.37 KiB         0.29 KiB
  .js
  dist/static/js/chunk-2d0cfaef.ff491ee6    0.35 KiB         0.27 KiB
  .js
  dist/static/js/chunk-2d0e944c.31030ddb    0.35 KiB         0.28 KiB
  .js
  dist/static/js/chunk-2d2104c6.19c27445    0.35 KiB         0.27 KiB
  .js
  dist/static/css/chunk-elementUI.68c70a    227.82 KiB       34.55 KiB
  d5.css
  dist/static/css/app.b7cb370e.css          9.62 KiB         2.36 KiB
  dist/static/css/chunk-94d3c3c4.3c7f5ad    4.64 KiB         0.83 KiB
  9.css
  dist/static/css/chunk-libs.3dfb7769.cs    3.48 KiB         1.25 KiB
  s
  dist/static/css/chunk-06801562.ba95b87    1.59 KiB         0.62 KiB
  6.css
  dist/static/css/chunk-6db766a0.563b0ff    0.11 KiB         0.10 KiB
  7.css
  dist/static/css/chunk-9ea35268.5cd9884    0.04 KiB         0.06 KiB
  a.css

  Images and other types of assets omitted.

 DONE  Build complete. The dist directory is ready to be deployed.
 INFO  Check out deployment instructions at https://cli.vuejs.org/guide/deployment.html

go mod tidy
go get golang.org/x/tools/cmd/stringer
go generate
...
watching utils
building...
running...
2022-10-19 11:26:53.373124 [1] [DEBUG] [root] framework.go:37 初始化jwtIdentityKey 
[xorm] [info]  2022/10/19 11:26:53.374927 [SQL] SELECT name FROM sqlite_master WHERE type='table' [] - 1.380917ms
[xorm] [info]  2022/10/19 11:26:53.375037 [SQL] SELECT sql FROM sqlite_master WHERE type='table' and name = ? [vpn] - 10.541µs
[xorm] [info]  2022/10/19 11:26:53.375112 [SQL] SELECT sql FROM sqlite_master WHERE type='index' and tbl_name = ? [vpn] - 7.167µs
[xorm] [info]  2022/10/19 11:26:53.375148 [SQL] SELECT sql FROM sqlite_master WHERE type='table' and name = ? [machine] - 6.292µs
[xorm] [info]  2022/10/19 11:26:53.375193 [SQL] SELECT sql FROM sqlite_master WHERE type='index' and tbl_name = ? [machine] - 4.709µs
[xorm] [info]  2022/10/19 11:26:53.375228 [SQL] SELECT sql FROM sqlite_master WHERE type='table' and name = ? [cdn] - 4.542µs
[xorm] [info]  2022/10/19 11:26:53.375272 [SQL] SELECT sql FROM sqlite_master WHERE type='index' and tbl_name = ? [cdn] - 4.541µs
[xorm] [info]  2022/10/19 11:26:53.375311 [SQL] SELECT sql FROM sqlite_master WHERE type='table' and name = ? [more] - 4.333µs
[xorm] [info]  2022/10/19 11:26:53.375340 [SQL] SELECT sql FROM sqlite_master WHERE type='index' and tbl_name = ? [more] - 4.208µs
[xorm] [info]  2022/10/19 11:26:53.375369 [SQL] SELECT sql FROM sqlite_master WHERE type='table' and name = ? [user] - 4µs
[xorm] [info]  2022/10/19 11:26:53.375409 [SQL] SELECT sql FROM sqlite_master WHERE type='index' and tbl_name = ? [user] - 4.166µs
[xorm] [info]  2022/10/19 11:26:53.375433 [SQL] SELECT sql FROM sqlite_master WHERE type='table' and name = ? [claims] - 4µs
[xorm] [info]  2022/10/19 11:26:53.375461 [SQL] SELECT sql FROM sqlite_master WHERE type='index' and tbl_name = ? [claims] - 3.875µs
[xorm] [info]  2022/10/19 11:26:53.375484 [SQL] SELECT sql FROM sqlite_master WHERE type='table' and name = ? [groups] - 3.875µs
[xorm] [info]  2022/10/19 11:26:53.375514 [SQL] SELECT sql FROM sqlite_master WHERE type='index' and tbl_name = ? [groups] - 3.791µs
[xorm] [info]  2022/10/19 11:26:53.375532 [SQL] SELECT sql FROM sqlite_master WHERE type='table' and name = ? [userauth] - 4.583µs
[xorm] [info]  2022/10/19 11:26:53.375555 [SQL] SELECT sql FROM sqlite_master WHERE type='index' and tbl_name = ? [userauth] - 3.917µs
[xorm] [info]  2022/10/19 11:26:53.375577 [SQL] SELECT sql FROM sqlite_master WHERE type='table' and name = ? [history] - 3.875µs
[xorm] [info]  2022/10/19 11:26:53.375606 [SQL] SELECT sql FROM sqlite_master WHERE type='index' and tbl_name = ? [history] - 4.292µs
2022-10-19 11:26:53.375656 [1] [DEBUG] [root] modelRegistry.go:120 完成模型注册
[xorm] [info]  2022/10/19 11:26:53.375787 [SQL] SELECT `id`, `username`, `password`, `name`, `firstname`, `email`, `isvaild`, `status`, `isadmin`, `claims_id`, `token` FROM `user` WHERE `username`=? LIMIT 1 [admin] - 28.834µs
2022-10-19 11:26:53.376319 [1] [ERROR] [root] admin.go:20 json: cannot unmarshal number into Go value of type []admin.Claims
[xorm] [info]  2022/10/19 11:26:53.376392 [SQL] SELECT name FROM sqlite_master WHERE type='table' [] - 25.5µs
[xorm] [info]  2022/10/19 11:26:53.376455 [SQL] SELECT sql FROM sqlite_master WHERE type='table' and name = ? [demotest] - 9µs
[xorm] [info]  2022/10/19 11:26:53.376619 [SQL] SELECT sql FROM sqlite_master WHERE type='index' and tbl_name = ? [demotest] - 13.208µs
2022-10-19 11:26:53.37664  [1] [DEBUG] [root] modelRegistry.go:120 完成模型注册
2022-10-19 11:26:53.376647 [1] [DEBUG] [root] test.go:15 注册Demo test
Using config file: /opt/gopath/src/gitee.com/lflxp/demo/demo.yaml
[GIN-debug] [WARNING] Creating an Engine instance with the Logger and Recovery middleware already attached.

[GIN-debug] [WARNING] Running in "debug" mode. Switch to "release" mode in production.
 - using env:   export GIN_MODE=release
 - using code:  gin.SetMode(gin.ReleaseMode)

2022-10-19 11:26:53.385402 [1] [INFO ] [root] router.go:18 注册Gin路由
[GIN-debug] GET    /metrics                  --> demo/core/middlewares.PromHandler.func1 (5 handlers)
[GIN-debug] GET    /                         --> demo/core/router.PreGinServe.func1 (6 handlers)
[GIN-debug] GET    /health                   --> demo/core/middlewares.RegisterHealthMiddleware (6 handlers)
[GIN-debug] GET    /swagger/*any             --> github.com/swaggo/gin-swagger.CustomWrapHandler.func1 (6 handlers)
[GIN-debug] POST   /admin/auth/login         --> demo/pkg/auth.loginlocal (6 handlers)
[GIN-debug] POST   /admin/auth/logout        --> demo/pkg/auth.logout (6 handlers)
[GIN-debug] GET    /dashboard/*any           --> demo/asset.RegisterAsset.func1 (6 handlers)
[GIN-debug] POST   /dashboard/*any           --> demo/asset.RegisterAsset.func1 (6 handlers)
[GIN-debug] PUT    /dashboard/*any           --> demo/asset.RegisterAsset.func1 (6 handlers)
[GIN-debug] PATCH  /dashboard/*any           --> demo/asset.RegisterAsset.func1 (6 handlers)
[GIN-debug] HEAD   /dashboard/*any           --> demo/asset.RegisterAsset.func1 (6 handlers)
[GIN-debug] OPTIONS /dashboard/*any           --> demo/asset.RegisterAsset.func1 (6 handlers)
[GIN-debug] DELETE /dashboard/*any           --> demo/asset.RegisterAsset.func1 (6 handlers)
[GIN-debug] CONNECT /dashboard/*any           --> demo/asset.RegisterAsset.func1 (6 handlers)
[GIN-debug] TRACE  /dashboard/*any           --> demo/asset.RegisterAsset.func1 (6 handlers)
[GIN-debug] GET    /script/*any              --> demo/asset.RegisterAsset.func2 (6 handlers)
[GIN-debug] POST   /script/*any              --> demo/asset.RegisterAsset.func2 (6 handlers)
[GIN-debug] PUT    /script/*any              --> demo/asset.RegisterAsset.func2 (6 handlers)
[GIN-debug] PATCH  /script/*any              --> demo/asset.RegisterAsset.func2 (6 handlers)
[GIN-debug] HEAD   /script/*any              --> demo/asset.RegisterAsset.func2 (6 handlers)
[GIN-debug] OPTIONS /script/*any              --> demo/asset.RegisterAsset.func2 (6 handlers)
[GIN-debug] DELETE /script/*any              --> demo/asset.RegisterAsset.func2 (6 handlers)
[GIN-debug] CONNECT /script/*any              --> demo/asset.RegisterAsset.func2 (6 handlers)
[GIN-debug] TRACE  /script/*any              --> demo/asset.RegisterAsset.func2 (6 handlers)
[GIN-debug] GET    /docs/*any                --> demo/asset.RegisterAsset.func3 (7 handlers)
[GIN-debug] POST   /docs/*any                --> demo/asset.RegisterAsset.func3 (7 handlers)
[GIN-debug] PUT    /docs/*any                --> demo/asset.RegisterAsset.func3 (7 handlers)
[GIN-debug] PATCH  /docs/*any                --> demo/asset.RegisterAsset.func3 (7 handlers)
[GIN-debug] HEAD   /docs/*any                --> demo/asset.RegisterAsset.func3 (7 handlers)
[GIN-debug] OPTIONS /docs/*any                --> demo/asset.RegisterAsset.func3 (7 handlers)
[GIN-debug] DELETE /docs/*any                --> demo/asset.RegisterAsset.func3 (7 handlers)
[GIN-debug] CONNECT /docs/*any                --> demo/asset.RegisterAsset.func3 (7 handlers)
[GIN-debug] TRACE  /docs/*any                --> demo/asset.RegisterAsset.func3 (7 handlers)
[GIN-debug] GET    /favicon.ico              --> demo/asset.RegisterAsset.func4 (6 handlers)
[GIN-debug] GET    /adminfs/*filepath        --> github.com/gin-gonic/gin.(*RouterGroup).createStaticHandler.func1 (6 handlers)
[GIN-debug] HEAD   /adminfs/*filepath        --> github.com/gin-gonic/gin.(*RouterGroup).createStaticHandler.func1 (6 handlers)
[GIN-debug] [WARNING] Since SetHTMLTemplate() is NOT thread-safe. It should only be called
at initialization. ie. before any route is registered or the router is listening in a socket:

        router := gin.Default()
        router.SetHTMLTemplate(template) // << good place

[GIN-debug] GET    /login                    --> demo/core/controller.login (6 handlers)
[GIN-debug] GET    /admin/:type              --> demo/core/controller.process (6 handlers)
[GIN-debug] POST   /admin/:type              --> demo/core/controller.process (6 handlers)
[GIN-debug] PUT    /admin/:type              --> demo/core/controller.process (6 handlers)
[GIN-debug] PATCH  /admin/:type              --> demo/core/controller.process (6 handlers)
[GIN-debug] HEAD   /admin/:type              --> demo/core/controller.process (6 handlers)
[GIN-debug] OPTIONS /admin/:type              --> demo/core/controller.process (6 handlers)
[GIN-debug] DELETE /admin/:type              --> demo/core/controller.process (6 handlers)
[GIN-debug] CONNECT /admin/:type              --> demo/core/controller.process (6 handlers)
[GIN-debug] TRACE  /admin/:type              --> demo/core/controller.process (6 handlers)
[GIN-debug] GET    /test/:type               --> demo/core/controller.test_process (7 handlers)
[GIN-debug] POST   /test/:type               --> demo/core/controller.test_process (7 handlers)
[GIN-debug] PUT    /test/:type               --> demo/core/controller.test_process (7 handlers)
[GIN-debug] PATCH  /test/:type               --> demo/core/controller.test_process (7 handlers)
[GIN-debug] HEAD   /test/:type               --> demo/core/controller.test_process (7 handlers)
[GIN-debug] OPTIONS /test/:type               --> demo/core/controller.test_process (7 handlers)
[GIN-debug] DELETE /test/:type               --> demo/core/controller.test_process (7 handlers)
[GIN-debug] CONNECT /test/:type               --> demo/core/controller.test_process (7 handlers)
[GIN-debug] TRACE  /test/:type               --> demo/core/controller.test_process (7 handlers)
2022-10-19 11:26:53.386293 [1] [INFO ] [root] settings.go:31 ip 0.0.0.0 port 8000
2022-10-19 11:26:53.386405 [1] [INFO ] [root] settings.go:84 Listening and serving HTTPS on http://10.0.23.63:8000
```