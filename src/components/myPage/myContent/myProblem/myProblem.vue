<template>
  <div class="myproblem">
    <back-header :back-text="backText"></back-header>
    <div class="content" v-show="showPage">
      <div class="scroll-list-wrap" ref="scrollWrapper">
        <cube-scroll
          ref="scroll"
          :data="problemInfo"
          @pulling-down="onPullingDown"
          :options="scrollOptions"
          @pulling-up="onPullingUp">

          <template slot="pulldown" slot-scope="props">
            <div v-if="props.pullDownRefresh"
                 class="cube-pulldown-wrapper"
                 :style="props.pullDownStyle">
              <div v-if="props.beforePullDown"
                   class="before-trigger"
                   :style="{paddingTop: props.bubbleY + 'px'}">
            <span
              :class="{rotate: props.bubbleY > scrollOptions.pullDownRefresh.threshold - 60}">↓</span>
              </div>
              <div class="after-trigger" v-else>
                <div v-show="props.isPullingDown" class="loading">
                  <cube-loading></cube-loading>
                </div>
                <transition name="success">
                  <div v-show="!props.isPullingDown" class="text-wrapper"><span
                    class="refresh-text">更新成功</span>
                  </div>
                </transition>
              </div>
            </div>
          </template>
          <ul class="list-wrapper">
            <li v-for="(item, index) in problemInfo" class="my-list-item border-top-1px"
                @click="choseProblem(item)"
                :key="index">
              <div class="item-top">
                {{item.problemTitle}}
              </div>
              <div class="item-bottom">
                {{item.collection}}人收藏 · {{item.answersCount}}人回答<br>
                发布时间: {{formatData(item.time,2)}}
              </div>
            </li>
          </ul>
        </cube-scroll>
      </div>
    </div>
  </div>
</template>

<script type='text/ecmascript-6'>
  import BackHeader from '../../../common/backHeader'

  export default {
    name: 'myProblem',
    data () {
      return {
        backText: '我的问题',
        current: 1,
        size: 10,
        showPage: true,
        userId: this.$route.params.userId,
        scrollOptions: {
          pullDownRefresh: {
            threshold: 60,
            stop: 44
            // stopTime: 1000,
            // txt: '更新成功'
          },
          pullUpLoad: true,
          directionLockThreshold: 0
        },
        problemInfo: []
      }
    },
    components: { BackHeader },
    methods: {
      choseProblem (item) {
        // 跳转问题详细界面
        let newProblem = {}
        newProblem.answerContent = item.answerContent
        newProblem.id = item.problemId
        newProblem.open = item.open
        newProblem.time = item.time
        newProblem.title = item.problemTitle
        newProblem.userId = item.userId
        this.$router.push({
          name: 'problemDetails',
          params: {
            problem: newProblem
          }
        })
      },
      onPullingDown () {
        this.getData()
      },
      onPullingUp () {
        this.$http.get('/problemInfo/PageProblemInfo', {
          params: {
            current: this.current,
            size: this.size,
            problemId: this.problemInfo[this.problemInfo.length - 1].problemId,
            userId: this.userId
          }
        }).then((response) => {
          let data = response.data.body.data.records
          if (data.length > 0) {
            this.problemInfo = this.problemInfo.concat(data)
          } else {
            this.$refs.scroll.forceUpdate()
          }
        })
      },
      getData () {
        this.$http.get('/problemInfo/PageProblemInfo', {
          params: {
            current: this.current,
            size: this.size,
            userId: this.userId
          }
        }).then((response) => {
          if (response.data.body.data.records.length > 0) {
            this.problemInfo = response.data.body.data.records
          } else {
            this.$refs.scroll.forceUpdate()
          }
        })
      }
    },
    activated () {
      this.userId = this.$route.params.userId
      if (this.$route.params.backText) {
        this.backText = this.$route.params.backText
      }
      this.getData()
    },
    mounted () {
      this.clientHeight = `${document.documentElement.clientHeight}`
      this.$refs.scrollWrapper.style.height = (this.clientHeight - 42) + 'px'
    }
  }
</script>

<style lang='stylus' rel='stylesheet/stylus'>

  .myproblem
    .cube-pulldown-wrapper
      text-align: center

      .after-trigger
        flex: 1
        margin: 0

        .text-wrapper
          margin: 0 auto
          margin-top: 14px
          padding: 5px 0
          color: #0088CC
          background-color: #d6eaf8

        .cube-loading-spinners
          margin: auto

      .before-trigger
        height: auto
        align-self: flex-end
        font-size: 30px

        span
          display: inline-block
          line-height: 1
          transition: all 0.3s
          color: #666
          padding: 15px 0

          &.rotate
            transform: rotate(180deg)

    .content
      .scroll-list-wrap
        .list-wrapper

          .my-list-item
            padding-top 10px
            position: relative;
            overflow: hidden;
            padding-left 10px
            padding-right 10px

            &:active
              background #efefef;

  .success-enter-active, .success-leave-active
    transition: width .5s

  .success-enter, .success-leave-to
    width: 70%

  .success-enter-to, .success-leave
    width: 100%

  /*            &:after
                content: "";
                display: block;
                position: absolute;
                width: 100%;
                height: 100%;
                top: 0;
                left: 0;
                pointer-events: none;
                //设置径向渐变
                background-image: radial-gradient(circle, #666 10%, transparent 10.01%);
                background-repeat: no-repeat;
                background-position: 50%;
                transform: scale(10, 10);
                opacity: 0;
                transition: transform .3s, opacity .5s;

              &:active:after
                transform: scale(0, 0);
                opacity: .3;
                //设置初始状态
                transition: 0s;*/
</style>
