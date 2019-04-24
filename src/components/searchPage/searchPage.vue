<template>
  <div class="search-page">
    <div class="title">
      精确提问
    </div>
    <div class="content">
      <div class="item-wrapper">
        <div class="item  block-item" @click="dataOverview">
          <span class="iconfont icon-shujujiegou-copy"></span>
          <span>数据结构概述</span>
        </div>
        <div class="item  block-item" @click="linearTable">
          <span class="iconfont icon-Group- data-struct"></span>
          <span>线性表</span>
        </div>
      </div>

      <div class="item-wrapper">
        <div class="item  block-item" @click="statckAndQueue">
          <span class="iconfont icon-dashuju"></span>
          <span>栈和队列</span>
        </div>
        <div class="item  block-item" @click="stringClick">
          <span class="iconfont icon-zifuchuanshujuji"></span>
          <span>字符串</span>
        </div>
      </div>
      <div class="item-wrapper">
        <div class="item  block-item" @click="treeClick">
          <span class="iconfont icon-shuju"></span>
          <span>树</span>
        </div>
        <div class="item  block-item" @click="mapClick">
          <span class="iconfont icon-jiyinsuanfa-copy"></span>
          <span>图</span>
        </div>
      </div>
      <div class="item-wrapper">
        <div class="item block-item" @click="algorithmClick">
          <span class="iconfont icon-zhinengsuanfa"></span>
          <span>常用算法</span>
        </div>
        <div class="item">
        </div>
      </div>
    </div>
  </div>
</template>

<script type='text/ecmascript-6'>
  const SEARCH = 1
  export default {
    name: 'searchPage',
    methods: {
      dataOverview () {
        this.updateCommit()
        this.$router.push({
          name: 'putQuestionPage',
          params: { modelName: 1, modelIcon: 'icon-shujujiegou-copy' }
        })
      },
      linearTable () {
        this.updateCommit()
        this.$router.push({
          name: 'putQuestionPage',
          params: { modelName: 2, modelIcon: 'icon-Group- data-struct' }
        })
      },
      statckAndQueue () {
        this.updateCommit()
        this.$router.push({
          name: 'putQuestionPage',
          params: { modelName: 3, modelIcon: 'icon-dashuju' }
        })
      },
      stringClick () {
        this.updateCommit()
        this.$router.push({
          name: 'putQuestionPage',
          params: { modelName: 4, modelIcon: 'icon-zifuchuanshujuji' }
        })
      },
      treeClick () {
        this.updateCommit()
        this.$router.push({
          name: 'putQuestionPage',
          params: { modelName: 5, modelIcon: 'icon-shuju' }
        })
      },
      mapClick () {
        this.updateCommit()
        this.$router.push({
          name: 'putQuestionPage',
          params: { modelName: 6, modelIcon: 'icon-jiyinsuanfa-copy' }
        })
      },
      algorithmClick () {
        this.updateCommit()
        this.$router.push({
          name: 'putQuestionPage',
          params: { modelName: 7, modelIcon: 'icon-zhinengsuanfa' }
        })
      },
      updateCommit () {
        this.$store.commit('updateCount', SEARCH)
      }

    }
  }
</script>

<style lang='stylus' rel='stylesheet/stylus'>
  .search-page
    height 100%
    background-color #eaeaea

    .title
      padding 20px
      font-weight lighter
      font-size 26px

    .content
      .item-wrapper
        display flex

        .block-item
          padding 5px
          background-color #fff
          box-shadow: 1px 2px 4px rgba(0, 0, 0, 0.2)
          border-radius 10px

        .item
          margin 10px 20px
          flex 1
          display: flex;
          flex-direction column
          justify-content space-between
          align-items: center;

          .iconfont
            font-size 60px
            color #91cbf5

          span
            color #797362

</style>
