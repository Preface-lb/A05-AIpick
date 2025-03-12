import { RoutePath } from '@/constant/route'
import { RouteRecordRaw } from 'vue-router'

export const AdministratorRoute: RouteRecordRaw[] = [
  //   {
  //     name: '风采展示',
  //     path: RoutePath.Show,
  //     component: () => import('@/views/home/show/index.vue'),
  //   },

  {
    name: 'Administrator',
    path: '/administrator',
    component: ()=> import('@/views/administrator/administrator.vue')
  }
]
