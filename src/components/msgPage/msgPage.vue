<template>
  <div class="msg-page">
    <div class="top-wrapper">
      <div class="search-wrapper">
        <span class="cubeic-search"></span>
        <span class="input-wrapper" @click="showSearch">
          <cube-input :placeholder="placeholder" :readonly="readonly"></cube-input>
      </span>

        <span class="submit-wrapper" @click="putQuestion">
          <span class="cubeic-edit"></span>
          <span class="text">提问</span>
      </span>
      </div>
    </div>
    <cube-tab-bar v-model="selectedLabel" :show-slider="showSlider" ref="tabNav">
      <cube-tab v-for="(item, index) in tabs" :icon="item.icon" :label="item.label"
                :key="index">
        {{item.label}}
        <span class="badge"
              v-show="index===0 && msginfo.noticeCount>0">{{ msginfo.noticeCount}}</span>
        <span class="badge" v-show="index===1 && msginfo.newsCount>0">{{ msginfo.newsCount}}</span>
      </cube-tab>
    </cube-tab-bar>
    <cube-tab-panels v-model="selectedLabel">
      <cube-tab-panel :label="tabs[0].label">
        <cube-scroll
          ref="noticeScroll"
          :data="this.tabs[0].content"
          @pulling-up="onPullingUp1"
          @pulling-down="onPullingDown1"
          :options="scrollOptions1">
          <template slot="pulldown" slot-scope="props">
            <div v-if="props.pullDownRefresh"
                 class="cube-pulldown-wrapper"
                 :style="props.pullDownStyle">
              <div v-if="props.beforePullDown"
                   class="before-trigger"
                   :style="{paddingTop: props.bubbleY + 'px'}">
            <span
              :class="{rotate: props.bubbleY > scrollOptions1.pullDownRefresh.threshold - 60}">↓</span>
              </div>
              <div class="after-trigger" v-else>
                <div v-show="props.isPullingDown" class="loading">
                  <cube-loading></cube-loading>
                </div>
                <transition name="success">
                  <div v-show="!props.isPullingDown" class="text-wrapper"><span
                    class="refresh-text">更新成功</span>
                  </div>
                </transition>
              </div>
            </div>
          </template>
          <ul>
            <li class="no-li" v-show="tabs[0].content.length===0">
              <div class="no-notice">没有通知</div>
            </li>
            <li class="tab-panel-li" v-for="(contentItem, index) in tabs[0].content" :key="index">
              <hr class="hr-sty" style="filter: alpha(opacity=100,finishopacity=0,style=2)"
                  color=#fff SIZE=5/>
              <div class="item-panl1"
                   @click="clickNotice(contentItem)" v-longpress="deleteNotice">
                <div class="item-top">
                  <span v-if="contentItem.noticeInfo" class="name"
                        :style="{'color':setChangeColor()}">{{contentItem.noticeInfo.commentUserNickName || ''}}</span>
                  <span class="type">{{contentItem.title}}</span><span class="badge-dot"
                                                                       v-show="contentItem.hasRead===0"></span>
                  <span class="time">{{formatData(contentItem.createTime,1)}}</span>
                </div>
                <div class="item-center" v-if="contentItem.noticeInfo"
                     v-html="contentItem.noticeInfo.commentComments">
                </div>
                <div class="item-bttom">
                  {{contentItem.content}}
                </div>
              </div>
              <hr class="hr-sty" style="filter: alpha(opacity=100,finishopacity=0,style=2)"
                  color=#fff SIZE=5/>
            </li>
          </ul>
        </cube-scroll>
      </cube-tab-panel>
      <cube-tab-panel :label="tabs[1].label">
        <cube-scroll
          ref="newsScroll"
          :options="scrollOptions2"
          @pulling-down="onPullingDown2"
        >
          <template slot="pulldown" slot-scope="props">
            <div v-if="props.pullDownRefresh"
                 class="cube-pulldown-wrapper"
                 :style="props.pullDownStyle">
              <div v-if="props.beforePullDown"
                   class="before-trigger"
                   :style="{paddingTop: props.bubbleY + 'px'}">
            <span
              :class="{rotate: props.bubbleY > scrollOptions2.pullDownRefresh.threshold - 60}">↓</span>
              </div>
              <div class="after-trigger" v-else>
                <div v-show="props.isPullingDown" class="loading">
                  <cube-loading></cube-loading>
                </div>
                <transition name="success">
                  <div v-show="!props.isPullingDown" class="text-wrapper"><span
                    class="refresh-text">更新成功</span>
                  </div>
                </transition>
              </div>
            </div>
          </template>
          <ul>
            <li class="no-li" v-show="tabs[1].personCall.length===0">
              <div class="no-notice">没有私信</div>
            </li>
            <li class="tab-panel-li" v-for="(personItem, index) in tabs[1].personCall"
                :key="index">
              <div class="item-panl2">
                <div class="letter-wrapper">
                  <div class="left">
                    <img :src="imgURL+(personItem.sendUserInfo ? personItem.sendUserInfo.avatar:'')"
                         width="64" height="64">
                  </div>
                  <div class="right" @click="chatWith(personItem)">
                    <div class="right-top">
                      <span class="letter-name">{{personItem.sendUserInfo ? personItem.sendUserInfo.username:''}}</span>
                      <span class="letter-time">{{formatData(personItem.newsList[0].time,1)}}
                        <span class="badge" v-show="computeNewsCount(personItem.newsList)">{{computeNewsCount(personItem.newsList)}}</span>
                      </span>
                    </div>
                    <div class="right-content">
                      <span class="letter-main">{{personItem.newsList[0].msg}}</span>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </cube-scroll>
      </cube-tab-panel>
    </cube-tab-panels>
  </div>
</template>

<script type='text/ecmascript-6'>

  export default {
    name: 'msgPage',
    props: {
      msginfo: {
        type: Object
      }
    },
    data () {
      return {
        // 阻止多次触发
        lastNoticeCount: 0,
        placeholder: '搜索',
        search: 'search',
        readonly: true,
        showSlider: true,
        selectedLabel: this.$store.state.message,
        evTimeStamp: 0, // 阻止多次触发
        // 设置当前current
        current: 1,
        size: 20,
        tabs: [{
          label: '通知',
          content: []
        }, {
          label: '私信',
          personCall: []
        }],
        scrollOptions2: {
          pullDownRefresh: {
            threshold: 60,
            stop: 44
            // stopTime: 1000,
            // txt: '更新成功'
          },
          directionLockThreshold: 0,
          pullUpLoad: false
        },
        scrollOptions1: {
          pullDownRefresh: {
            threshold: 60,
            stop: 44
            // stopTime: 1000,
            // txt: '更新成功'
          },
          directionLockThreshold: 0
        },
        longPress: false,
        // 字体颜色
        colorGroups: ['#fedcbd', '#f47920', '#ef5b9c',
          '#d93a49', '#ae6642', '#6f60aa', '#694d9f',
          '#b76f40', '#dea32c', '#853f04', '#00a6ac']
      }
    },
    methods: {

      deleteNotice () {
        console.log('长按')
        this.longPress = true
      },
      // 聊天界面
      chatWith (item) {
        // 处理多次点击
        let now = new Date()
        if (now - this.evTimeStamp < 100) {
          return
        }
        this.evTimeStamp = now

        this.$store.commit('updateMessage', '私信')

        let itemMsg = item.newsList
        let itemUser = item.sendUserInfo
        let user = JSON.parse(window.localStorage.getItem('token'))
        let k = this.msginfo.newsCount
        for (let i = 0; i < itemMsg.length; i++) {
          if (itemMsg[i].hasRead === 0 && itemMsg[i].receiveUserId === user.id) {
            this.msginfo.newsCount--
          }
        }
        if (k !== this.msginfo.newsCount) {
          this.changeDot()
        }

        this.$router.push({
          name: 'chatPage',
          params: {
            letterUser: itemUser
          }
        })
      },
      showToastTime () {
        const toast = this.$createToast({
          type: 'txt',
          time: 0,
          txt: '该问题已被删除',
          $class: {
            'own-class': true
          }
        })
        toast.show()
        setTimeout(() => {
          toast.hide()
        }, 1000)
      },
      // 点击notice
      clickNotice (item) {
        // 处理多次点击
        let now = new Date()
        if (now - this.evTimeStamp < 100) {
          return
        }
        this.evTimeStamp = now

        if (this.longPress) {
          this.$createDialog({
            type: 'confirm',
            icon: 'cubeic-alert',
            title: '确认删除',
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
              console.log('删除')
              console.log(item.id)
              // 删除通知
              this.$http.delete('/message/notice', {
                params: {
                  sysMessageId: item.id
                }
              }).then((res) => {
                if (res.data.body.data) {
                  this.showToast('删除成功')
                  this.getNoticeInfo()
                  this.changeDot()
                } else {
                  this.showToast('删除失败')
                }
              }).catch((err) => {
                console.log(err)
                this.showToast('删除异常')
              })
            },
            onCancel: () => {
            }
          }).show()
          this.longPress = false
          return
        }

        this.$store.commit('updateMessage', '通知')
        // 判断是已读
        if (item.hasRead === 0) {
          item.hasRead = 1
          this.msginfo.noticeCount--
          this.changeDot()
          // 设置通知已阅
          this.$http.put('/message/notice/read', this.$qs.stringify({
              sysMessageId: item.id
            }
          )).then((res) => {

          }).catch((err) => {
            console.log(err)
          })
        }
        // 跳转界面 阅读评论界面
        if (item.msgType === 2) {
          if (!item.infoId) {
            this.showToast('信息被删除')
            return
          }
          this.$router.push({
              name: 'commentDetail',
              params: {
                commentId: item.infoId
              }
            }
          )
        }
        // 跳转问题界面
        if (item.msgType === 1) {
          if (!item.infoId) {
            this.showToast('信息被删除')
            return
          }
          this.$router.push({
              name: 'problemDetails',
              params: {
                problemId: item.infoId
              }
            }
          )
        }

        // 跳转评论界面
        if (item.msgType === 3) {
          if (!item.infoId) {
            this.showToast('信息被删除')
            return
          }
          this.$router.push({
              name: 'commentDetail',
              params: {
                commentId: item.infoId
              }
            }
          )
        }

        if (item.msgType > 4) {
          this.$createDialog({
            type: 'alert',
            title: item.title,
            content: item.content
          }).show()
        }
      },
      // 修改红点状态
      changeDot () {
        this.$emit('changeDot', this.msginfo)
      },
      // 随机修改的字体颜色
      setChangeColor () {
        let x = Math.round(Math.random() * (this.colorGroups.length - 1))
        return this.colorGroups[x]
      },
      // 提问
      putQuestion () {
        this.$router.push('/putQuestionPage')
      },
      // 打开搜索界面
      showSearch () {
        this.$router.push('/onlySearchPage')
      },
      // 获取通知信息
      onPullingDown1 () {
        this.getNoticeInfo()
        this.changeDot()
      },
      onPullingDown2 () {
        this.getNewsInfo()
        this.changeDot()
      },
      // 上拉
      onPullingUp1 () {
        if (this.tabs[0].content.length === 0) {
          this.$refs.noticeScroll.forceUpdate()
          return
        }
        let url = '/message/notices/page'
        let param = {
          current: this.current,
          size: this.size,
          messageId: this.tabs[0].content[this.tabs[0].content.length - 1].id
        }
        this.$http.get(url, {
          params: param
        }).then((response) => {
          let data = response.data.body.data
          if (data.records.length > 0) {
            this.tabs[0].content = this.tabs[0].content.concat(data.records)
          } else {
            this.$refs.noticeScroll.forceUpdate()
          }
        }).catch((error) => {
          console.log(error)
          this.$refs.noticeScroll.forceUpdate()
        })
      },
      // 获取通知信息
      getNoticeInfo () {
        // 获取通知信息
        let url = '/message/notices/page'
        let param = {
          current: this.current,
          size: this.size
        }
        this.$http.get(url, {
          params: param
        }).then((response) => {
          let data = response.data.body.data
          this.tabs[0].content = data.records
        }).catch((error) => {
          console.log(error)
          this.$refs.noticeScroll.forceUpdate()
        })
      },
      translateType (type) {
        if (type === '1') {
          return '回答了你收藏的问题'
        } else {
          return '回答了你发布的问题'
        }
      },
      getNewsInfo () {
        let url = '/message/news/groups'
        // 获取私信消息
        this.$http.get(url, null).then((response) => {
          if (response.data.body.data) {
            let map = response.data.body.data
            this.tabs[1].personCall = map
            this.$refs.newsScroll.forceUpdate()
          }
        }).catch((error) => {
          console.log(error)
          this.$refs.newsScroll.forceUpdate()
        })
      },
      computeNewsCount (msg) {
        let user = JSON.parse(localStorage.getItem('token'))
        let count = 0
        for (let i = 0; i < msg.length; i++) {
          if (msg[i].hasRead === 0 && msg[i].receiveUserId === user.id) {
            count++
          }
        }
        return count
      }
    },
    watch: {
      '$store.state.flushMsg': function () {
        this.getNewsInfo()
        this.changeDot()
      }
    },
    beforeRouteLeave (to, from, next) {
      // 通知首页更新
      this.lastNoticeCount = this.msginfo.noticeCount
      next()
    },
    // beforeRouteEnter (to, from, next) {
    //   if (from.name === 'putQuestionPage') {
    //     to.meta.isBack = false
    //   }
    //   next()
    // },
    // activated () {
    //   if (!this.$route.meta.isBack) {
    //     this.getData()
    //   }
    //   this.$route.meta.isBack = false
    // },
    activated () {
      if (this.lastNoticeCount !== this.msginfo.noticeCount) {
        this.getNoticeInfo()
      }
    },
    mounted () {
      // 获取浏览器可视区域高度
      this.clientHeight = `${document.documentElement.clientHeight}`
      this.$refs.newsScroll.$refs.wrapper.style.height = this.clientHeight - 117 + 'px'
      this.$refs.noticeScroll.$refs.wrapper.style.height = this.clientHeight - 117 + 'px'
      this.getNewsInfo()
      this.getNoticeInfo()
      this.$nextTick(() => {
        if (this.$store.state.message === '私信') {
          this.$refs.tabNav.$refs.slider.style.width = '50%'
          this.$refs.tabNav.setSliderTransform(document.documentElement.clientWidth / 2)
          this.$refs.tabNav.$refs.slider.style.transition = null
        } else {
          this.$refs.tabNav.$refs.slider.style.width = '50%'
          this.$refs.tabNav.setSliderTransform(0)
          this.$refs.tabNav.$refs.slider.style.transition = null
        }
      })
    }
  }
</script>

<style lang='stylus' rel='stylesheet/stylus'>
  .own-class
    height: 180%;

  .msg-page
    height 100%

    .top-wrapper
      padding 4px
      box-shadow: 0 1px #efefef;
      background-color: #017fff

      .search-wrapper
        background-color #3298fe
        border-radius 8px
        margin 2px
        height: 38px
        display flex
        justify-content space-between
        align-items: center;

        .cubeic-search
          flex 1
          align-self: center;
          display inline-block
          text-align center
          color: #fff

        .input-wrapper
          flex 5

          .cube-input
            background-color #3298fe
            border 0
            padding-right 8px
            color: #a0cfff

            .cube-input-field
              padding 4px

            &:active
              background-color #5fb5ff

          .cube-input::after
            content: none;

        .submit-wrapper
          flex: 2;
          font-size 18px
          color: #fff

          .cubeic-edit
            text-align right
            padding-left 6px
            color: #fff

          .text
            padding-left 6px
            text-align center

    .cube-tab-bar
      height 40px

      .cube-tab
        font-size 18px

        .badge
          position absolute
          top 2px
          font-size 10px
          display inline-block
          background-color #f56c6c
          color: #fff
          height 16px
          text-align center
          line-height 16px
          border-radius: 8px
          padding: 0 4px;
          white-space: nowrap;
          border: 1px solid #fff;

    .cube-tab-panels

      .cube-tab-panel
        height: 100%

        .cube-scroll-wrapper
          height: 600px
          background #f4f6f9

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

          .no-li
            .no-notice
              background-color #f4f6f9
              margin-top 20px
              font-size 20px
              color #dedede
              text-align center

          .tab-panel-li
            box-shadow: #ddd 0 0 5px;
            background-color #fff

            .item-panl1
              .item-top
                .name
                  color: #000
                  font-size 12px
                  margin-left 12px
                  font-weight lighter

                .type
                  color: #aaa
                  margin-left 10px
                  font-size 12px
                  margin-right: 4px

                .badge-dot
                  position absolute
                  display inline-block
                  background-color #f56c6c
                  border-radius 50%
                  height 6px
                  width: 6px;
                  border: 1px solid #fff;

                .time
                  color: #aaa
                  display float
                  float right
                  margin-right 20px
                  font-size 12px

              .item-center
                margin 10px
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap

              .item-bttom
                display -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 2;
                overflow: hidden;
                white-space: normal
                margin 10px
                color: #333

            .item-panl2

              .letter-wrapper
                padding-top 6px
                height 60px
                display flex

                .left
                  img
                    width 42px
                    height 42px
                    border-radius 50%
                    margin-left: 10px

                .right
                  flex 1
                  margin-left 16px

                  .right-top
                    display flex
                    justify-content: space-between;
                    font-size 14px

                    .letter-time
                      margin-right 20px

                      .badge
                        position absolute
                        z-index 20
                        right 20px
                        margin-top 22px
                        font-size 12px
                        display inline-block
                        background-color #f56c6c
                        color: #fff
                        height 18px
                        text-align center
                        line-height 18px
                        border-radius: 10px
                        padding: 0 6px;
                        white-space: nowrap;
                        border: 1px solid #fff;

                  .right-content
                    margin-top 16px
                    width 260px
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap

  .success-enter-active, .success-leave-active
    transition: width .5s

  .success-enter, .success-leave-to
    width: 70%

  .success-enter-to, .success-leave
    width: 100%
</style>
