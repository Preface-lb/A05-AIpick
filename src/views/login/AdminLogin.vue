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
        
        <div class="header">
          <h1>爱排课 Alpick</h1>
          <p>让每一节课都恰逢其时</p>
        </div>

        <form @submit.prevent="handleLogin" class="login-form">
          <div class="form-group">
            <label>用户名</label>
            <input
              v-model="username"
              type="text"
              placeholder="请输入用户名"
              @focus="focusInput('username')"
              @blur="blurInput('username')"
            />
            <span v-if="usernameError" class="error-message">{{
              usernameError
            }}</span>
          </div>

          <div class="form-group">
            <label>密码</label>
            <input
              v-model="password"
              type="password"
              placeholder="请输入密码"
              @focus="focusInput('password')"
              @blur="blurInput('password')"
            />
            <span v-if="passwordError" class="error-message">{{
              passwordError
            }}</span>
          </div>
       <button type="submit" :disabled="isSubmitting">
            <span v-if="!isSubmitting">登 入</span>
            <span v-else>正在登录...</span>
          </button>
        </form>

   
        <div class="footer">
          <p>© {{ new Date().getFullYear() }} 爱排课 Alpick. 版权所有</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { adminLogin } from '@/api/admin-auth' 

const account = ref('') 
const password = ref('')
const accountError = ref('') 
const passwordError = ref('')
const isSubmitting = ref(false)

const handleLogin = async () => {
  // 清空之前的错误信息
  accountError.value = '' 
  passwordError.value = ''

  // 校验用户名和密码
  if (!account.value.trim()) { 
    accountError.value = '用户名不能为空' 
    return
  }
  if (!password.value.trim()) {
    passwordError.value = '密码不能为空'
    return
  }

  // 调用后端接口
  isSubmitting.value = true
  try {
    const response = await adminLogin({
      account: account.value, 
      password: password.value
    })
    console.log('登录成功:', response.data)
    
    
    let responseData
    try {
      responseData = JSON.parse(response.data)
    } catch (error) {
      console.error('解析 JSON 字符串失败:', error)
      throw new Error('解析登录响应失败')
    }
    
    
    console.log('解析后的数据:', responseData)
    
  } catch (error) {
    console.error('登录失败:', error)
    
    let errorMessage = '登录失败，请重试'
    if (error.response && error.response.data) {
      try {
        const errorData = JSON.parse(error.response.data)
        errorMessage = errorData.message || errorMessage
      } catch {
        errorMessage = error.response.data || errorMessage
      }
    }
    accountError.value = errorMessage 
  } finally {
    isSubmitting.value = false
  }
}

const focusInput = (type) => {
  if (type === 'account') { 
    accountError.value = '' 
  } else if (type === 'password') {
    passwordError.value = ''
  }
}

const blurInput = (type) => {
  if (type === 'account' && !account.value.trim()) { 
    accountError.value = '用户名不能为空' 
  } else if (type === 'password' && !password.value.trim()) {
    passwordError.value = '密码不能为空'
  }
}
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

/* Form styles */
.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  position: relative;
}

.form-group label {
  color: rgba(74, 136, 231, 1);
  font-size: 0.9rem;
  font-weight: 1000;
  letter-spacing: 0.5px;
  display: block;
}

.form-group input {
  padding: 0.75rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 30px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.9);
}

.form-group input:focus {
  outline: none;
  border-color: #4169e1;
  box-shadow: 0 0 0 4px rgba(65, 105, 225, 0.1);
}

.error-message {
  color: red;
  font-size: 0.8rem;
  position: absolute;
  bottom: -1.5rem;
  left: 0;
}

button {
  background: #4169e1;
  color: white;
  border: none;
  padding: 0.875rem;
  border-radius: 25px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 0.5rem;
}

button:hover {
  background: #3157d5;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(65, 105, 225, 0.2);
}

button:active {
  transform: translateY(0);
}

button:disabled {
  background: #ccc;
  cursor: not-allowed;
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