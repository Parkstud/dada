<template>
  <div slot="content">
    <back-header :backText="backText"></back-header>
    <cube-tab-bar v-model="selectedLabel"
                  show-slider
                  :use-transition="disabled"
                  ref="tabNav"
                  :data="tabLabels">
    </cube-tab-bar>
    <div class="tab-slide-container">
      <cube-slide
        ref="slide"
        :loop="loop"
        :initial-index="initialIndex"
        :auto-play="autoPlay"
        :show-dots="showDots"
        :options="slideOptions"
        @scroll="scroll"
        @change="changePage"
      >
        <!-- 关注 -->
        <cube-slide-item>
          <cube-scroll :data="recommendData" :options="scrollOptions">
            <ul class="list-wrapper">
              <li v-for="(item, index) in recommendData" class="list-item border-top-1px"
                  :key="index">
                <div class="top">
                  <img :src="imgURL+item.avatar" class="avatar">
                  <span class="name">{{item.nickName}}</span>
                </div>
                <div>{{resolveQuestionFollowers(item)}}</div>
                <div class="btn-invite">
                  <cube-button :inline="true"
                               :class="{'invite-active':item.invited,'invite':!item.invited}"
                               @click="invite(item)">
                    {{resolveText(item.invited)}}
                  </cube-button>
                </div>
              </li>
            </ul>
          </cube-scroll>
        </cube-slide-item>
        <!-- 好友 -->
        <cube-slide-item>
          <cube-scroll :data="followersData" :options="scrollOptions">
            <ul class="list-wrapper">
              <li v-if="followersData.length===0">
                你还没有好友
              </li>
              <li v-for="(item, index) in followersData" class="list-item border-top-1px"
                  :key="index">
                <div class="top">
                  <img :src="imgURL+item.avatar" class="avatar">
                  <span class="name">{{item.nickName}}</span>
                </div>
                <div>邀请这位好友来回答</div>
                <div class="btn-invite">
                  <cube-button :inline="true"
                               :class="{'invite-active':item.invited,'invite':!item.invited}"
                               @click="invite(item)">
                    {{resolveText(item.invited)}}
                  </cube-button>
                </div>
              </li>
            </ul>
          </cube-scroll>
        </cube-slide-item>
      </cube-slide>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import BackHeader from '../common/backHeader'

  export default {
    name: 'inviteanswer',
    components: { BackHeader },
    data () {
      return {
        backText: '返回',
        selectedLabel: '推荐',
        disabled: false,
        followersData: [],
        recommendData: [],
        problemId: null,
        tabLabels: [
          {
            label: '推荐'
          }, {
            label: '好友'
          }],
        loop: false,
        autoPlay: false,
        showDots: false,
        slideOptions: {
          listenScroll: true,
          probeType: 3,
          directionLockThreshold: 0
        },
        scrollOptions: {
          directionLockThreshold: 0
        }
      }
    },
    methods: {
      invite (item) {
        if (item.invited) {
          return
        }
        item.invited = true
        // 邀请用户
        this.$http.post('/Interaction/invitedInfo',
          this.$qs.stringify({
            problemId: this.problemId,
            invitedId: item.userId
          }),
          { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })
          .then((response) => {

          }).catch((error) => {
          console.log(error)
        })
      },
      findIndex (ary, fn) {
        if (ary.findIndex) {
          return ary.findIndex(fn)
        }
        /* istanbul ignore next */
        let index = -1
        /* istanbul ignore next */
        ary.some(function (item, i, ary) {
          const ret = fn.call(this, item, i, ary)
          if (ret) {
            index = i
            return ret
          }
        })

        return index
      },
      changePage (current) {
        this.selectedLabel = this.tabLabels[current].label
      },
      scroll (pos) {
        const x = Math.abs(pos.x)
        const tabItemWidth = this.$refs.tabNav.$el.clientWidth
        const slideScrollerWidth = this.$refs.slide.slide.scrollerWidth
        const deltaX = x / slideScrollerWidth * tabItemWidth
        this.$refs.tabNav.setSliderTransform(deltaX)
      },

      resolveText (invited) {
        if (invited) {
          return '已邀请'
        }
        return '邀请'
      },
      resolveQuestionFollowers (item) {
        if (item.type === 1) {
          return '推荐这位教师回答'
        }
        // return `该类型下,累计获得${item.answers} 赞同 `
        return `该类型下,累计获得较多赞同 `
      },
      getData () {
        if (this.$route.params.problemId) {
          window.localStorage.setItem('inv_problemId', this.$route.params.problemId)
        }
        this.problemId = window.localStorage.getItem('inv_problemId')
        console.log('mounted')
        console.log(this.problemId)

        // 获取推荐
        this.$http.get('/Interaction/recommend', {
          params: {
            problemId: this.problemId
          }
        }).then((response) => {
          this.recommendData = response.data.body.data
        }).catch((error) => {
          console.log(error)
        })

        // 获取care
        this.$http.get('/Interaction/caredInvitedList', {
          params: {
            problemId: this.problemId
          }
        }).then((response) => {
          console.log(response)
          this.followersData = response.data.body.data.records
        }).catch((error) => {
          console.log(error)
        })
      }
    },
    computed: {
      initialIndex () {
        let index = 0
        index = this.findIndex(this.tabLabels, item => item.label === this.selectedLabel)
        return index
      }
    },
    activated () {
      this.getData()
    }
  }
</script>
<style lang="stylus" rel="stylesheet/stylus">
  .cube-tab-bar
    background-color: white
  .tab-slide-container
    position: fixed
    top: 80px
    left: 0
    right: 0
    bottom: 0

    .cube-scroll-wrapper
      height 100%

      .list-wrapper
        overflow: hidden

        li
          padding: 5px 10px
          margin-bottom: 10px
          text-align: left
          background-color: white
          font-size: 14px
          color: #999
          white-space: normal

          .line-height
            line-height: 1.5

          .is-black
            color: black

          .is-grey
            color: #999

          .is-bold
            font-weight: bold

          .top
            margin 10px 0
            display: flex

            .avatar
              width: 40px
              height: 40px
              margin-right: 2px
              border-radius: 100%

            .name
              margin-left 6px
              margin-top 5px
              font-weight 600
              color: black
              font-size 14px

          .btn-invite
            margin-top -30px
            text-align right

            .invite-active
              background-color gray

            .invite
              background-color #0184ff

          .middle
            display: flex
            margin: 10px 0
            color: black

          .hot-title
            display: flex
            align-items: center
            font-size: 12px

            .hot-sequence
              display: inline-block
              margin-right: 2px
              padding: 3px 6px
              border-radius: 2px
              background-color: darkgoldenrod
              color: white

          .hot-content
            margin-top: 15px
</style>
