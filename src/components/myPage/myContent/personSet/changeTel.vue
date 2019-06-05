<template>
  <div class="change-tel">
    <back-header :back-text="backText"></back-header>
    <div class="content">
      <div class="show-first">{{myphone}}</div>
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
      <div class="register-btn">
        <cube-button @click="changeTel">修改</cube-button>
      </div>
    </div>

  </div>
</template>

<script type='text/ecmascript-6'>
  import BackHeader from '../../../common/backHeader'

  export default {
    name: 'changeTel',
    data () {
      return {
        myphone: '',
        code: '',
        phone: '',
        backText: '修改手机号',
        value: true,
        totalTime: 60,
        sendActve: false,
        phoneplaceholder: '手机号',
        codeplaceholder: '验证码',
        sendCodeInfo: '发送验证码',
        typePhone: 'number'
      }
    },
    methods: {
      checkPhone () {
        let phone = this.phone
        if (!(/^(13[0-9]|14[5-9]|15[012356789]|166|17[0-8]|18[0-9]|19[8-9])[0-9]{8}$/.test(phone))) {
          return false
        }
        return true
      },
      sendCode () {
        if (this.phone.trim() === '') {
          this.showToastTime('请输入手机号')
          return
        }
        if (!this.checkPhone()) {
          this.showToastTime('手机号码有误，请重填')
          return
        }
        if (this.sendActve) {
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
      },
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
      // 修改手机号
      changeTel () {
        if (this.phone.trim() === '') {
          this.showToastTime('请输入手机号')
          return
        }
        if (this.code.trim() === '') {
          this.showToastTime('请输入验证码')
        }
        this.$http.post('/userAccount/user/userInformation/telphone', this.$qs.stringify({
          telephone: this.phone,
          code: this.code
        })).then((res) => {
          if (res.data.body.data) {
            this.myphone = res.data.body.data
            this.showToastTime('修改成功!')
          } else {
            this.showToastTime(res.data.head.msg)
          }
        })
      },
      showToastTime (msg) {
        const toast = this.$createToast({
          type: 'txt',
          time: 0,
          txt: msg,
          $class: {
            'own-class': true
          }
        })
        toast.show()
        setTimeout(() => {
          toast.hide()
        }, 1000)
      }
    },
    mounted () {
      // 获取手机号
      this.$http.get('/myPage/user/userInformation', null)
        .then((response) => {
          if (response.data.body.data.telephone) {
            this.myphone = response.data.body.data.telephone
          }
        })
    },
    components: { BackHeader }
  }
</script>

<style lang='stylus' rel='stylesheet/stylus'>
  .change-tel
    height 100%;
    background #f4f6f9;

    .content
      width 80%
      margin 0 auto

    .show-first
      margin-top 20px
      text-align center
      margin-bottom 20px
      font-size 24px

    .phone-wrapper, .vai-wrapper
      margin-bottom 20px

    .register-btn > .cube-btn
      background #007efe

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
