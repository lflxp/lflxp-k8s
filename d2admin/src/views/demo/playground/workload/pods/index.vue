<template>
  <d2-container>
    <el-dialog title="添加/修改Labels" :visible.sync="dialogFormVisible">
      <el-form>
        <el-form-item label="Key" :label-width="formLabelWidth">
          <el-input v-model="currentLabelKey" autocomplete="off" :disabled="disableKey"></el-input>
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
          <el-input v-model="currentATKey" autocomplete="off" :disabled="disableKey"></el-input>
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
      center="true"
      :visible.sync="dialogVisible"
      width="90%">
      <el-row style="margin-bottom: 10px;">
        <el-col :span="24">
          <el-collapse accordion>
            <el-collapse-item title="基础数据" name="1">
              <d2-highlight :code="jsonDataStr" style="margin-bottom: 10px;"/>
            </el-collapse-item>
          </el-collapse>
        </el-col>
      </el-row>

      <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
        <el-tab-pane :label="containertitle" name="first">
          <el-table
            :data="containers"
            element-loading-text="Loading"
            border
            fit
            highlight-current-row
          >
            <el-table-column
              align="center" 
              sortable 
              label="Status" >
              <template slot-scope="scope">
                <el-tag size="mini" type="success" v-if="scope.row.state.running !== undefined">Running</el-tag>
                <el-tag size="mini" type="warning" v-else-if="scope.row.state.terminated !== undefined">Terminated</el-tag>
                <el-tag size="mini" type="danger" v-else>{{ scope.row.state }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="Ready" align="center">
              <template slot-scope="scope">
                <div v-if="scope.row.ready">
                  <i class="el-icon-check"></i>
                </div>
                <div v-else>
                  <i class="el-icon-close"></i>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="Name">
              <template slot-scope="scope">
                {{ scope.row.name }}
              </template>
            </el-table-column>
            <el-table-column label="Image" width="400">
              <template slot-scope="scope">
                <span>{{ scope.row.image }}</span>
              </template>
            </el-table-column>
            <el-table-column label="InitContainer" align="center">
              <template slot-scope="scope">
                <div v-if="scope.row.init">
                  <i class="el-icon-check" type="success"></i>
                </div>
                <div v-else>
                  -
                </div>
              </template>
            </el-table-column>
            <el-table-column label="Restart" align="center">
              <template slot-scope="scope">
                {{ scope.row.restartCount }}
              </template>
            </el-table-column>
            <el-table-column label="Started" align="center">
              <template slot-scope="scope">
                <div v-if="scope.row.started">
                  <i class="el-icon-check"></i>
                </div>
                <div v-else>
                  -
                </div>
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="text"
                  @click="showLogsstatus(scope.row.name)">日志</el-button>
                <el-button
                  size="mini"
                  type="text"
                  @click="showsshstatus(scope.row.name)">SSH</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane :label="labelTitle" name="labels">
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
        <el-tab-pane label="状态" name="状态">
          <el-table
            :data="jsonData.status === undefined ? []:jsonData.status.conditions"
            element-loading-text="Loading"
            border
            fit
            highlight-current-row
          >
            <el-table-column label="Condition" width="200" align="center">
              <template slot-scope="scope">
                {{ scope.row.type }}
              </template>
            </el-table-column>
            <el-table-column label="Status" width="200" align="center">
              <template slot-scope="scope">
                {{ scope.row.status }}
              </template>
            </el-table-column>
            <el-table-column label="Updated" width="200" align="center">
              <template slot-scope="scope">
                {{ scope.row.lastTransitionTime }}
              </template>
            </el-table-column>
            <el-table-column label="Message" align="center">
              <template slot-scope="scope">
                {{ scope.row.message }}
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane :label="eventtitle" name="事件" v-if="selectEvents.length !== 0">
          <el-table
            :data="selectEvents"
            element-loading-text="Loading"
            border
            fit
            highlight-current-row
          >
            <el-table-column label="Reason" width="200" align="center">
              <template slot-scope="scope">
                {{ scope.row.reason }}
              </template>
            </el-table-column>
            <el-table-column label="Updated" width="200" align="center">
              <template slot-scope="scope">
                {{ scope.row.metadata.creationTimestamp }}
              </template>
            </el-table-column>
            <el-table-column label="Message" align="left">
              <template slot-scope="scope">
                {{ scope.row.message }}
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane :label="'相关资源 ' + (ownerresources.length + resources.length)" name="相关资源">
          <el-card class="box-card" style="margin-bottom: 10px;">
            <div slot="header" class="clearfix">
              <span>关联References {{ ownerresources.length }}</span>
            </div>
            <el-table
              :data="ownerresources"
              element-loading-text="Loading"
              border
              fit
              highlight-current-row
            >
              <el-table-column label="Name" align="center">
                <template slot-scope="scope">
                  {{ scope.row.name }}
                </template>
              </el-table-column>
              <el-table-column label="Kind" align="center">
                <template slot-scope="scope">
                  {{ scope.row.kind }}
                </template>
              </el-table-column>
              <el-table-column label="Controller" align="center">
                <template slot-scope="scope">
                  {{ scope.row.controller }}
                </template>
              </el-table-column>
              <el-table-column label="是否集联删除" align="center">
                <template slot-scope="scope">
                  <div v-if="scope.row.blockOwnerDeletion">
                    <i class="el-icon-check"></i>
                  </div>
                  <div v-else>
                    <i class="el-icon-close"></i>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="Namespace" align="left">
                <template slot-scope="scope">
                  {{ namespace }}
                </template>
              </el-table-column>
            </el-table>
          </el-card>
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>引用资源 {{ resources.length }}</span>
            </div>
            <el-table
              :data="resources"
              element-loading-text="Loading"
              border
              fit
              highlight-current-row
            >
              <el-table-column label="Name" align="left">
                <template slot-scope="scope">
                  {{ scope.row.name }}
                </template>
              </el-table-column>
              <el-table-column label="Kind" align="center">
                <template slot-scope="scope">
                  {{ scope.row.kind }}
                </template>
              </el-table-column>
              <el-table-column label="Type" align="center">
                <template slot-scope="scope">
                  {{ scope.row.type }}
                </template>
              </el-table-column>
              <el-table-column label="Namespace" align="center">
                <template slot-scope="scope">
                  {{ scope.row.namespace }}
                </template>
              </el-table-column>
            </el-table>
          </el-card>
        </el-tab-pane>
        <el-tab-pane label="监控" name="grafana">
          <!-- <d2-container-frame :src="grafanaurl"/> -->
          <iframe :src="grafanaurl" width="100%" height="1600" frameborder="0"></iframe>
        </el-tab-pane>
        <el-tab-pane label="YAML" name="second">
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
    <el-select 
      v-model="podValue" 
      filterable 
      clearable
      @change="changepods"
      @clear="clears"
      placeholder="请选择Pods进行精确查询">
      <el-option
        v-for="item in list"
        :key="item.metadata.name"
        :label="item.metadata.name"
        :value="item.metadata.name">
      </el-option>
    </el-select>
    <el-button @click="fetchData">刷新</el-button>
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
        label="Status" 
        prop="status.phase"
        width="95">
        <template slot-scope="scope">
          <el-tag size="mini" type="success" v-if="scope.row.status.phase === 'Running'">{{ scope.row.status.phase }}</el-tag>
          <el-tag size="mini" type="warning" v-else-if="scope.row.status.phase === 'Succeeded'">{{ scope.row.status.phase }}</el-tag>
          <el-tag size="mini" type="danger" v-else>{{ scope.row.status.phase }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="Name">
        <template slot-scope="scope">
          <el-button type="text" @click="openit(scope.row)">{{ scope.row.metadata.name }}</el-button>
        </template>
      </el-table-column>
      <el-table-column label="Image" width="200">
        <template slot-scope="scope">
          {{ scope.row.spec.containers[0].image }}
          <div v-if="scope.row.spec.containers.length > 1">
            <br/>
            <el-button type="text">+{{ scope.row.spec.containers.length }} more</el-button>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="Namespace" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.metadata.namespace }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Ready" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.status.containerStatuses === undefined ? '-' : scope.row.status.containerStatuses.map(data => data.ready === true ? 1:0).reduce(function(prev,curr,idx,arr) { return prev + curr}) }}/{{ scope.row.spec.containers.length }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Restart" align="center">
        <template slot-scope="scope">
          {{ scope.row.status.containerStatuses === undefined ? '-' : scope.row.status.containerStatuses[0].restartCount }}
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="IP" width="110" align="center">
        <template slot-scope="scope">
          <el-tag type="primary" size="mini">{{ scope.row.status.podIP }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="Node" width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.status.hostIP }}
        </template>
      </el-table-column>
      <el-table-column align="center" prop="metadata.creationTimestamp" sortable label="Age" width="200">
        <template slot-scope="scope">
          <span>{{ timeFn(scope.row.metadata.creationTimestamp) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <!-- <el-button
            size="mini"
            @click="showLogs(scope.row)">日志</el-button> -->
          <el-select 
            clearable
            v-model="podValue"
            @focus="getC(scope.row)"
            @change="showLogs2(scope.row,podValue)"
            placeholder="容器日志">
            <el-option
              v-for="item in currentNameList"
              :key="item.name"
              :label="item.name"
              :value="item.name">
            </el-option>
          </el-select>
          <!-- <el-button
            size="mini"
            @click="showssh(scope.row)">SSH</el-button> -->
          <el-select 
            clearable
            v-model="sshValue"
            @change="showssh(scope.row,sshValue)"
            placeholder="SSH容器">
            <el-option
              v-for="item in scope.row.spec.containers"
              :key="item.name"
              :label="item.name"
              :value="item.name">
            </el-option>
          </el-select>
          <el-button
            size="mini"
            @click="deletepod(scope.row)">删除</el-button>
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
import { apiserver, apiput, apidelete, apipatch } from '@/api/table.js'
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
      activeName: 'first',
      list: null,
      listLoading: true,
      kinds: '',
      dialogVisible: false,
      jsonData: '',
      jsonDataStr: '',
      value: '',
      namespaces: '',
      podValue: '',
      currentList: '',
      currentPage: 1, // 当前页码
      total: 20, // 总条数
      pageSize: 10,
      namespace: '',
      podValue: '',
      sshValue: '',
      currentNameList: [],
      containers: [],
      selecetNs: '',
      selectName: '',
      selectCon: [],
      events: [],
      selectEvents: [],
      eventtitle: '',
      containertitle: '',
      resources: [],
      ownerresources: [],
      timer: null,
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
      annotationsTitle: '',
      disableKey: true
    }
  },
  computed: {
    grafanaurl: function() {
      return '/monitor/grafana/d/6581e46e4e5c7ba40a07646395ef7b23/kubernetes-compute-resources-pod?orgId=1&refresh=10s&var-datasource=prometheus&var-namespace=' + this.namespace + '&var-pod=' + this.currentLabelName + '&from=now-30m&to=now&theme=light&kiosk'
    }
  },
  created() {
    this.fetchData()

    if (this.timer) {
      clearInterval(this.timer);
    } else {
      this.timer = setInterval(this.fetchData, 30000);
    }
  },
  methods: {
    editlabels(row) {
      this.dialogFormVisible = true
      console.log('editlabels', row)
      this.currentLabelKey = row['key']
      this.currentLabelValue = row['value']
      this.disableKey = true
    },
    editAnnotations(row) {
      this.dialogFormVisibleAnnotations = true
      console.log('editlabels', row)
      this.currentATKey = row['key']
      this.currentATValue = row['value']
      this.disableKey = true
    },
    addlabel() {
      this.currentLabelKey = ''
      this.currentLabelValue = ''
      this.dialogFormVisible = true
      this.disableKey = false
    },
    addAnnotations() {
      this.currentATKey = ''
      this.disableKey = false
      this.currentATValue = ''
      this.dialogFormVisibleAnnotations = true
    },
    parseLabels(row) {
      console.log('parseLabels',row)
      if (row.labels !== undefined) {
        var rowL = new Map(Object.entries(row.labels))
        this.labels = []
        for(let key of rowL.keys()) {
          var tmp = {
            'key': key,
            'value': rowL.get(key)
          }
          this.labels.push(tmp)
        }
      }
      
      if (row.annotations !== undefined) {
        var adata = new Map(Object.entries(row.annotations))
        this.annotations = []
        for(let key of adata.keys()) {
          var tmp = {
            'key': key,
            'value': adata.get(key)
          }
          this.annotations.push(tmp)
        }
      }
      
      console.log('labels', this.labels, this.annotations)
    },
    deletelabels(row) {
      console.log(this.currentLabelName, row)
      this.listLoading = true
      var tData = this.jsonData
      delete tData['metadata']['labels'][row['key']]

      let tmp = {
          "group":"",
          "version":"v1",
          "resource":"pods",
          "namespace": this.selecetNs,
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
          "resource":"pods",
          "namespace": this.selecetNs,
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
          "resource":"pods",
          "namespace": this.selecetNs,
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
        this.labels.forEach((e,index) => {
          if (e['key'] == this.currentLabelKey) {
            this.labels.splice(index, 1)
          }
        })
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
          "resource":"pods",
          "namespace": this.selecetNs,
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
        this.labels.forEach((e,index) => {
          if (e['key'] == this.currentATKey) {
            this.labels.splice(index, 1)
          }
        })
        this.fetchData()
      })
    },
    handleClick(tab, event) {
      console.log(tab, event);
    },
    showLogs2(row,containerName) {
      let url = '/ws/logs/html/' + row.metadata.namespace + '/' + row.metadata.name + '/' + containerName;
      window.open(url,row.metadata.namespace + '-' + row.metadata.name,"height=600,width=1200,top=0,left=200,fullscreen=yes,scrollbars=0,location=no")
      this.podValue = ''
    },
    showLogsstatus(containerName) {
      let url = '/ws/logs/html/' + this.selecetNs + '/' + this.selectName + '/' + containerName;
      window.open(url,this.selecetNs + '-' + this.selectName,"height=600,width=1200,top=0,left=200,fullscreen=no,scrollbars=0,location=no")
    },
    showssh(row,containerName) {
      let url = '/ws/ssh/html/' + row.metadata.namespace + '/' + row.metadata.name + '/' + containerName;
      window.open(url,row.metadata.namespace + '-' + row.metadata.name,"height=600,width=1000,top=0,left=200,fullscreen=no,scrollbars=0,location=no")
      this.sshValue = ''
    },
    showsshstatus(containerName) {
      let url = '/ws/ssh/html/' + this.selecetNs + '/' + this.selectName + '/' + containerName;
      window.open(url,this.selecetNs + '-' + this.selectName,"height=600,width=1000,top=0,left=200,fullscreen=no,scrollbars=0,location=no")
      this.sshValue = ''
    },
    getC(row) {
      this.currentNameList = []
      if (row.spec.containers.length > 0) {
        row.spec.containers.forEach((e) => {
          this.currentNameList.push(e)
        })
      }
      if (row.spec.initContainers.length > 0) {
        row.spec.initContainers.forEach((e) => {
          this.currentNameList.push(e)
        })
      }
      console.log(this.currentNameList)
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
    getNs() {
      this.namespace = util.cookies.get('namespace')
    },
    clears() {
      this.dialogVisible = false
      this.jsonData = ''
    },
    fetchData() {
      this.listLoading = true
      // tablelist().then(response => {
      //   console.log('response: ', response)
      //   this.list = response.data.items
      //   this.listLoading = false
      // })
      this.getNs()
      let tmp = {
          "group":"",
          "version":"v1",
          "resource":"pods",
          "namespace": this.namespace
      }
      // apinamespace().then(resp => {
      //   console.log('namespace:',resp)
      //   this.namespaces = resp.data.items
      // })
      apiserver(tmp).then(resp => {
        console.log('apiserver', resp)
        this.list = resp.data.items
        this.total = this.list.length
        this.listLoading = false
        // 判断节点状态
        this.list.forEach((node, index) => {
          // 删除label后刷新数据
          // 删除annotations后刷新数据
          if (this.jsonData !== '') {
            if (node.metadata.name === this.jsonData.metadata.name) {
              this.jsonData = node
              // this.openit(node)
              this.parseLabels(node.metadata)
            }
          }
        })
      })

      let ee = {
        "group":"",
        "version":"v1",
        "resource":"events",
        "namespace": this.namespace
      }

      apiserver(ee).then(resp => {
        console.log('events', resp);
        this.events = resp.data.items
      })
    },
    changens(ns) {
      this.listLoading = true
      let tmp = {
          "group":"",
          "version":"v1",
          "resource":"pods",
          "namespace": ns
      }
      apiserver(tmp).then(resp => {
        console.log('apiserver', resp)
        this.list = resp.data.items
        this.total = this.list.length
        this.listLoading = false
        // 判断节点状态
        this.list.forEach((node, index) => {
          // 删除label后刷新数据
          // 删除annotations后刷新数据
          if (this.jsonData !== '') {
            
            if (node.metadata.name === this.jsonData.metadata.name) {
              this.jsonData = node
              // this.openit(node)
              this.parseLabels(node.metadata)
            }
          }
        })
      })
    },
    deletepod(row) {
      this.listLoading = true
      let tmp = {
          "group":"",
          "version":"v1",
          "resource":"pods",
          "namespace": row.metadata.namespace,
          "name": row.metadata.name
      }
      apidelete(tmp).then(resp => {
        console.log('apidelete', resp)
        this.listLoading = false
      })
      this.fetchData()
    },
    changepods(value) {
      this.podValue = value
      let tmp = JSON.parse(JSON.stringify(this.list))
      this.currentList = tmp
      this.list = []
      this.currentList.forEach(data => {
        if (data.metadata.name === value) {
          this.list.push(data)
        }
      })
      this.total = this.list.length
    },
    clears() {
      this.changens(this.value)
    },
    openit(row) {
      console.log(row)
      this.selecetNs = row.metadata.namespace
      this.selectName = row.metadata.name
      this.jsonData = row
      this.currentLabelName = row.metadata.name
      this.parseLabels(row.metadata)
      this.jsonDataStr = {
        "命名空间": row.metadata.namespace,
        "开始时间": row.metadata.creationTimestamp,
        "容器IP": row.status.podIP,
        "节点IP": row.status.hostIP,
        "标签": row.metadata.labels,
        "注释": row.metadata.annotations
      }
      this.jsonDataStr = JSON.stringify(this.jsonDataStr, null, 2)
      this.containers = []
      if (row.status.containerStatuses !== undefined) {
        if (row.status.containerStatuses.length > 0) {
          row.status.containerStatuses.forEach((e) => {
            this.containers.push(e)
          })
        }
      }
      
      if (row.status.initContainerStatuses !== undefined) {
        if (row.status.initContainerStatuses.length > 0) {
          row.status.initContainerStatuses.forEach((e) => {
            e['init'] = true
            this.containers.push(e)
          })
        }
      }
      this.containertitle = '容器 ' + this.containers.length

      this.selectEvents = []
      this.events.forEach((e) => {
        if (e.involvedObject.name === row.metadata.name) {
          this.selectEvents.push(e)
        }
      })
      this.eventtitle = '事件 ' + this.selectEvents.length

      this.kinds = '[' + row.kind + '] ' + row.metadata.name

      // 过滤资源
      this.resources = [{
        "type": "spec",
        "kind": "ServiceAccount",
        "name": row.spec.serviceAccount,
        "namespace": row.metadata.namespace
      }]
      this.ownerresources = []
      if (row.metadata.ownerReferences != undefined) {
        row.metadata.ownerReferences.forEach((e) => {
          this.ownerresources.push(e)
        })
      }

      if (row.spec.containers != undefined) {
        row.spec.containers.forEach((e) => {
          if (e.env != undefined) {
            e.env.forEach((v) => {
              if (v.valueFrom != undefined) {
                if (v.valueFrom.secretKeyRef != undefined) {
                  var tmp = {
                    "type": "env",
                    "kind": "secret",
                    "name": v.valueFrom.secretKeyRef.name,
                    "namespace": row.metadata.namespace
                  }
                  this.resources.push(tmp)
                } else if (v.valueFrom.configMapKeyRef != undefined) {
                  var tmp = {
                    "type": "env",
                    "kind": "secret",
                    "name": v.valueFrom.configMapKeyRef.name,
                    "namespace": row.metadata.namespace
                  }
                  this.resources.push(tmp)
                }
              }
            })
          }
        })
      }

      if (row.spec.volumes != undefined) {
        row.spec.volumes.forEach((e) => {
          if (e.secret != undefined) {
            var tmp = {
              "type": "volume",
              "kind": "secret",
              "name": e.secret.secretName,
              "namespace": row.metadata.namespace
            }
            this.resources.push(tmp)
          } else if (e.configMap != undefined) {
            var tmp = {
              "type": "volume",
              "kind": "configMap",
              "name": e.configMap.name,
              "namespace": row.metadata.namespace
            }
            this.resources.push(tmp)
          }
        })
      }

      // console.log(this.resources,this.ownerresources)
      this.dialogVisible = true
      if (row.metadata.labels !== undefined) {
        this.labelTitle = '标签 ' + Object.keys(row.metadata.labels).length
      } else {
        this.labelTitle = '标签 0'
      }
      if (row.metadata.annotations !== undefined) {
        this.annotationsTitle = '注释 ' + Object.keys(row.metadata.annotations).length
      } else {
        this.annotationsTitle = '注释 0'
      }
      
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
    onJsonChange(value) {
      console.log('value: change', value)
    },
    onJsonSave(value) {
      console.log('value save:', value)
      let tmp = {
          "group":"",
          "version":"v1",
          "resource":"pods",
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
