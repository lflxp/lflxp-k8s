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
    <el-select 
      v-model="value" 
      filterable 
      clearable
      placeholder="请选择">
      <el-option
        v-for="item in list"
        :key="item.resources.name"
        :label="item.resources.name"
        :value="item.resources.name">
      </el-option>
    </el-select>
    <el-button @click="fetchData">刷新</el-button>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="ID" width="95">
        <template slot-scope="scope">
          {{ scope.$index }}
        </template>
      </el-table-column>
      <el-table-column label="Name" sortable prop="resources.name" align="left">
        <template slot-scope="scope">
          <span>{{ scope.row.resources.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="shortName" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.resources.shortNames !== undefined ? scope.row.resources.shortNames.join(',') : '' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="APIVERSION" sortable prop="apiVersion" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.apiVersion }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Group" sortable prop="group" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.group }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Namespaced" sortable prop="resources.namespaced" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.resources.namespaced }}</span>
        </template>
      </el-table-column>
      <el-table-column label="KIND" sortable prop="resources.kind" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.resources.kind }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="showinfo(scope.row)">查看</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-drawer
      :title="title"
      :visible.sync="drawer"
      :direction="direction"
      size="90%"> <!-- 
      :before-close="handleClose"
    -->
      <el-select 
        v-if="isnamespace"
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
      </el-select>
      <el-button @click="showinfo(currentRow)">刷新</el-button>
      <el-table
        v-loading="listLoading2"
        :data="list2.slice((currentPage2 - 1) * pageSize2, currentPage2 * pageSize2)"
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
          <template slot-scope="scope" v-if="scope.row.status !== undefined">
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
        <el-table-column label="Kind" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.kind }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Namespace" align="center" v-if="isnamespace">
          <template slot-scope="scope">
            <span>{{ scope.row.metadata.namespace }}</span>
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
          :current-page="currentPage2"
          :page-sizes="[1, 5, 10, 20]"
          :page-size="pageSize2"
          layout="total, sizes, prev, pager, next, jumper"
          :total="list2.length"
        >
        </el-pagination>
      </div>
    </el-drawer>
  </d2-container>
</template>

<script>
import { apiresource,apinamespace, apiserver, apiput } from '@/api/table.js'
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
      dialogVisible: false,
      jsonData: '',
      value: '',
      namespaces: '',
      drawer: false,
      direction: 'rtl',
      currentPage2: 1, // 当前页码
      total2: 20, // 总条数
      pageSize2: 10,
      list2: [],
      listLoading2: true,
      title: '',
      isnamespace: false,
      currentRow: ''
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      apiresource().then(resp => {
        console.log('apiresource', resp)
        let result = []
        resp.data.apiresourceListSlice.forEach(rs2 => {
          rs2.resources.forEach(res => {
            let tmp_group = rs2.groupVersion.split("/")
            let tmp = {
              "apiVersion": tmp_group.length === 2 ? tmp_group[1]:tmp_group[0],
              "group": tmp_group.length === 2 ? tmp_group[0]:"",
              "kind": rs2.kind,
              "resources": res
            }
            result.push(tmp)
          })
        })
        console.log('result:', result)
        this.list = result.sort()
        this.listLoading = false
      })
      apinamespace().then(resp => {
        console.log('namespace:',resp)
        this.namespaces = resp.data.items
      })
    },
    openit(row) {
      console.log(row)
      this.jsonData = row
      this.kinds = '[' + row.kind + '] ' + row.metadata.name
      this.dialogVisible = true
    },
    showinfo(row) {
      this.title = row.resources.name + " - " + row.group + " - " + row.apiVersion 
      this.listLoading2 = true
      this.isnamespace = row.resources.namespaced
      this.currentRow = row
      this.list2 = []
      let tmp = {
          "group":row.group,
          "version":row.apiVersion,
          "resource":row.resources.name,
          "namespace": ""
      }
      apiserver(tmp).then(resp => {
        console.log('showinfooooooooooooooo------------------', resp)
        this.list2 = resp.data.items
        this.total = this.list2.length
        this.listLoading2 = false
        this.drawer = true
      })
    },
    changens(ns) {
      this.listLoading2 = true
      let tmp = {
          "group":this.currentRow.group,
          "version":this.currentRow.apiVersion,
          "resource":this.currentRow.resources.name,
          "namespace": ns
      }
      apiserver(tmp).then(resp => {
        console.log('apiserver', resp)
        this.list2 = resp.data.items
        this.total = this.list2.length
        this.listLoading2 = false
      })
    },
    //每页条数改变时触发 选择一页显示多少行
    handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
        this.currentPage2 = 1;
        this.pageSize2 = val;
    },
    //当前页改变时触发 跳转其他页
    handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
        this.currentPage2 = val;
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done();
        })
        .catch(_ => {});
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
      var timeFn = dayDiff+" 天 "+hours+" 小时 "+minutes+" 分钟 "+seconds+" 秒";
      return timeFn;
    },
    onJsonChange(value) {
      console.log('value: change', value)
    },
    onJsonSave(value) {
      console.log('value save:', value)
      let tmp = {
          "group":this.currentRow.group,
          "version":this.currentRow.apiVersion,
          "resource":this.currentRow.resources.name,
          "namespace": value.metadata.namespace,
          "name": value.metadata.name,
          "data": value
      }
      apiput(tmp).then(resp => {
        console.log('resp', resp)
        this.showinfo(this.currentRow)
        this.dialogVisible = false
      })
    }
  }
}
</script>
