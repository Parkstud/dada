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
          <cube-scroll :data="followersData" :options="scrollOptions">
            <ul class="list-wrapper">
              <li v-for="(item, index) in followersData" class="list-item" :key="index">
                <div class="top">
                  <img :src="item.avatar" class="avatar">
                  <span class="name">{{item.name}}</span>
                </div>
                <div>{{resolveQuestionFollowers(item)}}</div>
                <div class="btn-invite">
                  <cube-button :inline="true"
                               :class="{'invite-active':item.invited,'invite':!item.invited}"
                               @click="invite(index)">
                    {{item.invitedInfo}}
                  </cube-button>
                </div>
              </li>
            </ul>
          </cube-scroll>
        </cube-slide-item>
        <!-- 推荐 -->
        <cube-slide-item>
          <cube-scroll :data="recommendData" :options="scrollOptions">
            <ul class="list-wrapper">
              <li v-if="recommendData.length===0">
                你还没有好友
              </li>
              <li v-else v-for="(item, index) in recommendData" class="list-item" :key="index">
                <div class="top is-black is-bold line-height">
                  {{item.question}}
                </div>
                <div class="middle is-grey line-height">{{item.content}}</div>
                <div>{{resolveQuestionFollowers(item)}}</div>
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

  const followersData = [
    {
      avatar: './avatar.jpg',
      name: '陈苗',
      question: 'avatar.jpg',
      answers: '13',
      invited: true,
      invitedInfo: '已邀请'
    }, {
      avatar: 'avatar.jpg',
      name: 'chenmiao',
      question: 'adasd',
      answers: '12',
      invited: true,
      invitedInfo: '已邀请'
    }, {
      avatar: 'avatar.jpg',
      name: 'chenmiao',
      question: 'adasd',
      answers: '12',
      invited: true,
      invitedInfo: '已邀请'
    }, {
      avatar: 'avatar.jpg',
      name: 'chenmiao',
      question: 'adasd',
      answers: '12',
      invited: true,
      invitedInfo: '已邀请'
    }, {
      avatar: 'avatar.jpg',
      name: 'chenmiao',
      question: 'adasd',
      answers: '12',
      invited: false,
      invitedInfo: '邀请'
    }, {
      avatar: 'avatar.jpg',
      name: 'chenmiao',
      question: 'adasd',
      answers: '12',
      invited: false,
      invitedInfo: '邀请'
    }, {
      avatar: 'avatar.jpg',
      name: 'chenmiao',
      question: 'adasd',
      answers: '12'
    }, {
      avatar: 'avatar.jpg',
      name: 'chenmiao',
      question: 'adasd',
      answers: '12'
    }, {
      avatar: 'avatar.jpg',
      name: 'chenmiao',
      question: 'adasd',
      answers: '12'
    }, {
      avatar: 'avatar.jpg',
      name: 'chenmiao',
      question: 'adasd',
      answers: '12'
    }, {
      avatar: 'avatar.jpg',
      name: 'chenmiao',
      question: 'adasd',
      answers: '12'
    }, {
      avatar: 'avatar.jpg',
      name: 'chenmiao',
      question: 'adasd',
      answers: '12'
    }, {
      avatar: 'avatar.jpg',
      name: 'chenmiao',
      question: 'adasd',
      answers: '12'
    }, {
      avatar: 'avatar.jpg',
      name: 'chenmiao',
      question: 'adasd',
      answers: ' 12'
    }
  ]

  const recommendData = []

  export default {
    name: 'inviteanswer',
    components: { BackHeader },
    data () {
      return {
        backText: '返回',
        selectedLabel: '推荐',
        disabled: false,
        followersData: followersData,
        recommendData: recommendData,
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
      invite (index) {
        console.log(index)
        let selectData = followersData[index]
        if (!selectData.invited) {
          selectData.invited = true
          selectData.invitedInfo = '已邀请'
        }
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
        console.log(current)
      },
      scroll (pos) {
        const x = Math.abs(pos.x)
        const tabItemWidth = this.$refs.tabNav.$el.clientWidth
        const slideScrollerWidth = this.$refs.slide.slide.scrollerWidth
        const deltaX = x / slideScrollerWidth * tabItemWidth
        this.$refs.tabNav.setSliderTransform(deltaX)
      },

      resolveTitle (item) {
        return `${item.name}关注了问题 · ${item.postTime} 小时前`
      },
      resolveQuestionFollowers (item) {
        return `该类型下,累计获得${item.answers} 赞同 `
      }
    },
    computed: {
      initialIndex () {
        let index = 0
        index = this.findIndex(this.tabLabels, item => item.label === this.selectedLabel)
        console.log(index)
        return index
      }
    }
  }
</script>
<style lang="stylus" rel="stylesheet/stylus">
  .cube-tab-bar
    background-color: white

    .cube-tab-bar-slider
      background-color: #e8864c

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
            display: flex

            .avatar
              width: 30px
              height: 30px
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
