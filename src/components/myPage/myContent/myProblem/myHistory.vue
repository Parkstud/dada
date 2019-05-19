<template>
  <div class="myproblem">
    <back-header :back-text="backText"></back-header>
    <div class="content">
      <div class="scroll-list-wrap" ref="scrollWrapper">
        <cube-scroll
          ref="scroll"
          :data="problemInfo"
          :options="options">
          <ul class="list-wrapper">
            <li v-for="(item, index) in problemInfo" class="list-item border-top-1px"
                @click="choseHistory(item)"
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
    name: 'myHistory',
    data () {
      return {
        backText: '我的问题',
        current: 1,
        size: 10,
        options: {
          pullUpLoad: true,
          directionLockThreshold: 0
        },
        problemInfo: []
      }
    },
    components: { BackHeader },
    methods: {
      choseHistory (item) {
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
      onPullingUp () {
        if (this.problemInfo.length > 0 && this.problemInfo.length % this.size === 0) {
          this.current++
        }
        this.$http.get('/problemInfo/PageProblemHistory', {
          params: {
            current: this.current,
            size: this.size
          }
        }).then((response) => {
          let data = response.data.body.data
          if (data.records.length > 0) {
            let temp = this.problemInfo.length % this.size
            this.problemInfo = this.problemInfo.concat(data.records.slice(temp))
          } else {
            this.$refs.commentContainer.forceUpdate()
          }
        }).catch((error) => {
          console.log(error)
        })
      }
    },
    mounted () {
      this.clientHeight = `${document.documentElement.clientHeight}`
      this.$refs.scrollWrapper.style.height = (this.clientHeight - 42) + 'px'
      this.$http.get('/problemInfo/PageProblemHistory', {
        params: {
          current: this.current,
          size: this.size
        }
      }).then((response) => {
        this.problemInfo = response.data.body.data.records
      })
    }
  }
</script>

<style lang='stylus' rel='stylesheet/stylus'>
  .myproblem
    .content
      .scroll-list-wrap
        .list-wrapper
          letter-spacing 1px

          .list-item
            margin 10px 10px
            padding-top 10px

          .item-top
            margin-bottom 10px

          .item-bottom
            display -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 3;
            overflow: hidden;
            white-space: normal
            line-height 20px
            font-size 12px
            color #ccc
</style>
