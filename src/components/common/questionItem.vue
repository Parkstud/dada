<template>
  <div class="question-item" @click="toProblemDetails">
    <div class="left-blank"></div>
    <div class="center">
      <div class="question-propose">
        <div class="questioner-info">
          <span>提问人:</span>
          <span class="questioner-avatar"></span>
          <span class="questioner-name">{{this.questionPerson}}</span>
        </div>
      </div>
      <div class="question-header">{{problemItem.title}}</div>
      <div class="content">
        <div class="answer-people" v-show="answerPerson.path">
          <img class="avatar" width="30" height="30" :src="this.imgURL+answerPerson.path">
          <span class="answer-name">{{this.answerPerson.username}}</span>
        </div>

        <div class="answer-wrapper">
          <p class="answer-content">
            {{this.answerContent}}
          </p>
        </div>
        <div class="bottom-wrapper">
        <span class="approval-wrapper">
          <span class="cubeic-good"></span>
          <span class="good-number">{{this.awesomeCount}}</span>
        </span>
          <span class="comment-wrapper">
           <span class="cubeic-message"></span>
          <span class="comment-number">{{this.commentCount}}</span>
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
        // 提问人
        questionPerson: '',
        // 回答人
        answerPerson: {},
        // 回复内容
        answerContent: '',
        // 评论数
        commentCount: 0,
        // 赞数
        awesomeCount: 0
      }
    },
    props: {
      problemItem: {
        type: Object,
        required: true
      }
    },
    methods: {
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
      }
    },

    mounted () {
      // 查询提问人信息 , 评论 回复 点赞信息
      let url = '/problemInfo/problem/' + this.problemItem.id
      this.$http.get(url, null)
        .then((response) => {
          let data = response.data.body.data
          console.log(data)
          this.questionPerson = data.username
          if (data.comments.length === 0) {
            // 没有回复 显示默认回复
            this.answerContent = this.problemItem.answerContent
          } else {
            this.answerPerson = data.comments[0]
            this.answerContent = data.comments[0].comments
            this.commentCount = data.comments.length
            // 计算赞数
            this.awesomeCount = this.computedAwesome(data.comments)
          }
        })
    }
  }
</script>

<style lang='stylus' rel='stylesheet/stylus'>
  .question-item
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
        color: rgb(169, 181, 192)

        .questioner-avatar
          margin-right 5px

        .questioner-name
          font-size 14px;

      .question-header
        font-size 16px
        font-weight 560;
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
          margin-top 10px
          .avatar
            vertical-align:middle
            border-radius 50%
          .answer-name
            margin-left 5px

        .answer-wrapper
          height 80px
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

          .approval-wrapper
            margin-right 20px

            .cubeic-good
              margin-right 5px

          .comment-wrapper
            .cubeic-message
              margin-right 5px

    .right-blank
      width 20px
      height 20px
</style>
