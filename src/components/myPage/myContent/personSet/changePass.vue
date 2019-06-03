<template>
  <div class="change-pwd">
    <back-header :back-text=backText></back-header>
    <div class="first-wrapper"></div>
    <div class="pwd-wrapper">
      <cube-input v-model="pwd" :placeholder="pwdplaceholder1" :type="typePwd"
      ></cube-input>
    </div>
    <div class="pwd-wrapper">
      <cube-input v-model="newpwd" :placeholder="pwdplaceholder2" :type="typePwd"
      ></cube-input>
    </div>
    <div class="btn-wrapper">
      <cube-button @click="changePwd">修改</cube-button>
    </div>
  </div>

</template>

<script type='text/ecmascript-6'>
  import BackHeader from '../../../common/backHeader'

  export default {
    name: 'changePass',
    data () {
      return {
        pwd: '',
        newpwd: '',
        backText: '设置密码',
        pwdplaceholder1: '原密码',
        pwdplaceholder2: '新密码',
        typePwd: 'password'
      }
    },
    methods: {
      changePwd () {
        if (this.pwd.trim() === '') {
          this.showToastTime('请输入原密码')
          return
        }
        if (this.newpwd.trim() === '') {
          this.showToastTime('请输入新密码')
        }
        this.$http.post('/userAccount/change/web/password', this.$qs.stringify({
          newPass: this.newpwd,
          oldPass: this.pwd
        })).then((response) => {
          if (response.data.head.stateCode !== 200) {
            this.showToastTime(response.data.head.msg)
          } else {
            this.showToastTime('修改成功')
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
    components: { BackHeader }
  }
</script>

<style lang='stylus' rel='stylesheet/stylus'>
  .change-pwd
    height 100%
    background #f4f6f9
    .pwd-wrapper
      width 76%
      margin 0 auto
      margin-bottom 20px

    .first-wrapper
      margin-top 30px

    .btn-wrapper > .cube-btn
      width 76%
      margin 0 auto
      background: #007efe
</style>
