<template>
  <div class="schedule-container">
    <!-- Header Section -->
    <div class="header-section">
      <div class="header-content">
        <h1 class="page-title">
          课程调度系统
        </h1>
        <p class="page-subtitle">智能课程管理与多周跨越调课</p>
      </div>
      <div class="header-actions">
        <button
          @click="toggleAdjustMode"
          class="action-btn"
          :class="{ active: isAdjustMode }"
        >
          {{ isAdjustMode ? '退出调课' : '开始调课' }}
        </button>
      </div>
    </div>

    <!-- Query Section -->
    <div class="card">
      <div class="card-header">
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
        <button @click="confirmInfo" class="primary-btn" :disabled="loading">
          {{ loading ? '查询中...' : '查询' }}
        </button>
      </div>
    </div>

    <!-- Week Navigation -->
    <div class="card week-navigation">
      <div class="week-controls">
        <button
          @click="jumpWeeks(-5)"
          class="week-jump-btn"
          :disabled="loading || currentDisplayWeek <= 5"
        >
          -5周
        </button>
        <button
          @click="changeWeek(-1)"
          class="week-nav-btn"
          :disabled="loading || currentDisplayWeek <= 1"
        >
          上一周
        </button>
        <div class="week-display">
          <span class="week-text">第 {{ currentDisplayWeek }} 周</span>
          <span class="week-date">{{
            getWeekDateRange(currentDisplayWeek)
          }}</span>
        </div>
        <button @click="changeWeek(1)" class="week-nav-btn" :disabled="loading">
          下一周
        </button>
        <button @click="jumpWeeks(5)" class="week-jump-btn" :disabled="loading">
          +5周
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
          <span
            v-if="currentDisplayWeek !== originalWeek"
            class="cross-week-badge"
          >
            {{ currentDisplayWeek > originalWeek ? '向后' : '向前' }}跨
            {{ Math.abs(currentDisplayWeek - originalWeek) }} 周
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
        <span class="card-title">课程安排表</span>
        <div class="table-info" v-if="teacher">
          {{ teacher }} 老师 - {{ semester }} 学期
        </div>
      </div>

      
    <div v-if="isAdjustMode" class="adjust-mode-tips">
      <div class="tip-item">
        <el-icon><Pointer /></el-icon>
        <span>拖拽课程卡片到可用时间槽</span>
      </div>
      <div class="tip-item">
        <el-icon><ArrowLeft /></el-icon>
        <el-icon><ArrowRight /></el-icon>
        <span>拖到左右边界可跨周调课</span>
      </div>
    </div>

    <div v-if="!isAdjustMode" class="view-mode-tips">
      <div class="tip-item">
        <el-icon><View /></el-icon>
        <span>点击课程卡片查看详情并调整教室</span>
      </div>
    </div>
  

      <!-- 跨周提示区域 -->
      <div v-if="isDragging" class="cross-week-zones">
        <div
          class="cross-week-zone cross-week-zone-left"
          :class="{ active: isInLeftZone }"
          @dragover.prevent="handleLeftZoneDragOver"
          @dragleave="handleLeftZoneDragLeave"
        >
          <div class="cross-week-content">
            <span class="cross-week-text">向前跨周</span>
            <span class="cross-week-week"
              >第{{ Math.max(1, currentDisplayWeek - 1) }}周</span
            >
          </div>
        </div>

        <div
          class="cross-week-zone cross-week-zone-right"
          :class="{ active: isInRightZone }"
          @dragover.prevent="handleRightZoneDragOver"
          @dragleave="handleRightZoneDragLeave"
        >
          <div class="cross-week-content">
            <span class="cross-week-text">向后跨周</span>
            <span class="cross-week-week"
              >第{{ currentDisplayWeek + 1 }}周</span
            >
          </div>
        </div>
      </div>

      <div
        class="table-container"
        :class="{ loading: loading, 'adjust-mode': isAdjustMode }"
      >
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
            <div v-for="(day, index) in days" :key="index" class="day-header">
              <div class="day-name">{{ day }}</div>
              <div class="day-date">
                {{ getDayDate(index, currentDisplayWeek) }}
              </div>
            </div>
          </div>

          <div class="table-body">
            <div
              v-for="(timeSlot, timeIndex) in timeSlots"
              :key="timeIndex"
              class="table-row"
            >
              <div class="time-cell">
                <span class="time-text">{{ timeSlot }}</span>
              </div>
              <div
                v-for="(day, dayIndex) in days"
                :key="dayIndex"
                class="course-cell"
                :class="{
                  'has-course': hasCourse(dayIndex + 1, timeIndex),
                  droppable: isDroppable(dayIndex + 1, timeIndex),
                  'drag-over': isDragOver(dayIndex + 1, timeIndex),
                  'highlight-available':
                    isAdjustMode && isAvailableSlot(dayIndex + 1, timeIndex),
                }"
                @dragover.prevent="handleDragOver(dayIndex + 1, timeIndex)"
                @dragleave="handleDragLeave()"
                @drop.prevent="handleDrop(dayIndex + 1, timeIndex)"
              >
                <div
                  v-if="hasCourse(dayIndex + 1, timeIndex)"
                  class="course-content"
                  :class="{
                    draggable: isAdjustMode,
                    clickable: !isAdjustMode,
                  }"
                  :draggable="isAdjustMode"
                  @dragstart="handleDragStart($event, dayIndex + 1, timeIndex)"
                  @click="
                    !isAdjustMode && handleCourseClick(dayIndex + 1, timeIndex)
                  "
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
                      {{ getCourse(dayIndex + 1, timeIndex).room }}
                    </div>
                    <div
                      class="course-teacher"
                      v-if="getCourse(dayIndex + 1, timeIndex).teacher"
                    >
                      {{ getCourse(dayIndex + 1, timeIndex).teacher }}
                    </div>
                  </div>
                </div>
                <div
                  v-else-if="
                    isAdjustMode && isAvailableSlot(dayIndex + 1, timeIndex)
                  "
                  class="available-slot"
                >
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

    <!-- Enhanced Course Info Dialog with Real Backend Data -->
    <div v-if="showCourseInfoDialog" class="dialog-overlay">
      <div class="dialog-container course-info-dialog">
        <div class="dialog-header">
          <h3 class="dialog-title">
            课程详情与教室管理
          </h3>
          <button @click="closeCourseInfoDialog" class="dialog-close-btn">
            ×
          </button>
        </div>
        <div class="dialog-content">
          <div class="course-info-details">
            <!-- 基本信息 -->
            <div class="info-section">
              <h4 class="section-title">
                基本信息
              </h4>
              <div class="info-grid">
                <div class="info-item">
                  <span class="info-label">课程名称:</span>
                  <span class="info-value">{{ selectedCourse?.name }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">授课教师:</span>
                  <span class="info-value">{{
                    selectedCourse?.teacher || teacher
                  }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">上课时间:</span>
                  <span class="info-value">
                    第{{ currentDisplayWeek }}周
                    {{ days[selectedCourseDay - 1] }}
                    {{ timeSlots[selectedCourseTimeSlot] }}
                  </span>
                </div>
              </div>
            </div>

            <!-- 教室更换 -->
            <div class="info-section">
              <h4 class="section-title">
                教室更换
              </h4>
              
              <div class="classroom-selection">
                <div class="current-classroom-display">
                  <span class="current-label">当前教室:</span>
                  <div class="current-room-badge">
                    {{ selectedCourse?.room }}
                  </div>
                </div>
                
                <div class="classroom-change-section">
                  <label class="change-label">选择新教室:</label>
                  <div class="select-wrapper">
                    <select
                      v-model="newClassroom"
                      @change="handleClassroomSelectionChange"
                      class="classroom-select"
                      :disabled="loadingClassrooms"
                    >
                      <option value="">
                        {{ loadingClassrooms ? '正在加载可用教室...' : '请选择新教室' }}
                      </option>
                      <option
                        v-for="classroom in availableClassrooms"
                        :key="classroom.id"
                        :value="classroom.name"
                      >
                        {{ classroom.name }} 
                        <span v-if="classroom.description">- {{ classroom.description }}</span>
                      </option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <!-- 新选择教室的详细信息 -->
            <div v-if="newClassroom && newClassroom !== selectedCourse?.room" class="info-section">
              <h4 class="section-title">
                新教室详情预览
              </h4>
              
              <!-- 加载新教室信息 -->
              <div v-if="loadingNewClassroomInfo" class="loading-indicator">
                <div class="loading-spinner-small"></div>
                <span>正在获取新教室信息...</span>
              </div>

              <!-- 新教室详情 -->
              <div v-else-if="newClassroomInfo" class="classroom-details-card new-classroom">
                <div class="classroom-header">
                  <div class="classroom-name">
                    {{ newClassroomInfo.name }}
                  </div>
                  <div class="classroom-status" :class="getStatusClass(newClassroomInfo.deviceStatus)">
                    <span class="status-dot"></span>
                    {{ newClassroomInfo.deviceStatus === 1 ? '设备正常' : '设备异常' }}
                  </div>
                </div>
                
                <div class="classroom-info-grid">
                  <div class="classroom-info-item">
                    <div class="info-content">
                      <span class="info-title">位置</span>
                      <span class="info-desc">{{ newClassroomInfo.campus }} - {{ newClassroomInfo.building }}</span>
                    </div>
                  </div>
                  
                  <div class="classroom-info-item">
                    <div class="info-content">
                      <span class="info-title">楼层</span>
                      <span class="info-desc">第 {{ newClassroomInfo.floor }} 层</span>
                    </div>
                  </div>
                  
                  <div class="classroom-info-item">
                    <div class="info-content">
                      <span class="info-title">容量</span>
                      <span class="info-desc">{{ newClassroomInfo.size }} 人</span>
                    </div>
                  </div>
                  
                  <div class="classroom-info-item">
                    <div class="info-content">
                      <span class="info-title">类型</span>
                      <span class="info-desc">{{ newClassroomInfo.classroomType }}</span>
                    </div>
                  </div>
                  
                  <div class="classroom-info-item">
                    <div class="info-content">
                      <span class="info-title">空调</span>
                      <span class="info-desc">{{ newClassroomInfo.airConditioner === 1 ? '有空调' : '无空调' }}</span>
                    </div>
                  </div>
                  
                  <div class="classroom-info-item">
                    <div class="info-content">
                      <span class="info-title">设备状态</span>
                      <span class="info-desc">{{ newClassroomInfo.deviceStatus === 1 ? '设备可用' : '设备不可用' }}</span>
                    </div>
                  </div>
                </div>

                <!-- 对比提示 -->
                <div class="comparison-tips">
                  <div class="comparison-item" v-if="currentClassroomInfo && newClassroomInfo.size !== currentClassroomInfo.size">
                    <span>容量变化: {{ currentClassroomInfo.size }} → {{ newClassroomInfo.size }} 人</span>
                  </div>
                  
                  <div class="comparison-item" v-if="currentClassroomInfo && newClassroomInfo.airConditioner !== currentClassroomInfo.airConditioner">
                    <span>空调设施: {{ currentClassroomInfo.airConditioner === 1 ? '有' : '无' }} → {{ newClassroomInfo.airConditioner === 1 ? '有' : '无' }}</span>
                  </div>
                </div>
              </div>

              <!-- 获取新教室信息失败 -->
              <div v-else class="error-message">
                <span>无法获取新教室详细信息</span>
              </div>
            </div>
          </div>
        </div>

        <div class="dialog-footer">
          <button
            @click="closeCourseInfoDialog"
            class="dialog-btn dialog-btn-cancel"
          >
            取消
          </button>
          <button
            @click="confirmClassroomChange"
            class="dialog-btn dialog-btn-confirm"
            :disabled="
              !newClassroom ||
              classroomChangeLoading ||
              newClassroom === selectedCourse?.room
            "
          >
            {{ classroomChangeLoading ? '更换中...' : '确认更换教室' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Adjustment Confirmation Dialog -->
    <div v-if="showConfirmDialog" class="dialog-overlay">
      <div class="dialog-container">
        <div class="dialog-header">
          <h3 class="dialog-title">确认调课</h3>
          <button @click="cancelAdjustment" class="dialog-close-btn">
            ×
          </button>
        </div>
        <div class="dialog-content">
          <p class="dialog-text">您确定要将以下课程进行调整吗？</p>
          <div class="course-details">
            <div class="detail-item">
              <span class="detail-label">课程:</span>
              <span class="detail-value">{{
                draggedCourse.name || '未知课程'
              }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">教室:</span>
              <span class="detail-value">{{
                draggedCourse.room || '未知教室'
              }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">原时间:</span>
              <span class="detail-value"
                >第{{ originalWeek }}周 {{ days[draggedDay - 1] }}
                {{ timeSlots[draggedTimeSlot] }}</span
              >
            </div>
            <div class="detail-item">
              <span class="detail-label">调整至:</span>
              <span class="detail-value"
                >第{{ targetWeek }}周 {{ days[targetDay - 1] }}
                {{ timeSlots[targetTimeSlot] }}</span
              >
            </div>
            <div
              v-if="originalWeek !== targetWeek"
              class="detail-item cross-week-notice"
            >
              <span class="detail-label">注意:</span>
              <span class="detail-value">
                {{ targetWeek > originalWeek ? '向后' : '向前' }}跨
                {{ Math.abs(originalWeek - targetWeek) }} 周调课操作
              </span>
            </div>
          </div>
        </div>
        <div class="dialog-footer">
          <button
            @click="cancelAdjustment"
            class="dialog-btn dialog-btn-cancel"
          >
            取消
          </button>
          <button
            @click="confirmAdjustment"
            class="dialog-btn dialog-btn-confirm"
            :disabled="adjustmentLoading"
          >
            {{ adjustmentLoading ? '调课中...' : '确认调课' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Toast Notification -->
    <div
      v-if="toastMessage"
      class="toast-notification"
      :class="{ show: showToast }"
    >
      <div class="toast-content">
        <el-icon><Comment /></el-icon>
        <span class="toast-text">{{ toastMessage }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import {
  Calendar,
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  BookOpen,
  User,
  Clock,
  MapPin,
  CheckCircle,
  AlertCircle,
  MoveHorizontal,
  X,
  MousePointer,
  ArrowLeftRight,
  Settings,
  Info,
  Building,
  Circle,
  Layers,
  Users,
  Tag,
  Thermometer,
  RefreshCw,
  ChevronDown,
  Eye,
  AlertTriangle,
  Check,
  TrendingUp,
  TrendingDown,
} from 'lucide-vue-next'
import { getTeacherCourseTable } from '@/api/admin/teacoursetable'
import {
  queryAvailableSlots,
  sendAdjustmentRequest,
} from '@/api/admin/classchange'
import {
  getAvailableClassrooms,
  changeClassroom,
  getClassroomInfo,
} from '@/api/admin/classroomchange'
import { CommonPicker } from 'element-plus'

export default {
  name: 'TeacherScheduleAdjustment',
  components: {
    Calendar,
    Search,
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
    BookOpen,
    User,
    Clock,
    MapPin,
    CheckCircle,
    AlertCircle,
    MoveHorizontal,
    X,
    MousePointer,
    ArrowLeftRight,
    Settings,
    Info,
    Building,
    Circle,
    Layers,
    Users,
    Tag,
    Thermometer,
    RefreshCw,
    ChevronDown,
    Eye,
    AlertTriangle,
    Check,
    TrendingUp,
    TrendingDown,
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
        '19:00-20:40',
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
      isDragActive: false,

      // 课程信息对话框
      showCourseInfoDialog: false,
      selectedCourse: null,
      selectedCourseDay: null,
      selectedCourseTimeSlot: null,
      availableClassrooms: [],
      loadingClassrooms: false,
      newClassroom: '',
      classroomChangeLoading: false,

      // 教室详情相关
      currentClassroomInfo: null,
      newClassroomInfo: null,
      loadingCurrentClassroomInfo: false,
      loadingNewClassroomInfo: false,
      classroomInfoCache: new Map(), // 缓存教室信息
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
          teacher: this.teacher,
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
        one: 0,
        two: 1,
        three: 2,
        four: 3,
        five: 4,
        six: 5,
        seven: 6,
      }

      courseTable.forEach((dayData) => {
        for (const [slotKey, slotIndex] of Object.entries(timeSlotMap)) {
          const courseInfo = dayData[slotKey]
          if (courseInfo) {
            const [room, name, teacher] = courseInfo.split(',')
            courses.push({
              day: dayData.day,
              timeSlot: slotIndex,
              name,
              room,
              teacher,
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
      return this.courses.some(
        (course) => course.day === day && course.timeSlot === timeSlotIndex,
      )
    },

    getCourse(day, timeSlotIndex) {
      return (
        this.courses.find(
          (course) => course.day === day && course.timeSlot === timeSlotIndex,
        ) || {}
      )
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

    // Enhanced course click handler with real backend data
    async handleCourseClick(day, timeSlot) {
      const course = this.getCourse(day, timeSlot)
      if (!course || !course.name) return

      this.selectedCourse = course
      this.selectedCourseDay = day
      this.selectedCourseTimeSlot = timeSlot
      this.newClassroom = ''
      this.showCourseInfoDialog = true
      
      // 清空之前的教室信息
      this.currentClassroomInfo = null
      this.newClassroomInfo = null

      // 并行加载可用教室和当前教室详情
      await Promise.all([
        this.loadAvailableClassrooms(),
        this.loadCurrentClassroomInfo(course.room)
      ])
    },


    // Load new classroom information when selection changes
    async loadNewClassroomInfo(classroomName) {
      if (!classroomName || !this.availableClassrooms.length) return

      // 检查缓存
      if (this.classroomInfoCache.has(classroomName)) {
        this.newClassroomInfo = this.classroomInfoCache.get(classroomName)
        return
      }

      this.loadingNewClassroomInfo = true

      try {
        const classroom = this.availableClassrooms.find(item => item.name === classroomName)
        
        if (!classroom) {
          console.warn(`未找到教室 ${classroomName} 的信息`)
          return
        }

        const response = await getClassroomInfo(classroom.id)
        
        if (response) {
          this.newClassroomInfo = response
          // 缓存教室信息
          this.classroomInfoCache.set(classroomName, response)
        } else {
          throw new Error('获取教室详情失败')
        }
      } catch (error) {
        console.error('获取新教室详情失败:', error)
        this.showToastMessage('获取新教室详情失败', 'error')
        this.newClassroomInfo = null
      } finally {
        this.loadingNewClassroomInfo = false
      }
    },

    async loadAvailableClassrooms() {
  if (!this.selectedCourse) return

  this.loadingClassrooms = true

  try {
    // 直接使用原始字符串，不要手动编码
    const lessonMessage = `${this.selectedCourse.room},${this.selectedCourse.name},${this.selectedCourse.teacher || this.teacher}`
    const whichLesson = parseInt(
      `${this.semester}${this.selectedCourseDay}${this.selectedCourseTimeSlot + 1}`,
    )

    const response = await getAvailableClassrooms({
      lessonMessage,
      whichLesson,
      lessonAtWhichWeek: this.currentDisplayWeek,
      // toWhichWeek: this.currentDisplayWeek,
    })

    this.availableClassrooms = response || []
    console.log('可用教室:', this.availableClassrooms)
  } catch (error) {
    console.error('获取可用教室失败:', error)
    this.showToastMessage('获取可用教室失败', 'error')
    this.availableClassrooms = []
  } finally {
    this.loadingClassrooms = false
  }
},

    // Handle classroom selection change
    async handleClassroomSelectionChange() {
      if (this.newClassroom && this.newClassroom !== this.selectedCourse?.room) {
        await this.loadNewClassroomInfo(this.newClassroom)
      } else {
        this.newClassroomInfo = null
      }
    },

    // Get status class for classroom device status
    getStatusClass(deviceStatus) {
      return {
        'status-normal': deviceStatus === 1,
        'status-error': deviceStatus !== 1
      }
    },

    async confirmClassroomChange() {
      if (!this.newClassroom || !this.selectedCourse) return

      this.classroomChangeLoading = true

      try {
        const lessonMessage = `${this.selectedCourse.room},${this.selectedCourse.name},${this.selectedCourse.teacher || this.teacher}`
        const whichLesson = parseInt(
          `${this.semester}${this.selectedCourseDay}${this.selectedCourseTimeSlot + 1}`,
        )

        const response = await changeClassroom({
          lessonMessage,
          whichLesson,
          lessonAtWhichWeek: this.currentDisplayWeek,
          // toWhichWeek: this.currentDisplayWeek,
          newClassroom: this.newClassroom,
        })

        if (response.code === 1) {
          this.showToastMessage(
            `教室已成功更换为 ${this.newClassroom}`,
            'success',
          )

          // 更新本地课程数据
          const courseIndex = this.courses.findIndex(
            (course) =>
              course.day === this.selectedCourseDay &&
              course.timeSlot === this.selectedCourseTimeSlot,
          )

          if (courseIndex !== -1) {
            this.courses[courseIndex].room = this.newClassroom
          }

          // 清理缓存并重新加载
          this.coursesCache.clear()
          await this.loadCourseTable(this.currentDisplayWeek)

          this.closeCourseInfoDialog()
        } else {
          throw new Error(response.message || '教室更换失败')
        }
      } catch (error) {
        console.error('教室更换失败:', error)
        this.showToastMessage(
          error.message || '教室更换失败，请稍后重试',
          'error',
        )
      } finally {
        this.classroomChangeLoading = false
      }
    },

    closeCourseInfoDialog() {
      this.showCourseInfoDialog = false
      this.selectedCourse = null
      this.selectedCourseDay = null
      this.selectedCourseTimeSlot = null
      this.availableClassrooms = []
      this.newClassroom = ''
      this.currentClassroomInfo = null
      this.newClassroomInfo = null
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

      event.dataTransfer.setData(
        'text/plain',
        JSON.stringify({
          day,
          timeSlot,
          course: course,
          week: this.originalWeek,
        }),
      )

      event.dataTransfer.effectAllowed = 'move'

      const dragImage = new Image()
      dragImage.src =
        'data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs='
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
        const whichLesson = parseInt(
          `${this.semester}${this.draggedDay}${this.draggedTimeSlot + 1}`,
        )

        const response = await sendAdjustmentRequest({
          lessonMessage,
          whichLesson,
          lessonAtWhichWeek: this.originalWeek,
          toWhichWeek: this.targetWeek,
        })

        if (response.code === 1) {
          const weekDiff = Math.abs(this.originalWeek - this.targetWeek)
          const direction =
            this.targetWeek > this.originalWeek ? '向后' : '向前'
          const successMessage =
            weekDiff > 0
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
        const whichLesson = parseInt(
          `${this.semester}${this.draggedDay}${this.draggedTimeSlot + 1}`,
        )

        const response = await queryAvailableSlots({
          lessonMessage,
          whichLesson,
          lessonAtWhichWeek: this.originalWeek,
          toWhichWeek: targetWeek,
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

      return this.availableSlots.some((slot) => {
        const slotDay = Math.floor(slot / 10)
        const slotTime = (slot % 10) - 1
        return slotDay === day && slotTime === timeSlot
      })
    },

    isAvailableSlot(day, timeSlot) {
      if (!this.isDragging) return false

      return this.availableSlots.some((slot) => {
        const slotDay = Math.floor(slot / 10)
        const slotTime = (slot % 10) - 1
        return slotDay === day && slotTime === timeSlot
      })
    },

    isDragOver(day, timeSlot) {
      return this.currentDragOver === `${day}-${timeSlot}`
    },
  },
}
</script>

<style scoped>
/* 全局样式重置和基础设置 */
* {
  box-sizing: border-box;
}

.schedule-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  padding: 2rem;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/* 头部区域 */
.header-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding: 2rem;
  background: linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%);
  border-radius: 1rem;
  color: white;
  box-shadow: 0 10px 25px rgba(139, 92, 246, 0.3);
}

.header-content {
  flex: 1;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
  letter-spacing: -0.025em;
}

.page-subtitle {
  font-size: 1.125rem;
  opacity: 0.9;
  margin: 0;
  font-weight: 400;
}

.header-actions {
  display: flex;
  gap: 1rem;
}

.action-btn {
  padding: 0.75rem 1.5rem;
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 0.5rem;
  color: white;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  backdrop-filter: blur(10px);
}

.action-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-1px);
}

.action-btn.active {
  background: white;
  color: #8b5cf6;
  border-color: white;
}

/* 卡片样式 */
.card {
  background: white;
  border-radius: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  margin-bottom: 1.5rem;
  border: 1px solid #f1f5f9;
  overflow: hidden;
}

.card-header {
  padding: 1.5rem;
  border-bottom: 1px solid #f1f5f9;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: linear-gradient(135deg, #fefefe 0%, #f8fafc 100%);
}

.card-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
}

.table-info {
  margin-left: auto;
  color: #64748b;
  font-size: 0.875rem;
  font-weight: 500;
}

/* 查询表单 */
.query-form {
  padding: 1.5rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  align-items: end;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
}

.form-input {
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  transition: all 0.2s ease;
  background: white;
}

.form-input:focus {
  outline: none;
  border-color: #8b5cf6;
  box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
}

.primary-btn {
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%);
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  height: fit-content;
}

.primary-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(139, 92, 246, 0.4);
}

.primary-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* 周次导航 */
.week-navigation {
  position: relative;
}

.week-controls {
  padding: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}

.week-nav-btn, .week-jump-btn {
  padding: 0.5rem 1rem;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  color: #64748b;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.week-nav-btn:hover:not(:disabled), .week-jump-btn:hover:not(:disabled) {
  background: #f8fafc;
  border-color: #8b5cf6;
  color: #8b5cf6;
}

.week-nav-btn:disabled, .week-jump-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.week-display {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  margin: 0 2rem;
}

.week-text {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e293b;
}

.week-date {
  font-size: 0.875rem;
  color: #64748b;
}

/* 拖拽状态 */
.drag-status {
  padding: 1rem 1.5rem;
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  border-top: 1px solid #f59e0b;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.drag-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.drag-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #92400e;
}

.drag-value {
  font-size: 0.875rem;
  color: #1e293b;
  font-weight: 600;
}

.cross-week-badge {
  padding: 0.25rem 0.5rem;
  background: #8b5cf6;
  color: white;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 500;
}

/* 提示区域 */
.adjust-mode-tips, .view-mode-tips {
  padding: 1rem 1.5rem;
  background: linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%);
  border-bottom: 1px solid #c4b5fd;
  display: flex;
  gap: 2rem;
}

.tip-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #5b21b6;
}

/* 跨周区域 */
.cross-week-zones {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 10;
}

.cross-week-zone {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 80px;
  background: rgba(139, 92, 246, 0.1);
  border: 2px dashed rgba(139, 92, 246, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: all;
  transition: all 0.2s ease;
}

.cross-week-zone-left {
  left: 0;
}

.cross-week-zone-right {
  right: 0;
}

.cross-week-zone.active {
  background: rgba(139, 92, 246, 0.2);
  border-color: #8b5cf6;
}

.cross-week-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  color: #8b5cf6;
  font-size: 0.75rem;
  font-weight: 500;
  text-align: center;
}

/* 表格容器 */
.table-container {
  position: relative;
  overflow: hidden;
}

.table-container.loading {
  min-height: 400px;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 5;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #f3f4f6;
  border-top: 3px solid #8b5cf6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.loading-text {
  margin-top: 1rem;
  color: #64748b;
  font-size: 0.875rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 课程表 */
.schedule-table {
  display: flex;
  flex-direction: column;
  min-width: 800px;
}

.table-header-row {
  display: grid;
  grid-template-columns: 120px repeat(7, 1fr);
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border-bottom: 2px solid #e2e8f0;
}

.time-header {
  padding: 1rem;
  font-weight: 600;
  color: #374151;
  display: flex;
  align-items: center;
  justify-content: center;
  border-right: 1px solid #e2e8f0;
}

.day-header {
  padding: 1rem;
  text-align: center;
  border-right: 1px solid #e2e8f0;
}

.day-header:last-child {
  border-right: none;
}

.day-name {
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.25rem;
}

.day-date {
  font-size: 0.75rem;
  color: #64748b;
}

.table-body {
  display: flex;
  flex-direction: column;
}

.table-row {
  display: grid;
  grid-template-columns: 120px repeat(7, 1fr);
  border-bottom: 1px solid #f1f5f9;
}

.table-row:last-child {
  border-bottom: none;
}

.time-cell {
  padding: 1rem;
  background: #fafafa;
  border-right: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.time-text {
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
}

.course-cell {
  padding: 0.5rem;
  border-right: 1px solid #f1f5f9;
  min-height: 100px;
  position: relative;
  transition: all 0.2s ease;
}

.course-cell:last-child {
  border-right: none;
}

.course-cell.highlight-available {
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  border: 2px dashed #0ea5e9;
}

.course-cell.drag-over {
  background: linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%);
  border: 2px solid #8b5cf6;
}

/* 课程内容 */
.course-content {
  height: 100%;
  background: linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%);
  border-radius: 0.5rem;
  padding: 0.75rem;
  color: white;
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(139, 92, 246, 0.2);
}

.course-content.draggable {
  cursor: grab;
}

.course-content.draggable:active {
  cursor: grabbing;
}

.course-content.clickable {
  cursor: pointer;
}

.course-content:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
}

.drag-handle {
  position: absolute;
  top: 0.5rem;
    right: 0.5rem;
  opacity: 0.7;
}

.drag-dots {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.dot {
  width: 3px;
  height: 3px;
  background: white;
  border-radius: 50%;
}

.course-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.course-name {
  font-weight: 600;
  font-size: 0.875rem;
  line-height: 1.2;
}

.course-room {
  font-size: 0.75rem;
  opacity: 0.9;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.course-teacher {
  font-size: 0.75rem;
  opacity: 0.8;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

/* 可用时间槽 */
.available-slot {
  height: 100%;
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  border: 2px dashed #0ea5e9;
  border-radius: 0.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  color: #0369a1;
  font-size: 0.75rem;
  font-weight: 500;
}

/* 空单元格 */
.empty-cell {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #9ca3af;
  font-size: 0.75rem;
}

.empty-text {
  opacity: 0.6;
}

/* 对话框样式 */
.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
}

.dialog-container {
  background: white;
  border-radius: 1rem;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
  max-width: 600px;
  width: 90%;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.course-info-dialog {
  max-width: 800px;
}

.dialog-header {
  padding: 1.5rem;
  border-bottom: 1px solid #f1f5f9;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%);
}

.dialog-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #ffffff;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.dialog-close-btn {
  width: 32px;
  height: 32px;
  border: none;
  background:none;
  border-radius: 0.5rem;
  color: #ffffff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  transition: all 0.2s ease;
}

.dialog-close-btn:hover {
  background: #e2e8f0;
  color: #374151;
}

.dialog-content {
  padding: 1.5rem;
  overflow-y: auto;
  flex: 1;
}

.dialog-text {
  color: #64748b;
  margin-bottom: 1.5rem;
  line-height: 1.6;
}

/* 课程详情 */
.course-details {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem;
  background: #f8fafc;
  border-radius: 0.5rem;
}

.detail-label {
  font-weight: 500;
  color: #374151;
  min-width: 80px;
}

.detail-value {
  color: #1e293b;
  font-weight: 600;
}

.cross-week-notice {
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  border: 1px solid #f59e0b;
}

.cross-week-notice .detail-label {
  color: #92400e;
}

.cross-week-notice .detail-value {
  color: #92400e;
}

/* 信息区域 */
.info-section {
  margin-bottom: 2rem;
}

.section-title {
  font-size: 1rem;
  font-weight: 600;
  color: #374151;
  margin: 0 0 1rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #f1f5f9;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.info-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #64748b;
}

.info-value {
  font-size: 0.875rem;
  color: #1e293b;
  font-weight: 600;
}

/* 教室选择 */
.classroom-selection {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.current-classroom-display {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.current-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #64748b;
}

.current-room-badge {
  padding: 0.5rem 1rem;
  background: linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%);
  color: white;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.classroom-change-section {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.change-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
}

.select-wrapper {
  position: relative;
}

.classroom-select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  background: white;
  font-size: 0.875rem;
  appearance: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

.classroom-select:focus {
  outline: none;
  border-color: #8b5cf6;
  box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
}

.classroom-select:disabled {
  background: #f9fafb;
  cursor: not-allowed;
  opacity: 0.6;
}

/* 教室详情卡片 */
.classroom-details-card {
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border: 1px solid #e2e8f0;
  border-radius: 0.75rem;
  padding: 1.5rem;
}

.new-classroom {
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  border-color: #0ea5e9;
}

.classroom-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.classroom-name {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1e293b;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.classroom-status {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem 0.75rem;
  border-radius: 0.5rem;
  font-size: 0.75rem;
  font-weight: 500;
}

.status-normal {
  background: #dcfce7;
  color: #166534;
}

.status-error {
  background: #fee2e2;
  color: #dc2626;
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
}

.classroom-info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.classroom-info-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: white;
  border-radius: 0.5rem;
  border: 1px solid #f1f5f9;
}

.info-content {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.info-title {
  font-size: 0.75rem;
  font-weight: 500;
  color: #64748b;
}

.info-desc {
  font-size: 0.875rem;
  color: #1e293b;
  font-weight: 500;
}

/* 对比提示 */
.comparison-tips {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.comparison-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  color: #64748b;
}

/* 加载指示器 */
.loading-indicator {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: #f8fafc;
  border-radius: 0.5rem;
  color: #64748b;
  font-size: 0.875rem;
}

.loading-spinner-small {
  width: 16px;
  height: 16px;
  border: 2px solid #f3f4f6;
  border-top: 2px solid #8b5cf6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

/* 错误消息 */
.error-message {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  background: #fee2e2;
  border: 1px solid #fecaca;
  border-radius: 0.5rem;
  color: #dc2626;
  font-size: 0.875rem;
}

/* 对话框底部 */
.dialog-footer {
  padding: 1.5rem;
  border-top: 1px solid #f1f5f9;
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  background: #fafafa;
}

.dialog-btn {
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border: none;
}

.dialog-btn-cancel {
  background: #f1f5f9;
  color: #64748b;
}

.dialog-btn-cancel:hover {
  background: #e2e8f0;
  color: #374151;
}

.dialog-btn-confirm {
  background: linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%);
  color: white;
}

.dialog-btn-confirm:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(139, 92, 246, 0.4);
}

.dialog-btn-confirm:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Toast 通知 */
.toast-notification {
  position: fixed;
  top: 2rem;
  right: 2rem;
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  border: 1px solid #f1f5f9;
  z-index: 1100;
  transform: translateX(100%);
  transition: transform 0.3s ease;
}

.toast-notification.show {
  transform: translateX(0);
}

.toast-content {
  padding: 1rem 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.toast-text {
  color: #1e293b;
  font-size: 0.875rem;
  font-weight: 500;
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .schedule-container {
    padding: 1rem;
  }
  
  .header-section {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
  
  .page-title {
    font-size: 2rem;
  }
  
  .query-form {
    grid-template-columns: 1fr;
  }
  
  .week-controls {
    flex-wrap: wrap;
    gap: 0.5rem;
  }
  
  .week-display {
    margin: 0 1rem;
  }
  
  .table-container {
    overflow-x: auto;
  }
  
  .dialog-container {
    width: 95%;
    margin: 1rem;
  }
  
  .classroom-info-grid {
    grid-template-columns: 1fr;
  }
  
  .info-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .schedule-container {
    padding: 0.5rem;
  }
  
  .page-title {
    font-size: 1.5rem;
  }
  
  .page-subtitle {
    font-size: 1rem;
  }
  
  .week-controls {
    flex-direction: column;
    align-items: center;
  }
  
  .drag-status {
    grid-template-columns: 1fr;
  }
  
  .adjust-mode-tips, .view-mode-tips {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .table-header-row, .table-row {
    grid-template-columns: 80px repeat(7, minmax(100px, 1fr));
  }
  
  .time-cell {
    padding: 0.5rem;
  }
  
  .course-content {
    padding: 0.5rem;
  }
  
  .course-name {
    font-size: 0.75rem;
  }
  
  .course-room, .course-teacher {
    font-size: 0.625rem;
  }
  
  .dialog-footer {
    flex-direction: column;
  }
  
  .toast-notification {
    top: 1rem;
    right: 1rem;
    left: 1rem;
    transform: translateY(-100%);
  }
  
  .toast-notification.show {
    transform: translateY(0);
  }
}

/* 动画效果 */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.card {
  animation: fadeIn 0.3s ease;
}

/* 拖拽时的特殊样式 */
.table-container.adjust-mode .course-content.draggable {
  position: relative;
}

.table-container.adjust-mode .course-content.draggable::before {
  content: '';
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  background: linear-gradient(45deg, #8b5cf6, #a855f7, #8b5cf6);
  border-radius: 0.5rem;
  z-index: -1;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.table-container.adjust-mode .course-content.draggable:hover::before {
  opacity: 0.3;
}

/* 滚动条样式 */
.dialog-content::-webkit-scrollbar {
  width: 6px;
}

.dialog-content::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 3px;
}

.dialog-content::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

.dialog-content::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

.table-container::-webkit-scrollbar {
  height: 6px;
}

.table-container::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 3px;
}

.table-container::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

.table-container::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>