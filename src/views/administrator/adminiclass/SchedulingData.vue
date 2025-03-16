<template>
  <div class="classroom-container">
    <!-- Dashboard Header -->
    <div class="dashboard-header">
      <div class="header-title">
        <h1>教室管理系统</h1>
        <p class="subtitle">实时监控教室使用情况和排课信息</p>
      </div>
      <div class="header-stats">
        <div class="stat-card">
          <div class="stat-icon">
            <el-icon><School/></el-icon>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ totalClassrooms }}</div>
            <div class="stat-label">总教室数</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon active-icon">
            <el-icon><VideoPlay/></el-icon>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ activeClassrooms }}</div>
            <div class="stat-label">使用中</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon free-icon">
            <el-icon><Finished /></el-icon>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ freeClassrooms }}</div>
            <div class="stat-label">空闲中</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 搜索和筛选区域 -->
    <div class="control-panel">
      <div class="search-filter">
        <el-input
          v-model="searchKeyword"
          placeholder="搜索教室名称、授课老师"
          class="search-input"
          clearable
        >
          <template #prefix>
            <el-icon class="search-icon"><Search /></el-icon>
          </template>
        </el-input>
        <el-select v-model="filterStatus" placeholder="全部状态" class="status-select">
          <el-option label="全部状态" value="" />
          <el-option label="使用中" value="使用中" />
          <el-option label="空闲" value="空闲" />
        </el-select>
        <el-select v-model="filterCapacity" placeholder="容量筛选" class="capacity-select">
          <el-option label="全部容量" value="" />
          <el-option label="小型 (<50人)" value="small" />
          <el-option label="中型 (50-100人)" value="medium" />
          <el-option label="大型 (>100人)" value="large" />
        </el-select>
      </div>
      <div class="action-buttons">
        <el-button type="primary" @click="refreshData">
          <el-icon><Refresh /></el-icon>刷新数据
        </el-button>
        <el-button @click="exportData">
          <el-icon><Download /></el-icon>导出数据
        </el-button>
      </div>
    </div>

    <!-- 教室列表表格 -->
    <el-card class="table-card" shadow="hover">
      <template #header>
        <div class="card-header">
          <span>教室列表</span>
          <span class="result-count">共 {{ filteredClassrooms.length }} 条结果</span>
        </div>
      </template>
      <el-table
        :data="filteredClassrooms"
        style="width: 100%"
        border
        stripe
        highlight-current-row
        class="classroom-table"
        v-loading="tableLoading"
      >
        <el-table-column prop="name" label="教室名称" min-width="120">
          <template #default="scope">
            <div class="classroom-name">
              <el-icon><OfficeBuilding /></el-icon>
              <span>{{ scope.row.name }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="capacity" label="容量" min-width="100">
          <template #default="scope">
            <el-tag 
              :type="getCapacityTagType(scope.row.capacity)" 
              size="small" 
              effect="light"
            >
              {{ scope.row.capacity }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="当前状态" min-width="120">
          <template #default="scope">
            <div class="status-indicator">
              <span
                :class="['status-dot', scope.row.status === '使用中' ? 'active' : 'inactive']"
              ></span>
              <span :class="['status-text', scope.row.status === '使用中' ? 'text-active' : 'text-inactive']">
                {{ scope.row.status }}
              </span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="teacher" label="授课老师" min-width="120">
          <template #default="scope">
            <div class="teacher-info" v-if="scope.row.teacher">
              <el-avatar :size="24" class="teacher-avatar">
                {{ getTeacherInitials(scope.row.teacher) }}
              </el-avatar>
              <span>{{ scope.row.teacher }}</span>
            </div>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column prop="course" label="当前课程" min-width="150" />
        <el-table-column prop="lastUpdated" label="最后更新" min-width="150" />
        <el-table-column prop="lastUpdated" label="操作" min-width="150" >
          <template #default="scope">
            <div class="action-column">
              <el-tooltip content="查看排课详情" placement="top" :show-after="300">
                <el-button
                  type="primary"
                  size="small"
                  circle
                  @click="showScheduleDetails(scope.row)"
                >
                  <el-icon><Calendar /></el-icon>
                </el-button>
              </el-tooltip>
              <el-tooltip content="查看设备信息" placement="top" :show-after="300">
                <el-button
                  type="info"
                  size="small"
                  circle
                >
                  <el-icon><Monitor /></el-icon>
                </el-button>
              </el-tooltip>
              <el-tooltip content="编辑信息" placement="top" :show-after="300">
                <el-button
                  type="warning"
                  size="small"
                  circle
                >
                  <el-icon><Edit /></el-icon>
                </el-button>
              </el-tooltip>
            </div>
          </template>
        </el-table-column>
      </el-table>
      
      <div class="table-pagination">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 30, 50]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="filteredClassrooms.length"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <!-- 排课详情弹窗 -->
    <el-dialog
      v-model="scheduleDialogVisible"
      title="排课详情"
      width="80%"
      class="schedule-dialog"
      destroy-on-close
    >
      <div class="schedule-info-header">
        <div class="classroom-detail">
          <h2>{{ selectedClassroom?.name }}</h2>
          <div class="classroom-meta">
            <el-tag size="small">容量: {{ selectedClassroom?.capacity }}</el-tag>
            <el-tag 
              :type="selectedClassroom?.status === '使用中' ? 'danger' : 'success'" 
              size="small"
              effect="dark"
            >
              {{ selectedClassroom?.status }}
            </el-tag>
          </div>
        </div>
        <div class="date-navigation">
          <el-button-group>
            <el-button @click="prevDate" :icon="ArrowLeft">上一天</el-button>
            <el-button type="primary" @click="selectDateDialog = true">
              {{ currentDate }}
              <el-icon class="el-icon--right"><Calendar /></el-icon>
            </el-button>
            <el-button @click="nextDate" :icon="ArrowRight">下一天</el-button>
          </el-button-group>
          <el-radio-group v-model="viewType" size="small" class="view-type-toggle">
            <el-radio-button label="day">日视图</el-radio-button>
            <el-radio-button label="week">周视图</el-radio-button>
          </el-radio-group>
        </div>
      </div>

      <div class="schedule-timeline">
        <div class="timeline-header">
          <div class="time-label">时间</div>
          <div class="timeline-hours">
            <div v-for="hour in 12" :key="hour" class="hour-marker">
              {{ hour + 7 }}:00
            </div>
          </div>
        </div>
        
        <div class="timeline-content">
          <div class="timeline-slots">
            <div 
              v-for="(detail, index) in scheduleDetails" 
              :key="index"
              class="time-slot-row"
            >
              <div class="time-label">{{ detail.time }}</div>
              <div 
                class="time-slot-content"
                :class="{
                  'slot-active': detail.status === '正在使用',
                  'slot-free': detail.status === '空闲中',
                  'slot-reserved': detail.status === '预排课'
                }"
              >
                <div v-if="detail.status !== '空闲中'" class="slot-details">
                  <div class="slot-title">
                    <span class="slot-status">{{ detail.status }}</span>
                    <span v-if="detail.course" class="slot-course">{{ detail.course }}</span>
                  </div>
                  <div class="slot-info">
                    <span v-if="detail.user" class="slot-user">{{ detail.user }}</span>
                    <span v-if="detail.teacher" class="slot-teacher">{{ detail.teacher }}</span>
                  </div>
                </div>
                <div v-else class="slot-free-label">空闲</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="scheduleDialogVisible = false">关闭</el-button>
          <el-button type="primary" @click="printSchedule">打印课表</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 日期选择弹窗 -->
    <el-dialog
      v-model="selectDateDialog"
      title="选择日期"
      width="400px"
      append-to-body
      class="date-select-dialog"
      align-center
    >
      <div class="date-picker-container">
        <el-calendar v-model="calendarValue" @click="handleCalendarDateClick" />
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="selectDateDialog = false">取消</el-button>
          <el-button type="primary" @click="confirmDateSelection">确定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { 
  Search, 
  Calendar, 
  ArrowLeft, 
  ArrowRight, 
  Refresh, 
  Download, 
  Edit, 
  Monitor, 
  OfficeBuilding,
  School,
  VideoPlay,
  Finished
} from '@element-plus/icons-vue';

export default {
  name: 'ClassroomManagement',
  components: {
    Search,
    Calendar,
    ArrowLeft,
    ArrowRight
  },
  setup() {
    // 搜索关键词
    const searchKeyword = ref('');
    // 状态筛选
    const filterStatus = ref('');
    // 容量筛选
    const filterCapacity = ref('');
    // 表格加载状态
    const tableLoading = ref(false);
    // 分页
    const currentPage = ref(1);
    const pageSize = ref(10);
    // 视图类型
    const viewType = ref('day');
    // 日历值
    const calendarValue = ref(new Date());
    
    // 教室列表数据 - 增加到10条模拟数据
    const classrooms = ref([
      {
        id: 1,
        name: '东教学楼-301',
        capacity: '100人',
        status: '使用中',
        teacher: '张教授',
        course: '高等数学',
        lastUpdated: '2025-03-07 08:30:22',
        equipment: ['投影仪', '电脑', '音响系统']
      },
      {
        id: 2,
        name: '东教学楼-302',
        capacity: '80人',
        status: '空闲',
        teacher: '',
        course: '',
        lastUpdated: '2025-03-07 09:15:10',
        equipment: ['投影仪', '电脑']
      },
      {
        id: 3,
        name: '西教学楼-101',
        capacity: '120人',
        status: '使用中',
        teacher: '李教授',
        course: '大学物理',
        lastUpdated: '2025-03-07 10:05:33',
        equipment: ['投影仪', '电脑', '实验设备']
      },
      {
        id: 4,
        name: '西教学楼-102',
        capacity: '60人',
        status: '空闲',
        teacher: '',
        course: '',
        lastUpdated: '2025-03-07 08:45:17',
        equipment: ['投影仪', '电脑']
      },
      {
        id: 5,
        name: '综合楼-501',
        capacity: '200人',
        status: '使用中',
        teacher: '王教授',
        course: '计算机科学导论',
        lastUpdated: '2025-03-07 09:30:45',
        equipment: ['投影仪', '电脑', '音响系统', '智能黑板']
      },
      {
        id: 6,
        name: '综合楼-502',
        capacity: '150人',
        status: '使用中',
        teacher: '刘教授',
        course: '数据结构',
        lastUpdated: '2025-03-07 10:15:28',
        equipment: ['投影仪', '电脑', '音响系统']
      },
      {
        id: 7,
        name: '实验楼-201',
        capacity: '40人',
        status: '空闲',
        teacher: '',
        course: '',
        lastUpdated: '2025-03-07 11:00:12',
        equipment: ['投影仪', '电脑', '实验设备']
      },
      {
        id: 8,
        name: '实验楼-202',
        capacity: '40人',
        status: '使用中',
        teacher: '赵教授',
        course: '化学实验',
        lastUpdated: '2025-03-07 09:50:39',
        equipment: ['投影仪', '电脑', '实验设备', '通风系统']
      },
      {
        id: 9,
        name: '图书馆-301',
        capacity: '30人',
        status: '空闲',
        teacher: '',
        course: '',
        lastUpdated: '2025-03-07 10:40:55',
        equipment: ['投影仪', '电脑', '电子白板']
      },
      {
        id: 10,
        name: '图书馆-302',
        capacity: '30人',
        status: '使用中',
        teacher: '钱教授',
        course: '文献检索',
        lastUpdated: '2025-03-07 11:20:07',
        equipment: ['投影仪', '电脑', '电子白板']
      }
    ]);
    
    // 当前选中的教室
    const selectedClassroom = ref(null);
    // 排课详情弹窗是否可见
    const scheduleDialogVisible = ref(false);
    // 日期选择弹窗是否可见
    const selectDateDialog = ref(false);
    // 当前显示的日期
    const currentDate = ref('2025年3月7日');
    // 选中的日期
    const selectedDate = ref(null);
    
    // 排课详情数据
    const scheduleDetails = ref([
      {
        time: '08:00 - 10:00',
        status: '正在使用',
        user: '计算机科学1班',
        teacher: '张教授',
        course: '高等数学'
      },
      {
        time: '10:00 - 12:00',
        status: '空闲中',
        user: '',
        teacher: '',
        course: ''
      },
      {
        time: '12:00 - 14:00',
        status: '空闲中',
        user: '',
        teacher: '',
        course: ''
      },
      {
        time: '14:00 - 16:00',
        status: '预排课',
        user: '软件工程2班',
        teacher: '王教授',
        course: '数据库原理'
      },
      {
        time: '16:00 - 18:00',
        status: '空闲中',
        user: '',
        teacher: '',
        course: ''
      },
      {
        time: '18:00 - 20:00',
        status: '预排课',
        user: '电子工程3班',
        teacher: '李教授',
        course: '电路分析'
      },
      {
        time: '20:00 - 22:00',
        status: '空闲中',
        user: '',
        teacher: '',
        course: ''
      },
    ]);

    // 统计数据
    const totalClassrooms = computed(() => classrooms.value.length);
    const activeClassrooms = computed(() => classrooms.value.filter(c => c.status === '使用中').length);
    const freeClassrooms = computed(() => classrooms.value.filter(c => c.status === '空闲').length);

    // 过滤后的教室列表
    const filteredClassrooms = computed(() => {
      let result = [...classrooms.value];

      // 搜索过滤
      if (searchKeyword.value) {
        const keyword = searchKeyword.value.toLowerCase();
        result = result.filter(item =>
          item.name.toLowerCase().includes(keyword) || 
          (item.teacher && item.teacher.toLowerCase().includes(keyword)) ||
          (item.course && item.course.toLowerCase().includes(keyword))
        );
      }

      // 状态过滤
      if (filterStatus.value) {
        result = result.filter(item => item.status === filterStatus.value);
      }
      
      // 容量过滤
      if (filterCapacity.value) {
        const capacityNumber = item => parseInt(item.capacity.replace(/[^0-9]/g, ''));
        
        if (filterCapacity.value === 'small') {
          result = result.filter(item => capacityNumber(item) < 50);
        } else if (filterCapacity.value === 'medium') {
          result = result.filter(item => capacityNumber(item) >= 50 && capacityNumber(item) <= 100);
        } else if (filterCapacity.value === 'large') {
          result = result.filter(item => capacityNumber(item) > 100);
        }
      }

      return result;
    });

    // 显示排课详情
    const showScheduleDetails = (row) => {
      selectedClassroom.value = row;
      scheduleDialogVisible.value = true;
      
      // 模拟加载数据
      tableLoading.value = true;
      setTimeout(() => {
        // 根据选中的教室更新排课详情
        if (row.status === '使用中') {
          scheduleDetails.value[0].teacher = row.teacher;
          scheduleDetails.value[0].course = row.course;
        }
        tableLoading.value = false;
      }, 500);
    };

    // 上一天
    const prevDate = () => {
      const date = new Date(calendarValue.value);
      date.setDate(date.getDate() - 1);
      calendarValue.value = date;
      updateCurrentDateFromCalendar();
      
      ElMessage({
        message: `已切换到 ${currentDate.value}`,
        type: 'success'
      });
    };

    // 下一天
    const nextDate = () => {
      const date = new Date(calendarValue.value);
      date.setDate(date.getDate() + 1);
      calendarValue.value = date;
      updateCurrentDateFromCalendar();
      
      ElMessage({
        message: `已切换到 ${currentDate.value}`,
        type: 'success'
      });
    };
    
    // 从日历更新当前日期显示
    const updateCurrentDateFromCalendar = () => {
      const date = calendarValue.value;
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      currentDate.value = `${year}年${month}月${day}日`;
    };
    
    // 处理日历日期点击
    const handleCalendarDateClick = (date) => {
      calendarValue.value = date;
    };

    // 确认日期选择
    const confirmDateSelection = () => {
      updateCurrentDateFromCalendar();
      selectDateDialog.value = false;
      
      ElMessage({
        message: `已选择日期: ${currentDate.value}`,
        type: 'success'
      });
    };
    
    // 刷新数据
    const refreshData = () => {
      tableLoading.value = true;
      
      setTimeout(() => {
        // 模拟数据刷新
        const statusOptions = ['使用中', '空闲'];
        classrooms.value = classrooms.value.map(classroom => {
          // 随机更新一些教室的状态
          if (Math.random() > 0.7) {
            const newStatus = statusOptions[Math.floor(Math.random() * statusOptions.length)];
            if (newStatus === '使用中' && classroom.status === '空闲') {
              // 如果从空闲变为使用中，添加老师和课程
              const teachers = ['张教授', '李教授', '王教授', '刘教授', '赵教授', '钱教授'];
              const courses = ['高等数学', '大学物理', '计算机科学导论', '数据结构', '化学实验', '文献检索'];
              return {
                ...classroom,
                status: newStatus,
                teacher: teachers[Math.floor(Math.random() * teachers.length)],
                course: courses[Math.floor(Math.random() * courses.length)],
                lastUpdated: new Date().toLocaleString()
              };
            } else if (newStatus === '空闲' && classroom.status === '使用中') {
              // 如果从使用中变为空闲，移除老师和课程
              return {
                ...classroom,
                status: newStatus,
                teacher: '',
                course: '',
                lastUpdated: new Date().toLocaleString()
              };
            }
          }
          return classroom;
        });
        
        tableLoading.value = false;
        
        ElMessage({
          message: '数据已刷新',
          type: 'success'
        });
      }, 800);
    };
    
    // 导出数据
    const exportData = () => {
      ElMessageBox.confirm(
        '确定要导出当前筛选的教室数据吗？',
        '导出确认',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'info'
        }
      ).then(() => {
        ElMessage({
          type: 'success',
          message: '数据导出成功，共导出 ' + filteredClassrooms.value.length + ' 条记录'
        });
      }).catch(() => {});
    };
    
    // 打印课表
    const printSchedule = () => {
      ElMessage({
        message: '正在准备打印...',
        type: 'info'
      });
      
      // 实际项目中这里应该调用打印功能
      setTimeout(() => {
        ElMessage({
          message: '课表打印成功',
          type: 'success'
        });
      }, 1000);
    };
    
    // 获取容量标签类型
    const getCapacityTagType = (capacity) => {
      const num = parseInt(capacity.replace(/[^0-9]/g, ''));
      if (num < 50) return 'info';
      if (num <= 100) return 'warning';
      return 'danger';
    };
    
    // 获取教师姓名首字母
    const getTeacherInitials = (name) => {
      if (!name) return '';
      return name.charAt(0);
    };
    
    // 处理页面大小变化
    const handleSizeChange = (val) => {
      pageSize.value = val;
    };
    
    // 处理页码变化
    const handleCurrentChange = (val) => {
      currentPage.value = val;
    };
    
    // 组件挂载时执行
    onMounted(() => {
      // 初始化日历值
      calendarValue.value = new Date();
      updateCurrentDateFromCalendar();
      
      // 模拟初始加载
      tableLoading.value = true;
      setTimeout(() => {
        tableLoading.value = false;
      }, 800);
    });

    return {
      searchKeyword,
      filterStatus,
      filterCapacity,
      classrooms,
      filteredClassrooms,
      selectedClassroom,
      scheduleDialogVisible,
      selectDateDialog,
      currentDate,
      selectedDate,
      scheduleDetails,
      tableLoading,
      currentPage,
      pageSize,
      viewType,
      calendarValue,
      totalClassrooms,
      activeClassrooms,
      freeClassrooms,
      showScheduleDetails,
      prevDate,
      nextDate,
      confirmDateSelection,
      refreshData,
      exportData,
      printSchedule,
      getCapacityTagType,
      getTeacherInitials,
      handleSizeChange,
      handleCurrentChange,
      handleCalendarDateClick,
      updateCurrentDateFromCalendar,
      // 图标
      ArrowLeft,
      ArrowRight,
      Calendar,
      Search,
      Refresh,
      Download,
      Edit,
      Monitor,
      OfficeBuilding,
      School,
      VideoPlay,
      Finished
    };
  },
};
</script>

<style scoped>
/* 全局样式 */
.classroom-container {
  padding: 24px;
  background-color: #f5f7fa;
  min-height: 100vh;
  color: #303133;
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', Arial, sans-serif;
}

/* 仪表盘头部 */
.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 20px;
}

.header-title h1 {
  margin: 0;
  font-size: 28px;
  font-weight: 600;
  color: #303133;
}

.subtitle {
  margin: 8px 0 0;
  font-size: 14px;
  color: #909399;
}

.header-stats {
  display: flex;
  gap: 16px;
}

.stat-card {
  display: flex;
  align-items: center;
  background: white;
  border-radius: 8px;
  padding: 16px;
  min-width: 160px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
  transition: all 0.3s;
}

.stat-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 16px 0 rgba(0, 0, 0, 0.1);
}

.stat-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background-color: #ecf5ff;
  color: #409eff;
  margin-right: 16px;
  font-size: 24px;
}

.active-icon {
  background-color: #fef0f0;
  color: #f56c6c;
}

.free-icon {
  background-color: #f0f9eb;
  color: #67c23a;
}

.stat-content {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: 24px;
  font-weight: 600;
  color: #303133;
  line-height: 1.2;
}

.stat-label {
  font-size: 14px;
  color: #909399;
  margin-top: 4px;
}

/* 控制面板 */
.control-panel {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 16px;
}

.search-filter {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  flex: 1;
}

.search-input {
  width: 300px;
}

.search-icon {
  color: #909399;
}

.status-select, .capacity-select {
  width: 160px;
}

.action-buttons {
  display: flex;
  gap: 12px;
}

/* 表格卡片 */
.table-card {
  margin-bottom: 24px;
  border-radius: 8px;
  overflow: hidden;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 16px;
  font-weight: 600;
}

.result-count {
  font-size: 14px;
  color: #909399;
  font-weight: normal;
}

.classroom-table {
  margin-top: 0;
}

.classroom-name {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
}

.status-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
}

.status-dot {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.active {
  background-color: #f56c6c;
  box-shadow: 0 0 0 2px rgba(245, 108, 108, 0.2);
}

.inactive {
  background-color: #67c23a;
  box-shadow: 0 0 0 2px rgba(103, 194, 58, 0.2);
}

.text-active {
  color: #f56c6c;
  font-weight: 500;
}

.text-inactive {
  color: #67c23a;
  font-weight: 500;
}

.teacher-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.teacher-avatar {
  background-color: #409eff;
  color: white;
  font-size: 12px;
}

.action-column {
  display: flex;
  gap: 8px;
  justify-content: center;
}

.table-pagination {
  margin-top: 24px;
  display: flex;
  justify-content: flex-end;
}

/* 排课详情弹窗 */
.schedule-info-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 16px;
}

.classroom-detail h2 {
  margin: 0 0 8px 0;
  font-size: 20px;
  font-weight: 600;
}

.classroom-meta {
  display: flex;
  gap: 8px;
}

.date-navigation {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 12px;
}

.view-type-toggle {
  margin-top: 8px;
}

/* 时间线样式 */
.schedule-timeline {
  border: 1px solid #ebeef5;
  border-radius: 8px;
  overflow: hidden;
  margin-top: 24px;
}

.timeline-header {
  display: flex;
  background-color: #f5f7fa;
  border-bottom: 1px solid #ebeef5;
}

.time-label {
  width: 120px;
  padding: 12px;
  font-weight: 500;
  text-align: center;
  border-right: 1px solid #ebeef5;
}

.timeline-hours {
  display: flex;
  flex: 1;
}

.hour-marker {
  flex: 1;
  text-align: center;
  padding: 12px 0;
  font-size: 13px;
  color: #606266;
  border-right: 1px dashed #ebeef5;
}

.hour-marker:last-child {
  border-right: none;
}

.timeline-content {
  background-color: white;
}

.timeline-slots {
  display: flex;
  flex-direction: column;
}

.time-slot-row {
  display: flex;
  border-bottom: 1px solid #ebeef5;
}

.time-slot-row:last-child {
  border-bottom: none;
}

.time-slot-content {
  flex: 1;
  min-height: 80px;
  padding: 12px;
  transition: all 0.3s;
}

.slot-active {
  background-color: #fef0f0;
  border-left: 3px solid #f56c6c;
}

.slot-free {
  background-color: #f0f9eb;
  border-left: 3px solid #67c23a;
}

.slot-reserved {
  background-color: #fdf6ec;
  border-left: 3px solid #e6a23c;
}

.slot-details {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.slot-title {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.slot-status {
  font-weight: 500;
  font-size: 14px;
}

.slot-course {
  font-weight: 600;
  font-size: 15px;
}

.slot-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 13px;
  color: #606266;
}

.slot-free-label {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #67c23a;
  font-weight: 500;
}

/* 日期选择弹窗 */
.date-picker-container {
  padding: 0;
}

/* 响应式样式 */
@media (max-width: 768px) {
  .dashboard-header, .control-panel {
    flex-direction: column;
    align-items: stretch;
  }
  
  .header-stats {
    flex-direction: column;
  }
  
  .search-filter {
    flex-direction: column;
  }
  
  .search-input, .status-select, .capacity-select {
    width: 100%;
  }
  
  .action-buttons {
    justify-content: space-between;
  }
  
  .schedule-info-header {
    flex-direction: column;
    align-items: stretch;
  }
  
  .date-navigation {
    align-items: stretch;
  }
}

/* 动画效果 */
@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
}

.active {
  animation: pulse 2s infinite;
}
</style>