import { token, sleep } from '@/utils'
import { ElMessage } from 'element-plus'
import { IResult } from '@/type'
import { createRequest } from './axios'
import { BASE_API } from '@/constant'
import type { InternalAxiosRequestConfig } from 'axios'

export const downloadFile = (data: Blob, name?: string): Promise<IResult> => {
  const render = new FileReader()
  render.readAsDataURL(data)
  return new Promise((resolve) => {
    render.onload = () => {
      render.onload = () => {
        const dataUrl = render.result?.toString()
        const downloadLink = document.createElement('a')
        if (!dataUrl) {
          resolve({ success: false, message: '下载失败' })
          return
        }

        downloadLink.href = dataUrl
        downloadLink.download = name || 'file'
        document.body.appendChild(downloadLink)
        downloadLink.click()
        setTimeout(() => {
          document.body.removeChild(downloadLink)
        }, 1000)

        resolve({ success: true, message: '下载成功' } as IResult)
      }
      render.onerror = () => {
        resolve({ success: false, message: '下载失败' } as IResult)
      }
    }
  })
}

export const ERROR_CODE_MAP: any = {
  401: '未认证',
  403: '无访问权限',
  404: '请求资源不存在',
  default: '未知错误',
}

export enum ResponseResultCode {
  Success = 200,
  NotPermission = 403,
  ServerError = 500,
}

export const request = createRequest({
  baseURL: BASE_API,
  timeout: 10000,
  onRequest(state: InternalAxiosRequestConfig) {
    if (!state) {
      return state
    }
    // const { headers, method, data } = state
    state.headers['Content-Language'] = 'zh-CN'
    if (token.getToken()) {
      state.headers.Authorization = `Bearer ${token.getToken()}`
    }
    /**TODO:请求加密 */
    return state
  },
  onResponse: async (res) => {
    const { code } = res.data || {}

    // 获取错误信息
    const msg = ERROR_CODE_MAP[code] || res.data.msg || ERROR_CODE_MAP.default
    await sleep(0)
    const result: IResult = {
      success: code === ResponseResultCode.Success,
      message: msg,
      ...res.data,
    }

    if (code === ResponseResultCode.NotPermission) {
      ElMessage.error({
        showClose: true,
        message: msg,
      })
      return new Promise(() => {})
    }
    if (res.data instanceof Blob) {
      const fileName = res?.headers?.['download-filename']
      return downloadFile(res.data, decodeURIComponent(fileName))
    }

    return result
  },
  onResponseError(error) {
    console.log(error)
    let msg = '请求失败'
    if (error?.request?.status === 500) {
      msg = '服务端错误'
    }
    if (error?.request?.status === 404) {
      msg = '接口不存在'
    }

    const res: IResult = {
      success: false,
      message: msg,
      _header: {},
    }
    return Promise.resolve(res)
  },
})
