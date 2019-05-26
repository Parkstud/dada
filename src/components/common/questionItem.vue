<template>
  <div class="question-item" @click="toProblemDetails">
    <div class="question-item">
      <div class="center">
        <div class="question-propose">
          <div class="questioner-info">
            <img class="question-avatar" width="36" height="36" v-show="problemItem.avatar"
                 :src="this.imgURL+problemItem.avatar">
            <span class="questioner-name">{{problemItem.username}}</span>
          </div>
          <span class="questioner-time">{{getDateDiff(problemItem.time)}}</span>
        </div>
        <div class="question-header">
          <span class="cate">{{showCategory(problemItem.category)}}</span>
          <span class="question-title">
             {{problemItem.title}}
          </span>
        </div>
        <div class="content">
          <div class="answer-people">
               <span class="answer-name"
                     v-show="commentInfo.username">{{commentInfo.username}}:
               </span>
            <span class="answer-content" v-show="commentInfo.comments"
                  v-html="transferString(commentInfo.comments)">
              </span>
          </div>
        </div>
      </div>
      <div class="bottom-wrapper " :class="commentInfo.id?'border-top-1px':''">
        <div class="put-good" @click.stop="pullUp">
          <div v-show="commentInfo.id">
            <i class="cubeic-good"
               :class="commentInfo.userLike===1?'adoption':'adoption-not'">
              <span class="text" v-if="commentInfo.awesome>0">{{commentInfo.awesome}}</span>
              <span class="text" v-else>赞同</span>
            </i>
          </div>
        </div>
        <div class="put-bad " :class="commentInfo.id?'border-right-1px':''" @click.stop="pullDown">
          <div v-show="commentInfo.id">
            <i class="cubeic-bad"
               :class="commentInfo.userLike===2?'oppose':'oppose-not'">
              <span class="text" v-if="commentInfo.badReview>0">{{commentInfo.badReview}}</span>
              <span class="text" v-else>反对</span>
            </i>
          </div>
        </div>
        <div class="put-comment" :class="commentInfo.id?'':'only-sty'">
          <div>
              <span class="comment-wrapper">
                <span class="cubeic-message"></span>
                <span class="text" v-if="commentInfo.answerCount">{{commentInfo.answerCount}}</span>
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
        commentInfo: {},
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
        console.log('wathc problemItem')
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
      // 替换所有回车换行符
      transferString (content) {
        let string = content
        try {
          string = (string + '').replace(/\r\n/g, '<br>')
          string = (string + '').replace(/\n/g, '<br>')
        } catch (e) {
          alert(e.message)
        }
        return string
      },
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

        if (!this.commentInfo.id) {
          this.toProblemDetails()
        }

        if (this.commentInfo.userLike === 2) {
          this.commentInfo.userLike = 0
          this.commentInfo.badReview--
        } else if (this.commentInfo.userLike === 1) {
          this.commentInfo.userLike = 2
          this.commentInfo.badReview++
          this.commentInfo.awesome--
        } else {
          this.commentInfo.userLike = 2
          this.commentInfo.badReview++
        }
        this.changeAwesome()
      },
      // 修改当前用户的赞成反对数
      changeAwesome () {
        let url = '/Interaction/awesome'
        let userLikes = {}
        userLikes.commentId = this.commentInfo.id
        userLikes.result = this.commentInfo.userLike
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

        if (!this.commentInfo.id) {
          this.toProblemDetails()
        }

        if (this.commentInfo.userLike === 1) {
          this.commentInfo.userLike = 0
          this.commentInfo.awesome--
        } else if (this.commentInfo.userLike === 2) {
          this.commentInfo.userLike = 1
          this.commentInfo.awesome++
          this.commentInfo.badReview--
        } else {
          this.commentInfo.nowUserLike = 1
          this.commentInfo.awesome++
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
      getData () {
        // 查询提问人信息 , 评论 回复 点赞信息
        let url = '/problemInfo/problem/' + this.problemItem.id
        this.$http.get(url, null)
          .then((response) => {
            let data = response.data.body.data
            if (data) {
              this.commentInfo = data
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
          right 10px

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
          margin-top 4px
          display -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 4;
          overflow: hidden;
          white-space: normal
          letter-spacing 1px
          line-height 20px
          font-size 14px

        .answer-wrapper
          display flex
          align-items center

    .bottom-wrapper
      margin-top 6px
      color: rgb(169, 181, 192)
      height 32px
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
        font-weight bold

        .cubeic-good, .cubeic-message, .cubeic-bad
          font-size 18px

        div
          margin 0 auto

        .text
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
