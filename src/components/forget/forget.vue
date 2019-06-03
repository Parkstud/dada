<template>
  <div class="foget">
    <div class="content">
      <div class="name">
        <img src="http://148.70.8.85/group1/M00/00/00/rBsAAlycfLuACLeuAAAQZ_P027g063_big.png"
             alt="达达问答">
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
        <cube-input v-model="newpwd" :placeholder="newpwdplaceholder" :type="typePwd"
                    :eye="eye"></cube-input>
      </div>
      <div class="save-btn">
        <cube-button @click="save">完成</cube-button>
      </div>
      <div>
        <cube-button @click="backLogin" :light="true">返回登录</cube-button>
      </div>
    </div>
  </div>
</template>

<script type='text/ecmascript-6'>
  export default {
    name: 'forget',
    data () {
      return {
        sendActve: false,
        phone: '',
        phoneplaceholder: '手机号',
        typePhone: 'number',
        code: '',
        codeplaceholder: '验证码',
        newpwd: '',
        sendCodeInfo: '发送验证码',
        newpwdplaceholder: '新密码',
        typePwd: 'password',
        totalTime: 60,
        canClick: true,
        eye: {
          open: false,
          reverse: false
        }
      }
    },
    methods: {
      // 保存新密码
      save () {
        if (this.phone.trim() === '') {
          this.showToast('请输入手机号')
          return
        }
        if (this.code.trim() === '') {
          this.showToast('请输入验证码')
          return
        }
        if (this.newpwd.trim() === '') {
          this.showToast('请输入新密码')
          return
        }
        if (!this.checkPhone(this.phone)) {
          return
        }
        if (!this.checkPass(this.newpwd)) {
          return
        }
        let url = '/userAccount/change/password'
        let params = new URLSearchParams()
        params.append('telephone', this.phone)
        params.append('code', this.code)
        params.append('newPassword', this.newpwd)
        this.$http.post(url, params)
          .then((response) => {
            if (response.data.head.stateCode === 200) {
              this.showToast('修改成功')
              this.$router.go(-1)
            } else {
              this.showToast(response.data.head.msg)
            }
          })
      },
      countDown () {
        if (!this.canClick) {
          return
        }
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
  .foget
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
