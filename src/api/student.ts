// api/student.ts
import request from '@/utils/request';

// 定义接口返回的数据结构
interface UserInfoData {
    username: string;
    name: string;
    studentClass: string;
    college: string;
    grade: number;
}

// 获取用户信息
export const getUserInfo = (): Promise<UserInfoData> => {
    return request({
        url: '/student/info',
        method: 'get'
    });
};