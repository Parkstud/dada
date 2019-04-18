<template>
  <div class="questionPage">
    <back-header :backText="backText"></back-header>
    <div class="scroll-list-wrap" ref="question">
      <cube-scroll>
        <div class="question-wrapper">
          <span class="cubeic-question"></span>
          <span class="question">{{question.title}}</span>
        </div>
        <div class="topic-wrapper" v-for="(item,index) in answerData" :key="index">
          <div class="title">
            <span class="title-content">匹配题目</span>
          </div>
          <div class="topic-content">
            <div class="split-line"></div>
            <div class="question-des">
              <p v-html="transferString(item.problem.title)">
              </p>
            </div>
            <div class="answer-wrapper">
              <div class="split-line2"></div>
              <div class="solve-name">解答</div>
              <div class="solve-content">
                {{item.problem.answerContent}}
              </div>
              <div class="forecast">
                <div class="forecast-title">匹配预估</div>
                <div class="forecast-value">{{item.similarityDegree}}%</div>
              </div>
              <div class="split-line3"></div>
              <div class="help-wrapper">
                <div class="help-des">
                  是否采纳该答案
                </div>
                <div class="help-msg">
                  <div class="help-yes" :class="item.problem.id===adoption?'adoption':''">
                    <span class="cubeic-pullup"></span>
                    <span class="help-info" @click="adoptionAnswer(item.problem.id)">采纳</span>
                  </div>
                </div>
              </div>
              <div class="split-line2"></div>
            </div>
          </div>
        </div>
      </cube-scroll>
    </div>
    <div class="bottom">
      <cube-button @click="showBtn">发布人工问答</cube-button>
      <cube-button :light="true" @click="backPutQuestion">再问一题</cube-button>
    </div>
  </div>
</template>

<script type='text/ecmascript-6'>
  import BackHeader from './backHeader'

  export default {
    name: 'quesion',
    data () {
      return {
        backText: '返回',
        // 采纳答案
        adoption: -1,
        question: this.$route.params.question,
        answerData: []
      }
    },
    methods: {
      showBtn () {
        this.$createDialog({
          type: 'confirm',
          icon: 'cubeic-important',
          title: '确定要发布到人工回答?',
          confirmBtn: {
            text: '确定',
            active: true,
            disabled: false,
            href: 'javascript:;'
          },
          cancelBtn: {
            text: '取消',
            active: false,
            disabled: false,
            href: 'javascript:;'
          },
          onConfirm: () => {
            this.pushPerson()
            this.$createToast({
              type: 'info',
              time: 1000,
              txt: '发布成功'
            }).show()
          }
        }).show()
      },
      pushPerson () {
        let url = '/control/problem/putPersonAnswer'
        let param = new URLSearchParams()
        param.append('problemId', this.question.id)
        this.$http.post(url, param)
          .then((response) => {
          }).catch((error) => {
          console.log(error)
        })
      },
      backPutQuestion () {
        this.$router.go(-1)
      },
      // 采纳按钮
      adoptionAnswer (answerid) {
        let flag = 'false'
        if (this.adoption === answerid) {
          this.adoption = -1
          flag = 'true'
        } else {
          this.adoption = answerid
        }

        let url = '/control/problem/adoptAnswerProblem'
        let param = new URLSearchParams()
        param.append('problemId', this.question.id)
        param.append('answerId', answerid)
        param.append('flag', flag)
        this.$http.post(url, param)
          .then((response) => {
          }).catch((error) => {
          console.log(error)
        })
      },
      // 替换所有回车换行符
      transferString (content) {
        let string = content
        try {
          string = string.replace(/\r\n/g, '<br>')
          string = string.replace(/\n/g, '<br>')
        } catch (e) {
          alert(e.message)
        }
        return string
      }
    },
    mounted () {
      // 获取浏览器可视区域高度
      this.clientHeight = `${document.documentElement.clientHeight}`
      this.$refs.question.style.height = (this.clientHeight - 74) + 'px'
      // 自动问答接口
      let url = '/problem/intelligentQuestionAnswering'
      this.$http.get(url, {
        params: {
          questionStr: this.question.title
        }
      }).then((response) => {
        if (response.data.head.stateCode === 200) {
          this.answerData = response.data.body.data
        }
      }).catch((error) => {
        console.log(error)
      })
    },
    components: { BackHeader }
  }

</script>

<style lang='stylus' rel='stylesheet/stylus'>
  .questionPage
    .scroll-list-wrap
      height 600px
      background-color #f1f1f1

      .question-wrapper
        padding 20px
        background-color #f1f1f1
        font-size 20px
        line-height 26px
        letter-spacing 4px

        .cubeic-question
          margin-right 10px
          color #2faefe

      .topic-wrapper
        .title
          background-color white
          padding 16px 0 16px 0

          .title-content
            margin-left 24px
            font-size 20px
            font-weight bold
            line-height 20px

        .topic-content
          background-color #f1f1f1
          font-size 16px

          .split-line
            height 2px
            width 100%

          .question-des
            background-color #fff
            margin 0 4px
            padding 20px 30px
            letter-spacing 4px
            line-height 24px

          .answer-wrapper
            margin 0 20px
            background-color white

            .split-line2
              height 12px
              background-color #f8f8f8

            .solve-name
              font-size 20px
              font-weight bold
              padding 20px 0 16px 10px

            .solve-content
              font-size 16px
              line-height 26px
              letter-spacing 4px
              padding 0 16px

            .forecast
              .forecast-title
                color: #45bfff
                font-size 20px
                font-weight bold
                padding 20px 0 16px 10px

              .forecast-value
                padding 0 0 20px 16px

            .split-line3
              height 2px
              width 100%
              background-color #f1f1f1

            .help-wrapper
              display: flex;
              padding 16px
              justify-content: space-between;
              font-size 12px

              .help-des
                font-size 14px
                line-height 30px

              .help-msg
                display flex
                justify-content: space-between;
                color #bababa

                .adoption
                  color: #45bfff

                .help-yes
                  .cubeic-pullup
                    font-size 30px
                    vertical-align top

                  .help-info
                    display inline-block
                    height 30px
                    vertical-align middle

    .bottom
      position absolute
      bottom 0
      left 0
      width 100%
      height 50px
      z-index 999
      border 1px solid #f1f1f1
      background-color #fff
      box-sizing border-box
      display flex
      justify-content space-between

      .cube-btn
        margin 10px 10px 10px 10px
        border-radius 5px
        line-height 2px

        &:first-child
          background-color #45bfff

        &:nth-child(2)
          color: #45bfff

</style>
