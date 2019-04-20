<template>
  <div class="comment-detail">

    <div class="chat-header">
      <span class="cubeic-back" @click="back"></span>
      <span></span>
      <span class="txt">查看题目</span>
    </div>
    <cube-scroll ref="commentContainer" :options="scrollOptions" @pulling-up="onPullingUp">
      <!--评论内容-->
      <div class="comment-content">
        <div class="author-info">
          <!--@click="toHomepage(item.id)-->
          <span class="avatar">
            <img :src="imgURL+commentInfo.commentUserAvatar" width="50" height="50">
          </span>
          <span class="author-name">{{commentInfo.commentUserNickName}}</span>
          <span class="answer-time">{{commentInfo.commentTime}}</span>
          <span class="info-left">
              <span class="cubeic-message"></span>
              <span class="comment">{{replayInfo.length}}</span>
              <span class="cubeic-good" :class="hasLiked ?'active':''" @click="goodComment"></span>
              <span class="approve">{{commentInfo.awesome}}</span>
          </span>
          <p class="comments">
            {{commentInfo.commentComments}}
          </p>
        </div>
      </div>
      <div class="split"></div>
      <!--回复内容-->
      <div class="reply-wrapper" v-for="(item,index) in replayInfo" :key="index">
      <span class="avatar">
          <img :src="imgURL+item.avatar" width="40" height="40">
      </span>
        <div class="reply-content" @click="clickReply(item)">
          <span class="reply-name">{{item.replyUsername}}</span>
          <span class="reply-time">{{formatData(item.replyTime,1)}}</span>
          <p class="reply-content">
            {{item.repliedUsername?'回复 '+item.repliedUsername+' 的评论 :'+item.content:item.content}}
          </p>
        </div>
      </div>
    </cube-scroll>
    <!--底部-->
    <div class="chat-footer">
      <cube-input v-model="value" :placeholder="placeholder" @keyup.enter.native="sendReply">
        <span slot="prepend" class="temp-space"></span>
        <span slot="append" @click="sendReplyClick" class="cubeic-navigation"
              :class="value.length>0?'sending':'not-send'"></span>
      </cube-input>

    </div>
  </div>
</template>

<script type='text/ecmascript-6'>
  export default {
    name: 'commentDetail',
    data () {
      return {
        // 回复输入框
        value: '',
        commentInfo: this.$route.params.commentInfo,
        // 分页的当前页数
        current: 1,
        // 分页页数
        size: 10,
        // 是否点赞
        hasLiked: false,
        // 点击的回复
        replyOtherInfo: null,
        replayInfo: [],
        placeholder: '请输入你的回复内容',
        dialog: null,
        scrollOptions: {
          pullUpLoad: true,
          directionLockThreshold: 0
        }
      }
    },
    methods: {
      // 点击回复item
      clickReply (item) {
        this.replyOtherInfo = item
        this.dialog = this.$createDialog({
          type: 'alert',
          showClose: false,
          confirmBtn: {
            text: '取消',
            active: false,
            disabled: false,
            href: 'javascript:;'
          },
          onConfirm: (e) => {
            this.replyOtherInfo = null
          }
        }, (createElement) => {
          return [
            createElement('div', {
              'class': {
                'my-title': true
              },
              on: {
                click: this.clickReport
              },
              slot: 'title'
            }, '举报'),
            createElement('div', {
              'class': {
                'my-content': true,
                'border-top-1px': true
              },
              on: {
                click: this.replyOther
              },
              slot: 'title'
            }, '回复')
          ]
        }).show()
      },
      // 点击举报
      clickReport () {
        if (this.dialog) {
          this.dialog.hide()
        }
        // 跳转举报页面
        this.$router.push({
          name: 'report',
          params: {
            type: 3,
            reportInfo: this.replyOtherInfo,
            commentInfo: this.commentInfo
          }
        })
        this.replyOtherInfo = null
      },
      // 点击发送信息
      sendReplyClick () {
        this.sendInfo()
      },
      // 回复别人
      replyOther () {
        console.log(this.replyOtherInfo)
        if (this.replyOtherInfo) {
          this.placeholder = '回复: ' + this.replyOtherInfo.replyUsername
        }
        if (this.dialog) {
          this.dialog.hide()
        }
      },
      // enter触发回复按钮
      sendReply () {
        event.preventDefault() // 禁止默认事件（默认是换行）
        this.sendInfo()
      },
      back () {
        this.$router.go(-1)
      },
      // 点赞按钮

      goodComment () {
        if (this.hasLiked) {
          this.commentInfo.awesome--
        } else {
          this.commentInfo.awesome++
        }

        this.hasLiked = !this.hasLiked
        this.$http.post('/Interaction/awesome',
          this.$qs.stringify({
            commentId: this.commentInfo.commentId
          })
          ,
          { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
        ).then((response) => {
          console.log(response)
        }).catch((error) => {
          console.log(error)
        })
      },
      onPullingUp () {
        if (this.replayInfo.length > 0 && this.replayInfo.length % this.size === 0) {
          this.current++
        }
        this.$http.get('/commentInfo/reply/page', {
          params: {
            commentId: this.commentInfo.commentId,
            current: this.current,
            size: this.size
          }
        }).then((response) => {
          let data = response.data.body.data
          if (data.records.length > 0) {
            let temp = this.replayInfo.length % this.size
            this.replayInfo = this.replayInfo.concat(data.records.slice(temp))
          } else {
            this.$refs.commentContainer.forceUpdate()
          }
        }).catch((error) => {
          console.log(error)
        })
      },
      sendInfo () {
        if (this.value.length === 0) {
          return
        }
        // 设置回复信息
        let replyinfo = {}
        replyinfo.commentId = this.commentInfo.commentId
        replyinfo.content = this.value
        if (this.replyOtherInfo) {
          replyinfo.repliedUserId = this.replyOtherInfo.replyUserId
          replyinfo.repliedUsername = this.replyOtherInfo.replyUsername
          this.replyOtherInfo = null
        }

        // 发送
        this.$http.post('/Interaction/reply',
          this.$qs.stringify(replyinfo),
          { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
        ).then((response) => {
          // 重新请求当前页信息

          if (this.replayInfo.length > 0 && this.replayInfo.length % this.size === 0) {
            this.current++
          }

          this.$http.get('/commentInfo/reply/page', {
            params: {
              commentId: this.commentInfo.commentId,
              current: this.current,
              size: this.size
            }
          }).then((response) => {
            let data = response.data.body.data
            if (data.records.length > 0) {
              let temp = this.replayInfo.length % this.size
              this.replayInfo = this.replayInfo.concat(data.records.slice(temp))
            }
          }).catch((error) => {
            console.log(error)
          })
        }).catch((error) => {
          console.log(error)
        })
        // 清空信息
        this.value = ''
      }
    },
    mounted () {
      // 设置滑动高度
      this.clientHeight = `${document.documentElement.clientHeight}`
      this.$refs.commentContainer.$refs.wrapper.style.height = this.clientHeight - 81 + 'px'
      // 通过comment 获取评论信息
      this.$http.get('/commentInfo/comment/id', {
        params: {
          commentId: this.commentInfo.commentId
        }
      }).then((response) => {
        this.commentInfo.awesome = response.data.body.data.awesome
      }).catch((error) => {
        console.log(error)
      })

      // 获取评论信息
      this.$http.get('/commentInfo/reply/page', {
        params: {
          commentId: this.commentInfo.commentId,
          current: this.current,
          size: this.size
        }
      }).then((response) => {
        let data = response.data.body.data
        this.replayInfo = data.records
      }).catch((error) => {
        console.log(error)
      })

      // 获取当前用户是否点赞该评论

      this.$http.get('/Interaction/awesome', {
        params: {
          commentId: this.commentInfo.commentId
        }
      }).then((response) => {
        response.data.body.data = this.hasLiked
      })
    }

  }
</script>

<style lang='stylus' rel='stylesheet/stylus'>
  .my-content

    height 50px
    line-height 50px
    color: #999
    background-color: #fff
    margin-top 0

  .my-title
    height 50px
    line-height 50px
    color: #999
    background-color: #fff
    background-clip: padding-box;
    box-sizing: border-box;

  .comment-detail
    .chat-header
      display flex
      justify-content space-between
      align-items center
      height 40px
      background-color #fff
      box-shadow: 1px 2px 4px rgba(0, 0, 0, 0.1)

      .cubeic-back
        display inline-block
        width 40px
        height 30px
        line-height 30px
        font-size 20px
        color #64a4fe
        text-align center

      .txt
        display inline-block
        padding-right 20px
        color #64a4fe

    .comment-content
      .author-info
        position: relative;
        margin 10px
        color: #999999

        .avatar > img
          border-radius 50%
          margin-right 8px

        .author-name
          display inline-block
          position absolute
          top: 4px
          font-size 14px

        .answer-time
          display inline-block
          position absolute
          top: 30px
          font-size 12px

        .info-left
          position absolute
          right 0
          margin-right 20px
          top 20px

          .cubeic-good
            &.active
              color #64a4fe

          .comment, .approve
            display inline-block
            width 30px
            text-align center

        .comments
          margin-top 10px
          letter-spacing 1px
          color: #444

    .split
      height 10px
      background-color #ebebeb

    .reply-wrapper
      margin 10px
      position relative
      border-bottom 1px solid gray
      padding-bottom 20px

      .avatar > img
        margin-right 10px
        border-radius 50%

      .reply-content
        .reply-name
          position absolute
          top 5px
          left 50px

        .reply-time
          position absolute
          right 0
          top: 5px

        .reply-content

          margin-left 50px

    .chat-footer
      box-shadow: 1px 2px 4px rgba(0, 0, 0, 0.5)
      height: 40px
      background-color gray

      .temp-space
        margin 0 5px

      .cubeic-navigation
        font-size 20px
        margin 0 5px

      .not-send
        color #d1d1d1

      .sending
        color #0a89ff
</style>
