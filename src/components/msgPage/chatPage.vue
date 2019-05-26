<template>
  <div class="chatpage">
    <div class="chat-header">
      <span class="cubeic-back" @click="back"></span>
      <span class="name">{{letterUser.userNickName}}</span>
      <span></span>
    </div>
    <div class="chat-content-wrapper" ref="contentWrapper">

      <cube-scroll ref="scrollChat" :data="msgs" :options="options">
        <ul>
          <li v-for="(msg,index) in msgs" :key="index">
            <div class="msg-wrapper">
              <div class="time" v-show="showTime(index)">
                {{formatData(msg.time,1)}}
              </div>
              <div class="msg-style1" v-if="msg.receiveUserId === nowUser.id">
                <img class="image1" :src="imgURL+letterUser.userAvatar" height="40" width="40">
                <p class="info1">
                  {{msg.msg}}
                </p>
              </div>
              <div class="msg-style2" v-else>
                <p class="info2">
                  {{msg.msg}}
                </p>
                <img class="image2" :src="imgURL+nowUser.avatar" height="40" width="40">
              </div>
            </div>
          </li>
        </ul>
      </cube-scroll>

    </div>
    <div class="chat-footer">

      <cube-input v-model="value" @keyup.enter.native="sendMessage">
        <!--<span slot="prepend" class="cubeic-picture"></span>-->
        <span slot="append" @click="sendMessageClick" class="cubeic-navigation"
              :class="value.length>0?'sending':'not-send'"></span>
      </cube-input>

    </div>
  </div>
</template>

<script type='text/ecmascript-6'>
  export default {
    name: 'chatpage',
    data () {
      return {
        // 问题跳转获取的problem
        problem: this.$route.params.problem,
        value: '',
        websock: null,
        msgs: [
          {
            id: 1,
            sendUserId: 1,
            receiveUserId: 1,
            time: 1554953244000,
            msg: '测试',
            hasRead: 0
          }
        ],
        letterUser: {},
        nowUser: {},
        options: {
          startY: 0,
          observeDOM: true
        }
      }
    },
    destroyed () {
      // console.log('客户端断开连接')
      // this.websock.close()
    },
    created () {
      // this.initWebSocket()
    },
    '$store.state.receiveInfo': function () {
      console.log(this.$state.receiveInfo)
      if (this.$router.currentRoute.name === 'chatPage') {
        if (this.$store.receiveInfo.type === 1 && this.$store.receiveInfo.content.receiveUserId === this.nowUser.id) {
          this.msgs.push(this.$state.receiveInfo.content)
        }
      }
    },
    methods: {
      sendMessageClick () {
        if (this.value.length === 0) {
          return
        }
        let newMsg = {}
        newMsg.sendUserId = this.nowUser.id
        newMsg.receiveUserId = this.letterUser.userId
        newMsg.msg = this.value
        newMsg.time = new Date().getTime()
        newMsg.hasRead = 0
        this.msgs.push(newMsg)
        this.value = ''
        // 设置websocket
        // this.webSocketSend(JSON.stringify(newMsg))
        // 保存信息
        this.saveMessage(newMsg)
      },
      // // websocket初始化
      // initWebSocket () {
      //   const wsuri = 'ws://192.168.43.106:8080/websocket/' + JSON.parse(window.localStorage.getItem('token')).id
      //   // const wsuri = 'ws://106.14.4.232:8080/dsqas-0.0.1-SNAPSHOT/websocket/' + JSON.parse(window.localStorage.getItem('token')).id
      //   this.websock = new WebSocket(wsuri)
      //   this.websock.onmessage = this.webSocketOnMessage
      //   this.websock.onopen = this.webSocketOnOpen
      //   this.websock.onerror = this.webSocketOnError
      //   this.websock.onclose = this.webSocketClose
      // },
      // // 连接建立之后执行send方法发送数据
      // webSocketOnOpen () {
      //   this.sendFirstMsg()
      //   console.log('建立连接')
      // },
      // // 第一次建立连接发送信息
      // sendFirstMsg () {
      //   let temp = JSON.parse(window.localStorage.getItem('token'))
      //   this.nowUser.userNickName = temp.nickName
      //   this.nowUser.userId = temp.id
      //   let firstMsg = {}
      //   firstMsg.sendUserId = this.nowUser.userId
      //   firstMsg.receiveUserId = this.letterUser.userId
      //   this.webSocketSend(JSON.stringify(firstMsg))
      // },
      // // 连接建立失败重连
      // webSocketOnError () {
      //   this.initWebSocket()
      // },
      // // 数据接收
      // webSocketOnMessage (e) {
      //   this.msgs.push(JSON.parse(e.data))
      //   console.log(e.data)
      // },
      // // 数据发送
      // webSocketSend (data) {
      //   this.websock.send(data)
      // },
      // // 关闭
      // webSocketClose (e) {
      //   console.log('断开连接', e)
      // },
      back () {
        // 通过评论信息 获取用户id
        if (this.problem) {
          this.$router.push({
            name: 'homePage',
            params: {
              problem: this.problem,
              userId: this.letterUser.userId
            }
          })
        } else {
          this.$router.go(-1)
        }
      },
      // 计算是否显示时间
      showTime (nowIndex) {
        if (nowIndex === 0) {
          return true
        }
        // 上一个时间减下一个时间 300000
        if (this.msgs[nowIndex].time - this.msgs[nowIndex - 1].time < 300000) {
          return false
        }
        return true
      },
      // 发送消息
      sendMessage () {
        event.preventDefault() // 禁止默认事件（默认是换行）
        if (this.value.length === 0) {
          return
        }
        let newMsg = {}
        newMsg.sendUserId = this.nowUser.id
        newMsg.receiveUserId = this.letterUser.userId
        newMsg.msg = this.value
        newMsg.time = new Date().getTime()
        newMsg.hasRead = 0
        this.msgs.push(newMsg)
        this.value = ''
        // 设置websocket
        // this.webSocketSend(JSON.stringify(newMsg))
        // 保存信息
        let socketInfo = {}
        socketInfo.type = 1
        socketInfo.content = newMsg
        this.$store.commit('dataPush', JSON.stringify(socketInfo))
        this.saveMessage(newMsg)
      },
      //  存储消息
      saveMessage (msg) {
        let url = '/message/newmsg'
        this.$http.post(url, msg)
          .then((response) => {
          }).catch((error) => {
          console.log(error)
        })
      },
      getData () {
        this.letterUser = this.$route.params.letterUser
        // 通过letter 和当前用户信息查询聊天记录
        // 查询当前的用户信息
        let url = '/message/news/history/list'
        this.$http.get(url, {
          params: {
            receiveId: this.nowUser.id,
            sendId: this.letterUser.userId
          }
        }).then((response) => {
          if (response.data.head.stateCode === 200) {
            this.msgs = response.data.body.data

            if (this.msgs.length > 0) {
              // 设置消息已读
              for (let i = 0; i < this.msgs.length; i++) {
                if (this.msgs[i].hasRead === 0 && this.msgs[i].receiveUserId === this.nowUser.id) {
                  this.$http.put('/message/newsRead', this.$qs.stringify({
                      receiveId: this.letterUser.userId
                    }
                  )).then((res) => {
                    this.$store.commit('updateMsg', this.$store.flushMsg + 1)
                    console.log(res)
                  }).catch((err) => {
                    console.log(err)
                  })
                  return
                }
              }
            }
          }
        })
      }
    },
    watch: {
      msgs () {
        setTimeout(() => {
          this.$refs.scrollChat.scrollTo(0, this.$refs.scrollChat.scroll.maxScrollY, 0)
        }, 200)
      }
    },

    beforeRouteEnter (to, from, next) {
      console.log(from)
      if (from.name === 'mainApp') {
        to.meta.isBack = false
      }
      next()
    },
    activated () {
      if (!this.$route.meta.isBack) {
        // 如果isBack是false，表明需要获取新数据，否则就不再请求，直接使用缓存的数据
        this.getData()
      }
      // 恢复成默认的false，避免isBack一直是true，导致下次无法获取数据
      this.$route.meta.isBack = true
    },

    mounted () {
      this.nowUser = JSON.parse(localStorage.getItem('token'))
      this.options.startY = document.documentElement.clientHeight - this.$refs.scrollChat.$refs.listWrapper.scrollHeight - 70
      // contentWrapper
      this.$refs.contentWrapper.style.height = document.documentElement.clientHeight - 80 + 'px'

      this.$nextTick(() => {
        // 高度刷新一次，滚动区域滚到最末尾
        this.$refs.scrollChat.refresh()
        this.$refs.scrollChat.scroll.scrollTo(0, this.$refs.scrollChat.scroll.maxScrollY)
      })
    }
  }
</script>

<style lang='stylus' rel='stylesheet/stylus'>
  #app
    height 100%

    .chatpage
      display flex
      flex-direction: column;
      height 100%

      .chat-header
        display flex
        justify-content space-between
        align-items center
        height 40px
        background-color #fff
        box-shadow: 1px 2px 4px rgba(0, 0, 0, 0.5)

        .cubeic-back
          display inline-block
          width 40px
          height 30px
          line-height 30px
          font-size 20px
          color #64a4fe
          text-align center

        .name
          display inline-block
          padding-right 40px

      .chat-content-wrapper
        height 650px
        background-color #f7f7f7

        .msg-wrapper
          margin 0 10px

          .time
            text-align center
            padding 10px
            font-size 12px
            color #c1c1c1

          .msg-style2
            display flex
            justify-content: flex-end;
            margin-top 10px

            .image2
              border-radius 50%

            .info2
              position: relative;
              width: 150px;
              min-height: 30px;
              background: #0a89ff;
              border-radius: 5px;
              margin-right: 10px;
              word-break: break-word;
              color: white;
              padding: 5px;
              line-height: 30px;

              &::after
                content: "";
                display: block;
                position: absolute;
                width: 0;
                height: 0;
                border: 8px solid transparent;
                border-left-color: #0a89ff;
                top: 15px;
                right: -14px;

          .msg-style1
            display flex
            margin-top 10px

            .image1
              border-radius 50%

            .info1
              position: relative;
              width: 150px;
              min-height: 30px;
              background white
              border-radius: 5px;
              margin-left: 10px;
              word-break: break-word;
              padding: 5px;
              line-height: 30px;
              color #666

              &::after
                content: "";
                display: block;
                position: absolute;
                width: 0;
                height: 0;
                border: 8px solid transparent;
                border-right-color white
                top: 15px;
                left: -14px;

      .chat-footer
        height: 40px
        background-color gray
        font-size 10px

        .cube-input
          padding-left 20px

        .cubeic-picture
          color #0a89ff
          font-size 30px

        .cubeic-navigation
          font-size 20px
          margin 0 5px

        .not-send
          color #d1d1d1

        .sending
          color #0a89ff
</style>
