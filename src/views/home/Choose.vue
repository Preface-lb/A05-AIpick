<template>
  <div class="login-container">
    <!-- Abstract background elements -->
    <div class="background-elements">
      <div class="circle circle-1"></div>
      <div class="circle circle-2"></div>
      <div class="circle circle-3"></div>
      <div class="wave wave-1"></div>
      <div class="wave wave-2"></div>
    </div>

    <!-- Floating particles -->
    <div class="particles">
      <div v-for="n in 20" :key="n" class="particle" 
           :style="{ 
             left: `${Math.random() * 100}%`, 
             top: `${Math.random() * 100}%`,
             animationDelay: `${Math.random() * 5}s`,
             opacity: 0.1 + Math.random() * 0.4
           }">
      </div>
    </div>

    <!-- Main content card -->
    <div class="content-wrapper">
      <div class="content-card">
        <div class="logo-container">
          <div class="logo-icon">
            <!-- 替换为PNG图片 -->
            <img src="@/assets/logo.png" alt="Logo" class="logo-img">
          </div>
        </div>
        
        <div class="header">
          <h1>爱排课 Alpick</h1>
          <p>让每一节课都恰逢其时</p>
        </div>

        <div class="divider">
          <span></span>
          <div class="divider-text">选择您的身份</div>
          <span></span>
        </div>

        <div class="button-group">
          <router-link
            v-for="(role, index) in roles"
            :key="index"
            :to="role.path"
            class="button"
          >
            <span class="button-icon">
              <svg v-if="role.value === 'student'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                <path d="M2 17l10 5 10-5M2 12l10 5 10-5"></path>
              </svg>
              <svg v-if="role.value === 'teacher'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M18 8h1a4 4 0 0 1 0 8h-1"></path>
                <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path>
                <line x1="6" y1="1" x2="6" y2="4"></line>
                <line x1="10" y1="1" x2="10" y2="4"></line>
                <line x1="14" y1="1" x2="14" y2="4"></line>
              </svg>
              <svg v-if="role.value === 'admin'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
            </span>
            <span class="button-text">{{ role.label }}</span>
          </router-link>
        </div>

        <div class="footer">
          <p>© {{ new Date().getFullYear() }} 爱排课 Alpick. 版权所有</p>
        </div>
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

/* Base styles */
.login-container {
  min-height: 100vh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4ecfb 100%);
  font-family: 'Inter', 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif;
}

/* Background elements */
.background-elements {
  position: absolute;
  inset: 0;
  overflow: hidden;
  z-index: 0;
}

.circle {
  position: absolute;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(37, 99, 235, 0.2) 100%);
}

.circle-1 {
  width: 60vw;
  height: 60vw;
  top: -20vw;
  right: -20vw;
  animation: float 15s ease-in-out infinite;
}

.circle-2 {
  width: 40vw;
  height: 40vw;
  bottom: -15vw;
  left: -15vw;
  animation: float 18s ease-in-out infinite reverse;
}

.circle-3 {
  width: 25vw;
  height: 25vw;
  top: 60%;
  right: -5vw;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(37, 99, 235, 0.1) 100%);
  animation: float 20s ease-in-out infinite;
}

.wave {
  position: absolute;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(37, 99, 235, 0.1) 100%);
  border-radius: 43%;
}

.wave-1 {
  width: 200vw;
  height: 200vw;
  bottom: -180vw;
  left: -50vw;
  opacity: 0.3;
  animation: wave 25s linear infinite;
}

.wave-2 {
  width: 200vw;
  height: 200vw;
  bottom: -180vw;
  left: -50vw;
  opacity: 0.2;
  animation: wave 30s linear infinite reverse;
}

/* Floating particles */
.particles {
  position: absolute;
  inset: 0;
  z-index: 1;
}

.particle {
  position: absolute;
  width: 6px;
  height: 6px;
  background-color: rgba(59, 130, 246, 0.3);
  border-radius: 50%;
  animation: float-particle 8s ease-in-out infinite;
}

/* Content styles */
.content-wrapper {
  position: relative;
  z-index: 10;
  width: 100%;
  max-width: 420px;
  margin: 0 1.5rem;
  perspective: 1000px;
}

.content-card {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 1.5rem;
  box-shadow: 
    0 10px 15px -3px rgba(0, 0, 0, 0.05),
    0 4px 6px -2px rgba(0, 0, 0, 0.025),
    0 0 0 1px rgba(255, 255, 255, 0.8) inset,
    0 20px 25px -5px rgba(59, 130, 246, 0.05);
  padding: 2.5rem;
  width: 100%;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  transform: rotateX(0deg);
  border: 1px solid rgba(255, 255, 255, 0.8);
}

.content-card:hover {
  transform: translateY(-5px) rotateX(2deg);
  box-shadow: 
    0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04),
    0 0 0 1px rgba(255, 255, 255, 0.9) inset,
    0 30px 40px -5px rgba(59, 130, 246, 0.1);
}

/* Logo styles */
.logo-container {
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
}

.logo-icon {
  width: 60px;
  height: 60px;
  background: #2563eb;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 10px 15px -3px rgba(59, 130, 246, 0.3);
}

.logo-img {
  width: 55px;
  height: 55px;
}

/* Header styles */
.header {
  text-align: center;
  margin-bottom: 2rem;
}

.header h1 {
  font-size: 2.6rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  letter-spacing: -0.5px;
  font-family: 'ZPMDZ', sans-serif;
}



.header p {
  color: #64748b;
  font-size: 1.1rem;
  font-weight: 500;
  font-family: 'ZCOOLXiaoWei', sans-serif;
}

/* Divider styles */
.divider {
  display: flex;
  align-items: center;
  margin: 2rem 0;
}

.divider span {
  flex: 1;
  height: 1px;
  background: linear-gradient(to right, transparent, rgba(203, 213, 225, 0.7), transparent);
}

.divider-text {
  padding: 0 1rem;
  color: #64748b;
  font-size: 0.875rem;
  font-weight: 500;
}

/* Button styles */
.button-group {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
}

.button {
  display: flex;
  align-items: center;
  width: 100%;
  padding: 0.875rem 1.25rem;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  border: none;
  border-radius: 0.75rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.2), 0 2px 4px -1px rgba(59, 130, 246, 0.1);
}

.button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.7s ease;
}

.button:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 15px -3px rgba(59, 130, 246, 0.3), 0 4px 6px -2px rgba(59, 130, 246, 0.1);
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
}

.button:hover::before {
  left: 100%;
}

.button:active {
  transform: translateY(0);
}

.button-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  margin-right: 0.75rem;
}

.button-icon svg {
  width: 20px;
  height: 20px;
  stroke-width: 2;
}

.button-text {
  flex: 1;
  text-align: center;
}

/* Footer styles */
.footer {
  text-align: center;
  color: #94a3b8;
  font-size: 0.75rem;
}

/* Animations */
@keyframes float {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-20px) rotate(5deg);
  }
}

@keyframes wave {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@keyframes float-particle {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20px);
  }
}

/* Responsive styles */
@media (max-width: 640px) {
  .content-card {
    padding: 2rem 1.5rem;
  }

  .header h1 {
    font-size: 1.8rem;
  }

  .header p {
    font-size: 1rem;
  }

  .logo-icon {
    width: 50px;
    height: 50px;
  }

  .logo-img {
    width: 28px;
    height: 28px;
  }
}

@media (max-width: 400px) {
  .content-card {
    padding: 1.5rem 1.25rem;
  }

  .header h1 {
    font-size: 1.5rem;
  }

  .button {
    padding: 0.75rem 1rem;
  }
}
</style>