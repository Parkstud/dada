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
        <span class="reply-name">{{item.replyUsername}}</span>
        <span class="reply-time">{{formatData(item.replyTime,1)}}</span>
        <p class="reply-content">
          {{item.repliedUsername?'回复 '+item.repliedUsername+' 的评论 :'+item.content:item.content}}
        </p>
      </div>

    </cube-scroll>

    <!--底部-->
    <div class="chat-footer">

      <cube-input v-model="value" @keyup.enter.native="sendMessage">
        <span slot="prepend" class="cubeic-picture"></span>
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
        size: this.size,
        // 是否点赞
        hasLiked: false,
        replayInfo: [],

        scrollOptions: {
          pullUpLoad: true,
          directionLockThreshold: 0
        }
      }
    },
    methods: {
      back () {
        this.$router.go(-1)
      },
      // 点赞按钮
      goodComment () {

      },
      onPullingUp () {
        console.log('asdad')
        setTimeout(() => {
          // 如果没有新数据
          this.$refs.commentContainer.forceUpdate()
        }, 500)
      },
      sendReplyClick () {

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
        if (data.total === this.size) {
          this.current++
        }
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
          top 26px

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

      .reply-name
        position absolute
        top 10px

      .reply-time
        position absolute
        right 0
        top: 10px

      .reply-content
        margin-left 50px

    .chat-footer
      border-top 1px solid rgba(0, 0, 0, 0.1)
      height: 40px
      background-color gray

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
