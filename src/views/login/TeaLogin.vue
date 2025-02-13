<template>
  <div class="login-container">
    <div class="login-card">
      <h1 class="login-title">爱排课 Alpick</h1>

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
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const username = ref('')
const password = ref('')
const usernameError = ref('')
const passwordError = ref('')
const isSubmitting = ref(false)

const handleLogin = () => {
  // 清空之前的错误信息
  usernameError.value = ''
  passwordError.value = ''

  // 校验用户名和密码
  if (!username.value.trim()) {
    usernameError.value = '用户名不能为空'
    return
  }
  if (!password.value.trim()) {
    passwordError.value = '密码不能为空'
    return
  }

  // 模拟登录提交
  isSubmitting.value = true
  setTimeout(() => {
    console.log('Login attempt:', {
      username: username.value,
      password: password.value,
    })
    isSubmitting.value = false
  }, 2000)
}

const focusInput = (type) => {
  if (type === 'username') {
    usernameError.value = ''
  } else if (type === 'password') {
    passwordError.value = ''
  }
}

const blurInput = (type) => {
  if (type === 'username' && !username.value.trim()) {
    usernameError.value = '用户名不能为空'
  } else if (type === 'password' && !password.value.trim()) {
    passwordError.value = '密码不能为空'
  }
}
</script>

<style scoped>
@import '@/style/global.css';

.login-container {
  min-height: 100vh;
  width: 100%;
  background-image: url('@/assets/home.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  position: relative;
  overflow: hidden;
}

.login-card {
  background: white;
  border-radius: 24px;
  padding: 2.5rem;
  width: 100%;
  max-width: 420px;
  position: relative;
  z-index: 1;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  animation: cardAppear 0.6s ease-out;
}

.login-title {
  font-size: 2.5rem;
  font-weight: bold;
  color: rgba(74, 136, 231, 1);
  margin-bottom: 0.5rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
  background: linear-gradient(45deg, #6ea4f4, #743ddb);
  -webkit-background-clip: text;
  color: transparent;
  letter-spacing: 1px;
  line-height: 1.2;
  font-family: 'AlimamaShuHeiTi', sans-serif;
  text-align: center;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
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

/* Animations */
@keyframes cardAppear {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive Design */
@media (max-width: 480px) {
  .login-card {
    padding: 2rem;
  }

  .login-title {
    font-size: 1.5rem;
  }
}
</style>