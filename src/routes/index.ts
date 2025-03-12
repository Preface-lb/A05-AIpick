import { homeRoute } from './home'

import { TeaLoginRoute } from './TeaLogin'
import { StuLoginRoute } from './StuLogin'
import { AdminLoginRoute } from './AdminLogin'

import { StudentRoute } from './student'
import { TeacherRoute } from './teacher'
import { AdministratorRoute } from './Administrator'
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import { usePermission } from '@/hooks/usePermission'

const Layout = import('@/component/main-layout/index.vue')
const NotPermission = import('@/component/not-permission-page/index.vue')

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: Layout,
    children: [...homeRoute,...TeaLoginRoute,...StuLoginRoute,...AdminLoginRoute,...StudentRoute,...TeacherRoute,...AdministratorRoute],
  },
  {
    path: '/403',
    component: NotPermission,
    meta: {
      permissionKey: null,
    },
  },
]

const router = createRouter({ history: createWebHistory(), routes })

router.beforeEach((to, from, next) => {
  const { checkPermission } = usePermission()
  const permissionKey = to.meta.permissionKey as string | null
  if (!permissionKey) {
    return next()
  }
  const flag = checkPermission(permissionKey)
  if (!flag) {
    return next({ path: '/403', replace: true })
  }
  next()
})

export default router
