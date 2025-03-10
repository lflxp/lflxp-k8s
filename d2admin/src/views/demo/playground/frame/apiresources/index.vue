<template>
  <d2-container>
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
      <el-table-column label="Name" align="left">
        <template slot-scope="scope">
          <span>{{ scope.row.resources.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="shortName" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.resources.shortNames !== undefined ? scope.row.resources.shortNames.join(',') : '' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="APIVERSION" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.groupVersion }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Namespaced" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.resources.namespaced }}</span>
        </template>
      </el-table-column>
      <el-table-column label="KIND" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.resources.kind }}</span>
        </template>
      </el-table-column>
    </el-table>
  </d2-container>
</template>

<script>
import { apiresource } from '@/api/table.js'

export default {
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
      value: ''
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
            let tmp = {
              "apiVersion": rs2.apiVersion !== undefined ? rs2.apiVersion : "",
              "groupVersion": rs2.groupVersion,
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
    },
    openit(row) {
      console.log(row)
      this.jsonData = row
      this.kinds = row.kind
      this.dialogVisible = true
    },
  }
}
</script>
