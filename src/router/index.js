import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Index from '../components/Index.vue'

Vue.use(VueRouter)

// const i = 1

const routes = [
  { path: '/', redirect: '/index' },
  { path: '/index', name: 'index', component: Index },
  { path: '/login', name: 'login', component: Login }
]

const router = new VueRouter({
  routes
})

export default router
