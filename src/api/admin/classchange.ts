import request from "@/utils/request"

// 查询可用调课时间槽的参数接口
export interface QueryAvailableSlotsParams {
  lessonMessage?: string // 教室,学科,老师名
  whichLesson?: number // 课程标识，如20240253表示202402学期的周五第三节
  lessonAtWhichWeek?: number // 要被调的课在第几周
  toWhichWeek: number // 要调至第几周
}

// 执行调课操作的参数接口
export interface AdjustmentRequestParams {
  lessonMessage: string // 教室,学科,老师名
  whichLesson: number // 课程标识
  lessonAtWhichWeek: number // 要被调的课在第几周
  toWhichWeek: number // 要调至第几周
}

// API 响应接口
export interface ApiResponse<T = any> {
  code: number
  message: string
  data?: T
}

// 查询可用调课时间槽
export function queryAvailableSlots(params: QueryAvailableSlotsParams): Promise<ApiResponse<number[]>> {
  return request({
    url: "/admin/courseTable/spaceTime",
    method: "get",
    params,
  })
}

// 执行调课操作
export function sendAdjustmentRequest(params: AdjustmentRequestParams): Promise<ApiResponse> {
  return request({
    url: "/admin/teacoursetable/adjust",
    method: "post",
    data: params,
  })
}
