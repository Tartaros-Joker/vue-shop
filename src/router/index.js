import Vue from 'vue'
import Router from 'vue-router'
import Login from '../components/Login'
import Home from '../components/Home'

Vue.use(Router)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [
      { path: '/welcome', component: resolve => require(['../views/Welcome'], resolve) },

      { path: '/home/users', component: resolve => require(['../views/user/User'], resolve) },
      { path: '/home/rights', component: resolve => require(['../views/power/Rights'], resolve) },
      { path: '/home/roles', component: resolve => require(['../views/power/Roles'], resolve) },
      { path: '/home/categories', component: resolve => require(['../views/goods/Categories'], resolve) },
      { path: '/home/params', component: resolve => require(['../views/goods/Params'], resolve) },
      { path: '/home/goods', component: resolve => require(['../views/goods/List'], resolve) },
      { path: '/home/goods/add', component: resolve => require(['../views/goods/Add'], resolve) },
      { path: '/home/orders', component: resolve => require(['../views/order/Order'], resolve) },
      { path: '/home/reports', component: resolve => require(['../views/report/Report'], resolve) }
    ]
  }
]

const router = new Router({
  routes
})

router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next()
  const tokenStr = sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})

export default router
