<template>
  <div class="question-item" @click="toProblemDetails">
    <div class="question-item">
      <div class="center">
        <div class="question-propose">
          <div class="questioner-info">
            <img class="question-avatar" width="36" height="36" v-show="questionPerson.avatar"
                 :src="this.imgURL+questionPerson.avatar">
            <span class="questioner-name">{{questionPerson.username}}</span>
          </div>
          <span class="questioner-time">{{getDateDiff(problemItem.time)}}</span>
        </div>
        <div class="question-header">
          <span class="cate">{{showCategory(problemItem.category)}}</span>
          <span>
             {{problemItem.title}}
          </span>
        </div>
        <div class="content">
          <div class="answer-people" v-show="commentCount>0">
            <span class="answer-name">{{answerPerson.username}}: </span>
            <span class="answer-content" v-html="answerContent">
            </span>
          </div>
        </div>
      </div>
      <div class="bottom-wrapper border-top-1px">
        <div class="put-good border-right-1px" @click.stop="pullUp">
          <div v-show="problemItem.open===0 && commentCount>0">
            <i class="cubeic-good"
               :class="nowUserLike===1?'adoption':'adoption-not'">
              <span class="text" v-if="awesomeCount>0">{{awesomeCount}}</span>
              <span class="text" v-else>赞同</span>
            </i>
          </div>
        </div>
        <div class="put-bad border-right-1px" @click.stop="pullDown">
          <div v-show="problemItem.open===0 && commentCount>0">
            <i class="cubeic-bad"
               :class="nowUserLike===2?'oppose':'oppose-not'">
              <span class="text" v-if="badReview>0">{{badReview}}</span>
              <span class="text" v-else>反对</span>
            </i>
          </div>
        </div>
        <div class="put-comment">
          <div>
              <span class="comment-wrapper">
                <span class="cubeic-message"></span>
                <span class="text" v-if="this.commentCount>0">{{this.commentCount}}</span>
                <span class="text" v-else>评论</span>
              </span>
          </div>
        </div>

      </div>
    </div>
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
        questionPerson: {},
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
        flush: 0,
        categoryArr: ['', '数据结构理论', '线性表', '栈和队列', '字符串', '树', '图', '算法']
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
        this.questionPerson = {}
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
      showCategory (index) {
        if (index) {
          return this.categoryArr[index]
        }
        return '数据结构'
      },
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
        if (this.problemItem.avatar) {
          this.questionPerson.avatar = this.problemItem.avatar
        }
        if (this.problemItem.username) {
          this.questionPerson.username = this.problemItem.username
        }
        let url = '/problemInfo/problem/' + this.problemItem.id
        this.$http.get(url, null)
          .then((response) => {
            let data = response.data.body.data
            this.questionPerson.username = data.username
            this.questionPerson.avatar = data.avatar
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

    .center
      flex 1
      margin-left 10px
      margin-right 10px

      .question-propose
        display flex
        font-size 14px;
        padding-top 12px
        height 30px
        align-items center
        justify-content space-between
        color: #7A7A7A

        .questioner-info
          display flex
          align-items center
          justify-items center

          .question-avatar
            margin-right 10px
            border-radius 50%

          .questioner-name
            font-size 14px;

        .questioner-time
          position relative
          right 0

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
        margin-top 4px

        .cate
          color: #3298fe
          background #e5edff
          font-size 12px
          display inline-block
          padding 4px
          border-radius 6px
          line-height 12px

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
      height 40px
      display flex
      justify-items center
      align-items center

      .oppose-not
        color: #7A7A7A

      .adoption-not
        color: #7A7A7A

      .oppose
        color: #007efe

      .adoption
        color: #007efe

      .put-good:active
        background red

      .put-good, .put-bad, .put-comment
        flex 1
        height 100%
        display flex
        align-items center
        justify-items center
        text-align center

        .cubeic-good, .cubeic-message, .cubeic-bad
          font-size 18px

        div
          margin 0 auto

        .text
          font-weight lighter
          margin-left 6px
          font-size 16px

  /*  .approval-wrapper
      margin-right 20px
      .cube-btn
        background-color #f7f7f7
        padding 6px

        .text
          display inline-block
          padding-top 6px
          margin-left -6px

        &:nth-child(1)
          margin-right 10px

      .cubeic-good
        margin-right 5px

    .comment-wrapper
      .cubeic-message
        margin-right 5px*/
</style>
