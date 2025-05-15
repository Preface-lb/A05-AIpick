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
