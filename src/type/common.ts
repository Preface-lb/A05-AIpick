export type RouteRecordRaw = {
  /**路由名称 */
  name?: string
  /**路由路径 */
  path: string
  /**渲染内容 */
  component: any
  /**权限Key */
  permissionKey?: string
  /**子路由 */
  children?: RouteRecordRaw[]
}
