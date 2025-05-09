//api/student.ts

import request from '@/utils/request';

// 定义接口类型
interface UserInfoResponse {
    name: string;
    grade: string;
}

// 获取用户信息
export const getUserInfo = (): Promise<UserInfoResponse> => {
    return request({
        url: '/student/info', // 后端接口地址
        method: 'get'
    }) as Promise<UserInfoResponse>;
};
    