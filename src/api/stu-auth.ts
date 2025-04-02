import request from '@/utils/request';

/**
 * 学生登录接口
 * @param username - 用户邮箱
 * @param password - 登录密码
 * @returns Promise
 */
export const login = (username: string, password: string) => {
  return request({
    url: '/student/login',  // 根据你的后端接口修改路径
    method: 'post',
    data: { username, password }
  }).then(data => {
    console.log(data, 111)
    // 检查 response.data 是否存在
    if (data.data) {
      // 假设后端返回的格式是 { code: number, message: string, data: { token: string, ... } }
      if (data.code === 1) {
        const { token } = data.data;
        // 将token存储到本地存储或Vuex中，以便后续请求使用
        localStorage.setItem('token', token);
        return data.data;
      } else {
        // 处理错误情况
        return Promise.reject(data.message);
      }
    } else {
      // 处理响应数据为空的情况
      return Promise.reject('服务器返回数据格式错误');
    }
  }).catch(error => {
    // 处理网络请求错误
    console.error('请求失败', error);
    return Promise.reject('请求失败，请检查网络连接');
  });
};