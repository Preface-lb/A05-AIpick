<template>
  <div class="weight-config-container">
    <div class="weight-header">
      <div class="weight-title">权重配置</div>
      <div class="weight-subtitle">调整各项指标的权重比例</div>
    </div>
    
    <div class="weight-items-container">
      <!-- 循环渲染每个权重项 -->
      <div 
        class="weight-item" 
        v-for="(item, index) in weights" 
        :key="index"
        :class="{ 'weight-item-active': activeIndex === index }"
      >
        <!-- 左侧标题和图标 -->
        <div class="weight-label">
          <div class="weight-icon">
            <div class="icon-inner" :style="{ backgroundColor: getColor(index) }">
              {{ item.label.charAt(0) }}
            </div>
          </div>
          <span>{{ item.label }}</span>
        </div>

        <!-- 中间滑块 -->
        <div class="weight-slider">
          <!-- 用 input type="range" 作为滑块 -->
          <input
            type="range"
            min="0"
            max="100"
            step="1"
            v-model="item.value"
            @input="handleInputChange(index)"
            @focus="activeIndex = index"
            @blur="activeIndex = null"
          />
          <!-- 背景轨道 -->
          <div class="slider-track">
            <!-- 已填充部分，宽度与权重值绑定 -->
            <div 
              class="slider-filled" 
              :style="{ 
                width: item.value + '%',
                backgroundColor: getColor(index)
              }"
            ></div>
          </div>
        </div>

        <!-- 右侧显示当前百分比 -->
        <div class="weight-value" :style="{ color: getColor(index) }">
          {{ item.value }}<span class="percent">%</span>
        </div>
      </div>
    </div>

    <!-- 总计显示 -->
    <div class="weight-total" :class="{ 'weight-total-invalid': totalWeight !== 100 }">
      <span>总计:</span>
      <span class="total-value">{{ totalWeight }}%</span>
      <span v-if="totalWeight !== 100" class="total-warning">
        (权重总和应为100%)
      </span>
    </div>

    <!-- 按钮区 -->
    <div class="button-group">
      <button class="auto-balance-btn" @click="autoBalance" :disabled="isBalancing">
        <span class="btn-icon">⟳</span>
        <span>自动平衡</span>
      </button>
      <button 
        class="save-btn" 
        @click="saveConfig" 
        :disabled="totalWeight !== 100 || isBalancing"
      >
        <span class="btn-icon">✓</span>
        <span>保存配置</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';

// 定义权重数据
const weights = ref([
  { label: '教师工作时长均衡', value: 35 },
  { label: '教室资源利用率', value: 30 },
  { label: '课程优先级权重', value: 25 },
  { label: '人性化系数', value: 10 }
]);

// 跟踪当前活动的滑块索引
const activeIndex = ref(null);
const isBalancing = ref(false);

// 计算总权重
const totalWeight = computed(() => {
  return weights.value.reduce((sum, item) => sum + Number(item.value), 0);
});

// 获取每个项目的颜色
const getColor = (index) => {
  const colors = [
    '#1976D2', // 深蓝色
    '#2196F3', // 蓝色
    '#42A5F5', // 浅蓝色
    '#64B5F6'  // 更浅的蓝色
  ];
  return colors[index % colors.length];
};

// 滑块变化时的回调
const handleInputChange = (index) => {
  // 确保值是数字
  weights.value[index].value = Number(weights.value[index].value);
  
  // 如果总和超过100，调整其他值
  if (totalWeight.value > 100) {
    const excess = totalWeight.value - 100;
    const otherIndices = Array.from({ length: weights.value.length }, (_, i) => i).filter(i => i !== index);
    
    // 按比例分配超出部分
    let remaining = excess;
    for (const i of otherIndices) {
      if (weights.value[i].value > 0) {
        const reduction = Math.min(weights.value[i].value, Math.ceil(excess * weights.value[i].value / (totalWeight.value - weights.value[index].value)));
        weights.value[i].value = Math.max(0, weights.value[i].value - reduction);
        remaining -= (reduction);
        if (remaining <= 0) break;
      }
    }
  }
};

// 自动平衡：让所有项平均分配
const autoBalance = async () => {
  isBalancing.ref = true;
  
  // 计算目标值
  const length = weights.value.length;
  const avg = Math.floor(100 / length);
  const remainder = 100 - avg * length;
  
  // 创建目标数组
  const targetValues = weights.value.map((_, i) => 
    i < remainder ? avg + 1 : avg
  );
  
  // 动画过渡到目标值
  const steps = 20;
  const startValues = weights.value.map(item => item.value);
  
  for (let step = 1; step <= steps; step++) {
    await new Promise(resolve => setTimeout(resolve, 30));
    
    weights.value.forEach((item, i) => {
      const start = startValues[i];
      const target = targetValues[i];
      item.value = Math.round(start + (target - start) * (step / steps));
    });
  }
  
  // 确保最终值精确
  weights.value.forEach((item, i) => {
    item.value = targetValues[i];
  });
  
  isBalancing.value = false;
};

// 保存配置
const saveConfig = () => {
  if (totalWeight.value !== 100) {
    alert('权重总和必须为100%');
    return;
  }
  
  console.log('当前配置：', weights.value);
  
  // 显示成功提示
  const successMessage = document.createElement('div');
  successMessage.className = 'save-success';
  successMessage.textContent = '配置已保存';
  document.body.appendChild(successMessage);
  
  setTimeout(() => {
    successMessage.classList.add('show');
    
    setTimeout(() => {
      successMessage.classList.remove('show');
      setTimeout(() => {
        document.body.removeChild(successMessage);
      }, 300);
    }, 2000);
  }, 10);
};
</script>

<style scoped>
/* 容器整体样式 */
.weight-config-container {
  width: 900px;
  margin: 20px auto;
  padding: 22px;
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(25, 118, 210, 0.1), 0 1px 5px rgba(25, 118, 210, 0.05);
  font-family: 'Helvetica Neue', Arial, sans-serif;
  transition: all 0.3s ease;
  border: 1px solid rgba(25, 118, 210, 0.1);
}

/* 标题区域 */
.weight-header {
  margin-bottom: 30px;
  text-align: center;
  position: relative;
}

.weight-header:after {
  content: '';
  position: absolute;
  bottom: -15px;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 3px;
  background: linear-gradient(90deg, #1976D2, #64B5F6);
  border-radius: 3px;
}

/* 标题 */
.weight-title {
  font-size: 22px;
  font-weight: 600;
  color: #1976D2;
  margin-bottom: 5px;
}

/* 副标题 */
.weight-subtitle {
  font-size: 14px;
  color: #78909C;
}

/* 权重项容器 */
.weight-items-container {
  margin-bottom: 20px;
  padding: 10px 0;
}

/* 单个权重项容器 */
.weight-item {
  display: flex;
  align-items: center;
  margin-bottom: 24px;
  padding: 10px 15px;
  border-radius: 12px;
  transition: all 0.3s ease;
  background: rgba(240, 247, 255, 0.5);
}

.weight-item:hover {
  background: rgba(232, 244, 255, 1);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(25, 118, 210, 0.08);
}

.weight-item-active {
  background: rgba(232, 244, 255, 1);
  box-shadow: 0 4px 12px rgba(25, 118, 210, 0.12);
}

/* 左侧标签 */
.weight-label {
  flex: 2;
  font-size: 14px;
  color: #37474F;
  display: flex;
  align-items: center;
  font-weight: 500;
}

/* 权重图标 */
.weight-icon {
  margin-right: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-inner {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 12px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

/* 滑块容器 */
.weight-slider {
  flex: 6;
  position: relative;
  margin: 0 15px;
  height: 30px;
  display: flex;
  align-items: center;
}

/* 滑块（range input）基础样式 */
.weight-slider input[type="range"] {
  width: 100%;
  appearance: none;
  background: transparent;
  outline: none;
  margin: 0;
  cursor: pointer;
  position: relative;
  z-index: 2;
  height: 30px;
}

/* 滑块滑动条轨道样式（webkit内核） */
.weight-slider input[type="range"]::-webkit-slider-runnable-track {
  height: 8px;
  background: transparent;
  border-radius: 4px;
}

/* 滑块按钮样式（webkit内核） */
.weight-slider input[type="range"]::-webkit-slider-thumb {
  appearance: none;
  width: 20px;
  height: 20px;
  background: white;
  border-radius: 50%;
  box-shadow: 0 2px 6px rgba(25, 118, 210, 0.3);
  margin-top: -6px;
  border: 2px solid #1976D2;
  transition: all 0.2s ease;
}

.weight-slider input[type="range"]:active::-webkit-slider-thumb {
  transform: scale(1.2);
  box-shadow: 0 3px 10px rgba(25, 118, 210, 0.4);
}

/* 背景轨道，用来显示灰色底 */
.slider-track {
  position: absolute;
  top: 50%;
  left: 0;
  height: 8px;
  width: 100%;
  background-color: #E3F2FD;
  border-radius: 4px;
  transform: translateY(-50%);
  z-index: 1;
}

/* 已填充部分，用来显示已选权重 */
.slider-filled {
  height: 8px;
  background-color: #2196F3;
  border-radius: 4px;
  transition: width 0.3s ease, background-color 0.3s ease;
}

/* 右侧数值 */
.weight-value {
  flex: 1;
  font-size: 18px;
  text-align: right;
  color: #1976D2;
  font-weight: 600;
  transition: color 0.3s ease;
}

.percent {
  font-size: 14px;
  opacity: 0.7;
  margin-left: 2px;
}

/* 总计显示 */
.weight-total {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 10px 15px;
  margin: 10px 0 20px;
  background: rgba(232, 244, 255, 0.8);
  border-radius: 8px;
  font-size: 15px;
  color: #37474F;
}

.total-value {
  font-weight: 600;
  color: #1976D2;
  margin: 0 5px;
}

.weight-total-invalid {
  background: rgba(255, 235, 238, 0.8);
}

.weight-total-invalid .total-value {
  color: #F44336;
}

.total-warning {
  color: #F44336;
  font-size: 13px;
}

/* 按钮区域 */
.button-group {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

/* 按钮通用样式 */
.button-group button {
  flex: 1;
  margin: 0 8px;
  border: none;
  padding: 12px 20px;
  border-radius: 8px;
  font-size: 15px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  font-weight: 500;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.button-group button:first-child {
  margin-left: 0;
}

.button-group button:last-child {
  margin-right: 0;
}

.button-group button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-icon {
  margin-right: 8px;
  font-size: 16px;
}

/* 自动平衡按钮 */
.auto-balance-btn {
  background-color: white;
  color: #1976D2;
  border: 1px solid #1976D2;
}

.auto-balance-btn:hover:not(:disabled) {
  background-color: #E3F2FD;
  transform: translateY(-2px);
}

/* 保存配置按钮 */
.save-btn {
  background: linear-gradient(135deg, #1976D2, #2196F3);
  color: white;
}

.save-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #1565C0, #1976D2);
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(33, 150, 243, 0.3);
}

/* 保存成功提示 */
.save-success {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%) translateY(-100px);
  background: #4CAF50;
  color: white;
  padding: 12px 25px;
  border-radius: 8px;
  font-size: 15px;
  box-shadow: 0 4px 15px rgba(76, 175, 80, 0.3);
  transition: transform 0.3s ease;
  z-index: 1000;
}

.save-success.show {
  transform: translateX(-50%) translateY(0);
}

/* 响应式设计 */
@media (max-width: 520px) {
  .weight-config-container {
    width: 90%;
    padding: 20px;
  }
  
  .weight-label {
    font-size: 13px;
  }
  
  .icon-inner {
    width: 24px;
    height: 24px;
    font-size: 10px;
  }
  
  .weight-value {
    font-size: 16px;
  }
}
</style>