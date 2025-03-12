<template>
  <div class="container">
    <div class="glass-card">
      <h2 class="dynamic-title">
        <span class="title-text">学生信息登记</span>
        <div class="title-decoration"></div>
      </h2>

      <el-form :model="form" class="neon-form">
        <!-- 姓名输入 -->
        <div class="input-group">
          <el-input
            v-model="form.name"
            placeholder="张三"
            class="gradient-input"
            :prefix-icon="User"
          />
          <div class="input-highlight"></div>
        </div>

        <!-- 学院输入 -->
        <div class="input-group">
          <el-input
            v-model="form.college"
            placeholder="计算机学院"
            class="gradient-input"
            :prefix-icon="OfficeBuilding"
          />
          <div class="input-highlight"></div>
        </div>

        <!-- 班级输入 -->
        <div class="input-group">
          <el-input
            v-model="form.className"
            placeholder="2023级1班"
            class="gradient-input"
            :prefix-icon="Notebook"
          />
          <div class="input-highlight"></div>
        </div>

        <el-button type="primary" class="holographic-btn" @click="confirmInfo">
          提交信息
        </el-button>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { User, OfficeBuilding, Notebook } from '@element-plus/icons-vue'

const emit = defineEmits(['confirm'])

const form = reactive({
  name: '',
  college: '',
  className: '',
})

const confirmInfo = () => {
  if (form.name && form.college && form.className) {
    emit('confirm')
  } else {
    alert('请填写完整信息！')
  }
}
</script>

<style lang="scss" scoped>
.container {
  min-height: 80vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
}

.glass-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(12px);
  border-radius: 20px;
  padding: 2.5rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 480px;
  position: relative;
  overflow: hidden;
}

.dynamic-title {
  font-size: 2rem;
  color: #2d3748;
  margin-bottom: 2rem;
  position: relative;
  text-align: center;
}

.title-decoration {
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 3px;
  background: linear-gradient(90deg, #667eea, #764ba2);
}

.input-group {
  margin-bottom: 1.5rem;
  position: relative;
}

.gradient-input {
  width: 100%;
  :deep(.el-input__wrapper) {
    background-color: rgba(255, 255, 255, 0.9);
    border-radius: 12px;
    padding: 0.8rem 1.2rem;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
  }

  :deep(.el-input__inner) {
    color: #2d3748;
    font-size: 1rem;
  }
}

.holographic-btn {
  width: 100%;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border: none;
  padding: 1rem;
  border-radius: 12px;
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: linear-gradient(
      45deg,
      rgba(255, 255, 255, 0.1) 25%,
      transparent 50%,
      rgba(255, 255, 255, 0.1) 75%
    );
    transform: rotate(45deg);
    animation: holographic 3s infinite linear;
  }
}

@keyframes holographic {
  0% {
    transform: translateX(-100%) rotate(45deg);
  }
  100% {
    transform: translateX(100%) rotate(45deg);
  }
}

.input-highlight {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background: linear-gradient(90deg, #667eea, #764ba2);
  transition: width 0.3s ease;
}

.gradient-input:focus-within + .input-highlight {
  width: 100%;
}
</style>