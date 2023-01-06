<template>
  <div id="app">
    <router-view v-if="isRouterAlive"/>
  </div>
</template>

<script>
import util from '@/libs/util'
export default {
  name: 'app',
  provide () {
    return{
      // 全局刷新: https://blog.csdn.net/weixin_40816738/article/details/122202924
      reload: this.reload
    }
  },
  watch: {
    '$i18n.locale': 'i18nHandle'
  },
  data() {
    return {
      isRouterAlive: true
    }
  },
  created () {
    this.i18nHandle(this.$i18n.locale)
  },
  methods: {
    i18nHandle (val, oldVal) {
      util.cookies.set('lang', val)
      document.querySelector('html').setAttribute('lang', val)
    },
    reload(){
      this.isRouterAlive = false
      this.$nextTick(function(){
        this.isRouterAlive = true
      })
    }
  }
}
</script>

<style lang="scss">
@import '~@/assets/style/public-class.scss';
</style>
