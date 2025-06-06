<template>
  <div class="course-table">
    <!-- 顶部区域 -->
    <div class="header-container">
      <div class="header-content">
        <h1 class="title">课程表</h1>
        <div class="semester-badge" v-if="semester && week">
          {{ semester }} · 第{{ week }}周
        </div>
      </div>
      
      <!-- 功能按钮区 -->
      <div class="actions">
        <button @click="showPrintDialog" class="action-btn print-btn">
          <span class="btn-icon">🖨️</span>
          <span>打印</span>
        </button>
      </div>
    </div>
    
    <!-- 周次导航 -->
    <div class="week-navigation">
      <button 
        @click="changeWeek(currentWeekNum - 1)" 
        class="nav-btn prev-btn"
        :disabled="currentWeekNum <= 1"
        :class="{ 'disabled': currentWeekNum <= 1 }"
      >
        <span class="nav-icon">◀</span>
        <span>上一周</span>
      </button>
      
      <div class="week-indicator">
        <span v-if="semester && week" class="semester-info">
          第{{ week }}周
        </span>
        <span v-else-if="currentWeekNum > 0" class="week-info">
          第{{ currentWeekNum }}周
        </span>
        <span v-else class="current-week">本周</span>
      </div>
      
      <button 
        @click="changeWeek(currentWeekNum + 1)" 
        class="nav-btn next-btn"
      >
        <span>下一周</span>
        <span class="nav-icon">▶</span>
      </button>
      
      <button 
        @click="changeWeek(0)" 
        class="nav-btn today-btn"
      >
        <span>回到本周</span>
      </button>
    </div>
    
    <!-- 加载状态 -->
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <p class="loading-text">加载课程表中...</p>
    </div>
    
    <!-- 错误提示 -->
    <div v-else-if="error" class="error-message">
      <div class="error-icon">!</div>
      <p class="error-text">{{ error }}</p>
      <button @click="loadCourseTable(currentWeekNum)" class="retry-btn">
        重试
      </button>
    </div>
    
    <!-- 课程表网格 -->
    <div v-else-if="courseTable && courseTable.length" class="timetable-container">
      <div class="timetable-grid">
        <!-- 表头 -->
        <div class="grid-header">
          <div class="time-column">时间/日期</div>
          <div 
            v-for="(dayData, index) in courseTable" 
            :key="index" 
            class="day-column"
            :class="{ 'today-column': isToday(dayData.date) }"
          >
            <div class="day-name">星期{{ dayData.day }}</div>
            <div class="date">{{ formatDate(dayData.date) }}</div>
          </div>
        </div>
        
        <!-- 课程内容 -->
        <div class="grid-body">
          <!-- 上午时段标题 -->
          <div class="time-period morning-period">
            <div class="period-label">上午</div>
            <div v-for="_ in 7" :key="'am-'+_" class="period-spacer"></div>
          </div>
          
          <!-- 第一节 -->
          <div class="time-slot">
            <div class="time-label">
              <div class="slot-number">1</div>
              <div class="slot-time">8:00-9:40</div>
            </div>
            <div 
              v-for="(dayData, index) in courseTable" 
              :key="`one-${index}`" 
              class="course-cell"
              :class="{ 'today-cell': isToday(dayData.date) }"
            >
              <div v-if="dayData.one" class="course-content" @click="handleCourseClick(parseCourseInfo(dayData.one, dayData.day, 'one'))">
                <div class="course-name">{{ parseCourseInfo(dayData.one).name }}</div>
                <div class="course-location">{{ parseCourseInfo(dayData.one).location }}</div>
              </div>
            </div>
          </div>
          
          <!-- 第二节 -->
          <div class="time-slot">
            <div class="time-label">
              <div class="slot-number">2</div>
              <div class="slot-time">10:00-11:40</div>
            </div>
            <div 
              v-for="(dayData, index) in courseTable" 
              :key="`two-${index}`" 
              class="course-cell"
              :class="{ 'today-cell': isToday(dayData.date) }"
            >
              <div v-if="dayData.two" class="course-content" @click="handleCourseClick(parseCourseInfo(dayData.two, dayData.day, 'two'))">
                <div class="course-name">{{ parseCourseInfo(dayData.two).name }}</div>
                <div class="course-location">{{ parseCourseInfo(dayData.two).location }}</div>
              </div>
            </div>
          </div>
          
          <!-- 下午时段标题 -->
          <div class="time-period afternoon-period">
            <div class="period-label">下午</div>
            <div v-for="_ in 7" :key="'pm-'+_" class="period-spacer"></div>
          </div>
          
          <!-- 第三节 -->
          <div class="time-slot">
            <div class="time-label">
              <div class="slot-number">3</div>
              <div class="slot-time">14:00-15:40</div>
            </div>
            <div 
              v-for="(dayData, index) in courseTable" 
              :key="`three-${index}`" 
              class="course-cell"
              :class="{ 'today-cell': isToday(dayData.date) }"
            >
              <div v-if="dayData.three" class="course-content" @click="handleCourseClick(parseCourseInfo(dayData.three, dayData.day, 'three'))">
                <div class="course-name">{{ parseCourseInfo(dayData.three).name }}</div>
                <div class="course-location">{{ parseCourseInfo(dayData.three).location }}</div>
              </div>
            </div>
          </div>
          
          <!-- 第四节 -->
          <div class="time-slot">
            <div class="time-label">
              <div class="slot-number">4</div>
              <div class="slot-time">16:00-17:40</div>
            </div>
            <div 
              v-for="(dayData, index) in courseTable" 
              :key="`four-${index}`" 
              class="course-cell"
              :class="{ 'today-cell': isToday(dayData.date) }"
            >
              <div v-if="dayData.four" class="course-content" @click="handleCourseClick(parseCourseInfo(dayData.four, dayData.day, 'four'))">
                <div class="course-name">{{ parseCourseInfo(dayData.four).name }}</div>
                <div class="course-location">{{ parseCourseInfo(dayData.four).location }}</div>
              </div>
            </div>
          </div>
          
          <!-- 晚上时段标题 -->
          <div class="time-period evening-period">
            <div class="period-label">晚上</div>
            <div v-for="_ in 7" :key="'eve-'+_" class="period-spacer"></div>
          </div>
          
          <!-- 第五节 -->
          <div class="time-slot">
            <div class="time-label">
              <div class="slot-number">5</div>
              <div class="slot-time">19:00-20:40</div>
            </div>
            <div 
              v-for="(dayData, index) in courseTable" 
              :key="`five-${index}`" 
              class="course-cell"
              :class="{ 'today-cell': isToday(dayData.date) }"
            >
              <div v-if="dayData.five" class="course-content" @click="handleCourseClick(parseCourseInfo(dayData.five, dayData.day, 'five'))">
                <div class="course-name">{{ parseCourseInfo(dayData.five).name }}</div>
                <div class="course-location">{{ parseCourseInfo(dayData.five).location }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 无数据提示 -->
    <div v-else-if="!loading && !error" class="empty-data">
      <div class="empty-icon">📚</div>
      <p class="empty-text">本周暂无课程安排</p>
      <button @click="loadCourseTable(currentWeekNum)" class="retry-btn">
        刷新
      </button>
    </div>
    
    <!-- 课程详情弹窗 -->
    <div v-if="selectedCourse" class="course-modal" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3 class="modal-title">{{ selectedCourse.course.name }}</h3>
          <button class="modal-close" @click="closeModal">×</button>
        </div>
        <div class="modal-body">
          <div class="modal-info">
            <div class="info-item">
              <div class="info-label">课程名称</div>
              <div class="info-value">{{ selectedCourse.course.location }}</div>
            </div>
            <div class="info-item">
              <div class="info-label">任课教师</div>
              <div class="info-value">{{ selectedCourse.course.teacher }}</div>
            </div>
            <div class="info-item">
              <div class="info-label">上课时间</div>
              <div class="info-value">星期{{ selectedCourse.day }} 第{{ getPeriodNumber(selectedCourse.period) }}节</div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="modal-btn" @click="closeModal">关闭</button>
        </div>
      </div>
    </div>
    
    <!-- 打印设置弹窗 -->
    <div v-if="printDialogVisible" class="print-modal" @click="closePrintDialog">
      <div class="print-modal-content" @click.stop>
        <div class="print-modal-header">
          <h3 class="print-modal-title">打印设置</h3>
          <button class="print-modal-close" @click="closePrintDialog">×</button>
        </div>
        <div class="print-modal-body">
          <div class="print-options">
            <!-- 时间范围选择 -->
            <div class="print-option-group">
              <h4 class="print-option-title">时间范围</h4>
              <div class="date-range-picker">
                <div class="date-picker">
                  <label for="start-date" class="date-label">开始日期</label>
                  <input 
                    type="date" 
                    id="start-date" 
                    class="date-input" 
                    v-model="printOptions.startDate"
                  />
                </div>
                <div class="date-picker">
                  <label for="end-date" class="date-label">结束日期</label>
                  <input 
                    type="date" 
                    id="end-date" 
                    class="date-input" 
                    v-model="printOptions.endDate"
                  />
                </div>
              </div>
            </div>
            
            <!-- 打印选项 -->
            <div class="print-option-group">
              <h4 class="print-option-title">打印选项</h4>
              <div class="print-checkbox-group">
                <div class="print-checkbox">
                  <input 
                    type="checkbox" 
                    id="show-empty" 
                    v-model="printOptions.showEmptyCourses"
                  />
                  <label for="show-empty">显示空白课程</label>
                </div>
                <div class="print-checkbox">
                  <input 
                    type="checkbox" 
                    id="color-print" 
                    v-model="printOptions.colorPrint"
                  />
                  <label for="color-print">彩色打印</label>
                </div>
              </div>
            </div>
            
            <!-- 字体大小 -->
            <div class="print-option-group">
              <h4 class="print-option-title">字体大小</h4>
              <div class="font-size-selector">
                <div 
                  v-for="size in fontSizes" 
                  :key="size.value"
                  class="font-size-option"
                  :class="{ 'selected': printOptions.fontSize === size.value }"
                  @click="printOptions.fontSize = size.value"
                >
                  <span>{{ size.label }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="print-modal-footer">
          <button class="print-cancel-btn" @click="closePrintDialog">取消</button>
          <button class="print-confirm-btn" @click="confirmPrint">确认打印</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { getCourseTable } from '@/api/stu-courseTable'

// 状态变量
const courseTable = ref([]);
const semester = ref(null);
const week = ref(null);
const loading = ref(false);
const error = ref(null);
const currentWeekNum = ref(0); // 0表示本周，其他表示第n周
const courseColors = ref([]);
const selectedCourse = ref(null);
const periods = ['one', 'two', 'three', 'four', 'five'];
const periodMap = {
  'one': '1',
  'two': '2',
  'three': '3',
  'four': '4',
  'five': '5'
};

// 打印对话框状态
const printDialogVisible = ref(false);
const printOptions = ref({
  startDate: formatDateForInput(new Date()),
  endDate: formatDateForInput(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)), // 默认一周后
  showEmptyCourses: false,
  colorPrint: true,
  fontSize: 'medium'
});

// 字体大小选项
const fontSizes = [
  { label: '小', value: 'small' },
  { label: '中', value: 'medium' },
  { label: '大', value: 'large' }
];

// 格式化日期为input[type=date]格式 (YYYY-MM-DD)
function formatDateForInput(date) {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// 获取周期数字
const getPeriodNumber = (period) => {
  return periodMap[period] || period;
};

// 解析课程信息
const parseCourseInfo = (courseInfo, day, period) => {
  if (!courseInfo) return null;
  
  const parts = courseInfo.split(',');
  return {
    name: parts[0] || '未知课程',
    location: parts[1] || '未知地点',
    teacher: parts[2] || '未知教师',
    course: {
      name: parts[0] || '未知课程',
      location: parts[1] || '未知地点',
      teacher: parts[2] || '未知教师'
    },
    day,
    period
  };
};

// 格式化日期
const formatDate = (dateArr) => {
  if (!dateArr || dateArr.length !== 3) return '未知日期';
  const [year, month, day] = dateArr;
  return `${month}月${day}日`;
};

// 判断是否为今天
const isToday = (dateArr) => {
  if (!dateArr || dateArr.length !== 3) return false;
  
  const today = new Date();
  const [year, month, day] = dateArr;
  
  return (
    today.getFullYear() === year &&
    today.getMonth() + 1 === month &&
    today.getDate() === day
  );
};

// 生成课程颜色映射
const generateCourseColors = () => {
  const courseMap = new Map();
  // 更深的蓝紫色调色板
  const colorPalette = [
    '#312e81', '#3730a3', '#4338ca', '#3b0764', 
    '#4c1d95', '#5b21b6', '#4c0519', '#581c87',
    '#4f46e5', '#4338ca', '#3730a3', '#312e81',
    '#5b21b6', '#4c1d95', '#3b0764', '#2e1065'
  ];
  
  courseTable.value.forEach(day => {
    periods.forEach(period => {
      const course = day[period];
      if (course) {
        const courseName = course.split(',')[0];
        if (!courseMap.has(courseName)) {
          const colorIndex = courseMap.size % colorPalette.length;
          courseMap.set(courseName, colorPalette[colorIndex]);
        }
      }
    });
  });
  
  // 转换为数组形式
  const result = [];
  courseMap.forEach((color, name) => {
    result.push({ name, color });
  });
  
  courseColors.value = result;
  
  // 添加CSS变量到文档
  courseMap.forEach((color, name) => {
    document.documentElement.style.setProperty(
      `--course-color-${name.replace(/\s+/g, '-').toLowerCase()}`, 
      color
    );
  });
};

// 处理课程点击事件
const handleCourseClick = (courseData) => {
  selectedCourse.value = courseData;
};

// 关闭课程详情弹窗
const closeModal = () => {
  selectedCourse.value = null;
};

// 显示打印对话框
const showPrintDialog = () => {
  printDialogVisible.value = true;
};

// 关闭打印对话框
const closePrintDialog = () => {
  printDialogVisible.value = false;
};

// 确认打印
const confirmPrint = () => {
  // 应用打印选项
  applyPrintOptions();
  
  // 关闭打印对话框
  closePrintDialog();
  
  // 调用打印功能
  window.print();
  
  // 打印完成后恢复默认样式
  resetPrintStyles();
};

// 应用打印选项
const applyPrintOptions = () => {
  // 创建一个样式元素
  const styleEl = document.createElement('style');
  styleEl.id = 'print-custom-styles';
  
  // 根据选项生成CSS
  let css = `
    @media print {
      /* 基础打印样式 */
      .course-table {
        font-size: ${getFontSizeValue(printOptions.value.fontSize)};
      }
      
      /* 是否显示空白课程 */
      ${!printOptions.value.showEmptyCourses ? '.course-cell:empty { display: none; }' : ''}
      
      /* 是否彩色打印 */
      ${!printOptions.value.colorPrint ? `
        .course-content {
          background: #f3f4f6 !important;
          color: #000 !important;
          border: 1px solid #d1d5db !important;
        }
      ` : ''}
    }
  `;
  
  styleEl.textContent = css;
  document.head.appendChild(styleEl);
};

// 重置打印样式
const resetPrintStyles = () => {
  const styleEl = document.getElementById('print-custom-styles');
  if (styleEl) {
    styleEl.remove();
  }
};

// 获取字体大小值
const getFontSizeValue = (size) => {
  switch (size) {
    case 'small': return '0.875rem';
    case 'large': return '1.125rem';
    case 'medium':
    default: return '1rem';
  }
};

// 加载课程表数据
const loadCourseTable = async (whichWeek) => {
  loading.value = true;
  error.value = null;
  
  try {
    const semesterValue = semester.value;
    const data = await getCourseTable(whichWeek, semesterValue);
    
    semester.value = data.semester;
    week.value = data.week;
    courseTable.value = data.courseTable;
    
    // 如果是查询本周，记录当前周数
    if (whichWeek === 0 && data.week) {
      currentWeekNum.value = parseInt(data.week);
    } else if (whichWeek > 0) {
      currentWeekNum.value = whichWeek;
    }
    
    // 生成课程颜色
    generateCourseColors();
    
  } catch (err) {
    console.error('获取课程表失败:', err);
    error.value = '获取课程表失败: ' + (err.message || '网络错误');
  } finally {
    loading.value = false;
  }
};

// 切换周次
const changeWeek = (newWeek) => {
  if (newWeek < 0) newWeek = 0;
  currentWeekNum.value = newWeek;
  loadCourseTable(newWeek);
};

// 打印课程表
const printTimetable = () => {
  window.print();
};

// 监听键盘事件，支持键盘导航
const handleKeyDown = (e) => {
  if (e.key === 'ArrowLeft') {
    if (currentWeekNum.value > 1) {
      changeWeek(currentWeekNum.value - 1);
    }
  } else if (e.key === 'ArrowRight') {
    changeWeek(currentWeekNum.value + 1);
  } else if (e.key === 'Home') {
    changeWeek(0);
  } else if (e.key === 'Escape') {
    if (selectedCourse.value) {
      closeModal();
    } else if (printDialogVisible.value) {
      closePrintDialog();
    }
  }
};

// 组件挂载时加载本周课表
onMounted(() => {
  loadCourseTable(0);
  window.addEventListener('keydown', handleKeyDown);
});

// 组件卸载时移除事件监听
onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown);
});
</script>

<style scoped>
.course-table {
  --primary: #1d2795;
  --primary-light: #4828d9;
  --primary-dark: #082caf;
  --secondary: #312e81;
  --secondary-light: #4338ca;
  --secondary-dark: #2316d8;
  --accent: #8b90fa;
  --background: #f8fafc;
  --foreground: #3a5887;
  --muted: #94a3b8;
  --muted-foreground: #64748b;
  --border: #e2e8f0;
  --input: #f1f5f9;
  --ring: #2b21b6;
  --radius: 0.5rem;

  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  background-color: var(--background);
  color: var(--foreground);
  border-radius: var(--radius);
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

/* 顶部区域样式 */
.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.title {
  font-size: 2.25rem;
  font-weight: 800;
  color: var(--primary-dark);
  margin: 0;
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  letter-spacing: -0.025em;
}

.semester-badge {
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  color: white;
  padding: 0.375rem 1rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 600;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.actions {
  display: flex;
  gap: 0.75rem;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: white;
  border: 1px solid var(--border);
  color: var(--foreground);
  padding: 0.625rem 1.25rem;
  border-radius: var(--radius);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.action-btn:hover {
  background-color: var(--input);
  border-color: var(--muted);
  transform: translateY(-1px);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.print-btn .btn-icon {
  font-size: 1rem;
}

/* 周次导航样式 */
.week-navigation {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 2rem;
  background: linear-gradient(to right, rgba(76, 29, 149, 0.05), rgba(49, 46, 129, 0.05));
  padding: 1rem;
  border-radius: var(--radius);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  flex-wrap: wrap;
  position: relative;
  overflow: hidden;
}

.week-navigation::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 3px;
  background: linear-gradient(to right, var(--primary), var(--secondary));
}

.nav-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: white;
  border: 1px solid var(--border);
  color: var(--foreground);
  padding: 0.625rem 1.25rem;
  border-radius: var(--radius);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}


.nav-btn:hover:not(.disabled) {
  background-color: var(--input); 
  border-color: var(--muted); 
  transform: translateY(-1px); 
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); 
}

.nav-btn.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.prev-btn, .next-btn {
  min-width: 110px;
  justify-content: center;
}

.today-btn {
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  color: white;
  border: none;
  box-shadow: 0 2px 4px rgba(76, 29, 149, 0.3);
}

.today-btn:hover {
  background: linear-gradient(135deg, var(--primary-dark), var(--secondary-dark));
  transform: translateY(-1px);
  box-shadow: 0 4px 6px rgba(76, 29, 149, 0.4);
}

.week-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 120px;
  padding: 0.625rem 1.25rem;
  background-color: white;
  border-radius: var(--radius);
  font-weight: 600;
  color: var(--primary-dark);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(76, 29, 149, 0.2);
}

/* 加载状态样式 */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 0;
  gap: 1.5rem;
}

.loading-spinner {
  width: 48px;
  height: 48px;
  border: 4px solid var(--accent);
  border-top-color: var(--primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.loading-text {
  color: var(--muted-foreground);
  font-size: 1rem;
  font-weight: 500;
}

/* 错误提示样式 */
.error-message {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 0;
  gap: 1.5rem;
}

.error-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  background-color: #fee2e2;
  color: #dc2626;
  border-radius: 50%;
  font-size: 1.75rem;
  font-weight: bold;
  box-shadow: 0 4px 6px rgba(220, 38, 38, 0.2);
}

.error-text {
  color: #dc2626;
  text-align: center;
  max-width: 400px;
  font-weight: 500;
}

.retry-btn {
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  color: white;
  border: none;
  padding: 0.625rem 1.5rem;
  border-radius: var(--radius);
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(76, 29, 149, 0.3);
}

.retry-btn:hover {
  background: linear-gradient(135deg, var(--primary-dark), var(--secondary-dark));
  transform: translateY(-1px);
  box-shadow: 0 4px 6px rgba(76, 29, 149, 0.4);
}

/* 课程表网格样式 */
.timetable-container {
  background-color: white;
  border-radius: var(--radius);
  overflow: hidden;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.timetable-grid {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.grid-header {
  display: grid;
  grid-template-columns: 100px repeat(7, 1fr);
  background: linear-gradient(135deg, var(--primary-dark), var(--secondary-dark));
  color: white;
}

.time-column, .day-column {
  padding: 1rem;
  text-align: center;
  border-right: 1px solid rgba(255, 255, 255, 0.2);
}

.day-column {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.day-name {
  font-weight: 600;
  font-size: 1rem;
}

.date {
  font-size: 0.75rem;
  opacity: 0.9;
}

.today-column {
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  position: relative;
  overflow: hidden;
}

.today-column::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.1);
  transform: skewX(-15deg) translateX(-10px);
}

.grid-body {
  display: flex;
  flex-direction: column;
}

.time-period {
  display: grid;
  grid-template-columns: 100px repeat(7, 1fr);
  background: linear-gradient(to right, rgba(76, 29, 149, 0.1), rgba(49, 46, 129, 0.1));
  color: var(--primary-dark);
}

.period-label {
  padding: 0.625rem;
  text-align: center;
  font-weight: 600;
  font-size: 0.875rem;
}

.period-spacer {
  border-right: 1px solid rgba(0, 0, 0, 0.05);
}

.time-slot {
  display: grid;
  grid-template-columns: 100px repeat(7, 1fr);
  border-bottom: 1px solid var(--border);
}

.time-label {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 0.5rem;
  background-color: var(--input);
  border-right: 1px solid var(--border);
}

.slot-number {
  font-weight: 700;
  color: var(--primary-dark);
  font-size: 1.125rem;
}

.slot-time {
  font-size: 0.75rem;
  color: var(--muted-foreground);
  margin-top: 0.25rem;
}

.course-cell {
  padding: 0.5rem;
  min-height: 90px;
  border-right: 1px solid var(--border);
  transition: background-color 0.2s ease;
}

.course-cell:hover {
  background-color: var(--input);
}

.today-cell {
  background-color: rgba(76, 29, 149, 0.05);
  position: relative;
}

.today-cell::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 3px;
  height: 100%;
  background: linear-gradient(to bottom, var(--primary), var(--secondary));
}

.course-content {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0.75rem;
  border-radius: 0.375rem;
  background: var(--primary-dark);
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
}

.course-content::after {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  width: 30%;
  height: 100%;
  background: linear-gradient(to left, rgba(255, 255, 255, 0.1), transparent);
  transform: skewX(-15deg);
}

.course-content:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.course-name {
  font-weight: 600;
  margin-bottom: 0.375rem;
  font-size: 0.875rem;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.course-location {
  font-size: 0.75rem;
  opacity: 0.9;
}

/* 无数据提示样式 */
.empty-data {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 0;
  gap: 1.5rem;
}

.empty-icon {
  font-size: 3.5rem;
  color: var(--primary-light);
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.empty-text {
  color: var(--muted-foreground);
  text-align: center;
  font-size: 1.125rem;
  font-weight: 500;
}

/* 课程详情弹窗样式 */
.course-modal {
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
  border-radius: var(--radius);
  width: 90%;
  max-width: 500px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  overflow: hidden;
  animation: modal-in 0.3s ease-out;
}

@keyframes modal-in {
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
  padding: 1.25rem 1.5rem;
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  color: white;
  position: relative;
  overflow: hidden;
}

.modal-header::after {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  width: 30%;
  height: 100%;
  background: linear-gradient(to left, rgba(255, 255, 255, 0.1), transparent);
  transform: skewX(-15deg);
}

.modal-title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.modal-close {
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  line-height: 1;
  opacity: 0.8;
  transition: opacity 0.2s ease;
  z-index: 1;
}

.modal-close:hover {
  opacity: 1;
}

.modal-body {
  padding: 1.5rem;
}

.modal-info {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.info-label {
  font-size: 0.875rem;
  color: var(--muted-foreground);
  font-weight: 500;
}

.info-value {
  font-weight: 600;
  color: var(--foreground);
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  padding: 1.25rem 1.5rem;
  background-color: var(--input);
  border-top: 1px solid var(--border);
}

.modal-btn {
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  color: white;
  border: none;
  padding: 0.625rem 1.5rem;
  border-radius: var(--radius);
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(76, 29, 149, 0.3);
}

.modal-btn:hover {
  background: linear-gradient(135deg, var(--primary-dark), var(--secondary-dark));
  transform: translateY(-1px);
  box-shadow: 0 4px 6px rgba(76, 29, 149, 0.4);
}

/* 打印设置弹窗样式 */
.print-modal {
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

.print-modal-content {
  background-color: white;
  border-radius: var(--radius);
  width: 90%;
  max-width: 550px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  overflow: hidden;
  animation: modal-in 0.3s ease-out;
}

.print-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 1.5rem;
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  color: white;
  position: relative;
  overflow: hidden;
}

.print-modal-header::after {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  width: 30%;
  height: 100%;
  background: linear-gradient(to left, rgba(255, 255, 255, 0.1), transparent);
  transform: skewX(-15deg);
}

.print-modal-title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.print-modal-close {
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  line-height: 1;
  opacity: 0.8;
  transition: opacity 0.2s ease;
  z-index: 1;
}

.print-modal-close:hover {
  opacity: 1;
}

.print-modal-body {
  padding: 1.5rem;
}

.print-options {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.print-option-group {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.print-option-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--foreground);
  margin: 0;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--border);
}

.date-range-picker {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.date-picker {
  flex: 1;
  min-width: 200px;
}

.date-label {
  display: block;
  font-size: 0.875rem;
  color: var(--muted-foreground);
  margin-bottom: 0.5rem;
}

.date-input {
  width: 100%;
  padding: 0.625rem;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  background-color: white;
  color: var(--foreground);
  font-size: 0.875rem;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.date-input:focus {
  outline: none;
  border-color: var(--ring);
  box-shadow: 0 0 0 2px rgba(76, 29, 149, 0.1);
}

.print-checkbox-group {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.print-checkbox {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.print-checkbox input[type="checkbox"] {
  width: 1rem;
  height: 1rem;
  border-radius: 0.25rem;
  border: 1px solid var(--border);
  background-color: white;
  cursor: pointer;
  appearance: none;
  -webkit-appearance: none;
  position: relative;
  transition: background-color 0.2s ease, border-color 0.2s ease;
}

.print-checkbox input[type="checkbox"]:checked {
  background-color: var(--primary);
  border-color: var(--primary);
}

.print-checkbox input[type="checkbox"]:checked::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 0.5rem;
  height: 0.5rem;
  background-color: white;
  border-radius: 0.125rem;
}

.print-checkbox label {
  font-size: 0.875rem;
  color: var(--foreground);
  cursor: pointer;
}

.font-size-selector {
  display: flex;
  gap: 0.5rem;
}

.font-size-option {
  flex: 1;
  padding: 0.625rem;
  text-align: center;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  background-color: white;
  color: var(--foreground);
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.font-size-option:hover {
  background-color: var(--input);
  border-color: var(--muted);
}

.font-size-option.selected {
  background-color: var(--primary);
  border-color: var(--primary);
  color: white;
  font-weight: 500;
}

.print-modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding: 1.25rem 1.5rem;
  background-color: var(--input);
  border-top: 1px solid var(--border);
}

.print-cancel-btn {
  padding: 0.625rem 1.5rem;
  border-radius: var(--radius);
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  background-color: white;
  border: 1px solid var(--border);
  color: var(--foreground);
}

.print-cancel-btn:hover {
  background-color: var(--input);
  border-color: var(--muted);
}

.print-confirm-btn {
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  color: white;
  border: none;
  padding: 0.625rem 1.5rem;
  border-radius: var(--radius);
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(76, 29, 149, 0.3);
}

.print-confirm-btn:hover {
  background: linear-gradient(135deg, var(--primary-dark), var(--secondary-dark));
  transform: translateY(-1px);
  box-shadow: 0 4px 6px rgba(76, 29, 149, 0.4);
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .grid-header, .time-period, .time-slot {
    grid-template-columns: 80px repeat(7, 1fr);
  }
  
  .time-column, .time-label {
    width: 80px;
  }
  
  .course-table {
    padding: 1.5rem;
  }
}

@media (max-width: 768px) {
  .course-table {
    padding: 1rem;
  }
  
  .header-container {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .actions {
    width: 100%;
    justify-content: flex-end;
  }
  
  .week-navigation {
    flex-wrap: wrap;
    justify-content: center;
    gap: 0.5rem;
  }
  
  .course-name {
    font-size: 0.75rem;
  }
  
  .course-location {
    font-size: 0.7rem;
  }
  
  .date-range-picker {
    flex-direction: column;
    gap: 0.75rem;
  }
}

@media (max-width: 640px) {
  .grid-header, .time-period, .time-slot {
    grid-template-columns: 50px repeat(7, 1fr);
  }
  
  .time-column, .time-label {
    width: 50px;
    padding: 0.25rem;
  }
  
  .day-column {
    padding: 0.5rem 0.25rem;
  }
  
  .day-name {
    font-size: 0.75rem;
  }
  
  .date {
    font-size: 0.7rem;
  }
  
  .course-cell {
    padding: 0.25rem;
    min-height: 70px;
  }
  
  .course-content {
    padding: 0.375rem;
  }
  
  .title {
    font-size: 1.5rem;
  }
}

/* 打印样式 */
@media print {
  .course-table {
    box-shadow: none;
    padding: 0;
  }
  
  .header-container, .week-navigation, .actions, .print-modal {
    display: none;
  }
  
  .timetable-container {
    box-shadow: none;
  }
  
  .course-content {
    break-inside: avoid;
  }
  
  .grid-header {
    background-color: #f3f4f6 !important;
    color: black !important;
  }
  
  .time-period {
    background-color: #f9fafb !important;
    color: black !important;
  }
}
</style>