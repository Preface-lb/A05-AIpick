// api/stu-auth.ts
import request from '@/utils/request'

/**
 * 学生登录接口
 * @param username - 用户邮箱
 * @param password - 登录密码
 * @returns Promise
 */
export const login = (username: string, password: string) => {
  return request({
    url: '/student/login',  // 根据你的后端接口修改路径
    method: 'post',
    data: { username, password }
  })
}
