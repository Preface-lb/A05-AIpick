<template>
  <div class="common-layout">
    <el-container class="full-screen">
      <el-header>
        <div class="header-content">
          <h1 class="header-title">爱排课 AIpick</h1>
        </div>
      </el-header>
      <el-container>
        <el-aside width="283px">
          <div class="demo-type">
            <div class="user-info">
              <el-avatar class="user-avatar">user</el-avatar>
              <div class="user-details">
                <h1 class="user-name">XXX</h1>
                <h2 class="user-class">XXX级XXX班</h2>
              </div>
            </div>
          </div>

          <!-- 菜单部分 -->
          <el-menu
            :default-active="activeIndex"
            @select="handleSelect"
            class="menu"
            :key="menuKey"
          >
            <el-menu-item
              index="1"
              :class="{ 'is-active': activeIndex === '1' }"
            >
              <el-icon><bell /></el-icon>
              <span>通知公告</span>
            </el-menu-item>
            <el-menu-item
              index="2"
              :class="{ 'is-active': activeIndex === '2' }"
            >
              <el-icon><schedule /></el-icon>
              <span>课程表</span>
            </el-menu-item>
            <el-menu-item
              index="3"
              :class="{ 'is-active': activeIndex === '3' }"
            >
              <el-icon><edit /></el-icon>
              <span>选课功能</span>
            </el-menu-item>
            <el-menu-item
              index="4"
              :class="{ 'is-active': activeIndex === '4' }"
            >
              <el-icon><document /></el-icon>
              <span>成绩查看</span>
            </el-menu-item>
            <el-menu-item
              index="5"
              :class="{ 'is-active': activeIndex === '5' }"
            >
              <el-icon><notebook /></el-icon>
              <span>学分查看</span>
            </el-menu-item>
          </el-menu>
        </el-aside>
        <el-main>
          <!-- 动态切换内容 -->
          <component :is="currentComponent"></component>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue'
import Notifications from '@/views/student/stumain/Notifications.vue'
import Stuclass from '@/views/student/stumain/Stuclass.vue'
import CourseSelection from '@/views/student/stumain/CourseSelection.vue'
import Grades from '@/views/student/stumain/Grades.vue'
import Credits from '@/views/student/stumain/Credits.vue'

export default defineComponent({
  components: {
    Notifications,
    Stuclass,
    CourseSelection,
    Grades,
    Credits,
  },
  setup() {
    const activeIndex = ref('1')
    const currentComponent = ref(Notifications)
    const menuKey = ref(0)

    const handleSelect = (index) => {
      activeIndex.value = index
      switch (index) {
        case '1':
          currentComponent.value = Notifications
          break
        case '2':
          currentComponent.value = Stuclass
          break
        case '3':
          currentComponent.value = CourseSelection
          break
        case '4':
          currentComponent.value = Grades
          break
        case '5':
          currentComponent.value = Credits
          break
        default:
          currentComponent.value = Notifications
      }
    }

    return {
      activeIndex,
      currentComponent,
      handleSelect,
      menuKey,
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
  height: 100px;
  background-color: rgba(74, 136, 231, 1);
  color: #fff;
  display: flex;
  align-items: center;
  padding: 0 20px;
}

.header-content {
  text-align: center;
}

.header-title {
  font-size: 38px;
  font-weight: 1000;
  margin: 0;
  font-family: 'PMZD', sans-serif;
}

.el-container {
  flex: 1;
  display: flex;
}

.el-aside {
  background-color: rgba(39, 63, 129, 1);
  color: #333;
  display: flex;
  flex-direction: column;
  width: 283px;
  overflow: hidden;
}

.demo-type {
  padding: 20px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.user-avatar {
  width: 90px;
  height: 90px;
  font-size: 18px;
  background-color: #409eff;
  color: #fff;
}

.user-details {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.user-name {
  font-size: 26px;
  font-weight: bold;
  color: #fff;
  margin: 0;
}

.user-class {
  font-size: 18px;
  font-weight: normal;
  color: #fff;
  margin: 0;
}

.el-main {
  background-color: rgba(222, 234, 251, 1);
  color: #333;
  padding: 20px;
  flex: 1;
  overflow: auto;
}

.menu {
  border-right: none;
  background-color: rgba(39, 63, 129, 1);
}

.menu .el-menu-item {
  color: #fff;
  font-size: 16px;
  font-weight: 600;
}

.menu .el-menu-item.is-active {
  background-color: rgba(30, 48, 98, 1);
}
.menu .el-menu-item:hover {
  background-color: rgba(30, 48, 98, 1);
  color: #fff;
  font-size: 16px;
  font-weight: 800;
}
</style>