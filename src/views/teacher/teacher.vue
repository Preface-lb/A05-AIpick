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
              <el-avatar :src="require('@/assets/PIC/teapic.png')"  class="custom-avatar" />
              <div class="user-details">
                <h1 class="user-name">XXX</h1>
                <h2 class="user-class">XXX学院</h2>
              </div>
            </div>
          </div>

          <!-- 菜单部分 -->
          <el-menu
            :default-active="activeIndex"
            @select="handleSelect"
            class="menu"
            :key="menuKey"
            background-color="rgba(28, 41, 79, 1)"
            text-color="#fff"
            active-text-color="#409eff"
          >
            <!-- 个人课表查看 -->
            <el-menu-item
              index="1"
              :class="{ 'is-active': activeIndex === '1' }"
            >
              <el-icon><schedule /></el-icon>
              <span>个人课表查看</span>
            </el-menu-item>

            <!-- 资源管理 -->
            <el-sub-menu index="2">
              <template #title>
                <el-icon><setting /></el-icon>
                <span>资源管理</span>
              </template>
              <el-menu-item index="2-1" :class="{ 'is-active': activeIndex === '2-1' }">
                教室预约
              </el-menu-item>
              <el-menu-item index="2-2" :class="{ 'is-active': activeIndex === '2-2' }">
                设备预约
              </el-menu-item>
              <el-menu-item index="2-3" :class="{ 'is-active': activeIndex === '2-3' }">
                租用记录
              </el-menu-item>
            </el-sub-menu>

            <!-- 教师偏好设置 -->
            <el-menu-item
              index="4"
              :class="{ 'is-active': activeIndex === '4' }"
            >
              <el-icon><setting /></el-icon>
              <span>教师偏好设置</span>
            </el-menu-item>
          </el-menu>
        </el-aside>
        <el-main>
          <!-- 动态切换内容 -->
          <component :is="currentComponent" @confirm="handleConfirm"></component>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue';
import Teaclass from '@/views/teacher/teamain/Teaclass.vue';
import ClassroomBooking from '@/views/teacher/teamain/ClassroomBooking.vue';
import EquipmentReservation from '@/views/teacher/teamain/EquipmentReservation.vue';
import RentalRecords from '@/views/teacher/teamain/RentalRecords.vue';
import ClassPreferences from '@/views/teacher/teamain/ClassPreferences.vue';

export default defineComponent({
  components: {
    Teaclass,
    ClassroomBooking,
    EquipmentReservation,
    RentalRecords,
    ClassPreferences,
  },
  setup() {
    const activeIndex = ref('1');
    const currentComponent = ref(Teaclass);
    const menuKey = ref(0);

    const handleSelect = (index) => {
      activeIndex.value = index;
      if (index === '1') {
        currentComponent.value = Teaclass;
      } else if (index === '2-1') {
        currentComponent.value = ClassroomBooking; // 示例：教室预约
      } else if (index === '2-2') {
        currentComponent.value = EquipmentReservation; // 示例：设备预约
      } else if (index === '2-3') {
        currentComponent.value = RentalRecords; // 示例：租用记录
      } else if (index === '4') {
        currentComponent.value = ClassPreferences; // 示例：教师偏好设置
      }
    };

    const handleConfirm = () => {
      // 点击 Information 确定按钮后，切换到 Stuclass
      currentComponent.value = Stuclass;
    };

    return {
      activeIndex,
      currentComponent,
      handleSelect,
      handleConfirm,
      menuKey,
    };
  },
});
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
  background-color: rgba(28, 41, 79, 1);
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
  background: linear-gradient(rgba(28, 41, 79), rgb(30, 43, 83));
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

.custom-avatar {
  width: 80px;
  height: 80px;
  line-height: 80px;
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
  background: rgba(222, 234, 251, 1);
  color: #333;
  padding: 20px;
  flex: 1;
  overflow: auto;
}

.menu {
  border-right: none;
  background-color: rgba(28, 41, 79, 1);
}

.menu .el-menu-item {
  color: #fff;
  font-size: 16px;
  font-weight: normal;
  background-color: rgba(28, 41, 79, 1);
}

.menu .el-menu-item.is-active {
  background-color: rgba(39, 63, 129, 1);
}

.menu .el-menu-item:hover {
  background-color: rgba(39, 63, 129, 1);
}

.menu .el-sub-menu__title {
  color: #fff;
  font-size: 16px;
  font-weight: normal;
  background-color: rgba(28, 41, 79, 1);
}

.menu .el-sub-menu__title:hover {
  background-color: rgba(39, 63, 129, 1);
}

.menu .el-sub-menu__title.is-active {
  background-color: rgba(39, 63, 129, 1);
}

.menu .el-sub-menu__content {
  background-color: rgba(28, 41, 79, 1);
}

.menu .el-sub-menu__content .el-menu-item {
  background-color: rgba(28, 41, 79, 1);
  color: #fff;
}

.menu .el-sub-menu__content .el-menu-item:hover {
  background-color: rgba(39, 63, 129, 1);
}

.menu .el-sub-menu__content .el-menu-item.is-active {
  background-color: rgba(39, 63, 129, 1);
}
</style>