import request from '@/utils/request';

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
export const getCourseTable = (whichWeek: number,semester:string): Promise<CourseTableResponse['data']> => {


  // 生产环境调用后端接口
  return request({
    url: '/teacher/courseTable',
    method: 'get',
    params: { whichWeek,semester },
  }) as Promise<CourseTableResponse['data']>;
};