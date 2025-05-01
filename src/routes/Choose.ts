import { RoutePath } from '@/constant/route'
import { RouteRecordRaw } from 'vue-router'

export const chooseRoute: RouteRecordRaw[] = [
  //   {
  //     name: '风采展示',
  //     path: RoutePath.Show,
  //     component: () => import('@/views/home/show/index.vue'),
  //   },

  {
    name: 'choose',
    path: '/choose',
    component: () => import('../views/home/Choose.vue')
  }
]

