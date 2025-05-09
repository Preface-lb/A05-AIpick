import axios, { 
    AxiosRequestConfig, 
    AxiosResponse,
    InternalAxiosRequestConfig,
    AxiosHeaders
} from 'axios';
import { getToken } from './token';

// 创建 axios 实例
const request = axios.create({
    baseURL: 'http://47.96.106.71:8081', 
    timeout: 18000, 
    // withCredentials: true,
});

request.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        if (config.url && config.url.startsWith('/student')) {
            const token = getToken();
            console.log("token:", token);
            if (token) {
                config.headers = config.headers || new AxiosHeaders();
                config.headers.set('satoken', `${token}`);
                console.log("设置请求头 satoken 为:", config.headers.get('satoken'));
            } else {
                console.log("未获取到有效的 token，未设置 satoken 请求头");
            }
        }

        // 添加 Content-Type 头部
        config.headers = config.headers || new AxiosHeaders();
        config.headers.set('Content-Type', 'application/json');

        return config;
    },
    (error) => {
        return Promise.reject(error); // 修复：补全 reject 调用并正确使用 error 参数
    }
);


// 修改响应拦截器
request.interceptors.response.use(
    (response: AxiosResponse) => {
        return new Promise((resolve) => {
            const { code, message, data } = response.data;
            if (code === 1) {
                console.log(data, 123);
                resolve(data);
                return data; 
            } else {
                return Promise.reject(new Error(message || '请求失败'));
            }
        })
    },
    (error) => {
        if (axios.isAxiosError(error)) {
            if (error.code === 'ECONNABORTED') {
                console.error('请求超时，请稍后重试');
            } else if (error.response) {
                console.error(`请求失败，状态码: ${error.response.status}`);
            } else {
                console.error('网络错误，请检查网络连接');
            }
        } else {
            console.error('发生未知错误:', error);
        }
        return Promise.reject(error);
    }
);

export default request;
    