<template>
  <div class="w-full max-w-7xl mx-auto p-4 md:p-8">
    <div class="feedback-card">
      <div class="card-header">
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 class="card-title">问题反馈分析</h2>
            <p class="card-description">大学排课系统常见冲突问题分析报告</p>
          </div>
          <div class="tabs w-full md:w-auto">
            <div class="tabs-list">
              <button 
                :class="['tab-button', { active: chartType === 'pie' }]" 
                @click="chartType = 'pie'"
              >
                饼图
              </button>
              <button 
                :class="['tab-button', { active: chartType === 'bar' }]" 
                @click="chartType = 'bar'"
              >
                柱状图
              </button>
            </div>
          </div>
        </div>
      </div>
      <div class="card-content">
        <div class="mt-4 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="md:col-span-2 chart-container">
            <div ref="chartRef" class="w-full h-full"></div>
          </div>
          <div class="space-y-6">
            <div class="analysis-box fade-in-right">
              <h3 class="text-lg font-semibold mb-4 text-slate-800 dark:text-slate-200">主要问题分析</h3>
              <p class="text-sm text-slate-600 dark:text-slate-300 mb-4 leading-relaxed">
                根据反馈数据分析，大学排课系统中的冲突问题主要集中在以下几个方面：
              </p>
              <div class="space-y-3">
                <div 
                  v-for="(item, index) in sortedData" 
                  :key="index"
                  class="flex items-center gap-3 fade-in-up"
                  :style="{ animationDelay: `${index * 100}ms` }"
                >
                  <div 
                    class="badge"
                    :style="{ backgroundColor: item.color }"
                  >
                    {{ index + 1 }}
                  </div>
                  <div>
                    <div class="font-medium text-slate-800 dark:text-slate-200">{{ item.name }}</div>
                    <div class="text-xs text-slate-500 dark:text-slate-400">占比 {{ item.value }}%</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="mt-8 detail-box fade-in-up">
          <h3 class="text-lg font-semibold mb-4 text-slate-800 dark:text-slate-200">详细分析</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-4">
              <div class="analysis-item" style="border-color: #3b82f6">
                <h4 class="font-medium text-slate-800 dark:text-slate-200">课程依赖冲突 (40%)</h4>
                <p class="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  主要由于某些课程需要按照特定顺序进行，但排课系统未能正确安排。
                </p>
              </div>
              <div class="analysis-item" style="border-color: #06b6d4">
                <h4 class="font-medium text-slate-800 dark:text-slate-200">教室冲突 (33.5%)</h4>
                <p class="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  主要由于教室数量不足或排课系统错误。
                </p>
              </div>
            </div>
            <div class="space-y-4">
              <div class="analysis-item" style="border-color: #14b8a6">
                <h4 class="font-medium text-slate-800 dark:text-slate-200">资源问题 (31%)</h4>
                <p class="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  主要由于特定教学资源（如实验室、设备）在同一时间被多门课程使用。
                </p>
              </div>
              <div class="analysis-item" style="border-color: #22c55e">
                <h4 class="font-medium text-slate-800 dark:text-slate-200">位置冲突 (27.4%)</h4>
                <p class="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  主要由于多门课程被安排在同一教室的同一时间。
                </p>
              </div>
              <div class="analysis-item" style="border-color: #84cc16">
                <h4 class="font-medium text-slate-800 dark:text-slate-200">时间冲突 (23.5%)</h4>
                <p class="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  主要由于两门或多门课程被安排在同一时间，导致学生或教师无法同时参加。
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import * as echarts from 'echarts/core';
import { TitleComponent, TooltipComponent, LegendComponent } from 'echarts/components';
import { PieChart, BarChart } from 'echarts/charts';
import { LabelLayout } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';

// Register ECharts components
echarts.use([
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  PieChart,
  BarChart,
  CanvasRenderer,
  LabelLayout
]);

// Data
const data = [
  { name: "课程依赖冲突", value: 40, color: "hsl(230, 70%, 50%)" },
  { name: "教室冲突", value: 33.5, color: "hsl(200, 70%, 50%)" },
  { name: "资源问题", value: 31, color: "hsl(170, 70%, 50%)" },
  { name: "位置冲突", value: 27.4, color: "hsl(140, 70%, 50%)" },
  { name: "时间冲突", value: 23.5, color: "hsl(110, 70%, 50%)" },
];

// Reactive state
const chartRef = ref(null);
const chartInstance = ref(null);
const activeIndex = ref(0);
const chartType = ref('pie');

// Computed properties
const sortedData = computed(() => {
  return [...data].sort((a, b) => b.value - a.value);
});

// Chart options
const getPieChartOption = () => {
  return {
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c}% ({d}%)'
    },
    series: [
      {
        name: '问题类型',
        type: 'pie',
        radius: ['40%', '70%'], // Increased outer radius for larger chart
        center: ['50%', '50%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: true,
          formatter: '{b}: {c}%',
          fontSize: 14 // Larger font size
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 18, // Larger font size on hover
            fontWeight: 'bold'
          },
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        },
        data: data.map(item => ({
          value: item.value,
          name: item.name,
          itemStyle: {
            color: item.color
          }
        }))
      }
    ]
  };
};

const getBarChartOption = () => {
  return {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'value',
      axisLabel: {
        formatter: '{value}%',
        fontSize: 12 // Larger font size
      }
    },
    yAxis: {
      type: 'category',
      data: sortedData.value.map(item => item.name),
      axisLine: {
        show: true
      },
      axisTick: {
        show: true
      },
      axisLabel: {
        fontSize: 14 // Larger font size
      }
    },
    series: [
      {
        name: '占比',
        type: 'bar',
        barWidth: '60%', // Wider bars
        data: sortedData.value.map(item => ({
          value: item.value,
          itemStyle: {
            color: item.color,
            borderRadius: [0, 4, 4, 0]
          }
        })),
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  };
};

// Initialize and update chart
const initChart = () => {
  if (chartRef.value) {
    chartInstance.value = echarts.init(chartRef.value);
    updateChart();
    
    window.addEventListener('resize', resizeChart);
  }
};

const updateChart = () => {
  if (!chartInstance.value) return;
  
  const option = chartType.value === 'pie' 
    ? getPieChartOption() 
    : getBarChartOption();
    
  chartInstance.value.setOption(option);
};

const resizeChart = () => {
  chartInstance.value?.resize();
};

// Watch for chart type changes
watch(chartType, () => {
  updateChart();
});

// Lifecycle hooks
onMounted(() => {
  initChart();
});

onUnmounted(() => {
  window.removeEventListener('resize', resizeChart);
  chartInstance.value?.dispose();
});
</script>

<style scoped>
.feedback-card {
  background-image: linear-gradient(to bottom right, white, #f8fafc);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  border-radius: 0.75rem;
  border-width: 0;
  overflow: hidden;
  animation: fadeIn 0.5s ease-out;
}

.card-header {
  padding: 1.5rem;
  padding-bottom: 0.5rem;
}

.card-title {
  font-size: 1.5rem;
  line-height: 2rem;
  font-weight: 700;
  background: linear-gradient(to right, #3b82f6, #6366f1);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

@media (min-width: 768px) {
  .card-title {
    font-size: 1.875rem;
    line-height: 2.25rem;
  }
}

.card-description {
  color: #64748b;
  margin-top: 0.5rem;
}

.card-content {
  padding: 1.5rem;
}

.tabs-list {
  display: grid;
  width: 100%;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  background-color: #f1f5f9;
  border-radius: 0.375rem;
  padding: 0.25rem;
}

@media (min-width: 768px) {
  .tabs-list {
    width: 200px;
  }
}

.tab-button {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #475569;
  border-radius: 0.375rem;
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

.tab-button.active {
  background-color: white;
  color: #0f172a;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}

.chart-container {
  height: 450px; /* Increased height */
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: white;
  border-radius: 0.75rem;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  padding: 1rem;
}

.analysis-box {
  background-color: white;
  border-radius: 0.75rem;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  padding: 1.5rem;
}

.detail-box {
  background-color: white;
  border-radius: 0.75rem;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  padding: 1.5rem;
}

.badge {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
}

.analysis-item {
  border-left-width: 4px;
  padding-left: 1rem;
}

/* Animations */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInRight {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-in-right {
  animation: fadeInRight 0.5s ease-out;
  animation-delay: 0.2s;
  animation-fill-mode: both;
}

.fade-in-up {
  animation: fadeInUp 0.3s ease-out;
  animation-fill-mode: both;
}

/* Dark mode support */
:root {
  color-scheme: light dark;
}

@media (prefers-color-scheme: dark) {
  .feedback-card {
    background-image: linear-gradient(to bottom right, #0f172a, #1e293b);
  }
  
  .tabs-list {
    background-color: #334155;
  }
  
  .tab-button {
    color: #cbd5e1;
  }
  
  .tab-button.active {
    background-color: #1e293b;
    color: white;
  }
  
  .chart-container, .analysis-box, .detail-box {
    background-color: #1e293b;
  }
}
</style>