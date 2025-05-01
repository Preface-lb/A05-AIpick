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
        one: "信息技术, 教室A101, 苏强",
        two: "高等数学, 教室A102, 李素丽",
        three: "计算机网络基础, 教室B101, 高珊珊",
        four: "C语言程序设计, 教室B102, 裴涛",
        five: null,
        day: 1
      },
      {
        date: [2024, 3, 5],
        one: "思想道德与法治, 教室C101, 李庆霞",
        two: "普通话正音1, 教室C102, 衡怡欣",
        three: "体育与健康1, 教室D101, 张林升",
        four: null,
        five: null,
        day: 2
      },
      {
        date: [2024, 3, 6],
        one: "形势与政策1, 教室E101, 孙燕华",
        two: null,
        three: null,
        four: null,
        five: null,
        day: 3
      },
      {
        date: [2024, 3, 7],
        one: null,
        two:"C语言程序设计, 教室B102, 裴涛",
        three: null,
        four: "高等数学, 教室A102, 李素丽",
        five: null,
        day: 4
      },
      {
        date: [2024, 3, 8],
        one: null,
        two: "信息技术, 教室A101, 苏强",
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
      },
      
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
      date: [2024, 3, 11],
      one: "信息技术, 教室A101, 苏强",
      two: "高等数学, 教室A102, 李素丽",
      three: "计算机网络基础, 教室B101, 高珊珊",
      four: "C语言程序设计, 教室B102, 裴涛",
      five: null,
      day: 1
    },
    {
      date: [2024, 3, 12],
      one: "思想道德与法治, 教室C101, 李庆霞",
      two: "普通话正音1, 教室C102, 衡怡欣",
      three: "体育与健康1, 教室D101, 张林升",
      four: null,
      five: null,
      day: 2
    },
    {
      date: [2024, 3, 13],
      one: "形势与政策1, 教室E101, 孙燕华",
      two: null,
      three: null,
      four: null,
      five: null,
      day: 3
    },
    {
      date: [2024, 3, 14],
      one: null,
      two:"C语言程序设计, 教室B102, 裴涛",
      three: null,
      four: "高等数学, 教室A102, 李素丽",
      five: null,
      day: 4
    },
    {
      date: [2024, 3, 15],
      one: null,
        two: "信息技术, 教室A101, 苏强",
        three: null,
        four: null,
        five: null,
        day: 5
    },
    {
      date: [2024, 3, 16],
      one: null,
      two: null,
      three: null,
      four: null,
      five: null,
      day: 6
    },
    {
      date: [2024, 3, 17],
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

