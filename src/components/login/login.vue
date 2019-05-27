<template>
  <div class="login">
    <div class="name">
      <img src="http://148.70.8.85/group1/M00/00/00/rBsAAlycfLuACLeuAAAQZ_P027g063_big.png"
           alt="达达问答">
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
        phone: '',
        pwd: '',
        phoneplaceholder: '账号',
        pwdplaceholder: '密码',
        typePhone: 'text',
        typePwd: 'password',
        stopLogin: false,
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
        // 登录 toast
        const logintToast = this.$createToast({
          txt: '登录中...',
          time: 0,
          mask: true
        })
        logintToast.show()

        let param = new URLSearchParams()
        param.append('username', this.phone)
        param.append('password', this.pwd)
        let url = '/userAccount/login'
        this.$http.post(url, param)
          .then((response) => {
            logintToast.hide()
            if (response.data.body.data) {
              window.localStorage.setItem('token', JSON.stringify(response.data.body.data))
              this.$router.push('/mainApp')
              this.showToast('登录成功')
            } else {
              if (response.data.head.msg) {
                this.showToast(response.data.head.msg)
              } else {
                this.showToast('登录失败')
              }
            }
          })
          .catch((error) => {
            logintToast.hide()
            this.showToast('登录异常')
            console.log(error)
          })
      }
    },
    activated () {

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
