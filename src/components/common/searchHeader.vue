<template>
  <div class="search-header">
    <div class="search-wrapper" @click="showSearch">
      <span class="ic-wrapper">
         <span class="cubeic-search"></span>
      </span>
      <cube-input :type="search" :readonly=true :clearable="clearable"
                  :placeholder="searchText"
      ></cube-input>
    </div>

    <transition name="fold">
      <div class="search-page" v-show="show">
        <div class="out-wrapper">
          <span class="ic-wrapper" @click="backLast">
             <span class="cubeic-back"></span>
          </span>
          <span class="submit" @click="submitProblem">
              发布
          </span>
        </div>
        <div class="inner-wrapper">

          <cube-textarea :clearable="clearable" :maxlength="maxlength"
                         :placeholder="searchText"
                         indicator="indicator">
          </cube-textarea>
        </div>
      </div>
    </transition>

  </div>
</template>

<script type='text/ecmascript-6'>

  export default {
    name: 'searchHeader',
    data () {
      return {
        searchText: '提问',
        search: 'search',
        clearable: {
          visible: true,
          blurHidden: true
        },
        maxlength: 1000,
        show: false,
        indicator: {
          negative: true,
          remain: true
        }
      }
    },
    methods: {
      submitProblem () {
        this.$router.push('/quesion')
      },
      showSearch () {
        this.show = true
      },
      backLast () {
        this.show = false
      },
      keySearch () {
        this.show = false
      }
    }
  }
</script>

<style lang='stylus' rel='stylesheet/stylus'>
  .search-header
    width 100%
    .search-wrapper
      position: relative
      border-radius 20px

      .ic-wrapper
        position absolute
        z-index 1
        bottom 12px

      & input
        padding-left 20px
        border-radius 5px

      .cube-input
        border-radius 5px

      & .cube-input-field
        background-color #fafafa

    .search-page
      position absolute
      bottom 0
      z-index 999
      width 25%
      height 100%
      transform translate3d(0, 0, 0);

      &.fold-enter-active, &.fold-leave-active
        transition: all 0.4s ease-in-out
        transform translate3d(0, 0, 0)

      &.fold-enter, &.fold-leave-to
        transform translate3d(0, 100%, 0)

      .out-wrapper
        position relative
        height 40px
        background-color #e2e2e2

        .submit
          position absolute
          display inline-block
          top: 10px
          right 10px
          z-index: 21

        .ic-wrapper
          position absolute
          display inline-block
          top: 10px
          left 10px
          font-size 20px
          z-index: 21
          width 30px

      .inner-wrapper
        margin 0 auto
        width 100%
        background-color #fff
        height 100%

        .cube-textarea-wrapper
          height 100%

</style>
