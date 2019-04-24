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
    <div class="footer border-top-1px">
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
      this.$refs.containerPage.style.height = (this.clientHeight - 46) + 'px'
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
      box-shadow: 1px 0 2px 1px #efefef;

      .cube-tab-bar
        background rgb(250, 250, 250)
        color #c3c3c3

        .cube-tab
          font-size 12px
          padding-top 3px
          position: relative;
          overflow: hidden;

          &:after
            content: "";
            display: block;
            position: absolute;
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
            pointer-events: none;
            //设置径向渐变
            background-image: radial-gradient(circle, #666 10%, transparent 10.01%);
            background-repeat: no-repeat;
            background-position: 50%;
            transform: scale(10, 10);
            opacity: 0;
            transition: transform .3s, opacity .5s;

          &:active:after
            transform: scale(0, 0);
            opacity: .3;
            //设置初始状态
            transition: 0s;

        .cubeic-home, .cubeic-search, .cubeic-notification, .cubeic-person
          font-size 24px

</style>
