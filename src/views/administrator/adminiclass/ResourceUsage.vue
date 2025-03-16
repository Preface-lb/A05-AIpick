<template>
  <div class="aud-dashboard">
    <header class="aud-dashboard-header">
      <div class="container aud-header-container">
        <div class="aud-header-content">
          <h1 class="aud-dashboard-title">设备使用分析仪表板</h1>
          <p class="aud-dashboard-subtitle">音响与话筒使用状况实时监控</p>
        </div>
        <div class="aud-header-actions">
          <div class="aud-date-badge">
            <Calendar className="h-4 w-4 mr-1" />
            <span>{{ currentDate }}</span>
          </div>
        </div>
      </div>
    </header>
    
    <main class="container">
      <div class="aud-dashboard-grid">
        <!-- Chart Card -->
        <div class="aud-card aud-chart-card">
          <div class="aud-card-header">
            <h2 class="aud-card-title">音响与话筒使用状况数据</h2>
            <div class="aud-card-actions">
              <button class="aud-btn aud-btn-outline">
                <Download className="h-4 w-4 mr-1" />
                导出数据
              </button>
            </div>
          </div>
          <div class="aud-chart-container">
            <div id="main" class="aud-chart"></div>
          </div>
        </div>
        
        <!-- Analysis Card -->
        <div class="aud-card aud-analysis-card">
          <div class="aud-card-header">
            <h2 class="aud-card-title">数据分析</h2>
          </div>
          <div class="aud-card-content">
            <div class="aud-analysis-content">
              <div class="aud-analysis-section">
                <h3 class="aud-section-title">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  使用趋势
                </h3>
                <ul class="aud-analysis-list">
                  <li>音响和话筒的使用量在二月至六月期间整体呈上升趋势，六月达到峰值。</li>
                  <li>七月和八月使用量急剧下降，趋于平稳。</li>
                  <li>话筒的使用量整体高于音响，说明话筒在活动中更为常用。</li>
                </ul>
              </div>
              
              <div class="aud-analysis-section">
                <h3 class="aud-section-title">
                  <Settings className="h-5 w-5 mr-2" />
                  设备维护与更新
                </h3>
                <ul class="aud-analysis-list">
                  <li>针对使用频率较高的设备（如话筒），应加强日常维护和定期检查，确保设备的稳定性和使用寿命。</li>
                  <li>对于使用量较低的设备（如音响），可以考虑优化配置或更新技术，以提高使用效率。</li>
                </ul>
              </div>
              
              <div class="aud-analysis-section">
                <h3 class="aud-section-title">
                  <Calendar className="h-5 w-5 mr-2" />
                  活动安排与资源调配
                </h3>
                <ul class="aud-analysis-list">
                  <li>根据设备使用趋势，合理安排活动时间和资源投入。例如，在使用高峰期（如六月）提前做好设备准备和人员培训。</li>
                  <li>对于使用量较低的时期（如七月和八月），可以安排设备的保养和维修工作，同时开展相关培训活动，提高设备的利用率。</li>
                </ul>
              </div>
              
              <div class="aud-analysis-section">
                <h3 class="aud-section-title">
                  <BarChart2 className="h-5 w-5 mr-2" />
                  数据分析与决策支持
                </h3>
                <ul class="aud-analysis-list">
                  <li>建立设备使用数据的定期分析机制，通过数据驱动决策，优化设备管理和资源配置。</li>
                  <li>结合历史数据和未来活动计划，制定科学合理的设备采购和更新计划，避免资源浪费和设备短缺。</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import * as echarts from 'echarts/core';
import { GridComponent, TooltipComponent, LegendComponent, TitleComponent, ToolboxComponent } from 'echarts/components';
import { LineChart } from 'echarts/charts';
import { UniversalTransition } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';
import { Download, TrendingUp, Settings, Calendar, BarChart2 } from 'lucide-vue-next';

echarts.use([
  GridComponent, 
  TooltipComponent, 
  LegendComponent, 
  TitleComponent, 
  ToolboxComponent,
  LineChart, 
  CanvasRenderer, 
  UniversalTransition
]);

export default {
  name: 'AudioUsageDashboard',
  components: {
    Download,
    TrendingUp,
    Settings,
    Calendar,
    BarChart2
  },
  data() {
    return {
      myChart: null,
      currentDate: new Date().toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    };
  },
  mounted() {
    this.initChart();
    window.addEventListener('resize', this.resizeChart);
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.resizeChart);
    if (this.myChart) {
      this.myChart.dispose();
    }
  },
  methods: {
    initChart() {
      const chartDom = document.getElementById('main');
      this.myChart = echarts.init(chartDom);

      const option = {
        color: ['#6869ac', '#d8e699'],
        title: {
          show: false
        },
        tooltip: {
          trigger: 'axis',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          borderColor: '#e6f7ff',
          borderWidth: 1,
          textStyle: {
            color: '#333'
          },
          axisPointer: {
            type: 'shadow',
            shadowStyle: {
              color: 'rgba(104, 105, 172, 0.1)'
            }
          }
        },
        legend: {
          data: ['音响', '话筒'],
          bottom: 0,
          icon: 'roundRect',
          itemWidth: 12,
          itemHeight: 12,
          textStyle: {
            color: '#666'
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '10%',
          top: '5%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: ['二月', '三月', '四月', '五月', '六月', '七月', '八月'],
          axisLine: {
            lineStyle: {
              color: '#e0e0e0'
            }
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            color: '#666'
          }
        },
        yAxis: {
          type: 'value',
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          splitLine: {
            lineStyle: {
              color: '#f0f0f0',
              type: 'dashed'
            }
          },
          axisLabel: {
            color: '#666'
          }
        },
        series: [
          {
            name: '音响',
            type: 'line',
            smooth: true,
            data: [820, 932, 901, 934, 1290, 330, 20],
            emphasis: {
              focus: 'series'
            },
            symbolSize: 8,
            symbol: 'circle',
            showSymbol: false,
            itemStyle: {
              color: '#6869ac',
              borderWidth: 2,
              borderColor: '#fff'
            },
            lineStyle: {
              width: 3,
              shadowColor: 'rgba(104, 105, 172, 0.3)',
              shadowBlur: 10
            },
            areaStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  { offset: 0, color: 'rgba(104, 105, 172, 0.3)' },
                  { offset: 1, color: 'rgba(104, 105, 172, 0.05)' }
                ]
              }
            }
          },
          {
            name: '话筒',
            type: 'line',
            smooth: true,
            data: [1200, 1300, 1250, 1400, 1500, 450, 16],
            emphasis: {
              focus: 'series'
            },
            symbolSize: 8,
            symbol: 'circle',
            showSymbol: false,
            itemStyle: {
              color: '#d8e699',
              borderWidth: 2,
              borderColor: '#fff'
            },
            lineStyle: {
              width: 3,
              shadowColor: 'rgba(216, 230, 153, 0.3)',
              shadowBlur: 10
            },
            areaStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  { offset: 0, color: 'rgba(216, 230, 153, 0.3)' },
                  { offset: 1, color: 'rgba(216, 230, 153, 0.05)' }
                ]
              }
            }
          }
        ]
      };

      this.myChart.setOption(option);
    },
    resizeChart() {
      if (this.myChart) {
        this.myChart.resize();
      }
    }
  }
};
</script>

<style>
:root {
  --primary: #6869ac;
  --primary-light: #8788c7;
  --primary-dark: #4a4b7d;
  --secondary: #d8e699;
  --secondary-light: #e5f0b9;
  --secondary-dark: #bbc97a;
  --primary-bg: #f0f0f8;
  --text-primary: #333;
  --text-secondary: #666;
  --text-light: #999;
  --border-color: #e0e0e0;
  --card-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  --transition: all 0.3s ease;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Inter', 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  color: var(--text-primary);
  background-color: #f8fafc;
  line-height: 1.6;
}

.aud-dashboard {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.container {
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

.aud-dashboard-header {
  background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
  color: white;
  padding: 1rem 0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
  border-radius: 2px;
}

.aud-dashboard-header::before {
  content: "";
  position: absolute;
  top: -50%;
  right: -50%;
  width: 100%;
  height: 200%;
  background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%);
  transform: rotate(30deg);
}

.aud-header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  z-index: 1;
  max-width: 1260px;
  border-radius: 12px;
}

.aud-header-content {
  max-width: 70%;
}

.aud-dashboard-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
  letter-spacing: -0.02em;
  text-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.aud-dashboard-subtitle {
  font-size: 0.9rem;
  font-weight: 400;
  margin-top: 0.25rem;
  opacity: 0.9;
}

.aud-header-actions {
  display: flex;
  gap: 1rem;
}

.aud-date-badge {
  display: flex;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.15);
  padding: 0.4rem 0.8rem;
  border-radius: 2rem;
  font-size: 0.8rem;
  backdrop-filter: blur(4px);
}

main {
  flex: 1;
  padding: 1.5rem 0;
  background-color: #f8fafc;
  position: relative;
}

main::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, var(--primary) 0%, var(--secondary) 100%);
}

.aud-dashboard-grid {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.aud-card {
  background: white;
  border-radius: 12px;
  box-shadow: var(--card-shadow);
  overflow: hidden;
  transition: var(--transition);
  border: 1px solid rgba(0,0,0,0.03);
}

.aud-card:hover {
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
}

.aud-card-header {
  padding: 1rem 1.25rem;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: rgba(248, 250, 252, 0.5);
}

.aud-card-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--primary);
  margin: 0;
}

.aud-card-actions {
  display: flex;
  gap: 0.75rem;
}

.aud-card-content {
  padding: 1.25rem;
}

.aud-chart-card {
  display: flex;
  flex-direction: column;
}

.aud-chart-container {
  width: 100%;
  height: 400px;
  padding: 1rem;
}

.aud-chart {
  width: 100%;
  height: 100%;
}

.aud-analysis-card {
  width: 100%;
}

.aud-analysis-section {
  padding: 1rem;
  border-radius: 8px;
  background-color: rgba(248, 250, 252, 0.5);
  border: 1px solid rgba(0,0,0,0.03);
  transition: var(--transition);
  height: 100%;
  display: flex;
  flex-direction: column;
}

.aud-analysis-section:hover {
  background-color: var(--primary-bg);
  transform: translateY(-2px);
}

.aud-section-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--primary);
  margin-bottom: 0.75rem;
  display: flex;
  align-items: center;
}

.aud-analysis-list {
  list-style-type: none;
  padding-left: 1.25rem;
  font-size: 0.9rem;
  flex: 1;
  overflow-y: auto;
  max-height: 200px;
}

.aud-analysis-list li {
  position: relative;
  margin-bottom: 0.5rem;
  color: var(--text-secondary);
}

.aud-analysis-list li:before {
  content: "";
  position: absolute;
  left: -1rem;
  top: 0.5rem;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background-color: var(--secondary);
}

.aud-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.4rem 0.8rem;
  border-radius: 6px;
  font-weight: 500;
  font-size: 0.8rem;
  transition: var(--transition);
  cursor: pointer;
}

.aud-btn-outline {
  background: transparent;
  border: 1px solid var(--primary);
  color: var(--primary);
}

.aud-btn-outline:hover {
  background: var(--primary-bg);
}

.aud-analysis-content {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
}

@media (max-width: 1200px) {
  .aud-analysis-content {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .aud-analysis-content {
    grid-template-columns: 1fr;
  }
}
</style>