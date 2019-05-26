<template>
  <div class="questionPage">
    <back-header :backText="backText"></back-header>
    <div class="scroll-list-wrap" ref="question">
      <cube-scroll ref="scroll">
        <div class="question-wrapper">
          <span class="cubeic-question"></span>
          <span class="question">{{question.title}}</span>
        </div>
        <div class="load-wrapper" v-show="!dataloaded">
          <div class="cube-loading">
                <span class="cube-loading-spinners"><i
                  class="cube-loading-spinner"></i><i class="cube-loading-spinner"></i><i
                  class="cube-loading-spinner"></i><i class="cube-loading-spinner"></i><i
                  class="cube-loading-spinner"></i><i class="cube-loading-spinner"></i><i
                  class="cube-loading-spinner"></i><i class="cube-loading-spinner"></i><i
                  class="cube-loading-spinner"></i><i class="cube-loading-spinner"></i><i
                  class="cube-loading-spinner"></i><i class="cube-loading-spinner"></i>
            </span>
          </div>
        </div>

        <div class="no-anwser" v-show="answerData.length===0 && dataloaded">
          <div class="show-no">暂无答案</div>
          <div class="send-people">
            <span class="txt">是否发送到人工回答？</span>
            <div class="btn-wrapper">
              <cube-button
                :class="[hasSend ? 'send':'send-not']"
                :inline="true" @click="sendPeople">
                发送人工回答
              </cube-button>
            </div>
          </div>
        </div>
        <div class="topic-wrapper" v-for="(item,index) in answerData" :key="index"
             v-show="dataloaded">
          <div class="topic-content">
            <div class="answer-wrapper">
              <div class="split-line2"></div>
              <div class="solve-name">答案{{resolveIndex(index)}}</div>
              <div class="solve-content"
                   v-html="transferString(item.problem.answerContent?item.problem.answerContent:'')">

              </div>
              <div class="forecast">
                <div class="forecast-title">匹配预估</div>
                <div class="forecast-value"><span class="my-tag">{{item.similarityDegree ?item.similarityDegree.toFixed(1) : ''}}%</span>
                </div>
              </div>
              <div class="split-line3"></div>
              <div class="help-wrapper">
                <div class="help-des">
                  评价一下该答案
                </div>
                <div class="help-msg">
                  <div class="help-yes">
                    <cube-button :inline="true" icon="cubeic-good"
                                 :class="index===adoption?'adoption':'adoption-not'"
                                 @click="adoptionAnswer(item,index)">
                      <span class="text">赞同 {{index===adoption?'1':''}}</span>
                    </cube-button>
                    <!--<span class="help-info"">-->
                    <!--采纳</span>-->
                    <cube-button :inline="true" icon="cubeic-bad"
                                 :class="index===oppose?'oppose':'oppose-not'"
                                 @click="opposeAnswer(item,index)">
                      <span class="text">反对 {{index===oppose?'1':''}}</span>
                    </cube-button>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </cube-scroll>
    </div>
    <!--<div class="bottom">-->
    <!--<cube-button @click="showBtn">发布人工问答</cube-button>-->
    <!--<cube-button :light="true" @click="backPutQuestion">再问一题</cube-button>-->
    <!--</div>-->
  </div>
</template>

<script type='text/ecmascript-6'>
  import BackHeader from './backHeader'

  export default {
    name: 'quesion',
    data () {
      return {
        hasSend: false,
        backText: '返回',
        // 赞同答案
        adoption: -1,
        oppose: -1,
        question: {},
        answerData: [],
        // 数据加载完成
        dataloaded: false
      }
    },
    beforeRouteLeave (to, from, next) {
      // 通知首页更新
      if (this.oppose !== -1) {
        this.$store.commit('setFlushCount')
      }
      next()
    },
    // beforeRouteEnter (to, from, next) {
    //   if (from.name === 'putQuestionPage') {
    //     to.meta.isBack = false
    //   }
    //   next()
    // },
    // activated () {
    //   if (!this.$route.meta.isBack) {
    //     this.getData()
    //   }
    //   this.$route.meta.isBack = false
    // },
    methods: {
      resolveIndex (index) {
        if (index === 0) {
          return '一'
        }
        if (index === 1) {
          return '二'
        }
        if (index === 2) {
          return '三'
        }
      },
      test (item) {
        console.log(item)
      },
      sendPeople () {
        if (this.hasSend) {
          return
        }
        this.hasSend = true

        // 设置问题开放
        console.log(this.question)
        if (this.answerData.length === 0) {
          this.question.open = 0
          this.$http.post('/control/problem/problemInfo',
            this.$qs.stringify(this.question),
            { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
          ).then((res) => {
            if (res.data.body.data) {
              this.showToast('发送成功！')
              this.$store.commit('setFlushCount')
            }
          }).catch((error) => {
            this.showToast('发送失败！')
            this.hasSend = false
            console.log(error)
          })
        }
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
      // 反对
      opposeAnswer (item, index) {
        this.adoption = -1
        let flag = null
        if (this.oppose === index) {
          this.oppose = -1
        } else {
          this.oppose = index
          flag = 2
        }

        this.handleAdoptAndOppose(item, flag)
      },

      // 赞同按钮
      adoptionAnswer (item, index) {
        this.oppose = -1
        let flag = null
        if (this.adoption === index) {
          this.adoption = -1
        } else {
          this.adoption = index
          flag = 1
        }
        this.handleAdoptAndOppose(item, flag)
      },
      // 处理反对或赞同
      handleAdoptAndOppose (item, flag) {
        let url = '/control/problem/adoptAnswerProblem'
        let param = new URLSearchParams()
        param.append('problemId', this.question.id)
        param.append('comments', item.problem.answerContent)
        if (flag) {
          param.append('flag', flag)
        }

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
      },
      getData () {
        this.dataloaded = false
        this.hasSend = false
        // 获取题目
        let problemTitle = this.$route.params.problemTitle
        let problemType = this.$route.params.problemType
        let user = JSON.parse(localStorage.getItem('token'))

        this.question.title = problemTitle
        this.question.category = problemType

        // 问题表中插入一条问题 open=3 不发布到显示列表显示
        let url = '/control/problem/info'
        this.$http.post(url, this.$qs.stringify({
          category: problemType,
          userId: user.id,
          title: problemTitle,
          open: 3
        })).then((res) => {
          this.question = res.data.body.data
        })
        // 自动问答接口获取答案
        url = '/problem/intelligentQuestionAnswering' // 自动问答接口
        this.$http.get(url, {
          params: {
            questionStr: problemTitle,
            userId: user.id,
            problemType: problemType
          }
        }).then((response) => {
          if (response.data.body.data) {
            this.answerData = response.data.body.data
          } else {
            this.answerData = []
          }
          this.dataloaded = true
          // this.$nextTick(() => {
          //   this.$refs.scroll.refresh()
          // })
        }).catch((error) => {
          console.log(error)
        })
      }
    },
    activated () {
      this.getData()
    },
    mounted () {
      // 获取浏览器可视区域高度
      this.clientHeight = `${document.documentElement.clientHeight}`
      this.$refs.question.style.height = (this.clientHeight - 42) + 'px'
    },
    components: { BackHeader }
  }

</script>

<style lang='stylus' rel='stylesheet/stylus'>
  .questionPage
    .scroll-list-wrap
      height 600px
      background-color #f4f6f9

      .load-wrapper
        display flex
        justify-content center
        align-items center
        height 60px

      .question-wrapper
        padding 10px 20px
        background-color #fff
        font-size 24px
        line-height 26px
        letter-spacing 1px

        .cubeic-question
          margin-right 10px
          color #2faefe

        .question
          font-weight bold

      .no-anwser
        margin-top 4px

        .show-no
          margin-top 4px
          background-color #fff
          text-align center
          font-size 20px
          height 40px
          color: #FAA732
          line-height 40px

        .send-people
          display flex
          justify-content: space-between;
          padding 0 10px
          margin-top 4px
          height 60px
          line-height 60px
          background-color #fff

          .txt
            margin-right 20px

          .btn-wrapper
            .send-not
              background-color #007efe

            .send
              color gray
              background-color #EFF3F8

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
          background-color #f4f6f9
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
            margin 0 10px
            background-color white

            .split-line2
              height 12px
              background-color #f8f8f8

            .solve-name
              font-size 18px
              color: #7A7A7A
              padding 20px 0 16px 10px

            .solve-content
              font-size 16px
              line-height 26px
              letter-spacing 2px
              padding 0 16px
              word-wrap: break-word;

            .forecast
              .forecast-title
                color: #007efe
                font-size 16px
                font-weight bold
                padding 20px 0 16px 10px

              .forecast-value
                padding 0 0 10px 8px

                .my-tag
                  background-color: rgba(64, 158, 255, .1);
                  display: inline-block;
                  padding: 0 10px;
                  height: 32px;
                  line-height: 30px;
                  font-size: 12px;
                  color: #409eff;
                  border-radius: 4px;
                  box-sizing: border-box;
                  border: 1px solid rgba(64, 158, 255, .2);
                  white-space: nowrap;

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
                color: #7A7A7A

              .help-msg
                display flex
                justify-content: space-between;
                color #bababa

                .help-yes
                  .oppose-not
                    color: #7A7A7A

                  .adoption-not
                    color: #7A7A7A

                  .oppose
                    color: #45bfff

                  .adoption
                    color: #45bfff

                  .cube-btn
                    background-color #f7f7f7
                    padding 6px

                    .text
                      display inline-block
                      padding-top 6px
                      margin-left -6px
                      vertical-align: baseline;

                    .cubeic-good, .cubeic-bad
                      font-size 14px
                      margin-right 8px

                    &:nth-child(1)
                      margin-right 10px

                  .help-info
                    display inline-block
                    height 30px
                    vertical-align middle

  /*.bottom*/
  /*position absolute*/
  /*bottom 0*/
  /*left 0*/
  /*width 100%*/
  /*height 50px*/
  /*z-index 999*/
  /*border 1px solid #f1f1f1*/
  /*background-color #fff*/
  /*box-sizing border-box*/
  /*display flex*/
  /*justify-content space-between*/

  /*.cube-btn*/
  /*margin 10px 10px 10px 10px*/
  /*border-radius 5px*/
  /*line-height 2px*/

  /*&:first-child*/
  /*background-color #45bfff*/

  /*&:nth-child(2)*/
  /*color: #45bfff*/

</style>
