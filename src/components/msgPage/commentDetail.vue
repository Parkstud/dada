<template>
  <div class="comment-detail">

    <proback-header ref="backheader" :back-text="backText"
                    :show-adopt="showAdopt"
                    :has-adopt="commentInfo.adopt>0"
                    :show-collect="false"
                    :show-report="showReport"
                    v-on:deleteProblem="deleteProblem"
                    v-on:changeReport="changeReport"
                    v-on:adoptComment="adoptComment"
    ></proback-header>

    <div class="comment-wrapper" ref="commentScroll">
      <cube-scroll ref="commentContainer" :options="scrollOptions" @pulling-up="onPullingUp">
        <!--评论内容-->
        <div class="comment-content" v-show="commentInfo">
          <div class="author-info">
            <span class="avatar">
            <img :src="imgURL+commentInfo.avatar" width="50" height="50"
                 v-show="commentInfo.avatar" @click="toHomepage(commentInfo.userId)">
          </span>
            <span class="author-name" @click="toHomepage(commentInfo.userId)">{{commentInfo.username}}</span>
            <span class="answer-time">{{commentInfo.commentTime}}</span>
            <span class="info-left" @click="replyComment">
              <span class="iconfont icon-caina" v-show="commentInfo.adopt>0"></span>
              <span class="cubeic-message"></span>
              <span class="comment">{{replys.length}}</span>
              <!--            <span class="cubeic-good"></span>-->
              <!--            <span class="approve">{{commentInfo.awesome}}</span>-->
              <!--              <span class="cubeic-bad"></span>-->
              <!--            <span class="approve">{{commentInfo.badReview}}</span>-->
          </span>
            <p class="comments" @click="replyComment" v-html="commentInfo.comments">
            </p>
          </div>
        </div>
        <div class="split"></div>
        <!--回复内容-->
        <div class="reply-wrapper border-bottom-1px" v-for="(item,index) in replys" :key="index">
          <span class="avatar">
              <img :src="imgURL+item.replyAvatar" width="40" height="40"
                   @click="toHomepage(item.replyId)">
          </span>
          <div class="reply-content" @click="clickReply(item)">
            <span class="reply-name"
                  @click.stop="toHomepage(item.replyId)">{{item.replyUsername}}</span>
            <span class="reply-time">{{formatData(item.replyTime,1)}}</span>
            <p class="reply-content">
              {{item.repliedUserId?'回复 '+item.repliedUsername+' 的评论 :'
              +item.replyContent:item.replyContent}}
            </p>
          </div>
          <hr
            style="border: none;filter: progid:DXImageTransform.Microsoft.Glow(color=#ccc,strength=10)"
            color=#ccc SIZE=1/>
        </div>

      </cube-scroll>
    </div>

    <!--底部-->
    <div class="chat-footer">
      <cube-input v-model="value" :placeholder="placeholder" ref="replyInput"
                  @keyup.enter.native="sendReply">
        <span slot="prepend" class="temp-space"></span>
        <span slot="append" @click="sendReplyClick" class="cubeic-navigation"
              :class="value.length>0?'sending':'not-send'"></span>
      </cube-input>
    </div>
  </div>
</template>

<script type='text/ecmascript-6'>
  import probackHeader from '../common/probackHeader'

  export default {
    name: 'commentDetail',
    data () {
      return {
        focusStatus: false,
        backText: '返回',
        // 回复输入框
        value: '',
        user: JSON.parse(window.localStorage.getItem('token')),
        commentId: this.$route.params.commentId,
        commentInfo: {},
        replys: [],
        // 分页的当前页数
        current: 1,
        // 分页页数
        size: 10,
        // 是否点赞
        hasLiked: false,
        // 点击的回复
        replyOtherInfo: null,
        replayInfo: [],
        placeholder: '请输入你的回复内容',
        dialog: null,
        needClear: true,
        scrollOptions: {
          directionLockThreshold: 0
        }
      }
    },
    computed: {
      showReport () {
        if (this.user.id === this.commentInfo.userId) {
          // false
          return true
        }
        return true
      },
      showAdopt () {
        if (this.user.type !== 0) {
          // false
          return true
        }
        return true
      },
      reportOrDelete () {
        if (this.replyOtherInfo) {
          let user = JSON.parse(window.localStorage.getItem('token'))
          console.log(user)
          if (this.replyOtherInfo.replyUserId === user.id || user.type !== 0) {
            return '删除'
          }
        }
        return '举报'
      }
    },
    methods: {
      // 点击头像跳转界面
      toHomepage (userId) {
        this.$router.push({
          name: 'homePage',
          params: {
            userId: userId
          }
        })
      },
      adoptComment (val) {
        if (val) {
          this.commentInfo.adopt = 1
        } else {
          this.commentInfo.adopt = 0
        }
        this.$refs.backheader.$refs.showmore.click()

        this.$http.post('/Interaction/adoptAnswer/' + this.commentInfo.commentId,
          this.$qs.stringify({
            adopt: this.commentInfo.adopt
          })
        ).then((response) => {
          if (response.data.body.data) {
            this.$store.commit('updateFlushDetail', this.commentInfo.questionId)
          }

        })
      },
      changeReport () {
        if (!this.userId) {
          return
        }
        console.log('举报')
        let reportInfo = {}
        reportInfo['reportId'] = this.commentInfo.commentId
        reportInfo['toUserId'] = this.commentInfo.userId
        reportInfo['type'] = 2
        // 跳转举报页面
        this.$refs.backheader.$refs.showmore.click()
        this.$router.push({
          name: 'report',
          params: {
            reportInfo: reportInfo
          }
        })
      },
      // 删除评论
      deleteProblem () {
        console.log('删除评论')
        this.$createDialog({
          type: 'confirm',
          icon: 'cubeic-alert',
          title: '确认删除该回答',
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

            this.$http.post('/commentInfo/comment/id',
              this.$qs.stringify({
                commentId: this.commentInfo.commentId
              }),
              { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
            ).then((res) => {
              if (res.data.body.data) {
                this.showToast('删除成功!')
                // 需要全部更新列表
                this.$store.commit('updateFlushDetail', this.commentInfo.questionId)
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
      replyComment () {
        this.$refs.replyInput.focus()
        this.focusStatus = true
        this.replyOtherInfo = null
        this.placeholder = '请输入你的回复内容'
      },
      // 点击回复item
      clickReply (item) {
        console.log(item)
        this.replyOtherInfo = item

        this.dialog = this.$createDialog({
          type: 'alert',
          showClose: false,
          confirmBtn: {
            text: '取消',
            active: false,
            disabled: false,
            href: 'javascript:;'
          },
          onConfirm: (e) => {
            this.replyOtherInfo = null
          }
        }, (createElement) => {
          return [
            createElement('div', {
              'class': {
                'my-title': true
              },
              on: {
                click: this.clickReport
              },
              slot: 'title'
            }, this.reportOrDelete),
            createElement('div', {
              'class': {
                'my-content': true,
                'border-top-1px': true
              },
              on: {
                click: this.replyOther
              },
              slot: 'title'
            }, '回复')
          ]
        }).show()
      },
      // 点击举报
      clickReport () {
        if (this.dialog) {
          this.dialog.hide()
        }
        if (this.reportOrDelete === '举报') {
          let reportInfo = {}
          reportInfo['reportId'] = this.replyOtherInfo.replyId
          reportInfo['toUserId'] = this.replyOtherInfo.replyUserId
          reportInfo['type'] = 3
          // 跳转举报页面
          this.$router.push({
            name: 'report',
            params: {
              reportInfo: reportInfo
            }
          })
          this.replyOtherInfo = null
        } else {
          this.$createDialog({
            type: 'confirm',
            icon: 'cubeic-alert',
            title: '确认删除该回复',
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
              this.$http.delete('/Interaction/reply',
                {
                  params: {
                    replyId: this.replyOtherInfo.replyId
                  }
                }
              ).then((res) => {
                if (res.data.body.data) {
                  this.showToast('删除成功!')
                  // 需要全部更新列表
                  this.needClear = false
                  this.getData()
                } else {
                  this.showToast('删除失败!')
                }
              }).catch((error) => {
                console.log(error)
                this.showToast('删除异常!')
              })
            },
            onCancel: () => {

            }
          }).show()
        }
      },
      // 点击发送信息
      sendReplyClick () {
        this.sendInfo()
      },
      // 回复别人
      replyOther () {
        this.$refs.replyInput.focus()
        if (this.replyOtherInfo) {
          this.placeholder = '回复: ' + this.replyOtherInfo.replyUsername
        }
        if (this.dialog) {
          this.dialog.hide()
        }
      },
      // enter触发回复按钮
      sendReply () {
        event.preventDefault() // 禁止默认事件（默认是换行）
        this.sendInfo()
      },
      back () {
        this.$router.go(-1)
      },
      // 点赞按钮

      goodComment () {
        if (this.hasLiked) {
          this.commentInfo.awesome--
        } else {
          this.commentInfo.awesome++
        }

        this.hasLiked = !this.hasLiked
        this.$http.post('/Interaction/awesome',
          this.$qs.stringify({
            commentId: this.commentInfo.commentId
          })
          ,
          { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
        ).then((response) => {
          console.log(response)
        }).catch((error) => {
          console.log(error)
        })
      },
      onPullingUp () {
        if (this.replayInfo.length > 0 && this.replayInfo.length % this.size === 0) {
          this.current++
        }
        this.$http.get('/commentInfo/reply/page', {
          params: {
            commentId: this.commentInfo.commentId,
            current: this.current,
            size: this.size
          }
        }).then((response) => {
          let data = response.data.body.data
          if (data.records.length > 0) {
            let temp = this.replayInfo.length % this.size
            this.replayInfo = this.replayInfo.concat(data.records.slice(temp))
          } else {
            this.$refs.commentContainer.forceUpdate()
          }
        }).catch((error) => {
          console.log(error)
        })
      },
      sendInfo () {
        if (this.value.length === 0) {
          return
        }
        // 设置回复信息
        let replyinfo = {}
        replyinfo.commentId = this.commentInfo.commentId
        replyinfo.content = this.value
        if (this.replyOtherInfo) {
          replyinfo.repliedUserId = this.replyOtherInfo.replyUserId
          replyinfo.repliedUsername = this.replyOtherInfo.replyUsername
          this.replyOtherInfo = null
        }

        // 发送
        this.$http.post('/Interaction/reply',
          this.$qs.stringify(replyinfo),
          { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
        ).then((response) => {
          this.needClear = false
          this.getData()
        }).catch((error) => {
          console.log(error)
        })
        // 清空信息
        this.value = ''
      },
      getData () {
        // 通过commentID 获取评论信息
        if (this.needClear) {
          this.commentInfo = {}
          this.replys = []
        }
        this.needClear = true
        this.commentId = this.$route.params.commentId
        this.$http.get('/commentInfo/comment/' + this.commentId, null).then((response) => {
          if (!response.data.body.data.commentInfo) {
            this.showToast('该回答被删除!')
            this.$router.go(-1)
            return
          }
          this.commentInfo = response.data.body.data.commentInfo
          this.replys = response.data.body.data.replys
        }).catch((error) => {
          console.log(error)
        })
      }
    },
    beforeRouteEnter (to, from, next) {
      console.log(from)
      if (from.name === 'problemDetails' || from.name === 'mainApp') {
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
      // 设置滑动高度
      this.clientHeight = `${document.documentElement.clientHeight}`
      this.$refs.commentContainer.$refs.wrapper.style.height = this.clientHeight - 81 + 'px'
      this.getData()
    }
  }
</script>

<style lang='stylus' rel='stylesheet/stylus'>
  .cube-dialog-content-def, .cube-dialog-content
    margin 0

  .cube-dialog-title + .cube-dialog-content
    margin 0

  .my-content

    height 50px
    line-height 50px
    color: #999
    background-color: #fff
    margin-top 0

  .my-title
    height 50px
    line-height 50px
    color: #999
    background-color: #fff
    background-clip: padding-box;
    box-sizing: border-box;

  .comment-detail
    .chat-header
      display flex
      justify-content space-between
      align-items center
      height 40px
      background-color #007efe
      box-shadow: 1px 2px 4px rgba(0, 0, 0, 0.1)

      .cubeic-back
        display inline-block
        width 40px
        height 30px
        line-height 30px
        font-size 20px
        color white
        text-align center

      .txt
        display inline-block
        padding 20px
        color white

    .comment-content
      .author-info
        position: relative;
        margin 10px
        color: #7A7A7A

        .avatar > img
          border-radius 50%
          margin-right 8px

        .author-name
          display inline-block
          position absolute
          top: 12px
          font-size 14px

        .answer-time
          display inline-block
          position absolute
          top: 30px
          font-size 12px

        .info-left
          position absolute
          right 0
          margin-right 20px
          top 20px

          .icon-caina
            margin-right 20px
            color #64a4fe
            font-size 20px

          .cubeic-good
            &.active
              color #64a4fe

          .comment, .approve
            display inline-block
            width 30px
            text-align center

        .comments
          margin-top 10px
          letter-spacing 1px
          font-size 20px
          color: #444

    .split
      height 10px
      background-color #f4f6f9

    .reply-wrapper
      margin 10px
      position relative
      color #7A7A7A

      .avatar > img
        margin-right 10px
        border-radius 50%

      .reply-content
        .reply-name
          position absolute
          top 10px
          left 50px

        .reply-time
          position absolute
          right 0
          top: 5px

        .reply-content
          color: #363636
          margin-left 50px

    .chat-footer
      box-shadow: 1px 2px 4px rgba(0, 0, 0, 0.5)
      height: 40px
      background-color gray

      .cube-input
        padding-left 6px
        padding-right 6px

        .text
          font-size 20px

      .temp-space
        margin 0 5px

      .cubeic-navigation
        font-size 20px
        margin 0 5px

      .not-send
        color #d1d1d1

      .sending
        color #0a89ff
</style>
