<template>
  <div class="main-app">
    <div class="header">
    </div>
    <div class="content" ref="containerPage">
      <cube-button @click="logout">删除session</cube-button>
      <pro-rec></pro-rec>
    </div>
    <div class="footer">
      <cube-tab-bar v-model="selectedLabelDefault"
                    :data="tabs"
                    @click="clickHandler"
                    @change="changeHandler">

      </cube-tab-bar>
    </div>
  </div>
</template>

<script type='text/ecmascript-6'>
  // import Navigation from '../navigation/navigation'
  import ProRec from '../problem-recommend/problem-recommend.vue'

  export default {
    name: 'mainApp',
    data () {
      return {
        selectedLabelDefault: '首页',
        tabs: [
          {
            label: '首页',
            icon: 'cubeic-home'
          },
          {
            label: '搜索',
            icon: 'cubeic-search'
          },
          {
            label: '消息',
            icon: 'cubeic-notification'
          },
          {
            label: '我的',
            icon: 'cubeic-person'
          }
        ]
      }
    },
    methods: {
      // 注销
      logout () {
        // 删除cookie 跳转登录页
        this.delCookie('session')
        setTimeout(() => {
          this.$router.push('/login')
        }, 1000)
      },
      clickHandler (label) {
        console.log(label)
      },
      changeHandler (label) {

      }
    },
    components: {
      // 'v-navigation': Navigation,
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
      height 44px

      .cube-tab-bar
        background #f3f3f3
        color #c3c3c3

        .cube-tab
          font-size 12px
          padding-top 3px

        .cubeic-home, .cubeic-search, .cubeic-notification, .cubeic-person
          font-size 24px

</style>
