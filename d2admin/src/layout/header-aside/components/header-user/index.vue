<template>
  <el-dropdown size="small" class="d2-mr">
    <span class="btn-text">{{info.name ? `你好 ${info.name}` : '未登录'}}</span>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item @click.native="admins">
        <d2-icon name="power-off" class="fa fa-hand-o-right"/>
        后台管理
      </el-dropdown-item>
      <el-dropdown-item @click.native="apis">
        <d2-icon name="power-off" class="fa fa-space-shuttle"/>
        SwaggerAPI
      </el-dropdown-item>
      <el-dropdown-item @click.native="logOff">
        <d2-icon name="power-off" class="d2-mr-5"/>
        注销
      </el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  computed: {
    ...mapState('d2admin/user', [
      'info'
    ])
  },
  methods: {
    ...mapActions('d2admin/account', [
      'logout'
    ]),
    /**
     * @description 登出
     */
    logOff () {
      this.logout({
        confirm: true
      })
    },
    admins() {
      window.location.href = '/admin/index';
    },
    apis() {
      window.location.href = '/swagger/index.html';
    }
  }
}
</script>
