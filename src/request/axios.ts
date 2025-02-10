import Axios, {
  AxiosResponse,
  InternalAxiosRequestConfig,
  isCancel,
} from 'axios'
import { IResult, RequestInstance, RequestOption } from '@/type'

const BASE_URL = '/'
const TIME_OUT = 10000

const defaultOnRequest = (config: InternalAxiosRequestConfig) => config

const defaultOnResponse = async (response: AxiosResponse): Promise<any> => {
  const res: IResult = {
    success: false,
    _header: response.headers,
    ...response.data,
  }

  if (res.code == 0) {
    res.success = true
  }
  return Promise.resolve(res)
}

const defaultOnresponseError = async (error: any): Promise<any> => {
  if (isCancel(error)) {
    return new Promise(() => {})
  }

  const { data } = error?.response || {}

  return {
    success: false,
    data,
    message: data?.message ?? 'wumessage',
  } as IResult
}

export const createRequest = (options: RequestOption) => {
  const { baseURL = BASE_URL, timeout = TIME_OUT } = options || {}
  const onRequest = options?.onRequest ?? defaultOnRequest
  const onResponse = options?.onResponse ?? defaultOnResponse
  const onResponseError = options?.onResponseError ?? defaultOnresponseError

  const request = Axios.create({
    baseURL,
    timeout,
  }) as RequestInstance

  request.interceptors.request.use(onRequest, (err: unknown) => {
    console.log('request error', err)
    return new Promise(() => {})
  })

  request.interceptors.response.use(onResponse, onResponseError)
  return request
}
