<template>
  <div class="my-content">
    <ul class="content">
      <li class="item" @click="myProblem">
        <span class="myicon cubeic-alert"></span>
        <span class="text">我的问题</span>
        <span class="wrapper">
             <span class="num">{{myQuestionCount}}</span>
              <span class="cubeic-arrow"></span>
          </span>

      </li>
      <li class="item" @click="myCollection">
        <span class="myicon cubeic-star"></span>
        <span class="text">我收藏的</span>
        <span class="wrapper">
             <span class="num">{{collectProblemCount}}</span>
              <span class="cubeic-arrow"></span>
          </span>
      </li>
      <li class="item" @click="myHistory">
        <span class="myicon cubeic-time"></span>
        <span class="text">浏览历史</span>
        <span class="wrapper">
             <span class="num">{{browseCount}}</span>
              <span class="cubeic-arrow"></span>
          </span>
      </li>
      <li class="item" @click="person_setting">
        <span class="myicon cubeic-setting"></span>
        <span class="text">个人设置</span>
        <span class="wrapper">
             <span class="num"></span>
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
    data () {
      return {
        // 收藏问题数
        collectProblemCount: '0',
        // 点赞问题数
        awesomeCount: '0',
        // 我的问题数
        myQuestionCount: '0',
        // 浏览数
        browseCount: '0'
      }
    },
    methods: {
      myHistory () {
        this.$store.commit('setTransition', 'turn-on')
        this.$store.commit('updateCount', MAIN_MY)
        this.$router.push('/myHistory')
      },
      myCollection () {
        this.$store.commit('setTransition', 'turn-on')
        this.$store.commit('updateCount', MAIN_MY)
        this.$router.push({
            name: 'myCollection',
            params: {
              userId: this.userId,
              backText: '我的收藏'
            }
          }
        )
      },
      // 跳转myProblem组件界面
      myProblem () {
        this.$store.commit('setTransition', 'turn-on')
        this.$store.commit('updateCount', MAIN_MY)
        this.$router.push({
            name: 'myProblem',
            params: {
              userId: this.userId,
              backText: '我的问题'
            }
          }
        )
      },
      person_setting () {
        this.$store.commit('updateCount', MAIN_MY)
        this.$router.push('/personSet')
      },
      getData () {
        // 获取 我的问题\收藏\赞\浏览历史的数量
        this.$http.get('/myPage/content/information/count', null)
          .then((response) => {
            let data = response.data.body.data
            if (this.change(this.collectProblemCount, data.collectProblemCount)) {
              this.collectProblemCount = data.collectProblemCount
            }
            if (this.change(this.awesomeCount, data.awesomeCount)) {
              this.awesomeCount = data.awesomeCount
            }
            if (this.change(this.myQuestionCount, data.myQuestionCount)) {
              this.myQuestionCount = data.myQuestionCount
            }
            if (this.change(this.browseCount, data.browseCount)) {
              this.browseCount = data.browseCount
            }
          }).catch((error) => {
          console.log(error)
        })
      }
    },
    activated () {
      this.getData()
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
          color: #888888

          .num
            margin-right 5px

          .cubeic-arrow
            margin-right 10px

</style>
