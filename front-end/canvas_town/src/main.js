import Vue from 'vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import App from './App.vue'
// 全局路由
import router from './router'
// socket.io
// import VueSocketIO from 'vue-socket.io'
// import socketio from 'socket.io-client'
// 全局基础URL => 后台服务器地址
import BASE_URL from './config.js'
// 网络请求
import axios from 'axios'

Vue.use(ElementUI);
// 消除开发者提示
Vue.config.productionTip = false

// 全局网络请求
Vue.prototype.$axios = axios
// 默认请求前缀
axios.defaults.baseURL = BASE_URL.SERVER_URL

// 使用socket.io
// Vue.use(new VueSocketIO({
//   debug: true,
//   connection: socketio('http://localhost:8080/')
// }))


new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
