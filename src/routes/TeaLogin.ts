import { RoutePath } from '@/constant/route'
import { RouteRecordRaw } from 'vue-router'

export const TeaLoginRoute: RouteRecordRaw[] = [
  //   {
  //     name: '风采展示',
  //     path: RoutePath.Show,
  //     component: () => import('@/views/home/show/index.vue'),
  //   },

  {
    name: 'TeaLogin',
    path: '/tealogin',
    component: () => import('../views/login/TeaLogin.vue')
  }
]

