<template>
  <d2-container class="page">
    <d2-page-cover>
      <d2-icon-svg class="logo" name="d2-admin"/>
      <template slot="footer">
        <div class="btn-group">
          <span class="btn-group__btn" @click="$open('https://github.com/d2-projects')">开源组织</span> |
          <span class="btn-group__btn" @click="$open('https://d2.pub/zh/doc/d2-admin')">文档</span> |
          <span class="btn-group__btn" @click="$open('https://github.com/d2-projects/d2-admin-start-kit')">简化版</span> |
          <span class="btn-group__btn" @click="$open('https://juejin.im/user/57a48b632e958a006691b946/posts')">掘金</span> |
          <el-popover :width="150" trigger="hover">
            <img src="./image/qr.jpg" style="width: 150px;">
            <span slot="reference" class="btn-group__btn btn-group__btn--link">
              <d2-icon name="weixin"/>
              微信服务号
            </span>
          </el-popover>
        </div>
        <d2-badge/>
        <d2-help/>
        <br/>
        <el-row :gutter="20">
          <el-col style="margin: 10px 10px;" :xs="12" :sm="6" :md="4" :lg="4" :xl="2" v-for="data in urls" :key="data.name">
            <el-button
              v-if="data.func === undefined"
              :icon="data.icon"
              @click="jump(data.url)"
              :type="data.type">{{ data.name }}</el-button>
            <el-button
              v-else
              :icon="data.icon"
              @click="funcs(data.func)"
              :type="data.type">{{ data.name }}</el-button>
          </el-col>
        </el-row>
      </template>
    </d2-page-cover>
    <el-dialog
      :title="kinds"
      :visible.sync="dialogVisible"
      width="80%">
      <h1>原文</h1>
      <json-viewer
        :expand-depth=6
        copyable
        boxed
        sort
        :value="jsonData">
      </json-viewer>
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
          <el-tag size="mini" type="success">Active</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="Name">
        <template slot-scope="scope">
          <el-button type="text" @click="openit(scope.row)">{{ scope.row.metadata.name }}</el-button>
        </template>
      </el-table-column>
      <el-table-column label="Kubernetes" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.status.nodeInfo.kubeletVersion }}</span>
        </template>
      </el-table-column>
      <el-table-column label="OS" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.metadata.labels['kubernetes.io/os'] }} / {{ scope.row.metadata.labels['kubernetes.io/arch'] }}</span>
        </template>
      </el-table-column>
      <el-table-column label="PodCIDR">
        <template slot-scope="scope">
          <span>{{ scope.row.spec.podCIDR }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Provider" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.spec.providerID }}</span>
        </template>
      </el-table-column>
      <el-table-column label="InternalIP" align="center">
        <template slot-scope="scope">
          <div v-for="data in scope.row.status.addresses" :key="data.address">
            <span v-if="data.type === 'InternalIP'"> {{ data.address }} </span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="Capacity" align="center">
        <template slot-scope="scope">
          {{ scope.row.status.capacity.cpu }} 核 {{ parseInt(parseInt(scope.row.status.capacity.memory.replace('Ki',''))/1024/1024) }} G {{ scope.row.status.capacity.pods }} Pods / {{ parseInt(parseInt(scope.row.status.capacity['ephemeral-storage'].replace('Ki',''))/1024/1024) }} G
        </template>
      </el-table-column>
      <el-table-column label="InternalIP" align="center">
        <template slot-scope="scope">
          <div v-for="tag in scope.row.status.conditions" :key="tag.type">
            <el-tag
              v-if="tag.status === 'False' || tag.type === 'Ready'"
              type="success">
              {{tag.type}}
            </el-tag>
            <el-tag
              v-else
              type="danger">
              {{tag.type}}
            </el-tag>
          </div>
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
import D2Badge from './components/d2-badge'
import D2Help from './components/d2-help'
import D2PageCover from './components/d2-page-cover'
import { apiserver } from '@/api/table.js'
export default {
  components: {
    D2Badge,
    D2Help,
    D2PageCover
  },
  data() {
    return {
      urls: [
        { 'name': '个人博客', 'url': 'http://lflxp.gitee.io', 'type': 'success', 'icon': 'el-icon-edit' },
        { 'name': '管理后台', 'url': '/admin/index', 'type': 'primary', 'icon': 'el-icon-share' },
        { 'name': 'd2-admin', 'url': '/d2admin', 'type': 'primary', 'icon': 'el-icon-share' },
        { 'name': 'Swagger', 'url': '/swagger/index.html', 'type': 'warning', 'icon': 'el-icon-search' },
        { 'name': 'Notion', 'url': 'https://www.notion.so/', 'type': 'warning', 'icon': 'el-icon-eleme' },
        { 'name': 'tools.fun', 'url': 'https://tools.fun/', 'type': 'info', 'icon': 'el-icon-eleme' },
        { 'name': '哔哩哔哩', 'url': 'https://bilibili.com/', 'type': 'primary', 'icon': 'el-icon-eleme' },
        { 'name': 'Kubernetes', 'url': 'https://kubernetes.io/zh-cn/docs/', 'type': 'danger', 'icon': 'el-icon-eleme' },
        { 'name': 'Rust操作系统', 'url': 'https://www.bilibili.com/medialist/play/1286472?from=space&business=space_series&business_id=965750&desc=1', 'type': 'success', 'icon': 'el-icon-eleme' },
        { 'name': '刘耕宏健身', 'url': 'https://search.bilibili.com/all?keyword=%E5%88%98%E7%95%8A%E5%AE%8F&from_source=webtop_search&spm_id_from=333.1007&search_source=5', 'type': 'warning', 'icon': 'el-icon-eleme' },
        { 'name': 'Element', 'url': 'https://element.eleme.cn/#/zh-CN/component/installation', 'type': 'success', 'icon': 'el-icon-star-on' },
        { 'name': 'dumi', 'url': 'https://d.umijs.org/zh-CN', 'type': 'success', 'icon': 'el-icon-star-on' },
        { 'name': 'umijs', 'url': 'https://umijs.org/', 'type': 'success', 'icon': 'el-icon-star-on' },
        { 'name': 'bootstrap3', 'url': 'https://getbootstrap.com/docs/3.4/', 'type': 'danger', 'icon': 'el-icon-star-on' },
        { 'name': '科技爱好者周刊', 'url': 'https://github.com/ruanyf/weekly', 'type': 'danger', 'icon': 'el-icon-star-on' },
      ],
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
      pageSize: 10
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    jump(path) {
      window.location.href = path
    },
    fetchData() {
      this.listLoading = true
      // tablelist().then(response => {
      //   console.log('response: ', response)
      //   this.list = response.data.items
      //   this.listLoading = false
      // })
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
      })
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
  }
}
</script>

<style lang="scss" scoped>
.page {
  .logo {
    width: 120px;
  }
  .btn-group {
    color: $color-text-placehoder;
    font-size: 12px;
    line-height: 12px;
    margin-top: 0px;
    margin-bottom: 20px;
    .btn-group__btn {
      color: $color-text-sub;
      &:hover {
        color: $color-text-main;
      }
      &.btn-group__btn--link {
        color: $color-primary;
      }
    }
  }
}
</style>
