<template>
  <div class="my-header">
    <div class="header-content">
      <div class="avatar">
        <img src="http://148.70.8.85/group1/M00/00/00/rBsAAlycfB-AA9jFAACjZJqjeEQ581_big.jpg"
             width="64" height="64">
      </div>
      <div class="info-wrapper">
        <div class="name">毛毛0.0</div>
        <div class="attention-wrapper">
              <span class="attention-wrapper">
                <span class="attention">关注</span>
                <span class="attention-num">19</span>
              </span>
        </div>
        <div class="fan-wrapper">
          <span class="fan">关注</span>
          <span class="fan-num">1</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script type='text/ecmascript-6'>
  export default {
    name: 'myHeader',
    mounted () {
      // let userAccount = JSON.parse(window.localStorage.getItem('token'))
      // this.$http.get("/")
    }
  }
</script>

<style lang='stylus' rel='stylesheet/stylus'>
  .my-header
    display: flex
    align-items: center
    border-radius 2px solid
    background-color #FFFFFF
    height 80px
    width 100%
    font-size 20px
    box-shadow 1px 1px 1px 1px 3px #e2e2e2

    .header-content
      .avatar
        display inline-block

        img
          border-radius 50%
          border 1px solid #f3f3f3

      .info-wrapper
        display inline-block
        vertical-align top
        margin 12px 0 0 16px
        width 100px
        line-height 24px

        .fan-wrapper, .attention-wrapper
          display inline-block
          font-size 12px
          color #888888
          width 50px

          .attention-num, .fan-num
            padding-left 5px
            text-align right
            font-size 14px
            color #2f2f2f
</style>
