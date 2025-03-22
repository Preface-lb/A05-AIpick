import request from '@/utils/request'

/**
 * 学生注册接口请求参数类型
 */
interface StudentRegisterParams {
  name: string // 姓名
  email: string // 邮箱
  password: string // 密码
  college: string // 学院名字
  studentClass: string // 班级名字
  captcha: string // 验证码
}

/**
 * 学生注册接口返回值类型
 */
interface StudentRegisterResponse {
  code: number // 状态码
  message: string | null // 消息，null 表示成功
  data?: any // 返回数据
}

/**
 * 发送验证码接口请求参数类型
 */
interface SendCaptchaParams {
  email: string // 邮箱
}

/**
 * 发送验证码接口返回值类型
 */
interface SendCaptchaResponse {
  code: number // 状态码
  message: string | null // 消息，null 表示成功
  data?: any // 返回数据
}

/**
 * 获取学院列表接口返回值类型
 */
interface CollegesResponse {
  code: number // 状态码
  message: string | null // 消息，null 表示成功
  data?: { id: number; name: string }[] // 学院列表
}

/**
 * 获取班级列表接口返回值类型
 */
interface ClassesResponse {
  code: number // 状态码
  message: string | null // 消息，null 表示成功
  data?: { id: number; name: string }[] // 班级列表
}

/**
 * 学生注册接口
 */
export const register = (data: StudentRegisterParams): Promise<StudentRegisterResponse> => {
  return request({
    url: '/student/register',
    method: 'post',
    data
  }).then((response) => {
    const { code, message, data } = response.data
    if (code === 1) {
      // 当 message 为 null 时，转换为空字符串
      return { code, message: message === null ? "" : message, data }
    }
    throw new Error(message || '注册失败')
  }).catch((error) => {
    console.error('注册请求失败:', error)
    throw error
  })
}

/**
 * 发送验证码接口
 */
export const sendCaptcha = (email: SendCaptchaParams['email']): Promise<SendCaptchaResponse> => {
  return request({
    url: '/student/send-captcha',
    method: 'post',
    params: { email }
  }).then((response) => {
    const { code, message, data } = response.data
    if (code === 1) {
      return { code, message: message === null ? "" : message, data }
    }
    throw new Error(message || '发送验证码失败')
  }).catch((error) => {
    console.error('发送验证码请求失败:', error)
    throw error
  })
}

/**
 * 获取学院列表接口
 * 返回数据为学院数组
 */
export const getColleges = (): Promise<{ id: number; name: string }[]> => {
  return request({
    url: '/student/colleges',
    method: 'get'
  }).then((response) => {
    const { code, message, data } = response.data as CollegesResponse
    if (code === 1) {
      return data || []
    }
    throw new Error(message || '获取学院列表失败')
  }).catch((error) => {
    console.error('获取学院列表失败:', error)
    throw error
  })
}

/**
 * 根据学院获取班级列表接口
 */
export const getClassesByCollege = (name: string): Promise<{ id: number; name: string }[]> => {
  return request({
    url: '/student/classes',
    method: 'get',
    params: { name }
  }).then((response) => {
    const { code, message, data } = response.data as ClassesResponse
    if (code === 1) {
      return data || []
    }
    throw new Error(message || '获取班级列表失败')
  }).catch((error) => {
    console.error('获取班级列表失败:', error)
    throw error
  })
}
