import Vue from 'vue'
import './cube-ui'
import App from './App.vue'
import VueRouter from 'vue-router'
import Vuex from 'vuex'
import Login from './components/login/login'
import Main from './components/mainapp/mainApp'
import Register from './components/register/register'
import Forget from './components/forget/forget'

import './common/stylus/index.styl'
import myProblem from './components/myPage/myContent/myProblem/myProblem'

Vue.config.productionTip = false
Vue.use(VueRouter)
Vue.use(Vuex)
const router = new VueRouter({
  routes: [
    {
      path: '/login',
      component: Login
    },
    {
      path: '/mainApp',
      component: Main
    },
    {
      path: '/register',
      component: Register
    },
    {
      path: '/forgetPwd',
      component: Forget
    },
    {
      path: '/myProblem',
      component: myProblem
    },
    {
      path: '/myProblem',
      component: myProblem
    },
    {
      path: '/myProblem',
      component: myProblem
    },
    {
      path: '/myProblem',
      component: myProblem
    },
    {
      path: '/myProblem',
      component: myProblem
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
    states: 'turn-on'
  },
  mutations: {
    // 更新用户信息
    updateUserInfo (state, newUserInfo) {
      state.userInfo = newUserInfo
    },
    // 页面转场动画
    setTransition (state, states) {
      state.states = states
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

// 获取cookie、
function getCookie (name) {
  let reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)')
  let arr = document.cookie.match(reg)
  if (arr) {
    return (arr[2])
  } else {
    return null
  }
}

Vue.prototype.getCookie = getCookie

// 删除cookie
Vue.prototype.delCookie = (name) => {
  var exp = new Date()
  exp.setTime(exp.getTime() - 1)
  var cval = getCookie(name)
  if (cval != null) {
    document.cookie = name + '=' + cval + ';expires=' + exp.toGMTString()
  }
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
      // 检查是否存在session
      console.log(this.$router.currentRoute.fullPath)

      if (this.$router.currentRoute.fullPath === '/register' || this.$router.currentRoute.fullPath === '/forgetPwd') {
        return
      }
      if (!this.getCookie('session')) {
        this.$router.push('/login')
      }
    }
  }
}).$mount('#app')
