import Vue from 'vue'
import './cube-ui'
import App from './App.vue'
import VueRouter from 'vue-router'
import Vuex from 'vuex'
import Login from './components/login/login'
import Main from './components/mainapp/mainApp'
import Register from './components/register/register'
import Forget from './components/forget/forget'
import axios from 'axios'
import Qs from 'qs'
import VConsole from 'vconsole'
import './common/stylus/index.styl'
import myProblem from './components/myPage/myContent/myProblem/myProblem'
import personSet from './components/myPage/myContent/personSet/personSet'
import problemDetails from './components/firstPage/problemDetails'
import inviteAnswer from './components/firstPage/inviteanswer'
import './common/icon/iconfont.styl'
import quesion from './components/common/quesion'
import onlySearchPage from './components/firstPage/onlySearchPage'
import putQuestionPage from './components/firstPage/putQuestionPage'
import chatPage from './components/msgPage/chatPage'
import writeAnswer from './components/firstPage/writeAnswer'
import editPersonalInformation from './components/myPage/myHeader/editPersonalInformation'
import avatarDemo from './components/demo/avatarDemo'
import homePage from './components/firstPage/homePage'
import commentDetail from './components/msgPage/commentDetail'
import report from './components/myPage/myContent/report'
import myCollection from './components/myPage/myContent/myProblem/myCollection'
import myHistory from './components/myPage/myContent/myProblem/myHistory'

Vue.config.productionTip = false

Vue.prototype.imgURL = 'http://148.70.8.85/'

Vue.prototype.$http = axios
// http://106.14.4.232:8080/dsqas-0.0.1-SNAPSHOT
axios.defaults.baseURL = 'http://192.168.43.106:8080'
axios.defaults.headers.common['Authorization'] = ''
axios.interceptors.request.use(
  config => {
    // 这里写死一个token，你需要在这里取到你设置好的token的值
    let token = window.localStorage.getItem('token')
    if (token) {
      // 这里将token设置到headers中，header的key是Authorization，这个key值根据你的需要进行修改即可
      config.headers.Authorization = token
    }
    return config
  },
  error => {
    return Promise.reject(error)
  })

Vue.prototype.$qs = Qs
const vConsole = new VConsole()
export default vConsole
Vue.use(VueRouter)
Vue.use(Vuex)
const router = new VueRouter({
  routes: [
    { path: '/', component: Main, meta: { keepAlive: true } },
    { path: '/login', component: Login, meta: { keepAlive: true } },
    { path: '/mainApp', component: Main, name: 'mainApp', meta: { keepAlive: true } },
    { path: '/register', component: Register, meta: { keepAlive: true } },
    { path: '/forgetPwd', component: Forget, meta: { keepAlive: true } },
    { path: '/myProblem', component: myProblem, meta: { isBack: false, keepAlive: true } },
    { path: '/myCollection', component: myCollection, meta: { isBack: false, keepAlive: true } },
    { path: '/myHistory', component: myHistory, meta: { isBack: false, keepAlive: true } },
    {
      name: 'putQuestionPage',
      path: '/putQuestionPage',
      component: putQuestionPage,
      meta: { isBack: false, keepAlive: true }
    },
    {
      path: '/onlySearchPage',
      component: onlySearchPage,
      meta: { isBack: false, keepAlive: true }
    },
    {
      name: 'problemDetails',
      path: '/problemDetails',
      component: problemDetails,
      meta: { isBack: true, keepAlive: true }
    },
    { path: '/personSet', component: personSet, meta: { isBack: false, keepAlive: true } },
    {
      path: '/inviteAnswer',
      name: 'inviteAnswer',
      component: inviteAnswer,
      meta: { isBack: false, keepAlive: true }
    },
    {
      path: '/question',
      name: 'question',
      component: quesion,
      meta: { isBack: false, keepAlive: false }
    },
    {
      path: '/chatPage',
      name: 'chatPage',
      component: chatPage,
      meta: { isBack: false, keepAlive: true }
    },
    {
      path: '/writeAnswer',
      name: 'writeAnswer',
      component: writeAnswer,
      meta: { isBack: false, keepAlive: true }
    },
    {
      path: '/editPersonalInformation',
      component: editPersonalInformation,
      meta: { isBack: false, keepAlive: true }
    },
    { path: '/avatarDemo', component: avatarDemo, meta: { isBack: false, keepAlive: true } },
    {
      path: '/homePage',
      name: 'homePage',
      component: homePage,
      meta: { isBack: false, keepAlive: true }
    },
    {
      path: '/commentDetail',
      name: 'commentDetail',
      component: commentDetail,
      meta: { isBack: false, keepAlive: true }
    },
    {
      path: '/report',
      name: 'report',
      component: report,
      meta: { isBack: false, keepAlive: true }
    }

  ]
})

// Vuex配置
const store = new Vuex.Store({
  state: {
    domain: 'http://test.example.com', // 保存后台请求的地址，修改时方便（比方说从测试服改成正式服域名）
    userInfo: { // 保存用户信息
      nick: null,
      uid: null,
      portrait: null
    },
    // 页面切换 on 入栈 off 出站
    states: 'turn-on',
    // 主界面显示的状态
    count: 0,
    // 显示消息界面的内容
    message: '通知',
    // 是否更新主界面问题列表
    problemList: [],
    // 是否更新problemInfo
    updateProblem: -1,
    // 更新全部item
    flushCount: 0
  },
  mutations: {
    // 更新列表
    setFlushCount (state) {
      state.flushCount++
    },
    // 更新问题
    setProblem (state, change) {
      state.updateProblem = change
    },
    // 更新主页问题列表
    updateProblemList (state, change) {
      state.problemList = change
    },
    // 更新用户信息
    updateUserInfo (state, newUserInfo) {
      state.userInfo = newUserInfo
    },
    // 页面转场动画
    setTransition (state, states) {
      state.states = states
    },
    // 更新状态信息
    updateCount (state, count) {
      state.count = count
    },
    // 更新信息状态
    updateMessage (state, msg) {
      state.message = msg
    }

  }
})
// 设置cookie,增加到vue实例方便全局调用
// vue全局调用的理由是，有些组件所用到的接口可能需要session验证，session从cookie获取
// 当然，如果session保存到vuex的话除外
Vue.prototype.setCookie = (cookieName, value, expiredays) => {
  var exdate = new Date()
  exdate.setDate(exdate.getDate() + expiredays)
  document.cookie = cookieName + '=' + escape(value) + ((expiredays == null) ? '' : ';expires=' + exdate.toGMTString())
}
//  获取时间搓
Vue.prototype.getTime = function (strTime) {
  let date = new Date(strTime.replace(/-/g, '/'))
  return date.getTime()
}

// 转换时间格式
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
Vue.prototype.change = (oldParam, newParam) => {
  if (!newParam || newParam.length === 0) {
    return false
  }
  if (oldParam === newParam) {
    return false
  }
  return true
}

new Vue({
  render: h => h(App),
  router,
  store,
  watch: {
    '$route': 'checkLogin'
  },
  created () {
    this.checkLogin()
  },
  methods: {
    checkLogin () {
      // 检查是否存在token
      if (this.$router.currentRoute.fullPath === '/register' || this.$router.currentRoute.fullPath === '/forgetPwd') {
        return
      }
      let token = window.localStorage.getItem('token')
      if (token === '') {
        this.$router.push('/login')
      }
    }
  }
}).$mount('#app')
