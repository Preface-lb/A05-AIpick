// api/tea-auth.ts
import request from '@/utils/request'

/**
 * 老师登录接口
 * @param number - 老师用户名
 * @param password - 登录密码
 * @returns Promise
 */
export const teacherLogin = (number: string, password: string) => {
  return request({
    url: '/teacher/login', // 根据你的后端接口修改路径
    method: 'post',
    data: { number, password }
  })
}