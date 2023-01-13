<template>
  <d2-container>
    <el-dialog
      :title="kinds"
      :visible.sync="dialogVisible"
      width="80%">
      <vue-json-editor
        v-model="jsonData"
        :showBtns="true"
        mode="view"
        lang="zh"
        :expandedOnStart="true"
        @json-change="onJsonChange"
        @json-save="onJsonSave"
      />
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
    <!-- <el-select 
      v-model="value" 
      filterable 
      clearable
      @change="changens"
      placeholder="请选择命名空间">
      <el-option
        v-for="item in namespaces"
        :key="item.metadata.name"
        :label="item.metadata.name"
        :value="item.metadata.name">
      </el-option>
    </el-select> -->
    <el-button @click="fetchData">刷新</el-button>
    <el-button @click="testurl">jump</el-button>
    <el-row :gutter="20">
      <el-col :span="4" style="margin-bottom: 20px;" v-for="row in list" :key="row.name">
        <el-card :body-style="{ padding: '0px' }">
          <div slot="header" class="clearfix">
            <el-image
              style="width: 100%; height: 100px"
              :src="row.icon"
              fit="contain">
            </el-image>
          </div>
          
          <div style="padding: 14px;">
            <el-row>
              <el-col>
                <el-button style="float: left; padding: 3px 0" type="text" @click="openit(row)">{{ row.name }}</el-button>
                <el-button style="float: right; padding: 3px 0" type="text" @click="deploy(row.name)">部署</el-button>
              </el-col>
            </el-row>
            <el-row>
              <el-col>
                <span>{{ row.description.substring(0,30) }}...</span>
              </el-col>
            </el-row>
            <el-row>
              <el-col>
                <el-tag
                  size="mini"
                  style="margin-right: 5px;"
                  v-for="tag in row.tags"
                  :key="tag"
                  :type="tag">
                  {{tag}}
                </el-tag>
              </el-col>
            </el-row>
            <div class="bottom clearfix">
              <el-button style="float: left; padding: 3px 0" type="text" disabled>{{ row.version }}</el-button>
              <div v-for="en in enabled_addon_list" :key="en.name">
                <el-link v-if="en.name === row.name" style="float: right; padding: 3px 0" type="success">已部署</el-link>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-drawer
      :title="title"
      :visible.sync="drawer"
      :direction="direction"
      custom-class="demo-drawer"
      ref="drawer"
      :before-close="handleClose">
      <div class="demo-drawer__content" v-if="paramStatus !== undefined && showparam">
        <el-row style="margin-bottom: 12px;">
          <el-col v-if="status2.phase === 'disabled'">
            <div style="background-color: gray;"><i class="el-icon-warning" style="color: blue;"></i>插件状态 disabled</div>
          </el-col>
          <el-col v-if="status2.phase === 'enabled'">
            <div style="background-color: green;"><i class="el-icon-warning" style="color: blue;"></i>插件状态 {{ status2.phase }}</div>
          </el-col>
        </el-row>
        <el-form :model="form" :rules="rules" ref="ruleForm">
          <el-form-item label="部署集群" :label-width="formLabelWidth" prop="cluster">
            <el-select v-model="form2['cluster']" multiple placeholder="请选择活动区域">
              <el-option v-for="x in status2.allClusters" :key="x.name" :label="x.name" :value="x.name"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="版本" :label-width="formLabelWidth" prop="version">
            <el-select v-model="form2['version']" placeholder="请选择活动区域">
              <el-option :label="x" :value="x" v-for="x in paramStatus.availableVersions" :key="x"></el-option>
            </el-select>
          </el-form-item>

          <el-card class="box-card" v-if="paramStatus.uiSchema !== undefined && paramStatus.uiSchema !== null">
            <div slot="header" class="clearfix">
              <el-row>
                <el-col>
                  <el-divider direction="vertical"></el-divider><span style="font-weight: bold;font-size: 25px;">属性</span>
                </el-col>
              </el-row>
              <!-- <el-divider></el-divider> -->
              <el-row :gutter="20">
                <el-col :span="24"><div style="background-color: rgb(213 243 248);"><i class="el-icon-warning" style="color: blue;"></i>设置插件配置参数
  </div></el-col>
              </el-row>
            </div>
            <div v-for="x in paramStatus.uiSchema" :key="x.label">
              <el-form-item v-if="x.uiType === 'Switch'" :label="x.label" :prop="x.label">
                <el-switch v-model="form2[x.jsonKey]"></el-switch>
                <br/>
                <span>{{ x.description }}</span>
              </el-form-item>
              <el-form-item v-if="x.uiType === 'Select'" :label="x.label" :label-width="formLabelWidth" :prop="x.label">
                <el-select v-model="form2[x.jsonKey]" placeholder="请选择活动区域">
                  <el-option v-for="y in x.validate.options" :key="y.label" :label="y.label" :value="y.value"></el-option>
                </el-select>
                <br/>
                <span>{{ x.description }}</span>
              </el-form-item>
              <el-form-item v-if="x.uiType === 'Strings'" :label="x.label" :label-width="formLabelWidth" :prop="x.label">
                <el-input v-model="form2[x.jsonKey]"></el-input>
                <br/>
                <span>{{ x.description }}</span>
              </el-form-item>
              <el-form-item v-if="x.uiType === 'Input'" :label="x.label" :label-width="formLabelWidth" :prop="x.label">
                <el-input v-model="form2[x.jsonKey]"></el-input>
                <br/>
                <span>{{ x.description }}</span>
              </el-form-item>
            </div>
          </el-card>
        </el-form>

        <el-card class="box-card" v-if="paramStatus.dependencies !== undefined && paramStatus.dependencies !== null">
          <div slot="header" class="clearfix">
            <el-row>
              <el-col>
                <el-divider direction="vertical"></el-divider><span style="font-weight: bold;font-size: 25px;">依赖</span>
              </el-col>
            </el-row>
            <!-- <el-divider></el-divider> -->
            <el-row :gutter="20">
              <el-col :span="24"><div style="background-color: rgb(213 243 248);"><i class="el-icon-warning" style="color: blue;"></i>请先确保所依赖插件已启用
</div></el-col>
            </el-row>
          </div>
          <div v-for="o in paramStatus.dependencies" :key="o.name" class="text">
            <el-button type="text" @click="deploy(o.name)">{{ o.name }}</el-button>
          </div>
        </el-card>

        <el-card class="box-card" v-if="paramStatus.definitions !== undefined && paramStatus.definitions !== null">
          <div slot="header" class="clearfix">
            <el-row>
              <el-col>
                <el-divider direction="vertical"></el-divider><span style="font-weight: bold;font-size: 25px;">扩展能力</span>
              </el-col>
            </el-row>
            <!-- <el-divider></el-divider> -->
            <el-row :gutter="20">
              <el-col :span="24"><div style="background-color: rgb(213 243 248);"><i class="el-icon-warning" style="color: blue;"></i>启用插件以使用如下扩展能力
</div></el-col>
            </el-row>
          </div>
          <el-table
            :data="paramStatus.definitions"
            style="width: 100%">
            <el-table-column
              prop="name"
              label="名称">
            </el-table-column>
            <el-table-column
              prop="type"
              label="类型">
            </el-table-column>
            <el-table-column
              prop="description"
              label="描述">
            </el-table-column>
          </el-table>
        </el-card>

        <d2-markdown style="padding: 14px;" :source="paramStatus.detail" highlight/>
        
        <div class="demo-drawer__footer">
          <el-button @click="cancelForm">取 消</el-button>
          <el-button @click="disabled(status2.name)" v-if="status2.phase === 'enabled'" type="danger">卸 载</el-button>
          <el-button type="primary" @click="enabled(status2.name)" :loading="loading">{{ loading ? '提交中 ...' : '启 用' }}</el-button>
        </div>
      </div>
    </el-drawer>
  </d2-container>
</template>

<script>
import { repolist, repotest, repoparam, repoparamPost } from '@/api/shop.js'
import vueJsonEditor from 'vue-json-editor'
import util from '@/libs/util.js'

export default {
  components: {
    vueJsonEditor
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      showparam: true,
      list: null,
      enabled_addon_list: null,
      listLoading: true,
      kinds: '',
      dialogVisible: false,
      jsonData: '',
      value: '',
      namespaces: '',
      namespace: '',
      drawer: false,
      title: '',
      dialog: false,
      direction: 'rtl',
      form2: {'cluster':[],'version':''},
      form: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: '',
        version: '',
        cluster: []
      },
      formLabelWidth: '80px',
      paramStatus: undefined,
      loading: false,
      timer: null,
      status2: '',
      rules: {'cluster': [{'required': true}],'version': [{'required': true}]}
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      // this.getNs()
      
      repolist().then(resp => {
        console.log('repolist', resp)
        this.list = resp.data.addons
        this.listLoading = false
      })
      repoparam('enabled_addon').then(resp => {
        console.log('repoparam', resp)
        this.enabled_addon_list = resp.data.enabledAddons
      })
    },
    cancelForm() {
      this.loading = false;
      this.dialog = false;
      clearTimeout(this.timer);
    },
    deploy(name) {
      this.drawer = true
      this.title = name
      this.form2 = {}
      this.rules = {}
      repoparam('addons/' + name).then(resp => {
        console.log('addons/' + name,resp)
        this.paramStatus = resp.data
        if (this.paramStatus.uiSchema !== null) {
          this.paramStatus.uiSchema.forEach((e) => {
            this.rules[e.label] = e.validate
            // this.form2[e.label] = ''
          }) 
        }

        repoparam('addons/' + name + '/status').then(resp => {
          console.log('addons/' + name + '/status',resp)
          this.status2 = resp.data
          if (this.status2.phase === 'enabled') {
            this.form.version = this.status2.installedVersion
            this.form.cluster = this.status2.args.clusters
          }
          this.showparam = false
          this.$nextTick(() => {
            this.showparam = true
          })
        })
      })
    },
    disabled(name) {
      var path = 'addons/' + name + '/disable'
      var data = {
        'name': name
      }
      repoparamPost(path, data).then(resp => {
        console.log('删除成功', resp)
        this.drawer = false
        this.deploy(name)
        if (resp.success) {
          this.$message.success('删除 ' + name + ' 成功')
        } else {
          this.$message.error('删除 ' + name + ' 失败：' + resp.errorMessage)
        }
      })
    },
    enabled(name) {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          if (this.form2.cluster === undefined || this.form2.cluster.length === 0) {
            this.$message.error('部署集群为空或者未定义')
            return false
          }
          if (this.form2.version === undefined || this.form2.cluster === '') {
            this.$message.error('部署版本为空或者未定义')
            return false
          }
          var path = 'addons/' + name + '/enable'
      
          repoparamPost(path, this.form2).then(resp => {
            console.log('部署成功', resp)
            this.drawer = false
            if (resp.success) {
              this.$message.success('部署 ' + name + ' 成功')
            } else {
              this.$message.error('部署 ' + name + ' 失败：' + resp.errorMessage)
            }
          })
        } else {
          this.$message.error('表单数据验证失败！！！');
          return false;
        }
      });
    },
    testurl() {
      repotest().then(resp => {
        console.log('repo test')
      })
    },
    handleClose(done) {
      // if (this.loading) {
      //   return;
      // }
      // this.$confirm('确定要提交表单吗？')
      //   .then(_ => {
      //     this.loading = true;
      //     this.timer = setTimeout(() => {
      //       done();
      //       // 动画关闭需要一定的时间
      //       setTimeout(() => {
      //         this.loading = false;
      //       }, 400);
      //     }, 2000);
      //   })
      //   .catch(_ => {});
      this.drawer = !this.drawer;
    },
    getNs() {
      this.namespace = util.cookies.get('namespace')
    },
    deletetarget(row) {
      this.listLoading = true
      let tmp = {
          "group":"networking.k8s.io",
          "version":"v1",
          "resource":"ingresses",
          "namespace": row.metadata.namespace,
          "name": row.metadata.name
      }
      apidelete(tmp).then(resp => {
        console.log('apidelete', resp)
        this.listLoading = false
      })
      this.fetchData()
    },
    changens(ns) {
      this.listLoading = true
      let tmp = {
          "group":"networking.k8s.io",
          "version":"v1",
          "resource":"ingresses",
          "namespace": ns
      }
      apiserver(tmp).then(resp => {
        console.log('apiserver', resp)
        this.list = resp.data.items
        this.listLoading = false
      })
    },
    openit(row) {
      console.log(row)
      this.jsonData = row
      this.kinds = '[' + row.version + '] ' + row.name
      this.dialogVisible = true
    },
    timeFn(dateBegin) {
      //如果时间格式是正确的，那下面这一步转化时间格式就可以不用了
      var dateEnd = new Date();//获取当前时间
      var dateBegin = new Date(dateBegin)
      var dateDiff = dateEnd.getTime() - dateBegin;//时间差的毫秒数
      var dayDiff = Math.floor(dateDiff / (24 * 3600 * 1000));//计算出相差天数
      var leave1=dateDiff%(24*3600*1000)  //计算天数后剩余的毫秒数
      var hours=Math.floor(leave1/(3600*1000))//计算出小时数
      //计算相差分钟数
      var leave2=leave1%(3600*1000)  //计算小时数后剩余的毫秒数
      var minutes=Math.floor(leave2/(60*1000))//计算相差分钟数
      //计算相差秒数
      var leave3=leave2%(60*1000)   //计算分钟数后剩余的毫秒数
      var seconds=Math.round(leave3/1000)
      // var leave4=leave3%(60*1000)   //计算分钟数后剩余的毫秒数
      // var minseconds=Math.round(leave4/1000)
      // var timeFn = dayDiff+"天 "+hours+"小时 "+minutes+" 分钟"+seconds+" 秒"+minseconds+"毫秒";
      var timeFn = dayDiff+"d"+hours+"h"+minutes+"m"+seconds+"s";
      return timeFn;
    },
    onJsonChange(value) {
      console.log('value: change', value)
    },
    onJsonSave(value) {
      console.log('value save:', value)
      let tmp = {
          "group":"networking.k8s.io",
          "version":"v1",
          "resource":"ingresses",
          "namespace": value.metadata.namespace,
          "name": value.metadata.name,
          "data": value
      }
      apiput(tmp).then(resp => {
        console.log('resp', resp)
        this.fetchData()
        this.dialogVisible = false
      })
    }
  }
}

</script>

<style scoped>
.text {
  font-size: 14px;
}

.item {
  margin-bottom: 3px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both
}

.box-card {
  margin: 0 0 14px 14px;
  width: 100%;
}

.el-table__body tr.current-row > td {
    background-color: #F0F7FF !important; 
}
 
.el-table--striped .el-table__body tr.el-table__row--striped td{
  background: #F5F7FA;
}
 
.el-table th.gutter {
  display: table-cell!important;
}
 
.el-drawer__body{
  overflow-y: scroll;
  margin-bottom: 50px;
}
 
.demo-drawer__footer{
  width: 100%;
  position: absolute;
  bottom: 0;
  left: 0;
  border-top: 1px solid #e8e8e8;
  padding: 10px 16px;
  text-align: right;
  background-color: white;
}
 
:focus{
  outline:0;
}
</style>