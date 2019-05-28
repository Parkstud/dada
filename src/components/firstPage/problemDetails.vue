<template>
  <div class="proble-details">
    <proback-header ref="backheader" :back-text="backText"
                    :has-collection="headerInfo.hasCollection"
                    :show-delete="nowUser.id===problem.userId || nowUser.type!==0"
                    :show-report="nowUser.id!==problem.userId && nowUser.type===0"
                    v-on:changeHasCollection="changeHasCollection"
                    v-on:changeReport="changeReport"
                    v-on:deleteProblem="deleteProblem"
    ></proback-header>
    <div class="my-details" ref="detailsWrapper">
      <cube-scroll ref="answer"
                   :options="scrollOptions"
                   :data="contentInfo"
                   @pulling-up="onPullingUp"
                   @pulling-down="onPullingDown">
        <template slot="pulldown" slot-scope="props">
          <div v-if="props.pullDownRefresh"
               class="cube-pulldown-wrapper"
               :style="props.pullDownStyle">
            <div v-if="props.beforePullDown"
                 class="before-trigger"
                 :style="{paddingTop: props.bubbleY + 'px'}">
            <span
              :class="{rotate: props.bubbleY > scrollOptions.pullDownRefresh.threshold - 60}">↓</span>
            </div>
            <div class="after-trigger" v-else>
              <div v-show="props.isPullingDown" class="loading">
                <cube-loading></cube-loading>
              </div>
              <transition name="success">
                <div v-show="!props.isPullingDown" class="text-wrapper"><span class="refresh-text">更新成功</span>
                </div>
              </transition>
            </div>
          </div>
        </template>
        <div class="question-wrapper">
          <p class="question">{{problem.title}}</p>
          <div class="question-more">
            <span class="answer-num">{{headerInfo.answersCount}}</span>
            <span>条回答</span>
            <span class="collection-num">{{headerInfo.collection}}</span>
            <span>个收藏</span>
          </div>
          <div class="btn-wrapper" v-show="problem.open===1">
            <cube-button icon="cubeic-person" :light="true" @click="invite">邀请回答</cube-button>
            <cube-button icon="cubeic-edit" :light="true" @click="writeaswer">写回答</cube-button>
          </div>
        </div>
        <div class="answer-wrapper" v-for="(item,index) in contentInfo" :key="index"
             @click=" toDetail(item)">
          <div class="author-type-wrapper">
            <hr
              style="border:1px;" class="border-bottom-1px"
              :class="{ expand : item.userType===2 || item.userType===1}"
              SIZE=1/>
            <span class="author-type" v-show="item.userType===2">智能回答</span>
            <span class="author-type" v-show="item.userType===1">教师回答</span>
          </div>
          <div class="author-info">
          <span class="avatar" @click.stop="toHomepage(item.userId)">
            <img :src="imgURL+item.avatar" width="40" height="40">
          </span>
            <span class="author-name"
                  @click.stop="toHomepage(item.userId)">{{item.username}}</span>
            <span class="answer-time">{{formatData(item.commentTime,1)}}</span>
            <span class="info-left">
              <span class="iconfont icon-caina" v-show="item.adopt>0"></span>
              <span class="cubeic-message"></span>
              <span class="comment" v-if="item.replyCount>0">{{item.replyCount}}</span>
              <span class="comment-text" v-else>回复</span>
          </span>
          </div>
          <p class="answer-content" v-html="transferString(item.comments)">
          </p>
          <div class="btn-wrapper border-bottom-1px">
             <span class="approval-wrapper">
           <cube-button :inline="true" icon="cubeic-good"
                        :class="item.result===1?'adoption':'adoption-not'"
                        @click.stop="pullUp(item)">
                      <span class="text">赞同 {{item.awesome}} </span>
           </cube-button>
           <cube-button :inline="true" icon="cubeic-bad" @click.stop="pullDown(item)"
                        :class="item.result===2?'oppose':'oppose-not'">
            <span class="text">反对 {{item.badReview}} </span>
          </cube-button>
        </span>
          </div>
        </div>
        <div style="height: 10px"></div>

      </cube-scroll>

    </div>
  </div>
</template>

<script type='text/ecmascript-6'>
  import probackHeader from '../common/probackHeader'

  export default {
    name: 'problemDetails',
    data () {
      return {
        nowUser: JSON.parse(window.localStorage.getItem('token')),
        // 阻止多次触发
        evTimeStamp: 0,
        // 返回页面
        backComponent: '/mainApp',
        backText: '问题',
        // 收藏数
        collectCount: 0,
        // 评论数
        commentCount: 0,
        // 是否收藏
        hasCollection: false,
        // 评论信息
        comments: [],
        // 分页的当前页数
        current: 1,
        // 当前数据不足10
        dataLess: 0,
        // 当前问题
        problem: {},
        headerInfo: {},
        contentInfo: [],
        scrollOptions: {
          pullDownRefresh: {
            threshold: 60,
            stop: 44
            // stopTime: 1000,
            // txt: '更新成功'
          },
          directionLockThreshold: 0
        }
      }
    },
    methods: {
      transferString (content) {
        let string = content
        try {
          string = (string + '').replace(/\r\n/g, '<br>')
          string = (string + '').replace(/\n/g, '<br>')
        } catch (e) {
          alert(e.message)
        }
        return string
      },
      deleteProblem () {
        this.$createDialog({
          type: 'confirm',
          icon: 'cubeic-alert',
          title: '确认删除该题目',
          confirmBtn: {
            text: '确认',
            active: true,
            disabled: false,
            href: 'javascript:;'
          },
          cancelBtn: {
            text: '取消',
            active: false,
            disabled: false,
            href: 'javascript:;'
          },
          onConfirm: () => {
            this.$refs.backheader.$refs.showmore.click()
            this.$http.post('/control/problem/problemId',
              this.$qs.stringify({
                problemId: this.problem.id
              }),
              { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
            ).then((res) => {
              if (res.data.body.data) {
                this.showToast('删除成功!')
                // 需要全部更新列表
                this.$store.commit('setFlushCount')
                this.$router.go(-1)
              } else {
                this.showToast('删除失败!')
              }
            }).catch((error) => {
              console.log(error)
              this.showToast('删除异常!')
            })
          },
          onCancel: () => {
            this.$refs.backheader.$refs.showmore.click()
          }
        }).show()
      },
      // 反对
      pullDown (item) {
        // 处理多次点击
        let now = new Date()
        if (now - this.evTimeStamp < 100) {
          return
        }
        this.evTimeStamp = now
        if (item.result === 2) {
          item.result = 0
          item.badReview--
        } else if (item.result === 1) {
          item.result = 2
          item.badReview++
          item.awesome--
        } else {
          item.result = 2
          item.badReview++
        }

        this.changeAwesome(item)
      },
      // 修改当前用户的赞成反对数
      changeAwesome (item) {
        let url = '/Interaction/awesome'
        let userLikes = {}
        userLikes.commentId = item.commentId
        userLikes.result = item.result
        this.$http.post(
          url,
          this.$qs.stringify(userLikes),
          { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
        ).then((res) => {
          if (res.data.body.data) {
            console.log('有数据')
            console.log(res.data.body.data)
            this.problem = res.data.body.data
          }
        }).catch((err) => {
          console.log(err)
        })
        // 通知修改
        this.$store.commit('setProblem', this.problem.id)
      },
      // 赞同
      pullUp (item) {
        // 处理多次点击
        let now = new Date()
        if (now - this.evTimeStamp < 100) {
          return
        }
        this.evTimeStamp = now
        if (item.result === 1) {
          item.result = 0
          item.awesome--
        } else if (item.result === 2) {
          item.result = 1
          item.awesome++
          item.badReview--
        } else {
          item.result = 1
          item.awesome++
        }
        this.changeAwesome(item)
      },
      onPullingDown () {
        this.getData()
      },
      // 点击头像跳转界面
      toHomepage (userId) {
        if (userId === this.nowUser.id) {
          this.$router.push('/editPersonalInformation')
        } else {
          this.$router.push({
            name: 'homePage',
            params: {
              userId: userId
            }
          })
        }
      },
      toDetail (item) {
        this.$router.push({
            name: 'commentDetail',
            params: {
              commentId: item.commentId
            }
          }
        )
        // 通过comment 获取评论信息
        // this.$http.get('/commentInfo/comment/' + item.commentId, null).then((response) => {
        //   console.log(response.data)
        //   // 跳转界面 阅读评论界面
        //
        // }).catch((error) => {
        //   console.log(error)
        // })
      },
      // 邀请
      invite () {
        this.$router.push({
          name: 'inviteAnswer',
          params: {
            problemId: this.problem.id
          }
        })
      },
      // 写回答
      writeaswer () {
        this.$router.push({
          name: 'writeAnswer',
          params: { problem: this.problem }
        })
      },
      // 下拉刷新
      onPullingUp () {
        let url = '/problemInfo/problem/detail'
        this.$http.get(url, {
          params: {
            problemId: this.problem.id
          }
        })
          .then((response) => {
            let data = response.data.body.data
            this.headerInfo = data.headerInfo
            this.contentInfo = data.contentInfo

            this.$refs.answer.forceUpdate()
          }).catch((error) => {
          console.log(error)
        })
      },
      // 接收子组件的举报信息
      changeReport () {
        // 跳转到举报信息页面
        let reportInfo = {}
        reportInfo['reportId'] = this.problem.id
        reportInfo['toUserId'] = this.problem.userId
        reportInfo['type'] = 1
        // 跳转举报页面
        this.$refs.backheader.$refs.showmore.click()
        this.$router.push({
          name: 'report',
          params: {
            reportInfo: reportInfo
          }
        })
      },
      // 接收子组件修改的收藏信息
      changeHasCollection (value) {
        this.headerInfo.hasCollection = value
        if (value) {
          this.headerInfo.collection++
        } else {
          this.headerInfo.collection--
        }
        // 修改收藏信息
        let url = '/problemInfo/problem/collection'
        let param = new URLSearchParams()
        param.append('problemId', this.problem.id)
        this.$http.post(url, param)
          .then((response) => {

          }).catch((error) => {
          console.log(error)
        })
      },
      updateLookHistory () {
        // 更新浏览记录
        let url = '/problemInfo/problem/history'
        let param = new URLSearchParams()
        param.append('problemId', this.problem.id)
        this.$http.post(url, param)
          .then((response) => {
          }).catch((error) => {
          console.log(error)
        })
      },
      getData () {
        // 获取local
        if (this.$route.params.problem) {
          window.localStorage.setItem('proDet_problem', JSON.stringify(this.$route.params.problem))
        }
        this.problem = JSON.parse(window.localStorage.getItem('proDet_problem'))

        // 获取问题信息
        console.log(this.$route.params.problemId)
        if (this.$route.params.problemId) {
          this.problem.id = this.$route.params.problemId
          this.$http.get('/problemInfo/oneProblemInfo', {
            params: {
              problemId: this.problem.id
            }
          }).then((res) => {
            this.problem = res.data.body.data
          })
        }
        // 获取详细信息数据
        let url = '/problemInfo/problem/detail'
        this.$http.get(url, {
          params: {
            problemId: this.problem.id
          }
        })
          .then((response) => {
            let data = response.data.body.data
            this.headerInfo = data.headerInfo
            this.contentInfo = data.contentInfo

            // 更新浏览记录
            this.updateLookHistory()
          }).catch((error) => {
          console.log(error)
        })
      }
    },
    beforeRouteEnter (to, from, next) {
      if (from.name === 'mainApp' || from.name === 'myProblem' ||
        from.name === 'myCollection' || from.name === 'myHistory' ||
        from.name === 'onlySearchPage') {
        to.meta.isBack = false
      }
      console.log(from.name)
      next()
    },
    activated () {
      if (this.$store.state.flushDetail !== -1) {
        this.getData()
        this.$store.commit('updateFlushDetail', -1)
      }

      if (!this.$route.meta.isBack) {
        // 如果isBack是false，表明需要获取新数据，否则就不再请求，直接使用缓存的数据
        this.getData()
      }
      // 恢复成默认的false，避免isBack一直是true，导致下次无法获取数据
      this.$route.meta.isBack = true
    },
    components: { probackHeader },
    mounted () {
      // 获取浏览器可视区域高度
      this.clientHeight = `${document.documentElement.clientHeight}`
      this.$refs.detailsWrapper.style.height = (this.clientHeight - 42) + 'px'
    }
  }
</script>

<style lang='stylus' rel='stylesheet/stylus'>
  .cubeic-alert
    color: #DA4F49

  .own-class
    height: 180%;

  .proble-details
    .my-details
      .cube-scroll-wrapper
        .question-wrapper
          .question
            margin 0 20px 8px 20px
            font-size 20px
            line-height 32px

          .question-more
            margin-left 20px
            color: #999999

            .answer-num
              margin-right 4px

            .collection-num
              margin-left 10px
              margin-right 4px

          .btn-wrapper
            margin-top 10px
            display flex

            .cube-btn-light
              background-color white;
              color #0084ff

        .answer-wrapper
          margin-top 8px

          .author-type-wrapper
            position relative

            hr
              margin 0
              height 1px

              box-shadow 1px 1px 1px 1px 3px #e2e2e2

            /*background-color #dedede*/

            .expand
              margin 25px 0

            .author-type
              position absolute
              display inline-block;
              left 10px
              top -16px
              background-color #00b092
              color white
              height 32px
              width 100px
              text-align center
              line-height 32px
              border-radius 10px

          .author-info
            position: relative;
            margin-top 0
            margin-left 10px
            color: #999999

            .avatar > img
              border-radius 50%
              margin-right 8px

            .author-name

              display inline-block
              position absolute
              top: 4px
              font-size 14px

            .answer-time
              display inline-block
              position absolute
              top: 20px
              font-size 12px

            .info-left
              position absolute
              right 0
              margin-right 20px
              top 20px

              .icon-caina
                margin-right 12px
                font-size 18px
                color #0084ff

              .comment, .approve
                display inline-block
                width 30px
                text-align center

              .comment-text
                margin 0 2px
                font-size 14px
                vertical-align top

          .answer-content
            margin 4px 10px
            line-height 20px
            letter-spacing 1px

          .btn-wrapper
            padding-top 4px
            text-align right
            padding-bottom 6px

            .approval-wrapper
              margin-right 20px

              .cube-btn-inline
                font-size 14px

              .oppose-not
                color: #7A7A7A

              .adoption-not
                color: #7A7A7A

              .oppose
                color: #007efe

              .adoption
                color: #007efe

              .cube-btn
                background-color #f7f7f7
                padding 6px

                .cubeic-pullup, .cubeic-pulldown
                  font-size 30px
                  line-height 15px
                  vertical-align: middle;

                &:nth-child(1)
                  margin-right 10px

              .cubeic-good
                margin-right 5px

        .cube-pulldown-wrapper
          text-align: center

          .after-trigger
            flex: 1
            margin: 0

            .text-wrapper
              margin: 0 auto
              margin-top: 14px
              padding: 5px 0
              color: #498ec2
              background-color: #d6eaf8

            .cube-loading-spinners
              margin: auto

          .before-trigger
            height: auto
            align-self: flex-end
            font-size: 30px

            span
              display: inline-block
              line-height: 1
              transition: all 0.3s
              color: #666
              padding: 15px 0

              &.rotate
                transform: rotate(180deg)

  .success-enter-active, .success-leave-active
    transition: width .5s

  .success-enter, .success-leave-to
    width: 70%

  .success-enter-to, .success-leave
    width: 100%
</style>
