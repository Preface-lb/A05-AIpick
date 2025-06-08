<template>
  <div class="common-layout">
    <el-container class="full-screen">
      <!-- Enhanced Header -->
      <el-header class="custom-header">
        <div class="header-content">
          <div class="logo-area">
            <div class="logo-icon">AP</div>
            <h1 class="header-title">爱排课 <span class="highlight">AIpick</span></h1>
          </div>
          
          <div class="header-actions">
            
            
            <el-dropdown trigger="click">
              <div class="user-profile">
                <el-avatar
                  src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
                  class="custom-avatar"
                />
                <span class="user-name">管理员</span>
                <el-icon><ArrowDown /></el-icon>
              </div>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item>
                    <el-icon><User /></el-icon>个人资料
                  </el-dropdown-item>
                  <el-dropdown-item>
                    <el-icon><Setting /></el-icon>账户设置
                  </el-dropdown-item>
                  <el-dropdown-item divided>
                    <el-icon><SwitchButton /></el-icon>退出登录
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </div>
      </el-header>
      
      <!-- Main Container -->
      <el-container class="content-container">
        <!-- Enhanced Sidebar -->
        <el-aside class="custom-aside" width="283px">
          
          
          <el-scrollbar>
            <el-menu
              :default-active="activeIndex"
              @select="handleSelect"
              class="menu"
              :key="menuKey"
              mode="vertical"
              background-color="transparent"
              text-color="#fff"
              active-text-color="#4A88E7"
            >
              <!-- 排课管理菜单 -->
              <el-menu-item index="1" :class="{ 'is-active': activeIndex === '1' }">
                <el-icon><Edit /></el-icon>
                <span>课程调度</span>
              </el-menu-item>
              
              <!-- 数据分析子菜单 -->
              <el-sub-menu index="2">
                <template #title>
                  <el-icon><PieChart /></el-icon>
                  <span>数据分析</span>
                </template>
                <el-menu-item index="2-1">
                  <el-icon><OfficeBuilding /></el-icon>
                  教室容量与使用分析
                </el-menu-item>
                <el-menu-item index="2-2">
                  <el-icon><DataAnalysis /></el-icon>
                  核心教学指标
                </el-menu-item>
                <el-menu-item index="2-3">
                  <el-icon><TrendCharts /></el-icon>
                  资源使用趋势
                </el-menu-item>
              </el-sub-menu>
              
              <!-- AI 引擎配置子菜单 -->
              <el-sub-menu index="3">
                <template #title>
                  <el-icon><Setting /></el-icon>
                  <span>具体课表查询</span>
                </template>
                <el-menu-item index="3-1">
                  <el-icon><Collection /></el-icon>
                  班级课表查看
                </el-menu-item>
                <el-menu-item index="3-2">
                  <el-icon><Avatar /></el-icon>
                  教师课表查看
                </el-menu-item>
              </el-sub-menu>
              
              <!-- 优化与反馈子菜单 -->
              <el-sub-menu index="4">
                <template #title>
                  <el-icon><ChatDotRound /></el-icon>
                  <span>优化与反馈</span>
                </template>
                <el-menu-item index="4-1">
                  <el-icon><ChatLineRound /></el-icon>
                  反馈分析
                </el-menu-item>
                <el-menu-item index="4-2">
                  <el-icon><Opportunity /></el-icon>
                  优化中心
                </el-menu-item>
              </el-sub-menu>
              
              <div class="menu-divider"></div>
              
              <el-menu-item index="5">
                <el-icon><QuestionFilled /></el-icon>
                <span>帮助中心</span>
              </el-menu-item>
            </el-menu>
          </el-scrollbar>
          
          <div class="aside-footer">
            <div class="system-info">
              <div class="version">版本 v2.5.3</div>
              <div class="status">
                <span class="status-dot"></span>
                系统状态: 正常
              </div>
            </div>
          </div>
        </el-aside>
        
        <!-- Enhanced Main Content -->
        <el-main class="custom-main">
          <div class="page-header">
            <div class="breadcrumb">
              <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
                <el-breadcrumb-item v-if="activeIndex === '1'">排课数据</el-breadcrumb-item>
                <el-breadcrumb-item v-else-if="activeIndex.startsWith('2')">数据分析</el-breadcrumb-item>
                <el-breadcrumb-item v-else-if="activeIndex.startsWith('3')">具体课表查询</el-breadcrumb-item>
                <el-breadcrumb-item v-else-if="activeIndex.startsWith('4')">优化与反馈</el-breadcrumb-item>
              </el-breadcrumb>
            </div>
            
          </div>
          
          <!-- Dynamic Content -->
          <div class="content-wrapper">
            <transition name="fade" mode="out-in">
              <component :is="currentComponent" @confirm="handleConfirm"></component>
            </transition>
          </div>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue'
import {
  Edit,
  PieChart,
  Setting,
  ChatDotRound,
  User,
  SwitchButton,
  ArrowDown,
  Plus,
  Refresh,
  OfficeBuilding,
  DataAnalysis,
  TrendCharts,
  Collection,
  Avatar,
  ChatLineRound,
  Opportunity,
  QuestionFilled
} from '@element-plus/icons-vue'
import paikeguanli from '@/views/administrator/adminiclass/SchedulingData.vue'
import ClassroomCapacity from '@/views/administrator/adminiclass/ClassroomCapacity.vue'
import TeachingMetrics from '@/views/administrator/adminiclass/TeachingMetrics.vue'
import ResourceUsage from '@/views/administrator/adminiclass/ResourceUsage.vue'
import ClassSchedule from '@/views/administrator/adminiclass/ClassSchedule.vue'
import TeacherSchedule from '@/views/administrator/adminiclass/TeacherSchedule.vue'
import FeedbackAnalysis from '@/views/administrator/adminiclass/FeedbackAnalysis.vue'
import OptimizationCenter from '@/views/administrator/adminiclass/OptimizationCenter.vue'
import Stuclass from '@/views/student/stumain/Stuclass.vue'

export default defineComponent({
  components: {
    paikeguanli,
    ClassroomCapacity,
    TeachingMetrics,
    ResourceUsage,
    ClassSchedule,
    TeacherSchedule,
    FeedbackAnalysis,
    OptimizationCenter,
    Stuclass,
    Edit,
    PieChart,
    Setting,
    ChatDotRound,
    User,
    SwitchButton,
    ArrowDown,
    Plus,
    Refresh,
    OfficeBuilding,
    DataAnalysis,
    TrendCharts,
    Collection,
    Avatar,
    ChatLineRound,
    Opportunity,
    QuestionFilled
  },
  setup() {
    const activeIndex = ref('1')
    const currentComponent = ref(paikeguanli)  // Default component
    const menuKey = ref(0)
    const searchQuery = ref('')

    const handleSelect = (index) => {
      activeIndex.value = index
      if (index === '1') {
        currentComponent.value = paikeguanli
      } else if (index === '2-1') {
        currentComponent.value = ClassroomCapacity
      } else if (index === '2-2') {
        currentComponent.value = TeachingMetrics
      } else if (index === '2-3') {
        currentComponent.value = ResourceUsage
      } else if (index === '3-1') {
        currentComponent.value = ClassSchedule
      } else if (index === '3-2') {
        currentComponent.value = TeacherSchedule
      } else if (index === '4-1') {
        currentComponent.value = FeedbackAnalysis
      } else if (index === '4-2') {
        currentComponent.value = OptimizationCenter
      }
    }

    const handleConfirm = () => {
      // Clicking a specific action (e.g., button) to switch to Stuclass
      currentComponent.value = Stuclass
    }

    return {
      activeIndex,
      currentComponent,
      handleSelect,
      handleConfirm,
      menuKey,
      searchQuery,
      // Icons
      User,
      SwitchButton,
      ArrowDown,
      Plus,
      Refresh,
      OfficeBuilding,
      DataAnalysis,
      TrendCharts,
      Collection,
      Avatar,
      ChatLineRound,
      Opportunity,
      QuestionFilled
    }
  },
})
</script>

<style scoped>
@import '@/style/global.css';

/* Base Styles */
.full-screen {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

/* Enhanced Header Styles */
.custom-header {
  height: 80px;
  background: linear-gradient(135deg, #0e1e26, #24394a);
  color: #fff;
  display: flex;
  align-items: center;
  padding: 0 30px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  position: relative;
  overflow: hidden;
  z-index: 10;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.custom-header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fill-opacity='0.05' fill-rule='evenodd'/%3E%3C/svg%3E");
  opacity: 0.3;
}

.header-content {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  z-index: 1;
}

.logo-area {
  display: flex;
  align-items: center;
  gap: 15px;
}

.logo-icon {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #4A88E7, #6E9FEF);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 20px;
  box-shadow: 0 4px 10px rgba(74, 136, 231, 0.4);
}

.header-title {
  font-size: 28px;
  font-weight: 700;
  margin: 0;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.3);
  letter-spacing: 0.5px;
}

.highlight {
  color: #4A88E7;
  font-weight: 800;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 20px;
}

.header-icon {
  font-size: 22px;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.header-icon:hover {
  transform: scale(1.1);
  color: #4A88E7;
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  padding: 5px 10px;
  border-radius: 20px;
  transition: background-color 0.2s ease;
}

.user-profile:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.user-name {
  font-size: 14px;
  font-weight: 500;
  color:#fff;
}

/* Custom Avatar */
.custom-avatar {
  width: 40px;
  height: 40px;
  border: 2px solid #4A88E7;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  transition: transform 0.2s ease;
}

.user-profile:hover .custom-avatar {
  transform: scale(1.05);
}

/* Content Container */
.content-container {
  flex: 1;
  overflow: hidden;
}

/* Enhanced Sidebar Styles */
.custom-aside {
  background: linear-gradient(180deg, #0e1e26, #24394a);
  color: #fff;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.2);
  transition: width 0.3s ease;
  position: relative;
}

.menu {
  border-right: none;
  background: transparent;
  padding: 20px 0 10px;
}

.menu .el-menu-item {
  color: #fff;
  font-size: 15px;
  font-weight: 500;
  padding: 14px 20px;
  margin: 4px 10px;
  border-radius: 8px;
  height: auto;
  line-height: 1.5;
  transition: all 0.3s ease;
  position: relative;
}

.menu .el-menu-item.is-active,
.menu .el-menu-item:hover {
  background-color: rgba(74, 136, 231, 0.2);
  transform: translateX(4px);
}

.menu .el-menu-item.is-active {
  color: #4A88E7;
  font-weight: 600;
}

.menu .el-menu-item.is-active::before {
  content: '';
  position: absolute;
  left: -10px;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 20px;
  background: #4A88E7;
  border-radius: 0 4px 4px 0;
}

.menu .el-sub-menu__title {
  color: #fff;
  font-size: 15px;
  font-weight: 500;
  padding: 14px 20px;
  margin: 4px 10px;
  border-radius: 8px;
  height: auto;
  line-height: 1.5;
  transition: all 0.3s ease;
}

.menu .el-sub-menu__title:hover {
  background-color: rgba(74, 136, 231, 0.2);
  transform: translateX(4px);
}

.menu .el-sub-menu :deep(.el-menu) {
  background-color: rgba(0, 0, 0, 0.2);
  margin: 0 10px;
  border-radius: 8px;
  padding: 5px;
}

.menu .el-sub-menu :deep(.el-menu .el-menu-item) {
  margin: 2px 0;
  padding: 10px 15px;
  font-size: 14px;
  min-width: auto;
}


.menu-divider {
  height: 1px;
  background: rgba(255, 255, 255, 0.1);
  margin: 10px 20px;
}

.aside-footer {
  margin-top: auto;
  padding: 15px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.system-info {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
}

.version {
  margin-bottom: 5px;
}

.status {
  display: flex;
  align-items: center;
  gap: 5px;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #67c23a;
  display: inline-block;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(103, 194, 58, 0.4);
  }
  70% {
    box-shadow: 0 0 0 6px rgba(103, 194, 58, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(103, 194, 58, 0);
  }
}

/* Enhanced Main Content */
.custom-main {
  background: #f4f7fc;
  color: #333;
  padding: 0;
  flex: 1;
  overflow: auto;
  display: flex;
  flex-direction: column;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 30px;
  background: #fff;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  border-bottom: 1px solid #eaedf2;
}

.breadcrumb {
  font-size: 14px;
}

.content-wrapper {
  flex: 1;
  padding: 30px;
  overflow: auto;
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Responsive Adjustments */
@media (max-width: 1200px) {
  .custom-aside {
    width: 240px !important;
  }
}

@media (max-width: 992px) {
  .header-title {
    font-size: 24px;
  }
  
  .user-name {
    display: none;
  }
  
  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }
  
  .page-actions {
    width: 100%;
    justify-content: flex-end;
  }
}

@media (max-width: 768px) {
  .custom-header {
    padding: 0 15px;
    height: 70px;
  }
  
  .logo-icon {
    width: 35px;
    height: 35px;
    font-size: 16px;
  }
  
  .header-title {
    font-size: 20px;
  }
  
  .custom-aside {
    width: 0 !important;
    position: absolute;
    height: calc(100vh - 70px);
    z-index: 100;
  }
  
  .custom-aside.expanded {
    width: 240px !important;
  }
  
  .content-wrapper {
    padding: 15px;
  }
}
</style>