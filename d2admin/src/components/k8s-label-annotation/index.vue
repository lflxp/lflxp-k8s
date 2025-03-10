<template>
  <div>
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
      :visible.sync="dialogVisible"
      width="80%">

      <el-tabs v-model="activeName" type="card">
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
        <el-tab-pane label="YAML" name="fourth">
          <vue-json-editor
            v-model="data"
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
  </div>
</template>

<script>
import { apiserver, apiput, apidelete, apipatch } from '@/api/table.js'
import vueJsonEditor from 'vue-json-editor'

export default {
  name: 'd2-container-frame',
  components: {
    vueJsonEditor
  },
  props: {
    data: {
      type: Object,
      required: true
    },
    group: {
      type: String,
      required: true,
      default: ''
    },
    version: {
      type: String,
      required: true,
      default: 'v1'
    },
    resource: {
      type: String,
      required: true,
      default: 'deployments'
    },
    namespace: {
      type: String,
      required: true,
      default: ''
    },
    show: {
      type: Boolean,
      require: true,
      default: false
    } 
  },
  data() {
    return {
      // labelTitle: '',
      dialogFormVisible: false,
      dialogFormVisibleAnnotations: false,
      formLabelWidth: '120px',
      currentLabelKey: '',
      currentLabelValue: '',
      // currentLabelName: '',
      currentATKey: '',
      currentATValue: '',
      labelsData: [],
      annotationsData: [],
      // annotationsTitle: '',
      disableKey: true,
      formLabelWidth: '120px',
      activeName: 'labels',
      jsonData: '',
      dialogVisible: this.show
    }
  },
  mounted() {
    console.log('k8s-label-annotations enabled', this.data)
  },
  watch: {
    show(val) {
      this.dialogVisible = val
    }
  },
  computed: {
    namespace: function() {
      return this.data.metadata.namespace
    },
    kinds: function() {
      console.log('kinds', this.data)
      // this.dialogVisible = true
      return '[' + this.data.kind + '] ' + this.data.metadata.name
    },
    currentLabelName: function() {
      return this.data.metadata.name
    },
    labelTitle: function() {
      var result = ''
      if (this.data.metadata.labels !== undefined) {
        result = '标签 ' + Object.keys(this.data.metadata.labels).length
      } else {
        result = '标签 0'
      }
      return result
    },
    annotationsTitle: function() {
      var result = ''
      if (this.data.metadata.annotations !== undefined) {
        result = '注释' + Object.keys(this.data.metadata.annotations).length
      } else {
        result = '注释 0'
      }
      return result
    },
    labels: {
      get() {
        // console.log('labels', this.data.metadata.labels)
        var result = [];
        if (this.data.metadata.labels !== undefined) {
          var rowL = new Map(Object.entries(this.data.metadata.labels))
          for(let key of rowL.keys()) {
            var tmp = {
              'key': key,
              'value': rowL.get(key)
            }
            result.push(tmp)
          }
        }
        return result
      },
      set(v) {
        this.labels = v
      }
    },
    annotations: {
      get() {
        console.log('annotations')
        var result = [];
        if (this.data.metadata.annotations !== undefined) {
          var rowL = new Map(Object.entries(this.data.metadata.annotations))
          for(let key of rowL.keys()) {
            var tmp = {
              'key': key,
              'value': rowL.get(key)
            }
            result.push(tmp)
          }
        }
        // this.dialogVisible = true
        return result
      },
      set(v) {
        this.annotationsData = v
      }
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
      this.dialogVisible = true
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
      var tData = this.data
      delete tData['metadata']['labels'][row['key']]

      let tmp = {
          "group":this.group,
          "version":this.version,
          "resource":this.resource,
          "namespace": this.namespace,
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
        // this.data = resp
        this.$notify({
          title: '成功',
          message: '成功删除Labels ' + row,
          type: 'success'
        });
      })
    },
    deleteAnnotations(row) {
      console.log(this.currentLabelName, row)
      this.listLoading = true
      var tData = this.data
      delete tData['metadata']['annotations'][row['key']]

      let tmp = {
        "group":this.group,
        "version":this.version,
        "resource":this.resource,
        "namespace": this.namespace,
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
        // this.data = resp
        this.$notify({
          title: '成功',
          message: '成功删除Annotations ' + row,
          type: 'success'
        });
      })
    },
    patchLabels(name) {
      console.log(name)
      this.listLoading = true
      var vv = {}
      vv[this.currentLabelKey] = this.currentLabelValue
      let tmp = {
        "group":this.group,
        "version":this.version,
        "resource":this.resource,
        "namespace": this.namespace,
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
        this.$notify({
          title: '成功',
          message: '成功新增/修改Labels ' + vv,
          type: 'success'
        });
      })
    },
    patchAnnotations(name) {
      console.log(name)
      this.listLoading = true
      var vv = {}
      vv[this.currentATKey] = this.currentATValue
      let tmp = {
        "group":this.group,
        "version":this.version,
        "resource":this.resource,
        "namespace": this.namespace,
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
        this.$notify({
          title: '成功',
          message: '成功新增/修改Annotations ' + vv,
          type: 'success'
        }); 
      })
    },
    onJsonChange(value) {
      console.log('value: change', value)
    },
    onJsonSave(value) {
      console.log('value save:', value)
      let tmp = {
        "group":this.group,
        "version":this.version,
        "resource":this.resource,
        "namespace": this.namespace, 
        "name": value.metadata.name,
        "data": value
      }
      apiput(tmp).then(resp => {
        console.log('resp', resp)
        // this.fetchData()
        // this.dialogVisible = false
      })
    }
  },
}
</script>

<style lang="scss" scoped>
.d2-container-frame {
  position: absolute;
  top: 0px;
  left: 0px;
  height: 100%;
  width: 100%;
}
</style>
