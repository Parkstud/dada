<template>
  <div class="proble-details">
    <proback-header :back-text="backText"></proback-header>
    <cube-scroll ref="answer"
                 :options="scrollOptions"
                 @pulling-up="onPullingUp">
      <div class="question-wrapper">
        <p class="question">这个问题怎么回答?这个问题怎么回答?这个问题怎么回答?</p>
        <div class="question-more">
          <span class="answer-num">12</span>
          <span>条回答</span>
          <span class="collection-num">1</span>
          <span>个收藏</span>
        </div>
        <div class="btn-wrapper">
          <cube-button icon="cubeic-person" :light="true" @click="invite">邀请回答</cube-button>
          <cube-button icon="cubeic-edit" :light="true" @click="writeaswer">写回答</cube-button>
        </div>
      </div>
      <div class="answer-wrapper">
        <div class="author-type-wrapper">
          <hr style="filter: progid:DXImageTransform.Microsoft.Glow(color=#ccc,strength=10)"
              color=#ccc SIZE=1/>
          <span class="author-type">智能回答</span>
        </div>
        <div class="author-info">
      <span class="avatar">
        <img src="avatar.jpg" width="40" height="40">
      </span>
          <span class="author-name">达达</span>
          <span class="answer-time">2019-03-10 16:15:33</span>
          <span class="info-left">
          <span class="cubeic-message"></span>
          <span class="comment">1</span>
          <span class="cubeic-good"></span>
          <span class="approve">5</span>
      </span>

        </div>
        <p class="answer-content">
          这是答案
          这是答案
          这是答案
          这是答案
          这是答案
          这是答案
          这是答案
          这是答案
          这是答案
          这是答案
          这是答案
        </p>
      </div>
      <div class="answer-wrapper">
        <div class="author-type-wrapper">
          <hr style="filter: progid:DXImageTransform.Microsoft.Glow(color=#ccc,strength=10)"
              color=#ccc SIZE=1/>
          <span class="author-type" v-show="false">智能回答</span>
        </div>
        <div class="author-info">
      <span class="avatar">
        <img src="avatar.jpg" width="40" height="40">
      </span>
          <span class="author-name">达达</span>
          <span class="answer-time">2019-03-10 16:15:33</span>
          <span class="info-left">
          <span class="cubeic-message"></span>
          <span class="comment">1</span>
          <span class="cubeic-good"></span>
          <span class="approve">5</span>
      </span>

        </div>
        <p class="answer-content">
          这是答案
          这是答案
          这是答案
          这是答案
          这是答案
          这是答案
          这是答案
          这是答案
          这是答案
          这是答案
          这是答案
        </p>
      </div>
      <div class="answer-wrapper">
        <div class="author-type-wrapper">
          <hr style="filter: progid:DXImageTransform.Microsoft.Glow(color=#ccc,strength=10)"
              color=#ccc SIZE=1/>
          <span class="author-type" v-show="false">智能回答</span>
        </div>
        <div class="author-info">
      <span class="avatar">
        <img src="avatar.jpg" width="40" height="40">
      </span>
          <span class="author-name">达达</span>
          <span class="answer-time">2019-03-10 16:15:33</span>
          <span class="info-left">
          <span class="cubeic-message"></span>
          <span class="comment">1</span>
          <span class="cubeic-good"></span>
          <span class="approve">5</span>
      </span>
        </div>
        <p class="answer-content">
          这是答案
          这是答案
          这是答案
          这是答案
          这是答案
          这是答案
          这是答案
          这是答案
          这是答案
          这是答案
          这是答案
        </p>
      </div>
    </cube-scroll>
  </div>
</template>

<script type='text/ecmascript-6'>
  import probackHeader from '../common/probackHeader'

  export default {
    name: 'problemDetails',
    data () {
      return {
        backText: '首页',
        problem: this.$route.params.problem,
        scrollOptions: {
          pullUpLoad: true,
          directionLockThreshold: 0
        }

      }
    },
    methods: {
      // 邀请
      invite () {
        this.$router.push('/inviteAnswer')
      },
      // 写回答
      writeaswer () {
        this.$router.push('/writeAnswer')
      },
      // 上拉
      onPullingUp () {
        setTimeout(() => {
          // 如果没有新数据
          this.$refs.answer.forceUpdate()
        }, 500)
      }
    },
    components: { probackHeader },
    mounted () {
      // 更新浏览记录
      let url = '/problemInfo/problem/history'
      let param = new URLSearchParams()
      param.append('problemId', this.problem.id)
      this.$http.post(url, param)
        .then((response) => {
          let data = response.data.body.data
          console.log(data)
        }).then((error) => {
        console.log(error)
      })

      // 获取详细信息数据

    }
  }
</script>

<style lang='stylus' rel='stylesheet/stylus'>
  .proble-details
    .cube-scroll-wrapper
      height 640px

      .question-wrapper
        .question
          margin 0 20px 8px 20px
          font-size 20px
          line-height 32px

        .question-more
          margin-left 20px
          color: #999999

          .answer-num
            margin-right 4px

          .collection-num
            margin-left 10px
            margin-right 4px

        .btn-wrapper
          margin-top 10px
          display flex

          .cube-btn-light
            background-color white;
            color #0084ff

      .answer-wrapper
        margin-top 30px

        .author-type-wrapper
          position relative

          .author-type
            position absolute
            display inline-block;
            left 20px
            top -16px
            background-color #00b092
            color white
            height 32px
            width 100px
            text-align center
            line-height 32px
            border-radius 10px

        .author-info
          position: relative;
          margin-top 30px
          margin-left 20px
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
            top: 20px
            font-size 12px

          .info-left
            position absolute
            right 0
            margin-right 20px

            .comment, .approve
              display inline-block
              width 30px
              text-align center

        .answer-content
          margin 10px 30px 0 52px
          line-height 32px
</style>
