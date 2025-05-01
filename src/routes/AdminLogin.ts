import { RoutePath } from '@/constant/route'
import { RouteRecordRaw } from 'vue-router'

export const AdminLoginRoute: RouteRecordRaw[] = [
  //   {
  //     name: '风采展示',
  //     path: RoutePath.Show,
  //     component: () => import('@/views/home/show/index.vue'),
  //   },

  {
    name: 'AdminLogin',
    path: '/adminlogin',
    component: () => import('../views/login/AdminLogin.vue')
  }
]
