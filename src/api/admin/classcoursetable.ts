// api/admin/teacoursetable.ts

import request from '@/utils/request';

// 定义后端返回的数据结构
interface ApiResponseData {
  semester: string | null;
  week: number;
  courseTable: Array<{
    date: [number, number, number];
    one: string | null;
    two: string | null;
    three: string | null;
    four: string | null;
    five: string | null;
    day: number;
  }>;
}

// 定义获取课程表的参数类型
interface GetCourseTableParams {
  semester: string;
  week: number;
  className: string;
}

// 定义前端需要的课程表数据格式
export interface CourseTableData {
  courseTable: ApiResponseData['courseTable'];
  week: number;
  semester: string;
}

/**
 * 获取教师课程表（直接返回数据，不进行检查）
 * @param params 查询参数
 * @returns 课程表数据
 */
export const getTeacherCourseTable = async (
  params: GetCourseTableParams
): Promise<CourseTableData> => {
  try {
    // 发送请求并直接返回响应数据
    const response = await request.get<ApiResponseData>('/admin/courseTable/class', { params });
    
    return {
      courseTable: response.courseTable,
      week: response.week,
      semester: response.semester ?? params.semester
    };
  } catch (error) {
    console.error('获取课程表失败:', error);
    throw new Error('获取课程表失败，请稍后重试');
  }
};