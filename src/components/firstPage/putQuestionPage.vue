<template>
  <div class="question-page">
    <div class="back-header-wrapper">
      <span class="cubeic-back" @click="back"></span>
      <span>发布问题</span>
      <span class="release-name" @click="release">发布</span>
    </div>
    <div class="choose-model-wrapper" v-show="this.$route.params.modelName">
      <span class="">选择的模块</span>
      <div class="choose-model">
        <span class="iconfont" :class="this.$route.params.modelIcon"></span>
        <span class="text">{{this.$route.params.modelName}}</span>
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
        value: ''
      }
    },
    methods: {
      back () {
        this.$router.go(BACK_FLAG)
      },
      release () {
        this.$router.push('/quesion')
      }
    },
    computed: {
      placeholder () {
        if (this.$route.params.modelName) {
          return '请输入' + this.$route.params.modelName + '问题'
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
      font-size 20px
      color #444
      background-color #f1f1f1

      .cubeic-back, .release-name
        display inline-block
        height 40px
        width 60px
        text-align center
        line-height 40px

      .release-name
        font-size 14px

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
