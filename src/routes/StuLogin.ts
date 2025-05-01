import { RoutePath } from '@/constant/route'
import { RouteRecordRaw } from 'vue-router'

export const StuLoginRoute: RouteRecordRaw[] = [
  //   {
  //     name: '风采展示',
  //     path: RoutePath.Show,
  //     component: () => import('@/views/home/show/index.vue'),
  //   },

  {
    name: 'StuLogin',
    path: '/stulogin',
    component: () => import('../views/login/StuLogin.vue')
  }
]