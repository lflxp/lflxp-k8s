<template>
  <d2-container type="card">
    <!-- <template slot="header">区域划分</template> -->
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="工具管理" name="first">
        <div style="height: 400px; margin: -16px;">
          <SplitPane :min-percent='20' :default-percent='10' split="vertical">
            <template slot="paneL"><div style="margin: 10px;">
              <el-tree :data="data" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
            </div></template>
            <template slot="paneR">
              <SplitPane split="horizontal">
                <template slot="paneL"><div style="margin: 10px;">
                  <el-table
                    :data="tableData"
                    style="width: 100%">
                    <el-table-column
                      prop="date"
                      label="日期"
                      width="180">
                    </el-table-column>
                    <el-table-column
                      prop="name"
                      label="姓名"
                      width="180">
                    </el-table-column>
                    <el-table-column
                      prop="address"
                      label="地址">
                    </el-table-column>
                  </el-table>
                </div></template>
                <!-- <template slot="paneR"><div style="margin: 10px;">右下</div></template> -->
              </SplitPane>
            </template>
          </SplitPane>
        </div>
      </el-tab-pane>
      <el-tab-pane label="节点管理" name="second">
        <el-table
          :data="nodelist"
          style="width: 100%">
          <el-table-column
            prop="name"
            label="名称"
            width="180">
          </el-table-column>
          <el-table-column
            prop="ip"
            label="IP地址"
            width="180">
          </el-table-column>
          <el-table-column
            prop="host"
            label="服务端口"
            width="180">
          </el-table-column>
          <el-table-column
            prop="last"
            label="最近一次探活时间">
          </el-table-column>
          <el-table-column
            prop="history.error"
            label="最近一次中断时间">
          </el-table-column>
          <el-table-column
            prop="history.success"
            label="最近一次成功时间">
          </el-table-column>
          <el-table-column
            prop="status"
            label="状态"
            width="180">
            <template slot-scope="scope">
              <span :style="{ color: scope.row.status ? 'green' : 'red' }">
                {{ scope.row.status ? '正常' : '中断' }}
              </span>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="配置管理" name="third">角色管理</el-tab-pane>
      <el-tab-pane label="定时任务补偿" name="fourth">定时任务补偿</el-tab-pane>
    </el-tabs>
  </d2-container>
</template>

<script>
import Vue from 'vue'
import SplitPane from 'vue-splitpane'
import { agentlist } from '@/api/csm.js'
Vue.component('SplitPane', SplitPane)
export default {
  mounted () {
    // 加载完成后显示提示
    this.showInfo()
  },
  data() {
    return {
      activeName: 'first',
      data: [{
        label: '一级 1',
        children: [{
          label: '二级 1-1',
          children: [{
            label: '三级 1-1-1'
          }]
        }]
      }, {
        label: '一级 2',
        children: [{
          label: '二级 2-1',
          children: [{
            label: '三级 2-1-1'
          }]
        }, {
          label: '二级 2-2',
          children: [{
            label: '三级 2-2-1'
          }]
        }]
      }, {
        label: '一级 3',
        children: [{
          label: '二级 3-1',
          children: [{
            label: '三级 3-1-1'
          }]
        }, {
          label: '二级 3-2',
          children: [{
            label: '三级 3-2-1'
          }]
        }]
      }],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      tableData: [{
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1517 弄'
        }, {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1519 弄'
        }, {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄'
        }],
      nodelist: []
    };
  },
  created() {
    this.fetchData()
  },
  methods: {
    // 显示提示
    showInfo () {
      this.$notify({
        title: '提示',
        message: '在横向或者纵向的分割线上拖拽调整分区大小'
      })
    },
    handleClick(tab, event) {
      console.log(tab, event);
    },
    handleNodeClick(data) {
      console.log(data);
    },
    fetchData() {
      agentlist().then(res => {
        console.log(res)
        this.nodelist = res.data
      })
    }
  }
}
</script>
