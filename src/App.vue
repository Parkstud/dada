<template>
  <div id="app">
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
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
        }
      }
    },
    method: {
      // 请求用户的信息
      getUserInfo () {
        // 测试
        this.userInfo = {
          nick: '陈苗',
          uid: '1',
          portrait: 'profile.png'
        }

        // 实例开发中这里会向服务端请求数据
        // 如下(用了vue-resource):
        // ts.$http.get(url, {
        //   //参数
        //   "params":{}
        // }).then((response) => {
        //   //Success
        // }, (response) => {
        //   //Error
        // });

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

</style>
