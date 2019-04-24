<template>
  <div class="question-page">
    <div class="back-header-wrapper">
      <span class="cubeic-back" @click="back"></span>
      <span>发布问题</span>
      <span class="release-name" @click="release">发布</span>
    </div>
    <div class="choose-model-wrapper" v-show="modelName">
      <span class="">选择的模块</span>
      <div class="choose-model">
        <span class="iconfont" :class="modelIcon"></span>
        <span class="text">{{modelArray[modelName]}}</span>
      </div>
    </div>
    <div class="question-content-wrapper">
      <cube-textarea v-model="value" :placeholder="placeholder" :maxlength="maxlength"
                     indicator="indicator"></cube-textarea>
    </div>
  </div>
</template>

<script type='text/ecmascript-6'>
  const BACK_FLAG = -1
  export default {
    name: 'putQuestionPage',
    data () {
      return {
        indicator: {
          negative: true,
          remain: true
        },
        maxlength: 1000,
        value: '',
        modelName: null,
        modelIcon: null,
        modelArray: ['', '数据结构理论', '线性表', '栈和对列', '字符串', '树', '图', '算法']
      }
    },
    mounted () {
      if (this.$route.params.modelName) {
        window.localStorage.setItem('modelName', this.$route.params.modelName)
        window.localStorage.setItem('modelIcon', this.$route.params.modelIcon)
      }
      this.modelName = JSON.parse(window.localStorage.getItem('modelName'))
      this.modelIcon = window.localStorage.getItem('modelIcon')
      console.log(this.modelName)
      console.log(this.modelIcon)
    },

    methods: {
      back () {
        this.$router.go(BACK_FLAG)
      },
      // 发布问题按钮点击
      release () {
        let url = '/control/problem/info'
        let param = new URLSearchParams()
        param.append('title', this.value)
        if (this.modelName) {
          param.append('category', this.modelName)
        }
        this.$http.post(url, param)
          .then((response) => {
            if (response.data.head.stateCode === 200) {
              let data = response.data.body.data
              this.$router.push({
                name: 'question',
                params: { question: data }
              })
            }
          }).catch((error) => {
          console.log(error)
        })
      }
    },
    computed: {
      placeholder () {
        if (this.modelName) {
          return '请输入' + this.modelArray[this.modelName] + '问题'
        }
        return '请输入问题'
      }
    }
  }
</script>

<style lang='stylus' rel='stylesheet/stylus'>
  .question-page
    .back-header-wrapper
      display flex
      align-items center
      justify-content space-between
      height 40px
      width 100%
      font-size 18px
      color white
      background-color #007efe

      .cubeic-back, .release-name
        display inline-block
        height 40px
        width 60px
        text-align center
        line-height 40px

      .release-name
        font-size 18px
    .question-content-wrapper
      .cube-textarea-wrapper
        height 100px

      .cube-textarea_expanded
        height 150px

    .choose-model-wrapper
      margin 20px
      display flex
      flex-direction column
      justify-content space-between
      align-items: center;
      color: gray

      .choose-model
        padding 5px
        background-color #fff
        box-shadow: 1px 2px 4px rgba(0, 0, 0, 0.2)
        border-radius 10px
        margin 10px 20px
        flex 1
        display: flex;
        flex-direction column
        justify-content space-between
        align-items: center;

        .iconfont
          font-size 60px
          color: #91cbf5

        .text
          font-size 14px

</style>
