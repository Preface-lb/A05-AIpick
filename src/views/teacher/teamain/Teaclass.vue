<template>
  <div class="sc-container">
    <!-- 背景装饰元素 -->
    <div class="sc-bg-decoration">
      <div class="sc-bg-circle sc-circle-1"></div>
      <div class="sc-bg-circle sc-circle-2"></div>
      <div class="sc-bg-circle sc-circle-3"></div>
      <div class="sc-bg-pattern"></div>
    </div>

    <!-- 课表头部 -->
    <div class="sc-header">
      <div class="sc-header-left">
        <div class="sc-logo-area">
          <div class="sc-logo-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
            </svg>
          </div>
          <span class="sc-logo-text">智能课表</span>
        </div>
      </div>

      <!-- 周次显示区域 -->
      <div class="sc-week-display">
        <!-- 上一周按钮 -->
        <button class="sc-arrow-btn sc-prev-btn" @click="changeWeek(-1)" aria-label="上一周">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>
        <!-- 显示当前周次 -->
        <div class="sc-week-number-container">
          <span class="sc-week-label">当前周次</span>
          <span class="sc-week-number">{{ currentWeek }}</span>
        </div>
        <!-- 下一周按钮 -->
        <button class="sc-arrow-btn sc-next-btn" @click="changeWeek(1)" aria-label="下一周">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      </div>

      <!-- 打印按钮区域 -->
      <div class="sc-print-button">
        <button @click="showPrintSettingsDialog">
          <span class="sc-btn-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M6 9V2h12v7"></path>
              <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
              <path d="M6 14h12v8H6z"></path>
            </svg>
          </span>
          <span>打印课表</span>
        </button>
      </div>
    </div>

    <!-- 课表表格区域 -->
    <div class="sc-table-wrapper">
      <div class="sc-table">
        <table>
          <thead>
            <tr>
              <!-- 时间列标题 -->
              <th class="sc-time-column">时间</th>
              <!-- 循环显示星期几和对应的日期 -->
              <th v-for="(day, index) in days" :key="index" class="sc-day-column">
                <div class="sc-day-header">
                  <span class="sc-day-name">{{ day }}</span>
                  <span class="sc-date">{{ getDayDate(day, index) }}</span>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            <!-- 循环显示每个时间段 -->
            <tr v-for="(timeSlot, index) in timeSlots" :key="index">
              <!-- 显示时间段 -->
              <td class="sc-time-cell">
                <div class="sc-time-display">
                  <span class="sc-time-text">{{ timeSlot }}</span>
                  <span class="sc-time-index">{{ index + 1 }}</span>
                </div>
              </td>
              <!-- 循环显示每一天的课程格子 -->
              <td
                v-for="day in daysValue"
                :key="`${day}-${index}`"
                class="sc-course-cell"
                :class="{ 'sc-has-course': hasCourse(day, index) }"
              >
                <!-- 如果该时间段有课程，显示课程信息 -->
                <div v-if="hasCourse(day, index)" class="sc-course-info">
                  <div class="sc-course-name">{{ getCourse(day, index).name }}</div>
                  <div class="sc-course-room">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                      <polyline points="9 22 9 12 15 12 15 22"></polyline>
                    </svg>
                    <span>{{ getCourse(day, index).room }}</span>
                  </div>
                </div>
                <div v-else class="sc-empty-cell">
                  <div class="sc-empty-icon"></div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 打印设置弹窗 -->
    <transition name="sc-modal-fade">
      <div v-if="showPrintSettings" class="sc-print-settings">
        <div class="sc-backdrop" @click="closePrintSettings"></div>
        <div class="sc-settings-content">
          <div class="sc-modal-decoration">
            <div class="sc-modal-circle sc-modal-circle-1"></div>
            <div class="sc-modal-circle sc-modal-circle-2"></div>
          </div>
          
          <div class="sc-settings-header">
            <h3>打印设置</h3>
            <button class="sc-close-btn" @click="closePrintSettings" aria-label="关闭">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          
          <div class="sc-setting-item">
            <label>选取时间范围</label>
            <div class="sc-date-range">
              <div class="sc-date-input-wrapper">
                <span class="sc-date-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                </span>
                <input type="date" v-model="dateRange.start" class="sc-date-input" />
              </div>
              <div class="sc-date-separator">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
              </div>
              <div class="sc-date-input-wrapper">
                <span class="sc-date-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                </span>
                <input type="date" v-model="dateRange.end" class="sc-date-input" />
              </div>
            </div>
          </div>
          
          <div class="sc-setting-item">
            <label>打印选项</label>
            <div class="sc-options">
              <label class="sc-checkbox-label">
                <div class="sc-checkbox-wrapper">
                  <input type="checkbox" v-model="printOptions.showBlankCourses" />
                  <span class="sc-checkbox-custom">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </span>
                </div>
                <span>显示空白课程</span>
              </label>
              <label class="sc-checkbox-label">
                <div class="sc-checkbox-wrapper">
                  <input type="checkbox" v-model="printOptions.colorPrint" />
                  <span class="sc-checkbox-custom">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </span>
                </div>
                <span>彩色打印</span>
              </label>
              <div class="sc-range-option">
                <div class="sc-range-header">
                  <span>字体大小</span>
                  <span class="sc-font-size-value">{{ printOptions.fontSize }}px</span>
                </div>
                <div class="sc-range-slider-wrapper">
                  <input
                    type="range"
                    v-model="printOptions.fontSize"
                    min="10"
                    max="20"
                    class="sc-range-slider"
                  />
                  <div class="sc-range-track">
                    <div class="sc-range-progress" :style="{width: ((printOptions.fontSize - 10) / 10) * 100 + '%'}"></div>
                  </div>
                  <div class="sc-range-labels">
                    <span>小</span>
                    <span>中</span>
                    <span>大</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="sc-buttons">
            <button class="sc-cancel-btn" @click="closePrintSettings">
              <span>取消</span>
            </button>
            <button class="sc-confirm-btn" @click="confirmPrint">
              <span class="sc-btn-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M6 9V2h12v7"></path>
                  <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
                  <path d="M6 14h12v8H6z"></path>
                </svg>
              </span>
              <span>确认打印</span>
            </button>
          </div>
        </div>
      </div>
    </transition>
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
          room: '教学楼B-202',
          day: 1,
          timeSlot: 4,
          week: 1,
        },
        {
          name: '英语听力',
          room: '语音室C-303',
          day: 3,
          timeSlot: 2,
          week: 1,
        },
        {
          name: '物理实验',
          room: '实验楼D-404',
          day: 5,
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
        colorPrint: true,
        fontSize: 14,
      },
    }
  },
  methods: {
    changeWeek(delta) {
      this.currentWeek += delta
      if (this.currentWeek < 1) this.currentWeek = 1
      console.log('当前周次:', this.currentWeek)
    },
    showPrintSettingsDialog() {
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
      printWindow.document.write(printContent)
      printWindow.document.close()
      printWindow.print()
    },
    generatePrintContent() {
      let html = `
        <html>
          <head>
            <title>打印课表</title>
            <style>
              @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
              
              body {
                font-family: 'Poppins', 'Segoe UI', sans-serif;
                font-size: ${this.printOptions.fontSize}px;
                color: #2c3e50;
                margin: 0;
                padding: 30px;
                background-color: ${this.printOptions.colorPrint ? '#f8fafc' : '#ffffff'};
              }
              
              .sc-print-header {
                text-align: center;
                margin-bottom: 30px;
              }
              
              h1 {
                color: ${this.printOptions.colorPrint ? '#6366f1' : '#333'};
                font-weight: 700;
                margin-bottom: 10px;
                font-size: 28px;
              }
              
              .sc-print-date {
                color: #64748b;
                font-size: 16px;
              }
              
              table {
                width: 100%;
                border-collapse: collapse;
                border-radius: 12px;
                overflow: hidden;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
              }
              
              th, td {
                border: 1px solid ${this.printOptions.colorPrint ? '#e2e8f0' : '#ddd'};
                text-align: center;
                padding: 15px;
              }
              
              th {
                background-color: ${this.printOptions.colorPrint ? '#6366f1' : '#f2f2f2'};
                color: ${this.printOptions.colorPrint ? 'white' : '#333'};
                font-weight: 600;
                text-transform: uppercase;
                font-size: 0.9em;
                letter-spacing: 0.5px;
              }
              
              .sc-time-column {
                background-color: ${this.printOptions.colorPrint ? '#818cf8' : '#f8f8f8'};
                color: ${this.printOptions.colorPrint ? 'white' : '#333'};
                font-weight: 600;
              }
              
              .sc-has-course {
                background-color: ${this.printOptions.colorPrint ? '#e0e7ff' : '#f9f9f9'};
              }
              
              .sc-course-name {
                font-weight: 600;
                margin-bottom: 8px;
                color: ${this.printOptions.colorPrint ? '#4f46e5' : '#333'};
              }
              
              .sc-course-room {
                font-size: 0.9em;
                color: ${this.printOptions.colorPrint ? '#6b7280' : '#666'};
              }
              
              .sc-date {
                font-size: 0.8em;
                color: ${this.printOptions.colorPrint ? '#94a3b8' : '#777'};
                display: block;
                margin-top: 5px;
              }
              
              .sc-footer {
                margin-top: 30px;
                text-align: center;
                font-size: 0.8em;
                color: #94a3b8;
              }
              
              @media print {
                body {
                  -webkit-print-color-adjust: exact;
                  print-color-adjust: exact;
                  background-color: white;
                }
                
                table {
                  box-shadow: none;
                }
              }
            </style>
          </head>
          <body>
            <div class="sc-print-header">
              <h1>课程表 - 第${this.currentWeek}周</h1>
              <div class="sc-print-date">打印日期: ${new Date().toLocaleDateString()}</div>
            </div>
            
            <table>
              <thead>
                <tr>
                  <th class="sc-time-column">时间</th>
                  ${this.days
                    .map(
                      (day, index) =>
                        `<th>${day}<span class="sc-date">${this.getDayDate(
                          day,
                          index,
                        )}</span></th>`,
                    )
                    .join('')}
                </tr>
              </thead>
              <tbody>
                ${this.timeSlots
                  .map(
                    (timeSlot, index) => `
                    <tr>
                      <td class="sc-time-column">${timeSlot}</td>
                      ${this.daysValue
                        .map(
                          (day) => `
                          <td class="${
                            this.hasCourse(day, index) ? 'sc-has-course' : ''
                          }">
                            ${
                              this.hasCourse(day, index)
                                ? `<div class="sc-course-info">
                                    <div class="sc-course-name">${
                                      this.getCourse(day, index).name
                                    }</div>
                                    <div class="sc-course-room">${
                                      this.getCourse(day, index).room
                                    }</div>
                                  </div>`
                                : this.printOptions.showBlankCourses ? '&nbsp;' : ''
                            }
                          </td>
                        `,
                        )
                        .join('')}
                    </tr>
                  `,
                  )
                  .join('')}
              </tbody>
            </table>
            
            <div class="sc-footer">
              © ${new Date().getFullYear()} 智能课表系统 - 打印时间: ${new Date().toLocaleTimeString()}
            </div>
          </body>
        </html>
      `
      return html
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
  },
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');

/* 整体容器样式 */
.sc-container {
  font-family: 'Poppins', 'Segoe UI', sans-serif;
  max-width: 1400px;
  margin: 50px auto;
  padding: 40px;
  background: linear-gradient(135deg, #f8fafc 0%, #eef2f7 100%);
  border-radius: 30px;
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.1), 0 10px 20px rgba(0, 0, 0, 0.05);
  position: relative;
  overflow: hidden;
  z-index: 1;
}

/* 背景装饰元素 */
.sc-bg-decoration {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  overflow: hidden;
}

.sc-bg-circle {
  position: absolute;
  border-radius: 50%;
  opacity: 0.5;
  filter: blur(60px);
}

.sc-circle-1 {
  top: -100px;
  right: -100px;
  width: 400px;
  height: 400px;
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.3) 0%, rgba(168, 85, 247, 0.2) 100%);
  animation: sc-float 15s ease-in-out infinite alternate;
}

.sc-circle-2 {
  bottom: -150px;
  left: -100px;
  width: 500px;
  height: 500px;
  background: linear-gradient(135deg, rgba(236, 72, 153, 0.2) 0%, rgba(99, 102, 241, 0.1) 100%);
  animation: sc-float 20s ease-in-out infinite alternate-reverse;
}

.sc-circle-3 {
  top: 40%;
  left: 30%;
  width: 300px;
  height: 300px;
  background: linear-gradient(135deg, rgba(14, 165, 233, 0.15) 0%, rgba(79, 70, 229, 0.1) 100%);
  animation: sc-float 18s ease-in-out infinite alternate;
}

.sc-bg-pattern {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: radial-gradient(rgba(99, 102, 241, 0.1) 1px, transparent 1px);
  background-size: 30px 30px;
  opacity: 0.3;
}

@keyframes sc-float {
  0% {
    transform: translate(0, 0) rotate(0deg);
  }
  100% {
    transform: translate(30px, 30px) rotate(10deg);
  }
}

/* 课表头部样式 */
.sc-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
  padding-bottom: 20px;
  border-bottom: 1px solid rgba(225, 232, 237, 0.6);
  position: relative;
}

/* Logo区域样式 */
.sc-logo-area {
  display: flex;
  align-items: center;
  gap: 12px;
}

.sc-logo-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  color: white;
  box-shadow: 0 10px 20px rgba(99, 102, 241, 0.3);
}

.sc-logo-text {
  font-size: 24px;
  font-weight: 700;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-fill-color: transparent;
}

/* 周次显示区域样式 */
.sc-week-display {
  display: flex;
  align-items: center;
  gap: 20px;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}

/* 周次数字容器样式 */
.sc-week-number-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
}

/* 周次标签样式 */
.sc-week-label {
  font-size: 14px;
  color: #64748b;
  font-weight: 500;
}

/* 周次数字样式 */
.sc-week-number {
  font-size: 40px;
  font-weight: 700;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-fill-color: transparent;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  letter-spacing: -0.5px;
}

/* 箭头按钮样式 */
.sc-arrow-btn {
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: white;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  color: #6366f1;
}

/* 箭头按钮悬停样式 */
.sc-arrow-btn:hover {
  background-color: #6366f1;
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(99, 102, 241, 0.3);
  color: white;
}

.sc-arrow-btn:active {
  transform: translateY(0);
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.2);
}

/* 打印按钮样式 */
.sc-print-button button {
  padding: 14px 28px;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  color: white;
  border: none;
  border-radius: 14px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  box-shadow: 0 8px 20px rgba(99, 102, 241, 0.25);
  display: flex;
  align-items: center;
  gap: 10px;
}

/* 打印按钮悬停样式 */
.sc-print-button button:hover {
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
  transform: translateY(-2px);
  box-shadow: 0 12px 24px rgba(99, 102, 241, 0.35);
}

.sc-print-button button:active {
  transform: translateY(0);
  box-shadow: 0 6px 16px rgba(99, 102, 241, 0.25);
}

/* 按钮图标样式 */
.sc-btn-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 课表表格区域样式 */
.sc-table-wrapper {
  position: relative;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  padding: 5px;
}

.sc-table {
  overflow-x: auto;
  border-radius: 15px;
}

/* 表格样式 */
.sc-table table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  table-layout: fixed;
  background-color: white;
  border-radius: 15px;
  overflow: hidden;
}

/* 表格表头和单元格样式 */
.sc-table th,
.sc-table td {
  border: 1px solid rgba(233, 236, 239, 0.8);
  text-align: center;
  padding: 20px;
}

/* 表格表头样式 */
.sc-table th {
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  font-weight: 600;
  color: white;
  letter-spacing: 0.5px;
  border-bottom: none;
  position: relative;
}

/* 日期列样式 */
.sc-day-column {
  transition: all 0.3s ease;
}

.sc-day-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
}

.sc-day-name {
  font-size: 18px;
  font-weight: 600;
}

/* 时间列样式 */
.sc-time-column {
  width: 150px;
  background: linear-gradient(135deg, #818cf8 0%, #6366f1 100%);
}

/* 时间单元格样式 */
.sc-time-cell {
  background: linear-gradient(135deg, #818cf8 0%, #6366f1 100%);
  font-weight: 600;
  color: white;
  border-right: none;
}

.sc-time-display {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
}

.sc-time-text {
  font-size: 16px;
}

.sc-time-index {
  font-size: 14px;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  padding: 2px 8px;
}

/* 课程单元格样式 */
.sc-course-cell {
  height: 110px;
  vertical-align: top;
  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
  position: relative;
  overflow: hidden;
  background-color: white;
}

.sc-course-cell:hover {
  background-color: #f8fafc;
}

/* 有课程的单元格样式 */
.sc-has-course {
  background: linear-gradient(135deg, #e0e7ff 0%, #ddd6fe 100%);
  animation: sc-fadeIn 0.5s ease;
}

.sc-has-course:hover {
  background: linear-gradient(135deg, #c7d2fe 0%, #c4b5fd 100%);
  transform: translateY(-3px) scale(1.02);
  box-shadow: 0 10px 25px rgba(99, 102, 241, 0.2);
  z-index: 2;
}

/* 空单元格样式 */
.sc-empty-cell {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.5;
}

.sc-empty-icon {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px dashed #e2e8f0;
}

/* 课程信息区域样式 */
.sc-course-info {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 15px;
  transition: all 0.3s ease;
  position: relative;
  z-index: 1;
}

.sc-course-info::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  background: linear-gradient(to bottom, #6366f1, #8b5cf6);
  z-index: -1;
}

/* 课程名称样式 */
.sc-course-name {
  font-weight: 600;
  margin-bottom: 12px;
  color: #4f46e5;
  font-size: 16px;
  letter-spacing: 0.3px;
}

/* 教室名称样式 */
.sc-course-room {
  font-size: 14px;
  color: #64748b;
  display: flex;
  align-items: center;
  gap: 5px;
}

/* 日期样式 */
.sc-date {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
  font-weight: normal;
}

/* 打印设置弹窗样式 */
.sc-print-settings {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.sc-backdrop {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(15, 23, 42, 0.7);
  backdrop-filter: blur(8px);
}

.sc-settings-content {
  position: relative;
  background: white;
  padding: 35px;
  border-radius: 24px;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
  width: 550px;
  max-width: 90%;
  z-index: 1001;
  overflow: hidden;
}

/* 模态框装饰 */
.sc-modal-decoration {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  overflow: hidden;
}

.sc-modal-circle {
  position: absolute;
  border-radius: 50%;
  opacity: 0.5;
  filter: blur(40px);
}

.sc-modal-circle-1 {
  top: -100px;
  right: -100px;
  width: 200px;
  height: 200px;
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(168, 85, 247, 0.1) 100%);
}

.sc-modal-circle-2 {
  bottom: -100px;
  left: -100px;
  width: 200px;
  height: 200px;
  background: linear-gradient(135deg, rgba(236, 72, 153, 0.1) 0%, rgba(99, 102, 241, 0.05) 100%);
}

.sc-settings-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.sc-close-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: #94a3b8;
  transition: color 0.3s ease;
  padding: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.sc-close-btn:hover {
  color: #6366f1;
}

.sc-settings-header h3 {
  color: #1e293b;
  margin: 0;
  font-size: 26px;
  font-weight: 700;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-fill-color: transparent;
}

.sc-setting-item {
  margin: 30px 0;
}

.sc-setting-item > label {
  display: block;
  color: #1e293b;
  font-weight: 600;
  margin-bottom: 15px;
  font-size: 18px;
}

.sc-date-range {
  display: flex;
  align-items: center;
  gap: 15px;
}

.sc-date-input-wrapper {
  flex: 1;
  position: relative;
}

.sc-date-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
  pointer-events: none;
}

.sc-date-input {
  width: 100%;
  padding: 14px 14px 14px 40px;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 16px;
  transition: all 0.3s ease;
  color: #1e293b;
  background-color: #f8fafc;
}

.sc-date-input:focus {
  outline: none;
  border-color: #6366f1;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
  background-color: #fff;
}

.sc-date-separator {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #94a3b8;
}

.sc-options {
  display: flex;
  flex-direction: column;
  gap: 20px;
  background-color: #f8fafc;
  padding: 25px;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
}

.sc-checkbox-label {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  padding: 12px;
  border-radius: 12px;
  transition: all 0.3s ease;
  margin: 0;
}

.sc-checkbox-label:hover {
  background: #eef2f7;
  transform: translateX(5px);
}

.sc-checkbox-wrapper {
  position: relative;
  width: 24px;
  height: 24px;
}

.sc-checkbox-wrapper input[type="checkbox"] {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

.sc-checkbox-custom {
  position: absolute;
  top: 0;
  left: 0;
  height: 24px;
  width: 24px;
  background-color: #fff;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.sc-checkbox-wrapper input[type="checkbox"]:checked ~ .sc-checkbox-custom {
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  border-color: #6366f1;
}

.sc-checkbox-custom svg {
  opacity: 0;
  transform: scale(0);
  transition: all 0.2s ease;
}

.sc-checkbox-wrapper input[type="checkbox"]:checked ~ .sc-checkbox-custom svg {
  opacity: 1;
  transform: scale(1);
}

.sc-range-option {
  display: flex;
  flex-direction: column;
  gap: 15px;
  padding: 12px;
  border-radius: 12px;
}

.sc-range-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.sc-range-header span {
  font-weight: 600;
  color: #1e293b;
}

.sc-font-size-value {
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-fill-color: transparent;
  font-weight: 700;
}

.sc-range-slider-wrapper {
  position: relative;
  padding-bottom: 25px;
  margin-top: 10px;
}

.sc-range-slider {
  -webkit-appearance: none;
  width: 100%;
  height: 6px;
  border-radius: 3px;
  background: transparent;
  outline: none;
  transition: background 0.3s ease;
  position: relative;
  z-index: 2;
}

.sc-range-track {
  position: absolute;
  top: 50%;
  left: 0;
  transform: translateY(-50%);
  width: 100%;
  height: 6px;
  background-color: #e2e8f0;
  border-radius: 3px;
  z-index: 1;
}

.sc-range-progress {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background: linear-gradient(to right, #6366f1, #8b5cf6);
  border-radius: 3px;
}

.sc-range-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: white;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(99, 102, 241, 0.4);
  border: 2px solid #6366f1;
  transition: all 0.3s ease;
}

.sc-range-slider::-webkit-slider-thumb:hover {
  background: #6366f1;
  transform: scale(1.1);
}

.sc-range-slider::-moz-range-thumb {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: white;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(99, 102, 241, 0.4);
  border: 2px solid #6366f1;
  transition: all 0.3s ease;
}

.sc-range-slider::-moz-range-thumb:hover {
  background: #6366f1;
  transform: scale(1.1);
}

.sc-range-labels {
  display: flex;
  justify-content: space-between;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  font-size: 14px;
  color: #94a3b8;
}

.sc-buttons {
  margin-top: 35px;
  display: flex;
  justify-content: flex-end;
  gap: 15px;
}

.sc-cancel-btn {
  padding: 14px 25px;
  border-radius: 14px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  background: #f1f5f9;
  color: #64748b;
  border: none;
  font-size: 16px;
}

.sc-cancel-btn:hover {
  background: #e2e8f0;
  transform: translateY(-2px);
}

.sc-confirm-btn {
  padding: 14px 25px;
  border-radius: 14px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  color: white;
  border: none;
  display: flex;
  align-items: center;
  gap: 10px;
  box-shadow: 0 8px 20px rgba(99, 102, 241, 0.25);
  font-size: 16px;
}

.sc-confirm-btn:hover {
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
  transform: translateY(-2px);
  box-shadow: 0 12px 24px rgba(99, 102, 241, 0.35);
}

/* 打印时的样式 */
@media print {
  .sc-header {
    display: none;
  }

  .sc-container {
    padding: 0;
    margin: 0;
    box-shadow: none;
    background: none;
  }

  .sc-bg-decoration {
    display: none;
  }

  @page {
    size: landscape;
    margin: 1cm;
  }
}

/* 淡入动画 */
@keyframes sc-fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 模态框动画 */
.sc-modal-fade-enter-active, .sc-modal-fade-leave-active {
  transition: opacity 0.4s ease, transform 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.sc-modal-fade-enter-from, .sc-modal-fade-leave-to {
  opacity: 0;
  transform: translateY(-30px);
}
</style>