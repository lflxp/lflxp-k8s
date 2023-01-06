<template>
  <!-- <el-dropdown placement="bottom" size="small" @command="onChangeCookie">
    <el-button class="d2-mr btn-text can-hover" type="text">
      <d2-icon name="share" style="font-size: 16px;"/>
    </el-button>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item
        v-for="ns in namespaces"
        :key="ns.metadata.name"
        :command="ns.metadata.name">
        <d2-icon :name="current === ns.metadata.name ? 'dot-circle-o' : 'circle-o'" class="d2-mr-5"/>
        {{ ns.metadata.name }}
      </el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown> -->
  <el-select 
    v-model="current" 
    filterable 
    clearable
    @change="onChangeCookie"
    placeholder="请选择命名空间">
    <el-option
      v-for="item in namespaces"
      :key="item.metadata.name"
      :label="item.metadata.name"
      :value="item.metadata.name">
    </el-option>
  </el-select>
</template>

<script>
import localeMixin from '@/locales/mixin.js'
import { apinamespace } from '@/api/table.js'
import util from '@/libs/util.js'

export default {
  inject: ['reload'],
  mixins: [
    localeMixin
  ],
  data() {
    return {
      namespaces: '',
      current: ''
    }
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      apinamespace().then(resp => {
        // console.log('namespace:',resp)
        this.namespaces = resp.data.items
      });
      this.current = util.cookies.get('namespace')
    },
    onChangeCookie(namespace) {
      this.current = namespace
      util.cookies.set('namespace', namespace)
      this.$message.info(`设置命名空间 namespace = ${namespace}`)
      // this.$router.go(0)
      this.reload()
    }
  }
}
</script>
