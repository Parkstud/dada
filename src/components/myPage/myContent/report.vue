<template>
  <div class="report">
    <back-header :backText="backText"
                 :show-more="false"></back-header>
    <div class="content">
      <!--举报类型-->
      <div class="report-type-wrapper">
        <span>举报类型</span>
        <span>{{typeArray[type]}}</span>
      </div>
      <!--举报原因-->
      <div class="report-reason-wrapper">
        <div class="title">举报原因</div>
        <ul class="reason-wrapper">
          <li v-for="(item,index) in reportType" :key="index" @click="selectReason(item)"
              :class="choose===item.id? 'active':''">
            <span>{{item.reportReasonContent}}</span>
          </li>
        </ul>
      </div>
      <!--举报说明-->
      <div class="report-des-wrapper">
        <div class="title">举报说明(可选)</div>
        <div>
          <cube-textarea :autoExpand='true' :placeholder="placeholder" :maxlength="1000"
                         v-model="value"></cube-textarea>
        </div>
        <div class="tip">举报后将由管理员审理</div>
        <div>
          <cube-button :light="true" @click="submitReport">提交</cube-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script type='text/ecmascript-6'>
  import BackHeader from '../../common/probackHeader'

  export default {
    name: 'report',

    data () {
      return {
        // 举报说明
        placeholder: '请输入举报说明',
        value: '',
        commentInfo: this.$route.params.commentInfo,
        reportInfo: this.$route.params.reportInfo,
        backText: '举报',
        type: this.$route.params.type,
        typeArray: ['用户', '问题', '评论', '回复'],
        // 点击原因突出显示
        choose: null,
        reportType: {},
        backComponent: 'commentDetail'
      }
    },
    methods: {
      submitReport () {
        this.showToastTime()
        // 设置举报信息并提交
        let report = {}
        report.reportId = this.reportInfo.id
        report.reportType = this.type
        report.toUserId = this.reportInfo.replyUserId
        // 获取举报原因id
        report.reportReasonId = this.choose
        // 获取说明
        report.reportReason = this.value
        this.$http.post('/Interaction/report',
          this.$qs.stringify(report),
          { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
        ).then((response) => {
          this.$router.go(-1)
        }).catch((error) => {
          console.log(error)
        })
      },
      showToastTime () {
        const toast = this.$createToast({
          type: 'txt',
          time: 0,
          txt: '举报成功',
          $class: {
            'own-class': true
          }
        })
        toast.show()
        setTimeout(() => {
          toast.hide()
          this.$router.go(-1)
        }, 1000)
      },
      selectReason (item) {
        this.choose = item.id
        console.log(item)
      }
    },
    mounted () {
      // 获取举报原因
      this.$http.get('/report/manage/reasons', null)
        .then((response) => {
          this.reportType = response.data.body.data
        }).catch((error) => {
        console.log(error)
      })
    },
    components: { BackHeader }

  }
</script>

<style lang='stylus' rel='stylesheet/stylus'>
  .own-class
    height: 180%;

  /*.cube-popup-content*/
  /*align-items end*/
  .report
    height 100%

    .content
      height 100%
      background-color #ececec

      .report-type-wrapper
        background-color white
        display flex
        padding 10px
        justify-content space-between

      .report-reason-wrapper
        margin 5px 0
        padding 0 10px
        background-color white

        .title
          padding 10px 0

        .reason-wrapper
          display flex
          flex-wrap wrap

          .active
            background-color #007efe
            color: white

          li
            border 1px solid rgba(0, 0, 0, 0.3)
            padding 5px
            margin 10px
            border-radius 5px

      .report-des-wrapper
        background-color white
        padding 10px

        .title
          padding 10px 0

        .cube-textarea
          background-color #ececec

        .tip
          margin 10px 0 30px
          font-size 12px
          color: gray
</style>
