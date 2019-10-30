import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Index from '../components/Index.vue'
import Users from '../components/Users.vue'
import Rights from '../components/Rights.vue'
import Roles from '../components/Roles.vue'

Vue.use(VueRouter)

// const i = 1

const routes = [
  { path: '/', redirect: '/index' },
  { path: '/index',
    name: 'index',
    component: Index,
    children: [
      { path: '/users', component: Users },
      { path: '/rights', component: Rights },
      { path: '/roles', component: Roles }
    ]

  },
  { path: '/login', name: 'login', component: Login }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  // console.log(to)
  const token = localStorage.getItem('token')
  if (to.path === '/login' || token) {
    next()
  } else {
    next('/login')
  }
})

export default router
