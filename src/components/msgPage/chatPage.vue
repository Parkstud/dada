<template>
  <div class="chatpage">
    <div class="chat-header">
      <span class="cubeic-back" @click="back"></span>
      <span class="name">陈苗</span>
      <span></span>
    </div>
    <div class="chat-content-wrapper">

      <cube-scroll ref="scrollChat" :data="msgs" :options="options">
        <ul>
          <li v-for="(msg,index) in msgs" :key="index">
            <div class="msg-wrapper">
              <div class="time" v-show="msg.show_time">{{msg.timestamp}}</div>
              <div class="msg-style1" v-if="msg.current_person">
                <img class="image1" :src="msg.from_avatar" height="40" width="40">
                <p class="info1">
                  {{msg.msg_content}}
                </p>
              </div>
              <div class="msg-style2" v-else>
                <p class="info2">
                  {{msg.msg_content}}
                </p>
                <img class="image2" :src="msg.to_avatar" height="40" width="40">
              </div>
            </div>
          </li>
        </ul>
      </cube-scroll>

    </div>
    <div class="chat-footer">
      <cube-input v-model="value" @keyup.enter.native="sendMessage">
      </cube-input>
    </div>
  </div>
</template>

<script type='text/ecmascript-6'>
  export default {
    name: 'chatpage',
    data () {
      return {
        value: '',
        msgs: [
          {
            msg_id: 'aaaa',
            timestamp: '2019/03/14 14:35',
            current_person: true,
            show_time: true,
            from: '陈苗',
            from_avatar: './avatar.jpg',
            to: '小胖',
            to_avatar: './avatar1.jpg',
            msg_content: 'hello'
          },
          {
            msg_id: 'aaaa',
            timestamp: '2019/03/14 14:35',
            current_person: false,
            show_time: true,
            from: '陈苗',
            from_avatar: './avatar.jpg',
            to: '小胖',
            to_avatar: './avatar1.jpg',
            msg_content: 'hello'
          },
          {
            msg_id: 'aaaa',
            timestamp: '2019/03/14 14:35',
            current_person: false,
            show_time: false,
            from: '陈苗',
            from_avatar: './avatar.jpg',
            to: '小胖',
            to_avatar: './avatar1.jpg',
            msg_content: 'hello'
          }, {
            msg_id: 'aaaa',
            timestamp: '2019/03/14 14:35',
            current_person: true,
            show_time: true,
            from: '陈苗',
            from_avatar: './avatar.jpg',
            to: '小胖',
            to_avatar: './avatar1.jpg',
            msg_content: 'hello'
          },
          {
            msg_id: 'aaaa',
            timestamp: '2019/03/14 14:35',
            current_person: false,
            show_time: true,
            from: '陈苗',
            from_avatar: './avatar.jpg',
            to: '小胖',
            to_avatar: './avatar1.jpg',
            msg_content: 'hello'
          },
          {
            msg_id: 'aaaa',
            timestamp: '2019/03/14 14:35',
            current_person: false,
            show_time: false,
            from: '陈苗',
            from_avatar: './avatar.jpg',
            to: '小胖',
            to_avatar: './avatar1.jpg',
            msg_content: 'hello'
          }, {
            msg_id: 'aaaa',
            timestamp: '2019/03/14 14:35',
            current_person: true,
            show_time: true,
            from: '陈苗',
            from_avatar: './avatar.jpg',
            to: '小胖',
            to_avatar: './avatar1.jpg',
            msg_content: 'hello'
          },
          {
            msg_id: 'aaaa',
            timestamp: '2019/03/14 14:35',
            current_person: false,
            show_time: true,
            from: '陈苗',
            from_avatar: './avatar.jpg',
            to: '小胖',
            to_avatar: './avatar1.jpg',
            msg_content: 'hello'
          },
          {
            msg_id: 'aaaa',
            timestamp: '2019/03/14 14:35',
            current_person: false,
            show_time: false,
            from: '陈苗',
            from_avatar: './avatar.jpg',
            to: '小胖',
            to_avatar: './avatar1.jpg',
            msg_content: 'hello'
          }, {
            msg_id: 'aaaa',
            timestamp: '2019/03/14 14:35',
            current_person: true,
            show_time: true,
            from: '陈苗',
            from_avatar: './avatar.jpg',
            to: '小胖',
            to_avatar: './avatar1.jpg',
            msg_content: 'hello'
          },
          {
            msg_id: 'aaaa',
            timestamp: '2019/03/14 14:35',
            current_person: false,
            show_time: true,
            from: '陈苗',
            from_avatar: './avatar.jpg',
            to: '小胖',
            to_avatar: './avatar1.jpg',
            msg_content: 'hello'
          },
          {
            msg_id: 'aaaa',
            timestamp: '2019/03/14 14:35',
            current_person: false,
            show_time: false,
            from: '陈苗',
            from_avatar: './avatar.jpg',
            to: '小胖',
            to_avatar: './avatar1.jpg',
            msg_content: 'hello'
          }
        ],
        options: {
          startY: 0,
          observeDOM: true
        }
      }
    },
    methods: {
      back () {
        this.$router.go(-1)
      },
      sendMessage () {
        event.preventDefault() // 禁止默认事件（默认是换行）
        let newMsg = {}
        newMsg.timestamp = '2019/03/14 17:35'
        newMsg.current_person = false
        newMsg.show_time = true
        newMsg.from = '陈苗'
        newMsg.from_avatar = './avatar.jpg'
        newMsg.to = '小胖'
        newMsg.to_avatar = './avatar1.jpg'
        newMsg.msg_content = this.value
        this.msgs.push(newMsg)
        this.value = ''
      }
    },
    watch: {
      msgs () {
        setTimeout(() => {
          this.$refs.scrollChat.scrollTo(0, this.$refs.scrollChat.scroll.maxScrollY, 0)
        }, 200)
      }
    },
    mounted () {
      this.options.startY = document.documentElement.clientHeight - this.$refs.scrollChat.$refs.listWrapper.scrollHeight - 70
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
        height 600px
        background-color #f7f7f7

        .msg-wrapper
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
</style>
