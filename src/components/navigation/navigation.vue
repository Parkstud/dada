<template>
  <div class="navigation">
    <div class="nav" @click="firstPage"><i class="cubeic-home item"></i><span class="text">首页</span>
    </div>
    <div class="nav"><i class="cubeic-search item"></i><span class="text">搜素</span></div>
    <div class="nav"><i class="cubeic-notification item"></i><span class="text">消息</span></div>
    <div class="nav"><i class="cubeic-person item"></i><span class="text">我的</span></div>
  </div>
</template>

<script type='text/ecmascript-6'>
  export default {
    name: 'navigation',
    methods: {
      firstPage () {

      }
    }
  }
</script>

<style lang='stylus' rel='stylesheet/stylus'>
  .navigation
    display: flex; /*设置五个导航条的内容由列排列变为行排列*/
    text-align center
    align-items: center;
    background #f3f3f3
    height 44px

    .nav
      display: flex
      flex 1
      flex-direction: column;
      color #c3c3c3

      .item
        font-size 24px

      .text
        font-size 12px
</style>
