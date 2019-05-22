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
            <msg-page @changeDot="updateDot" :msginfo="msgInfo"></msg-page>
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
        <cube-tab v-for="(item, index) in tabs" :label="item.label" :key="item.label">
          <!-- name为icon的插槽 -->
          <span v-show="index===2 && showDot" class="badge-dot"></span>
          <i slot="icon" :class="item.icon">
          </i>
          <!-- 默认插槽 -->
          <div>
            {{item.label}}
          </div>
        </cube-tab>
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
        msgInfo: {},
        showDot: false,
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
      // 修改dot
      updateDot (data) {
        this.msgInfo = data
      },
      clickHandler (label) {

      },
      changeHandler (label) {

      },
      onChange (current) {
        this.index = current
      },
      // 第一次加载主界面的时候设置设置连接websocket
      initWebSocket () {
        // 断开连接 并设置为
        let webSocket = this.$store.state.webSocket
        if (webSocket) {
          // 关闭连接
          webSocket.close()
          this.$store.commit('updateWebSocket', null)
        }
        // 连接服务器
        let user = JSON.parse(window.localStorage.getItem('token'))
        const wsuri = 'ws://192.168.43.106:8080/websocket/' + user.id
        webSocket = new WebSocket(wsuri)
        webSocket.onopen = () => {
          console.log('建立连接')
        }
        webSocket.onmessage = (e) => {
          console.log('接收数据')
          console.log(e)
        }
      },
      getMsgCount () {
        this.$http.get('/message/notReadCount', null).then((res) => {
          let data = res.data.body.data
          this.msgInfo = data
          if (data.newsCount > 0 || data.noticeCount > 0) {
            this.showDot = true
          }
        })
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
      this.$refs.containerPage.style.height = (this.clientHeight - 46) + 'px'
      this.initWebSocket()
      this.getMsgCount()
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

          .badge-dot
            position absolute
            display inline-block
            background-color #f56c6c
            border-radius 50%
            height 10px
            width: 10px;
            border: 1px solid #fff;

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
