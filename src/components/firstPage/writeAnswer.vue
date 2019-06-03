<template>
  <div class="write-answer">
    <div class="write-header">
      <span class="cubeic-close" @click="back"></span>
      <span class=header-question>{{problem.title}}</span>
      <span class="cubeic-navigation" :class="[clickSend ? 'not-active':'active']"
            @click="writeAnswer"></span>
    </div>
    <div class="write-content">
      <cube-textarea v-model="value" :placeholder="placeholder" :maxlength="maxlength"
                     indicator="indicator"></cube-textarea>
    </div>
  </div>
</template>

<script type='text/ecmascript-6'>
  export default {
    name: 'writeAnswer',
    data () {
      return {
        indicator: {
          negative: true,
          remain: true
        },
        maxlength: 1000,
        value: '',
        problem: this.$route.params.problem,
        placeholder: '写回答......'
      }
    },
    computed: {
      clickSend () {
        if (this.value.trim().length > 0) {
          return false
        }
        return true
      }
    },
    methods: {
      back () {
        this.$router.go(-1)
      },
      writeAnswer () {
        let url = '/control/problem/answer'
        let param = new URLSearchParams()
        param.append('questionId', this.problem.id)
        param.append('comments', this.value.replace(/\n|\r\n/g, '<br/>').replace(' ', '&#12288'))
        this.value = ''
        let toast = this.showMaskToast('发送中...')
        this.$http.post(url, param)
          .then((response) => {
            this.$store.commit('setProblem', this.problem.id)
            this.$store.commit('updateFlushDetail', this.problem.id)
            toast.hide()
            this.$router.go(-1)
          }).catch((error) => {
          console.log(error)
        })
      }
    },
    mounted () {

    }
  }
</script>

<style lang='stylus' rel='stylesheet/stylus'>
  .write-answer
    height 100%

    .write-header
      display flex
      justify-content space-between
      align-items center
      margin 10px 0
      padding-bottom 10px
      box-shadow 0 2px 2px -2px #bbb
      font-size 26px

      .cubeic-close
        width 40px
        text-align center
        color: #808080

      .header-question
        overflow hidden
        text-overflow ellipsis
        white-space nowrap

      .cubeic-navigation
        width 40px
        text-align center

        &.not-active
          color: #808080

        &.active
          color: #007efe

    .write-content
      height 300px

    .cube-textarea-wrapper
      height 100%

      .cube-textarea
        white-space: pre-wrap;

    .cube-textarea_expanded
      height 100%
</style>
