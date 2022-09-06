<!-- eslint-disable vue/multi-word-component-names -->
<template lang="">
  <div>
    <el-button type="danger" @click="logout">退出</el-button>
  </div>
</template>
<script>
export default {
  methods: {
    logout () {
      sessionStorage.clear()
      this.$router.push('/login')
    }
  }
}
</script>
<style lang="">

</style>
