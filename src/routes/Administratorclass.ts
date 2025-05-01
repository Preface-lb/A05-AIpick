import { RoutePath } from '@/constant/route'
import { RouteRecordRaw } from 'vue-router'

export const AdministratorclassRoute: RouteRecordRaw[] = [
  //   {
  //     name: '风采展示',
  //     path: RoutePath.Show,
  //     component: () => import('@/views/home/show/index.vue'),
  //   },

  {
    name: 'Administratorclass',
    path: '/administratorclass',
    component: () => import('../views/administrator/administratorclass.vue')
  }
]
