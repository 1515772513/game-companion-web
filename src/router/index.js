import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/store/user'
import Layout from '@/layouts/Layout.vue'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue'),
    meta: { title: '登录', requiresAuth: false }
  },
  {
    path: '/',
    component: Layout,
    redirect: '/users',
    children: [
      // {
      //   path: 'dashboard',
      //   name: 'Dashboard',
      //   component: () => import('@/views/Dashboard.vue'),
      //   meta: { title: '数据统计', icon: 'DataAnalysis', requiresAuth: true }
      // },
      {
        path: 'users',
        name: 'Users',
        component: () => import('@/views/Users.vue'),
        meta: { title: '用户管理', icon: 'User', requiresAuth: true }
      },
      {
        path: 'companions',
        name: 'Companions',
        component: () => import('@/views/Companions.vue'),
        meta: { title: '陪玩师审核', icon: 'UserFilled', requiresAuth: true }
      },
      {
        path: 'orders',
        name: 'Orders',
        component: () => import('@/views/Orders.vue'),
        meta: { title: '订单管理', icon: 'ShoppingCart', requiresAuth: true }
      },
      // {
      //   path: 'withdrawals',
      //   name: 'Withdrawals',
      //   component: () => import('@/views/Withdrawals.vue'),
      //   meta: { title: '提现审核', icon: 'Wallet', requiresAuth: true }
      // },
      // {
      //   path: 'settings',
      //   name: 'Settings',
      //   component: () => import('@/views/Settings.vue'),
      //   meta: { title: '系统配置', icon: 'Setting', requiresAuth: true }
      // }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  const token = userStore.token

  // 设置页面标题
  document.title = to.meta.title ? `${to.meta.title} - 游戏陪玩管理端` : '游戏陪玩管理端'

  if (to.meta.requiresAuth) {
    if (token) {
      next()
    } else {
      next('/login')
    }
  } else {
    if (token && to.path === '/login') {
      next('/')
    } else {
      next()
    }
  }
})

export default router
