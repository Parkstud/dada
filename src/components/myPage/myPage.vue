<template>
  <div class="my-page">
    <my-header></my-header>
    <my-content></my-content>
  </div>
</template>

<script type='text/ecmascript-6'>
  import MyHeader from './myHeader/myHeader'
  import MyContent from './myContent/myContent'

  export default {
    name: 'myPage',
    methods: {

    },
    mounted () {
      // 获取自己的信息

    },
    components: {
      MyContent,
      MyHeader
    }
  }
</script>

<style lang='stylus' rel='stylesheet/stylus'>
  .my-page
    height 100%
    background-color #f4f6f9

</style>
