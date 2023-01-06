<template>
  <d2-container>
    <el-dialog
      :title="kinds"
      :visible.sync="dialogVisible"
      width="80%">
      <h1>原文</h1>
      <vue-json-editor
        v-model="jsonData"
        :showBtns="true"
        mode="tree"
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
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column
        align="center" 
        sortable 
        label="State" 
        prop="status.phase"
        width="95">
        <template slot-scope="scope">
          <el-tag size="mini" type="success" v-if="scope.row.status.readyReplicas === scope.row.status.replicas">Activing</el-tag>
          <el-tag size="mini" type="danger" v-else>Progressing</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="Name">
        <template slot-scope="scope">
          <el-button type="text" @click="openit(scope.row)">{{ scope.row.metadata.name }}</el-button>
        </template>
      </el-table-column>
      <el-table-column label="Namespace" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.metadata.namespace }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Image" width="200">
        <template slot-scope="scope">
          {{ scope.row.spec.template.spec.containers[0].image }}
          <div v-if="scope.row.spec.template.spec.containers.length > 1">
            <br/>
            <el-button type="text">+{{ scope.row.spec.template.spec.containers.length }} more</el-button>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="Ready" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.status.readyReplicas === undefined ? 0 : scope.row.status.readyReplicas }}/{{ scope.row.status.replicas === undefined ? 0 : scope.row.status.replicas }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Up-to-date" align="center">
        <template slot-scope="scope">
          {{ scope.row.status.updatedReplicas === undefined ? 0 : scope.row.status.updatedReplicas }}
        </template>
      </el-table-column>
      <el-table-column label="Available" align="center">
        <template slot-scope="scope">
          {{ scope.row.status.availableReplicas === undefined ? 0 : scope.row.status.availableReplicas }}
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
            size="mini"
            @click="deletepod(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </d2-container>
</template>

<script>
import { apiserver, apiput, apidelete } from '@/api/table.js'
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
      list: null,
      listLoading: true,
      kinds: '',
      dialogVisible: false,
      jsonData: '',
      value: '',
      namespaces: '',
      namespace: ''
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      // tablelist().then(response => {
      //   console.log('response: ', response)
      //   this.list = response.data.items
      //   this.listLoading = false
      // })
      this.getNs()
      let tmp = {
          "group":"apps",
          "version":"v1",
          "resource":"daemonsets",
          "namespace": this.namespace
      }
      // apinamespace().then(resp => {
      //   console.log('namespace:',resp)
      //   this.namespaces = resp.data.items
      // })
      apiserver(tmp).then(resp => {
        console.log('apiserver', resp)
        this.list = resp.data.items
        this.listLoading = false
      })
    },
    getNs() {
      this.namespace = util.cookies.get('namespace')
    },
    changens(ns) {
      this.listLoading = true
      let tmp = {
          "group":"apps",
          "version":"v1",
          "resource":"daemonsets",
          "namespace": ns
      }
      apiserver(tmp).then(resp => {
        console.log('apiserver', resp)
        this.list = resp.data.items
        this.listLoading = false
      })
    },
    deletepod(row) {
      this.listLoading = true
      let tmp = {
          "group":"apps",
          "version":"v1",
          "resource":"daemonsets",
          "namespace": row.metadata.namespace,
          "name": row.metadata.name
      }
      apidelete(tmp).then(resp => {
        console.log('apidelete', resp)
        this.listLoading = false
      })
      this.fetchData()
    },
    openit(row) {
      console.log(row)
      this.jsonData = row
      this.kinds = row.kind
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
          "group":"apps",
          "version":"v1",
          "resource":"daemonsets",
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
