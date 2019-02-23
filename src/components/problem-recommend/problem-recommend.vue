<template>
  <div class="problem-recommend">
    <cube-scroll ref="scroll" :data="items" :options="options" @pulling-down="onPullingDown"
                 @pulling-up="onPullingUp">
      <ul>
        <li v-for="(item,index) in items" :key="index">
          {{item.url}}<br>
        </li>
      </ul>
    </cube-scroll>
  </div>
</template>

<script type='text/ecmascript-6'>
  const texts = [
    {
      url: 'asasda'
    },
    {
      url: 'asdasdad'
    },
    {
      url: 'asdasdad'
    },
    {
      url: 'asdasdad'
    },
    {
      url: 'asdasdad'
    },
    {
      url: 'qeqwe'
    },
    {
      url: 'qeqwe'
    },
    {
      url: 'qeqwe'
    },
    {
      url: 'qeqwe'
    },
    {
      url: 'qeqwe'
    },
    {
      url: 'qeqwe'
    },
    {
      url: 'qeqwe'
    },
    {
      url: 'qeqwe'
    }
  ]
  let cnt = 1
  export default {
    name: 'recommend',
    data () {
      return {
        items: texts.slice(),
        options: {
          pullDownRefresh: {
            threshold: 50,
            stop: 40,
            txt: '刷新成功'
          },
          pullUpLoad: true
        }
      }
    },
    methods: {
      onPullingDown () {
        // 模拟更新数据
        setTimeout(() => {
          let num = Math.random()
          console.log('下拉刷新' + num)
          if (num > 0.5) {
            // 如果有新数据
            console.log('下拉刷新 新数据')
            this.items.unshift(texts[cnt++ % 3])
          } else {
            // 如果没有新数据
            console.log('下拉刷新 无数据')
            this.$refs.scroll.forceUpdate()
          }
        }, 1000)
      },
      onPullingUp () {
        // 模拟更新数据
        console.log('上啦')
        setTimeout(() => {
          if (Math.random() > 0.5) {
            // 如果有新数据
            this.items = this.items.concat(texts)
          } else {
            // 如果没有新数据
            this.$refs.scroll.forceUpdate()
          }
        }, 1000)
      }
    }
  }
</script>

<style lang='stylus' rel='stylesheet/stylus'>
  .problem-recommend
    height: 100%
</style>
