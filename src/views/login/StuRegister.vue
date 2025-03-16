<template>
  <div class="register-container">
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
          <p>学生注册</p>
        </div>

        <form @submit.prevent="handleRegister" class="register-form">
          <!-- 姓名 -->
          <div class="form-group">
            <label for="name">姓名</label>
            <input
              id="name"
              v-model="name"
              type="text"
              placeholder="请输入您的姓名"
              @focus="focusInput('name')"
              @blur="blurInput('name')"
            />
            <span v-if="nameError" class="error-message">{{ nameError }}</span>
          </div>

          <!-- 学院 -->
          <div class="form-group">
            <label for="college">学院</label>
            <input
              id="college"
              v-model="college"
              type="text"
              placeholder="请输入您的学院"
              @focus="focusInput('college')"
              @blur="blurInput('college')"
            />
            <span v-if="collegeError" class="error-message">{{ collegeError }}</span>
          </div>

          <!-- 班级 -->
          <div class="form-group">
            <label for="class">班级</label>
            <input
              id="class"
              v-model="studentClass"
              type="text"
              placeholder="请输入您的班级"
              @focus="focusInput('class')"
              @blur="blurInput('class')"
            />
            <span v-if="classError" class="error-message">{{ classError }}</span>
          </div>

          <!-- 邮箱 -->
          <div class="form-group">
            <label for="email">邮箱</label>
            <input
              id="email"
              v-model="email"
              type="email"
              placeholder="请输入您的邮箱"
              @focus="focusInput('email')"
              @blur="blurInput('email')"
            />
            <span v-if="emailError" class="error-message">{{ emailError }}</span>
          </div>

          <!-- 密码 -->
          <div class="form-group">
            <label for="password">密码</label>
            <input
              id="password"
              v-model="password"
              type="password"
              placeholder="请输入密码"
              @focus="focusInput('password')"
              @blur="blurInput('password')"
            />
            <span v-if="passwordError" class="error-message">{{ passwordError }}</span>
          </div>

          <!-- 验证码 -->
          <div class="form-group">
            <label for="captcha">验证码</label>
            <div style="display: flex; align-items: center; gap: 10px;">
              <input
                id="captcha"
                v-model="captcha"
                type="text"
                placeholder="请输入邮箱验证码"
                @focus="focusInput('captcha')"
                @blur="blurInput('captcha')"
                style="flex: 1;"
              />
              <button @click.stop="sendCaptcha" :disabled="captchaButtonDisabled" class="captcha-button">
                {{ captchaButtonText }}
              </button>
            </div>
            <span v-if="captchaError" class="error-message">{{ captchaError }}</span>
          </div>

          <button type="submit" :disabled="isSubmitting || showSuccess" class="register-button">
            <span v-if="!isSubmitting && !showSuccess">注 册</span>
            <span v-else-if="isSubmitting">正在注册...</span>
            <span v-else>注册成功</span>
          </button>
        </form>

        <div class="login-link">
          已有账号？
          <button @click="navigateToLogin" class="login-button">去登录</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const name = ref('')
const email = ref('')
const password = ref('')
const college = ref('')
const studentClass = ref('')
const nameError = ref('')
const emailError = ref('')
const passwordError = ref('')
const collegeError = ref('')
const classError = ref('')
const captchaError = ref('')
const isSubmitting = ref(false)
const showSuccess = ref(false)
const captcha = ref('')
const captchaButtonDisabled = ref(false)
const captchaButtonText = ref('获取验证码')
const captchaTimer = ref(null)

const handleRegister = () => {
  nameError.value = ''
  emailError.value = ''
  passwordError.value = ''
  collegeError.value = ''
  classError.value = ''
  captchaError.value = ''

  if (!name.value.trim()) {
    nameError.value = '姓名不能为空'
    return
  }

  if (!email.value.trim()) {
    emailError.value = '邮箱不能为空'
    return
  }
  if (!isValidEmail(email.value)) {
    emailError.value = '请输入有效的邮箱地址'
    return
  }

  if (!password.value.trim()) {
    passwordError.value = '密码不能为空'
    return
  }
  if (password.value.length < 6) {
    passwordError.value = '密码至少需要6位'
    return
  }

  if (!college.value.trim()) {
    collegeError.value = '学院不能为空'
    return
  }

  if (!studentClass.value.trim()) {
    classError.value = '班级不能为空'
    return
  }

  if (!captcha.value.trim()) {
    captchaError.value = '验证码不能为空'
    return
  }

  // 模拟注册提交
  isSubmitting.value = true
  setTimeout(() => {
    console.log('Register attempt:', {
      name: name.value,
      email: email.value,
      password: password.value,
      college: college.value,
      class: studentClass.value
    })
    // 注册成功逻辑
    showSuccess.value = true
    isSubmitting.value = false
    // 这里可以添加跳转到登录页面的逻辑
    setTimeout(() => {
      router.push('/stulogin')
    }, 2000)
  }, 2000)
}

const navigateToLogin = () => {
  router.push('/stulogin')
}

const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

const focusInput = (type) => {
  if (type === 'name') {
    nameError.value = ''
  } else if (type === 'email') {
    emailError.value = ''
  } else if (type === 'password') {
    passwordError.value = ''
  } else if (type === 'college') {
    collegeError.value = ''
  } else if (type === 'class') {
    classError.value = ''
  } else if (type === 'captcha') {
    captchaError.value = ''
  }
}

const blurInput = (type) => {
  if (type === 'name' && !name.value.trim()) {
    nameError.value = '姓名不能为空'
  } else if (type === 'email' && !email.value.trim()) {
    emailError.value = '邮箱不能为空'
  } else if (type === 'email' && !isValidEmail(email.value)) {
    emailError.value = '请输入有效的邮箱地址'
  } else if (type === 'password' && !password.value.trim()) {
    passwordError.value = '密码不能为空'
  } else if (type === 'password' && password.value.length < 6) {
    passwordError.value = '密码至少需要6位'
  } else if (type === 'college' && !college.value.trim()) {
    collegeError.value = '学院不能为空'
  } else if (type === 'class' && !studentClass.value.trim()) {
    classError.value = '班级不能为空'
  } else if (type === 'captcha' && !captcha.value.trim()) {
    captchaError.value = '验证码不能为空'
  }
}

// 发送验证码逻辑
const sendCaptcha = () => {
  if (!email.value.trim()) {
    emailError.value = '邮箱不能为空'
    return
  }
  if (!isValidEmail(email.value)) {
    emailError.value = '请输入有效的邮箱地址'
    return
  }

  // 模拟发送验证码
  captchaButtonDisabled.value = true
  captchaButtonText.value = '发送中...'
  setTimeout(() => {
    // 模拟生成验证码
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let code = ''
    for (let i = 0; i < 4; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    storedCaptcha.value = code
    console.log('验证码已发送:', code)

    // 倒计时60秒
    let count = 60
    captchaButtonText.value = `${count}秒后重试`
    captchaTimer.value = setInterval(() => {
      count--
      if (count <= 0) {
        clearInterval(captchaTimer.value)
        captchaButtonDisabled.value = false
        captchaButtonText.value = '获取验证码'
      } else {
        captchaButtonText.value = `${count}秒后重试`
      }
    }, 1000)
  }, 2000)
}

const storedCaptcha = ref('')
</script>

<style scoped>
@import '@/style/global.css';

/* Base styles */
.register-container {
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
  max-width: 580px;
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
.register-form {
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

/* 按钮样式 */
.register-button {
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

.register-button:hover {
  background: #3157d5;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(65, 105, 225, 0.2);
}

.register-button:active {
  transform: translateY(0);
}

.register-button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

/* 登录链接样式 */
.login-link {
  text-align: center;
  margin-top: 1.5rem;
  color: #666;
}

.login-button {
  background: transparent;
  color: #4169e1;
  border: none;
  text-decoration: underline;
  cursor: pointer;
  font-weight: 500;
  margin-left: 0.5rem;
}

.login-button:hover {
  color: #3157d5;
}

/* 验证码按钮样式 */
.captcha-button {
  background: #4169e1;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 25px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.captcha-button:hover {
  background: #3157d5;
}

.captcha-button:disabled {
  background: #ccc;
  cursor: not-allowed;
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
}
</style>