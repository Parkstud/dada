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
          <cube-scroll :data="recommendData" ref="scrollCare" :options="scrollOptions"
                       @pulling-up="onPullingUpCare">
            <ul class="list-wrapper">
              <li v-if="followersData.length===0">
                你还没有关注
              </li>
              <li v-for="(item, index) in recommendData" class="list-item border-top-1px"
                  :key="index">
                <div class="top">
                  <img :src="imgURL+item.avatar" class="avatar">
                  <span class="name">{{item.username}}</span>
                </div>
                <div class="btn-invite">
                  <cube-button :inline="true"
                               :class="{'invite-active':item.eachCare>=0,'invite':item.eachCare<0}"
                               @click="care(item)">
                    {{resolveText(item.eachCare)}}
                  </cube-button>
                </div>
              </li>
            </ul>
          </cube-scroll>
        </cube-slide-item>
        <!-- 粉丝 -->
        <cube-slide-item>
          <cube-scroll :data="followersData" ref="scrollFans" :options="scrollOptions"
                       @pulling-up="onPullingUpFans">
            <ul class="list-wrapper">
              <li v-if="followersData.length===0">
                你还没有粉丝
              </li>
              <li v-for="(item, index) in followersData" class="list-item border-top-1px"
                  :key="index">
                <div class="top">
                  <img :src="imgURL+item.avatar" class="avatar">
                  <span class="name">{{item.username}}</span>
                </div>
                <div class="btn-invite">
                  <cube-button :inline="true"
                               :class="{'invite-active':item.eachCare>0,'invite':item.eachCare<=0}"
                               @click="fans(item)">
                    {{fansText(item.eachCare)}}
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

<script type='text/ecmascript-6'>
  import BackHeader from '../../common/backHeader'

  export default {
    name: 'myCareFans',
    data () {
      return {
        backText: '返回',
        selectedLabel: this.$route.params.itemName,
        disabled: false,
        followersData: [],
        recommendData: [],
        problemId: null,
        tabLabels: [
          {
            label: '关注'
          }, {
            label: '粉丝'
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
          pullUpLoad: true,
          directionLockThreshold: 0
        }
      }
    },
    methods: {
      onPullingUpFans () {
        this.$http.get('/Interaction/fansInfoPage', {
          params: {
            followId: this.followersData[this.followersData.length - 1].id
          }
        }).then((response) => {
          let data = response.data.body.data.records
          if (data.length > 0) {
            this.followersData = this.followersData.concat(data)
          } else {
            this.$refs.scrollFans.forceUpdate()
          }
        }).catch((error) => {
          console.log(error)
          this.$refs.scrollFans.forceUpdate()
        })
      },
      onPullingUpCare () {
        this.$http.get('/Interaction/careInfoPage', {
          params: {
            followId: this.recommendData[this.recommendData.length - 1].id
          }
        }).then((response) => {
          let data = response.data.body.data.records
          if (data.length > 0) {
            this.recommendData = this.recommendData.concat(data)
          } else {
            this.$refs.scrollCare.forceUpdate()
          }
        }).catch((error) => {
          console.log(error)
          this.$refs.scrollFans.forceUpdate()
        })
      },
      fans (item) {
        if (item.eachCare > 0) {
          item.eachCare = 0
        } else {
          item.eachCare = 1
        }
        this.$http.post('/problemInfo/change/careinfo', this.$qs.stringify({
          userId: item.userId
        })).then((res) => {
          // 获取关注信息
          this.$http.get('/Interaction/careInfoPage', null).then((response) => {
            this.recommendData = response.data.body.data.records
            this.needUpdate()
          }).catch((error) => {
            console.log(error)
          })
        })
      },
      needUpdate () {
        this.$store.commit('updateFlushMyPageCare', 1)
      },
      care (item) {
        if (item.eachCare >= 0) {
          item.eachCare = -1
        } else {
          item.eachCare = 0
        }
        this.$http.post('/problemInfo/change/careinfo', this.$qs.stringify({
          userId: item.userId
        })).then((res) => {
          this.needUpdate()
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
      fansText (eachCare) {
        if (eachCare > 0) {
          return '已关注'
        }
        return '关注'
      },
      resolveText (eachCare) {
        if (eachCare >= 0) {
          return '已关注'
        }
        return '关注'
      },
      getData () {
        if (this.$route.params.itemName) {
          this.selectedLabel = this.$route.params.itemName
        }
        // 获取关注
        this.$http.get('/Interaction/careInfoPage', null).then((response) => {
          this.recommendData = response.data.body.data.records
        }).catch((error) => {
          console.log(error)
        })

        // 获取粉丝
        this.$http.get('/Interaction/fansInfoPage', null).then((response) => {
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
    },
    components: { BackHeader }
  }
</script>

<style lang='stylus' rel='stylesheet/stylus'>
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
            margin-top -40px
            text-align right

            .invite-active
              background-color #efefef
              color #999

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
