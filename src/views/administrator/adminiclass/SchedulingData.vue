<template>
  <div class="schedule-container">
    <!-- Header Section -->
    <div class="header-section">
      <div class="header-content">
        <h1 class="page-title">
          <Calendar class="title-icon" />
          课程调度系统
        </h1>
        <p class="page-subtitle">智能课程管理与多周跨越调课</p>
      </div>
      <div class="header-actions">
        <button 
          @click="toggleAdjustMode" 
          class="action-btn"
          :class="{ 'active': isAdjustMode }"
        >
          <MoveHorizontal class="action-icon" />
          {{ isAdjustMode ? '退出调课' : '开始调课' }}
        </button>
      </div>
    </div>

    <!-- Query Section -->
    <div class="card">
      <div class="card-header">
        <Search class="card-icon" />
        <span class="card-title">查询条件</span>
      </div>
      <div class="query-form">
        <div class="form-group">
          <label class="form-label">学期</label>
          <input 
            v-model="semester" 
            placeholder="请输入学期，如：202402" 
            class="form-input"
            type="text"
          />
        </div>
        <div class="form-group">
          <label class="form-label">周次</label>
          <input 
            v-model="week" 
            placeholder="周次" 
            class="form-input"
            type="number"
            min="1"
          />
        </div>
        <div class="form-group">
          <label class="form-label">教师姓名</label>
          <input 
            v-model="teacher" 
            placeholder="请输入教师姓名" 
            class="form-input"
            type="text"
          />
        </div>
        <button 
          @click="confirmInfo" 
          class="primary-btn"
          :disabled="loading"
        >
          <Search class="btn-icon" />
          {{ loading ? '查询中...' : '查询' }}
        </button>
      </div>
    </div>

    <!-- Week Navigation -->
    <div class="card week-navigation">
      <div class="week-controls">
        <button @click="jumpWeeks(-5)" class="week-jump-btn" :disabled="loading || currentDisplayWeek <= 5">
          <ChevronsLeft class="nav-icon" />
          -5周
        </button>
        <button @click="changeWeek(-1)" class="week-nav-btn" :disabled="loading || currentDisplayWeek <= 1">
          <ChevronLeft class="nav-icon" />
          上一周
        </button>
        <div class="week-display">
          <span class="week-text">第 {{ currentDisplayWeek }} 周</span>
          <span class="week-date">{{ getWeekDateRange(currentDisplayWeek) }}</span>
        </div>
        <button @click="changeWeek(1)" class="week-nav-btn" :disabled="loading">
          下一周
          <ChevronRight class="nav-icon" />
        </button>
        <button @click="jumpWeeks(5)" class="week-jump-btn" :disabled="loading">
          +5周
          <ChevronsRight class="nav-icon" />
        </button>
      </div>
      
      <div v-if="isAdjustMode && isDragging" class="drag-status">
        <div class="drag-info">
          <span class="drag-label">拖拽课程:</span>
          <span class="drag-value">{{ draggedCourse?.name }}</span>
        </div>
        <div class="drag-info">
          <span class="drag-label">原始周次:</span>
          <span class="drag-value">第 {{ originalWeek }} 周</span>
        </div>
        <div class="drag-info">
          <span class="drag-label">目标周次:</span>
          <span class="drag-value">第 {{ currentDisplayWeek }} 周</span>
          <span v-if="currentDisplayWeek !== originalWeek" class="cross-week-badge">
            {{ currentDisplayWeek > originalWeek ? '向后' : '向前' }}跨 {{ Math.abs(currentDisplayWeek - originalWeek) }} 周
          </span>
        </div>
        <div class="drag-info">
          <span class="drag-label">可用时间槽:</span>
          <span class="drag-value">{{ availableSlots.length }}个</span>
        </div>
      </div>
    </div>

    <!-- Course Table -->
    <div class="card table-card">
      <div class="card-header">
        <BookOpen class="card-icon" />
        <span class="card-title">课程安排表</span>
        <div class="table-info" v-if="teacher">
          <User class="info-icon" />
          {{ teacher }} 老师 - {{ semester }} 学期
        </div>
      </div>
      
      <div v-if="isAdjustMode" class="adjust-mode-tips">
        <div class="tip-item">
          <MousePointer class="tip-icon" />
          <span>拖拽课程卡片边缘到可用时间槽</span>
        </div>
        <div class="tip-item">
          <ArrowLeftRight class="tip-icon" />
          <span>拖到左右边界可跨周调课</span>
        </div>
      </div>
      
      <!-- 跨周提示区域 - 移到表格外部 -->
      <div v-if="isDragging" class="cross-week-zones">
        <div 
          class="cross-week-zone cross-week-zone-left"
          :class="{ 'active': isInLeftZone }"
          @dragover.prevent="handleLeftZoneDragOver"
          @dragleave="handleLeftZoneDragLeave"
        >
          <div class="cross-week-content">
            <ChevronLeft class="cross-week-icon" />
            <span class="cross-week-text">向前跨周</span>
            <span class="cross-week-week">第{{ Math.max(1, currentDisplayWeek - 1) }}周</span>
          </div>
        </div>

        <div 
          class="cross-week-zone cross-week-zone-right"
          :class="{ 'active': isInRightZone }"
          @dragover.prevent="handleRightZoneDragOver"
          @dragleave="handleRightZoneDragLeave"
        >
          <div class="cross-week-content">
            <ChevronRight class="cross-week-icon" />
            <span class="cross-week-text">向后跨周</span>
            <span class="cross-week-week">第{{ currentDisplayWeek + 1 }}周</span>
          </div>
        </div>
      </div>
      
      <div class="table-container" :class="{ 'loading': loading, 'adjust-mode': isAdjustMode }">
        <div v-if="loading" class="loading-overlay">
          <div class="loading-spinner"></div>
          <p class="loading-text">{{ loadingText }}</p>
        </div>
        
        <div 
          ref="scheduleTable"
          class="schedule-table"
          @dragover="handleTableDragOver"
          @wheel="handleWheel"
        >
          <div class="table-header-row">
            <div class="time-header">时间</div>
            <div 
              v-for="(day, index) in days" 
              :key="index"
              class="day-header"
            >
              <div class="day-name">{{ day }}</div>
              <div class="day-date">{{ getDayDate(index, currentDisplayWeek) }}</div>
            </div>
          </div>
          
          <div class="table-body">
            <div 
              v-for="(timeSlot, timeIndex) in timeSlots" 
              :key="timeIndex"
              class="table-row"
            >
              <div class="time-cell">
                <Clock class="time-icon" />
                <span class="time-text">{{ timeSlot }}</span>
              </div>
              <div 
                v-for="(day, dayIndex) in days" 
                :key="dayIndex"
                class="course-cell"
                :class="{ 
                  'has-course': hasCourse(dayIndex + 1, timeIndex),
                  'droppable': isDroppable(dayIndex + 1, timeIndex),
                  'drag-over': isDragOver(dayIndex + 1, timeIndex),
                  'highlight-available': isAdjustMode && isAvailableSlot(dayIndex + 1, timeIndex)
                }"
                @dragover.prevent="handleDragOver(dayIndex + 1, timeIndex)"
                @dragleave="handleDragLeave()"
                @drop.prevent="handleDrop(dayIndex + 1, timeIndex)"
              >
                <div 
                  v-if="hasCourse(dayIndex + 1, timeIndex)"
                  class="course-content"
                  :class="{ 'draggable': isAdjustMode }"
                  :draggable="isAdjustMode"
                  @dragstart="handleDragStart($event, dayIndex + 1, timeIndex)"
                  @mousedown="handleMouseDown"
                  @mouseup="handleMouseUp"
                >
                  <div class="drag-handle" v-if="isAdjustMode">
                    <div class="drag-dots">
                      <div class="dot"></div>
                      <div class="dot"></div>
                      <div class="dot"></div>
                    </div>
                  </div>
                  <div class="course-info">
                    <div class="course-name">
                      {{ getCourse(dayIndex + 1, timeIndex).name }}
                    </div>
                    <div class="course-room">
                      <MapPin class="room-icon" />
                      {{ getCourse(dayIndex + 1, timeIndex).room }}
                    </div>
                    <div class="course-teacher" v-if="getCourse(dayIndex + 1, timeIndex).teacher">
                      <User class="teacher-icon" />
                      {{ getCourse(dayIndex + 1, timeIndex).teacher }}
                    </div>
                  </div>
                </div>
                <div v-else-if="isAdjustMode && isAvailableSlot(dayIndex + 1, timeIndex)" class="available-slot">
                  <CheckCircle class="available-icon" />
                  <span>可用时间槽</span>
                </div>
                <div v-else class="empty-cell">
                  <span class="empty-text">无课程</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Adjustment Confirmation Dialog -->
    <div v-if="showConfirmDialog" class="dialog-overlay">
      <div class="dialog-container">
        <div class="dialog-header">
          <h3 class="dialog-title">确认调课</h3>
          <button @click="cancelAdjustment" class="dialog-close-btn">
            <X class="close-icon" />
          </button>
        </div>
        <div class="dialog-content">
          <p class="dialog-text">您确定要将以下课程进行调整吗？</p>
          <div class="course-details">
            <div class="detail-item">
              <span class="detail-label">课程:</span>
              <span class="detail-value">{{ draggedCourse.name || '未知课程' }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">教室:</span>
              <span class="detail-value">{{ draggedCourse.room || '未知教室' }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">原时间:</span>
              <span class="detail-value">第{{ originalWeek }}周 {{ days[draggedDay - 1] }} {{ timeSlots[draggedTimeSlot] }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">调整至:</span>
              <span class="detail-value">第{{ targetWeek }}周 {{ days[targetDay - 1] }} {{ timeSlots[targetTimeSlot] }}</span>
            </div>
            <div v-if="originalWeek !== targetWeek" class="detail-item cross-week-notice">
              <span class="detail-label">注意:</span>
              <span class="detail-value">
                {{ targetWeek > originalWeek ? '向后' : '向前' }}跨 {{ Math.abs(originalWeek - targetWeek) }} 周调课操作
              </span>
            </div>
          </div>
        </div>
        <div class="dialog-footer">
          <button @click="cancelAdjustment" class="dialog-btn dialog-btn-cancel">取消</button>
          <button @click="confirmAdjustment" class="dialog-btn dialog-btn-confirm" :disabled="adjustmentLoading">
            {{ adjustmentLoading ? '调课中...' : '确认调课' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Toast Notification -->
    <div v-if="toastMessage" class="toast-notification" :class="{ 'show': showToast }">
      <div class="toast-content">
        <CheckCircle v-if="toastType === 'success'" class="toast-icon toast-success" />
        <AlertCircle v-else class="toast-icon toast-error" />
        <span class="toast-text">{{ toastMessage }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { 
  Calendar, Search, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight,
  BookOpen, User, Clock, MapPin, CheckCircle, AlertCircle, MoveHorizontal, X,
  MousePointer, ArrowLeftRight
} from 'lucide-vue-next'
import { getTeacherCourseTable } from '@/api/admin/teacoursetable'
import { queryAvailableSlots, sendAdjustmentRequest } from '@/api/admin/classchange'

export default {
  name: 'TeacherScheduleAdjustment',
  components: {
    Calendar, Search, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight,
    BookOpen, User, Clock, MapPin, CheckCircle, AlertCircle, MoveHorizontal, X,
    MousePointer, ArrowLeftRight
  },
  data() {
    return {
      semester: '202402',
      week: 1,
      teacher: '',
      currentWeek: 1,
      currentDisplayWeek: 1,
      originalWeek: 1,
      days: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
      timeSlots: [
        '08:00-9:40',
        '10:00-11:40',
        '14:00-15:40',
        '16:00-17:40',
        '19:00-20:40'
      ],
      courses: [],
      coursesCache: new Map(),
      loading: false,
      loadingText: '正在加载课程表...',
      startDate: new Date(2025, 1, 24),
      toastMessage: '',
      showToast: false,
      toastType: 'success',
      
      // 调课相关数据
      isAdjustMode: false,
      isDragging: false,
      draggedDay: null,
      draggedTimeSlot: null,
      draggedCourse: null,
      availableSlots: [],
      availableSlotsCache: new Map(),
      currentDragOver: null,
      adjustmentLoading: false,
      
      // 跨周相关
      isInLeftZone: false,
      isInRightZone: false,
      crossWeekThreshold: 60,
      crossWeekTimer: null,
      wheelTimer: null,
      
      // 确认对话框
      showConfirmDialog: false,
      targetDay: null,
      targetTimeSlot: null,
      targetWeek: null,
      
      // 拖拽优化
      isDragActive: false
    }
  },
  mounted() {
    this.confirmInfo()
    document.addEventListener('dragend', this.handleDragEnd)
  },
  beforeUnmount() {
    document.removeEventListener('dragend', this.handleDragEnd)
    this.clearTimers()
  },
  methods: {
    clearTimers() {
      if (this.crossWeekTimer) {
        clearTimeout(this.crossWeekTimer)
        this.crossWeekTimer = null
      }
      if (this.wheelTimer) {
        clearTimeout(this.wheelTimer)
        this.wheelTimer = null
      }
    },

    async confirmInfo() {
      if (!this.semester || !this.teacher) {
        this.showToastMessage('请输入学期和教师姓名', 'error')
        return
      }
      
      const targetWeek = this.week || this.currentWeek
      await this.loadCourseTable(targetWeek)
      this.currentWeek = targetWeek
      this.currentDisplayWeek = targetWeek
    },

    async loadCourseTable(week) {
      const cacheKey = `${this.semester}-${week}-${this.teacher}`
      if (this.coursesCache.has(cacheKey)) {
        this.courses = this.coursesCache.get(cacheKey)
        return
      }

      this.loading = true
      this.loadingText = `正在加载第${week}周课程表...`
      
      try {
        const response = await getTeacherCourseTable({
          semester: this.semester,
          week: week,
          teacher: this.teacher
        })
        
        const courses = this.transformCourseData(response.courseTable)
        this.courses = courses
        this.coursesCache.set(cacheKey, courses)
        this.showToastMessage(`第${week}周课程表加载成功`, 'success')
      } catch (error) {
        console.error('请求失败:', error)
        this.showToastMessage(error.message || '请求失败，请稍后重试', 'error')
        this.courses = []
      } finally {
        this.loading = false
      }
    },

    transformCourseData(courseTable) {
      const courses = []
      const timeSlotMap = {
        one: 0, two: 1, three: 2, four: 3,
        five: 4, six: 5, seven: 6
      }

      courseTable.forEach(dayData => {
        for (const [slotKey, slotIndex] of Object.entries(timeSlotMap)) {
          const courseInfo = dayData[slotKey]
          if (courseInfo) {
            const [room, name, teacher] = courseInfo.split(',')
            courses.push({
              day: dayData.day,
              timeSlot: slotIndex,
              name,
              room,
              teacher
            })
          }
        }
      })

      return courses
    },
    
    async changeWeek(delta) {
      const newWeek = this.currentDisplayWeek + delta
      if (newWeek < 1) return
      
      await this.switchDisplayWeek(newWeek)
      
      if (!this.isDragging) {
        this.currentWeek = newWeek
        this.week = newWeek
      }
    },

    async jumpWeeks(delta) {
      const newWeek = this.currentDisplayWeek + delta
      if (newWeek < 1) return
      
      await this.switchDisplayWeek(newWeek)
      
      if (!this.isDragging) {
        this.currentWeek = newWeek
        this.week = newWeek
      }
    },

    async switchDisplayWeek(targetWeek) {
      if (targetWeek < 1 || targetWeek === this.currentDisplayWeek) return
      
      this.currentDisplayWeek = targetWeek
      await this.loadCourseTable(targetWeek)
      
      if (this.isDragging) {
        await this.queryAvailableSlots(targetWeek)
      }
    },
    
    getDayDate(dayIndex, week = null) {
      const targetWeek = week || this.currentDisplayWeek
      const date = new Date(this.startDate)
      date.setDate(date.getDate() + (targetWeek - 1) * 7 + dayIndex)
      return `${date.getMonth() + 1}/${date.getDate()}`
    },

    getWeekDateRange(week = null) {
      const targetWeek = week || this.currentDisplayWeek
      const startDate = new Date(this.startDate)
      startDate.setDate(startDate.getDate() + (targetWeek - 1) * 7)
      const endDate = new Date(startDate)
      endDate.setDate(endDate.getDate() + 6)
      
      return `${startDate.getMonth() + 1}月${startDate.getDate()}日 - ${endDate.getMonth() + 1}月${endDate.getDate()}日`
    },
    
    hasCourse(day, timeSlotIndex) {
      return this.courses.some(course => 
        course.day === day && course.timeSlot === timeSlotIndex
      )
    },
    
    getCourse(day, timeSlotIndex) {
      return this.courses.find(course => 
        course.day === day && course.timeSlot === timeSlotIndex
      ) || {}
    },

    showToastMessage(message, type = 'success') {
      this.toastMessage = message
      this.toastType = type
      this.showToast = true
      
      setTimeout(() => {
        this.showToast = false
        setTimeout(() => {
          this.toastMessage = ''
        }, 300)
      }, 3000)
    },
    
    toggleAdjustMode() {
      this.isAdjustMode = !this.isAdjustMode
      if (!this.isAdjustMode) {
        this.resetDragState()
      }
    },
    
    resetDragState() {
      this.isDragging = false
      this.isDragActive = false
      this.draggedDay = null
      this.draggedTimeSlot = null
      this.draggedCourse = null
      this.originalWeek = this.currentWeek
      this.availableSlots = []
      this.currentDragOver = null
      this.isInLeftZone = false
      this.isInRightZone = false
      this.clearTimers()
      
      if (this.currentDisplayWeek !== this.currentWeek) {
        this.switchDisplayWeek(this.currentWeek)
      }
    },

    // 优化的鼠标事件处理
    handleMouseDown() {
      this.isDragActive = true
    },

    handleMouseUp() {
      this.isDragActive = false
    },

    handleWheel(event) {
      if (!this.isDragging) return
      
      event.preventDefault()
      
      if (this.wheelTimer) {
        clearTimeout(this.wheelTimer)
      }
      
      this.wheelTimer = setTimeout(async () => {
        const delta = event.deltaY > 0 ? 1 : -1
        const targetWeek = this.currentDisplayWeek + delta
        
        if (targetWeek >= 1) {
          await this.switchDisplayWeek(targetWeek)
          this.showToastMessage(`已切换到第${targetWeek}周`, 'success')
        }
      }, 100)
    },

    handleLeftZoneDragOver(event) {
      event.preventDefault()
      if (!this.isInLeftZone && this.currentDisplayWeek > 1) {
        this.isInLeftZone = true
        this.handleCrossWeekZoneEnter('left')
      }
    },

    handleLeftZoneDragLeave() {
      this.isInLeftZone = false
      this.clearTimers()
    },

    handleRightZoneDragOver(event) {
      event.preventDefault()
      if (!this.isInRightZone) {
        this.isInRightZone = true
        this.handleCrossWeekZoneEnter('right')
      }
    },

    handleRightZoneDragLeave() {
      this.isInRightZone = false
      this.clearTimers()
    },

    handleCrossWeekZoneEnter(direction) {
      this.clearTimers()
      
      this.crossWeekTimer = setTimeout(async () => {
        const delta = direction === 'left' ? -1 : 1
        const targetWeek = this.currentDisplayWeek + delta
        
        if (targetWeek >= 1) {
          await this.switchDisplayWeek(targetWeek)
          this.showToastMessage(`已切换到第${targetWeek}周`, 'success')
        }
      }, 800)
    },

    handleTableDragOver(event) {
      this.isInLeftZone = false
      this.isInRightZone = false
      this.clearTimers()
    },

    handleDragEnd() {
      this.resetDragState()
    },
    
    handleDragStart(event, day, timeSlot) {
      if (!this.isAdjustMode) return
      
      const course = this.getCourse(day, timeSlot)
      if (!course) return
      
      this.isDragging = true
      this.draggedDay = day
      this.draggedTimeSlot = timeSlot
      this.draggedCourse = course
      this.originalWeek = this.currentDisplayWeek
      
      this.availableSlotsCache.clear()
      
      event.dataTransfer.setData('text/plain', JSON.stringify({
        day,
        timeSlot,
        course: course,
        week: this.originalWeek
      }))
      
      event.dataTransfer.effectAllowed = 'move'
      
      // 设置拖拽图像为透明，使用自定义样式
      const dragImage = new Image()
      dragImage.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs='
      event.dataTransfer.setDragImage(dragImage, 0, 0)
      
      this.queryAvailableSlots(this.currentDisplayWeek)
    },
    
    handleDragOver(day, timeSlot) {
      if (!this.isDragging || !this.isDroppable(day, timeSlot)) return
      this.currentDragOver = `${day}-${timeSlot}`
    },
    
    handleDragLeave() {
      this.currentDragOver = null
    },
    
    handleDrop(day, timeSlot) {
      if (!this.isDragging || !this.isDroppable(day, timeSlot)) return
      
      this.targetDay = day
      this.targetTimeSlot = timeSlot
      this.targetWeek = this.currentDisplayWeek
      
      this.showConfirmDialog = true
    },
    
    async confirmAdjustment() {
      this.adjustmentLoading = true
      
      try {
        const lessonMessage = `${this.draggedCourse.room},${this.draggedCourse.name},${this.draggedCourse.teacher || this.teacher}`
        const whichLesson = parseInt(`${this.semester}${this.draggedDay}${this.draggedTimeSlot + 1}`)
        
        const response = await sendAdjustmentRequest({
          lessonMessage,
          whichLesson,
          lessonAtWhichWeek: this.originalWeek,
          toWhichWeek: this.targetWeek
        })
        
        if (response.code === 1) {
          const weekDiff = Math.abs(this.originalWeek - this.targetWeek)
          const direction = this.targetWeek > this.originalWeek ? '向后' : '向前'
          const successMessage = weekDiff > 0 
            ? `${direction}跨${weekDiff}周调课成功！课程已从第${this.originalWeek}周调至第${this.targetWeek}周` 
            : '调课成功！'
          
          this.showToastMessage(successMessage, 'success')
          
          this.coursesCache.clear()
          await this.loadCourseTable(this.originalWeek)
          
          if (this.targetWeek !== this.originalWeek) {
            await this.loadCourseTable(this.targetWeek)
          }
          
          this.currentDisplayWeek = this.currentWeek
          await this.loadCourseTable(this.currentWeek)
          
        } else {
          throw new Error(response.message || '调课失败')
        }
      } catch (error) {
        console.error('调课失败:', error)
        this.showToastMessage(error.message || '调课失败，请稍后重试', 'error')
      } finally {
        this.adjustmentLoading = false
        this.showConfirmDialog = false
        this.resetDragState()
      }
    },

    cancelAdjustment() {
      this.showConfirmDialog = false
      this.resetDragState()
    },
    
    async queryAvailableSlots(targetWeek) {
      if (!this.draggedCourse) return
      
      const cacheKey = `${this.originalWeek}-${targetWeek}-${this.draggedDay}-${this.draggedTimeSlot}`
      
      if (this.availableSlotsCache.has(cacheKey)) {
        this.availableSlots = this.availableSlotsCache.get(cacheKey)
        return
      }
      
      try {
        const lessonMessage = `${this.draggedCourse.room},${this.draggedCourse.name},${this.draggedCourse.teacher || this.teacher}`
        const whichLesson = parseInt(`${this.semester}${this.draggedDay}${this.draggedTimeSlot + 1}`)
        
        const response = await queryAvailableSlots({
          lessonMessage,
          whichLesson,
          lessonAtWhichWeek: this.originalWeek,
          toWhichWeek: targetWeek
        })
        
        this.availableSlots = response || []
        this.availableSlotsCache.set(cacheKey, this.availableSlots)
        
      } catch (error) {
        console.error('查询可用时间槽失败:', error)
        this.availableSlots = []
      }
    },
    
    isDroppable(day, timeSlot) {
      if (!this.isDragging) return false
      
      return this.availableSlots.some(slot => {
        const slotDay = Math.floor(slot / 10)
        const slotTime = (slot % 10) - 1
        return slotDay === day && slotTime === timeSlot
      })
    },
    
    isAvailableSlot(day, timeSlot) {
      if (!this.isDragging) return false
      
      return this.availableSlots.some(slot => {
        const slotDay = Math.floor(slot / 10)
        const slotTime = (slot % 10) - 1
        return slotDay === day && slotTime === timeSlot
      })
    },
    
    isDragOver(day, timeSlot) {
      return this.currentDragOver === `${day}-${timeSlot}`
    }
  }
}
</script>

<style scoped>
/* 全局样式 */
.schedule-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1.5rem;
  font-family: 'Inter', system-ui, sans-serif;
  color: #1a1a1a;
  background-color: #f9fafb;
  min-height: 100vh;
}

/* 卡片通用样式 */
.card {
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.1);
  margin-bottom: 1.5rem;
  overflow: hidden;
  transition: box-shadow 0.3s ease;
}

.card:hover {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  align-items: center;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #f0f0f0;
}

.card-icon {
  width: 1.25rem;
  height: 1.25rem;
  color: #4f46e5;
  margin-right: 0.75rem;
}

.card-title {
  font-weight: 600;
  font-size: 1rem;
  color: #111827;
}

/* 头部区域 */
.header-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
  color: white;
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.header-content {
  display: flex;
  flex-direction: column;
}

.page-title {
  display: flex;
  align-items: center;
  font-size: 1.75rem;
  font-weight: 700;
  margin: 0;
}

.title-icon {
  width: 1.75rem;
  height: 1.75rem;
  margin-right: 0.75rem;
}

.page-subtitle {
  margin: 0.5rem 0 0 0;
  opacity: 0.9;
  font-size: 1rem;
}

.header-actions {
  display: flex;
  gap: 1rem;
}

/* 查询表单 */
.query-form {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  padding: 1.5rem;
  align-items: flex-end;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex: 1;
  min-width: 200px;
}

.form-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #4b5563;
}

.form-input {
  padding: 0.75rem 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 0.875rem;
  transition: all 0.2s ease;
  background-color: #f9fafb;
}

.form-input:focus {
  outline: none;
  border-color: #4f46e5;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
  background-color: white;
}

.primary-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: #4f46e5;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 120px;
}

.primary-btn:hover {
  background: #4338ca;
  transform: translateY(-1px);
}

.primary-btn:active {
  transform: translateY(0);
}

.primary-btn:disabled {
  background: #a5b4fc;
  cursor: not-allowed;
  transform: none;
}

.btn-icon {
  width: 1rem;
  height: 1rem;
}

/* 周次导航 */
.week-navigation {
  padding: 1.5rem;
}

.week-controls {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}

.week-nav-btn, .week-jump-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background-color: white;
  color: #4b5563;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.week-nav-btn:hover, .week-jump-btn:hover {
  background-color: #f9fafb;
  border-color: #d1d5db;
}

.week-nav-btn:disabled, .week-jump-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.week-jump-btn {
  background-color: #f3f4f6;
}

.nav-icon {
  width: 1rem;
  height: 1rem;
}

.week-display {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 200px;
}

.week-text {
  font-weight: 700;
  font-size: 1.25rem;
  color: #111827;
}

.week-date {
  font-size: 0.875rem;
  color: #6b7280;
  margin-top: 0.25rem;
}

.drag-status {
  margin-top: 1.5rem;
  padding: 1rem;
  background-color: #f3f4f6;
  border-radius: 8px;
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.drag-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.drag-label {
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 500;
}

.drag-value {
  font-size: 0.875rem;
  color: #111827;
  font-weight: 600;
}

.cross-week-badge {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
}

/* 调课模式提示 */
.adjust-mode-tips {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  padding: 1rem 1.5rem;
  background-color: #f0f9ff;
  border-bottom: 1px solid #e0f2fe;
}

.tip-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #0369a1;
}

.tip-icon {
  width: 1rem;
  height: 1rem;
}

/* 课程表 */
.table-card {
  position: relative;
  overflow: visible;
}

.table-info {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #6b7280;
}

.info-icon {
  width: 1rem;
  height: 1rem;
}

/* 优化的跨周区域 - 移到表格外部 */
.cross-week-zones {
  position: relative;
  height: 0;
  z-index: 100;
}

.cross-week-zone {
  position: absolute;
  top: 20px;
  width: 120px;
  height: 400px;
  background: linear-gradient(135deg, rgba(79, 70, 229, 0.05) 0%, rgba(79, 70, 229, 0.1) 100%);
  border: 2px dashed rgba(79, 70, 229, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  border-radius: 12px;
  backdrop-filter: blur(4px);
}

.cross-week-zone-left {
  left: -140px;
}

.cross-week-zone-right {
  right: -140px;
}

.cross-week-zone.active {
  background: linear-gradient(135deg, rgba(79, 70, 229, 0.15) 0%, rgba(79, 70, 229, 0.25) 100%);
  border-color: rgba(79, 70, 229, 0.6);
  transform: scale(1.05);
  box-shadow: 0 8px 25px rgba(79, 70, 229, 0.2);
}

.cross-week-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  color: #4f46e5;
  font-weight: 600;
  text-align: center;
}

.cross-week-icon {
  width: 2rem;
  height: 2rem;
}

.cross-week-text {
  font-size: 1rem;
}

.cross-week-week {
  font-size: 0.875rem;
  background-color: #4f46e5;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(79, 70, 229, 0.3);
}

.table-container {
  position: relative;
  overflow-x: auto;
}

.table-container.adjust-mode {
  padding: 0 20px;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.9);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 10;
  backdrop-filter: blur(4px);
}

.loading-spinner {
  width: 2.5rem;
  height: 2.5rem;
  border: 3px solid #e5e7eb;
  border-top-color: #4f46e5;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading-text {
  margin-top: 1rem;
  color: #6b7280;
  font-weight: 500;
}

/* 课程表格 */
.schedule-table {
  width: 100%;
  border-collapse: collapse;
  border-radius: 8px;
  overflow: hidden;
}

.table-header-row {
  display: grid;
  grid-template-columns: 100px repeat(7, 1fr);
  background-color: #f9fafb;
}

.time-header, .day-header {
  padding: 1rem;
  text-align: center;
  border: 1px solid #e5e7eb;
  font-weight: 500;
}

.day-name {
  font-weight: 600;
  color: #111827;
}

.day-date {
  font-size: 0.75rem;
  color: #6b7280;
  margin-top: 0.25rem;
}

.table-row {
  display: grid;
  grid-template-columns: 100px repeat(7, 1fr);
}

.time-cell {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  border: 1px solid #e5e7eb;
  background-color: #f9fafb;
}

.time-icon {
  width: 1rem;
  height: 1rem;
  color: #6b7280;
  margin-bottom: 0.25rem;
}

.time-text {
  font-size: 0.75rem;
  color: #6b7280;
}

.course-cell {
  position: relative;
  min-height: 100px;
  padding: 0.5rem;
  border: 1px solid #e5e7eb;
  transition: all 0.2s ease;
  background-color: white;
}

.course-cell.has-course {
  background-color: #f0f9ff;
}

.course-cell.highlight-available {
  background-color: #ecfdf5;
  border: 2px dashed #10b981;
  animation: pulse-available 2s infinite;
}

@keyframes pulse-available {
  0%, 100% { 
    background-color: #ecfdf5;
    border-color: #10b981;
  }
  50% { 
    background-color: #d1fae5;
    border-color: #059669;
  }
}

.course-cell.droppable {
  background-color: #ecfdf5;
  border: 2px solid #10b981;
}

.course-cell.drag-over {
  background-color: #d1fae5;
  border: 3px solid #059669;
  transform: scale(1.05);
  z-index: 2;
  box-shadow: 0 8px 25px rgba(5, 150, 105, 0.3);
}

/* 优化的课程内容样式 */
.course-content {
  height: 100%;
  display: flex;
  gap: 0.5rem;
  cursor: default;
  transition: all 0.2s ease;
  padding: 0.75rem;
  border-radius: 8px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.9) 100%);
  border: 1px solid rgba(79, 70, 229, 0.1);
  position: relative;
}

.course-content.draggable {
  cursor: grab;
  user-select: none;
}

.course-content.draggable:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(79, 70, 229, 0.15);
  border-color: rgba(79, 70, 229, 0.3);
}

.course-content.draggable:active {
  cursor: grabbing;
  transform: scale(0.98);
}

/* 拖拽手柄
.drag-handle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  flex-shrink: 0;
  cursor: grab;
}

.drag-dots {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.dot {
  width: 4px;
  height: 4px;
  background-color: #9ca3af;
  border-radius: 50%;
  transition: background-color 0.2s ease;
}

.course-content:hover .dot {
  background-color: #4f46e5;
} */

.course-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.course-name {
  font-weight: 600;
  color: #111827;
  font-size: 0.875rem;
  line-height: 1.2;
}

.course-room, .course-teacher {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.75rem;
  color: #6b7280;
}

.room-icon, .teacher-icon {
  width: 0.75rem;
  height: 0.75rem;
  flex-shrink: 0;
}

.empty-cell {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.empty-text {
  font-size: 0.75rem;
  color: #9ca3af;
}

.available-slot {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  color: #059669;
  font-size: 0.75rem;
  font-weight: 500;
}

.available-icon {
  width: 1.5rem;
  height: 1.5rem;
}

/* 确认对话框 */
.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
  backdrop-filter: blur(4px);
}

.dialog-container {
  background-color: white;
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  overflow: hidden;
}

.dialog-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.dialog-title {
  margin: 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
}

.dialog-close-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: #6b7280;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  transition: all 0.2s ease;
}

.dialog-close-btn:hover {
  background-color: #f3f4f6;
  color: #4b5563;
}

.close-icon {
  width: 1.25rem;
  height: 1.25rem;
}

.dialog-content {
  padding: 1.5rem;
}

.dialog-text {
  margin-top: 0;
  margin-bottom: 1.5rem;
  color: #4b5563;
  line-height: 1.5;
}

.course-details {
  background-color: #f9fafb;
  border-radius: 8px;
  padding: 1.25rem;
  border: 1px solid #e5e7eb;
}

.detail-item {
  display: flex;
  margin-bottom: 0.75rem;
}

.detail-item:last-child {
  margin-bottom: 0;
}

.detail-item.cross-week-notice {
  background-color: #fff7ed;
  padding: 0.75rem;
  border-radius: 8px;
  margin-top: 0.75rem;
  border: 1px solid #ffedd5;
}

.detail-label {
  width: 80px;
  font-weight: 500;
  color: #6b7280;
}

.detail-value {
  flex: 1;
  color: #111827;
  font-weight: 500;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  padding: 1.25rem 1.5rem;
  border-top: 1px solid #e5e7eb;
  background-color: #f9fafb;
}

.dialog-btn {
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.dialog-btn-cancel {
  background-color: white;
  border: 1px solid #e5e7eb;
  color: #6b7280;
}

.dialog-btn-cancel:hover {
  background-color: #f3f4f6;
  border-color: #d1d5db;
}

.dialog-btn-confirm {
  background-color: #4f46e5;
  border: 1px solid #4f46e5;
  color: white;
}

.dialog-btn-confirm:hover {
  background-color: #4338ca;
  transform: translateY(-1px);
}

.dialog-btn-confirm:disabled {
  background-color: #a5b4fc;
  border-color: #a5b4fc;
  cursor: not-allowed;
  transform: none;
}

/* 提示消息 */
.toast-notification {
  position: fixed;
  bottom: 1.5rem;
  right: 1.5rem;
  transform: translateY(100%);
  opacity: 0;
  transition: all 0.3s ease;
  z-index: 100;
}

.toast-notification.show {
  transform: translateY(0);
  opacity: 1;
}

.toast-content {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  min-width: 300px;
}

.toast-icon {
  width: 1.25rem;
  height: 1.25rem;
}

.toast-success {
  color: #10b981;
}

.toast-error {
  color: #ef4444;
}

.toast-text {
  font-size: 0.875rem;
  color: #111827;
  font-weight: 500;
}

/* 按钮样式 */
.action-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background-color: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.action-btn:hover {
  background-color: rgba(255, 255, 255, 0.3);
  transform: translateY(-1px);
}

.action-btn.active {
  background-color: #10b981;
  border-color: #10b981;
  color: white;
}

.action-icon {
  width: 1rem;
  height: 1rem;
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .schedule-container {
    padding: 1rem;
  }
  
  .header-section {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .header-actions {
    width: 100%;
  }
  
  .action-btn {
    width: 100%;
    justify-content: center;
  }
  
  .week-controls {
    flex-wrap: wrap;
    justify-content: center;
  }
  
  .week-display {
    order: -1;
    width: 100%;
    margin-bottom: 1rem;
  }
  
  .cross-week-zone-left {
    left: -100px;
  }
  
  .cross-week-zone-right {
    right: -100px;
  }
}

@media (max-width: 768px) {
  .query-form {
    flex-direction: column;
    align-items: stretch;
  }
  
  .form-group {
    min-width: auto;
  }
  
  .week-controls {
    gap: 0.5rem;
  }
  
  .week-nav-btn, .week-jump-btn {
    padding: 0.5rem 0.75rem;
    font-size: 0.875rem;
  }
  
  .drag-status {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .table-header-row, .table-row {
    grid-template-columns: 80px repeat(7, minmax(80px, 1fr));
  }
  
  .time-cell, .day-header, .course-cell {
    padding: 0.5rem;
  }
  
  .course-cell {
    min-height: 80px;
  }
  
  .cross-week-zone {
    width: 80px;
    height: 300px;
  }
  
  .cross-week-zone-left {
    left: -90px;
  }
  
  .cross-week-zone-right {
    right: -90px;
  }
}

@media (max-width: 480px) {
  .schedule-container {
    padding: 0.5rem;
  }
  
  .header-section {
    padding: 1.25rem;
  }
  
  .page-title {
    font-size: 1.25rem;
  }
  
  .title-icon {
    width: 1.25rem;
    height: 1.25rem;
  }
  
  .adjust-mode-tips {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .table-header-row, .table-row {
    grid-template-columns: 60px repeat(7, minmax(60px, 1fr));
  }
  
  .time-cell, .day-header, .course-cell {
    padding: 0.25rem;
  }
  
  .course-cell {
    min-height: 70px;
  }
  
  .course-name {
    font-size: 0.75rem;
  }
  
  .course-room, .course-teacher {
    font-size: 0.625rem;
  }
  
  .cross-week-zone {
    width: 60px;
    height: 250px;
  }
  
  .cross-week-zone-left {
    left: -70px;
  }
  
  .cross-week-zone-right {
    right: -70px;
  }
}
</style>