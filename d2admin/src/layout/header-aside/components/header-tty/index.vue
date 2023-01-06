<template>
  <div>
    <el-tooltip effect="dark" content="终端" placement="bottom">
      <el-button class="d2-mr btn-text can-hover" type="text" @click="openit">
        <d2-icon name="share" style="font-size: 18px;"/>
      </el-button>
    </el-tooltip>
    
    <el-dialog
      title="远程终端"
      :visible.sync="dialogVisible"
      :fullscreen="false"
      width="100%">
      <d2-container-frame style="height: 580px;" :src="url"/>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dialogVisible: false,
      url: ''
    }
  },
  mounted() {
    this.url = window.location.protocol + '//' + window.location.hostname + ':8001'
  },
  methods: {
    openit(row) {
      this.dialogVisible = !this.dialogVisible
    },
  }
}
</script>
