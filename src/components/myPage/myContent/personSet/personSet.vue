<template>
  <div class="person-set">
    <back-header :backText="backText"></back-header>
    <div class="tip-info">
      通用设置
    </div>
    <ul class="ulshow">
      <li class="line_border" @click="editPersonInfo">编辑个人资料</li>
      <li class="line_border" @click="changPwd">修改密码</li>
      <li class="line_border" @click="changeTel">修改手机号</li>
    </ul>
    <div class="tip-info">
      其他
    </div>
    <ul>
      <li class="line_border" @click="about">关于达达</li>
      <li class="line_border" @click="logout">退出登录</li>
    </ul>
  </div>
</template>

<script type='text/ecmascript-6'>
  import BackHeader from '../../../common/backHeader'

  export default {
    name: 'personSet',
    data () {
      return {
        backText: '设置',
        value: true
      }
    },
    methods: {
      about () {
        this.$router.push('/aboutdada')
      },
      changeTel () {
        this.$router.push('/changeTel')
      },
      // 修改密码
      changPwd () {
        this.$router.push('/changePass')
      },
      // 编辑个人资料
      editPersonInfo () {
        this.$router.push('/editPersonalInformation')
      },
      // 退出登录
      logout () {
        this.$createDialog({
          type: 'alert',
          icon: 'cubeic-alert',
          showClose: true,
          title: '确认退出?',
          confirmBtn: {
            text: '确定',
            active: true,
            disabled: false,
            href: 'javascript:;'
          },
          onConfirm: () => {
            // 删除cookie 跳转登录页
            window.localStorage.setItem('token', '')
            location.reload()
            this.$router.push('/login')
          }

        }).show()
      }
    },
    components: { BackHeader }
  }
</script>

<style lang='stylus' rel='stylesheet/stylus'>
  .person-set
    .tip-info
      display flex
      align-items center
      padding-left 18px
      background-color #fbfcfc
      color: #007efe
      font-size 14px
      height 32px
      border-bottom 1px solid #e2e2e2
      border-top 1px solid #e2e2e2

    .push-info-wrapper
      position relative
      height 40px
      display flex
      align-items center

      .text
        position absolute
        left 20px

      .cube-switch
        margin-left 80%

    ul
      li
        display flex
        align-items center
        height 40px
        padding-left 20px

        &:active
          background-color #e2e2e2

        &.line_border
          border-bottom 1px solid #e2e2e2
</style>
