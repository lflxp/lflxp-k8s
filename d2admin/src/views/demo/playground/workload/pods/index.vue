<template>
  <d2-container>
    <el-dialog
      :title="kinds"
      :visible.sync="dialogVisible"
      width="80%">
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
      podValue: '',
      currentList: '',
      currentPage: 1, // 当前页码
      total: 20, // 总条数
      pageSize: 10,
      namespace: '',
      podValue: '',
      sshValue: '',
      currentNameList: []
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    showLogs2(row,containerName) {
      let url = '/ws/logs/html/' + row.metadata.namespace + '/' + row.metadata.name + '/' + containerName;
      window.open(url,row.metadata.namespace + '-' + row.metadata.name,"height=600,width=1200,top=0,left=200,fullscreen=yes,scrollbars=0,location=no")
      this.podValue = ''
    },
    showLogs(row) {
      let url = '/ws/logs/html/' + row.metadata.namespace + '/' + row.metadata.name + '/' + row.spec.containers[0].name;
      window.open(url,row.metadata.namespace + '-' + row.metadata.name,"height=600,width=1200,top=0,left=200,fullscreen=no,scrollbars=0,location=no")
    },
    showssh(row,containerName) {
      let url = '/ws/ssh/html/' + row.metadata.namespace + '/' + row.metadata.name + '/' + containerName;
      window.open(url,row.metadata.namespace + '-' + row.metadata.name,"height=600,width=1000,top=0,left=200,fullscreen=no,scrollbars=0,location=no")
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
      this.jsonData = row
      this.kinds = '[' + row.kind + '] ' + row.metadata.name
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