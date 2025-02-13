<template>
  <div class="login-container">
    <div class="gradient-overlay"></div>

    <div class="content-card">
      <div class="header">
        <h1>爱排课 Alpick</h1>
        <p>让每一节课都恰逢其时</p>
      </div>

      <div class="button-group">
        <router-link
          v-for="(role, index) in roles"
          :key="index"
          :to="role.path"
          class="button"
        >
          {{ role.label }}
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const roles = [
  { label: '我是学生', value: 'student', path: '/stulogin' },
  { label: '我是教师', value: 'teacher', path: '/tealogin' },
  { label: '我是管理员', value: 'admin', path: '/adminlogin' },
]
</script>

<style scoped>
@import '@/style/global.css';

.login-container {
  min-height: 100vh;
  min-width: 100vw;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  background-image: url('@/assets/home.png');
  background-size: cover;
  background-position: center;
}

.gradient-overlay {
  position: absolute;
  inset: 0;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(2px);
}

.content-card {
  position: relative;
  z-index: 10;
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 1rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
  padding: 2rem;
  width: 100%;
  max-width: 28rem;
  margin: 0 1rem;
  transition: all 0.3s ease;
}

.content-card:hover {
  transform: scale(1.02);
}

.header {
  text-align: center;
  margin-bottom: 2rem;
}

.header h1 {
  font-size: 2.7rem;
  font-weight: bold;
  color: rgba(74, 136, 231, 1);
  margin-bottom: 0.5rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
  background: linear-gradient(45deg, #4a88e7, #8a58e8);
  -webkit-background-clip: text;
  color: transparent;
  letter-spacing: 1px;
  line-height: 1.2;
  font-family: 'AlimamaShuHeiTi', sans-serif;
}

.header p {
  color: rgba(74, 136, 231, 1);
  font-family: 'ZCOOLXiaoWei', sans-serif;
  font-size: 1.8rem;
}

.button-group {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.button {
  width: 100%;
  padding: 1rem 1.5rem;
  background-color: rgba(74, 136, 231, 1);
  color: white;
  border: none;
  border-radius: 2rem;
  font-size: 1.125rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
  text-decoration: none;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.button::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.3);
  z-index: -1;
  transition: transform 0.3s ease;
  transform: scaleX(0);
  transform-origin: left;
}

.button:hover::before {
  transform: scaleX(1);
}

.button:hover {
  background-color: #1d4ed8;
  transform: scale(1.02);
}

.button:focus {
  outline: none;
  ring: 2px solid #2563eb;
  ring-offset: 2px;
}

@media (max-width: 640px) {
  .content-card {
    margin: 1rem;
    padding: 1.5rem;
  }

  .header h1 {
    font-size: 1.25rem;
  }

  .header p {
    font-size: 1rem;
  }

  .button {
    padding: 0.75rem;
    font-size: 1rem;
  }
}
</style>