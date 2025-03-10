<template>
  <d2-container-frame :src="url"/>
</template>

<script>
export default {
  data() {
    return {
      url: ''
    }
  },
  mounted() {
    this.url = window.location.protocol + '//' + window.location.hostname + ':8001'
  }
}
</script>