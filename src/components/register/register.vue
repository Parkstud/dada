<template>
  <div class="register">
    <div class="name">
      <img src="../../assets/name1.png" alt="达达问答">
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
      </div>
      <div class="pwd-wrapper">
        <cube-input v-model="pwd" :placeholder="pwdplaceholder" :type="typePwd"
                    :eye="eye"></cube-input>
      </div>
      <div class="register-btn">
        <cube-button @click="register">注册</cube-button>
      </div>
      <div>
        <cube-button @click="backLogin">返回登录</cube-button>
      </div>
    </div>
  </div>
</template>

<script type='text/ecmascript-6'>
  export default {
    name: 'register',
    data () {
      return {
        nickplaceholder: '昵称',
        nick: '',
        phone: '',
        phoneplaceholder: '手机号',
        typePhone: 'number',
        code: '',
        codeplaceholder: '验证码',
        pwd: '',
        pwdplaceholder: '密码',
        typePwd: 'password',
        eye: {
          open: false,
          reverse: false
        }
      }
    }
  }
</script>

<style lang='stylus' rel='stylesheet/stylus'>
  .register
    font-family 'Avenir', Helvetica, Arial, sans-serif
    -webkit-font-smoothing antialiased
    -moz-osx-font-smoothing grayscale
    text-align center
    color #2c3e50
    margin-top 60px

</style>
