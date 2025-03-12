import { RoutePath } from '@/constant/route'
import { RouteRecordRaw } from 'vue-router'

export const TeacherRoute: RouteRecordRaw[] = [
  //   {
  //     name: '风采展示',
  //     path: RoutePath.Show,
  //     component: () => import('@/views/home/show/index.vue'),
  //   },

  {
    name: 'Teacher',
    path: '/teacher',
    component: ()=> import('@/views/teacher/teacher.vue')
  }
]