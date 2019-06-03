<template>
  <div class="register">
    <div class="name">
      <img src="http://148.70.8.85/group1/M00/00/00/rBsAAlycfLuACLeuAAAQZ_P027g063_big.png"
           alt="达达问答">
    </div>
    <div class="content">
      <div class="nick-wrapper">
        <cube-input v-model="nick" :placeholder="nickplaceholder" :autofocus="true">
        </cube-input>
      </div>
      <div class="phone-wrapper">
        <cube-input v-model="phone" :placeholder="phoneplaceholder" :autofocus="true"
                    :type="typePhone"></cube-input>
      </div>
      <div class="vai-wrapper">
        <cube-input v-model="code" :placeholder="codeplaceholder" :autofocus="true"
                    :type="typePhone"></cube-input>
        <span class="send-code" :class="[sendActve ? 'send-active': 'send-not-active']"
              @click="sendCode">{{sendCodeInfo}}</span>
      </div>
      <div class="pwd-wrapper">
        <cube-input v-model="pwd" :placeholder="pwdplaceholder" :type="typePwd"
                    :eye="eye"></cube-input>
      </div>
      <div class="register-btn">
        <cube-button @click="register">注册</cube-button>
      </div>
      <div>
        <cube-button @click="backLogin" :light="true">返回登录</cube-button>
      </div>
    </div>
  </div>
</template>

<script type='text/ecmascript-6'>
  export default {
    name: 'register',
    data () {
      return {
        sendActve: false,
        nickplaceholder: '昵称',
        sendCodeInfo: '发送验证码',
        totalTime: 60,
        nick: '',
        phone: '',
        phoneplaceholder: '手机号',
        typePhone: 'number',
        code: '',
        codeplaceholder: '验证码',
        pwd: '',
        pwdplaceholder: '6-12位 密码',
        typePwd: 'password',
        eye: {
          open: false,
          reverse: false
        }
      }
    },
    methods: {
      countDown () {
        this.sendCodeInfo = this.totalTime + 's后重新发送'
        let clock = window.setInterval(() => {
          this.totalTime--
          this.sendCodeInfo = this.totalTime + 's后重新发送'
          if (this.totalTime < 0) {
            window.clearInterval(clock)
            this.sendCodeInfo = '重新发送验证码'
            this.totalTime = 60
            this.sendActve = false
          }
        }, 1000)
      },
      // 检查手机号
      checkPhone (myphone) {
        // 手机号码校验规则
        let validRule = /^(13[0-9]|14[5-9]|15[012356789]|166|17[0-8]|18[0-9]|19[8-9])[0-9]{8}$/
        if (!validRule.test(myphone)) {
          this.showToast('手机号码格式有误！')
          return false
        }
        return true
      },
      // 检查密码
      checkPass (pass) {
        let reg = /^[\w]{6,12}$/
        if (!reg.test(pass)) {
          this.showToast('密码格式有误！请输入6-12位密码')
          return false
        }
        return true
      },
      register () {
        if (this.nick.trim() === '') {
          this.showToast('请输入昵称')
          return
        }
        if (this.phone.trim() === '') {
          this.showToast('请输入手机号')
          return
        }
        if (this.code.trim() === '') {
          this.showToast('请输入验证码')
          return
        }
        if (this.pwd.trim() === '') {
          this.showToast('请输入密码')
          return
        }

        if (!this.checkPhone(this.phone)) {
          return
        }
        if (!this.checkPass(this.pwd)) {
          return
        }

        let param = new URLSearchParams()
        param.append('telephone', this.phone)
        param.append('username', this.nick)
        param.append('password', this.pwd)
        param.append('code', this.code)

        let url = '/userAccount/register'
        this.$http.post(url, param)
          .then((response) => {
            if (response.data.head.stateCode === 200) {
              this.showToast('注册成功')
              this.$router.push('/login')
            } else {
              this.showToast(response.data.head.msg)
            }
          }).catch((error) => {
          console.log(error)
          this.showToast('注册异常')
        })
      },
      backLogin () {
        this.$router.push('/login')
      },
      // 发送验证码
      sendCode () {
        if (this.sendActve) {
          return
        }
        if (!this.checkPhone(this.phone)) {
          return
        }
        this.sendActve = true
        // 发送验证码
        let param = new URLSearchParams()
        param.append('phone', this.phone)
        let url = '/userAccount/code'
        this.$http.post(url, param)
          .then((response) => {
          }).catch((error) => {
          console.log(error)
        })
        this.countDown()
      }

    }
  }
</script>

<style lang='stylus' rel='stylesheet/stylus'>
  .register
    -webkit-font-smoothing antialiased
    -moz-osx-font-smoothing grayscale
    text-align center
    color #2c3e50
    margin-top 60px

    .content
      width 80%
      margin 0 auto

      .nick-wrapper, .phone-wrapper, .vai-wrapper, .pwd-wrapper, .register-btn
        margin-bottom 20px

      .vai-wrapper
        position relative

        .send-active
          color: gray
          font-size 14px

        .send-not-active
          color: #6cc6ff

        .send-code
          display inline-block
          position absolute
          top: 5px
          right 8px
          height 25px
          padding 5px 8px 0 8px
          border-left 1px solid #E6E6E6
          letter-spacing: 1px

</style>
