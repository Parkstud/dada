<template>
  <div class="main-app">
    <div class="header">
    </div>
    <div class="content" ref="containerPage">
      <cube-button @click="logout">删除session</cube-button>
      <pro-rec></pro-rec>
    </div>
    <div class="footer">
      <v-navigation></v-navigation>
    </div>
  </div>
</template>

<script type='text/ecmascript-6'>
  import Navigation from '../navigation/navigation'
  import ProRec from '../problem-recommend/problem-recommend.vue'

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
    },
    components: {
      'v-navigation': Navigation,
      'ProRec': ProRec
    },
    mounted () {
      // 获取浏览器可视区域高度
      this.clientHeight = `${document.documentElement.clientHeight}`
      console.log(this.clientHeight - 134)
      this.$refs.containerPage.style.height = (this.clientHeight - 134) + 'px'
    }

  }
</script>

<style lang='stylus' rel='stylesheet/stylus'>
  .main-app
    .header
      background gray
      height 40px

    .content
      height 100%

    .footer
      position absolute
      bottom 0
      left 0
      width 100%

</style>
