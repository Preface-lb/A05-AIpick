// utils/request.ts
import axios from 'axios'

// 创建 axios 实例
const request = axios.create({
  baseURL: 'http://10.194.2.33:8081', // 修改为你的后端 API 基础 URL
  timeout: 18000  // 请求超时时间（毫秒）
})

// 可选：添加请求拦截器
request.interceptors.request.use(
  config => {
    // 如果需要可在此添加 token 或其他请求头信息
    return config
  },
  error => Promise.reject(error)
)

// 修改响应拦截器
request.interceptors.response.use(
  response => {
    // 解析后端返回的数据格式
    const { code, message, data } = response.data

    // 根据 code 判断请求是否成功
    if (code === 1) {
      return data // 如果请求成功，返回 data
    } else {
      // 如果请求失败，抛出错误
      return Promise.reject(new Error(message || '请求失败'))
    }
  },
  error => {
    // 处理请求错误
    console.error('请求错误:', error)
    return Promise.reject(error)
  }
)

export default request
