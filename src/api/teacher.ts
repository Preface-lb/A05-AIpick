// api/teacher.ts
import request from '@/utils/request';

// 定义接口返回的数据结构
interface UserInfoData {
  code: number;
  message: string;
  data: {
    number: string;
    name: string;
    gender: number;
    nationality: string;
    workUnit: string;
  };
}

// 获取用户信息
export const getUserInfo = (): Promise<UserInfoData> => {
  return request({
    url: '/teacher/info',
    method: 'get'
  });
};