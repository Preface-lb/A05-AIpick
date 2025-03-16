<template>
  <div class="admin-container">
    <!-- 表头 - 保持不变 -->
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

    <!-- 主体内容 - 美化部分 -->
    <div class="admin-content">
      <!-- 主内容区域 -->
      <div class="main-area">
        <div class="content-header">
          <h2 class="page-title">{{ getStepTitle(activeStep) }}</h2>
          <div class="breadcrumb">
            <span>首页</span>
            <el-icon><ArrowRight /></el-icon>
            <span>排课管理</span>
            <el-icon><ArrowRight /></el-icon>
            <span class="current-step">{{ getStepTitle(activeStep) }}</span>
          </div>
        </div>
        
        <!-- 动态组件包装器 -->
        <div class="component-wrapper">
          <transition name="fade" mode="out-in">
            <component :is="currentComponent" />
          </transition>
        </div>
        
        <!-- 底部导航按钮 -->
        <div class="navigation-buttons">
          <el-button 
            v-if="activeStep > 0" 
            @click="goToPreviousStep" 
            class="prev-button"
          >
            <el-icon><ArrowLeft /></el-icon> 上一步
          </el-button>
          
          <el-button 
            v-if="activeStep < 6" 
            type="primary" 
            @click="goToNextStep" 
            class="next-button"
          >
            下一步 <el-icon><ArrowRight /></el-icon>
          </el-button>
          
          <el-button 
            v-if="activeStep === 6" 
            type="success" 
            @click="startScheduling" 
            class="start-button"
          >
            开始排课 <el-icon><CaretRight /></el-icon>
          </el-button>
        </div>
      </div>

      <!-- 底部垂直步骤条 -->
      <div class="schedule-steps">
        <div class="steps-header">
          <h3>排课流程</h3>
          <div class="progress-info">
            <div class="progress-bar">
              <div class="progress-fill" :style="{width: `${(activeStep / 6) * 100}%`}"></div>
            </div>
            <span class="progress-text">{{ Math.round((activeStep / 6) * 100) }}% 完成</span>
          </div>
        </div>
        
        <el-steps direction="vertical" :active="activeStep" finish-status="success">
          <el-step 
            v-for="(step, index) in steps" 
            :key="index" 
            :title="step.title" 
            @click="goToStep(step.key)"
          >
            <template #icon>
              <el-icon>
                <!-- 正确使用图标组件 -->
                <Collection v-if="step.key === 'course-selection'" />
                <User v-if="step.key === 'teacher-selection'" />
                <Setting v-if="step.key === 'priority-settings'" />
                <CaretBottom v-if="step.key === 'human-settings'" />
                <Delete v-if="step.key === 'ban-settings'" />
                <Phone v-if="step.key === 'ai-weights'" />
                <CaretRight v-if="step.key === 'start-scheduling'" />
              </el-icon>
            </template>
            <template #description>
              <span class="step-description">{{ step.description }}</span>
            </template>
          </el-step>
        </el-steps>

        <div class="steps-help">
          <el-icon><InfoFilled /></el-icon>
          <span>点击步骤可以直接跳转</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import {
  Collection,
  User,
  Setting,
  CaretBottom,
  Delete,
  Phone,
  CaretRight,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  InfoFilled,
  SwitchButton
} from '@element-plus/icons-vue'

// 引入各个步骤对应的组件
import CourseSelection from '@/views/administrator/admini/CourseSelection.vue'
import TeacherSelection from '@/views/administrator/admini/TeacherSelection.vue'
import PrioritySettings from '@/views/administrator/admini/PrioritySettings.vue'
import HumanSettings from '@/views/administrator/admini/HumanSettings.vue'
import BanSettings from '@/views/administrator/admini/BanSettings.vue'
import AIWeights from '@/views/administrator/admini/AIWeights.vue'
import StartScheduling from '@/views/administrator/admini/StartScheduling.vue'

const activeStep = ref(0)
const currentComponent = ref(CourseSelection) // 默认显示课程选择组件
const router = useRouter()

// 步骤配置 - 移除了icon字段，因为我们直接在模板中使用组件
const steps = [
  { 
    key: 'course-selection', 
    title: '课程选择', 
    description: '选择需要排课的课程' 
  },
  { 
    key: 'teacher-selection', 
    title: '老师选择', 
    description: '分配教师与课程' 
  },
  { 
    key: 'priority-settings', 
    title: '优先排课设置', 
    description: '设置优先排课规则' 
  },
  { 
    key: 'human-settings', 
    title: '人性化排课设置', 
    description: '设置人性化排课参数' 
  },
  { 
    key: 'ban-settings', 
    title: '禁排设置', 
    description: '设置禁止排课时段' 
  },
  { 
    key: 'ai-weights', 
    title: 'AI权重配置', 
    description: '配置AI排课权重' 
  },
  { 
    key: 'start-scheduling', 
    title: '开始排课', 
    description: '启动AI智能排课' 
  }
]

const stepMap = {
  'course-selection': 0,
  'teacher-selection': 1,
  'priority-settings': 2,
  'human-settings': 3,
  'ban-settings': 4,
  'ai-weights': 5,
  'start-scheduling': 6
}

const componentMap = computed(() => ({
  'course-selection': CourseSelection,
  'teacher-selection': TeacherSelection,
  'priority-settings': PrioritySettings,
  'human-settings': HumanSettings,
  'ban-settings': BanSettings,
  'ai-weights': AIWeights,
  'start-scheduling': StartScheduling
}))

function goToStep(stepName) {
  activeStep.value = stepMap[stepName]
  currentComponent.value = componentMap.value[stepName]
}

function goToNextStep() {
  if (activeStep.value < 6) {
    activeStep.value++
    currentComponent.value = componentMap.value[Object.keys(stepMap)[activeStep.value]]
  }
}

function goToPreviousStep() {
  if (activeStep.value > 0) {
    activeStep.value--
    currentComponent.value = componentMap.value[Object.keys(stepMap)[activeStep.value]]
  }
}

function getStepTitle(stepIndex) {
  return steps[stepIndex].title
}

function startScheduling() {
  // 实际排课逻辑
  console.log('开始排课');
  
  // 跳转到 /administratorclass 路由
  router.push('/administratorclass');
}
</script>
  
  <style scoped>
  .admin-container {
    min-height: 100vh;
    background-color: #f5f7fa;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  }
  
  /* 保持header样式不变 */
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
  
  /* 美化主体内容区域 */
  .admin-content {
    display: flex;
    margin: 30px;
    gap: 25px;
  }
  
  .main-area {
  flex: 1;
  background-color: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  padding: 0;
  height: 860px; /* 设置固定高度 */
  display: flex;
  flex-direction: column;
  overflow: hidden; /* 防止内容溢出 */
}
  
  .content-header {
    padding: 20px 30px;
    border-bottom: 1px solid #f0f0f0;
    background: linear-gradient(to right, #f9fafc, #f5f7fa);
  }
  
  .page-title {
    font-size: 22px;
    font-weight: 600;
    color: #333;
    margin: 0 0 10px 0;
  }
  
  .breadcrumb {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    color: #888;
  }
  
  .breadcrumb .el-icon {
    font-size: 12px;
  }
  
  .current-step {
    color: #4A88E7;
    font-weight: 500;
  }
  
  .component-wrapper {
    flex: 1;
    padding: 30px;
    overflow-y: auto;
  }
  
  .navigation-buttons {
    display: flex;
    justify-content: space-between;
    padding: 20px 30px;
    border-top: 1px solid #f0f0f0;
    background-color: #fafafa;
  }
  
  .prev-button, .next-button, .start-button {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 20px;
    font-weight: 500;
  }
  
  .start-button {
    background: linear-gradient(135deg, #4CAF50, #45a049);
    border: none;
    box-shadow: 0 4px 10px rgba(76, 175, 80, 0.3);
  }
  
  .start-button:hover {
    background: linear-gradient(135deg, #45a049, #3d8b3d);
    box-shadow: 0 6px 12px rgba(76, 175, 80, 0.4);
  }
  
  /* 美化步骤条 */
  .schedule-steps {
    width: 300px;
    background-color: white;
    border-radius: 16px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    padding: 0;
    display: flex;
    flex-direction: column;
  }
  
  .steps-header {
    padding: 20px;
    border-bottom: 1px solid #f0f0f0;
    background: linear-gradient(to right, #f9fafc, #f5f7fa);
  }
  
  .steps-header h3 {
    font-size: 18px;
    font-weight: 600;
    color: #333;
    margin: 0 0 15px 0;
  }
  
  .progress-info {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  
  .progress-bar {
    height: 6px;
    background-color: #eee;
    border-radius: 3px;
    overflow: hidden;
  }
  
  .progress-fill {
    height: 100%;
    background: linear-gradient(to right, #8e44ad, #9b59b6);
    border-radius: 3px;
    transition: width 0.3s ease;
  }
  
  .progress-text {
    font-size: 13px;
    color: #666;
    text-align: right;
  }
  
  :deep(.el-steps) {
    padding: 20px;
  }
  
  :deep(.el-step) {
    cursor: pointer;
    transition: all 0.2s ease;
  }
  
  :deep(.el-step:hover) {
    background-color: #f9fafc;
    border-radius: 8px;
  }
  
  :deep(.el-step__head) {
    cursor: pointer;
  }
  
  :deep(.el-step__title) {
    font-size: 15px;
    font-weight: 500;
    color: #555;
  }
  
  :deep(.el-step__title.is-active) {
    color: #4A88E7;
    font-weight: 600;
  }
  
  :deep(.el-step__title.is-finish) {
    color: #4A88E7;
    font-weight: 500;
  }
  
  .step-description {
    font-size: 12px;
    color: #888;
    display: block;
    margin-top: 4px;
  }
  
  :deep(.el-step__icon) {
    width: 36px;
    height: 36px;
    font-size: 18px;
    background-color: #f5f7fa;
    border: 1px solid #e0e0e0;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  }
  
  :deep(.el-step__icon.is-active) {
    background: linear-gradient(135deg, #4A88E7, #6E9FEF);
    border-color: #4A88E7;
    box-shadow: 0 4px 10px rgba(74, 136, 231, 0.3);
  }
  
  :deep(.el-step__icon.is-finish) {
    background: #4A88E7;
    color: white;
    border-color: #4A88E7;
  }
  
  :deep(.el-step__line) {
    background-color: #e0e0e0;
  }
  
  :deep(.el-step__line.is-vertical) {
    left: 18px;
  }
  
  .steps-help {
    margin-top: auto;
    padding: 15px 20px;
    background-color: #f9fafc;
    border-top: 1px solid #f0f0f0;
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    color: #888;
    border-radius: 0 0 16px 16px;
  }
  
  .steps-help .el-icon {
    color: #4A88E7;
  }
  
  /* 动画效果 */
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.3s ease;
  }
  
  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }
  
  /* 响应式设计 */
  @media (max-width: 1200px) {
    .admin-content {
      margin: 20px;
      gap: 20px;
    }
    
    .schedule-steps {
      width: 280px;
    }
  }
  
  @media (max-width: 992px) {
    .admin-content {
      flex-direction: column;
    }
    
    .schedule-steps {
      width: 100%;
      margin-top: 20px;
    }
    
    .content-header {
      padding: 15px 20px;
    }
    
    .component-wrapper {
      padding: 20px;
    }
    
    .navigation-buttons {
      padding: 15px 20px;
    }
  }
  
  @media (max-width: 576px) {
    .admin-content {
      margin: 15px;
    }
    
    .page-title {
      font-size: 20px;
    }
    
    .breadcrumb {
      font-size: 12px;
    }
  }
  </style>