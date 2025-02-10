import { useLoginStore } from '@/store/login'

/**
 * 权限hooks
 */
export const usePermission = () => {
  const store = useLoginStore()
  /**
   * 权限验证
   * @param permissionKey 权限Key
   */
  const checkPermission = (permissionKey: string | null) => {
    if (!store.isLogin || !store.loginInfo) {
      return false
    }
    if (!permissionKey) {
      return true
    }
    return store.loginInfo.permission_list.includes(permissionKey)
  }
  return { checkPermission }
}
