<template>
  <div class="main-app">
    主页
    <cube-button @click="logout">删除session</cube-button>
  </div>
</template>

<script type='text/ecmascript-6'>
  export default {
    name: 'mainApp',
    methods: {
      // 注销
      logout () {
        // 删除cookie 跳转登录页
        this.delCookie('session')
        setTimeout(() => {
          this.$router.push('/login')
        }, 1000)
      }
    }
  }
</script>

<style lang='stylus' rel='stylesheet/stylus'>

</style>
