<template>
  <div class="question-item" @click="toProblemDetails">
    <div class="left-blank"></div>
    <div class="center">
      <div class="question-propose">
        <div class="questioner-info">
          <span>提问人:</span>
          <span class="questioner-avatar"></span>
          <span class="questioner-name">{{questionPerson}}</span>
        </div>
        <span class="questioner-time">{{formatData(problemItem.time,1)}}</span>
      </div>
      <div class="question-header">
        问题: {{problemItem.title}}
      </div>
      <div class="content">
        <div class="answer-people" v-show="commentCount>0">
          <img class="avatar" width="24" height="24" :src="this.imgURL+answerPerson.path">
          <span class="answer-name">{{answerPerson.username}}</span>
        </div>
        <div class="answer-wrapper">
          <p class="answer-content" v-html="answerContent">

          </p>
        </div>
        <div class="bottom-wrapper">
        <span class="approval-wrapper" v-show="problemItem.open===0 && commentCount>0">
           <cube-button :inline="true" icon="cubeic-pullup"
                        :class="nowUserLike===1?'adoption':'adoption-not'" @click.stop="pullUp">
                      <span class="text">赞同 {{awesomeCount}}</span>
           </cube-button>
           <cube-button :inline="true" icon="cubeic-pulldown" @click.stop="pullDown"
                        :class="nowUserLike===2?'oppose':'oppose-not'">
            <span class="text">反对 {{badReview}}</span>
          </cube-button>
        </span>
          <span v-show="problemItem.open===1 || commentCount===0 ">
              <span class="comment-wrapper">
              <span class="cubeic-message"></span>
              <span class="comment-number">{{this.commentCount}}</span>
          </span>
          </span>
        </div>

      </div>
    </div>
    <div class="right-blank"></div>
  </div>
</template>

<script type='text/ecmascript-6'>
  export default {
    name: 'questionItem',
    data () {
      return {
        // 阻止多次触发
        evTimeStamp: 0,
        // 提问人
        questionPerson: '',

        // 回答人
        answerPerson: {},
        // 回复内容
        answerContent: '',
        // 评论数
        commentCount: 0,
        // 赞数
        awesomeCount: 0,
        // 反对数
        badReview: 0,
        // 当前用户是否点赞
        nowUserLike: 0,
        // 点赞id
        commentId: null,
        // 当前是否需要刷新
        flush: 0
      }
    },
    props: {
      problemItem: {
        type: Object,
        required: true
      }
    },
    watch: {
      problemItem () {
        this.questionPerson = ''
        this.answerPerson = {}
        this.answerContent = 0
        this.commentCount = 0
        this.awesomeCount = 0
        this.badReview = 0
        this.nowUserLike = 0
        this.commentId = null
        this.getData()
      }
    },
    activated () {
      // 修改信息
      if (this.$store.state.updateProblem === this.problemItem.id) {
        this.getData()
        this.$store.commit('setProblem', -1)
      }
    },
    methods: {
      // 反对
      pullDown () {
        // 处理多次点击
        let now = new Date()
        if (now - this.evTimeStamp < 100) {
          return
        }
        this.evTimeStamp = now
        if (this.nowUserLike === 2) {
          this.nowUserLike = 0
          this.badReview--
        } else if (this.nowUserLike === 1) {
          this.nowUserLike = 2
          this.badReview++
          this.awesomeCount--
        } else {
          this.nowUserLike = 2
          this.badReview++
        }

        this.changeAwesome()
      },
      // 修改当前用户的赞成反对数
      changeAwesome () {
        let url = '/Interaction/awesome'
        let userLikes = {}
        userLikes.commentId = this.commentId
        userLikes.result = this.nowUserLike
        this.$http.post(
          url,
          this.$qs.stringify(userLikes),
          { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
        ).then((res) => {
          if (res.data.body.data) {
            console.log('有数据')
            console.log(res.data.body.data)
            this.problemItem = res.data.body.data
          }
        }).catch((err) => {
          console.log(err)
        })
      },
      // 赞同
      pullUp () {
        // 处理多次点击
        let now = new Date()
        if (now - this.evTimeStamp < 100) {
          return
        }
        this.evTimeStamp = now
        if (this.nowUserLike === 1) {
          this.nowUserLike = 0
          this.awesomeCount--
        } else if (this.nowUserLike === 2) {
          this.nowUserLike = 1
          this.awesomeCount++
          this.badReview--
        } else {
          this.nowUserLike = 1
          this.awesomeCount++
        }

        this.changeAwesome()
      },
      // 跳转问题详情页
      toProblemDetails () {
        this.$router.push({
          name: 'problemDetails',
          params: { problem: this.problemItem }
        })
      },
      // 遍历 计算赞数
      computedAwesome (comments) {
        let sum = 0
        for (let i = 0; i < comments.length; i++) {
          sum += comments[i].awesome
        }
        return sum
      },
      computedBadReview (comments) {
        let sum = 0
        for (let i = 0; i < comments.length; i++) {
          sum += comments[i].badReview
        }
        return sum
      },
      getData () {
        // 查询提问人信息 , 评论 回复 点赞信息
        let url = '/problemInfo/problem/' + this.problemItem.id
        this.$http.get(url, null)
          .then((response) => {
            let data = response.data.body.data
            this.questionPerson = data.username
            this.nowUserLike = data.userLike
            if (data.comments.length === 0) {
              // 没有回复 显示默认回复
              this.answerContent = this.problemItem.answerContent
            } else {
              this.commentId = data.comments[0].id
              this.answerPerson = data.comments[0]
              this.answerContent = data.comments[0].comments
              this.commentCount = data.comments.length
              this.badReview = data.comments[0].badReview
              // 计算赞数
              this.awesomeCount = this.computedAwesome(data.comments)
              this.badReview = this.computedBadReview(data.comments)
            }
          })
      }
    },
    mounted () {
      this.getData()
    }
  }
</script>

<style lang='stylus' rel='stylesheet/stylus'>
  .question-item
    background-color white
    margin-bottom 10px
    display flex

    .left-blank
      width 20px

    .center
      flex 1
      width 0

      .question-propose
        display flex
        font-size 14px;
        height 30px
        align-items center
        justify-content space-between
        color: #7A7A7A

        .questioner-avatar
          margin-right 5px

        .questioner-time
          position relative
          right 0

        .questioner-name
          font-size 14px;

      .question-header
        font-size 16px
        color: #363636
        font-weight bold
        display -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
        white-space: normal
        line-height 26px

      .content
        width 100%

        .answer-people
          height 30px
          margin-top 4px

          .avatar
            vertical-align: middle
            border-radius 50%

          .answer-name
            margin-left 5px
            font-size 14px

        .answer-wrapper
          display flex
          align-items center

          .answer-content
            display -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 3;
            overflow: hidden;
            white-space: normal
            letter-spacing 1px
            line-height 20px
            font-size 14px

        .bottom-wrapper
          color: rgb(169, 181, 192)
          margin-top 20px
          margin-bottom 10px

          .approval-wrapper
            margin-right 20px

            .oppose-not
              color: #7A7A7A

            .adoption-not
              color: #7A7A7A

            .oppose
              color: #007efe

            .adoption
              color: #007efe

            .cube-btn
              background-color #f7f7f7
              padding 6px

              .text
                display inline-block
                padding-top 6px
                margin-left -6px

              .cubeic-pullup, .cubeic-pulldown
                font-size 30px
                line-height 15px
                vertical-align: middle;

              &:nth-child(1)
                margin-right 10px

            .cubeic-good
              margin-right 5px

          .comment-wrapper
            .cubeic-message
              margin-right 5px

    .right-blank
      width 20px
      height 20px
</style>
