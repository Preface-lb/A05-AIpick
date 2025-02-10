import type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios'

/** 请求返回结构通用格式 */
export interface IResult<T = any> {
  /** 是否成功 */
  success: boolean
  /** 数据 */
  data?: T
  /** 提示信息 */
  message: string
  /** 其他信息 */
  [key: string]: any
}

/**请求配置 */
export type RequestOption = {
  /** 基础路径 */
  baseURL?: string
  /** 超时时间 */
  timeout?: number
  /** 请求前处理 */
  onRequest?: (
    config: InternalAxiosRequestConfig<any>,
  ) => InternalAxiosRequestConfig<any>
  /** 返回结果处理 */
  onResponse?: (response: AxiosResponse) => Promise<IResult>
  /** 返回结果错误处理 */
  onResponseError?: (error: any) => Promise<IResult>
}

/**请求实例 */
export interface RequestInstance extends AxiosInstance {
  request<T = any, R = IResult<T>, D = any>(
    config: AxiosRequestConfig<D>,
  ): Promise<R>
  get<T = any, R = IResult<T>, D = any>(
    url: string,
    config?: AxiosRequestConfig<D>,
  ): Promise<R>
  delete<T = any, R = IResult<T>, D = any>(
    url: string,
    config?: AxiosRequestConfig<D>,
  ): Promise<R>
  head<T = any, R = IResult<T>, D = any>(
    url: string,
    config?: AxiosRequestConfig<D>,
  ): Promise<R>
  options<T = any, R = IResult<T>, D = any>(
    url: string,
    config?: AxiosRequestConfig<D>,
  ): Promise<R>
  post<T = any, R = IResult<T>, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig<D>,
  ): Promise<R>
  put<T = any, R = IResult<T>, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig<D>,
  ): Promise<R>
  patch<T = any, R = IResult<T>, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig<D>,
  ): Promise<R>
  postForm<T = any, R = IResult<T>, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig<D>,
  ): Promise<R>
  putForm<T = any, R = IResult<T>, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig<D>,
  ): Promise<R>
  patchForm<T = any, R = IResult<T>, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig<D>,
  ): Promise<R>
}
