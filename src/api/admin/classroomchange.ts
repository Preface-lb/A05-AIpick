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
    params: {
      lessonMessage: params.lessonMessage,
      whichLesson: params.whichLesson,
      lessonAtWhichWeek: params.lessonAtWhichWeek,
      toWhichWeek: params.toWhichWeek
    }
  }).then((response: ApiResponse<Classroom[]>) => {
    if (response.code === 1) {
      return response.data || []
    } else {
      throw new Error(response.message || '获取可用教室失败')
    }
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
  }).then((response: ApiResponse) => {
    if (response.code !== 1) {
      throw new Error(response.message || '教室更换失败')
    }
    return response
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
  }).then((response: ApiResponse<Record<string, Classroom[]>>) => {
    if (response.code === 1) {
      return response.data || {}
    } else {
      throw new Error(response.message || '批量获取可用教室失败')
    }
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
  }).then((response: ApiResponse<Classroom>) => {
    if (response.code === 1 && response.data) {
      return response.data
    } else {
      throw new Error(response.message || '获取教室详情失败')
    }
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
  }).then((response: ApiResponse<{ available: boolean }>) => {
    if (response.code === 1) {
      return response.data?.available ?? false
    } else {
      throw new Error(response.message || '检查教室可用性失败')
    }
  })
}

// 导出类型
export type {
  Classroom,
  GetAvailableClassroomsParams,
  ChangeClassroomParams,
  ApiResponse
}