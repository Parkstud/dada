<template>
  <div class="center">

    <vue-core-image-upload
      :crop="crop"
      text=""
      compress="20"
      @imagechanged="imagechanged"
      @imageuploading="imageuploading"
      @imageuploaded="imageuploaded"
      :data="data"
      :max-file-size="maxFileSize"
      :url="serverUrl">
      <img width="40" :src="src">
    </vue-core-image-upload>
  </div>
</template>

<script type='text/ecmascript-6'>
  import VueCoreImageUpload from 'vue-core-image-upload'

  export default {
    name: 'avatarDemo',
    data () {
      return {
        data: { id: 1 },
        src: 'http://img1.vued.vanthink.cn/vued0a233185b6027244f9d43e653227439a.png',
        crop: 'local',
        maxFileSize: 5242880,
        serverUrl: 'http://192.168.43.106:8080/myPage/upload/avatar'
      }
    },
    methods: {
      imagechanged (res) {
      },
      imageuploading (res) {
      },
      imageuploaded (res) {
        this.src = this.imgURL + res.body.data
        // thisVue.src = res.body.data
      }
    },
    components: {
      'vue-core-image-upload': VueCoreImageUpload
    }
  }
</script>

<style lang='stylus' rel='stylesheet/stylus'>
  .uploadAvatar
    background-color red
    height 50px
    width 50px
</style>
