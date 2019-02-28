<template>
  <div>
    我的问题
    <div @click="back">返回</div>
  </div>
</template>

<script type='text/ecmascript-6'>
  const BACK_FLAG = -1
  export default {
    name: 'myProblem',
    methods: {
      back () {
        this.$store.commit('setTransition', 'turn-off')
        this.$router.go(BACK_FLAG)

      }
    }
  }
</script>

<style lang='stylus' rel='stylesheet/stylus'>

</style>
