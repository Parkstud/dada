<template>
  <div class="login">
    <div class="name">
      <img src="../../assets/name1.png" alt="达达问答">
    </div>
    <div class="content-wrapper">
      <div class="phone-wrapper">
        <cube-input v-model="phone" :placeholder="phoneplaceholder" :autofocus="true"
                    :type="typePhone"></cube-input>
      </div>
      <div class="pwd-wrapper">
        <cube-input v-model="pwd" :placeholder="pwdplaceholder" :type="typePwd"
                    :eye="eye"></cube-input>
      </div>
      <div class="btn-wrapper">
        <cube-button @click="loginVai">登录</cube-button>
      </div>
      <div class="text-wrapper">
        <span class="forget">
          <router-link to="/forgetPwd">忘记密码</router-link>
        </span>
        <span class="registered">
          <router-link to="/register">注册账号 </router-link>
        </span>

      </div>
    </div>
  </div>

</template>

<script type='text/ecmascript-6'>
  export default {
    name: 'login',
    data () {
      return {
        isLoging: false,
        phone: '',
        pwd: '',
        phoneplaceholder: '手机号',
        pwdplaceholder: '密码',
        typePhone: 'number',
        typePwd: 'password',
        eye: {
          open: false,
          reverse: false
        }
      }
    },
    methods: {
      // 登录验证 :type="typePwd"

      loginVai () {
        if (this.phone !== '' && this.pwd !== '') {
          this.toLogin()
        }
      },
      // 登录请求
      toLogin () {
        // 请求参数
        // let loginParam = {
        //   phone: this.phone,
        //   pwd: this.pwd
        // }
        // 请求后端,比如:
        // this.$http.post( 'example.com/login.php', {
        //   param: loginParam).then((response) => {
        //   if(response.data.code == 1){
        //     let expireDays = 1000 * 60 * 60 * 24 * 15;
        //     this.setCookie('session', response.data.session, expireDays);
        //     //登录成功后
        //     this.$router.push('/user_info');
        //   }
        // }, (response) => {
        //   //Error
        // });

        // 设置登录状态
        this.isLoging = true

        setTimeout(() => {
          // 登录状态15天后过期
          let expireDays = 1000 * 60 * 60 * 24 * 15
          this.setCookie('session', 'blablablablabla...', expireDays)
          // 登录成功后
          this.$router.push('/mainApp')
        }, 1000)
      }

    }
  }
</script>

<style lang='stylus' rel='stylesheet/stylus'>
  .login
    font-family 'Avenir', Helvetica, Arial, sans-serif
    -webkit-font-smoothing antialiased
    -moz-osx-font-smoothing grayscale
    text-align center
    color #2c3e50
    margin-top 60px

    .name
      margin-bottom 60px

    .content-wrapper
      width 76%
      margin 0 auto

      .phone-wrapper, .pwd-wrapper, .btn-wrapper
        margin-bottom 20px

      .text-wrapper
        position relative
        color: #93999f;

        .forget
          display inline-block
          position absolute
          left 0
          top 0

        .registered
          display inline-block
          position absolute
          right 0
          top 0

</style>
