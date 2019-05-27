<template>
  <div class="chatpage">
    <div class="chat-header">
      <span class="cubeic-back" @click="back"></span>
      <span class="name">{{letterUser.username}}</span>
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
                <img class="image1" :src="imgURL+letterUser.avatar" height="40" width="40">
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
        <div class="msg-ul-bottom"></div>
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

    },
    created () {

    },
    methods: {
      sendMessageClick () {
        if (this.value.length === 0) {
          return
        }
        let newMsg = {}
        newMsg.sendUserId = this.nowUser.id
        newMsg.receiveUserId = this.letterUser.id
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
      back () {
        // 通过评论信息 获取用户id
        if (this.problem) {
          this.$router.push({
            name: 'homePage',
            params: {
              problem: this.problem,
              userId: this.letterUser.id
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
        newMsg.receiveUserId = this.letterUser.id
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
            sendId: this.letterUser.id
          }
        }).then((response) => {
          if (response.data.head.stateCode === 200) {
            this.msgs = response.data.body.data

            if (this.msgs.length > 0) {
              // 设置消息已读
              for (let i = 0; i < this.msgs.length; i++) {
                if (this.msgs[i].hasRead === 0 && this.msgs[i].receiveUserId === this.nowUser.id) {
                  this.$http.put('/message/newsRead', this.$qs.stringify({
                      receiveId: this.letterUser.id
                    }
                  )).then((res) => {
                    this.$store.commit('updateMsg', this.$store.state.flushMsg + 1)
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
    beforeRouteLeave (to, from, next) {
      this.$store.commit('updateMsg', this.$store.state.flushMsg + 1)
      next()
    },
    watch: {
      '$store.state.receiveInfo': function () {
        console.log(this.$store.state.receiveInfo)
        if (this.$router.currentRoute.name === 'chatPage') {
          let receivInfo = JSON.parse(this.$store.state.receiveInfo)
          if (receivInfo.type === 1 && receivInfo.content.receiveUserId === this.nowUser.id) {
            this.$http.put('/message/newsRead', this.$qs.stringify({
                receiveId: this.nowUser.id
              }
            )).then((res) => {
              console.log(res)
            }).catch((err) => {
              console.log(err)
            })

            this.msgs.push(receivInfo.content)
          }
        }
      },
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

        .msg-ul-bottom
          height 10px
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
