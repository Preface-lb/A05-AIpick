<template>
  <div class="common-layout">
    <el-container class="full-screen">
      <!-- 头部部分 -->
      <el-header>
        <div class="header-content">
          <!-- 标题 -->
          <h1 class="header-title">爱排课 AIpick</h1>
          <!-- 可添加更多头部元素，如搜索框等 -->
          <div>
            <el-avatar
              src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
              class="custom-avatar"
            />
          </div>
        </div>
      </el-header>
      <!-- 主体容器 -->
      <el-container>
        <!-- 侧边栏菜单 -->
        <el-aside width="283px">
          <el-menu
            :default-active="activeIndex"
            @select="handleSelect"
            class="menu"
            :key="menuKey"
            mode="vertical"
            background-color="#273F81"
            text-color="#fff"
            active-text-color="#4A88E7"
          >
            <!-- 排课管理菜单 -->
            <el-menu-item
              index="1"
              :class="{ 'is-active': activeIndex === '1' }"
            >
              <el-icon><Edit /></el-icon>
              <span>排课管理</span>
            </el-menu-item>
            <!-- 数据分析子菜单 -->
            <el-sub-menu index="2">
              <template #title>
                <el-icon><PieChart /></el-icon>
                <span>数据分析</span>
              </template>
              <el-menu-item index="2-1">教室容量与使用分析</el-menu-item>
              <el-menu-item index="2-2">核心教学指标</el-menu-item>
              <el-menu-item index="2-3">资源使用趋势</el-menu-item>
            </el-sub-menu>
            <!-- AI 引擎配置子菜单 -->
            <el-sub-menu index="3">
              <template #title>
                <el-icon><Setting /></el-icon>
                <span>AI 引擎配置</span>
              </template>
              <el-menu-item index="3-1">算法权重分配</el-menu-item>
              <el-menu-item index="3-2">人性化排课规则</el-menu-item>
            </el-sub-menu>
            <!-- 优化与反馈子菜单 -->
            <el-sub-menu index="4">
              <template #title>
                <el-icon><ChatDotRound /></el-icon>
                <span>优化与反馈</span>
              </template>
              <el-menu-item index="4-1">反馈分析</el-menu-item>
              <el-menu-item index="4-2">优化中心</el-menu-item>
            </el-sub-menu>
          </el-menu>
        </el-aside>
        <!-- 主内容区域 -->
        <el-main>
          <!-- 动态切换内容 -->
          <component
            :is="currentComponent"
            @confirm="handleConfirm"
          ></component>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue'
import { Edit, PieChart, Setting, ChatDotRound } from '@element-plus/icons-vue'
import Notifications from '@/views/student/stumain/Notifications.vue'
import Stuclass from '@/views/student/stumain/Stuclass.vue'
import Information from '@/views/student/stumain/Information.vue'

export default defineComponent({
  components: {
    Notifications,
    Stuclass,
    Information,
    Edit,
    PieChart,
    Setting,
    ChatDotRound,
  },
  setup() {
    const activeIndex = ref('1')
    const currentComponent = ref(Notifications)
    const menuKey = ref(0)
    const searchQuery = ref('')

    const handleSelect = (index) => {
      activeIndex.value = index
      if (index === '1') {
        currentComponent.value = Notifications
      } else if (index === '2') {
        // 数据分析的逻辑
      } else if (index === '3') {
        // AI 引擎配置的逻辑
      } else if (index === '4') {
        // 优化与反馈的逻辑
      }
    }

    const handleConfirm = () => {
      // 点击 Information 确定按钮后，切换到 Stuclass
      currentComponent.value = Stuclass
    }

    return {
      activeIndex,
      currentComponent,
      handleSelect,
      handleConfirm,
      menuKey,
      searchQuery,
    }
  },
})
</script>

<style scoped>
@import '@/style/global.css';

.full-screen {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.el-header {
  height: 120px;
  background: rgb(38, 30, 86);
  color: #fff;
  display: flex;
  align-items: center;
  padding: 0 40px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.header-content {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-title {
  font-size: 42px;
  font-weight: 800;
  margin: 0;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
}

.custom-avatar {
  width: 80px;
  height: 80px;
  line-height: 80px;
}

.el-container {
  flex: 1;
  display: flex;
}

.el-aside {
  background: rgb(38, 30, 86);
  color: rgba(28, 41, 79, 1);
  display: flex;
  flex-direction: column;
  width: 283px;
  overflow: hidden;
  box-shadow: 2px 0 4px rgba(0, 0, 0, 0.1);
}

.el-main {
  background: #f4f7fc;
  color: #333;
  padding: 40px;
  flex: 1;
  overflow: auto;
  border-radius: 8px;
  margin: 20px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.menu {
  border-right: none;
  background: transparent;
}

.menu .el-menu-item {
  color: rgb(255, 255, 255);
  font-size: 16px;
  font-weight: 500;
  padding: 16px 20px;
  transition: background-color 0.3s ease;
}

.menu .el-menu-item.is-active {
  background-color: #101b39;
  border-left: 4px solid #4a88e7;
}

.menu .el-menu-item:hover {
  background-color: #1e3062;
}

.menu .el-sub-menu__title {
  color: rgba(28, 41, 79, 1);
  font-size: 18px;
  font-weight: 500;
  padding: 16px 20px;
  transition: background-color 0.3s ease;
}

.menu .el-sub-menu__title:hover {
  background-color: #0e2053;
}

.menu .el-menu-item-group__title {
  color: rgba(28, 41, 79, 1);
  font-size: 16px;
  font-weight: 500;
  padding: 16px 20px;
  transition: background-color 0.3s ease;
}

.menu .el-menu-item-group__title:hover {
  background-color: #1e3062;
}
</style>