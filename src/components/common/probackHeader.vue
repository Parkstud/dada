<template>
  <div class="back-header">
      <span class="cubeic-back" @click="back">
      </span>
    <i class="cubeic-more" ref="showmore" v-show="showMore" @click="showMoreAction"></i>
    <transition name="fade">
      <div class="moreAction" v-show="show">
        <ul>
          <li @click="collect" v-show="showCollect">
            <i class="cubeic-star" :class="{'cubeic-star-collect':hasCollection}"></i>
            <span>{{collectText}}</span>
          </li>
          <li @click="reportProblem" v-show="showReport">
            <i class="cubeic-danger"></i>
            <span>举报</span>
          </li>
          <li @click="deleteProblem" v-show="showDelete">
            <i class="cubeic-delete"></i>
            <span>删除</span>
          </li>
          <li @click="adoptComment" v-show="showAdopt">
            <i class="iconfont icon-caina" :class="{'cubeic-star-collect':hasAdopt}"></i>
            <span>{{adoptText}}</span>
          </li>
        </ul>
      </div>
    </transition>
    <span class="text">
        {{backText}}
      </span>
  </div>
</template>

<script type='text/ecmascript-6'>
  // 返回上个界面
  const BACK_FLAG = -1
  export default {
    name: 'backHeader',
    data () {
      return {
        show: false
      }
    },
    props: {
      showReport: {
        type: Boolean,
        default: true
      },
      showCollect: {
        type: Boolean,
        default: true
      },
      showAdopt: {
        type: Boolean,
        default: false
      },
      backText: {
        type: String
      },
      hasCollection: {
        type: Boolean,
        default: false
      },
      hasAdopt: {
        type: Boolean,
        default: false
      },
      backComponent: {
        type: String,
        default: ''
      },
      showMore: {
        type: Boolean,
        default: true
      },
      intoParams: {
        type: Object
      }
    },
    computed: {
      adoptText () {
        if (this.hasAdopt) {
          return '已采纳'
        }
        return '采纳'
      },
      collectText () {
        if (this.hasCollection) {
          return '已收藏'
        }
        return '收藏'
      },
      showDelete () {
        let userAccount = JSON.parse(window.localStorage.getItem('token'))
        if (userAccount.type === 1 || userAccount.id) {
          return true
        }
        return false
      }
    },
    // activated () {
    //   if (this.$router.currentRoute.name === 'commentDetail') {
    //     this.showAdopt = true
    //   }
    // },
    methods: {
      reportProblem () {
        this.$emit('changeReport')
      },
      adoptComment () {
        this.$emit('adoptComment', !this.hasAdopt)
        console.log('采纳')
      },
      // 删除问题
      deleteProblem () {
        this.$emit('deleteProblem')
      },
      back () {
        if (this.backComponent === '') {
          this.$router.go(BACK_FLAG)
        } else {
          if (this.intoParams) {
            this.$router.push({
                name: this.backComponent,
                params: this.intoParams
              }
            )
          } else {
            this.$router.push(this.backComponent)
          }
        }
      },
      showMoreAction () {
        this.show = !this.show
      },
      collect () {
        this.$emit('changeHasCollection', !this.hasCollection)
        this.show = false
      }
    }
  }
</script>

<style lang='stylus' rel='stylesheet/stylus'>
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
      width 100px
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
        left: 55px;

</style>
