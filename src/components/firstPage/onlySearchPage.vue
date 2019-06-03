<template>
  <div class="only-search">
    <div class="search-wrapper">
      <span class="cubeic-back" @click="back"></span>
      <span class="input-wrapper">
          <cube-input ref="search1" :placeholder="placeholder" :type="type" v-model="val"
                      @keyup.enter.native="searchInfo"
                      :autofocus="autofocus"
          ></cube-input>
      </span>
      <span class="temp"></span>
    </div>
    <ul class="history-wrapper" v-show="showHistory && historys.length>0">
      <li v-for="(item, index) in historys" :key="index" class="history-item">
        <span class="cubeic-time"></span>
        <span class="text" @click="clickHistoryItem(item)">{{item}}</span>
        <span class="cubeic-close" @click="deleteHistory(index)"></span>
      </li>
      <li class="clear-history" @click="clearAllHistory">
        清除搜索记录
      </li>
    </ul>

    <div class="scroll-list-wrap" ref="scrollWrapper" v-show="!showHistory">
      <cube-scroll
        ref="scroll"
        :data="problemInfo"
        @pulling-up="onPullingUp"
        :options="options">
        <ul class="list-wrapper">
          <li class="load-wrapper" v-show="showload">
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
          </li>
          <li class="list-item" v-show="problemInfo.length===0 && !showload">
            没有搜索结果
          </li>
          <li v-for="(item, index) in problemInfo" class="list-item border-top-1px"
              @click="toProblemDetail(item)"
              :key="index">
            <div class="item-top">
              {{item.title}}
            </div>
            <div class="item-bottom">
              {{item.browseCount}}人浏览 · {{item.answerCount}}人回答<br>
              发布时间: {{formatData(item.time,2)}}
            </div>
          </li>
        </ul>
      </cube-scroll>
    </div>
  </div>
</template>

<script type='text/ecmascript-6'>
  // 返回上个界面
  const BACK_FLAG = -1
  export default {
    name: 'onlySearchPage',
    data () {
      return {
        val: '',
        placeholder: '搜索',
        autofocus: true,
        type: 'search',
        waiting: 'false',
        showHistory: true,
        historys: [],
        current: 1,
        size: 10,
        options: {
          pullUpLoad: true,
          directionLockThreshold: 0
        },
        showload: false,
        problemInfo: []
      }
    },
    methods: {
      // 跳转问题详情页
      toProblemDetail (item) {
        console.log(item)
        this.$router.push({
            name: 'problemDetails',
            params: {
              problemId: item.problemId
            }
          }
        )
      },
      clearAllHistory () {
        this.historys = []
      },
      deleteHistory (index) {
        this.historys.splice(index, 1)
      },
      onPullingUp () {
        if (this.problemInfo.length === 0) {
          this.$refs.scroll.forceUpdate()
        }
        this.$http.get('/problemInfo/webProblemVOLikePage', {
          params: {
            title: this.val,
            current: this.current,
            size: this.size
          }
        }).then((res) => {
          if (res.data.body.data.records.length > 0) {
            this.problemInfo = this.problemInfo.concat(res.data.body.data.records)
            this.current++
          }
          this.$refs.scroll.forceUpdate()
        })
      },
      back () {
        if (!this.showHistory) {
          this.showHistory = true
          return
        }
        localStorage.setItem('search_history', JSON.stringify(this.historys))
        this.$router.go(BACK_FLAG)
      },
      clickHistoryItem (item) {
        this.val = item
        this.$refs.search1.focus()
      },
      searchInfo () {
        this.current = 1
        if (this.val.trim() === '') {
          return
        }
        event.preventDefault() // 禁止默认事件（默认是换行）
        if (this.historys.length > 10) {
          this.historys.pop()
        }
        this.historys.unshift(this.val)
        // 获取搜索信息
        this.showHistory = false
        this.showload = true
        this.problemInfo = []
        this.$http.get('/problemInfo/webProblemVOLikePage', {
          params: {
            title: this.val,
            current: this.current,
            size: this.size
          }
        }).then((res) => {
          this.problemInfo = res.data.body.data.records
          this.showload = false
          if (this.problemInfo.length > 0) {
            this.current++
          }
        })
      }
    },
    mounted () {
      // 设置
      this.clientHeight = `${document.documentElement.clientHeight}`
      this.$refs.scrollWrapper.style.height = (this.clientHeight - 42) + 'px'
      let localSearchHistory = JSON.parse(localStorage.getItem('search_history'))
      if (localSearchHistory) {
        this.historys = localSearchHistory
      }
    }
  }

</script>

<style lang='stylus' rel='stylesheet/stylus'>
  .only-search
    background #f4f6f9
    height 100%

    .search-wrapper
      display flex
      align-content: space-between;
      background-color #007efe
      box-shadow: 1px 2px 4px rgba(0, 0, 0, 0.2)

      .input-wrapper
        flex 1

        .cube-input
          background-color #007efe
          border-bottom-width: 0

          .cube-input-field
            color: #fff

        .cube-input::after
          content: none

      .cubeic-back
        width 40px
        align-self: center;
        text-align center;
        font-size 22px
        color #fff

      .temp
        height 20px
        width 20px

    .history-wrapper
      color #aaa
      background #f4f6f9

      .clear-history
        height 24px
        text-align center
        border-bottom 1px solid #f1f1f1

      .history-item
        margin 10px
        display flex
        justify-content space-between
        font-size 18px
        height 24px
        border-bottom 1px solid #f1f1f1

        .cubeic-time
          width 60px
          text-align center

        .text
          flex 1

        .cubeic-close
          width 60px
          text-align center

    .scroll-list-wrap
      .list-wrapper
        letter-spacing 1px

        .load-wrapper
          display flex
          justify-content center
          align-items center
          height 60px

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
