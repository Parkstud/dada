<template>
  <div class="back-header">
      <span class="cubeic-back" @click="back">
      </span>
    <span class="text" @click="back">
        {{backText}}
      </span>
  </div>
</template>

<script type='text/ecmascript-6'>
  // 返回上个界面
  const BACK_FLAG = -1
  export default {
    name: 'backHeader',
    props: {
      backText: {
        type: String
      }
    },
    methods: {
      back () {
        this.$router.go(BACK_FLAG)
      }
    }
  }
</script>

<style lang='stylus' rel='stylesheet/stylus'>
  .back-header
    margin-top 40px
    color: #555
    font-size 18px
    margin-left 18px
    line-height 28px
    .cubeic-back
      display inline-block
      width 20px
      height: 30px

</style>
