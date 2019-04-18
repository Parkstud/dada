<template>
  <div class="home-page">
    <div class="back-header">
      <span class="cubeic-back" @click="back">
      </span>
      <i class="cubeic-more" @click="showMoreAction"></i>
      <transition name="fade">
        <div class="moreAction" v-show="show">
          <ul>
            <li>
              <i class="cubeic-remove"></i>
              <span>加入黑名单</span>
            </li>
            <li>
              <i class="cubeic-danger"></i>
              <span>举报</span>
            </li>
          </ul>
        </div>
      </transition>
      <span class="text">
        信息
      </span>
    </div>
    <div class="header-info">
      <div class="avatar-wrapper">
        <img class="avatar" width="60" height="60" :src="this.imgURL+userData.avatar">
      </div>
      <div class="name-wrapper">
        <span class="name">{{userData.nickName}}</span>
      </div>
      <div class="care-wrapper">
        <span>关注了 {{userData.cares}} 人</span>
        <span class="split-hight"></span>
        <span>关注者 {{userData.fans}} 人</span>
      </div>
      <div class="btn-wrapper">
        <cube-button :icon="userData.cared ? 'cubeic-ok':'cubeic-add' " :inline="true"
                     :outline="userData.cared"
                     @click="clickCare">{{btnCareText}}
        </cube-button>
        <cube-button icon="cubeic-email" :inline="true" @click="privateLetter">私信</cube-button>
      </div>

    </div>
    <div class="question-info">
      <div class="question-wrapper">
        <span class="left">
          <span class="cubeic-edit"></span>
          <span class="txt">提出问题</span>
        </span>

        <span class="right">
           <span class="num">{{userData.myQuestionCount}}</span>
           <span class="cubeic-arrow"></span>
        </span>

      </div>
      <div class="answer-wrapper">
         <span class="left">
          <span class="cubeic-time"></span>
          <span class="txt">收藏问题</span>
         </span>
        <span class="right">
          <span class="num">{{userData.collectProblemCount}}</span>
          <span class="cubeic-arrow"></span>
        </span>
      </div>
    </div>

  </div>
</template>

<script type='text/ecmascript-6'>
  export default {
    name: 'homePage',
    data () {
      return {
        // 从问题跳转进来的页面
        problem: this.$route.params.problem,
        // 用户的id
        userId: this.$route.params.userId,
        // 显示更多
        show: false,
        userData: {
          avatar: 'group1/M00/00/00/rBsAAlycfB-AA9jFAACjZJqjeEQ581_big.jpg',
          nickName: '小明明',
          cares: 1,
          fans: 1,
          myQuestionCount: 114,
          collectProblemCount: 1,
          cared: true
        }
      }
    },

    computed: {
      btnCareText () {
        return this.userData.cared ? '已关注' : '关注'
      }
    },
    methods: {

      clickCare: function () {
        this.userData.cared = !this.userData.cared
        if (this.userData.cared) {
          this.userData.fans++
        } else {
          this.userData.fans--
        }
        let url = '/problemInfo/change/careinfo'
        let param = new URLSearchParams()
        param.append('userId', this.userId)
        this.$http.post(url, param)
          .then((response) => {
          }).catch((error) => {
          console.log(error)
        })
      },
      back () {
        this.$router.push({
          name: 'problemDetails',
          params: { problem: this.problem }
        })
      },
      // 私信界面
      privateLetter () {
        let url = '/myPage/user/userInformation/'.concat(this.userId)
        this.$http.get(url, null)
          .then((response) => {
            if (response.data.head.stateCode === 200) {
              this.$router.push({
                name: 'chatPage',
                params: { letterUser: response.data.body.data,
                  problem: this.problem
                }
              })
            }
          })
      },
      showMoreAction () {
        this.show = !this.show
      }
    },
    mounted () {
      // 获取用户信息
      let url = '/problemInfo/userInfo'
      this.$http.get(url, {
        params: {
          userId: this.userId
        }
      }).then((response) => {
        let data = response.data.body.data
        this.userData = data
      }).catch((error) => {
        console.log(error)
      })
    }
  }
</script>

<style lang='stylus' rel='stylesheet/stylus'>
  .home-page
    background-color #ebebeb
    height 100%

    .back-header
      color: white
      position relative
      background-color #007efe
      font-size 18px
      padding-left 18px
      padding-top 6px
      padding-bottom 6px
      margin 0

      .cubeic-back
        display inline-block
        width 20px
        height: 30px

      .fade-enter-active, .fade-leave-active
        transition: opacity .5s;

      .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */
        opacity: 0;

      .cubeic-more
        position absolute;
        right 0
        margin-right 20px
        width 30px
        height 30px
        font-size 22px

      .moreAction
        position absolute;
        background-color #007efe
        right 5px
        width 150px
        color white
        z-index 20
        top 50px
        border-radius 5px
        font-size 16px

        ul
          li
            padding 10px
            border-bottom 1px solid white
            transition background-color 1s

            .cubeic-star-collect
              color aqua

            &:active
              background-color black

            span
              margin 10px
              width 40px
              text-align center

        &:before
          content: "";
          width: 0;
          height: 0;
          border-left: 10px solid transparent;
          border-right: 10px solid transparent;
          border-bottom: 10px solid #007efe;
          position: absolute;
          top: -9px;
          left: 106px;

    .header-info
      color white
      background-color #5ba8ff

      .avatar-wrapper
        text-align center
        padding 10px 0

        .avatar
          border-radius 50%

      .name-wrapper
        text-align center
        margin-bottom 10px

      .care-wrapper
        text-align center

        .split-hight
          border-left 1px solid white
          margin 0 10px

      .btn-wrapper
        display flex
        margin 10px auto 5px
        padding-bottom 10px
        width 60%
        justify-content space-between

        .cube-btn
          width 100px

    .question-info
      .question-wrapper, .answer-wrapper
        display flex
        justify-content space-between
        background-color #fefefe
        margin-top 1px
        height 40px
        line-height 40px
        color: #454545

        .cubeic-edit, .cubeic-time
          margin 0 10px

        .txt
          font-size 14px

        .num
          font-size 14px
          color #007efe

        .cubeic-arrow
          margin 0 10px
</style>
