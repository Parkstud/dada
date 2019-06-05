<template>
  <div class="my-header" @click="editPerson">
    <div class="header-content">
      <div class="myavatar">
        <img v-if="avatar" :src="this.imgURL+avatar"
             width="64" height="64">
        <img v-else :src="this.imgURL+this.defaultImg"
             width="64" height="64">
      </div>
      <div class="info-wrapper">
        <div class="name">{{nickName}}</div>
        <div class="attention-wrapper" @click.stop="myCare">
              <span class="attention-wrapper">
                <span class="attention">关注</span>
                <span class="attention-num">{{cares}}</span>
              </span>
        </div>
        <div class="fan-wrapper" @click.stop="myFans">
          <span class="fan">粉丝</span>
          <span class="fan-num">{{fans}}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script type='text/ecmascript-6'>
  export default {
    name: 'myHeader',
    data () {
      return {
        avatar: '',
        nickName: '',
        fans: 0,
        cares: 0
      }
    },
    methods: {
      myCare () {
        this.$router.push({
            name: 'myCareFans',
            params: {
              itemName: '关注'
            }
          }
        )
      },
      myFans () {
        this.$router.push({
            name: 'myCareFans',
            params: {
              itemName: '粉丝'
            }
          }
        )
      },
      // 编辑个人资料
      editPerson () {
        this.$router.push('/editPersonalInformation')
      },
      updateResource (oldResouce, newResource) {
        if (oldResouce.length !== newResource.length) {
          return null
        }
        for (let i = 0; i < oldResouce.length; i++) {
          if (oldResouce[i] !== newResource[i]) {
            oldResouce[i] = newResource[i]
          }
        }
      },
      getData () {
        this.$http.get('/myPage/header/information', null)
          .then((response) => {
            if (response.data.head.stateCode === 200) {
              let data = response.data.body.data
              if (this.change(this.avatar, data.avatar)) {
                this.avatar = data.avatar
              }
              if (this.change(this.nickName, data.nickName)) {
                this.nickName = data.nickName
              }
              if (this.change(this.fans, data.fans)) {
                this.fans = data.fans
              }
              if (this.change(this.cares, data.cares)) {
                this.cares = data.cares
              }
            }
          }).catch((error) => {
          console.log(error)
        })
      }
    },
    activated () {
      this.getData()
    },
    mounted () {
      this.getData()
    }
  }
</script>

<style lang='stylus' rel='stylesheet/stylus'>
  .my-header
    display: flex
    align-items: center
    border-radius 2px solid
    background-color #FFFFFF
    height 80px
    width 100%
    font-size 20px
    box-shadow 1px 1px 1px 1px 3px #e2e2e2

    .header-content
      .myavatar
        display inline-block

        img
          border-radius 50%
          border 1px solid #f3f3f3

      .info-wrapper
        display inline-block
        vertical-align top
        margin 12px 0 0 16px
        width 100px
        line-height 24px

        .fan-wrapper, .attention-wrapper
          display inline-block
          font-size 12px
          color #888888
          width 50px

          .attention-num, .fan-num
            padding-left 5px
            text-align right
            font-size 14px
            color #2f2f2f
</style>
