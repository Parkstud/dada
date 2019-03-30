<template>
  <div class="person-set">
    <back-header :backText="backText"></back-header>
    <div class="tip-info">
      <span>消息推送</span>
    </div>

    <div class="push-info-wrapper">
      <span class="text">允许消息推送</span>
      <cube-switch v-model="value">
      </cube-switch>
    </div>

    <div class="tip-info">
      通用设置
    </div>
    <ul class="ulshow">
      <li class="line_border">编辑个人资料</li>
      <li class="line_border">修改密码</li>
      <li class="line_border">更换手机用户</li>
      <li>黑名单设置</li>
    </ul>
    <div class="tip-info">
      其他
    </div>
    <ul>
      <li class="line_border">关于达达</li>
      <li class="line_border">清除缓存</li>
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
      color: #e58c7c
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
