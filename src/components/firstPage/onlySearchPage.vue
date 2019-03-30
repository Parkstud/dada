<template>
  <div class="only-search">
    <div class="search-wrapper">
      <span class="cubeic-back" @click="back"></span>
      <span class="input-wrapper">
          <cube-input ref="search1" :placeholder="placeholder" :type="type"
                      @keyup.enter.native="searchInfo"
                      :autofocus="autofocus"></cube-input>
      </span>
      <span class="temp"></span>
    </div>
    <div class="history-wrapper">
      <div class="history-item">
        <span class="cubeic-time"></span>
        <span class="text">text</span>
        <span class="cubeic-close" @click="deleteHistory"></span>
      </div>
      <div class="history-item">
        <span class="cubeic-time"></span>
        <span class="text">text</span>
        <span class="cubeic-close"></span>
      </div>
    </div>
  </div>
</template>

<script type='text/ecmascript-6'>
  // 返回上个界面
  const BACK_FLAG = -1
  export default {
    name: 'onlySearchPage',
    data () {
      return {
        placeholder: '搜索',
        autofocus: true,
        type: 'search',
        waiting: 'false'

      }
    },
    methods: {
      deleteHistory () {
        console.log('asdasd')
      },
      back () {
        this.$router.go(BACK_FLAG)
      },
      searchInfo () {
        event.preventDefault() // 禁止默认事件（默认是换行）
        // 跳转界面
        this.$router.go(BACK_FLAG)
        this.$refs.search1.blur()
      }
    }
  }

</script>

<style lang='stylus' rel='stylesheet/stylus'>
  .only-search
    .search-wrapper
      display flex
      align-content: space-between;
      background-color #f1f1f1
      border-radius 10px
      box-shadow: 1px 2px 4px rgba(0, 0, 0, 0.2)

      .input-wrapper
        flex 1

        .cube-input
          background-color #f1f1f1

        .cube-input::after
          content: none;

      .cubeic-back
        width 40px
        align-self: center;
        text-align center;
        font-size 22px
        color gray

      .temp
        height 20px
        width 20px

    .history-wrapper
      color #aaa

      .history-item
        margin 10px
        display flex
        justify-content space-between
        font-size 18px
        height 24px
        border-bottom 1px solid #f1f1f1

        .cubeic-time
          width 60px
          text-align center

        .text
          flex 1

        .cubeic-close
          width 60px
          text-align center

</style>
