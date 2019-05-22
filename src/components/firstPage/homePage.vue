<template>
  <div class="home-page">
    <proback-header ref="backheader" :back-text="backText"
                    :show-collect="false"
                    :show-more="showMore"
                    v-on:changeReport="changeReport"
    ></proback-header>

    <div class="header-info" v-show="showPage">
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
                     :class="userData.cared?'cube-btn-active':''"
                     @click="clickCare">{{btnCareText}}
        </cube-button>
        <cube-button icon="cubeic-email" :inline="true" @click="privateLetter">私信</cube-button>
      </div>

    </div>
    <div class="question-info" v-show="showPage">
      <div class="question-wrapper" @click="putQuestion">
        <span class="left">
          <span class="cubeic-edit"></span>
          <span class="txt">提出问题</span>
        </span>

        <span class="right">
           <span class="num">{{userData.myQuestionCount}}</span>
           <span class="cubeic-arrow"></span>
        </span>

      </div>
      <div class="answer-wrapper" @click="collectQuestion">
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
  import probackHeader from '../common/probackHeader'

  export default {
    name: 'homePage',
    data () {
      return {
        backText: '信息',
        showPage: true,
        // 用户的id
        userId: this.$route.params.userId,
        // 显示更多
        showMore: true,
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
      changeReport () {

        let reportInfo = {}
        reportInfo['reportId'] = this.userId
        reportInfo['toUserId'] = this.userId
        reportInfo['type'] = 0
        // 跳转举报页面
        this.$refs.backheader.$refs.showmore.click()
        this.$router.push({
          name: 'report',
          params: {
            reportInfo: reportInfo
          }
        })
      },
      // 提出问题界面
      putQuestion () {
        this.$router.push({
            name: 'myProblem',
            params: {
              userId: this.userId,
              backText: this.userData.nickName + ' 的问题'
            }
          }
        )
      },
      // 收藏问题界面
      collectQuestion () {
        this.$router.push({
            name: 'myCollection',
            params: {
              userId: this.userId,
              backText: this.userData.nickName + ' 的收藏'
            }
          }
        )
      },
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
        this.$router.go(-1)
      },
      // 私信界面
      privateLetter () {
        let url = '/myPage/user/userInformation/'.concat(this.userId)
        this.$http.get(url, null)
          .then((response) => {
            if (response.data.head.stateCode === 200) {
              this.$router.push({
                name: 'chatPage',
                params: {
                  letterUser: response.data.body.data
                }
              })
            }
          })
      },
      getData () {
        this.showPage = false
        // 获取用户信息
        let url = '/problemInfo/userInfo'
        this.$http.get(url, {
          params: {
            userId: this.userId
          }
        }).then((response) => {
          let data = response.data.body.data
          this.userData = data
          this.showPage = true
        }).catch((error) => {
          console.log(error)
        })
      }
    },
    activated () {
      if (!this.$route.params.userId) {
        return
      }

      let my = JSON.parse(localStorage.getItem('token'))
      if (this.userId === my.id) {
        this.showMore = false
      } else {
        this.showMore = true
      }

      if (this.userId !== this.$route.params.userId) {
        this.userId = this.$route.params.userId
        this.getData()
      }
    },
    components: { probackHeader },
    mounted () {
      this.getData()
    }
  }
</script>

<style lang='stylus' rel='stylesheet/stylus'>
  .home-page
    background-color #f4f6f9
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

    /* .moreAction
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
*/

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
          background-color #007efe

        .cube-btn-active
          background-color #5ba8ff

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

        .cubeic-edit
          color: #4ccbba

        .cubeic-time
          color: #1a9dfe

        .txt
          font-size 14px

        .num
          font-size 14px
          color #007efe

        .cubeic-arrow
          margin 0 10px
</style>
