// api/tea-courseTable.ts
import request from '@/utils/request';
import { mockCourseTable, mockNextWeekCourseTable } from '@/mocks/courseTable';

// 定义课程表响应数据的接口
interface CourseTableResponse {
  code: number;
  message: string | null;
  data: {
    semester: string | null; // 学期
    week: number | null;     // 第几周
    courseTable: Array<{
      date: number[];        // 日期数组 [年, 月, 日]
      one: string | null;    // 第一节课
      two: string | null;    // 第二节课
      three: string | null;  // 第三节课
      four: string | null;   // 第四节课
      five: string | null;   // 第五节课
      day: number;           // 星期几（1-7）
    }>;
  };
}

// 获取课程表数据
export const getCourseTable = (whichWeek: number): Promise<CourseTableResponse['data']> => {
  // 在开发环境中使用模拟数据
  if (process.env.NODE_ENV === 'development') {
    if (whichWeek === 0) {
      return Promise.resolve(mockCourseTable.data);
    } else {
      return Promise.resolve(mockNextWeekCourseTable.data);
    }
  } else {
    // 在生产环境中使用真实 API
    return request({
      url: '/teacher/courseTable',
      method: 'get',
      params: { whichWeek },
    }) as Promise<CourseTableResponse['data']>;
  }
};