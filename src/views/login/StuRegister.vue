<template>
  <div class="register-container">
    <!-- 背景元素 -->
    <div class="background-elements">
      <div class="circle circle-1"></div>
      <div class="circle circle-2"></div>
      <div class="circle circle-3"></div>
      <div class="wave wave-1"></div>
      <div class="wave wave-2"></div>
    </div>

    <!-- 浮动粒子 -->
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

    <!-- 主内容卡片 -->
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

          <!-- 学院选择 -->
          <div class="form-group">
            <label for="college">学院</label>
            <div class="select-wrapper">
              <select
                id="college"
                v-model="selectedCollege"
                @click="handleCollegeClick"
                @change="handleCollegeChange"
                @focus="focusInput('college')"
                @blur="blurInput('college')"
              >
                <option value="">请选择学院</option>
                <option 
                  v-for="college in colleges" 
                  :key="college.id" 
                  :value="college.name">
                  {{ college.name }}
                </option>
              </select>
              <div class="select-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" 
                     viewBox="0 0 24 24" fill="none" stroke="currentColor" 
                     stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </div>
            </div>
            <span v-if="collegeError" class="error-message">{{ collegeError }}</span>
          </div>

          <!-- 年级输入 -->
          <div class="form-group">
            <label for="grade">年级</label>
            <input
              id="grade"
              v-model="grade"
              type="text"
              placeholder="请输入年级，如2024"
              @focus="focusInput('grade')"
              @blur="blurInput('grade')"
            />
            <span v-if="gradeError" class="error-message">{{ gradeError }}</span>
          </div>

          <!-- 班级选择 -->
          <div class="form-group">
            <label for="class">班级</label>
            <div class="select-wrapper">
              <select
                id="class"
                v-model="selectedClass"
                @focus="focusInput('class')"
                @blur="blurInput('class')"
                :disabled="!selectedCollege"
              >
                <option value="">请选择班级</option>
                <option 
                  v-for="cls in classes" 
                  :key="cls.id" 
                  :value="cls.name">
                  {{ cls.name }}
                </option>
              </select>
              <div class="select-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" 
                     viewBox="0 0 24 24" fill="none" stroke="currentColor" 
                     stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </div>
            </div>
            <span v-if="classError" class="error-message">{{ classError }}</span>
          </div>

          <!-- 邮箱 -->
          <div class="form-group">
            <label for="username">邮箱</label>
            <input
              id="username"
              v-model="username"
              type="username"
              placeholder="请输入您的邮箱"
              @focus="focusInput('username')"
              @blur="blurInput('username')"
            />
            <span v-if="usernameError" class="error-message">{{ usernameError }}</span>
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
              <button type="button" @click.prevent="sendTousername" 
                      :disabled="captchaButtonDisabled" class="captcha-button">
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
          <button type="button" @click="navigateToLogin" class="login-button">
            去登录
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { register, sendCaptcha, getColleges, getClassesByCollege } from '@/api/stu-register';

const router = useRouter();

// 表单数据
const name = ref('');
const username = ref('');
const password = ref('');
const captcha = ref('');
const selectedCollege = ref('');
const selectedClass = ref('');
const grade = ref(''); // 新增年级字段

// 错误信息
const nameError = ref('');
const usernameError = ref('');
const passwordError = ref('');
const collegeError = ref('');
const classError = ref('');
const captchaError = ref('');
const gradeError = ref(''); // 新增年级错误信息

// 验证码相关
const isSubmitting = ref(false);
const showSuccess = ref(false);
const captchaButtonDisabled = ref(false);
const captchaButtonText = ref('获取验证码');
let captchaTimer = null;

// 学院和班级列表
const colleges = ref([]);
const classes = ref([]);

const fetchColleges = async () => {
  try {
    const response = await getColleges();
    console.log('页面的的学院列表:', response);
    colleges.value = response;
  } catch (error) {
    console.error('获取学院列表失败:', error);
    colleges.value = [];
  }
};

// 点击学院下拉框时触发请求
const handleCollegeClick = () => {
  fetchColleges();
};

// 选中学院后获取对应班级列表（新增年级参数校验）
const handleCollegeChange = async () => {
  selectedClass.value = '';
  classes.value = [];
  
  // 新增：校验年级是否存在且格式正确
  const isValidGrade = /^\d{4}$/.test(grade.value.trim());
  if (!selectedCollege.value || !isValidGrade) return;

  try {
    // 假设 API 接收学院 ID 和年级两个参数（如：getClassesByCollege(collegeId, grade)）
    const response = await getClassesByCollege(selectedCollege.value, grade.value);
    classes.value = response;
  } catch (error) {
    console.error('获取班级列表失败:', error);
    classes.value = [];
  }
};

// 监听学院或年级变化，重新获取班级列表
watch(
  [selectedCollege, grade], // 监听两个响应式变量
  ([newCollege, newGrade]) => {
    if (newCollege && newGrade && /^\d{4}$/.test(newGrade.trim())) {
      handleCollegeChange(); // 触发班级获取
    } else {
      classes.value = []; // 清空班级列表（年级/学院无效时）
    }
  }
);

// 组件加载时自动请求学院数据
onMounted(() => {
  fetchColleges();
});

// 表单提交
const handleRegister = async () => {
  // 清空错误信息
  nameError.value = '';
  usernameError.value = '';
  passwordError.value = '';
  collegeError.value = '';
  classError.value = '';
  captchaError.value = '';
  gradeError.value = ''; // 清空年级错误信息

  // 简单校验
  if (!name.value.trim()) {
    nameError.value = '姓名不能为空';
    return;
  }
  if (!username.value.trim()) {
    usernameError.value = '邮箱不能为空';
    return;
  }
  if (!isValidusername(username.value)) {
    usernameError.value = '请输入有效的邮箱地址';
    return;
  }
  if (!password.value.trim()) {
    passwordError.value = '密码不能为空';
    return;
  }
  if (password.value.length < 6) {
    passwordError.value = '密码至少需要6位';
    return;
  }
  if (!selectedCollege.value) {
    collegeError.value = '请选择学院';
    return;
  }
  if (!grade.value.trim()) {
    gradeError.value = '请输入年级';
    return;
  }
  if (!isValidGrade(grade.value)) {
    gradeError.value = '请输入有效的年级，如2024';
    return;
  }
  if (!selectedClass.value) {
    classError.value = '请选择班级';
    return;
  }
  if (!captcha.value.trim()) {
    captchaError.value = '验证码不能为空';
    return;
  }

  isSubmitting.value = true;
  try {
    const response = await register({
      name: name.value,
      username: username.value,
      password: password.value,
      college: selectedCollege.value,
      grade: grade.value, // 添加年级字段
      studentClass: selectedClass.value,
      code: captcha.value,
    });
    showSuccess.value = true;
    setTimeout(() => {
      router.push('/stulogin');
    }, 2000);
  } catch (error) {
    console.error('注册失败:', error);
    if (error instanceof Error) {
      captchaError.value = error.message || '注册失败，请检查验证码或稍后重试';
    } else {
      captchaError.value = '注册失败，请稍后再试';
    }
  } finally {
    isSubmitting.value = false;
  }
};

const isValidusername = (username) => {
  const usernameRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return usernameRegex.test(username);
};

// 验证年级是否有效
const isValidGrade = (grade) => {
  // 简单验证是否为4位数字年份
  const gradeRegex = /^\d{4}$/;
  return gradeRegex.test(grade);
};

const focusInput = (type) => {
  if (type === 'name') nameError.value = '';
  else if (type === 'username') usernameError.value = '';
  else if (type === 'password') passwordError.value = '';
  else if (type === 'college') collegeError.value = '';
  else if (type === 'class') classError.value = '';
  else if (type === 'captcha') captchaError.value = '';
  else if (type === 'grade') gradeError.value = ''; // 添加年级字段处理
};

const blurInput = (type) => {
  if (type === 'name' && !name.value.trim()) {
    nameError.value = '姓名不能为空';
  } else if (type === 'username' && !username.value.trim()) {
    usernameError.value = '邮箱不能为空';
  } else if (type === 'username' && !isValidusername(username.value)) {
    usernameError.value = '请输入有效的邮箱地址';
  } else if (type === 'password' && !password.value.trim()) {
    passwordError.value = '密码不能为空';
  } else if (type === 'password' && password.value.length < 6) {
    passwordError.value = '密码至少需要6位';
  } else if (type === 'college' && !selectedCollege.value) {
    collegeError.value = '请选择学院';
  } else if (type === 'grade' && !grade.value.trim()) {
    gradeError.value = '请输入年级';
  } else if (type === 'grade' && !isValidGrade(grade.value)) {
    gradeError.value = '请输入有效的年级，如2024';
  } else if (type === 'class' && !selectedClass.value) {
    classError.value = '请选择班级';
  } else if (type === 'captcha' && !captcha.value.trim()) {
    captchaError.value = '验证码不能为空';
  }
};

const sendTousername = () => {
  if (!username.value.trim()) {
    usernameError.value = '邮箱不能为空';
    return;
  }
  if (!isValidusername(username.value)) {
    usernameError.value = '请输入有效的邮箱地址';
    return;
  }
  captchaButtonDisabled.value = true;
  captchaButtonText.value = '发送中...';
  sendCaptcha(username.value);
};
const navigateToLogin = () => {
  router.push('/stulogin');
};
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
  border-radius: 5rem;
  box-shadow: 
    0 10px 15px -3px rgba(0, 0, 0, 0.05),
    0 4px 6px -2px rgba(0, 0, 0, 0.025),
    0 0 0 1px rgba(255, 255, 255, 0.8) inset,
    0 20px 25px -5px rgba(59, 130, 246, 0.05);
  padding: 1.2rem;
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
  margin-bottom: 0.5rem;
}

.header h1 {
  font-size: 2rem;
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
  font-size: 1rem;
  font-weight: 500;
  font-family: 'ZCOOLXiaoWei', sans-serif;
}

/* Form styles */
.register-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 0.5rem;
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

.form-group input,
.form-group select {
  padding: 0.75rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 30px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.9);
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: #4169e1;
  box-shadow: 0 0 0 4px rgba(65, 105, 225, 0.1);
}

/* 增强的下拉菜单样式 */
.select-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.select-wrapper select {
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  width: 100%;
  padding-right: 2.5rem;
  cursor: pointer;
  color: #4a5568;
  background: rgba(255, 255, 255, 0.9);
  border: 2px solid #e5e7eb;
  border-radius: 30px;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.select-wrapper select:focus {
  outline: none;
  border-color: #4169e1;
  box-shadow: 0 0 0 4px rgba(65, 105, 225, 0.1);
}

.select-wrapper select option {
  background: white;
  color: #4a5568;
  padding: 10px;
}

.select-icon {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  color: #4169e1;
  transition: transform 0.3s ease;
}

.select-wrapper select:focus + .select-icon {
  transform: translateY(-50%) rotate(180deg);
}

/* 下拉菜单悬停效果 */
.select-wrapper:hover select {
  border-color: #4169e1;
}

.select-wrapper:hover .select-icon {
  color: #3157d5;
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