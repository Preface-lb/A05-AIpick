import request from '@/utils/request'

/**
 * 管理员登录接口
 * @param account - 管理员用户名
 * @param password - 登录密码
 * @returns Promise
 */
export const adminLogin = (account: string, password: string) => {
  return request({
    url: '/api/admin/login', // 根据你的后端接口修改路径
    method: 'post',
    data: { account, password }
  })
}