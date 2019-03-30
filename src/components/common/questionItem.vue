<template>
  <div class="question-item" @click="toProblemDetails">
    <div class="left-blank"></div>
    <div class="center">
      <div class="question-propose">
        <div class="questioner-info">
          <span>提问:</span>
          <span class="questioner-avatar"></span>
          <span class="questioner-name">陈苗</span>
        </div>
      </div>
      <div class="question-header">10年后的蚂蚁金服,有多大想象空间10年后的蚂蚁金服,有多大想象空间!10年后的蚂蚁金服,有多大想象空间!</div>
      <div class="content">
        <div class="answer-wrapper">
          <p class="answer-content">
            <span class="answer-name">陈秒:</span>
            歌曲以朝鲜战争中志愿军战士对祖国对家乡的无限热爱之情为主题歌曲以朝鲜战争中志愿军战士对祖国对家乡的歌曲以朝鲜战争中志愿军战士对祖国对家乡的.在描写朝鲜战争的影片《上甘岭》上映后
          </p>
        </div>
        <div class="bottom-wrapper">
        <span class="approval-wrapper">
          <span class="cubeic-good"></span>
          <span class="good-number">200</span>
        </span>
          <span class="comment-wrapper">
           <span class="cubeic-message"></span>
          <span class="comment-number">5</span>
        </span>
        </div>
      </div>
    </div>
    <div class="right-blank"></div>
  </div>
</template>

<script type='text/ecmascript-6'>
  export default {
    name: 'questionItem',
    methods: {
      // 跳转问题详情页
      toProblemDetails () {
        this.$router.push('/problemDetails')
      }
    }
  }
</script>

<style lang='stylus' rel='stylesheet/stylus'>
  .question-item
    display flex

    .left-blank
      width 20px

    .center
      flex 1
      width 0

      .question-propose
        display flex
        font-size 14px;
        height 30px
        align-items center
        color: rgb(169, 181, 192)

        .questioner-avatar
          margin-right 5px

        .questioner-name
          font-size 14px;

      .question-header
        font-size 16px
        font-weight 560;
        display -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
        white-space: normal
        line-height 26px

      .content
        width 100%

        .answer-wrapper
          height 80px
          display flex
          align-items center

          .answer-content
            display -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 3;
            overflow: hidden;
            white-space: normal
            line-height 20px
            font-size 14px

        .bottom-wrapper
          color: rgb(169, 181, 192)
          .approval-wrapper
            margin-right 20px
            .cubeic-good
              margin-right 5px
          .comment-wrapper
            .cubeic-message
              margin-right 5px
    .right-blank
      width 20px
      height 20px
</style>
