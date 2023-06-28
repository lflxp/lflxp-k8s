<template>
  <d2-container>
    <el-dialog title="添加/修改Labels" :visible.sync="dialogFormVisible">
      <el-form>
        <el-form-item label="Key" :label-width="formLabelWidth">
          <el-input v-model="currentLabelKey" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="Value" :label-width="formLabelWidth">
          <el-input v-model="currentLabelValue" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="patchLabels(currentLabelName)">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="添加/修改Annotations" :visible.sync="dialogFormVisibleAnnotations">
      <el-form>
        <el-form-item label="Key" :label-width="formLabelWidth">
          <el-input v-model="currentATKey" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="Value" :label-width="formLabelWidth">
          <el-input v-model="currentATValue" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleAnnotations = false">取 消</el-button>
        <el-button type="primary" @click="patchAnnotations(currentLabelName)">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog
      :title="kinds"
      :visible.sync="dialogVisible"
      width="80%">
      <el-row>
        <el-col :span="24">
          <el-collapse accordion>
            <el-collapse-item title="基础数据" name="1">
              <d2-highlight :code="jsonDataStr" style="margin-bottom: 10px;"/>
            </el-collapse-item>
          </el-collapse>
        </el-col>
      </el-row>
      

      <el-tabs v-model="activeName" type="card" @tab-click="handleClick" style="margin-top: 10px;">
        <el-tab-pane :label="labelTitle" name="first">
          <el-table
            :data="labels"
            element-loading-text="Loading"
            border
            fit
            highlight-current-row
          >
            <el-table-column label="Key" align="left">
              <template slot-scope="scope">
                {{ scope.row.key }}
              </template>
            </el-table-column>
            <el-table-column label="Value" align="center">
              <template slot-scope="scope">
                {{ scope.row.value }}
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  @click="editlabels(scope.row)">修改</el-button>
                  <el-button
                  size="mini"
                  type="danger"
                  @click="deletelabels(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div style="margin-top: 20px">
            <el-button type="success" @click="addlabel">添加</el-button>
          </div>
        </el-tab-pane>
        <el-tab-pane :label="annotationsTitle" name="annotations">
          <el-table
            :data="annotations"
            element-loading-text="Loading"
            border
            fit
            highlight-current-row
          >
            <el-table-column label="Key" align="left">
              <template slot-scope="scope">
                {{ scope.row.key }}
              </template>
            </el-table-column>
            <el-table-column label="Value" align="center">
              <template slot-scope="scope">
                {{ scope.row.value }}
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  @click="editAnnotations(scope.row)">修改</el-button>
                  <el-button
                  size="mini"
                  type="danger"
                  @click="deleteAnnotations(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div style="margin-top: 20px">
            <el-button type="success" @click="addAnnotations">添加</el-button>
          </div>
        </el-tab-pane>
        <el-tab-pane :label="imagesTitle" name="second">
          <el-table
            :data="jsonData.status === undefined ? []:jsonData.status.images"
            element-loading-text="Loading"
            border
            fit
            highlight-current-row
          >
            <el-table-column label="镜像名" align="left">
              <template slot-scope="scope">
                <span v-for="(image, index) in scope.row.names" :key="image">
                  <el-tag type="success" v-if="index == 0">{{ image }}</el-tag>
                  <el-tag type="info" v-else-if="index == 1">{{ image }}</el-tag>
                  <el-tag type="warning" v-else-if="index == 2">{{ image }}</el-tag>
                  <el-tag type="danger" v-else>{{ image }}</el-tag>
                </span>
              </template>
            </el-table-column>
            <el-table-column label="大小(Bytes)" width="200" align="center">
              <template slot-scope="scope">
                {{ scope.row.sizeBytes }}
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane :label="statusTitle" name="状态">
          <el-table
            :data="jsonData.status === undefined ? []:jsonData.status.conditions"
            element-loading-text="Loading"
            border
            fit
            highlight-current-row
          >
            <el-table-column label="Condition" width="200" align="left">
              <template slot-scope="scope">
                {{ scope.row.type }}
              </template>
            </el-table-column>
            <el-table-column label="Status" width="200" align="center">
              <template slot-scope="scope">
                {{ scope.row.status }}
              </template>
            </el-table-column>
            <el-table-column label="Updated" align="center">
              <template slot-scope="scope">
                {{ scope.row.lastTransitionTime }}
              </template>
            </el-table-column>
            <el-table-column label="Reason" align="left">
              <template slot-scope="scope">
                {{ scope.row.reason }}
              </template>
            </el-table-column>
            <el-table-column label="Message" align="left">
              <template slot-scope="scope">
                {{ scope.row.message }}
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="监控" name="grafana">
          <!-- <d2-container-frame :src="grafanaurl"/> -->
          <iframe :src="grafanaurl" width="100%" height="1600" frameborder="0"></iframe>
        </el-tab-pane>
        <el-tab-pane label="YAML" name="fourth">
          <vue-json-editor
            v-model="jsonData"
            :showBtns="true"
            mode="tree"
            lang="zh"
            :expandedOnStart="true"
            @json-change="onJsonChange"
            @json-save="onJsonSave"
          />
        </el-tab-pane>
      </el-tabs>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
    <el-table
      v-loading="listLoading"
      :data="list.slice((currentPage - 1) * pageSize, currentPage * pageSize)"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column
        align="center" 
        sortable 
        label="State" 
        width="95">
        <template slot-scope="scope">
          <el-tag size="mini" type="success" v-if="scope.row.active === true">Active</el-tag>
          <el-tag size="mini" type="danger" v-else>unReady</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="Name">
        <template slot-scope="scope">
          <el-button type="text" @click="openit(scope.row)">{{ scope.row.metadata.name }}</el-button>
          <div v-for="data in scope.row.status.addresses" :key="data.address">
            <span v-if="data.type === 'InternalIP'"> {{ data.address }} </span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="Kubernetes" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.status.nodeInfo.kubeletVersion }}</span>
        </template>
      </el-table-column>
      <el-table-column label="OS" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.metadata.labels['kubernetes.io/os'] }} </span>
        </template>
      </el-table-column>
      <!--el-table-column label="PodCIDR">
        <template slot-scope="scope">
          <span>{{ scope.row.spec.podCIDR }}</span>
        </template>
      </el-table-column>
      <el-table-column label="禁止调度" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.spec.unschedulable !== undefined && scope.row.spec.unschedulable === true">
            <el-popover
              placement="top-start"
              title="taints"
              trigger="hover"
              :content="scope.row.spec.taints">
              <el-button type="text" slot="reference">是</el-button>
            </el-popover>
          </span>
          <span v-else>否</span>
        </template>
      </el-table-column>
      <el-table-column label="InternalIP" align="center">
        <template slot-scope="scope">
          <div v-for="data in scope.row.status.addresses" :key="data.address">
            <span v-if="data.type === 'InternalIP'"> {{ data.address }} </span>
          </div>
        </template>
      </el-table-column-->
      <el-table-column label="容量" align="center" width="200">
        <template slot-scope="scope">
          {{ scope.row.status.capacity.cpu }} 核 {{ parseInt(parseInt(scope.row.status.capacity.memory.replace('Ki',''))/1024/1024) }} G {{ parseInt(parseInt(scope.row.status.capacity['ephemeral-storage'].replace('Mi',''))/1024) }} G
        </template>
      </el-table-column>
      <el-table-column label="CPU使用率">
        <template slot-scope="scope">
          <!--el-progress v-if="scope.row.cpu !== undefined" type="dashboard" :percentage="scope.row.cpu" :format="format" :color="customColors"></el-progress-->
          <el-progress v-if="scope.row.cpu !== undefined" :text-inside="true" :stroke-width="26" :percentage="scope.row.cpu" :color="customColors"></el-progress>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column label="内存使用率">
        <template slot-scope="scope">
          <!--el-progress v-if="scope.row.mem !== undefined" type="dashboard" :percentage="scope.row.mem" :format="format" :color="customColors"></el-progress-->
          <el-progress v-if="scope.row.mem !== undefined" :text-inside="true" :stroke-width="26" :percentage="scope.row.mem" :color="customColors"></el-progress>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column label="磁盘使用率">
        <template slot-scope="scope">
          <!--el-progress v-if="scope.row.disk !== undefined" type="dashboard" :percentage="scope.row.disk" :color="customColors"></el-progress-->
          <el-progress v-if="scope.row.disk !== undefined" :text-inside="true" :stroke-width="26" :percentage="scope.row.disk" :color="customColors"></el-progress>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="metadata.creationTimestamp" sortable label="Age" width="200">
        <template slot-scope="scope">
          <span>{{ timeFn(scope.row.metadata.creationTimestamp) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.spec.unschedulable === undefined"
            size="mini"
            type="danger"
            @click="cordon(scope.row)">禁止调度</el-button>
          <el-button
            v-if="scope.row.spec.unschedulable !== undefined"
            size="mini"
            type="success"
            @click="cordon(scope.row)">恢复调度</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="block" style="margin-top: 15px">
      <el-pagination
        align="center"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[1, 5, 10, 20]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="list.length"
      >
      </el-pagination>
    </div>
  </d2-container>
</template>

<script>
import { apiserver, apipatch, apiput } from '@/api/table.js'
import { prom } from '@/api/monitor'
import vueJsonEditor from 'vue-json-editor'

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
      list: null,
      listLoading: true,
      kinds: '',
      currentnode: '',
      dialogVisible: false,
      jsonData: '',
      value: '',
      namespaces: '',
      currentList: '',
      currentPage: 1, // 当前页码
      total: 20, // 总条数
      pageSize: 10,
      activeName: 'first',
      jsonDataStr: '',
      statusTitle: '',
      imagesTitle: '',
      labelTitle: '',
      dialogFormVisible: false,
      dialogFormVisibleAnnotations: false,
      formLabelWidth: '120px',
      currentLabelKey: '',
      currentLabelValue: '',
      currentLabelName: '',
      currentATKey: '',
      currentATValue: '',
      labels: [],
      annotations: [],
      annotationsTitle:'',
      metrics: [],
      cpu: [],
      mem: [],
      disk: [],
      customColors: [
        {color: '#f56c6c', percentage: 100},
        {color: '#e6a23c', percentage: 80},
        {color: '#5cb87a', percentage: 60},
        {color: '#1989fa', percentage: 40},
        {color: '#6f7ad3', percentage: 20}
      ]
    }
  },
  created() {
    this.fetchData()

    if (this.timer) {
      clearInterval(this.timer);
    } else {
      this.timer = setInterval(this.fetchData, 3000);
    }
  },
  computed: {
    grafanaurl: function() {
      return '/monitor/grafana/d/c_N7_i94k/node-exporter-nodes?orgId=1&refresh=10s&var-datasource=prometheus&var-instance=' + this.currentnode + '&from=now-30m&to=now&theme=light&kiosk'
    }
  },
  methods: {
    cordon(row) {
      this.listLoading = true
      var tmp
      if (row.spec.unschedulable !== undefined) {
        tmp = {
          "group":"",
          "version":"v1",
          "resource":"nodes",
          "name": row.metadata.name,
          "patchdatastrate": {
            "spec": {
              "unschedulable": false 
            }
          }
        }
      } else {
        tmp = {
          "group":"",
          "version":"v1",
          "resource":"nodes",
          "name": row.metadata.name,
          "patchdatastrate": {
            "spec": {
              "unschedulable": true 
            }
          }
        }
      }

      apipatch(tmp).then(resp => {
        console.log('patch resp', resp)
        this.listLoading = false
        this.fetchData()
        this.$notify({
          title: '成功',
          message: '修改节点调度成功',
          type: 'success'
        });
      })
    },
    editlabels(row) {
      this.dialogFormVisible = true
      console.log('editlabels', row)
      this.currentLabelKey = row['key']
      this.currentLabelValue = row['value']
    },
    editAnnotations(row) {
      this.dialogFormVisibleAnnotations = true
      console.log('editlabels', row)
      this.currentATKey = row['key']
      this.currentATValue = row['value']
    },
    addlabel() {
      this.currentLabelKey = ''
      this.currentLabelValue = ''
      this.dialogFormVisible = true
    },
    addAnnotations() {
      this.currentATKey = ''
      this.currentATValue = ''
      this.dialogFormVisibleAnnotations = true
    },
    handleClick(tab, event) {
      console.log(tab, event);
    },
    parseLabels(row, adata) {
      console.log('parseLabels',row, adata)
      row = new Map(Object.entries(row))
      this.labels = []
      for(let key of row.keys()) {
        var tmp = {
          'key': key,
          'value': row.get(key)
        }
        this.labels.push(tmp)
      }

      adata = new Map(Object.entries(adata))
      this.annotations = []
      for(let key of adata.keys()) {
        var tmp = {
          'key': key,
          'value': adata.get(key)
        }
        this.annotations.push(tmp)
      }
      console.log('labels', this.labels, this.annotations)
    },
    getUtils() {
      // https://songjiayang.gitbooks.io/prometheus/content/exporter/nodeexporter_query.html
      prom('100 - (avg by (instance) (irate(node_cpu_seconds_total{mode="idle"}[5m])) * 100)').then(resp => {
        console.log('prom', resp)
        this.metrics = resp.data.data.result
      })
      prom('100 - (avg by (instance) (node_memory_MemAvailable_bytes) /avg by (instance) (node_memory_MemTotal_bytes) * 100)').then(resp => {
        console.log('prom', resp)
        this.mem = resp.data.data.result
      })
      prom('100 - ((sum by (instance) (node_filesystem_avail_bytes{job="node-exporter", fstype!=""}) / sum by (instance) (node_filesystem_size_bytes{job="node-exporter", fstype!=""})) * 100)').then(resp => {
        console.log('prom', resp)
        this.disk = resp.data.data.result
      })
    },
    format(percentage) {
      return percentage === 100 ? '满' : `${percentage}%`;
    },
    fetchData() {
      this.getUtils()
      this.listLoading = true
      // tablelist().then(response => {
      //   console.log('response: ', response)
      //   this.list = response.data.items
      //   this.listLoading = false
      // })
      console.log('prom metrics', this.metrics)
      let tmp = {
          "group":"",
          "version":"v1",
          "resource":"nodes",
          "namespace":""
      }
      apiserver(tmp).then(resp => {
        console.log('apiserver', resp)
        this.list = resp.data.items
        this.listLoading = false
        // 判断节点状态
        this.list.forEach((node, index) => {
          node['active'] = false
          node.status.conditions.forEach((e) => {
            if(e.type == 'Ready' && e.status == 'True') {
              node['active'] = true
            }
          })
          this.metrics.forEach(m => {
            if (node.status.addresses[0].address === m.metric.instance) {
              console.log('m', m,m.value[1])
              node['cpu'] = parseInt(m.value[1], 10)
            }
          })

          this.mem.forEach(m => {
            if (node.status.addresses[0].address === m.metric.instance) {
              console.log('m', m,m.value[1])
              node['mem'] = parseInt(m.value[1], 10)
            }
          })

          this.disk.forEach(m => {
            if (node.status.addresses[0].address === m.metric.instance) {
              console.log('m', m,m.value[1])
              node['disk'] = parseInt(m.value[1], 10)
            }
          })

          this.list[index] = node
          console.log('list', this.list, node, index)

          // 删除label后刷新数据
          // 删除annotations后刷新数据
          // if (this.jsonData !== '') {
            
          //   if (node.metadata.name === this.jsonData.metadata.name) {
          //     this.jsonData = node
          //     this.openit(node)
          //   }
          // }
          
        })
      })
    },
    changens(ns) {
      this.listLoading = true
      let tmp = {
          "group":"",
          "version":"v1",
          "resource":"nodes",
          "namespace": ns
      }
      apiserver(tmp).then(resp => {
        console.log('apiserver', resp)
        this.list = resp.data.items
        this.listLoading = false
        this.list.forEach((node, index) => {
          node['active'] = false
          node.status.conditions.forEach((e) => {
            if(e.type == 'Ready' && e.status == 'True') {
              node['active'] = true
            }
          })
          this.list[index] = node
          console.log('list', this.list, node, index)

          // 删除label后刷新数据
          // 删除annotations后刷新数据
          if (this.jsonData !== '') {
            
            if (node.metadata.name === this.jsonData.metadata.name) {
              this.jsonData = node
              this.openit(node)
            }
          }
        })
      })
    },
    deletelabels(row) {
      console.log(this.currentLabelName, row)
      this.listLoading = true
      var tData = this.jsonData
      delete tData['metadata']['labels'][row['key']]

      let tmp = {
          "group":"",
          "version":"v1",
          "resource":"nodes",
          "name": this.currentLabelName,
          "data": tData
      }
      
      apiput(tmp).then(resp => {
        console.log('delete labels', resp)
        this.listLoading = false
        this.dialogFormVisible = false
        this.labels.forEach((e,index) => {
          if (e['key'] == row['key']) {
            this.labels.splice(index, 1)
          }
        })
        this.fetchData()
      })
    },
    deleteAnnotations(row) {
      console.log(this.currentLabelName, row)
      this.listLoading = true
      var tData = this.jsonData
      delete tData['metadata']['annotations'][row['key']]

      let tmp = {
          "group":"",
          "version":"v1",
          "resource":"nodes",
          "name": this.currentLabelName,
          "data": tData
      }
      
      apiput(tmp).then(resp => {
        console.log('delete labels', resp)
        this.listLoading = false
        this.dialogFormVisibleAnnotations = false
        this.labels.forEach((e,index) => {
          if (e['key'] == row['key']) {
            this.labels.splice(index, 1)
          }
        })
        this.fetchData()
      })
    },
    patchLabels(name) {
      console.log(name)
      this.listLoading = true
      var vv = {}
      vv[this.currentLabelKey] = this.currentLabelValue
      let tmp = {
          "group":"",
          "version":"v1",
          "resource":"nodes",
          "name": name,
          "patchdatastrate": {
            "metadata": {
              "labels": vv
            }
          }
      }
      apipatch(tmp).then(resp => {
        console.log('patch resp', resp)
        this.listLoading = false
        this.dialogFormVisible = false
        // this.dialogVisible = false
        var t = {
          "key": this.currentLabelKey,
          "value": this.currentLabelValue
        }
        this.labels.push(t)
        this.fetchData()
      })
    },
    patchAnnotations(name) {
      console.log(name)
      this.listLoading = true
      var vv = {}
      vv[this.currentATKey] = this.currentATValue
      let tmp = {
          "group":"",
          "version":"v1",
          "resource":"nodes",
          "name": name,
          "patchdatastrate": {
            "metadata": {
              "annotations": vv
            }
          }
      }
      apipatch(tmp).then(resp => {
        console.log('patch resp', resp)
        this.listLoading = false
        this.dialogFormVisibleAnnotations = false
        // this.dialogVisible = false
        var t = {
          "key": this.currentATKey,
          "value": this.currentATValue
        }
        this.labels.push(t)
        this.fetchData()
      })
    },
    openit(row) {
      // console.log(row)
      this.jsonData = row
      this.currentLabelName = row.metadata.name
      this.parseLabels(row.metadata.labels, row.metadata.annotations)
      this.currentnode = row.metadata.name 
      this.kinds = '[' + row.kind + '][ ' + row.metadata.uid + '] ' + row.metadata.name
      this.dialogVisible = true
      this.jsonDataStr = {
        '创建时间': row.metadata.creationTimestamp,
        '节点信息': row.status.nodeInfo,
        // '标签': row.metadata.labels,
        // '注释': row.metadata.annotations,
        '网络地址': {
          'addresses': row.status.addresses,
          'podCIDR': row.spec.podCIDR,
          'podCIDRs': row.spec.podCIDRs
        },
        '容量': {
          'allocatable': row.status.allocatable,
          'capacity': row.status.capacity
        },
        'kubelet': row.status.daemonEndpoints,
        'Spec': row.spec
      }
      this.statusTitle = '状态 ' + row.status.conditions.length
      this.imagesTitle = '镜像 ' + row.status.images.length
      this.labelTitle = '标签 ' + Object.keys(row.metadata.labels).length
      this.annotationsTitle = '注释 ' + Object.keys(row.metadata.annotations).length
      this.jsonDataStr = JSON.stringify(this.jsonDataStr, null, 2)
      // console.log('1111111', this.jsonDataStr)
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
      var timeFn = ''
      if (dayDiff !== 0) {
        timeFn += dayDiff+" 天 "
      }
      if (hours !== 0) {
        timeFn += hours+" 小时 "
      }
      if (minutes !== 0) {
        timeFn += minutes+" 分钟 "
      }
      if (seconds !== 0) {
        timeFn += seconds+" 秒"
      }
      return timeFn;
    },
    //每页条数改变时触发 选择一页显示多少行
    handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
        this.currentPage = 1;
        this.pageSize = val;
    },
    //当前页改变时触发 跳转其他页
    handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
        this.currentPage = val;
    },
    onJsonChange(value) {
      console.log('value: change', value)
    },
    onJsonSave(value) {
      console.log('value save:', value)
    }
  }
}
</script>
