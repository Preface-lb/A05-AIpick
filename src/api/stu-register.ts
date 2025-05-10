import request from '@/utils/request'

/**
 * 学生注册接口请求参数类型
 */
interface StudentRegisterParams {
  name: string; // 姓名
  username: string; // 邮箱
  password: string; // 密码
  college: string; // 学院名字
  grade: string;   // 年级，如2024
  studentClass: string; // 班级名字
  code: string; // 验证码
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
}

/**
 * 获取学院列表接口返回值类型
 */
interface CollegesResponse {
  code: number; // 状态码
  message: string; // 消息，null 表示成功
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
 * 获取年级列表接口返回值类型
 */
interface GradesResponse {
  code: number; // 状态码
  message: string | null; // 消息，null 表示成功
  data?: { id: number; name: string }[]; // 年级列表
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
    return response;
  }).catch((error) => {
    console.error('注册请求失败:', error);
    throw error;
  });
};

/**
 * 发送验证码接口
 * @param username - 用户邮箱
 * @returns Promise<string> 验证码
 */
export const sendCaptcha = (username: string): Promise<string> => {
  return request({
    url: '/student/sendCaptcha',
    method: 'post',
    params: { username }
  }).then((response) => {
    // 拦截器已处理code检查，直接返回response
    return response;
  }).catch((error) => {
    console.error('发送验证码请求失败:', error);
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
  }).then((response) => {
    // response 已经是学院列表数组，不需要再访问 .data.data
    console.log('api学院列表:', response);
    if (Array.isArray(response)) {
      return response as { id: number; name: string }[];
    }
    return [{ id: -1, name: '默认学院' }];
  }).catch((error) => {
    console.error('获取学院列表失败:', error);
    throw error;
  });
};
/**
 * 根据学院和年级获取班级列表接口
 */
export const getClassesByCollege = (collegeName: string, grade: string): Promise<{ id: number; name: string }[]> => {
  return request({
    url: '/student/classes',
    method: 'get',
    params: { collegeName, grade }
  }).then((response) => {
    // 直接使用response，因为拦截器已经处理过data
    console.log('api班级列表:', response);
    if (Array.isArray(response)) {
      return response as { id: number; name: string }[];
    }
    return [{ id: -1, name: '默认班级' }];
  }).catch((error) => {
    console.error('获取班级列表失败:', error);
    throw error;
  });
};
    