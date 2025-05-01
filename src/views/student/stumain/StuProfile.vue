<template>
  <div class="personal-center">
    <div class="container">
      <div class="profile-card">
        <!-- Header with gradient background -->
        <div class="profile-header">
          <div class="profile-header-content">
            <div class="avatar-container">
              <img v-if="userProfile.avatar" :src="userProfile.avatar" alt="用户头像" class="avatar-image" />
              <div v-else class="avatar-placeholder">
                <span class="avatar-letter">{{ userProfile.name.charAt(0) }}</span>
              </div>
            </div>
            <div class="user-title">
              <h1 class="user-name">{{ userProfile.name }}</h1>
              <p class="user-college">{{ userProfile.college }}</p>
            </div>
          </div>
          
          <!-- Decorative elements -->
          <div class="decorative-circle large"></div>
          <div class="decorative-circle small"></div>
        </div>
        
        <!-- User info section -->
        <div class="profile-body">
          <div class="info-grid">
            <div class="info-column">
              <div class="info-card">
                <div class="info-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" class="icon" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
                  </svg>
                </div>
                <div>
                  <label class="info-label">姓名</label>
                  <div class="info-value">{{ userProfile.name }}</div>
                </div>
              </div>
              
              <div class="info-card">
                <div class="info-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" class="icon" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                  </svg>
                </div>
                <div>
                  <label class="info-label">学院</label>
                  <div class="info-value">{{ userProfile.college }}</div>
                </div>
              </div>
              
              <div class="info-card">
                <div class="info-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" class="icon" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                  </svg>
                </div>
                <div>
                  <label class="info-label">班级</label>
                  <div class="info-value">{{ userProfile.class }}</div>
                </div>
              </div>
            </div>
            
            <div class="info-column">
              <div class="info-card">
                <div class="info-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" class="icon" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd" />
                  </svg>
                </div>
                <div>
                  <label class="info-label">年级</label>
                  <div class="info-value">{{ userProfile.grade }}</div>
                </div>
              </div>
              
              <div class="info-card">
                <div class="info-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" class="icon" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                </div>
                <div>
                  <label class="info-label">邮箱</label>
                  <div class="info-value">{{ userProfile.email }}</div>
                </div>
              </div>
              
              <div class="info-card">
                <div class="info-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" class="icon" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
                  </svg>
                </div>
                <div>
                  <label class="info-label">密码</label>
                  <div class="info-value">••••••••</div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Action buttons -->
          <div class="action-container">
            <button 
              @click="showPasswordModal = true" 
              class="password-button"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="button-icon" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M18 8a6 6 0 01-7.743 5.743L10 14l-1 1-1 1H6v-1l1-1 1-1-.257-.257A6 6 0 1118 8zm-6-4a1 1 0 100 2 2 2 0 012 2 1 1 0 102 0 4 4 0 00-4-4z" clip-rule="evenodd" />
              </svg>
              修改密码
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Password Modal -->
    <div v-if="showPasswordModal" class="modal-overlay">
      <div class="modal-container" :class="{ 'animate-modal-in': showPasswordModal }">
        <div class="modal-header">
          <h2 class="modal-title">
            <svg xmlns="http://www.w3.org/2000/svg" class="modal-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
            修改密码
          </h2>
        </div>
        <form @submit.prevent="updatePassword" class="modal-form">
          <div class="form-group">
            <label class="form-label" for="current-password">当前密码</label>
            <input 
              type="password" 
              id="current-password" 
              v-model="passwordForm.currentPassword"
              class="form-input"
              required
            />
          </div>
          <div class="form-group">
            <label class="form-label" for="new-password">新密码</label>
            <input 
              type="password" 
              id="new-password" 
              v-model="passwordForm.newPassword"
              class="form-input"
              required
            />
          </div>
          <div class="form-group">
            <label class="form-label" for="confirm-password">确认新密码</label>
            <input 
              type="password" 
              id="confirm-password" 
              v-model="passwordForm.confirmPassword"
              class="form-input"
              required
            />
          </div>
          <div v-if="passwordMessage" class="message" :class="passwordError ? 'error' : 'success'">
            {{ passwordMessage }}
          </div>
          <div class="form-actions">
            <button 
              type="button" 
              @click="closePasswordModal"
              class="cancel-button"
            >
              取消
            </button>
            <button 
              type="submit" 
              class="submit-button"
              :disabled="isSubmitting"
            >
              {{ isSubmitting ? '提交中...' : '确认修改' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';

// Mock user data
const userProfile = reactive({
  name: '罗景康',
  college: '信息智能工程学院',
  grade: '2024级',
  class: '计算机网络技术2班',
  email: '2849173390@qq.com',
  avatar: null
});

// Password form state
const passwordForm = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
});

const isSubmitting = ref(false);
const passwordMessage = ref('');
const passwordError = ref(false);
const showPasswordModal = ref(false);

// Close password modal and reset form
const closePasswordModal = () => {
  showPasswordModal.value = false;
  passwordForm.currentPassword = '';
  passwordForm.newPassword = '';
  passwordForm.confirmPassword = '';
  passwordMessage.value = '';
};

// Update password function
const updatePassword = async () => {
  // Reset message
  passwordMessage.value = '';
  passwordError.value = false;
  
  // Validate passwords
  if (passwordForm.newPassword !== passwordForm.confirmPassword) {
    passwordMessage.value = '新密码与确认密码不匹配';
    passwordError.value = true;
    return;
  }
  
  try {
    isSubmitting.value = true;
    
    // Simulate API call with timeout
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Here you would normally make an API call to update the password
    // For example:
    // const response = await api.updatePassword({
    //   currentPassword: passwordForm.currentPassword,
    //   newPassword: passwordForm.newPassword
    // });
    
    // Success message
    passwordMessage.value = '密码已成功更新';
    
    // Close modal after success (optional)
    setTimeout(() => {
      closePasswordModal();
    }, 2000);
    
  } catch (error) {
    // Error handling
    passwordMessage.value = '更新密码时出错: ' + (error.message || '未知错误');
    passwordError.value = true;
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<style scoped>
/* Base styles */
.personal-center {
  background-color: #f9fafb;
  min-height: 75vh;
  padding: 2rem 1rem;
  max-width: 1600px;
}

.container {
  max-width: 1600px;
  margin: 0 auto;
}

/* Profile card */
.profile-card {
  max-width: 1200px;
  margin: 0 auto;
  background-color: #ffffff;
  border-radius: 1rem;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  overflow: hidden;
  transition: transform 0.3s ease;
}

.profile-card:hover {
  transform: translateY(-5px);
}

/* Profile header */
.profile-header {
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  padding: 1.5rem 2rem;
  color: white;
  position: relative;
  overflow: hidden;
}

.profile-header-content {
  display: flex;
  align-items: center;
  position: relative;
  z-index: 2;
}

.avatar-container {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  overflow: hidden;
  border: 4px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  background-color: #60a5fa;
}

.avatar-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #60a5fa;
}

.avatar-letter {
  color: white;
  font-size: 2.5rem;
  font-weight: 300;
}

.user-title {
  margin-left: 1.5rem;
}

.user-name {
  font-size: 2rem;
  font-weight: 700;
  margin: 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.user-college {
  color: rgba(255, 255, 255, 0.9);
  margin-top: 0.25rem;
  font-size: 1rem;
}

/* Decorative elements */
.decorative-circle {
  position: absolute;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
}

.decorative-circle.large {
  width: 200px;
  height: 200px;
  bottom: -100px;
  right: -50px;
}

.decorative-circle.small {
  width: 80px;
  height: 80px;
  top: -20px;
  right: 50px;
}

/* Profile body */
.profile-body {
  padding: 2.5rem;
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
}

@media (min-width: 768px) {
  .info-grid {
    grid-template-columns: 1fr 1fr;
  }
}

.info-column {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* Info cards */
.info-card {
  display: flex;
  align-items: center;
  padding: 1.25rem;
  border-radius: 0.75rem;
  background-color: #f8fafc;
  border: 1px solid #e2e8f0;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.info-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  background: linear-gradient(to bottom, #3b82f6, #60a5fa);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.info-card:hover {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  transform: translateY(-3px);
  border-color: #cbd5e1;
}

.info-card:hover::before {
  opacity: 1;
}

.info-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3rem;
  height: 3rem;
  border-radius: 0.75rem;
  background-color: #dbeafe;
  color: #3b82f6;
  margin-right: 1.25rem;
  transition: all 0.3s ease;
}

.info-card:hover .info-icon {
  background-color: #bfdbfe;
  color: #2563eb;
  transform: scale(1.05);
}

.icon {
  width: 1.25rem;
  height: 1.25rem;
}

.info-label {
  font-size: 0.75rem;
  color: #64748b;
  margin-bottom: 0.25rem;
  display: block;
}

.info-value {
  font-weight: 600;
  color: #1e293b;
  font-size: 1rem;
}

/* Action buttons */
.action-container {
  margin-top: 3rem;
  display: flex;
  justify-content: center;
}

.password-button {
  display: flex;
  align-items: center;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.password-button:hover {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  transform: translateY(-2px);
}

.password-button:active {
  transform: translateY(0);
}

.button-icon {
  width: 1.25rem;
  height: 1.25rem;
  margin-right: 0.5rem;
}

/* Modal styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
  padding: 1rem;
}

.modal-container {
  background-color: white;
  border-radius: 1rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  max-width: 500px;
  width: 100%;
  overflow: hidden;
}

.modal-header {
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  padding: 1.5rem;
  color: white;
}

.modal-title {
  display: flex;
  align-items: center;
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
}

.modal-icon {
  width: 1.5rem;
  height: 1.5rem;
  margin-right: 0.5rem;
}

.modal-form {
  padding: 1.5rem;
}

.form-group {
  margin-bottom: 1.25rem;
}

.form-label {
  display: block;
  font-size: 1.1rem;
  font-weight: 1000;
  color: #273e60;
  margin-bottom: 0.5rem;
}

.form-input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid #72a2d3;
  border-radius: 1.2rem;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.form-input:focus {
  outline: none;
  border-color: #1450b1;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
}

.message {
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  margin-bottom: 1.25rem;
}

.message.success {
  background-color: #ecfdf5;
  color: #047857;
}

.message.error {
  background-color: #fef2f2;
  color: #b91c1c;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
}

.cancel-button {
  padding: 0.75rem 1rem;
  background-color: white;
  border: 1px solid #d1d5db;
  color: #4b5563;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.cancel-button:hover {
  background-color: #f9fafb;
}

.submit-button {
  padding: 0.75rem 1rem;
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.submit-button:hover {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.submit-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

/* Animation */
@keyframes modalIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.animate-modal-in {
  animation: modalIn 0.3s ease-out forwards;
}
</style>