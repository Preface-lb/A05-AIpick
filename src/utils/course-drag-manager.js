class CourseDragManager {
  constructor() {
    this.dragData = null
    this.isActive = false
  }

  // 开始拖拽时存储课程信息
  startDrag(dragInfo) {
    this.dragData = {
      course: {
        name: dragInfo.course.name,
        room: dragInfo.course.room,
        teacher: dragInfo.course.teacher,
      },
      originalDay: dragInfo.day,
      originalTimeSlot: dragInfo.timeSlot,
      originalWeek: dragInfo.week,
      timestamp: Date.now(),
    }
    this.isActive = true

    // 存储到 localStorage 作为备份
    this.saveToStorage()

    console.log("拖拽信息已存储:", this.dragData)
  }

  // 更新目标位置信息
  updateTarget(targetDay, targetTimeSlot, targetWeek) {
    if (!this.isActive || !this.dragData) return

    this.dragData.targetDay = targetDay
    this.dragData.targetTimeSlot = targetTimeSlot
    this.dragData.targetWeek = targetWeek

    this.saveToStorage()
  }

  // 获取当前拖拽数据
  getDragData() {
    // 如果内存中没有数据，尝试从 localStorage 恢复
    if (!this.dragData) {
      this.loadFromStorage()
    }
    return this.dragData
  }

  // 获取拖拽的课程信息
  getDraggedCourse() {
    const data = this.getDragData()
    return data ? data.course : null
  }

  // 检查是否有有效的拖拽数据
  hasValidDragData() {
    const data = this.getDragData()
    if (!data) return false

    // 检查数据是否过期（超过5分钟）
    const now = Date.now()
    const maxAge = 5 * 60 * 1000 // 5分钟

    return now - data.timestamp < maxAge
  }

  // 清除拖拽数据
  clear() {
    this.dragData = null
    this.isActive = false
    this.clearStorage()
    console.log("拖拽数据已清除")
  }

  // 保存到 localStorage
  saveToStorage() {
    try {
      localStorage.setItem("courseDragData", JSON.stringify(this.dragData))
    } catch (error) {
      console.warn("保存拖拽数据到本地存储失败:", error)
    }
  }

  // 从 localStorage 加载
  loadFromStorage() {
    try {
      const stored = localStorage.getItem("courseDragData")
      if (stored) {
        const data = JSON.parse(stored)
        // 检查数据是否过期
        if (this.isDataValid(data)) {
          this.dragData = data
          this.isActive = true
          return true
        } else {
          this.clearStorage()
        }
      }
    } catch (error) {
      console.warn("从本地存储加载拖拽数据失败:", error)
      this.clearStorage()
    }
    return false
  }

  // 检查数据有效性
  isDataValid(data) {
    if (!data || !data.course || !data.timestamp) return false

    const now = Date.now()
    const maxAge = 5 * 60 * 1000 // 5分钟

    return now - data.timestamp < maxAge
  }

  // 清除本地存储
  clearStorage() {
    try {
      localStorage.removeItem("courseDragData")
    } catch (error) {
      console.warn("清除本地存储失败:", error)
    }
  }

  // 获取调课摘要信息
  getAdjustmentSummary() {
    const data = this.getDragData()
    if (!data) return null

    return {
      courseName: data.course.name,
      courseRoom: data.course.room,
      courseTeacher: data.course.teacher,
      originalWeek: data.originalWeek,
      originalDay: data.originalDay,
      originalTimeSlot: data.originalTimeSlot,
      targetWeek: data.targetWeek,
      targetDay: data.targetDay,
      targetTimeSlot: data.targetTimeSlot,
      isCrossWeek: data.originalWeek !== data.targetWeek,
    }
  }
}

// 创建单例实例
const courseDragManager = new CourseDragManager()

// 导出单例实例
export { courseDragManager }