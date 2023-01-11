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
    <el-button @click="testurl">jump</el-button>
    <el-table
      v-loading="listLoading"
      :data="list.slice((currentPage - 1) * pageSize, currentPage * pageSize)"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >

      <el-table-column label="Icon" width="200">
        <template slot-scope="scope">
          <el-image
            style="width: 100px; height: 100px"
            :src="scope.row.icon"
            :fit="cover"></el-image>
        </template>
      </el-table-column>
      <el-table-column label="Name">
        <template slot-scope="scope">
          <el-button type="text" @click="openit(scope.row)">{{ scope.row.name }}</el-button>
        </template>
      </el-table-column>
      <el-table-column label="Version" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.version }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Tags" width="200">
        <template slot-scope="scope">
          <div v-for="x in scope.row.tags" :key="x">
            <el-tag
              type="success"
              disable-transitions>{{x}}</el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="Dependencies" width="200">
        <template slot-scope="scope">
          <div v-for="x in scope.row.dependencies" :key="x.name">
            <el-tag
              type="primary"
              disable-transitions>{{x.name}}</el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini">部署</el-button>
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
import { repolist, repotest } from '@/api/shop.js'
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
      namespace: '',
      currentList: '',
      currentPage: 1, // 当前页码
      total: 20, // 总条数
      pageSize: 10
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
    },
    testurl() {
      repotest().then(resp => {
        console.log('repo test')
      })
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
