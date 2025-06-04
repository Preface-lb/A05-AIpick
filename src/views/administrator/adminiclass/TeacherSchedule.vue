<template>
  <div class="schedule-container">
    <!-- Header Section -->
    <div class="header-section">
      <div class="header-content">
        <h1 class="page-title">
          <Calendar class="title-icon" />
          教师课程表管理
        </h1>
        <p class="page-subtitle">查看和管理教师课程安排</p>
      </div>
    </div>

    <!-- Query Section -->
    <div class="query-card">
      <div class="query-header">
        <Search class="query-icon" />
        <span class="query-title">查询条件</span>
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
            class="form-input form-input-small"
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
          class="query-btn"
          :disabled="loading"
        >
          <Search class="btn-icon" />
          {{ loading ? '查询中...' : '查询' }}
        </button>
      </div>
    </div>

    <!-- Week Navigation -->
    <div class="navigation-card">
      <div class="nav-controls">
        <button @click="changeWeek(-1)" class="nav-btn nav-btn-prev">
          <ChevronLeft class="nav-icon" />
          上一周
        </button>
        <div class="week-display">
          <span class="week-text">第 {{ currentWeek }} 周</span>
          <span class="week-date">{{ getWeekDateRange() }}</span>
        </div>
        <button @click="changeWeek(1)" class="nav-btn nav-btn-next">
          下一周
          <ChevronRight class="nav-icon" />
        </button>
      </div>
      <button @click="showPrintSettingsDialog" class="print-btn">
        <Printer class="btn-icon" />
        打印课程表
      </button>
    </div>

    <!-- Course Table -->
    <div class="table-card">
      <div class="table-header">
        <BookOpen class="table-icon" />
        <span class="table-title">课程安排表</span>
        <div class="table-info" v-if="teacher">
          <User class="info-icon" />
          {{ teacher }} 老师 - {{ semester }} 学期
        </div>
      </div>
      
      <div class="table-container" :class="{ 'loading': loading }">
        <div v-if="loading" class="loading-overlay">
          <div class="loading-spinner"></div>
          <p class="loading-text">正在加载课程表...</p>
        </div>
        
        <div class="schedule-table">
          <div class="table-header-row">
            <div class="time-header">时间</div>
            <div 
              v-for="(day, index) in days" 
              :key="index"
              class="day-header"
            >
              <div class="day-name">{{ day }}</div>
              <div class="day-date">{{ getDayDate(index) }}</div>
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
                :class="{ 'has-course': hasCourse(dayIndex + 1, timeIndex) }"
              >
                <div 
                  v-if="hasCourse(dayIndex + 1, timeIndex)"
                  class="course-content"
                >
                  <div class="course-name">
                    {{ getCourse(dayIndex + 1, timeIndex).name }}
                  </div>
                  <div class="course-room">
                    <MapPin class="room-icon" />
                    {{ getCourse(dayIndex + 1, timeIndex).room }}
                  </div>
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

    <!-- Print Settings Dialog -->
    <div v-if="showPrintSettings" class="modal-overlay" @click="closePrintSettings">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3 class="modal-title">
            <Settings class="modal-icon" />
            打印设置
          </h3>
          <button @click="closePrintSettings" class="modal-close">
            <X class="close-icon" />
          </button>
        </div>
        
        <div class="modal-body">
          <div class="setting-group">
            <label class="setting-label">打印日期范围</label>
            <div class="date-range">
              <div class="date-input-group">
                <label class="date-label">开始日期</label>
                <input 
                  v-model="dateRange.start" 
                  type="date" 
                  class="date-input"
                />
              </div>
              <div class="date-input-group">
                <label class="date-label">结束日期</label>
                <input 
                  v-model="dateRange.end" 
                  type="date" 
                  class="date-input"
                />
              </div>
            </div>
          </div>
          
          <div class="setting-group">
            <label class="setting-label">打印选项</label>
            <div class="checkbox-group">
              <label class="checkbox-item">
                <input 
                  type="checkbox" 
                  v-model="printOptions.showBlankCourses"
                  class="checkbox-input"
                />
                <span class="checkbox-text">显示空白课程</span>
              </label>
              <label class="checkbox-item">
                <input 
                  type="checkbox" 
                  v-model="printOptions.colorPrint"
                  class="checkbox-input"
                />
                <span class="checkbox-text">彩色打印</span>
              </label>
            </div>
          </div>
          
          <div class="setting-group">
            <label class="setting-label">字体大小</label>
            <div class="font-size-control">
              <input 
                type="range" 
                v-model="printOptions.fontSize" 
                min="10" 
                max="20" 
                class="font-slider"
              />
              <span class="font-size-display">{{ printOptions.fontSize }}px</span>
            </div>
          </div>
        </div>
        
        <div class="modal-footer">
          <button @click="closePrintSettings" class="btn-secondary">
            取消
          </button>
          <button @click="confirmPrint" class="btn-primary">
            <Printer class="btn-icon" />
            确认打印
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
  Calendar, Search, ChevronLeft, ChevronRight, Printer, BookOpen, 
  User, Clock, MapPin, Settings, X, CheckCircle, AlertCircle 
} from 'lucide-vue-next'
import { getTeacherCourseTable } from '@/api/admin/teacoursetable'

export default {
  name: 'TeacherSchedule',
  components: {
    Calendar, Search, ChevronLeft, ChevronRight, Printer, BookOpen,
    User, Clock, MapPin, Settings, X, CheckCircle, AlertCircle
  },
  data() {
    return {
      semester: '202402',
      week: 1,
      teacher: '',
      currentWeek: 1,
      days: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
      timeSlots: [
        '08:00-9:40',
        '10:00-11:40',
        '14:00-15:40',
        '16:00-17:40',
        '19:00-20:40'
      ],
      courses: [],
      loading: false,
      startDate: new Date(2025, 1, 24),
      showPrintSettings: false,
      dateRange: {
        start: '',
        end: ''
      },
      printOptions: {
        showBlankCourses: true,
        colorPrint: false,
        fontSize: 14
      },
      toastMessage: '',
      showToast: false,
      toastType: 'success'
    }
  },
  mounted() {
    this.confirmInfo()
  },
  methods: {
    async confirmInfo() {
      if (!this.semester || !this.teacher) {
        this.showToastMessage('请输入学期和教师姓名', 'error')
        return
      }
      
      this.loading = true
      
      try {
        const response = await getTeacherCourseTable({
          semester: this.semester,
          week: this.week || this.currentWeek,
          teacher: this.teacher
        })
        
        this.courses = this.transformCourseData(response.courseTable)
        this.currentWeek = response.week || this.currentWeek
        this.showToastMessage('课程表加载成功', 'success')
      } catch (error) {
        console.error('请求失败:', error)
        this.showToastMessage(error.message || '请求失败，请稍后重试', 'error')
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
    
    changeWeek(delta) {
      this.currentWeek += delta
      if (this.currentWeek < 1) this.currentWeek = 1
      this.week = this.currentWeek
      this.confirmInfo()
    },
    
    getDayDate(dayIndex) {
      const date = new Date(this.startDate)
      date.setDate(date.getDate() + (this.currentWeek - 1) * 7 + dayIndex)
      return `${date.getMonth() + 1}/${date.getDate()}`
    },

    getWeekDateRange() {
      const startDate = new Date(this.startDate)
      startDate.setDate(startDate.getDate() + (this.currentWeek - 1) * 7)
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

    showPrintSettingsDialog() {
      const weekStart = new Date(this.startDate)
      weekStart.setDate(weekStart.getDate() + (this.currentWeek - 1) * 7)
      const weekEnd = new Date(weekStart)
      weekEnd.setDate(weekEnd.getDate() + 6)
      
      this.dateRange.start = this.formatDateForInput(weekStart)
      this.dateRange.end = this.formatDateForInput(weekEnd)
      this.showPrintSettings = true
    },
    
    closePrintSettings() {
      this.showPrintSettings = false
    },
    
    confirmPrint() {
      this.closePrintSettings()
      this.printSchedule()
    },
    
    printSchedule() {
      const printContent = this.generatePrintContent()
      const printWindow = window.open('', '_blank')
      
      if (!printWindow) {
        this.showToastMessage('请允许浏览器弹出窗口', 'error')
        return
      }
      
      printWindow.document.write(printContent)
      printWindow.document.close()
      
      printWindow.onload = () => {
        printWindow.print()
      }
    },
    
    generatePrintContent() {
      const startDate = this.dateRange.start ? new Date(this.dateRange.start) : new Date(this.startDate)
      const endDate = this.dateRange.end ? new Date(this.dateRange.end) : new Date(this.startDate)
      endDate.setDate(endDate.getDate() + 6)
      
      const formatDate = (date) => `${date.getMonth() + 1}月${date.getDate()}日`
      
      return `
        <html>
          <head>
            <title>课程表 - 第${this.currentWeek}周</title>
            <style>
              body { font-family: "Helvetica Neue", Arial, sans-serif; font-size: ${this.printOptions.fontSize}px; margin: 0; padding: 20px; color: #333; }
              .print-header { text-align: center; margin-bottom: 20px; }
              .print-header h1 { margin: 0; font-size: 24px; color: #2c3e50; }
              .school-info, .week-info { font-size: 16px; color: #7f8c8d; margin-top: 5px; }
              table { width: 100%; border-collapse: collapse; border: 1px solid #ddd; }
              th, td { border: 1px solid #ddd; text-align: center; padding: 8px; }
              th { background-color: ${this.printOptions.colorPrint ? '#f8f9fa' : '#f2f2f2'}; font-weight: bold; }
              .time-cell { background-color: ${this.printOptions.colorPrint ? '#f8f9fa' : '#f2f2f2'}; font-weight: bold; }
              .course-cell { height: 80px; vertical-align: top; }
              .has-course { background-color: ${this.printOptions.colorPrint ? '#e3f2fd' : '#f5f5f5'}; }
              .course-info { padding: 5px; }
              .course-name { font-weight: bold; margin-bottom: 5px; color: ${this.printOptions.colorPrint ? '#1976d2' : '#333'}; }
              .course-room { font-size: 0.9em; color: #666; }
              .print-footer { margin-top: 20px; text-align: center; font-size: 12px; color: #999; }
            </style>
          </head>
          <body>
            <div class="print-header">
              <h1>课程表</h1>
              <div class="school-info">${this.semester} 学期 - ${this.teacher} 教师</div>
              <div class="week-info">第${this.currentWeek}周 (${formatDate(startDate)} - ${formatDate(endDate)})</div>
            </div>
            <table>
              <thead>
                <tr>
                  <th class="time-cell">时间</th>
                  ${this.days.map((day, index) => `
                    <th>
                      <div>${day}</div>
                      <div style="font-size: 0.8em; color: #666;">${this.getDayDate(index)}</div>
                    </th>
                  `).join('')}
                </tr>
              </thead>
              <tbody>
                ${this.timeSlots.map((timeSlot, timeIndex) => `
                  <tr>
                    <td class="time-cell">${timeSlot}</td>
                    ${this.days.map((_, dayIndex) => {
                      const day = dayIndex + 1
                      const hasCourse = this.hasCourse(day, timeIndex)
                      const course = this.getCourse(day, timeIndex)
                      
                      return `
                        <td class="course-cell ${hasCourse ? 'has-course' : ''}">
                          ${hasCourse 
                            ? `<div class="course-info">
                                <div class="course-name">${course.name}</div>
                                <div class="course-room">${course.room}</div>
                              </div>`
                            : this.printOptions.showBlankCourses ? '&nbsp;' : ''
                          }
                        </td>
                      `
                    }).join('')}
                  </tr>
                `).join('')}
              </tbody>
            </table>
            <div class="print-footer">
              打印时间: ${new Date().toLocaleString()}
            </div>
          </body>
        </html>
      `
    },
    
    formatDateForInput(date) {
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      return `${year}-${month}-${day}`
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
    }
  }
}
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.schedule-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
}

/* Header Section */
.header-section {
  text-align: center;
  margin-bottom: 2rem;
}

.header-content {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.page-title {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  font-size: 2.5rem;
  font-weight: 700;
  color: white;
  margin: 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.title-icon {
  width: 2.5rem;
  height: 2.5rem;
}

.page-subtitle {
  color: rgba(255, 255, 255, 0.8);
  font-size: 1.1rem;
  margin: 0.5rem 0 0 0;
}

/* Card Styles */
.query-card, .navigation-card, .table-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  margin-bottom: 1.5rem;
  overflow: hidden;
}

/* Query Section */
.query-header {
  background: linear-gradient(135deg, #4f46e5, #7c3aed);
  color: white;
  padding: 1rem 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.query-icon, .table-icon {
  width: 1.25rem;
  height: 1.25rem;
}

.query-title, .table-title {
  font-weight: 600;
  font-size: 1.1rem;
}

.query-form {
  padding: 1.5rem;
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: end;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-label {
  font-weight: 500;
  color: #374151;
  font-size: 0.875rem;
}

.form-input {
  padding: 0.75rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 0.875rem;
  transition: all 0.2s;
  min-width: 200px;
}

.form-input-small {
  min-width: 100px;
}

.form-input:focus {
  outline: none;
  border-color: #4f46e5;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
}

.query-btn {
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  height: fit-content;
}

.query-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
}

.query-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-icon {
  width: 1rem;
  height: 1rem;
}

/* Navigation Section */
.navigation-card {
  padding: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.nav-controls {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.nav-btn {
  background: #f8fafc;
  border: 2px solid #e2e8f0;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
  color: #475569;
}

.nav-btn:hover {
  background: #e2e8f0;
  transform: translateY(-1px);
}

.nav-icon {
  width: 1rem;
  height: 1rem;
}

.week-display {
  text-align: center;
  padding: 0 1rem;
}

.week-text {
  display: block;
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
}

.week-date {
  display: block;
  font-size: 0.875rem;
  color: #64748b;
  margin-top: 0.25rem;
}

.print-btn {
  background: linear-gradient(135deg, #f59e0b, #d97706);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.print-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
}

/* Table Section */
.table-header {
  background: linear-gradient(135deg, #1e40af, #3730a3);
  color: white;
  padding: 1rem 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
}

.table-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  opacity: 0.9;
}

.info-icon {
  width: 1rem;
  height: 1rem;
}

.table-container {
  position: relative;
  padding: 1.5rem;
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
  z-index: 10;
}

.loading-spinner {
  width: 3rem;
  height: 3rem;
  border: 3px solid #e5e7eb;
  border-top: 3px solid #4f46e5;
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

/* Schedule Table */
.schedule-table {
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #e5e7eb;
}

.table-header-row {
  display: grid;
  grid-template-columns: 120px repeat(7, 1fr);
  background: #f8fafc;
}

.time-header, .day-header {
  padding: 1rem;
  font-weight: 600;
  text-align: center;
  border-right: 1px solid #e5e7eb;
}

.time-header {
  background: #e2e8f0;
  color: #475569;
}

.day-header {
  background: linear-gradient(135deg, #f1f5f9, #e2e8f0);
}

.day-name {
  font-size: 1rem;
  color: #1e293b;
}

.day-date {
  font-size: 0.75rem;
  color: #64748b;
  margin-top: 0.25rem;
}

.table-row {
  display: grid;
  grid-template-columns: 120px repeat(7, 1fr);
  border-bottom: 1px solid #e5e7eb;
}

.time-cell {
  background: #f8fafc;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  border-right: 1px solid #e5e7eb;
}

.time-icon {
  width: 1rem;
  height: 1rem;
  color: #6b7280;
}

.time-text {
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
}

.course-cell {
  padding: 0.75rem;
  border-right: 1px solid #e5e7eb;
  min-height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.course-cell.has-course {
  background: linear-gradient(135deg, #dbeafe, #bfdbfe);
}

.course-cell:hover.has-course {
  background: linear-gradient(135deg, #bfdbfe, #93c5fd);
  transform: scale(1.02);
}

.course-content {
  text-align: center;
  width: 100%;
}

.course-name {
  font-weight: 600;
  color: #1e40af;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
}

.course-room {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  font-size: 0.75rem;
  color: #6b7280;
}

.room-icon {
  width: 0.75rem;
  height: 0.75rem;
}

.empty-cell {
  text-align: center;
  color: #9ca3af;
  font-size: 0.75rem;
}

.empty-text {
  opacity: 0.5;
}

/* Modal Styles */
.modal-overlay {
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
  padding: 1rem;
}

.modal-content {
  background: white;
  border-radius: 16px;
  max-width: 500px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3);
}

.modal-header {
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.modal-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
}

.modal-icon {
  width: 1.25rem;
  height: 1.25rem;
}

.modal-close {
  background: none;
  border: none;
  padding: 0.5rem;
  cursor: pointer;
  border-radius: 6px;
  transition: background-color 0.2s;
}

.modal-close:hover {
  background: #f3f4f6;
}

.close-icon {
  width: 1.25rem;
  height: 1.25rem;
  color: #6b7280;
}

.modal-body {
  padding: 1.5rem;
}

.setting-group {
  margin-bottom: 1.5rem;
}

.setting-label {
  display: block;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.75rem;
}

.date-range {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.date-input-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.date-label {
  font-size: 0.875rem;
  color: #6b7280;
}

.date-input {
  padding: 0.75rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 0.875rem;
  transition: border-color 0.2s;
}

.date-input:focus {
  outline: none;
  border-color: #4f46e5;
}

.checkbox-group {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.checkbox-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.checkbox-input {
  width: 1rem;
  height: 1rem;
  accent-color: #4f46e5;
}

.checkbox-text {
  font-size: 0.875rem;
  color: #374151;
}

.font-size-control {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.font-slider {
  flex: 1;
  accent-color: #4f46e5;
}

.font-size-display {
  font-weight: 500;
  color: #4f46e5;
  min-width: 3rem;
}

.modal-footer {
  padding: 1.5rem;
  border-top: 1px solid #e5e7eb;
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
}

.btn-secondary {
  background: #f3f4f6;
  color: #374151;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-secondary:hover {
  background: #e5e7eb;
}

.btn-primary {
  background: linear-gradient(135deg, #4f46e5, #7c3aed);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
}

/* Toast Notification */
.toast-notification {
  position: fixed;
  top: 2rem;
  right: 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  padding: 1rem 1.5rem;
  transform: translateX(100%);
  transition: transform 0.3s ease;
  z-index: 1001;
  max-width: 400px;
}

.toast-notification.show {
  transform: translateX(0);
}

.toast-content {
  display: flex;
  align-items: center;
  gap: 0.75rem;
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
  font-weight: 500;
  color: #374151;
}

/* Responsive Design */
@media (max-width: 768px) {
  .schedule-container {
    padding: 1rem;
  }
  
  .page-title {
    font-size: 2rem;
  }
  
  .query-form {
    flex-direction: column;
    align-items: stretch;
  }
  
  .form-input {
    min-width: auto;
  }
  
  .navigation-card {
    flex-direction: column;
    text-align: center;
  }
  
  .nav-controls {
    justify-content: center;
  }
  
  .table-header-row,
  .table-row {
    grid-template-columns: 80px repeat(7, 1fr);
  }
  
  .time-cell {
    padding: 0.5rem;
  }
  
  .course-cell {
    padding: 0.5rem;
    min-height: 80px;
  }
  
  .course-name {
    font-size: 0.75rem;
  }
  
  .course-room {
    font-size: 0.625rem;
  }
  
  .date-range {
    grid-template-columns: 1fr;
  }
  
  .toast-notification {
    top: 1rem;
    right: 1rem;
    left: 1rem;
    max-width: none;
  }
}
</style>