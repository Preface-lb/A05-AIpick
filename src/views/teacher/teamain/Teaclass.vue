为了美化打印设置弹窗，使其更具高级感，我们可以从以下几个方面进行改进：

1. 更新弹窗样式：采用更现代的颜色和布局，添加阴影和圆角效果。
2. 优化按钮样式：使用更鲜明的颜色和过渡效果，增强交互性。
3. 改进输入框样式：使其更清晰易读。

以下是美化后的完整代码：

```vue
<template>
  <div class="schedule-container">
    <!-- 课表头部 -->
    <div class="schedule-header">
      <!-- 周次显示区域 -->
      <div class="week-display">
        <!-- 上一周按钮 -->
        <button class="arrow-btn" @click="changeWeek(-1)">
          <i class="arrow left"></i>
        </button>
        <!-- 显示当前周次 -->
        <span class="week-number">第{{ currentWeek }}周</span>
        <!-- 下一周按钮 -->
        <button class="arrow-btn" @click="changeWeek(1)">
          <i class="arrow right"></i>
        </button>
      </div>
      <!-- 打印按钮区域 -->
      <div class="print-button">
        <button @click="showPrintSettingsDialog">
          <i class="print-icon"></i> 打印课表
        </button>
      </div>
    </div>
    <!-- 课表表格区域 -->
    <div class="schedule-table">
      <table>
        <thead>
          <tr>
            <!-- 时间列标题 -->
            <th class="time-column">时间</th>
            <!-- 循环显示星期几和对应的日期 -->
            <th v-for="(day, index) in days" :key="index">
              {{ day }}<br />
              <span class="date">{{ getDayDate(day, index) }}</span>
            </th>
          </tr>
        </thead>
        <tbody>
          <!-- 循环显示每个时间段 -->
          <tr v-for="(timeSlot, index) in timeSlots" :key="index">
            <!-- 显示时间段 -->
            <td class="time-cell">{{ timeSlot }}</td>
            <!-- 循环显示每一天的课程格子 -->
            <td
              v-for="day in daysValue"
              :key="`${day}-${index}`"
              class="course-cell"
              :class="{ 'has-course': hasCourse(day, index) }"
            >
              <!-- 如果该时间段有课程，显示课程信息 -->
              <div v-if="hasCourse(day, index)" class="course-info">
                <div class="course-name">{{ getCourse(day, index).name }}</div>
                <div class="course-room">{{ getCourse(day, index).room }}</div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 打印设置弹窗 -->
    <div v-if="showPrintSettings" class="print-settings">
      <div class="print-settings-content">
        <h3>打印设置</h3>
        <div class="setting-item">
          <label>选取时间范围</label>
          <div class="date-range">
            <input type="date" v-model="dateRange.start" />
            <span>至</span>
            <input type="date" v-model="dateRange.end" />
          </div>
        </div>
        <div class="setting-item">
          <label>打印选项</label>
          <div class="options">
            <label>
              <input type="checkbox" v-model="printOptions.showBlankCourses" />
              显示空白课程
            </label>
            <label>
              <input type="checkbox" v-model="printOptions.colorPrint" />
              彩色打印
            </label>
            <label>
              <span>字体大小：</span>
              <input
                type="range"
                v-model="printOptions.fontSize"
                min="10"
                max="20"
              />
            </label>
          </div>
        </div>
        <div class="buttons">
          <button @click="closePrintSettings">取消</button>
          <button @click="confirmPrint">确认</button>
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
          name: '课程1',
          room: '教室1',
          day: 1,
          timeSlot: 1,
          week: 1,
        },
        {
          name: '课程1',
          room: '教室1',
          day: 1,
          timeSlot: 4,
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
              body {
                font-family: Arial, sans-serif;
                font-size: ${this.printOptions.fontSize}px;
              }
              table {
                width: 100%;
                border-collapse: collapse;
              }
              th, td {
                border: 1px solid #ddd;
                text-align: center;
                padding: 8px;
              }
              th {
                background-color: #f2f2f2;
              }
              .has-course {
                background-color: #e1f5fe;
              }
            </style>
          </head>
          <body>
            <h1>课表 - 第${this.currentWeek}周</h1>
            <table>
              <thead>
                <tr>
                  <th>时间</th>
                  ${this.days
                    .map(
                      (day, index) =>
                        `<th>${day}<br><span class="date">${this.getDayDate(
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
                      <td>${timeSlot}</td>
                      ${this.daysValue
                        .map(
                          (day) => `
                          <td class="course-cell" ${
                            this.hasCourse(day, index)
                              ? 'class="has-course"'
                              : ''
                          }>
                            ${
                              this.hasCourse(day, index) &&
                              (this.printOptions.showBlankCourses
                                ? `<div class="course-info">
                                    <div class="course-name">${
                                      this.getCourse(day, index).name
                                    }</div>
                                    <div class="course-room">${
                                      this.getCourse(day, index).room
                                    }</div>
                                  </div>`
                                : '')
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

<style>
/* 整体容器样式 */
.schedule-container {
  font-family: 'Open Sans', sans-serif;
  max-width: 1400px;
  margin: 50px auto;
  padding: 40px;
  background: linear-gradient(135deg, #f4f7fa 0%, #e9eff5 100%);
  border-radius: 20px;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
  position: relative;
  overflow: hidden;
}

/* 课表头部样式 */
.schedule-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
  padding-bottom: 20px;
  border-bottom: 1px solid #d3d9e0;
}

/* 周次显示区域样式 */
.week-display {
  display: flex;
  align-items: center;
  gap: 20px;
  font-size: 20px;
}

/* 周次数字样式 */
.week-number {
  font-size: 28px;
  font-weight: bold;
  color: #2c3e50;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* 箭头按钮样式 */
.arrow-btn {
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: #e0e7ee;
  transition: all 0.3s ease;
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
}

/* 箭头按钮悬停样式 */
.arrow-btn:hover {
  background-color: #c8d2dc;
  transform: scale(1.05);
}

/* 箭头样式 */
.arrow {
  border: solid #667a90;
  border-width: 0 3px 3px 0;
  display: inline-block;
  padding: 6px;
}

/* 向右箭头样式 */
.right {
  transform: rotate(-45deg);
}

/* 向左箭头样式 */
.left {
  transform: rotate(135deg);
}

/* 打印按钮样式 */
.print-button button {
  padding: 12px 25px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 18px;
  transition: all 0.3s ease;
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 10px;
}

/* 打印按钮悬停样式 */
.print-button button:hover {
  background-color: #2980b9;
  transform: translateY(-2px);
}

/* 打印图标样式 */
.print-icon {
  width: 20px;
  height: 20px;
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="white" d="M19 8H5c-1.66 0-3 1.34-3 3v6h4v4h12v-4h4v-6c0-1.66-1.34-3-3-3zm-3 11H8v-5h8v5zm3-7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm-1-9H6v4h12V3z"/></svg>');
  background-size: cover;
}

/* 课表表格区域样式 */
.schedule-table {
  overflow-x: auto;
}

/* 表格样式 */
table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
  background-color: white;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

/* 表格表头和单元格样式 */
th,
td {
  border: 1px solid #e0e7ee;
  text-align: center;
  padding: 20px;
}

/* 表格表头样式 */
th {
  background-color: #f0f4f8;
  font-weight: bold;
  color: #2c3e50;
}

/* 时间列样式 */
.time-column {
  width: 150px;
}

/* 时间单元格样式 */
.time-cell {
  background-color: #f0f4f8;
  font-weight: bold;
  border-right: 2px solid #e0e7ee;
  color: #2c3e50;
}

/* 课程单元格样式 */
.course-cell {
  height: 90px;
  vertical-align: top;
  transition: all 0.3s ease;
}

/* 有课程的单元格样式 */
.has-course {
  background-color: #e1f5fe;
  animation: fadeIn 0.5s ease;
  box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.05);
}

/* 课程信息区域样式 */
.course-info {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 5px;
}

/* 课程名称样式 */
.course-name {
  font-weight: bold;
  margin-bottom: 8px;
  color: #2c3e50;
}

/* 教室名称样式 */
.course-room {
  font-size: 16px;
  color: #667a90;
}

/* 日期样式 */
.date {
  font-size: 16px;
  color: #667a90;
}

/* 打印时的样式 */
@media print {
  .schedule-header {
    display: none;
  }

  .schedule-container {
    padding: 0;
  }

  @page {
    size: landscape;
  }
}

/* 淡入动画 */
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

/* 打印设置弹窗样式 */
.print-settings {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.print-settings-content {
  background: #ffffff;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  width: 500px;
  transform: translateY(-20px);
  animation: modalSlideIn 0.3s ease forwards;
}

h3 {
  color: #2c3e50;
  margin-bottom: 25px;
  font-size: 24px;
  border-bottom: 2px solid #3498db;
  padding-bottom: 10px;
}

.setting-item {
  margin: 20px 0;
}

label {
  display: block;
  color: #667a90;
  font-weight: 600;
  margin-bottom: 12px;
  font-size: 16px;
}

.date-range {
  display: flex;
  align-items: center;
  gap: 15px;
}

input[type='date'] {
  flex: 1;
  padding: 12px;
  border: 2px solid #e0e7ee;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.3s ease;
}

input[type='date']:focus {
  outline: none;
  border-color: #3498db;
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
}

.options {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.options label {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  padding: 10px;
  border-radius: 8px;
  transition: background 0.3s ease;
}

.options label:hover {
  background: #f8f9fb;
}

input[type='checkbox'] {
  width: 18px;
  height: 18px;
  accent-color: #3498db;
}

input[type='range'] {
  width: 120px;
  margin-left: 10px;
}

.buttons {
  margin-top: 30px;
  display: flex;
  justify-content: flex-end;
  gap: 15px;
}

.buttons button {
  padding: 12px 25px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
}

.buttons button:first-child {
  background: #e0e7ee;
  color: #667a90;
  border: none;
}

.buttons button:last-child {
  background: #3498db;
  color: white;
  border: none;
}

.buttons button:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

@keyframes modalSlideIn {
  from {
    transform: translateY(-20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
</style>