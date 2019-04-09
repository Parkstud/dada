<template>
  <div class="questionPage">
    <back-header :backText="backText"></back-header>
    <div class="scroll-list-wrap" ref="question">
      <cube-scroll>
        <div class="question-wrapper">
          <span class="cubeic-question"></span>
          <span class="question">{{question.title}}</span>
        </div>
        <div class="topic-wrapper">
          <div class="title">
            <span class="title-content">匹配题目</span>
          </div>
          <div class="topic-content">
            <div class="split-line"></div>
            <div class="question-des">
              <p>正文正文正文正文正文正文正文正文正文正文正文正文正文正文正文正文正文正文正文正文正文正文正文正文正文正文正文正文正文正文正文正文正文正文
              </p>
              <ul>
                <li>A. 这是第一个答案</li>
                <li>B. 这是第二个答案</li>
                <li>C. 这是第三个答案</li>
                <li>D. 这是第四个答案</li>
              </ul>
            </div>
            <div class="answer-wrapper">
              <div class="split-line2"></div>
              <div class="solve-name">解答</div>
              <div class="solve-content">
                这是答案这是答案
              </div>
              <div class="forecast">
                <div class="forecast-title">匹配预估</div>
                <div class="forecast-value">92%</div>
              </div>
              <div class="split-line3"></div>
              <div class="help-wrapper">
                <div class="help-des">
                  是否帮助到你
                </div>
                <div class="help-msg">
                  <div class="help-yes">
                    <span class="cubeic-pullup"></span>
                    <span class="help-info">有帮助</span>
                  </div>
                  <div class="help-no">
                    <span class="cubeic-pulldown"></span>
                    <span class="help-info">无帮助</span>
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
      <cube-button>人工问答</cube-button>
      <cube-button :light="true">再问一题</cube-button>
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
        question: this.$route.params.question
      }
    },
    mounted () {
      // 获取浏览器可视区域高度
      this.clientHeight = `${document.documentElement.clientHeight}`
      this.$refs.question.style.height = (this.clientHeight - 74) + 'px'
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

              .help-des
                font-size 14px
                line-height 30px

              .help-msg
                display flex
                justify-content: space-between;

                .help-yes
                  .cubeic-pullup
                    font-size 30px
                    vertical-align top

                  .help-info
                    display inline-block
                    height 30px
                    vertical-align middle

                .help-no
                  .cubeic-pulldown
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
