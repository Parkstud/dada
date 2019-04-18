<template>
  <div class="main-app">
    <div class="content" ref="containerPage">
      <div class="slide-wrapper">
        <cube-slide ref="slide" :loop="false"
                    :auto-play="false"
                    :show-dots="false"
                    :initial-index="index"
                    @change="onChange"
                    :options="slideOptons"
        >
          <cube-slide-item>
            <first-page></first-page>
          </cube-slide-item>
          <cube-slide-item>
            <search-page></search-page>
          </cube-slide-item>
          <cube-slide-item>
            <msg-page></msg-page>
          </cube-slide-item>
          <cube-slide-item>
            <my-page></my-page>
          </cube-slide-item>
        </cube-slide>
      </div>
    </div>
    <div class="footer">
      <cube-tab-bar v-model="selectedLabelDefault"
                    :data="tabs"
                    :use-transition="false"
                    @click="clickHandler"
                    @change="changeHandler"
                    ref="tarBar"
      >
      </cube-tab-bar>

    </div>
  </div>
</template>

<script type='text/ecmascript-6'>
  import FirstPage from '../firstPage/firstPage.vue'
  import SearchPage from '../searchPage/searchPage'
  import MsgPage from '../msgPage/msgPage'
  import MyPage from '../myPage/myPage'

  export default {
    name: 'mainApp',
    data () {
      return {
        index: this.$store.state.count,
        tabs: [
          {
            label: '首页',
            icon: 'cubeic-home'
          },
          {
            label: '提问',
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
        ],
        slideOptons: {
          directionLockThreshold: 0
        },
        scrollOptions: {
          directionLockThreshold: 0
        }

      }
    },
    computed: {
      selectedLabelDefault: {
        get () {
          return this.tabs[this.index].label
        },
        set (newVal) {
          this.index = this.tabs.findIndex(value => {
            return value.label === newVal
          })
        }
      }
    },
    methods: {
      clickHandler (label) {
        console.log(label)
      },
      changeHandler (label) {

      },
      onChange (current) {
        this.index = current
      }
    },
    components: {
      MyPage,
      MsgPage,
      SearchPage,
      FirstPage
    },
    mounted () {
      // 获取浏览器可视区域高度
      this.clientHeight = `${document.documentElement.clientHeight}`
      // this.$refs.containerPage.style.height = (this.clientHeight - 44) + 'px'
      this.$refs.containerPage.style.height = (this.clientHeight - 44) + 'px'
    }

  }
</script>

<style lang='stylus' rel='stylesheet/stylus'>
  .main-app
    .content
      .slide-wrapper
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
