<template>
  <div class="write-answer">
    <div class="write-header">
      <span class="cubeic-close" @click="back"></span>
      <span class=header-question>问题开头问题开头问题开头啊实打实大所大所多</span>
      <span class="cubeic-navigation"></span>
    </div>
    <div class="write-content">
      <cube-textarea v-model="value" :placeholder="placeholder" :maxlength="maxlength"
                     indicator="indicator"></cube-textarea>
    </div>
  </div>
</template>

<script type='text/ecmascript-6'>
  const BACK_FLAG = -1
  export default {
    name: 'writeAnswer',
    data () {
      return {
        indicator: {
          negative: true,
          remain: true
        },
        maxlength: 1000,
        value: '',
        placeholder: '写回答......'
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
  .write-answer
    height 100%

    .write-header
      display flex
      justify-content space-between
      align-items center
      margin 10px 0
      padding-bottom 10px
      box-shadow 0 2px 2px -2px #bbb

      .cubeic-close
        width 40px
        text-align center
        color: #808080

      .header-question
        overflow hidden
        text-overflow ellipsis
        white-space nowrap

      .cubeic-navigation
        width 40px
        color: #808080
        text-align center

    .write-content
      height 100%

    .cube-textarea-wrapper
      height 100%

    .cube-textarea_expanded
      height 100%
</style>
