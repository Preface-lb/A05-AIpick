import { RoutePath } from '@/constant/route'
import { RouteRecordRaw } from 'vue-router'

export const StudentRoute: RouteRecordRaw[] = [
  //   {
  //     name: '风采展示',
  //     path: RoutePath.Show,
  //     component: () => import('@/views/home/show/index.vue'),
  //   },

  {
    name: 'Student',
    path: '/student',
    component: () => import('../views/student/student.vue')
  }
]