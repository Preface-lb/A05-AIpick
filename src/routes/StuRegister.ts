import { RoutePath } from '@/constant/route'
import { RouteRecordRaw } from 'vue-router'

export const StuRegisterRoute: RouteRecordRaw[] = [
  //   {
  //     name: '风采展示',
  //     path: RoutePath.Show,
  //     component: () => import('@/views/home/show/index.vue'),
  //   },

  {
    name: 'StuRegister',
    path: '/stuRegister',
    component: ()=> import('@/views/login/StuRegister.vue')
  }
]