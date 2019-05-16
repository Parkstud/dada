<template>
  <div class="about">
    <back-header :back-text="backText"></back-header>
    <div class="app-wrapper">
      <span>APP介绍:</span>
      <p>
        "达达问答"是一块在线解决学生关于数据结构方面问题的APP。      </p>
    </div>
  </div>
</template>

<script type='text/ecmascript-6'>
  import BackHeader from '../../../common/backHeader'

  export default {
    name: 'aboutdada',
    data () {
      return {
        backText: '关于达达'
      }
    },
    components: { BackHeader }
  }
</script>

<style lang='stylus' rel='stylesheet/stylus'>
  .about
    .app-wrapper
      margin 20px
      line-height 26px
      span
        font-size large
</style>
