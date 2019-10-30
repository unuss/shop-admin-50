import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './styles/common.css'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import axios from 'axios'
Vue.config.productionTip = false
Vue.prototype.$axios = axios
axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'
Vue.use(ElementUI)
// 添加请求拦截器
axios.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么  Authorization
  console.log(config)
  config.headers.Authorization = localStorage.getItem('token')
  return config
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error)
})
// 添加响应拦截器
axios.interceptors.response.use(function (response) {
  // 对响应数据做点什么
  response = response.data
  if (response.meta.status === 401) {
    // 无效token 的提示消息改写
    response.meta.msg = '登录过期，请重新登录'
    // 清除无效的token
    localStorage.removeItem('token')
    // .在拦截到登录页
    router.push('/login')
  }
  return response
}, function (error) {
  // 对响应错误做点什么
  return Promise.reject(error)
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
