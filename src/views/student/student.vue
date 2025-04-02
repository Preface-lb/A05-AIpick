<template>
  <div class="dashboard">
    <!-- Header -->
    <header class="header">
      <div class="header-left">
        <button @click="toggleSidebar" class="menu-toggle" :class="{ 'active': !collapsed }">
          <el-icon class="icon"><Fold /></el-icon>
        </button>
        <div class="brand">
          <h1 class="app-title">爱排课 AIpick</h1>
          <span class="app-subtitle">智能排课系统</span>
        </div>
      </div>
      <div class="header-right">
        <div class="header-actions">
          
        </div>
      </div>
    </header>

    <div class="main-container">
      <!-- Sidebar -->
      <transition name="sidebar">
        <aside class="sidebar" :class="{ 'collapsed': collapsed }">
          <div class="sidebar-header">
            <div class="user-profile">
              <div class="avatar-container large">
                <img :src="userAvatar" alt="User" class="avatar-img" />
                <span class="status-indicator"></span>
              </div>
              <div class="user-info" v-if="!collapsed">
                <h4 class="user-name">{{ userName }}</h4>
                <p class="user-class">{{ userClass }}</p>
              </div>
            </div>
          </div>

          <nav class="sidebar-nav">
            <ul class="nav-list">
              <li class="nav-item" :class="{ 'active': activeIndex === '1' }">
                <button @click="handleSelect('1')" class="nav-link">
                  <div class="nav-icon">
                    <el-icon class="icon"><Calendar /></el-icon>
                  </div>
                  <transition name="fade">
                    <span class="nav-text" v-if="!collapsed">通知公告</span>
                  </transition>
                  <span class="nav-indicator" v-if="activeIndex === '1'"></span>
                </button>
              </li>
              <li class="nav-item" :class="{ 'active': activeIndex === '2' }">
                <button @click="handleSelect('2')" class="nav-link">
                  <div class="nav-icon">
                    <el-icon class="icon"><Notebook /></el-icon>
                  </div>
                  <transition name="fade">
                    <span class="nav-text" v-if="!collapsed">课程表</span>
                  </transition>
                  <span class="nav-indicator" v-if="activeIndex === '2'"></span>
                </button>
              </li>
              <li class="nav-item" :class="{ 'active': activeIndex === '3' }">
                <button @click="handleSelect('3')" class="nav-link">
                  <div class="nav-icon">
                    <el-icon class="icon"><User /></el-icon>
                  </div>
                  <transition name="fade">
                    <span class="nav-text" v-if="!collapsed">个人中心</span>
                  </transition>
                  <span class="nav-indicator" v-if="activeIndex === '3'"></span>
                </button>
              </li>
              <!-- 新增反馈中心菜单项 -->
              <li class="nav-item" :class="{ 'active': activeIndex === '4' }">
                <button @click="handleSelect('4')" class="nav-link">
                  <div class="nav-icon">
                    <el-icon class="icon"><ChatDotSquare /></el-icon>
                  </div>
                  <transition name="fade">
                    <span class="nav-text" v-if="!collapsed">反馈中心</span>
                  </transition>
                  <span class="nav-indicator" v-if="activeIndex === '4'"></span>
                </button>
              </li>
            </ul>
          </nav>

          <div class="sidebar-footer" v-if="!collapsed">
            <button class="logout-button" @click="handleLogout">
              <el-icon class="icon"><Edit /></el-icon>
              <span>退出登录</span>
            </button>
          </div>
        </aside>
      </transition>

      <!-- Main Content -->
      <main class="main-content" :class="{ 'expanded': collapsed }">
        <div class="content-header">
          <h2 class="page-title">{{ pageTitle }}</h2>
          <div class="breadcrumbs">
            <span class="breadcrumb-item">首页</span>
            <span class="breadcrumb-separator">/</span>
            <span class="breadcrumb-item active">{{ pageTitle }}</span>
          </div>
        </div>

        <div class="content-body">
          <transition name="fade-slide" mode="out-in">
            <component :is="currentComponent" @confirm="handleConfirm"></component>
          </transition>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router';
import { ref, computed, onMounted, h } from 'vue';
import { getUserInfo } from '@/api/student';
import Notifications from '@/views/student/stumain/Notifications.vue';
import Stuclass from '@/views/student/stumain/Stuclass.vue';
import StuProfile from '@/views/student/stumain/StuProfile.vue'; 
import Stufeedback from '@/views/student/stumain/Stufeedback.vue'; 


// State
const activeIndex = ref('1');
const currentComponent = ref(Notifications);
const collapsed = ref(false);
const isMobile = ref(false);

// User data
const userName = ref();
const userClass = ref();
const userAvatar = ref(require('@/assets/PIC/stupic.png'));

// Computed properties
const pageTitle = computed(() => {
  if (activeIndex.value === '1') return '通知公告';
  if (activeIndex.value === '2') return '课程表';
  if (activeIndex.value === '3') return '个人中心';
  if (activeIndex.value === '4') return '反馈中心';
  return '';
});

// Methods
const handleSelect = (index) => {
  activeIndex.value = index;
  if (index === '1') {
    currentComponent.value = Notifications;
  } else if (index === '2') {
    currentComponent.value = Stuclass;
  } else if (index === '3') {
    currentComponent.value = StuProfile;
  } else if (index === '4') {
    currentComponent.value = Stufeedback;
  }
};

const handleConfirm = () => {
  console.log('Confirm action');
};

const toggleSidebar = () => {
  collapsed.value = !collapsed.value;
};

// Check if mobile on mount
onMounted(() => {
  const checkIfMobile = () => {
    isMobile.value = window.innerWidth < 768;
    if (isMobile.value && !collapsed.value) {
      collapsed.value = true;
    }
  };
  
  checkIfMobile();
  window.addEventListener('resize', checkIfMobile);
  
  // Cleanup
  return () => {
    window.removeEventListener('resize', checkIfMobile);
  };
});

// 获取用户信息
const fetchStudentInfo = async () => {
  try {
    const response = await getUserInfo();
    userName.value = response.name || '学生姓名';
    userClass.value = response.class || '2024级计算机科学班';
  } catch (error) {
    console.error('获取用户信息失败:', error);
  }
};

onMounted(() => {
  fetchStudentInfo();
});

// 退出登录
const router = useRouter();

const handleLogout = () => {

  router.push('/'); 
};



</script>

<style scoped>

@import '@/style/global.css';

/* Base Styles */
.dashboard {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #f8faff;
  font-family: 'Inter', 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif;
  color: #1a202c;
  overflow: hidden;
}


.header {
  height: 70px;
  background: linear-gradient(135deg, #1e40af, #3b82f6);
  color: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  z-index: 50;
  position: relative;
}

.header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fill-opacity='0.05' fill-rule='evenodd'/%3E%3C/svg%3E");
  opacity: 0.5;
  z-index: -1;
}

.header-left, .header-right {
  display: flex;
  align-items: center;
}

.brand {
  display: flex;
  flex-direction: column;
}

.app-title {
  font-size: 24px;
  font-weight: 700;
  letter-spacing: -0.5px;
  margin: 0;
  background: linear-gradient(to right, #ffffff, #e0f2fe);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  font-family: 'ZPMDZ', sans-serif;
}

.app-subtitle {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.8);
  margin-top: -2px;
  font-family: 'ZCOOLXiaoWei', sans-serif;
}

.menu-toggle {
  background: rgba(255, 255, 255, 0.15);
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  margin-right: 16px;
  color: white;
  transition: all 0.3s;
  position: relative;
  overflow: hidden;
}

.menu-toggle::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.1);
  transform: scale(0);
  border-radius: 50%;
  transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.menu-toggle:hover::before {
  transform: scale(2);
}



.header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}


.user-dropdown {
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 12px;
  padding: 6px 16px 6px 6px;
  margin-left: 8px;
  cursor: pointer;
  transition: all 0.3s;
  backdrop-filter: blur(5px);
}

.user-dropdown:hover {
  background: rgba(255, 255, 255, 0.25);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.avatar-container {
  position: relative;
  width: 32px;
  height: 32px;
  border-radius: 10px;
  overflow: hidden;
  margin-right: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.avatar-container.large {
  width: 60px;
  height: 60px;
  border-radius: 16px;
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.avatar-container:hover .avatar-img {
  transform: scale(1.05);
}

.status-indicator {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 10px;
  height: 10px;
  background: #10b981;
  border-radius: 50%;
  border: 2px solid #1e40af;
  z-index: 1;
}

.user-info {
  display: flex;
  flex-direction: column;
}

.username {
  font-size: 14px;
  font-weight: 600;
  color: white;
}

.user-role {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.7);
}

.dropdown-icon {
  margin-left: 8px;
  opacity: 0.7;
  transition: transform 0.3s;
}

.user-dropdown:hover .dropdown-icon {
  transform: rotate(180deg);
}

/* Main Container */
.main-container {
  display: flex;
  flex: 1;
  overflow: hidden;
  position: relative;
}

/* Sidebar Styles */
.sidebar {
  width: 280px;
  background: linear-gradient(180deg, #1e3a8a 0%, #1e40af 100%);
  color: white;
  display: flex;
  flex-direction: column;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 4px 0 20px rgba(0, 0, 0, 0.1);
  z-index: 40;
  position: relative;
  overflow: hidden;
}

.sidebar::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fill-opacity='0.05' fill-rule='evenodd'/%3E%3C/svg%3E");
  opacity: 0.5;
  z-index: -1;
}

.sidebar.collapsed {
  width: 100px;
}

.sidebar-header {
  padding: 24px 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 16px;
}

.user-name {
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 4px 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: #ffffff;
}

.user-class {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.sidebar-nav {
  flex: 1;
  padding: 24px 12px;
  overflow-y: auto;
}

.nav-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.nav-item {
  position: relative;
}

.nav-link {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  border-radius: 12px;
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  transition: all 0.3s;
  border: none;
  background: transparent;
  width: 100%;
  text-align: left;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.nav-link::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.1);
  transform: scale(0);
  border-radius: 50%;
  transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.nav-link:hover::before {
  transform: scale(2);
}

.nav-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.1);
  margin-right: 12px;
  transition: all 0.3s;
}

.nav-item.active .nav-icon {
  background: rgba(255, 255, 255, 0.2);
  box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.1);
}

.nav-text {
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s;
}

.nav-indicator {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.3);
}

.nav-item.active .nav-link {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

.sidebar-footer {
  padding: 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.logout-button {
  display: flex;
  align-items: center;
  width: 100%;
  padding: 12px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: none;
  cursor: pointer;
  transition: all 0.3s;
  position: relative;
  overflow: hidden;
}

.logout-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.1);
  transform: scale(0);
  border-radius: 50%;
  transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.logout-button:hover::before {
  transform: scale(2);
}

.logout-button:hover {
  background: rgba(255, 255, 255, 0.15);
}

.logout-button span {
  margin-left: 12px;
  font-size: 14px;
}

/* Main Content */
.main-content {
  flex: 1;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: linear-gradient(135deg, #f0f7ff 0%, #ffffff 100%);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.main-content.expanded {
  margin-left: 0;
}

.content-header {
  padding: 24px 32px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.page-title {
  font-size: 24px;
  font-weight: 700;
  color: #1e40af;
  margin: 0 0 8px 0;
}

.breadcrumbs {
  display: flex;
  align-items: center;
  font-size: 13px;
  color: #64748b;
}

.breadcrumb-item {
  display: inline-block;
}

.breadcrumb-item.active {
  color: #3b82f6;
  font-weight: 500;
}

.breadcrumb-separator {
  margin: 0 8px;
  color: #94a3b8;
}

.content-body {
  padding: 24px 32px;
  overflow-y: auto;
  flex: 1;
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s ease;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.sidebar-enter-active,
.sidebar-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.sidebar-enter-from,
.sidebar-leave-to {
  transform: translateX(-100%);
}

/* Responsive Adjustments */
@media (max-width: 1024px) {
  .header-actions {
    gap: 8px;
  }
  
  .content-header {
    padding: 16px 20px;
  }
  
  .content-body {
    padding: 16px 20px;
  }
}

@media (max-width: 768px) {
  .user-info {
    display: none;
  }
  
  .dropdown-icon {
    display: none;
  }
  
  .user-dropdown {
    padding: 6px;
  }
  
  .sidebar {
    position: absolute;
    height: 100%;
    transform: translateX(-100%);
  }
  
  .sidebar:not(.collapsed) {
    transform: translateX(0);
  }
}
</style>