import request from '@/utils/request';

/**
 * 固定学期参数（写死）
 */
const FIXED_SEMESTER = '202402';

/**
 * 开始排课（将学期参数放在请求头）
 * @returns Promise<any> - 排课结果
 */
export const arrangeCourse = () => {
  return request.post('/admin/arrangeCourse', null, {
    params : {
      'whichSemester': FIXED_SEMESTER
    }
  });
};