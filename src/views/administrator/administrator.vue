<template>
    <div class="landing-page">
      <!-- Animated particles background -->
      <div class="particles" ref="particles"></div>
      
      <!-- Header -->
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
  
      <!-- Main content -->
      <main class="main-content">
        <div class="secure-label">管理员界面</div>
        
        <h1 class="title">
          <span>欢迎使用智慧排课系统</span>
          <span class="highlight">爱排课 AIpick</span>
        </h1>
  
        <p class="description">
          Welcome, Administrator! Our intelligent AI scheduling system makes course arrangement easy and efficient.
        </p>
  
        <div class="buttons">
          <button class="primary-btn" @click="goToCourseSelection">
            开始使用AI排课
            <i class="arrow-icon">→</i>
          </button>
          <button class="secondary-btn" @click="goToViewSchedule">
            查看已有课表
          </button>
        </div>
      </main>
  
      <!-- Wave background -->
      <div class="wave"></div>
    </div>
  </template>
  
  <script setup>
  import { onMounted, ref } from 'vue'
  import { useRouter } from 'vue-router'
  
  const particles = ref(null)
  const router = useRouter()
  
  onMounted(() => {
    createParticles()
  })
  
  // 跳转到课程选择页面
  const goToCourseSelection = () => {
    router.push('/administratorpick') // 直接使用路径
  }
  
  // 跳转到查看课表页面
  const goToViewSchedule = () => {
    router.push('/administratorclass') // 直接使用路径
  }
  
  function createParticles() {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    particles.value.appendChild(canvas)
  
    let width = particles.value.offsetWidth
    let height = particles.value.offsetHeight
  
    canvas.width = width
    canvas.height = height
  
    const particlesArray = []
    const numberOfParticles = 50
  
    class Particle {
      constructor() {
        this.x = Math.random() * width
        this.y = Math.random() * height
        this.size = Math.random() * 8 + 1
        this.speedX = Math.random() * 1 - 0.5
        this.speedY = Math.random() * 1 - 0.5
        this.opacity = Math.random() * 0.5 + 0.2
      }
  
      update() {
        this.x += this.speedX
        this.y += this.speedY
  
        if (this.x > width) this.x = 0
        if (this.x < 0) this.x = width
        if (this.y > height) this.y = 0
        if (this.y < 0) this.y = height
      }
  
      draw() {
        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fill()
      }
    }
  
    function init() {
      for (let i = 0; i < numberOfParticles; i++) {
        particlesArray.push(new Particle())
      }
    }
  
    function animate() {
      ctx.clearRect(0, 0, width, height)
      for (let particle of particlesArray) {
        particle.update()
        particle.draw()
      }
      requestAnimationFrame(animate)
    }
  
    init()
    animate()
  
    window.addEventListener('resize', () => {
      width = particles.value.offsetWidth
      height = particles.value.offsetHeight
      canvas.width = width
      canvas.height = height
    })
  }
  </script>
  
  <style scoped>
  .landing-page {
    min-height: 100vh;
    background: linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%);
    position: relative;
    overflow: hidden;
    color: white;
    font-family: system-ui, -apple-system, sans-serif;
  }
  
  .particles {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
  }
  
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
    
  .main-content {
    position: relative;
    z-index: 2;
    max-width: 1200px;
    margin: 0 auto;
    margin-top: 80px;
    padding: 4rem 2rem;
    text-align: center;
  }
  
  .secure-label {
    display: inline-block;
    background: rgba(255, 255, 255, 0.1);
    padding: 0.5rem 1rem;
    border-radius: 1rem;
    font-size: 0.875rem;
    margin-bottom: 2rem;
    animation: fadeInDown 0.6s ease;
  }
  
  .title {
    font-size: 3.5rem;
    font-weight: 700;
    line-height: 1.2;
    margin-bottom: 1.5rem;
    animation: fadeInUp 0.6s ease 0.2s both;
  }
  
  .title span {
    display: block;
  }
  
  .highlight {
    background: linear-gradient(90deg, #60a5fa, #93c5fd);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  
  .description {
    font-size: 1.25rem;
    color: rgba(255, 255, 255, 0.9);
    max-width: 36rem;
    margin: 0 auto 3rem;
    line-height: 1.6;
    animation: fadeInUp 0.6s ease 0.4s both;
  }
  
  .buttons {
    display: flex;
    gap: 1rem;
    justify-content: center;
    animation: fadeInUp 0.6s ease 0.6s both;
  }
  
  .primary-btn {
    background: white;
    color: #1e3a8a;
    padding: 1rem 2rem;
    border-radius: 0.5rem;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    transition: all 0.3s ease;
    border: none;
    cursor: pointer;
  }
  
  .primary-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
  
  .secondary-btn {
    background: rgba(255, 255, 255, 0.1);
    color: white;
    padding: 1rem 2rem;
    border-radius: 0.5rem;
    font-weight: 600;
    transition: all 0.3s ease;
    border: none;
    cursor: pointer;
  }
  
  .secondary-btn:hover {
    background: rgba(255, 255, 255, 0.2);
  }
  
  .wave {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 300px;
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 320'%3E%3Cpath fill='%23000' fill-opacity='0.2' d='M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,112C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z'%3E%3C/path%3E%3C/svg%3E");
    background-size: cover;
    background-repeat: no-repeat;
    animation: waveMove 20s linear infinite;
  }
  
  @keyframes waveMove {
    0% {
      background-position-x: 0;
    }
    100% {
      background-position-x: 100%;
    }
  }
  
  @keyframes fadeInDown {
    from {
      opacity: 0;
      transform: translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @media (max-width: 768px) {
    .title {
      font-size: 2.5rem;
    }
    
    .description {
      font-size: 1rem;
    }
    
    .buttons {
      flex-direction: column;
    }
    
    .primary-btn,
    .secondary-btn {
      width: 100%;
    }
  }
</style>