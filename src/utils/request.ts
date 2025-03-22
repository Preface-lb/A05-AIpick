// utils/request.ts
import axios from 'axios'

// 创建 axios 实例
const request = axios.create({
  baseURL: 'http://10.194.2.33:8081', // 修改为你的后端 API 基础 URL
  timeout: 10000  // 请求超时时间（毫秒）
})

// 可选：添加请求拦截器
request.interceptors.request.use(
  config => {
    // 如果需要可在此添加 token 或其他请求头信息
    return config
  },
  error => Promise.reject(error)
)

// 可选：添加响应拦截器
request.interceptors.response.use(
  response => response.data,
  error => Promise.reject(error)
)

export default request
