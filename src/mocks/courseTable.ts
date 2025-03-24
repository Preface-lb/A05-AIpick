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
    semester: "2023-2024学年",
    week: 10,
    courseTable: [
      {
        date: [2023, 10, 9],
        one: "数学, 教室A101",
        two: "语文, 教室A102, 李老师",
        three: "英语, 教室A103, 王老师",
        four: null,
        five: null,
        day: 1
      },
      {
        date: [2023, 10, 10],
        one: "物理, 教室B101, 赵老师",
        two: null,
        three: "化学, 教室B102, 钱老师",
        four: "生物, 教室B103, 孙老师",
        five: null,
        day: 2
      },
      {
        date: [2023, 10, 11],
        one: null,
        two: "历史, 教室C101, 周老师",
        three: null,
        four: "地理, 教室C102, 吴老师",
        five: null,
        day: 3
      },
      {
        date: [2023, 10, 12],
        one: "政治, 教室D101, 郑老师",
        two: null,
        three: "体育, 体育馆, 高老师",
        four: null,
        five: null,
        day: 4
      },
      {
        date: [2023, 10, 13],
        one: null,
        two: null,
        three: null,
        four: null,
        five: null,
        day: 5
      },
      {
        date: [2023, 10, 14],
        one: null,
        two: null,
        three: null,
        four: null,
        five: null,
        day: 6
      },
      {
        date: [2023, 10, 15],
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

export const mockNextWeekCourseTable: CourseTableResponse = {
  code: 1,
  message: "success",
  data: {
    semester: "2023-2024学年",
    week: 11,
    courseTable: [
      {
        date: [2023, 10, 16],
        one: "数学, 教室A101, 张老师",
        two: null,
        three: "英语, 教室A103, 王老师",
        four: null,
        five: null,
        day: 1
      },
      {
        date: [2023, 10, 17],
        one: "物理, 教室B101, 赵老师",
        two: "化学, 教室B102, 钱老师",
        three: null,
        four: null,
        five: null,
        day: 2
      },
      {
        date: [2023, 10, 18],
        one: null,
        two: "历史, 教室C101, 周老师",
        three: "地理, 教室C102, 吴老师",
        four: null,
        five: null,
        day: 3
      },
      {
        date: [2023, 10, 19],
        one: "政治, 教室D101, 郑老师",
        two: null,
        three: null,
        four: null,
        five: null,
        day: 4
      },
      {
        date: [2023, 10, 20],
        one: null,
        two: null,
        three: null,
        four: null,
        five: null,
        day: 5
      },
      {
        date: [2023, 10, 21],
        one: null,
        two: null,
        three: null,
        four: null,
        five: null,
        day: 6
      },
      {
        date: [2023, 10, 22],
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