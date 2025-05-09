import request from '@/utils/request';
import { setToken } from '@/utils/token';

/**
 * 学生登录接口
 * @param username - 用户邮箱
 * @param password - 登录密码
 * @returns Promise
 */
export const login = (username: string, password: string): Promise<any> => {
    return request({
        url: '/student/login',
        method: 'post',
        data: { username, password },
    }).then((response) => {
        console.log('login response', response);
        if (response && response.tokenValue) {
            console.log('set token', response.tokenValue);
            setToken(response.tokenValue);
        }
        return response;
    });
};