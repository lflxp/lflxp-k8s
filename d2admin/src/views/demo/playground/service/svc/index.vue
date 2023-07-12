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
    <el-button @click="fetchData">刷新</el-button>
    <el-button v-if="isrefresh" @click="closeRefresh">停止自动刷新</el-button>
    <el-button v-else @click="autoRefresh">自动刷新</el-button>
    <el-table
      style="margin-top: 10px;"
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
          <el-tag size="mini" type="success">Active</el-tag>
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
      <el-table-column label="Target">
        <template slot-scope="scope">
          <div v-for="data in scope.row.spec.ports" :key="data.name">
            {{ scope.row.spec.clusterIP !== undefined ? scope.row.spec.clusterIP + ":":"" }}{{ data.port }} -> {{ data.targetPort }}/{{ data.protocol }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="Selector" align="center">
        <template slot-scope="scope">
          <div style="text-align:left;" v-for="(k,v) in scope.row.spec.selector" :key="k">
            <span>{{k}}={{v}}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="Type" align="center">
        <template slot-scope="scope">
          {{ scope.row.spec.type }}
        </template>
      </el-table-column>
      <el-table-column align="center" prop="metadata.creationTimestamp" sortable label="Age" width="200">
        <template slot-scope="scope">
          <span>{{ timeFn(scope.row.metadata.creationTimestamp) }}</span>
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
import { apinamespace, apiserver, apiput } from '@/api/table.js'
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
      currentList: '',
      currentPage: 1, // 当前页码
      total: 20, // 总条数
      pageSize: 10,
      namespace: '',
      isrefresh: false
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    closeRefresh() {
      clearInterval(this.timer);
      this.isrefresh = false;
    },
    autoRefresh() {
      this.isrefresh = true;
      this.timer = setInterval(this.fetchData, 3000);
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
          "resource":"services",
          "namespace": this.namespace
      }
      apinamespace().then(resp => {
        console.log('namespace:',resp)
        this.namespaces = resp.data.items
      })
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
          "group":"",
          "version":"v1",
          "resource":"services",
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
      var timeFn = dayDiff+"d"+hours+"h"+minutes+"m"+seconds+"s";
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
      let tmp = {
          "group":"",
          "version":"v1",
          "resource":"services",
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
