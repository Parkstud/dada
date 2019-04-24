<template>
  <div class="first-page">
    <div class="top-wrapper">
      <div class="search-wrapper ">
        <span class="cubeic-search"></span>
        <span class="input-wrapper" @click="showSearch">
          <cube-input :placeholder="placeholder" :readonly="readonly"></cube-input>
      </span>

        <span class="submit-wrapper" @click="putQuestion">
          <span class="cubeic-edit"></span>
          <span class="text">提问</span>
      </span>
      </div>
    </div>
    <div class="my-wrapper" ref="mywrapper">
      <cube-scroll ref="scroll" :data="items"
                   :options="scrollOptions"
                   @pulling-down="onPullingDown"
                   @pulling-up="onPullingUp">
        <ul>
          <li v-for="(item,index) in items" :key="index">
            <question-item :problemItem="item"></question-item>
          </li>
        </ul>
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
                <div v-show="!props.isPullingDown" class="text-wrapper"><span class="refresh-text">更新成功</span>
                </div>
              </transition>
            </div>
          </div>
        </template>
      </cube-scroll>
    </div>
  </div>
</template>

<script type='text/ecmascript-6'>
  import QuestionItem from '../common/questionItem'

  const FIRST_PAGE = 0

  // let cnt = 1
  export default {
    name: 'recommend',
    components: { QuestionItem },
    data () {
      return {
        placeholder: '搜索',
        search: 'search',
        readonly: true,
        items: [],
        current: 1,
        size: 10,
        maxProblemId: '',
        minProblemId: '',
        upCurrent: 0,
        downCurrent: 0,
        scrollOptions: {
          pullDownRefresh: {
            threshold: 50,
            stop: 40,
            txt: '刷新成功'
          },
          pullUpLoad: true,
          directionLockThreshold: 0
        }
      }
    },
    methods: {
      // 提问
      putQuestion () {
        this.$store.commit('updateCount', FIRST_PAGE)
        // 清除痕迹
        window.localStorage.setItem('modelName', null)
        window.localStorage.setItem('modelIcon', null)
        this.$router.push('/putQuestionPage')
      },
      // 打开搜索界面
      showSearch () {
        this.$store.commit('updateCount', FIRST_PAGE)
        this.$router.push('/onlySearchPage')
      },
      onPullingDown () {
        let url = '/problemInfo/page'
        let params = {
          current: this.current,
          size: this.size
        }
        this.$http.get(url, { params })
          .then((response) => {
            let data = response.data.body.data
            this.items = data.records
            this.minProblemId = this.items[0].id
            this.maxProblemId = this.items[this.items.length - 1].id
            this.upCurrent = this.current
            this.downCurrent = this.current

            this.$store.commit('setFlushCount')
            // this.$refs.scroll.forceUpdate()
          })
          .catch((error) => {
            console.log(error)
          })
      },
      onPullingUp () {
        let url = '/problemInfo/page'
        let params = {
          current: this.upCurrent,
          size: this.size,
          descs: 'id',
          id: this.maxProblemId
        }
        this.$http.get(url, { params })
          .then((response) => {
            let data = response.data.body.data
            // 有数据
            if (data.records.length > 0) {
              this.upCurrent++
              this.items = this.items.concat(data.records)
              this.maxProblemId = this.items[this.items.length - 1].id
            } else {
              this.$refs.scroll.forceUpdate()
            }
          }).catch((error) => {
          console.log(error)
          this.$refs.scroll.forceUpdate()
        })
      },
      getData () {
        let url = '/problemInfo/page'
        let params = {
          current: this.current,
          size: this.size
        }
        this.$http.get(url, { params })
          .then((response) => {
            let data = response.data.body.data
            this.items = data.records
            this.minProblemId = this.items[0].id
            this.maxProblemId = this.items[this.items.length - 1].id

            this.upCurrent = this.current
            this.downCurrent = this.current
          })
          .catch((error) => {
            console.log(error)
          })
      }
    },
    mounted () {
      // 获取浏览器可视区域高度
      this.clientHeight = `${document.documentElement.clientHeight}`
      // this.$refs.containerPage.style.height = (this.clientHeight - 44) + 'px'
      this.$refs.mywrapper.style.height = (this.clientHeight - 87) + 'px'
      this.getData()
    }
  }
</script>

<style lang='stylus' rel='stylesheet/stylus'>
  .first-page
    height: 100%
    width 100%
    background-color #f4f6f9

    .top-wrapper
      padding-bottom 1px
      box-shadow: 0 1px #efefef;

      .search-wrapper
        background-color #f1f1f1
        border-radius 8px
        margin 2px
        height: 38px
        display flex
        justify-content space-between
        align-items: center;
        /*box-shadow:-1px 0 2px 1px #efefef;*/

        .cubeic-search
          flex 1
          align-self: center;
          display inline-block
          text-align center
          color: #7A7A7A

        .input-wrapper
          flex 5

          .cube-input
            background-color #f1f1f1
            border 0
            padding-right 8px

            .cube-input-field
              padding 0

            &:active
              background-color #f5f5f5

          .cube-input::after
            content: none;

        .submit-wrapper
          flex: 2;
          font-size 18px
          color: #7A7A7A

          .cubeic-edit
            text-align right
            padding-left 6px
            border-left 1px solid #dedede
            color: #666

          .text
            padding-left 6px
            text-align center

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

  .success-enter-active, .success-leave-active
    transition: width .5s

  .success-enter, .success-leave-to
    width: 70%

  .success-enter-to, .success-leave
    width: 100%
</style>
