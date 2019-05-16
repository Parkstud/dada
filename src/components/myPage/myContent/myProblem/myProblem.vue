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
        options: {
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

        console.log(item)
      },
      onPullingUp () {
        if (this.problemInfo.length > 0 && this.problemInfo.length % this.size === 0) {
          this.current++
        }
        this.$http.get('/problemInfo/PageProblemInfo', {
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
      this.$http.get('/problemInfo/PageProblemInfo', {
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
            position: relative;
            overflow: hidden;

            &:after
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
              transition: 0s;

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
