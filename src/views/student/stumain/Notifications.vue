<template>
  <div class="notification-container">
    <el-container>
      <el-header class="gradient-bar">
        <h1 class="header-title">通知公告</h1>
      </el-header>
      <el-main class="main-content">
        <div class="card-grid">
          <el-card
            v-for="(notification, index) in notifications"
            :key="index"
            class="notification-card"
            :body-style="{ padding: '0px' }"
          >
            <div class="card-content">
              <h2 class="notification-title">{{ notification.title }}</h2>
              <p class="notification-type">{{ notification.type }}</p>
              <el-divider></el-divider>
              <p class="notification-message">{{ notification.message }}</p>
            </div>
          </el-card>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue';
import { ElCard, ElDivider, ElContainer, ElHeader, ElMain } from 'element-plus';

export default defineComponent({
  components: {
    ElCard,
    ElDivider,
    ElContainer,
    ElHeader,
    ElMain,
  },
  setup() {
    const notifications = ref([
      {
        title: '调课通知',
        type: '调课',
        message: '2024年2月15日，数学课调至下午3点。',
      },
      {
        title: '选课通知',
        type: '选课',
        message: '2024年春季选课系统已开放，请及时登录系统进行选课。',
      },
    ]);

    return {
      notifications,
    };
  },
});
</script>

<style scoped>
.notification-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.gradient-bar {
  background: linear-gradient(135deg, #2c3e90, #3498db);
  color: white;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: bold;
}

.main-content {
  padding: 20px;
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.notification-card {
  transition: transform 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  overflow: hidden;
}

.notification-card:hover {
  transform: translateY(-5px);
}

.card-content {
  padding: 20px;
}

.notification-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
}

.notification-type {
  color: #409eff;
  margin-bottom: 10px;
}

.notification-message {
  font-size: 14px;
  color: #666;
}

@media (max-width: 768px) {
  .card-grid {
    grid-template-columns: 1fr;
  }
}
</style>