// api/user.ts
import request from '@/utils/request';

// 定义接口类型
interface UserInfoResponse {
  name: string;
  grade: string;
}

// 获取用户信息
export const getUserInfo = (): Promise<UserInfoResponse> => {
  // 检查是否有 token，如果没有 token 则无法获取用户信息
  const token = localStorage.getItem('token');
  if (!token) {
    return Promise.reject(new Error('No token available, please login first'));
  }

  return request({
    url: '/student/login', // 后端接口地址
    method: 'get'
  }) as Promise<UserInfoResponse>;
};