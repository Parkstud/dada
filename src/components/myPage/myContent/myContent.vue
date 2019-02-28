<template>
  <div class="my-content">
    <ul class="content">
      <li class="item" @click="myProblem">
        <span class="myicon cubeic-alert"></span>
        <span class="text">我的问题</span>
        <span class="wrapper">
             <span class="num">0</span>
              <span class="cubeic-arrow"></span>
          </span>

      </li>
      <li class="item">
        <span class="myicon cubeic-star"></span>
        <span class="text">我收藏的</span>
        <span class="wrapper">
             <span class="num">0</span>
              <span class="cubeic-arrow"></span>
          </span>
      </li>
      <li class="item">
        <span class="myicon cubeic-good"></span>
        <span class="text">我赞过的</span>
        <span class="wrapper">
             <span class="num">0</span>
              <span class="cubeic-arrow"></span>
          </span>
      </li>
      <li class="item">
        <span class="myicon cubeic-time"></span>
        <span class="text">浏览历史</span>
        <span class="wrapper">
             <span class="num">0</span>
              <span class="cubeic-arrow"></span>
          </span>
      </li>
      <li class="item">
        <span class="myicon cubeic-setting"></span>
        <span class="text">个人设置</span>
        <span class="wrapper">
             <span class="num">0</span>
             <span class="cubeic-arrow"></span>
          </span>
      </li>

    </ul>
  </div>
</template>

<script type='text/ecmascript-6'>

  // 主界面显示我的
  const MAIN_MY = 3
  export default {
    name: 'myContent',
    methods: {
      myProblem () {
        this.$store.commit('setTransition', 'turn-on')
        this.$store.commit('updateCount', MAIN_MY)
        this.$router.push('/myProblem')

      }
    },
    mounted () {
      window.addEventListener('popstate', () => {
        this.$store.commit('setTransition', 'turn-off')
      }, false)
    }
  }
</script>

<style lang='stylus' rel='stylesheet/stylus'>
  .my-content
    width 100%
    margin-top 20px

    .content
      .item
        display flex
        align-items center
        position: relative;
        height 50px
        border 1px solid #EAEBEB
        background-color #fff

        .myicon
          margin 0 10px 0 10px
          font-size 20px

        .cubeic-alert
          color #9d4dee

        .cubeic-star
          color #fed80e

        .cubeic-good
          color #03d3e4

        .cubeic-time
          color #1a9dfe

        .cubeic-setting
          color #4ccbba

        .wrapper
          position absolute
          right 0
          display inline-block
          width 40px
          color: #888888

          .num
            margin-right 5px

</style>
