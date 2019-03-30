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
    <cube-scroll ref="scroll" :data="items"
                 :options="scrollOptions"
                 @pulling-down="onPullingDown"
                 @pulling-up="onPullingUp">
      <ul>
        <li v-for="(item,index) in items" :key="index">
          <question-item></question-item>
          <hr class="hr-sty" style="filter: alpha(opacity=100,finishopacity=0,style=2)"
              color=#f4f6f9 SIZE=10/>
        </li>
      </ul>
    </cube-scroll>
  </div>
</template>

<script type='text/ecmascript-6'>
  import QuestionItem from '../common/questionItem'

  const FIRST_PAGE = 0
  const texts = [
    {
      url: 'asasda'
    },
    {
      url: 'asdasdad'
    },
    {
      url: 'asdasdad'
    },
    {
      url: 'asdasdad'
    },
    {
      url: 'asdasdad'
    },
    {
      url: 'qeqwe'
    },
    {
      url: 'qeqwe'
    },
    {
      url: 'qeqwe'
    },
    {
      url: 'qeqwe'
    },
    {
      url: 'qeqwe'
    },
    {
      url: 'qeqwe'
    },
    {
      url: 'qeqwe'
    },
    {
      url: 'qeqwe'
    },
    {
      url: 'asasda'
    },
    {
      url: 'asdasdad'
    },
    {
      url: 'asdasdad'
    },
    {
      url: 'asdasdad'
    },
    {
      url: 'asdasdad'
    },
    {
      url: 'qeqwe'
    },
    {
      url: 'qeqwe'
    },
    {
      url: 'qeqwe'
    },
    {
      url: 'qeqwe'
    },
    {
      url: 'qeqwe'
    },
    {
      url: 'qeqwe'
    },
    {
      url: 'qeqwe'
    },
    {
      url: 'qeqwe'
    }
  ]
  let cnt = 1
  export default {
    name: 'recommend',
    components: { QuestionItem },
    data () {
      return {
        placeholder: '搜索',
        search: 'search',
        readonly: true,
        items: texts.slice(),
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
        // 模拟更新数据
        setTimeout(() => {
          let num = Math.random()
          console.log('下拉刷新' + num)
          if (num > 0.5) {
            // 如果有新数据
            console.log('下拉刷新 新数据')
            this.items.unshift(texts[cnt++ % 3])
          } else {
            // 如果没有新数据
            console.log('下拉刷新 无数据')
            this.$refs.scroll.forceUpdate()
          }
        }, 1000)
      },
      onPullingUp () {
        // 模拟更新数据
        console.log('上啦')
        setTimeout(() => {
          if (Math.random() > 0.5) {
            // 如果有新数据
            this.items = this.items.concat(texts)
          } else {
            // 如果没有新数据
            this.$refs.scroll.forceUpdate()
          }
        }, 1000)
      }
    },
    mounted () {
      let url = '/problem/get/news'
      let params = new URLSearchParams()
      params.append('currentPage', '1')
      params.append('pageSize', '1')
      this.$http.get(url, params)
        .then((response) => {
          console.log(response)
        }).catch((error) => {
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
