// mocks/courseTable.ts
export interface CourseTableResponse {
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
  
  export const mockCourseTable: CourseTableResponse = {
    code: 1,
    message: "success",
    data: {
      semester: "2024-2025-1",
      week: 1,
      courseTable: [
        // 第1周
        {
          date: [2024, 3, 4],
          one: null,
          two: null,
          three: null,
          four: "C语言程序设计, 教室B102, 裴涛",
          five: null,
          day: 1
        },
        {
          date: [2024, 3, 5],
          one: null,
          two: null,
          three: null,
          four: null,
          five: null,
          day: 2
        },
        {
          date: [2024, 3, 6],
          one: null,
          two: null,
          three: "C语言程序设计, 教室B102, 裴涛",
          four: null,
          five: null,
          day: 3
        },
        {
          date: [2024, 3, 7],
          one: null,
          two: null,
          three: null,
          four: null,
          five: null,
          day: 4
        },
        {
          date: [2024, 3, 8],
          one: null,
          two: "C语言程序设计, 教室B102, 裴涛",
          three: null,
          four: null,
          five: null,
          day: 5
        },
        {
          date: [2024, 3, 9],
          one: null,
          two: null,
          three: null,
          four: null,
          five: null,
          day: 6
        },
        {
          date: [2024, 3, 10],
          one: null,
          two: null,
          three: null,
          four: null,
          five: null,
          day: 7
        }
        
      ]
    }
  };
  
  // 添加mockNextWeekCourseTable
  export const mockNextWeekCourseTable: CourseTableResponse = {
    code: 1,
    message: "success",
    data: {
      semester: "2024-2025-1",
      week: 2,
      courseTable: [
       // 第2周
       {
        date: [2024, 3, 4],
        one: null,
        two: null,
        three: null,
        four: "C语言程序设计, 教室B102, 裴涛",
        five: null,
        day: 1
      },
      {
        date: [2024, 3, 5],
        one: null,
        two: null,
        three: null,
        four: null,
        five: null,
        day: 2
      },
      {
        date: [2024, 3, 6],
        one: null,
        two: null,
        three: "C语言程序设计, 教室B102, 裴涛",
        four: null,
        five: null,
        day: 3
      },
      {
        date: [2024, 3, 7],
        one: null,
        two: null,
        three: null,
        four: null,
        five: null,
        day: 4
      },
      {
        date: [2024, 3, 8],
        one: null,
        two: "C语言程序设计, 教室B102, 裴涛",
        three: null,
        four: null,
        five: null,
        day: 5
      },
      {
        date: [2024, 3, 9],
        one: null,
        two: null,
        three: null,
        four: null,
        five: null,
        day: 6
      },
      {
        date: [2024, 3, 10],
        one: null,
        two: null,
        three: null,
        four: null,
        five: null,
        day: 7
      }
      ]
    }
  };
  
  