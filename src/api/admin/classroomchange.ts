import request from '@/utils/request'

// 教室信息接口
export interface Classroom {
  id: string
  name: string
  description: string
  capacity?: number
  type?: string
  building?: string
  floor?: number
}

// 获取可用教室的请求参数
export interface GetAvailableClassroomsParams {
  lessonMessage: string  // 教室,学科,老师名 格式：HXGC2#201-化工分析实验室（一）,高等数学,宁亚
  whichLesson: number    // 20240253表示202402学期的周五第三节
  lessonAtWhichWeek: number  // 要被调的课在第几周
  toWhichWeek: number    // 要调至第几周
}

// 更换教室的请求参数
export interface ChangeClassroomParams extends GetAvailableClassroomsParams {
  newClassroom: string   // 新教室名称
}

// API响应接口
export interface ApiResponse<T = any> {
  code: number
  message: string
  data?: T
}

/**
 * 获取可用教室列表
 * @param params 查询参数
 * @returns 可用教室列表
 */
export function getAvailableClassrooms(params: GetAvailableClassroomsParams): Promise<Classroom[]> {
  return request({
    url: '/admin/space/classroom',
    method: 'get',
    params,
  })
}

/**
 * 更换教室
 * @param params 更换教室参数
 * @returns 更换结果
 */
export function changeClassroom(params: ChangeClassroomParams): Promise<ApiResponse> {
  return request({
    url: '/admin/space/classroom/change',
    method: 'post',
    data: {
      lessonMessage: params.lessonMessage,
      whichLesson: params.whichLesson,
      lessonAtWhichWeek: params.lessonAtWhichWeek,
      toWhichWeek: params.toWhichWeek,
      newClassroom: params.newClassroom
    }
  })
}

/**
 * 批量获取多个时间段的可用教室
 * @param lessonList 课程列表
 * @returns 可用教室映射
 */
export function getBatchAvailableClassrooms(
  lessonList: GetAvailableClassroomsParams[]
): Promise<Record<string, Classroom[]>> {
  return request({
    url: '/admin/space/classroom/batch',
    method: 'post',
    data: { lessonList }
  })
}

/**
 * 获取教室详细信息
 * @param classroomName 教室名称
 * @returns 教室详细信息
 */
export function getClassroomDetails(classroomName: string): Promise<Classroom> {
  return request({
    url: `/admin/space/classroom/details/${encodeURIComponent(classroomName)}`,
    method: 'get'
  })
}

/**
 * 检查教室是否可用
 * @param params 检查参数
 * @returns 是否可用
 */
export function checkClassroomAvailability(params: GetAvailableClassroomsParams): Promise<boolean> {
  return request({
    url: '/admin/space/classroom/check',
    method: 'get',
    params
  })
}

// 教室信息接口定义（匹配后端返回数据）
export interface ClassroomInfo {
  id: number;
  size: number; // 容量
  building: string; // 楼宇
  name: string; // 教室名称
  deviceStatus: number; // 设备状态（1=可用，0=不可用）
  floor: number; // 楼层
  classroomType: string; // 教室类型
  airConditioner: number; // 是否有空调（1=有，0=无）
  campus: string; // 校区
}

/**
 * 获取教室详情API（使用统一的request工具）
 * @param classroomId 教室ID
 * @returns 教室详情
 */
export const getClassroomInfo = (classroomId: number): Promise<ClassroomInfo> => {
  return request({
    url: `/admin/classroomInfo/${classroomId}`, // 使用统一请求工具
    method: 'get'
  });
};