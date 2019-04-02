<template>
  <div class="first-page">
    <div class="search-wrapper">
      <span class="cubeic-search"></span>
      <span class="input-wrapper" @click="showSearch">
          <cube-input :placeholder="placeholder" :readonly="readonly"></cube-input>
      </span>

      <span class="submit-wrapper" @click="putQuestion">
          <span class="cubeic-edit"></span>
          <span class="text">提问</span>
      </span>
    </div>
    <keep-alive>
      <cube-scroll ref="scroll" :data="items"
                   :options="scrollOptions"
                   @pulling-down="onPullingDown"
                   @pulling-up="onPullingUp">
        <ul>
          <li v-for="(item,index) in items" :key="index">
            <question-item :problemItem="item"></question-item>
            <hr class="hr-sty" style="filter: alpha(opacity=100,finishopacity=0,style=2)"
                color=#f4f6f9 SIZE=10/>
          </li>
        </ul>
      </cube-scroll>
    </keep-alive>
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
          current: this.downCurrent,
          size: this.size,
          ascs: 'id',
          id: this.minProblemId
        }
        this.$http.get(url, { params })
          .then((response) => {
            let data = response.data.body.data
            // 有数据
            if (data.records.length > 0) {
              this.downCurrent++
              this.items.unshift(data.records)
              this.minProblemId = this.items[0].id
              this.maxProblemId = this.items[this.items.length - 1].id
            } else {
              this.$refs.scroll.forceUpdate()
            }
          }).catch((error) => {
          console.log(error)
          this.$refs.scroll.forceUpdate()
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
              this.minProblemId = this.items[0].id
              this.maxProblemId = this.items[this.items.length - 1].id
            } else {
              this.$refs.scroll.forceUpdate()
            }
          }).catch((error) => {
          console.log(error)
          this.$refs.scroll.forceUpdate()
        })
      }
    },
    mounted () {
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
  }
</script>

<style lang='stylus' rel='stylesheet/stylus'>
  .first-page
    height: 100%
    width 100%

    .search-wrapper
      background-color #f1f1f1
      border-radius 8px
      margin 2px
      height: 38px
      display flex
      justify-content space-between
      align-items: center;

      .cubeic-search
        flex 1
        align-self: center;
        display inline-block
        text-align center

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

        .cubeic-edit
          text-align right
          padding-left 6px
          border-left 1px solid gray

        .text
          padding-left 6px
          text-align center
</style>
