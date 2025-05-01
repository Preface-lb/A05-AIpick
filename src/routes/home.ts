import { RoutePath } from '@/constant/route'
import { RouteRecordRaw } from 'vue-router'

export const homeRoute: RouteRecordRaw[] = [
  //   {
  //     name: '风采展示',
  //     path: RoutePath.Show,
  //     component: () => import('@/views/home/show/index.vue'),
  //   },

  {
    name: 'Home2',
    path: '',
    component: () => import('../views/home/home.vue'),
  }
]

