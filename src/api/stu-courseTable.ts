import request from '@/utils/request';
import { mockCourseTable, mockNextWeekCourseTable } from '../mocks/courseTable';

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
  // 如果是开发环境，直接返回模拟数据
  if (process.env.NODE_ENV === 'development') {
    return new Promise((resolve) => {
      // 模拟网络延迟
      setTimeout(() => {
        // 根据 whichWeek 参数返回不同的模拟数据
        if (whichWeek === 0) {
          resolve(mockCourseTable.data);
        } else {
          resolve(mockNextWeekCourseTable.data);
        }
      }, 1000);
    });
  }

  // 生产环境调用后端接口
  return request({
    url: '/student/courseTable',
    method: 'get',
    params: { whichWeek },
  }) as Promise<CourseTableResponse['data']>;
};