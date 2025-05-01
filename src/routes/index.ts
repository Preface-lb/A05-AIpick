import { homeRoute } from './home'
import { chooseRoute } from './Choose'

import { TeaLoginRoute } from './TeaLogin'
import { StuLoginRoute } from './StuLogin'
import { StuRegisterRoute } from './StuRegister'
import { AdminLoginRoute } from './AdminLogin'

import { StudentRoute } from './student'
import { TeacherRoute } from './teacher'
import { AdministratorRoute } from './Administrator'
import { AdministratorpickRoute } from './Administratorpick'
import { AdministratorclassRoute } from './Administratorclass'
import { createRouter, createWebHashHistory, createMemoryHistory, RouteRecordRaw } from 'vue-router'
import { usePermission } from '@/hooks/usePermission'

const Layout = import('@/component/main-layout/index.vue')
const NotPermission = import('@/component/not-permission-page/index.vue')

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('../component/main-layout/index.vue'),
    children: [...homeRoute, ...chooseRoute, ...TeaLoginRoute, ...StuLoginRoute, ...StuRegisterRoute, ...AdminLoginRoute, ...StudentRoute, ...TeacherRoute, ...AdministratorRoute, ...AdministratorclassRoute, ...AdministratorpickRoute],
  }
]

const router = createRouter({ history: createWebHashHistory("/"), routes })

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
