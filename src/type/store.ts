import { UserLoginInfo } from './user'

export type LoginStore = {
  /**是否登陆 */
  isLogin: boolean
  /**用户信息 */
  loginInfo: UserLoginInfo | null
}
