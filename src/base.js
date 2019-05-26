exports.install = function (Vue, options) {
  //  获取时间搓
  Vue.prototype.getTime = function (strTime) {
    let date = new Date(strTime)
    return date.getTime()
  }
  // 显示mask的toastthis
  Vue.prototype.showMaskToast = function (msg) {
    const maskToast = this.$createToast({
      txt: msg,
      time: 0,
      mask: true
    })
    maskToast.show()
    return maskToast
  }
  // 显示toast提示
  Vue.prototype.showToast = function (msg) {
    const toast = this.$createToast({
      type: 'txt',
      time: 0,
      txt: msg,
      $class: {
        'own-class': true
      }
    })
    toast.show()
    setTimeout(() => {
      toast.hide()
    }, 1000)
  }
  // 获取指定时间格式
  Vue.prototype.formatData = function (data, model) {
    if (!data) {
      return data
    }
    let date = new Date(data)
    let Y = date.getFullYear() + '-'
    let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
    let D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' '
    let h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':'
    let m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':'
    let s = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds())
    if (model === 1) {
      return Y + M + D + h + m + s
    }
    if (model === 2) {
      return Y + M + D
    }
  }
  // 缓存是否改变
  Vue.prototype.change = (oldParam, newParam) => {
    if (!newParam || newParam.length === 0) {
      return false
    }
    if (oldParam === newParam) {
      return false
    }
    return true
  }
  // 时间转换
  Vue.prototype.getDateDiff = (dateTimeStamp) => {
    let result = ''
    let minute = 1000 * 60
    let hour = minute * 60
    let day = hour * 24
    let month = day * 30
    let now = new Date().getTime()
    let diffValue = now - dateTimeStamp
    if (diffValue < 0) {
      return
    }
    let monthC = diffValue / month
    let weekC = diffValue / (7 * day)
    let dayC = diffValue / day
    let hourC = diffValue / hour
    let minC = diffValue / minute
    if (monthC >= 1) {
      result = '' + Math.floor(monthC) + '月前'
    } else if (weekC >= 1) {
      result = '' + Math.floor(weekC) + '周前'
    } else if (dayC >= 1) {
      result = '' + Math.floor(dayC) + '天前'
    } else if (hourC >= 1) {
      result = '' + Math.floor(hourC) + '小时前'
    } else if (minC >= 1) {
      result = '' + Math.floor(minC) + '分钟前'
    } else {
      result = '刚刚'
    }
    return result
  }
}
