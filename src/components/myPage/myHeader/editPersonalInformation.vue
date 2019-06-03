<template>
  <div class="person-information">
    <div class="write-header">
      <span class="cubeic-close" @click="back"></span>
      <span class=header-question>个人信息</span>
      <span class="no-info"></span>
    </div>
    <div class="information-content">
      <div class="split">
        基本资料
      </div>
      <div class="information-item">
        <span class="info-title">头像</span>
        <span class="info-real">
           <vue-core-image-upload
             :crop="crop"
             text=""
             compress="20"
             @imagechanged="imagechanged"
             @imageuploading="imageuploading"
             @imageuploaded="imageuploaded"
             :headers="myheader"
             :data="data"
             :max-file-size="maxFileSize"
             :url="serverUrl">
             <img class="avatar" width="35" height="35" :src="this.imgURL+personInfo.path">
         </vue-core-image-upload>
        </span>
      </div>
      <div class="information-item" @click="showAlertName">
        <span class="info-title">姓名</span>
        <span class="info-real" :class="{'hint-text':!personInfo.name}">
          {{personInfo.name || '请输入姓名'}}
        </span>
      </div>
      <div class="information-item" @click="showActiveSex">
        <span class="info-title">性别</span>
        <span class="info-real" :class="{'hint-text':!personInfo.sex}">
          {{personInfo.sex || '请选择性别'}}
        </span>
      </div>
      <div class="information-item" @click="showDatePicker">
        <span class="info-title">出生日期</span>
        <span class="info-real" :class="{'hint-text':!personInfo.birthday}">{{showBirthday || '请选择出生日期'}}</span>
      </div>
      <div class="split">
        学校信息
      </div>
      <div class="information-item" @click="showAlertSchool">
        <span class="info-title">学校</span>
        <span class="info-real" :class="{'hint-text':!personInfo.school}">{{personInfo.school || '请选择学校'}}</span>
      </div>
      <div class="information-item" @click="showAlertSchoolNumber">
        <span class="info-title">学号</span>
        <span class="info-real" :class="{'hint-text':!personInfo.schoolNumber}">{{personInfo.schoolNumber || '请输入学号' }}</span>
      </div>
    </div>
  </div>
</template>

<script type='text/ecmascript-6'>
  import VueCoreImageUpload from 'vue-core-image-upload'

  export default {
    name: 'editPersonalInformation',
    data () {
      return {
        myheader: null,
        // 是否销毁input元素, 解决在第二次和第一次选择的文件相同时不触发onchange事件的问题
        destroyInput: false,
        save: true,
        img: 'http://148.70.8.85/group1/M00/00/00/rBsAAlyd2OqAfMy_AAAGveq-234459.jpg',
        // 图像信息
        data: {},
        crop: 'local',
        maxFileSize: 5242880,
        serverUrl: 'http://192.168.43.106:8080/myPage/upload/avatar',
        // 个人信息
        personInfo: {
          name: '陈苗',
          sex: '男',
          birthday: '20180617',
          school: '西华大学',
          schoolNumber: '3120150905308',
          path: 'group1/M00/00/00/rBsAAlyd2OqAfMy_AAAGveq-234459.jpg'
        }
      }
    },
    computed: {
      showBirthday () {
        return this.formatData(this.personInfo.birthday, 2)
      }
    },
    activated () {
      let temp = JSON.parse(localStorage.getItem('token'))
      temp.username = ''
      console.log(temp)
      this.myheader = { Authorization: JSON.stringify(temp) }
    },
    methods: {
      back () {
        this.$router.go(-1)
      },

      // 出生日期
      showDatePicker () {
        if (!this.datePicker) {
          this.datePicker = this.$createDatePicker({
            title: '出生日期',
            min: new Date(1960, 1, 1),
            max: new Date(2020, 9, 20),
            value: new Date(),
            format: {
              year: 'YYYY',
              month: 'MM',
              date: 'D'
            },
            onSelect: this.selectDateHandle
          })
        }

        this.datePicker.show()
      },
      selectDateHandle (date, selectedVal, selectedText) {
        this.personInfo.birthday = this.getTime(selectedText.join('-'))
        // this.updatePersonInfo()
      },
      showActiveSex () {
        this.$createActionSheet({
          title: '请选择性别',
          pickerStyle: true,
          data: [
            {
              content: '男'
            },
            {
              content: '女'
            }
          ],
          onSelect: (item, index) => {
            this.personInfo.sex = item.content
            this.updatePersonInfo()
          }
        }).show()
      },
      showAlertName () {
        this.dialog = this.$createDialog({
          type: 'prompt',
          title: '修改姓名',
          prompt: {
            value: this.personInfo.name,
            placeholder: '请输入姓名'
          },
          onConfirm: (e, promptValue) => {
            this.personInfo.name = promptValue
            this.updatePersonInfo()
          }
        }).show()
      },
      updatePersonInfo () {
        let url = '/myPage/user/userInformation'
        this.$http.post(url, this.personInfo).then((respose) => {
        }).catch((error) => {
          console.log(error)
        })
      },
      showAlertSchoolNumber () {
        this.dialog = this.$createDialog({
          type: 'prompt',
          title: '修改学校学号',
          prompt: {
            value: this.personInfo.schoolNumber,
            placeholder: '请输入学校学号'
          },
          onConfirm: (e, promptValue) => {
            this.personInfo.schoolNumber = promptValue
            this.updatePersonInfo()
          }
        }).show()
      },
      showAlertSchool () {
        this.dialog = this.$createDialog({
          type: 'prompt',
          title: '修改学校名称',
          prompt: {
            value: this.personInfo.school,
            placeholder: '请输入学校名称'
          },
          onConfirm: (e, promptValue) => {
            this.personInfo.school = promptValue
            this.updatePersonInfo()
          }
        }).show()
      },
      // 头像回调方法
      imagechanged (res) {
      },
      imageuploading (res) {
      },
      imageuploaded (res) {
        this.src = this.imgURL + res.body.data.avatar
        // 设置user的path
        this.personInfo.path = res.body.data.avatar
        this.updatePersonInfo()
      }
    },
    components: {
      'vue-core-image-upload': VueCoreImageUpload
    },
    mounted () {
      // 获取当前用户信息
      let url = '/myPage/user/userInformation'
      this.$http.get(url, null)
        .then((response) => {
          this.personInfo = response.data.body.data
        }).catch((error) => {
        console.log(error)
      })
    }
  }
</script>

<style lang='stylus' rel='stylesheet/stylus'>
  .person-information
    height 100%

    .write-header
      display flex
      justify-content space-between
      align-items center
      margin-top 10px
      padding-bottom 10px
      box-shadow 0 2px 2px -2px #bbb

      .cubeic-close
        width 40px
        text-align center
        color: #808080

      .header-question
        overflow hidden
        text-overflow ellipsis
        white-space nowrap

      .no-info
        width 40px

    .information-content
      .split
        height 40px
        line-height 40px
        padding 0 10px
        color #bababa
        font-size 14px
        background-color #f2f2f2

      .information-item
        display flex
        height 40px
        justify-content space-between
        box-shadow 0 2px 2px -2px #bbb
        margin 0 10px
        align-items center

        .info-real
          .avatar
            border-radius 50%

        .hint-text
          color #d4d4d4

        .info-title
          color #909090

</style>
