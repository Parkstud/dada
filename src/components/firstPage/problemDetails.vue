<template>
  <div class="proble-details">
    <proback-header :back-text="backText" :has-collection="hasCollection"
                    v-on:changeHasCollection="changeHasCollection"></proback-header>
    <cube-scroll ref="answer"
                 :options="scrollOptions"
                 :data="comments"
                 @pulling-up="onPullingUp">
      <div class="question-wrapper">
        <p class="question">{{problem.answerContent}}</p>
        <div class="question-more">
          <span class="answer-num">{{commentCount}}</span>
          <span>条回答</span>
          <span class="collection-num">{{collectCount}}</span>
          <span>个收藏</span>
        </div>
        <div class="btn-wrapper">
          <cube-button icon="cubeic-person" :light="true" @click="invite">邀请回答</cube-button>
          <cube-button icon="cubeic-edit" :light="true" @click="writeaswer">写回答</cube-button>
        </div>
      </div>

      <div class="answer-wrapper" v-for="(item,index) in comments" :key="index">
        <div class="author-type-wrapper">
          <hr style="filter: progid:DXImageTransform.Microsoft.Glow(color=#ccc,strength=10)"
              :class="{ expand : item.type==='SYSTEM' || item.type==='TEACHER'}"
              color=#ccc SIZE=1/>
          <!--    -->
          <span class="author-type" v-show="item.type==='SYSTEM'">智能回答</span>
          <span class="author-type" v-show="item.type==='TEACHER'">教师回答</span>
        </div>
        <div class="author-info">
          <span class="avatar">
            <img :src="imgURL+item.path" width="40" height="40">
          </span>
              <span class="author-name">{{item.username}}</span>
              <span class="answer-time">{{item.time}}</span>
              <span class="info-left">
              <span class="cubeic-message"></span>
              <span class="comment">{{item.replyCount}}</span>
              <span class="cubeic-good"></span>
              <span class="approve">{{item.awesome}}</span>
          </span>
        </div>
          <p class="answer-content">
            {{item.comments}}
          </p>
        <hr style="margin-top:10px;filter: progid:DXImageTransform.Microsoft.Glow(color=#ccc,strength=10)"
            v-show="index===comments.length-1"
            color=#ccc SIZE=1/>
      </div>
    </cube-scroll>
  </div>
</template>

<script type='text/ecmascript-6'>
  import probackHeader from '../common/probackHeader'

  export default {
    name: 'problemDetails',
    data () {
      return {
        backText: '首页',
        // 收藏数
        collectCount: 0,
        // 评论数
        commentCount: 0,
        // 是否收藏
        hasCollection: false,
        // 评论信息
        comments: [],
        // 之前的三条评论信息的id
        threeComments: [],
        // 分页的当前页数
        current: 1,
        // 当前数据不足10
        dataLess: 0,
        // 当前问题
        problem: this.$route.params.problem,
        scrollOptions: {
          pullUpLoad: true,
          directionLockThreshold: 0
        }

      }
    },
    methods: {
      // 邀请
      invite () {
        this.$router.push('/inviteAnswer')
      },
      // 写回答
      writeaswer () {
        this.$router.push('/writeAnswer')
      },
      // 上拉获取更多评论信息,传入 问题 id  已经显示的三条信息(或者没有)
      onPullingUp () {
        let url = '/problemInfo/comments/page'
        const qs = this.$qs
        this.$http.get(url, {
          params: {
            hasCommentId: this.threeComments,
            problemId: this.problem.id,
            size: 10,
            current: this.current
          },
          paramsSerializer: function (params) {
            return qs.stringify(params, { arrayFormat: 'repeat' })
          }
        }).then((response) => {
          let data = response.data.body.data
          console.log(this.comments)
          if (data.records.length === 10) { // 下次请求下一页
            this.current++
            this.comments = this.comments.concat(data.records.slice(this.dataLess))
            this.dataLess = 0
          } else {
            // 请求本页 记录下次需要添加的数据
            this.comments = this.comments.concat(data.records.slice(this.dataLess))
            console.log(this.comments)
            this.dataLess = data.records.length
          }
        })
      },
      // 接收子组件修改的收藏信息
      changeHasCollection (value) {
        console.log(value)
        this.hasCollection = value
        // 修改收藏信息
        let url = '/problemInfo/problem/collection'
        let param = new URLSearchParams()
        param.append('problemId', this.problem.id)
        this.$http.post(url, param)
          .then((response) => {

          }).catch((error) => {
          console.log(error)
        })
      }
    },
    components: { probackHeader },
    mounted () {
      // 更新浏览记录
      let url = '/problemInfo/problem/history'
      let param = new URLSearchParams()
      param.append('problemId', this.problem.id)
      this.$http.post(url, param)
        .then((response) => {
          // let data = response.data.body.data
        }).then((error) => {
        console.log(error)
      })

      // 获取详细信息数据
      url = '/problemInfo/problem/detail'
      this.$http.get(url, {
        params: {
          problemId: this.problem.id
        }
      })
        .then((response) => {
          console.log(this.imgURL)
          let data = response.data.body.data
          this.hasCollection = data.hasCollection
          this.collectCount = data.collectCount
          this.commentCount = data.commentCount
          this.comments = data.comments
          for (let i = 0; i < data.comments.length; i++) {
            this.threeComments.push(data.comments[i].id)
          }
          console.log(this.threeComments)
        }).catch((error) => {
        console.log(error)
      })
    }
  }
</script>

<style lang='stylus' rel='stylesheet/stylus'>
  .proble-details
    .cube-scroll-wrapper
      height 640px

      .question-wrapper
        .question
          margin 0 20px 8px 20px
          font-size 20px
          line-height 32px

        .question-more
          margin-left 20px
          color: #999999

          .answer-num
            margin-right 4px

          .collection-num
            margin-left 10px
            margin-right 4px

        .btn-wrapper
          margin-top 10px
          display flex

          .cube-btn-light
            background-color white;
            color #0084ff

      .answer-wrapper
        margin-top 2px

        .author-type-wrapper
          position relative

          .expand
            margin 25px 0

          .author-type
            position absolute
            display inline-block;
            left 10px
            top -16px
            background-color #00b092
            color white
            height 32px
            width 100px
            text-align center
            line-height 32px
            border-radius 10px

        .author-info
          position: relative;
          margin-top 0
          margin-left 10px
          color: #999999

          .avatar > img
            border-radius 50%
            margin-right 8px

          .author-name

            display inline-block
            position absolute
            top: 4px
            font-size 14px

          .answer-time
            display inline-block
            position absolute
            top: 20px
            font-size 12px

          .info-left
            position absolute
            right 0
            margin-right 20px

            .comment, .approve
              display inline-block
              width 30px
              text-align center

        .answer-content
          margin 0 10px 0 10px
          line-height 20px

</style>
