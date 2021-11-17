import Vue from 'vue'
import App from './App.vue'

// 全局路由
import router from './router'

// socket.io
// import VueSocketIO from 'vue-socket.io'
// import socketio from 'socket.io-client'

// 全局基础URL => 后台服务器地址
//import BASE_URL from './config.js'

// 网络请求
import axios from 'axios'

// BootStrapVue 文档地址 https://bootstrap-vue.org/docs
import {BootstrapVue, IconsPlugin} from 'bootstrap-vue'
// Import Bootstrap an BootstrapVue CSS files (order is important)
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
// Make BootstrapVue available throughout your project
Vue.use(BootstrapVue)
// Optionally install the BootstrapVue icon components plugin
Vue.use(IconsPlugin)

// 消除开发者提示
Vue.config.productionTip = false

// 默认请求前缀
axios.defaults.baseURL = "http://localhost:3000"
// 全局网络请求
Vue.prototype.$axios = axios


// 使用socket.io
// Vue.use(new VueSocketIO({
//   debug: true,
//   connection: socketio('http://localhost:8080/')
// }))

// 登录拦截
router.beforeEach((to,from,next) => {
  if(to.meta.requireAuth){
    if(window.localStorage.getItem("name")){
        next();
    }else{
      // 跳转到登录页面
      next({
        path: '/home'
      })
    }
  }else{
    next();
  }
})

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
