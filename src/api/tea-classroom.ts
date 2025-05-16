import request from '@/utils/request';

export interface ClassroomItem {
  id: number;
  size: number;
  building: string;
  name: string;
  deviceStatus: number;
  floor: number;
  classroomType: string;
  airConditioner: number;
  campus: string;
}

export interface PaginationResult {
  total: number;
  rows: ClassroomItem[];
  pageNum: number;
  pageSize: number;
}

export interface ClassroomFilters {
  campus?: string;
  airConditioner?: number;
  classroomType?: string;
}

// 新增：预约时间段数据类型
export interface BookingTimeSlots {
  one: number;
  two: number;
  three: number;
  four: number;
  five: number;
  six: number;
  seven: number;
  eight: number;
  nine: number;
  ten: number;
  eleven: number;
  classroomId: number;
}

// 新增：预约结果类型
export interface BookingResult {
  code: number;
  message: string;
  data?: any;
}

export const getCourseTable = (
  pageNum: number,
  pageSize: number,
  filters: ClassroomFilters = {}
): Promise<PaginationResult> => {
  return request({
    url: '/teacher/classroomInfo',
    method: 'get',
    params: {
      pageNum,
      pageSize,
      ...filters,
    },
  });
};

// 新增：预约教室接口
export const submitClassroomBooking = (
  bookingData: BookingTimeSlots
): Promise<BookingResult> => {
  return request({
    url: '/teacher/reserve',
    method: 'put',
    data: bookingData,
  });
};  