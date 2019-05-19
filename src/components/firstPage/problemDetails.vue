<template>
  <div class="proble-details">
    <proback-header ref="backheader" :back-text="backText"
                    :has-collection="hasCollection"
                    :intoParams="problem"
                    v-on:changeHasCollection="changeHasCollection"
                    v-on:changeReport="changeReport"
                    v-on:deleteProblem="deleteProblem"
    ></proback-header>
    <cube-scroll ref="answer"
                 :options="scrollOptions"
                 :data="comments"
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
          <span class="answer-num">{{commentCount}}</span>
          <span>条回答</span>
          <span class="collection-num">{{collectCount}}</span>
          <span>个收藏</span>
        </div>
        <div class="btn-wrapper" v-show="problem.open!==0">
          <cube-button icon="cubeic-person" :light="true" @click="invite">邀请回答</cube-button>
          <cube-button icon="cubeic-edit" :light="true" @click="writeaswer">写回答</cube-button>
        </div>
      </div>

      <div class="answer-wrapper" v-for="(item,index) in comments" :key="index"
           @click=" toDetail(item)">
        <div class="author-type-wrapper">
          <hr style="filter: progid:DXImageTransform.Microsoft.Glow(color=#ccc,strength=10)"
              :class="{ expand : item.type==='SYSTEM' || item.type==='TEACHER'}"
              color=#ccc SIZE=1/>
          <span class="author-type" v-show="item.type==='SYSTEM'">智能回答</span>
          <span class="author-type" v-show="item.type==='TEACHER'">教师回答</span>
        </div>
        <div class="author-info">
          <span class="avatar" @click.stop="toHomepage(item.id)">
            <img :src="imgURL+item.path" width="40" height="40">
          </span>
          <span class="author-name" @click.stop="toHomepage(item.id)">{{item.username}}</span>
          <span class="answer-time">{{formatData(item.time,1)}}</span>
          <span class="info-left">
              <span class="cubeic-message"></span>
              <span class="comment">{{item.replyCount}}</span>
          </span>
        </div>
        <p class="answer-content">
          {{item.comments}}
        </p>
        <div class="btn-wrapper border-bottom-1px">
             <span class="approval-wrapper">
           <cube-button :inline="true" icon="cubeic-pullup"
                        :class="item.userLike===1?'adoption':'adoption-not'"
                        @click.stop="pullUp(item)">
                      <span class="text">赞同 {{item.awesome}}</span>
           </cube-button>
           <cube-button :inline="true" icon="cubeic-pulldown" @click.stop="pullDown(item)"
                        :class="item.userLike===2?'oppose':'oppose-not'">
            <span class="text">反对 {{item.badReview}}</span>
          </cube-button>
        </span>
        </div>
      </div>

    </cube-scroll>
  </div>
</template>

<script type='text/ecmascript-6'>
  import probackHeader from '../common/probackHeader'

  export default {
    name: 'problemDetails',
    data () {
      return {
        // 阻止多次触发
        evTimeStamp: 0,
        // 返回页面
        backComponent: '/mainApp',
        backText: '首页',
        // 收藏数
        collectCount: 0,
        // 评论数
        commentCount: 0,
        // 是否收藏
        hasCollection: false,
        // 评论信息
        comments: [],
        // 之前的三条评论信息的id
        threeComments: [],
        // 分页的当前页数
        current: 1,
        // 当前数据不足10
        dataLess: 0,
        // 当前问题
        problem: {},
        scrollOptions: {
          pullDownRefresh: {
            threshold: 60,
            stop: 44
            // stopTime: 1000,
            // txt: '更新成功'
          },
          pullUpLoad: true,
          directionLockThreshold: 0
        }
      }
    },
    methods: {
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
            // 需要全部更新列表
            this.$store.commit('setFlushCount')
            this.$refs.backheader.$refs.showmore.click()

            this.$http.post('/control/problem/id',
              this.$qs.stringify({
                id: this.problem.id
              }),
              { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
            ).then((res) => {
              const toast = this.$createToast({
                type: 'warn',
                time: 0,
                txt: '删除成功'
              })
              toast.show()

              setTimeout(() => {
                toast.hide()
                this.$router.go(-1)
              }, 1000)
            }).catch((error) => {
              console.log(error)
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
        if (item.userLike === 2) {
          item.userLike = 0
          item.badReview--
        } else if (item.userLike === 1) {
          item.userLike = 2
          item.badReview++
          item.awesome--
        } else {
          item.userLike = 2
          item.badReview++
        }

        this.changeAwesome(item)
      },
      // 修改当前用户的赞成反对数
      changeAwesome (item) {
        let url = '/Interaction/awesome'
        let userLikes = {}
        userLikes.commentId = item.id
        userLikes.result = item.userLike
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
        console.log(this.$store.state.updateProblem)
      },
      // 赞同
      pullUp (item) {
        // 处理多次点击
        let now = new Date()
        if (now - this.evTimeStamp < 100) {
          return
        }
        this.evTimeStamp = now
        if (item.userLike === 1) {
          item.userLike = 0
          item.awesome--
        } else if (item.userLike === 2) {
          item.userLike = 1
          item.awesome++
          item.badReview--
        } else {
          item.userLike = 1
          item.awesome++
        }

        this.changeAwesome(item)
      },
      onPullingDown () {
        this.getData()
      },
      // 点击头像跳转界面
      toHomepage (commentId) {
        // 通过评论信息 获取用户id
        let url = '/problemInfo/comment/info'
        this.$http.get(url, {
          params: {
            id: commentId
          }
        }).then((response) => {
          let data = response.data.body.data
          this.$router.push({
            name: 'homePage',
            params: {
              problem: this.problem,
              userId: data.userId
            }
          })
        })
      },
      toDetail (item) {
        console.log(item)
        // 通过comment 获取评论信息
        this.$http.get('/commentInfo/comment/id', {
          params: {
            commentId: item.id
          }
        }).then((response) => {
          console.log(response.data)
          // 跳转界面 阅读评论界面
          let commentInfo = {}
          commentInfo.awesome = response.data.body.data.awesome
          commentInfo.commentComments = response.data.body.data.comments
          commentInfo.commentId = response.data.body.data.id
          commentInfo.commentUserAvatar = response.data.body.data.path
          commentInfo.commentUserId = response.data.body.data.awesome
          commentInfo.commentUserNickName = response.data.body.data.username
          this.$router.push({
              name: 'commentDetail',
              params: {
                commentInfo: commentInfo
              }
            }
          )
        }).catch((error) => {
          console.log(error)
        })
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
      // 上拉获取更多评论信息,传入 问题 id  已经显示的三条信息(或者没有)
      onPullingUp () {
        let url = '/problemInfo/comments/page'
        const qs = this.$qs
        this.$http.get(url, {
          params: {
            hasCommentId: this.threeComments,
            problemId: this.problem.id,
            size: 10,
            current: this.current
          },
          paramsSerializer: function (params) {
            return qs.stringify(params, { arrayFormat: 'repeat' })
          }
        }).then((response) => {
          let data = response.data.body.data
          if (data.records.length === 10) { // 下次请求下一页
            this.current++
            this.comments = this.comments.concat(data.records.slice(this.dataLess))
            this.dataLess = 0
          } else {
            // 请求本页 记录下次需要添加的数据
            this.comments = this.comments.concat(data.records.slice(this.dataLess))
            this.dataLess = data.records.length
          }
        })
      },
      // 接收子组件的举报信息
      changeReport () {
        // 跳转到举报信息页面
        console.log((JSON.parse(window.localStorage.getItem('token'))))
        let reportInfo = {}
        reportInfo['id'] = this.problem.id
        reportInfo['replyUserId'] = this.problem.userId
        // 跳转举报页面
        this.$router.push({
          name: 'report',
          params: {
            type: 1,
            reportInfo: reportInfo
          }
        })

        console.log('举报')
      },
      // 接收子组件修改的收藏信息
      changeHasCollection (value) {
        this.hasCollection = value
        if (value) {
          this.collectCount++
        } else {
          this.collectCount--
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
      getData () {
        this.dataLess = 0
        // 获取local
        if (this.$route.params.problem) {
          window.localStorage.setItem('proDet_problem', JSON.stringify(this.$route.params.problem))
        }
        this.problem = JSON.parse(window.localStorage.getItem('proDet_problem'))
        console.log(this.problem)
        // 更新浏览记录
        let url = '/problemInfo/problem/history'
        let param = new URLSearchParams()
        param.append('problemId', this.problem.id)
        this.$http.post(url, param)
          .then((response) => {
            // let data = response.data.body.data
          }).catch((error) => {
          console.log(error)
        })

        // 获取详细信息数据
        url = '/problemInfo/problem/detail'
        this.$http.get(url, {
          params: {
            problemId: this.problem.id
          }
        })
          .then((response) => {
            let data = response.data.body.data
            this.hasCollection = data.hasCollection
            this.collectCount = data.collectCount
            this.commentCount = data.commentCount
            this.comments = data.comments
            for (let i = 0; i < data.comments.length; i++) {
              this.threeComments.push(data.comments[i].id)
            }
          }).catch((error) => {
          console.log(error)
        })
      }
    },
    beforeRouteEnter (to, from, next) {
      if (from.name === 'mainApp' || from.name === 'myProblem' ||
        from.name === 'myCollection' || from.name === 'myHistory') {
        to.meta.isBack = false
      }
      next()
    },
    activated () {
      if (!this.$route.meta.isBack) {
        // 如果isBack是false，表明需要获取新数据，否则就不再请求，直接使用缓存的数据
        this.getData()
      }
      // 恢复成默认的false，避免isBack一直是true，导致下次无法获取数据
      this.$route.meta.isBack = true
    },
    components: { probackHeader },
    mounted () {
      this.getData()
    }
  }
</script>

<style lang='stylus' rel='stylesheet/stylus'>
  .cubeic-alert
    color: #DA4F49
  .proble-details
    .cube-scroll-wrapper
      height 640px

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
        margin-top 2px

        .author-type-wrapper
          position relative

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

            .comment, .approve
              display inline-block
              width 30px
              text-align center

        .answer-content
          margin 0 10px 0 10px
          line-height 20px
          letter-spacing 1px

        .btn-wrapper
          text-align right
          padding-bottom 10px

          .approval-wrapper
            margin-right 20px

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

              .text
                display inline-block
                padding-top 6px
                margin-left -6px

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
