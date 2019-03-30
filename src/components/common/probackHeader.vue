<template>
  <div class="back-header">
      <span class="cubeic-back" @click="back">
      </span>
    <span class="cubeic-star" :class="{'active1':style1 }" @click="collect"></span>
    <span class="text">
        {{backText}}
      </span>
  </div>
</template>

<script type='text/ecmascript-6'>
  // 返回上个界面
  const BACK_FLAG = -1
  export default {
    name: 'backHeader',
    data () {
      return {
        style1: true
      }
    },
    props: {
      backText: {
        type: String
      }
    },
    methods: {
      back () {
        this.$router.go(BACK_FLAG)
      },
      collect () {
        this.style1 = !this.style1
      }
    }
  }
</script>

<style lang='stylus' rel='stylesheet/stylus'>
  .active1
    color #00b092;

  .back-header
    position relative
    margin-top 2px
    color: #555
    font-size 18px
    margin-left 18px

    .cubeic-back
      display inline-block
      width 20px
      height: 30px

    .cubeic-star
      position absolute;
      right 0
      margin-right 20px
      width 30px
      height 30px
</style>
