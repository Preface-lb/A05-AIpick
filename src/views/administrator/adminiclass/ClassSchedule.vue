<template>
  <div class="schedule-container">
    <!-- Header with school info inputs -->
    <div class="info-card">
      <div class="info-header">
        <h2>课程表信息</h2>
        <span class="info-subtitle">请输入您要查询的的学院、专业和班级信息</span>
      </div>
      <div class="info-inputs">
        <div class="input-group">
          <label for="college">学院</label>
          <div class="input-wrapper">
            <input type="text" id="college" v-model="college" placeholder="请输入学院名称" />
            <span class="input-icon">🏛️</span>
          </div>
        </div>
        <div class="input-group">
          <label for="major">专业</label>
          <div class="input-wrapper">
            <input type="text" id="major" v-model="major" placeholder="请输入专业名称" />
            <span class="input-icon">📚</span>
          </div>
        </div>
        <div class="input-group">
          <label for="class">班级</label>
          <div class="input-wrapper">
            <input type="text" id="class" v-model="classInfo" placeholder="请输入班级名称" />
            <span class="input-icon">👥</span>
          </div>
        </div>
        <button class="confirm-button" @click="confirmInfo">
          <span class="button-text">确认信息</span>
          <span class="button-icon">✓</span>
        </button>
      </div>
    </div>

    <!-- Schedule controls -->
    <div class="schedule-controls">
      <div class="week-navigation">
        <button class="nav-button" @click="changeWeek(-1)" :disabled="currentWeek <= 1">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          上一周
        </button>
        <div class="week-display">
          <span class="week-text">第{{ currentWeek }}周</span>
        </div>
        <button class="nav-button" @click="changeWeek(1)">
          下一周
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
        </button>
      </div>
      <button class="print-button" @click="showPrintSettingsDialog">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9V2h12v7"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><path d="M6 14h12v8H6z"/></svg>
        打印课表
      </button>
    </div>

    <!-- Schedule table -->
    <div class="schedule-table-wrapper">
      <table class="schedule-table">
        <thead>
          <tr>
            <th class="time-column">时间</th>
            <th v-for="(day, index) in days" :key="index" class="day-column">
              <div class="day-name">{{ day }}</div>
              <div class="day-date">{{ getDayDate(day, index) }}</div>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(timeSlot, index) in timeSlots" :key="index">
            <td class="time-cell">
              <div class="time-slot">{{ timeSlot }}</div>
            </td>
            <td
              v-for="day in daysValue"
              :key="`${day}-${index}`"
              class="course-cell"
              :class="{ 'has-course': hasCourse(day, index) }"
            >
              <div v-if="hasCourse(day, index)" class="course-card">
                <div class="course-name">{{ getCourse(day, index).name }}</div>
                <div class="course-room">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21h18"/><path d="M5 21V7l8-4v18"/><path d="M19 21V11l-6-4"/><path d="M9 9h1"/><path d="M9 13h1"/><path d="M9 17h1"/></svg>
                  {{ getCourse(day, index).room }}
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Print settings modal -->
    <div v-if="showPrintSettings" class="modal-overlay" @click.self="closePrintSettings">
      <div class="modal-content">
        <div class="modal-header">
          <h3>打印设置</h3>
          <button class="close-button" @click="closePrintSettings">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        </div>
        <div class="modal-body">
          <div class="setting-group">
            <label class="setting-label">选取时间范围</label>
            <div class="date-range">
              <div class="date-input">
                <span class="date-label">开始日期</span>
                <input type="date" v-model="dateRange.start" class="date-picker" />
              </div>
              <div class="date-separator">至</div>
              <div class="date-input">
                <span class="date-label">结束日期</span>
                <input type="date" v-model="dateRange.end" class="date-picker" />
              </div>
            </div>
          </div>
          <div class="setting-group">
            <label class="setting-label">打印选项</label>
            <div class="print-options">
              <label class="checkbox-label">
                <input type="checkbox" v-model="printOptions.showBlankCourses" />
                <span class="checkbox-text">显示空白课程</span>
              </label>
              <label class="checkbox-label">
                <input type="checkbox" v-model="printOptions.colorPrint" />
                <span class="checkbox-text">彩色打印</span>
              </label>
              <div class="font-size-control">
                <span class="font-size-label">字体大小：{{ printOptions.fontSize }}px</span>
                <div class="slider-container">
                  <span class="slider-min">小</span>
                  <input
                    type="range"
                    v-model="printOptions.fontSize"
                    min="10"
                    max="20"
                    class="slider"
                  />
                  <span class="slider-max">大</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="cancel-button" @click="closePrintSettings">取消</button>
          <button class="confirm-button" @click="confirmPrint">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9V2h12v7"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><path d="M6 14h12v8H6z"/></svg>
            确认打印
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      currentWeek: 1,
      days: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
      daysValue: [1, 2, 3, 4, 5, 6, 0],
      timeSlots: [
        '8:00-10:00',
        '10:00-12:00',
        '12:00-14:00',
        '14:00-16:00',
        '16:00-18:00',
        '18:00-20:00',
        '20:00-22:00',
      ],
      courses: [
        {
          name: '高等数学',
          room: '教学楼A-101',
          day: 1,
          timeSlot: 1,
          week: 1,
        },
        {
          name: '数据结构',
          room: '教学楼B-203',
          day: 1,
          timeSlot: 4,
          week: 1,
        },
        {
          name: '计算机网络',
          room: '教学楼C-305',
          day: 2,
          timeSlot: 2,
          week: 1,
        },
        {
          name: '操作系统',
          room: '教学楼A-202',
          day: 3,
          timeSlot: 3,
          week: 1,
        },
      ],
      startDate: new Date(2025, 2, 3),
      showPrintSettings: false,
      dateRange: {
        start: '',
        end: '',
      },
      printOptions: {
        showBlankCourses: true,
        colorPrint: false,
        fontSize: 14,
      },
      college: '',
      major: '',
      classInfo: '',
    }
  },
  methods: {
    changeWeek(delta) {
      this.currentWeek += delta
      if (this.currentWeek < 1) this.currentWeek = 1
      console.log('当前周次:', this.currentWeek)
    },
    showPrintSettingsDialog() {
      // 设置默认日期范围为当前周的开始和结束
      const weekStart = new Date(this.startDate)
      weekStart.setDate(weekStart.getDate() + (this.currentWeek - 1) * 7)
      const weekEnd = new Date(weekStart)
      weekEnd.setDate(weekEnd.getDate() + 6)
      
      this.dateRange.start = this.formatDateForInput(weekStart)
      this.dateRange.end = this.formatDateForInput(weekEnd)
      
      this.showPrintSettings = true
    },
    formatDateForInput(date) {
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      return `${year}-${month}-${day}`
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
      printWindow.document.write(printContent)
      printWindow.document.close()
      setTimeout(() => {
        printWindow.print()
      }, 500)
    },
    generatePrintContent() {
      const schoolInfo = this.college && this.major && this.classInfo
        ? `<div class="school-info">${this.college} - ${this.major} - ${this.classInfo}</div>`
        : ''
      
      let html = `
        <html>
          <head>
            <title>课程表 - 第${this.currentWeek}周</title>
            <style>
              body {
                font-family: "Helvetica Neue", Arial, sans-serif;
                font-size: ${this.printOptions.fontSize}px;
                margin: 0;
                padding: 20px;
                color: #333;
              }
              .print-header {
                text-align: center;
                margin-bottom: 20px;
              }
              .print-header h1 {
                margin: 0;
                font-size: 24px;
                color: #2c3e50;
              }
              .school-info {
                font-size: 16px;
                color: #7f8c8d;
                margin-top: 5px;
              }
              .week-info {
                font-size: 16px;
                color: #7f8c8d;
                margin-top: 5px;
              }
              table {
                width: 100%;
                border-collapse: collapse;
                border: 1px solid #ddd;
              }
              th, td {
                border: 1px solid #ddd;
                text-align: center;
                padding: 8px;
              }
              th {
                background-color: ${this.printOptions.colorPrint ? '#f8f9fa' : '#f2f2f2'};
                font-weight: bold;
              }
              .day-name {
                font-weight: bold;
              }
              .day-date {
                font-size: 0.8em;
                color: #666;
              }
              .time-cell {
                background-color: ${this.printOptions.colorPrint ? '#f8f9fa' : '#f2f2f2'};
                font-weight: bold;
              }
              .course-cell {
                height: 80px;
                vertical-align: top;
              }
              .has-course {
                background-color: ${this.printOptions.colorPrint ? '#e3f2fd' : '#f5f5f5'};
              }
              .course-info {
                padding: 5px;
              }
              .course-name {
                font-weight: bold;
                margin-bottom: 5px;
                color: ${this.printOptions.colorPrint ? '#1976d2' : '#333'};
              }
              .course-room {
                font-size: 0.9em;
                color: #666;
              }
              .print-footer {
                margin-top: 20px;
                text-align: center;
                font-size: 12px;
                color: #999;
              }
            </style>
          </head>
          <body>
            <div class="print-header">
              <h1>课程表</h1>
              ${schoolInfo}
              <div class="week-info">第${this.currentWeek}周 (${this.formatDateForDisplay(this.dateRange.start)} - ${this.formatDateForDisplay(this.dateRange.end)})</div>
            </div>
            <table>
              <thead>
                <tr>
                  <th class="time-cell">时间</th>
                  ${this.days
                    .map(
                      (day, index) =>
                        `<th>
                          <div class="day-name">${day}</div>
                          <div class="day-date">${this.getDayDate(day, index)}</div>
                        </th>`
                    )
                    .join('')}
                </tr>
              </thead>
              <tbody>
                ${this.timeSlots
                  .map(
                    (timeSlot, index) => `
                    <tr>
                      <td class="time-cell">${timeSlot}</td>
                      ${this.daysValue
                        .map(
                          (day) => {
                            const hasCourse = this.hasCourse(day, index);
                            return `
                              <td class="course-cell ${hasCourse ? 'has-course' : ''}">
                                ${
                                  hasCourse
                                    ? `<div class="course-info">
                                        <div class="course-name">${this.getCourse(day, index).name}</div>
                                        <div class="course-room">${this.getCourse(day, index).room}</div>
                                      </div>`
                                    : this.printOptions.showBlankCourses ? '&nbsp;' : ''
                                }
                              </td>
                            `;
                          }
                        )
                        .join('')}
                    </tr>
                  `
                  )
                  .join('')}
              </tbody>
            </table>
            <div class="print-footer">
              打印时间: ${new Date().toLocaleString()}
            </div>
          </body>
        </html>
      `
      return html
    },
    formatDateForDisplay(dateString) {
      if (!dateString) return '';
      const date = new Date(dateString);
      return `${date.getMonth() + 1}月${date.getDate()}日`;
    },
    getDayDate(day, index) {
      const date = new Date(this.startDate)
      date.setDate(date.getDate() + (this.currentWeek - 1) * 7 + index)
      return `${date.getMonth() + 1}月${date.getDate()}日`
    },
    hasCourse(day, timeSlotIndex) {
      return this.courses.some(
        (course) =>
          course.day === day &&
          course.timeSlot === timeSlotIndex &&
          course.week === this.currentWeek,
      )
    },
    getCourse(day, timeSlotIndex) {
      return this.courses.find(
        (course) =>
          course.day === day &&
          course.timeSlot === timeSlotIndex &&
          course.week === this.currentWeek,
      )
    },
    confirmInfo() {
      console.log('学院:', this.college)
      console.log('专业:', this.major)
      console.log('班级:', this.classInfo)
      // 在这里可以添加确认后的逻辑，比如将学院、专业、班级信息传递给后端
      
      // 显示成功提示
      this.showToast('信息已保存')
    },
    showToast(message) {
      // 简单的提示实现，实际项目中可以使用更完善的toast组件
      const toast = document.createElement('div')
      toast.className = 'toast'
      toast.textContent = message
      document.body.appendChild(toast)
      
      setTimeout(() => {
        toast.classList.add('show')
        setTimeout(() => {
          toast.classList.remove('show')
          setTimeout(() => {
            document.body.removeChild(toast)
          }, 300)
        }, 2000)
      }, 100)
    }
  },
}
</script>

<style scoped>
/* 全局样式 */
.schedule-container {
  font-family: 'Helvetica Neue', Arial, sans-serif;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  color: #2c3e50;
}

/* 信息卡片样式 */
.info-card {
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
  padding: 24px;
  margin-bottom: 30px;
  transition: all 0.3s ease;
}

.info-header {
  margin-bottom: 20px;
}

.info-header h2 {
  margin: 0;
  font-size: 22px;
  font-weight: 600;
  color: #2c3e50;
}

.info-subtitle {
  display: block;
  font-size: 14px;
  color: #94a3b8;
  margin-top: 5px;
}

.info-inputs {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  align-items: end;
}

.input-group {
  display: flex;
  flex-direction: column;
}

.input-group label {
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 8px;
  color: #64748b;
}

.input-wrapper {
  position: relative;
}

.input-wrapper input {
  width: 100%;
  padding: 12px 16px;
  padding-right: 40px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 15px;
  transition: all 0.3s ease;
  background-color: #f8fafc;
}

.input-wrapper input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  background-color: #ffffff;
}

.input-icon {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
  font-size: 16px;
}

.confirm-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 24px;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(59, 130, 246, 0.2);
  height: 48px;
}

.confirm-button:hover {
  background-color: #2563eb;
  transform: translateY(-2px);
  box-shadow: 0 6px 10px rgba(59, 130, 246, 0.25);
}

.button-text {
  margin-right: 4px;
}

.button-icon {
  font-size: 18px;
}

/* 课表控制区域样式 */
.schedule-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  background-color: #ffffff;
  border-radius: 12px;
  padding: 16px 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
}

.week-navigation {
  display: flex;
  align-items: center;
  gap: 16px;
}

.nav-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background-color: #f1f5f9;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  color: #475569;
  cursor: pointer;
  transition: all 0.2s ease;
}

.nav-button:hover:not(:disabled) {
  background-color: #e2e8f0;
}

.nav-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.nav-button svg {
  width: 16px;
  height: 16px;
}

.week-display {
  display: flex;
  align-items: center;
  gap: 12px;
}

.week-text {
  font-size: 16px;
  font-weight: 500;
  color: #334155;
}

.print-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background-color: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  color: #475569;
  cursor: pointer;
  transition: all 0.2s ease;
}

.print-button:hover {
  background-color: #f1f5f9;
  border-color: #cbd5e1;
}

.print-button svg {
  color: #64748b;
}

/* 课表样式 */
.schedule-table-wrapper {
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

.schedule-table {
  width: 100%;
  border-collapse: collapse;
}

.schedule-table th,
.schedule-table td {
  border: 1px solid #e2e8f0;
  text-align: center;
  padding: 0;
}

.time-column {
  width: 120px;
  background-color: #f8fafc;
}

.day-column {
  padding: 12px 8px !important;
  background-color: #f8fafc;
}

.day-name {
  font-weight: 600;
  font-size: 15px;
  color: #334155;
}

.day-date {
  font-size: 13px;
  color: #64748b;
  margin-top: 4px;
}

.time-cell {
  background-color: #f8fafc;
  padding: 12px 8px !important;
}

.time-slot {
  font-size: 14px;
  font-weight: 500;
  color: #475569;
}

.course-cell {
  height: 100px;
  vertical-align: top;
  transition: background-color 0.2s ease;
}

.course-cell.has-course {
  background-color: #f0f9ff;
}

.course-card {
  height: 100%;
  padding: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  border-left: 3px solid #3b82f6;
  transition: all 0.2s ease;
}

.course-card:hover {
  background-color: #e0f2fe;
}

.course-name {
  font-weight: 600;
  font-size: 15px;
  color: #1e40af;
  margin-bottom: 6px;
}

.course-room {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  color: #64748b;
}

.course-room svg {
  color: #94a3b8;
}

/* 打印设置弹窗样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
}

.modal-content {
  background-color: white;
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  overflow: hidden;
  animation: modal-appear 0.3s ease-out;
}

@keyframes modal-appear {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  border-bottom: 1px solid #e2e8f0;
}

.modal-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
}

.close-button {
  background: none;
  border: none;
  cursor: pointer;
  color: #64748b;
  padding: 4px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s ease;
}

.close-button:hover {
  background-color: #f1f5f9;
  color: #475569;
}

.modal-body {
  padding: 24px;
}

.setting-group {
  margin-bottom: 24px;
}

.setting-label {
  display: block;
  font-size: 15px;
  font-weight: 500;
  color: #334155;
  margin-bottom: 12px;
}

.date-range {
  display: flex;
  align-items: center;
  gap: 12px;
}

.date-input {
  flex: 1;
}

.date-label {
  display: block;
  font-size: 13px;
  color: #64748b;
  margin-bottom: 6px;
}

.date-picker {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 14px;
  color: #334155;
  background-color: #f8fafc;
  transition: all 0.2s ease;
}

.date-picker:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  background-color: #ffffff;
}

.date-separator {
  font-size: 14px;
  color: #64748b;
}

.print-options {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.checkbox-label input[type="checkbox"] {
  width: 18px;
  height: 18px;
  accent-color: #3b82f6;
}

.checkbox-text {
  font-size: 14px;
  color: #475569;
}

.font-size-control {
  margin-top: 8px;
}

.font-size-label {
  display: block;
  font-size: 14px;
  color: #475569;
  margin-bottom: 8px;
}

.slider-container {
  display: flex;
  align-items: center;
  gap: 12px;
}

.slider-min, .slider-max {
  font-size: 13px;
  color: #64748b;
}

.slider {
  flex: 1;
  height: 4px;
  background: #e2e8f0;
  border-radius: 2px;
  appearance: none;
  outline: none;
}

.slider::-webkit-slider-thumb {
  appearance: none;
  width: 16px;
  height: 16px;
  background: #3b82f6;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.2s ease;
}

.slider::-webkit-slider-thumb:hover {
  background: #2563eb;
  transform: scale(1.1);
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 16px 24px;
  border-top: 1px solid #e2e8f0;
  background-color: #f8fafc;
}

.cancel-button {
  padding: 10px 16px;
  background-color: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  color: #475569;
  cursor: pointer;
  transition: all 0.2s ease;
}

.cancel-button:hover {
  background-color: #f1f5f9;
  border-color: #cbd5e1;
}

.modal-footer .confirm-button {
  padding: 10px 16px;
  height: auto;
  box-shadow: none;
}

/* Toast notification */
.toast {
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%) translateY(100px);
  background-color: #334155;
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  opacity: 0;
  transition: all 0.3s ease;
}

.toast.show {
  transform: translateX(-50%) translateY(0);
  opacity: 1;
}

/* Responsive styles */
@media (max-width: 768px) {
  .info-inputs {
    grid-template-columns: 1fr;
  }
  
  .schedule-controls {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }
  
  .week-navigation {
    justify-content: space-between;
  }
  
  .print-button {
    width: 100%;
    justify-content: center;
  }
  
  .date-range {
    flex-direction: column;
    gap: 16px;
  }
  
  .date-separator {
    display: none;
  }
}
</style>