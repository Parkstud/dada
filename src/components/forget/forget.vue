<template>
  <div class="foget">
    <div class="content">
      <div class="name">
        <img src="../../assets/name1.png" alt="达达问答">
      </div>
      <div class="phone-wrapper">
        <cube-input v-model="phone" :placeholder="phoneplaceholder" :autofocus="true"
                    :type="typePhone"></cube-input>
      </div>
      <div class="vai-wrapper">
        <cube-input v-model="code" :placeholder="codeplaceholder" :autofocus="true"
                    :type="typePhone"></cube-input>
        <span class="send-code" @click="sendCode">发送验证码</span>
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
        phone: '',
        phoneplaceholder: '手机号',
        typePhone: 'number',
        code: '',
        codeplaceholder: '验证码',
        newpwd: '',
        newpwdplaceholder: '新密码',
        typePwd: 'password',
        eye: {
          open: false,
          reverse: false
        }
      }
    },
    methods: {
      save () {

      },
      backLogin () {
        this.$router.push('/login')
      },
      sendCode () {

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

        .send-code
          display inline-block
          position absolute
          top: 5px
          right 8px
          height 25px
          padding 5px 8px 0 8px
          border-left 1px solid #E6E6E6

          &:active
            background #FC9153
            color: #fff
</style>
