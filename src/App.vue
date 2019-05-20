<template>
  <div id="app">
    <transition name="fade1" mode="out-in">
      <keep-alive>
        <router-view v-if="$route.meta.keepAlive"></router-view>
      </keep-alive>
    </transition>
    <transition name="fade2" mode="out-in">
      <router-view v-if="!$route.meta.keepAlive"></router-view>
    </transition>
  </div>
</template>

<script>
  export default {
    name: 'app',
    data () {
      return {
        isLogin: false,
        userInfo: {
          nick: null,
          uid: null,
          portrait: null
        },
        transitionName: ''
      }
    },
    methods: {
      // 请求用户的信息
      getUserInfo () {
        // 测试
        this.userInfo = {
          nick: '陈苗',
          uid: '1',
          portrait: 'profile.png'
        }
        // 提交mutation到Store
        this.$store.commit('updateUserInfo', this.userInfo)
      },
      mounted () {
        // 组件开始挂载时获取用户信息
        this.getUserInfo()
      }
    }
  }
</script>
<style lang="stylus">
  #app
    .fade1-enter-active, .fade1-leave-active {
      transition: opacity .2s;
    }

    .fade1-enter, .fade1-leave-to {
      opacity: 0;
    }

    .fade2-enter-active, .fade2-leave-active {
      transition: opacity .2s;
    }

    .fade2-enter, .fade2-leave-to {
      opacity: 0;
    }
</style>
