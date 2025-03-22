import request from '@/utils/request';

/**
 * 学生注册接口请求参数类型
 */
interface StudentRegisterParams {
  name: string; // 姓名
  username: string; // 邮箱
  password: string; // 密码
  college: string; // 学院名字
  studentClass: string; // 班级名字
  captcha: string; // 验证码
}

/**
 * 学生注册接口返回值类型
 */
interface StudentRegisterResponse {
  code: number; // 状态码
  message: string | null; // 消息，null 表示成功
  data?: any; // 返回数据
}

/**
 * 发送验证码接口请求参数类型
 */
interface SendCaptchaParams {
  username: string; // 邮箱
}

/**
 * 发送验证码接口返回值类型
 */
interface SendCaptchaResponse {
  code: number; // 状态码
  message: string | null; // 消息，null 表示成功
  data?: any; // 返回数据
}

/**
 * 获取学院列表接口返回值类型
 */
interface CollegesResponse {
  code: number; // 状态码
  message: string | null; // 消息，null 表示成功
  data?: { id: number; name: string }[]; // 学院列表
}

/**
 * 获取班级列表接口返回值类型
 */
interface ClassesResponse {
  code: number; // 状态码
  message: string | null; // 消息，null 表示成功
  data?: { id: number; name: string }[]; // 班级列表
}

/**
 * 学生注册接口
 */
export const register = (data: StudentRegisterParams): Promise<StudentRegisterResponse> => {
  return request({
    url: '/student/register',
    method: 'post',
    data
  }).then((response) => {
    if (response.data && typeof response.data === 'object') {
      const { code, message, data } = response.data;
      if (code === 1) {
        return { code, message: message === null ? "" : message, data };
      }
      throw new Error(message || '注册失败');
    }
    throw new Error('注册失败，服务器返回数据格式错误');
  }).catch((error) => {
    console.error('注册请求失败:', error);
    throw error;
  });
};

/** 
 * 发送验证码接口 
 * @param username - 用户邮箱 
 * @returns Promise 
 */ 
export const sendCaptcha = (username: string): Promise<string> => { 
  return request({ 
    url: '/student/sendCaptcha', 
    method: 'post', 
    params: { username } 
  }).then((response) => { 
    // 检查 response.data  是否存在并且是一个对象 
    if (response.data  && typeof response.data  === 'object') { 
      // 检查 code 是否为 1，表示成功 
      if (response.data.code  === 1) { 
        // 检查 data 字段是否是一个字符串（验证码） 
        if (typeof response.data.data  === 'string') { 
          return response.data.data;  
        } else { 
          throw new Error('验证码格式错误'); 
        } 
      } else { 
        // 如果 code 不是 1，抛出错误，message 中包含失败原因 
        throw new Error(response.data.message  || '发送验证码失败'); 
      } 
    } else { 
      throw new Error('服务器返回数据格式错误'); 
    } 
  }).catch((error) => { 
    console.error(' 发送验证码请求失败:', error); 
    throw error; 
  }); 
}; 

/**
 * 获取学院列表接口
 * 返回数据为学院数组
 */
export const getColleges = (): Promise<{ id: number; name: string }[]> => {
  return request({
    url: '/student/colleges',
    method: 'get'
  }).then((data) => {
    if (Array.isArray(data)) {
      return data;
    }
    return [{ id: -1, name: '默认学院' }];
  }).catch((error) => {
    console.error('获取学院列表失败:', error);
    throw error;
  });
};

/**
 * 根据学院获取班级列表接口
 */
export const getClassesByCollege = (name: string): Promise<{ id: number; name: string }[]> => {
  return request({
    url: '/student/classes',
    method: 'get',
    params: { name }
  }).then((data) => {
    if (Array.isArray(data)) {
      return data.map(item => ({
        id: item.id,
        name: item.name
      }));
    }
    return [];
  }).catch((error) => {
    console.error('获取班级列表失败:', error);
    throw error;
  });
};