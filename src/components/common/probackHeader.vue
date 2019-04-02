<template>
  <div class="back-header">
      <span class="cubeic-back" @click="back">
      </span>
    <i class="cubeic-more" @click="showMoreAction"></i>
    <transition name="fade">
      <div class="moreAction" v-show="show">
        <ul>
          <li @click="collect">
            <i class="cubeic-star" :class="{'cubeic-star-collect':collectProblem}"></i>
            <span>{{collectText}}</span>
          </li>
          <li>
            <i class="cubeic-danger"></i>
            <span>举报</span>
          </li>
          <li>
            <i class="cubeic-edit"></i>
            <span>纠错</span>
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
        show: false,
        collectProblem: false
      }
    },
    props: {
      backText: {
        type: String
      }
    },
    computed: {
      collectText () {

        if (this.collectProblem) {
          return '已收藏'
        }
        return '收藏'
      }
    },
    methods: {
      back () {
        this.$router.go(BACK_FLAG)
      },
      showMoreAction () {
        console.log(this.show)
        this.show = !this.show
      },
      collect () {
        this.collectProblem = !this.collectProblem
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
