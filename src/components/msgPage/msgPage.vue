<template>
  <div class="msg-page">
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
    <cube-tab-bar v-model="selectedLabel" :show-slider="showSlider"  ref="tabNav">
      <cube-tab v-for="(item, index) in tabs" :icon="item.icon" :label="item.label"
                :key="index">
      </cube-tab>
    </cube-tab-bar>
    <cube-tab-panels v-model="selectedLabel">
      <cube-tab-panel :label="tabs[0].label">
        <cube-scroll
          ref="panelContatiner"
          @pulling-up="onPullingUp"
          :options="scrollOptions">
          <ul>
            <li class="tab-panel-li" v-for="(contentItem, index) in tabs[0].content" :key="index">
              <hr class="hr-sty" style="filter: alpha(opacity=100,finishopacity=0,style=2)"
                  color=#fff SIZE=5/>
              <div class="item-panl1">
                <div class="item-top">
                  <span class="name">{{contentItem.user}}</span>
                  <span class="type">{{translateType(contentItem.type)}}</span>
                  <span class="time">{{contentItem.time}}</span>
                </div>
                <div class="item-center">
                  {{contentItem.answers}}
                </div>
                <div class="item-bttom">
                  {{contentItem.question}}
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
          ref="notice"
          @pulling-up="onPullingUp"
          :options="scrollOptions">
          <ul>

            <li class="tab-panel-li" v-for="(personItem, index) in tabs[1].personCall"
                :key="index">
              <hr class="hr-sty" style="filter: alpha(opacity=100,finishopacity=0,style=2)"
                  color=#fff SIZE=5/>
              <div class="item-panl2">
                <div class="letter-wrapper">
                  <div class="left">
                    <img :src="personItem.avatar" width="64" height="64">
                  </div>
                  <div class="right" @click="chatWith">
                    <div class="right-top">
                      <span class="letter-name">{{personItem.name}}</span>
                      <span class="letter-time">{{personItem.time}}</span>
                    </div>
                    <div class="right-content">
                      <span class="letter-main">{{personItem.content}}</span>
                    </div>
                  </div>
                </div>
              </div>
              <hr class="hr-sty" style="filter: alpha(opacity=100,finishopacity=0,style=2)"
                  color=#fff SIZE=5/>
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
    data () {
      return {
        placeholder: '搜索',
        search: 'search',
        readonly: true,
        showSlider: true,
        // selectedLabel: this.$store.state.message,
        selectedLabel: '私信',
        tabs: [{
          label: '通知',
          content: [
            {
              questionid: 'asdasd',
              user: '陈苗',
              time: '03-12 17:55',
              type: '1',
              answers: '回答的信息',
              question: '问题信息'
            }, {
              questionid: 'asdasd',
              user: '陈苗',
              answers: '回答的信息',
              time: '03-12 17:55',
              question: '问题信息',
              type: '1'
            }, {
              questionid: 'asdasd',
              user: '陈苗',
              answers: '回答的信息',
              type: '1',
              time: '03-12 17:55',
              question: '问题信息'
            }, {
              questionid: 'asdasd',
              user: '陈苗',
              answers: '回答的信息',
              type: '1',
              time: '03-12 17:55',
              question: '问题信息'
            }, {
              questionid: 'asdasd',
              user: '陈苗',
              answers: '回答的信息',
              time: '03-12 17:55',
              question: '问题信息',
              type: '1'
            }, {
              questionid: 'asdasd',
              user: '陈苗',
              answers: '回答的信息',
              type: '1',
              time: '03-12 17:55',
              question: '问题信息'
            }, {
              questionid: 'asdasd',
              user: '陈苗',
              answers: '回答的信息',
              type: '1',
              time: '03-12 17:55',
              question: '问题信息'
            }, {
              questionid: 'asdasd',
              user: '陈苗',
              answers: '回答的信息',
              time: '03-12 17:55',
              question: '问题信息',
              type: '1'
            }, {
              questionid: 'asdasd',
              user: '陈苗',
              answers: '回答的信息',
              type: '1',
              time: '03-12 17:55',
              question: '问题信息'
            }, {
              questionid: 'asdasd',
              user: '陈苗',
              answers: '回答的信息',
              type: '1',
              time: '03-12 17:55',
              question: '问题信息'
            }, {
              questionid: 'asdasd',
              user: '陈苗',
              answers: '回答的信息',
              time: '03-12 17:55',
              question: '问题信息',
              type: '1'
            }, {
              questionid: 'asdasd',
              user: '陈苗',
              answers: '回答的信息',
              type: '1',
              time: '03-12 17:55',
              question: '问题信息'
            }, {
              questionid: 'asdasd',
              user: '陈苗',
              answers: '回答的信息',
              type: '1',
              time: '03-12 17:55',
              question: '问题信息'
            }
          ]
        }, {
          label: '私信',
          personCall: [
            {
              avatar: './avatar.jpg',
              name: 'asadasd',
              content: '内容',
              time: '刚刚'
            }, {
              avatar: './avatar.jpg',
              name: 'asadasd',
              content: '内容',
              time: '刚刚'
            }, {
              avatar: './avatar.jpg',
              name: 'asadasd',
              content: '内容',
              time: '刚刚'
            }
          ]
        }],
        scrollOptions: {
          pullUpLoad: true,
          directionLockThreshold: 0
        }
      }
    },
    methods: {
      // 聊天界面
      chatWith () {
        this.$store.commit('updateCount', 2)
        this.$store.commit('updateMessage', '私信')
        this.$router.push('/chatPage')
      },
      // 提问
      putQuestion () {
        this.$router.push('/putQuestionPage')
      },
      // 打开搜索界面
      showSearch () {
        this.$router.push('/onlySearchPage')
      },
      // 上拉
      onPullingUp () {
        console.log('asdasd')
        setTimeout(() => {
          // 如果没有新数据
          this.$refs.panelContatiner.forceUpdate()
        }, 500)
      },
      translateType (type) {
        if (type === '1') {
          return '回答了你收藏的问题'
        } else {
          return '回答了你发布的问题'
        }
      }
    },
    mounted () {
      // 获取浏览器可视区域高度
      this.clientHeight = `${document.documentElement.clientHeight}`
      this.$refs.panelContatiner.$refs.wrapper.style.height = this.clientHeight - 117 + 'px'
    }
  }
</script>

<style lang='stylus' rel='stylesheet/stylus'>
  .msg-page
    height 100%

    .search-wrapper
      background-color #f1f1f1
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

      .input-wrapper
        flex 5

        .cube-input
          background-color #f1f1f1
          border 0
          padding-right 8px

          .cube-input-field
            padding 0

          &:active
            background-color #f5f5f5

        .cube-input::after
          content: none;

      .submit-wrapper
        flex: 2;

        .cubeic-edit
          text-align right
          padding-left 6px
          border-left 1px solid gray

        .text
          padding-left 6px
          text-align center

    .cube-tab-panels

      .cube-tab-panel
        height: 100%

        .cube-scroll-wrapper
          height: 600px

          .tab-panel-li
            margin-left 10px
            margin-right 10px
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
                  margin-left 10px
                  font-size 12px

                .time
                  display float
                  float right
                  margin-right 20px
                  font-size 12px

              .item-center
                margin 10px

              .item-bttom
                margin 10px

            .item-panl2
              .letter-wrapper
                display flex

                .left
                  img
                    width 40px
                    height 40px
                    border-radius 50%

                .right
                  flex 1
                  margin-left 16px

                  .right-top
                    display flex
                    justify-content: space-between;
                    font-size 14px

                    .letter-time
                      margin-right 20px

                  .right-content
                    margin-top 10px

    .cube-tab-bar-slider
      width 50%
</style>
