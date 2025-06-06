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
          :class="{ active: isAdjustMode }"
        >
          <MoveHorizontal class="action-icon" />
          {{ isAdjustMode ? '退出调课' : '开始调课' }}
        </button>
      </div>
    </div>

    <!-- Query Section -->
    <div class="card query-card">
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
        <button @click="confirmInfo" class="primary-btn" :disabled="loading">
          <Search class="btn-icon" />
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
          <ChevronsLeft class="nav-icon" />
          -5周
        </button>
        <button
          @click="changeWeek(-1)"
          class="week-nav-btn"
          :disabled="loading || currentDisplayWeek <= 1"
        >
          <ChevronLeft class="nav-icon" />
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
          <span>拖拽课程卡片到可用时间槽</span>
        </div>
        <div class="tip-item">
          <ArrowLeftRight class="tip-icon" />
          <span>拖到左右边界可跨周调课</span>
        </div>
      </div>

      <div v-if="!isAdjustMode" class="view-mode-tips">
        <div class="tip-item">
          <Info class="tip-icon" />
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
            <ChevronLeft class="cross-week-icon" />
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
            <ChevronRight class="cross-week-icon" />
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
                <Clock class="time-icon" />
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
                      <MapPin class="room-icon" />
                      {{ getCourse(dayIndex + 1, timeIndex).room }}
                    </div>
                    <div
                      class="course-teacher"
                      v-if="getCourse(dayIndex + 1, timeIndex).teacher"
                    >
                      <User class="teacher-icon" />
                      {{ getCourse(dayIndex + 1, timeIndex).teacher }}
                    </div>
                  </div>
                  <div v-if="!isAdjustMode" class="course-actions">
                    <Settings class="action-icon" />
                  </div>
                </div>
                <div
                  v-else-if="
                    isAdjustMode && isAvailableSlot(dayIndex + 1, timeIndex)
                  "
                  class="available-slot"
                >
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

    <!-- Enhanced Course Info Dialog -->
    <div v-if="showCourseInfoDialog" class="dialog-overlay">
      <div class="dialog-container course-info-dialog">
        <div class="dialog-header">
          <h3 class="dialog-title">
            <BookOpen class="dialog-title-icon" />
            课程详情与教室管理
          </h3>
          <button @click="closeCourseInfoDialog" class="dialog-close-btn">
            <X class="close-icon" />
          </button>
        </div>
        <div class="dialog-content">
          <div class="course-info-details">
            <!-- 基本信息 -->
            <div class="info-section basic-info">
              <h4 class="section-title">
                <Info class="section-icon" />
                基本信息
              </h4>
              <div class="info-grid">
                <div class="info-item">
                  <div class="info-icon-wrapper">
                    <BookOpen class="info-item-icon" />
                  </div>
                  <div class="info-content">
                    <span class="info-label">课程名称</span>
                    <span class="info-value">{{ selectedCourse?.name }}</span>
                  </div>
                </div>
                <div class="info-item">
                  <div class="info-icon-wrapper">
                    <User class="info-item-icon" />
                  </div>
                  <div class="info-content">
                    <span class="info-label">授课教师</span>
                    <span class="info-value">{{
                      selectedCourse?.teacher || teacher
                    }}</span>
                  </div>
                </div>
                <div class="info-item">
                  <div class="info-icon-wrapper">
                    <Clock class="info-item-icon" />
                  </div>
                  <div class="info-content">
                    <span class="info-label">上课时间</span>
                    <span class="info-value">
                      第{{ currentDisplayWeek }}周
                      {{ days[selectedCourseDay - 1] }}
                      {{ timeSlots[selectedCourseTimeSlot] }}
                    </span>
                  </div>
                </div>
                <div class="info-item">
                  <div class="info-icon-wrapper">
                    <MapPin class="info-item-icon" />
                  </div>
                  <div class="info-content">
                    <span class="info-label">当前教室</span>
                    <span class="info-value current-room">{{ selectedCourse?.room }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- 教室更换 -->
            <div class="info-section classroom-change">
              <h4 class="section-title">
                <RefreshCw class="section-icon" />
                教室更换
              </h4>
              
              <div class="classroom-selection">
                <div class="classroom-change-section">
                  <label class="change-label">
                    <Building class="label-icon" />
                    选择新教室
                  </label>
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
                    <ChevronDown class="select-arrow" />
                  </div>
                </div>
              </div>
            </div>

            <!-- 新选择教室的详细信息 -->
            <div v-if="newClassroom && newClassroom !== selectedCourse?.room" class="info-section new-classroom-preview">
              <h4 class="section-title">
                <Eye class="section-icon" />
                新教室详情预览
              </h4>
              
              <!-- 加载新教室信息 -->
              <div v-if="loadingNewClassroomInfo" class="loading-indicator">
                <div class="loading-spinner-small"></div>
                <span>正在获取新教室信息...</span>
              </div>

              <!-- 新教室详情 -->
              <div v-else-if="newClassroomInfo" class="classroom-details-card">
                <div class="classroom-header">
                  <div class="classroom-name">
                    <Building class="classroom-icon" />
                    {{ newClassroomInfo.name }}
                  </div>
                  <div class="classroom-status" :class="getStatusClass(newClassroomInfo.deviceStatus)">
                    <Circle class="status-dot" />
                    {{ newClassroomInfo.deviceStatus === 1 ? '设备正常' : '设备异常' }}
                  </div>
                </div>
                
                <div class="classroom-info-grid">
                  <div class="classroom-info-item">
                    <MapPin class="classroom-detail-icon" />
                    <div class="classroom-detail-content">
                      <span class="detail-title">位置</span>
                      <span class="detail-desc">{{ newClassroomInfo.campus }} - {{ newClassroomInfo.building }}</span>
                    </div>
                  </div>
                  
                  <div class="classroom-info-item">
                    <Layers class="classroom-detail-icon" />
                    <div class="classroom-detail-content">
                      <span class="detail-title">楼层</span>
                      <span class="detail-desc">第 {{ newClassroomInfo.floor }} 层</span>
                    </div>
                  </div>
                  
                  <div class="classroom-info-item">
                    <Users class="classroom-detail-icon" />
                    <div class="classroom-detail-content">
                      <span class="detail-title">容量</span>
                      <span class="detail-desc">{{ newClassroomInfo.size }} 人</span>
                    </div>
                  </div>
                  
                  <div class="classroom-info-item">
                    <Tag class="classroom-detail-icon" />
                    <div class="classroom-detail-content">
                      <span class="detail-title">类型</span>
                      <span class="detail-desc">{{ newClassroomInfo.classroomType }}</span>
                    </div>
                  </div>
                  
                  <div class="classroom-info-item">
                    <Thermometer class="classroom-detail-icon" />
                    <div class="classroom-detail-content">
                      <span class="detail-title">空调</span>
                      <span class="detail-desc">{{ newClassroomInfo.airConditioner === 1 ? '有空调' : '无空调' }}</span>
                    </div>
                  </div>
                  
                  <div class="classroom-info-item">
                    <Settings class="classroom-detail-icon" />
                    <div class="classroom-detail-content">
                      <span class="detail-title">设备状态</span>
                      <span class="detail-desc">{{ newClassroomInfo.deviceStatus === 1 ? '设备可用' : '设备不可用' }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 获取新教室信息失败 -->
              <div v-else class="error-message">
                <AlertTriangle class="error-icon" />
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
            <X class="btn-icon" />
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
            <RefreshCw v-if="classroomChangeLoading" class="btn-icon spinning" />
            <Check v-else class="btn-icon" />
            {{ classroomChangeLoading ? '更换中...' : '确认更换教室' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Adjustment Confirmation Dialog -->
    <div v-if="showConfirmDialog" class="dialog-overlay">
      <div class="dialog-container">
        <div class="dialog-header">
          <h3 class="dialog-title">
            <AlertTriangle class="dialog-title-icon warning" />
            确认调课
          </h3>
          <button @click="cancelAdjustment" class="dialog-close-btn">
            <X class="close-icon" />
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
        <CheckCircle
          v-if="toastType === 'success'"
          class="toast-icon toast-success"
        />
        <AlertCircle v-else class="toast-icon toast-error" />
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
      newClassroomInfo: null,
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
      this.newClassroomInfo = null

      // 加载可用教室
      await this.loadAvailableClassrooms()
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
        
        if (response && response.data) {
          this.newClassroomInfo = response.data
          // 缓存教室信息
          this.classroomInfoCache.set(classroomName, response.data)
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
        const lessonMessage = `${this.selectedCourse.room},${this.selectedCourse.name},${this.selectedCourse.teacher || this.teacher}`
        const whichLesson = parseInt(
          `${this.semester}${this.selectedCourseDay}${this.selectedCourseTimeSlot + 1}`,
        )

        const response = await getAvailableClassrooms({
          lessonMessage,
          whichLesson,
          lessonAtWhichWeek: this.currentDisplayWeek,
          toWhichWeek: this.currentDisplayWeek,
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
          toWhichWeek: this.currentDisplayWeek,
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
/* 基础样式 */
.schedule-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1.5rem;
  font-family: 'Inter', system-ui, sans-serif;
  color: #1a1a1a;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  min-height: 100vh;
}

.card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
  margin-bottom: 1.5rem;
  overflow: hidden;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.card:hover {
  box-shadow:
    0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
  transform: translateY(-2px);
}

.query-card {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.95) 100%);
}

.card-header {
  display: flex;
  align-items: center;
  padding: 1.5rem 2rem;
  border-bottom: 1px solid rgba(226, 232, 240, 0.5);
  background: linear-gradient(135deg, rgba(79, 70, 229, 0.05) 0%, rgba(124, 58, 237, 0.05) 100%);
}

.card-icon {
  width: 1.25rem;
  height: 1.25rem;
  color: #4f46e5;
  margin-right: 0.75rem;
}

.card-title {
  font-weight: 600;
  font-size: 1.1rem;
  color: #1e293b;
}

.header-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
  color: white;
  border-radius: 16px;
  padding: 2.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 10px 25px rgba(79, 70, 229, 0.3);
  position: relative;
  overflow: hidden;
}

.header-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="0.5"/></pattern></defs><rect width="100" height="100" fill="url(%23grid)"/></svg>');
  opacity: 0.3;
}

.header-content {
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 1;
}

.page-title {
  display: flex;
  align-items: center;
  font-size: 2rem;
  font-weight: 700;
  margin: 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.title-icon {
  width: 2rem;
  height: 2rem;
  margin-right: 0.75rem;
}

.page-subtitle {
  margin: 0.75rem 0 0 0;
  opacity: 0.9;
  font-size: 1.1rem;
  font-weight: 400;
}

.header-actions {
  display: flex;
  gap: 1rem;
  position: relative;
  z-index: 1;
}

.query-form {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  padding: 2rem;
  align-items: flex-end;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  flex: 1;
  min-width: 200px;
}

.form-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #475569;
  text-transform: uppercase;
  letter-spacing: 0.025em;
}

.form-input {
  padding: 0.875rem 1.25rem;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 0.875rem;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
}

.form-input:focus {
  outline: none;
  border-color: #4f46e5;
  box-shadow: 0 0 0 4px rgba(79, 70, 229, 0.1);
  background: rgba(255, 255, 255, 1);
  transform: translateY(-1px);
}

.primary-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.875rem 2rem;
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 140px;
  box-shadow: 0 4px 14px rgba(79, 70, 229, 0.3);
}

.primary-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(79, 70, 229, 0.4);
}

.primary-btn:active {
  transform: translateY(0);
}

.primary-btn:disabled {
  background: linear-gradient(135deg, #a5b4fc 0%, #c4b5fd 100%);
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.btn-icon {
  width: 1rem;
  height: 1rem;
}

.week-navigation {
  padding: 2rem;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(249, 250, 251, 0.95) 100%);
}

.week-controls {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
}

.week-nav-btn,
.week-jump-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem 1.25rem;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.9);
  color: #475569;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.week-nav-btn:hover,
.week-jump-btn:hover {
  background: rgba(255, 255, 255, 1);
  border-color: #4f46e5;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(79, 70, 229, 0.15);
}

.week-nav-btn:disabled,
.week-jump-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.week-jump-btn {
  background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
}

.nav-icon {
  width: 1rem;
  height: 1rem;
}

.week-display {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 220px;
  padding: 1rem 2rem;
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
  border-radius: 12px;
  color: white;
  box-shadow: 0 4px 14px rgba(79, 70, 229, 0.3);
}

.week-text {
  font-weight: 700;
  font-size: 1.5rem;
  color: white;
}

.week-date {
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.9);
  margin-top: 0.25rem;
}

.drag-status {
  margin-top: 2rem;
  padding: 1.5rem;
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  border-radius: 12px;
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  border: 1px solid #0ea5e9;
}

.drag-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.drag-label {
  font-size: 0.875rem;
  color: #0369a1;
  font-weight: 600;
}

.drag-value {
  font-size: 0.875rem;
  color: #1e293b;
  font-weight: 700;
}

.cross-week-badge {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  color: white;
  padding: 0.375rem 0.875rem;
  border-radius: 8px;
  font-size: 0.75rem;
  font-weight: 700;
  box-shadow: 0 2px 8px rgba(245, 158, 11, 0.3);
}

/* 模式提示样式 */
.adjust-mode-tips,
.view-mode-tips {
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  padding: 1.5rem 2rem;
  border-bottom: 1px solid rgba(224, 242, 254, 0.5);
}

.adjust-mode-tips {
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
}

.view-mode-tips {
  background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
}

.tip-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.875rem;
  font-weight: 500;
}

.adjust-mode-tips .tip-item {
  color: #0369a1;
}

.view-mode-tips .tip-item {
  color: #166534;
}

.tip-icon {
  width: 1.125rem;
  height: 1.125rem;
}

.table-card {
  position: relative;
  overflow: visible;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(248, 250, 252, 0.98) 100%);
}

.table-info {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #64748b;
  font-weight: 500;
}

.info-icon {
  width: 1rem;
  height: 1rem;
}

.cross-week-zones {
  position: relative;
  height: 0;
  z-index: 100;
}

.cross-week-zone {
  position: absolute;
  top: 20px;
  width: 140px;
  height: 450px;
  background: linear-gradient(
    135deg,
    rgba(79, 70, 229, 0.08) 0%,
    rgba(79, 70, 229, 0.15) 100%
  );
  border: 3px dashed rgba(79, 70, 229, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.4s ease;
  border-radius: 16px;
  backdrop-filter: blur(8px);
}

.cross-week-zone-left {
  left: -160px;
}

.cross-week-zone-right {
  right: -160px;
}

.cross-week-zone.active {
  background: linear-gradient(
    135deg,
    rgba(79, 70, 229, 0.2) 0%,
    rgba(79, 70, 229, 0.35) 100%
  );
  border-color: rgba(79, 70, 229, 0.8);
  transform: scale(1.05);
  box-shadow: 0 12px 30px rgba(79, 70, 229, 0.25);
}

.cross-week-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  color: #4f46e5;
  font-weight: 700;
  text-align: center;
}

.cross-week-icon {
  width: 2.5rem;
  height: 2.5rem;
}

.cross-week-text {
  font-size: 1.1rem;
}

.cross-week-week {
  font-size: 0.875rem;
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
  color: white;
  padding: 0.625rem 1.25rem;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(79, 70, 229, 0.4);
}

.table-container {
  position: relative;
  overflow-x: auto;
}

.table-container.adjust-mode {
  padding: 0 30px;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.95);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 10;
  backdrop-filter: blur(8px);
}

.loading-spinner {
  width: 3rem;
  height: 3rem;
  border: 4px solid #e2e8f0;
  border-top-color: #4f46e5;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.loading-text {
  margin-top: 1.5rem;
  color: #64748b;
  font-weight: 600;
  font-size: 1rem;
}

.schedule-table {
  width: 100%;
  border-collapse: collapse;
  border-radius: 12px;
  overflow: hidden;
}

.table-header-row {
  display: grid;
  grid-template-columns: 120px repeat(7, 1fr);
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
}

.time-header,
.day-header {
  padding: 1.25rem;
  text-align: center;
  border: 1px solid #e2e8f0;
  font-weight: 600;
}

.day-name {
  font-weight: 700;
  color: #1e293b;
  font-size: 1rem;
}

.day-date {
  font-size: 0.75rem;
  color: #64748b;
  margin-top: 0.5rem;
  font-weight: 500;
}

.table-row {
  display: grid;
  grid-template-columns: 120px repeat(7, 1fr);
}

.time-cell {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1.25rem;
  border: 1px solid #e2e8f0;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
}

.time-icon {
  width: 1.125rem;
  height: 1.125rem;
  color: #64748b;
  margin-bottom: 0.5rem;
}

.time-text {
  font-size: 0.8rem;
  color: #64748b;
  font-weight: 600;
}

.course-cell {
  position: relative;
  min-height: 120px;
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.8);
}

.course-cell.has-course {
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
}

.course-cell.highlight-available {
  background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
  border: 3px dashed #10b981;
  animation: pulse-available 2s infinite;
}

@keyframes pulse-available {
  0%,
  100% {
    background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
    border-color: #10b981;
  }
  50% {
    background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
    border-color: #059669;
  }
}

.course-cell.droppable {
  background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
  border: 3px solid #10b981;
}

.course-cell.drag-over {
  background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
  border: 4px solid #059669;
  transform: scale(1.05);
  z-index: 2;
  box-shadow: 0 12px 30px rgba(5, 150, 105, 0.4);
}

/* 课程内容样式 */
.course-content {
  height: 100%;
  display: flex;
  gap: 0.75rem;
  cursor: default;
  transition: all 0.3s ease;
  padding: 1rem;
  border-radius: 12px;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.95) 0%,
    rgba(248, 250, 252, 0.95) 100%
  );
  border: 2px solid rgba(79, 70, 229, 0.1);
  position: relative;
  backdrop-filter: blur(10px);
}

.course-content.draggable {
  cursor: grab;
  user-select: none;
}

.course-content.clickable {
  cursor: pointer;
}

.course-content.draggable:hover,
.course-content.clickable:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(79, 70, 229, 0.2);
  border-color: rgba(79, 70, 229, 0.4);
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 1) 0%,
    rgba(248, 250, 252, 1) 100%
  );
}

.course-content.draggable:active {
  cursor: grabbing;
  transform: scale(0.98);
}

.drag-handle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  flex-shrink: 0;
  cursor: grab;
}

.drag-dots {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.dot {
  width: 5px;
  height: 5px;
  background-color: #94a3b8;
  border-radius: 50%;
  transition: background-color 0.3s ease;
}

.course-content:hover .dot {
  background-color: #4f46e5;
}

.course-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
}

.course-name {
  font-weight: 700;
  color: #1e293b;
  font-size: 0.9rem;
  line-height: 1.3;
}

.course-room,
.course-teacher {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8rem;
  color: #64748b;
  font-weight: 500;
}

.room-icon,
.teacher-icon {
  width: 0.875rem;
  height: 0.875rem;
  flex-shrink: 0;
}

.course-actions {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  flex-shrink: 0;
}

.action-icon {
  width: 1.125rem;
  height: 1.125rem;
  color: #64748b;
  transition: color 0.3s ease;
}

.course-content:hover .action-icon {
  color: #4f46e5;
}

.empty-cell {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.empty-text {
  font-size: 0.8rem;
  color: #94a3b8;
  font-weight: 500;
}

.available-slot {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  color: #059669;
  font-size: 0.8rem;
  font-weight: 600;
}

.available-icon {
  width: 1.75rem;
  height: 1.75rem;
}

/* 课程信息对话框样式 */
.course-info-dialog {
  max-width: 700px;
}

.dialog-title-icon {
  width: 1.25rem;
  height: 1.25rem;
  margin-right: 0.5rem;
  color: #4f46e5;
}

.dialog-title-icon.warning {
  color: #f59e0b;
}

.course-info-details {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.info-section {
  border-radius: 12px;
  padding: 1.75rem;
  border: 1px solid #e2e8f0;
  transition: all 0.3s ease;
}

.info-section.basic-info {
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
}

.info-section.classroom-change {
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
}

.info-section.new-classroom-preview {
  background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
}

.section-title {
  display: flex;
  align-items: center;
  margin: 0 0 1.5rem 0;
  font-size: 1.1rem;
  font-weight: 700;
  color: #1e293b;
  border-bottom: 2px solid #e2e8f0;
  padding-bottom: 0.75rem;
}

.section-icon {
  width: 1.125rem;
  height: 1.125rem;
  margin-right: 0.75rem;
  color: #4f46e5;
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.25rem;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 10px;
  border: 1px solid rgba(226, 232, 240, 0.5);
  transition: all 0.3s ease;
}

.info-item:hover {
  background: rgba(255, 255, 255, 1);
  border-color: #cbd5e1;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.info-icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
  border-radius: 10px;
  flex-shrink: 0;
}

.info-item-icon {
  width: 1.25rem;
  height: 1.25rem;
  color: white;
}

.info-content {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  flex: 1;
}

.info-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.info-value {
  color: #1e293b;
  font-weight: 600;
  font-size: 1rem;
}

.info-value.current-room {
  color: #0369a1;
  background: linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%);
  padding: 0.375rem 0.75rem;
  border-radius: 6px;
  display: inline-block;
}

.classroom-selection {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.classroom-change-section {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.change-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: #475569;
}

.label-icon {
  width: 1rem;
  height: 1rem;
}

.select-wrapper {
  position: relative;
}

.classroom-select {
  width: 100%;
  padding: 1rem 1.25rem;
  padding-right: 3rem;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 0.875rem;
  background: rgba(255, 255, 255, 0.9);
  transition: all 0.3s ease;
  appearance: none;
  cursor: pointer;
}

.classroom-select:focus {
  outline: none;
  border-color: #4f46e5;
  box-shadow: 0 0 0 4px rgba(79, 70, 229, 0.1);
  background: rgba(255, 255, 255, 1);
}

.classroom-select:disabled {
  background: #f1f5f9;
  color: #94a3b8;
  cursor: not-allowed;
}

.select-arrow {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  width: 1.25rem;
  height: 1.25rem;
  color: #64748b;
  pointer-events: none;
}

/* 加载指示器 */
.loading-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 2.5rem;
  color: #64748b;
  font-size: 0.875rem;
  font-weight: 500;
}

.loading-spinner-small {
  width: 1.5rem;
  height: 1.5rem;
  border: 2px solid #e2e8f0;
  border-top-color: #4f46e5;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

/* 教室详情卡片 */
.classroom-details-card {
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border: 2px solid #e2e8f0;
  border-radius: 16px;
  padding: 2rem;
  margin-top: 1rem;
}

.classroom-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;
  padding-bottom: 1.25rem;
  border-bottom: 2px solid #e2e8f0;
}

.classroom-name {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.25rem;
  font-weight: 700;
  color: #1e293b;
}

.classroom-icon {
  width: 1.5rem;
  height: 1.5rem;
  color: #4f46e5;
}

.classroom-status {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: 600;
}

.classroom-status.status-normal {
  background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%);
  color: #166534;
}

.classroom-status.status-error {
  background: linear-gradient(135deg, #fef2f2 0%, #fecaca 100%);
  color: #dc2626;
}

.status-dot {
  width: 0.625rem;
  height: 0.625rem;
  border-radius: 50%;
}

.status-normal .status-dot {
  background-color: #22c55e;
}

.status-error .status-dot {
  background-color: #ef4444;
}

/* 教室信息网格 */
.classroom-info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.25rem;
}

.classroom-info-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1.25rem;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 12px;
  border: 1px solid rgba(226, 232, 240, 0.5);
  transition: all 0.3s ease;
}

.classroom-info-item:hover {
  background: rgba(255, 255, 255, 1);
  border-color: #cbd5e1;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.classroom-detail-icon {
  width: 1.125rem;
  height: 1.125rem;
  color: #64748b;
  margin-top: 0.125rem;
  flex-shrink: 0;
}

.classroom-detail-content {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.detail-title {
  font-size: 0.75rem;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.detail-desc {
  font-size: 0.875rem;
  font-weight: 600;
  color: #1e293b;
}

/* 错误消息 */
.error-message {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 2rem;
  color: #dc2626;
  font-weight: 500;
  background: linear-gradient(135deg, #fef2f2 0%, #fecaca 100%);
  border-radius: 12px;
  border: 1px solid #fca5a5;
}

.error-icon {
  width: 1.25rem;
  height: 1.25rem;
}

/* 对话框通用样式 */
.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
  backdrop-filter: blur(8px);
}

.dialog-container {
  background: rgba(255, 255, 255, 0.98);
  border-radius: 16px;
  width: 90%;
  max-width: 500px;
  box-shadow:
    0 25px 50px -12px rgba(0, 0, 0, 0.25),
    0 0 0 1px rgba(255, 255, 255, 0.2);
  overflow: hidden;
  backdrop-filter: blur(20px);
}

.dialog-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.75rem 2rem;
  border-bottom: 1px solid #e2e8f0;
  background: linear-gradient(135deg, rgba(79, 70, 229, 0.05) 0%, rgba(124, 58, 237, 0.05) 100%);
}

.dialog-title {
  display: flex;
  align-items: center;
  margin: 0;
  font-size: 1.25rem;
  font-weight: 700;
  color: #1e293b;
}

.dialog-close-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: #64748b;
  padding: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.dialog-close-btn:hover {
  background-color: #f1f5f9;
  color: #475569;
}

.close-icon {
  width: 1.5rem;
  height: 1.5rem;
}

.dialog-content {
  padding: 2rem;
}

.dialog-text {
  margin-top: 0;
  margin-bottom: 2rem;
  color: #475569;
  line-height: 1.6;
  font-size: 1rem;
}

.course-details {
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border-radius: 12px;
  padding: 1.75rem;
  border: 1px solid #e2e8f0;
}

.detail-item {
  display: flex;
  margin-bottom: 1rem;
}

.detail-item:last-child {
  margin-bottom: 0;
}

.detail-item.cross-week-notice {
  background: linear-gradient(135deg, #fff7ed 0%, #fed7aa 100%);
  padding: 1rem;
  border-radius: 10px;
  margin-top: 1rem;
  border: 1px solid #fdba74;
}

.detail-label {
  width: 100px;
  font-weight: 600;
  color: #64748b;
}

.detail-value {
  flex: 1;
  color: #1e293b;
  font-weight: 600;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding: 1.75rem 2rem;
  border-top: 1px solid #e2e8f0;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
}

.dialog-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem 1.75rem;
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.dialog-btn-cancel {
  background: rgba(255, 255, 255, 0.9);
  border: 2px solid #e2e8f0;
  color: #64748b;
}

.dialog-btn-cancel:hover {
  background: rgba(255, 255, 255, 1);
  border-color: #cbd5e1;
  transform: translateY(-1px);
}

.dialog-btn-confirm {
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
  border: 2px solid transparent;
  color: white;
  box-shadow: 0 4px 14px rgba(79, 70, 229, 0.3);
}

.dialog-btn-confirm:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(79, 70, 229, 0.4);
}

.dialog-btn-confirm:disabled {
  background: linear-gradient(135deg, #a5b4fc 0%, #c4b5fd 100%);
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.btn-icon.spinning {
  animation: spin 1s linear infinite;
}

/* 提示消息 */
.toast-notification {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  transform: translateY(100%);
  opacity: 0;
  transition: all 0.4s ease;
  z-index: 100;
}

.toast-notification.show {
  transform: translateY(0);
  opacity: 1;
}

.toast-content {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem 1.75rem;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  box-shadow:
    0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
  min-width: 320px;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.toast-icon {
  width: 1.5rem;
  height: 1.5rem;
}

.toast-success {
  color: #10b981;
}

.toast-error {
  color: #ef4444;
}

.toast-text {
  font-size: 0.875rem;
  color: #1e293b;
  font-weight: 600;
}

/* 按钮样式 */
.action-btn {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem 1.75rem;
  background: rgba(255, 255, 255, 0.2);
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 12px;
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.action-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(255, 255, 255, 0.2);
}

.action-btn.active {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  border-color: #10b981;
  color: white;
  box-shadow: 0 4px 14px rgba(16, 185, 129, 0.4);
}

.action-icon {
  width: 1.125rem;
  height: 1.125rem;
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .schedule-container {
    padding: 1rem;
  }

  .header-section {
    flex-direction: column;
    align-items: flex-start;
    gap: 1.5rem;
    padding: 2rem;
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
    left: -120px;
  }

  .cross-week-zone-right {
    right: -120px;
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
    gap: 0.75rem;
  }

  .week-nav-btn,
  .week-jump-btn {
    padding: 0.75rem 1rem;
    font-size: 0.875rem;
  }

  .drag-status {
    flex-direction: column;
    gap: 0.75rem;
  }

  .table-header-row,
  .table-row {
    grid-template-columns: 100px repeat(7, minmax(90px, 1fr));
  }

  .time-cell,
  .day-header,
  .course-cell {
    padding: 0.75rem;
  }

  .course-cell {
    min-height: 100px;
  }

  .cross-week-zone {
    width: 100px;
    height: 350px;
  }

  .cross-week-zone-left {
    left: -110px;
  }

  .cross-week-zone-right {
    right: -110px;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }

  .classroom-info-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .schedule-container {
    padding: 0.75rem;
  }

  .header-section {
    padding: 1.5rem;
  }

  .page-title {
    font-size: 1.5rem;
  }

  .title-icon {
    width: 1.5rem;
    height: 1.5rem;
  }

  .adjust-mode-tips,
  .view-mode-tips {
    flex-direction: column;
    gap: 0.75rem;
  }

  .table-header-row,
  .table-row {
    grid-template-columns: 80px repeat(7, minmax(70px, 1fr));
  }

  .time-cell,
  .day-header,
  .course-cell {
    padding: 0.5rem;
  }

  .course-cell {
    min-height: 90px;
  }

  .course-name {
    font-size: 0.8rem;
  }

  .course-room,
  .course-teacher {
    font-size: 0.7rem;
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

  .dialog-container {
    width: 95%;
    max-width: none;
  }

  .course-info-dialog {
    max-width: none;
  }

  .dialog-header,
  .dialog-content,
  .dialog-footer {
    padding: 1.25rem;
  }
}
</style>