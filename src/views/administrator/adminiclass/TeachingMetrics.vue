<template>
  <div class="emr-dashboard-container">
    <div class="emr-dashboard-card">
      <div class="emr-dashboard-header">
        <h1 class="emr-dashboard-title">核心教学指标雷达分析</h1>
        <div class="emr-dashboard-subtitle">教学质量评估系统</div>
      </div>
      
      <div class="emr-chart-container" ref="emrChartContainer"></div>
      
      <div class="emr-analysis-container">
        <h3 class="emr-analysis-title">数据分析</h3>
        <div class="emr-analysis-content">
          <p class="emr-analysis-text">
            教室使用率、教师负荷程度、设备利用率、课程满意度、排课冲突率和学生出勤率六个指标中，
            <span class="emr-highlight">排课冲突率</span>和<span class="emr-highlight">课程满意度</span>相对较低，
            而<span class="emr-highlight-positive">教师负荷程度</span>和<span class="emr-highlight-positive">学生出勤率</span>较高。
          </p>
        </div>
        
        <div class="emr-recommendations">
          <h3 class="emr-recommendations-title">改进建议</h3>
          <ul class="emr-recommendations-list">
            <li>
              <div class="emr-recommendation-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 16v-4"></path><path d="M12 8h.01"></path></svg>
              </div>
              <div class="emr-recommendation-content">
                <strong>均衡教师工作量：</strong>合理分配教学任务，避免部分教师工作量过大。
              </div>
            </li>
            <li>
              <div class="emr-recommendation-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v4"></path><path d="M12 18v4"></path><path d="m4.93 4.93 2.83 2.83"></path><path d="m16.24 16.24 2.83 2.83"></path><path d="M2 12h4"></path><path d="M18 12h4"></path><path d="m4.93 19.07 2.83-2.83"></path><path d="m16.24 7.76 2.83-2.83"></path></svg>
              </div>
              <div class="emr-recommendation-content">
                <strong>提高设备利用率：</strong>检查设备配置和使用情况，提升低利用率教学楼的设备使用效率。
              </div>
            </li>
            <li>
              <div class="emr-recommendation-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
              </div>
              <div class="emr-recommendation-content">
                <strong>关注学生出勤：</strong>针对出勤率较低的情况，可以引入考勤系统或改进教学方法，提高学生出勤率。
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts/core';
import { TitleComponent, LegendComponent, TooltipComponent } from 'echarts/components';
import { RadarChart } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';

echarts.use([TitleComponent, LegendComponent, TooltipComponent, RadarChart, CanvasRenderer]);

export default {
  name: 'EducationalMetricsRadar',
  data() {
    return {
      chart: null,
      chartData: [
        {
          value: [5000, 14000, 28000, 26000, 12000, 21000],
          name: '当前指标',
          itemStyle: {
            color: '#1e88e5'
          },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: 'rgba(30, 136, 229, 0.8)'
                },
                {
                  offset: 1,
                  color: 'rgba(30, 136, 229, 0.2)'
                }
              ]
            }
          },
          lineStyle: {
            width: 3,
            color: '#1e88e5'
          }
        },
        {
          value: [6000, 10000, 29000, 35000, 20000, 23000],
          name: '目标指标',
          itemStyle: {
            color: '#64b5f6'
          },
          lineStyle: {
            width: 2,
            type: 'dashed',
            color: '#64b5f6'
          }
        }
      ],
      indicators: [
        { name: '教室使用率', max: 6500 },
        { name: '教师负荷程度', max: 16000 },
        { name: '设备利用率', max: 30000 },
        { name: '课程满意度', max: 38000 },
        { name: '排课冲突率', max: 52000 },
        { name: '学生出勤率', max: 25000 }
      ]
    };
  },
  mounted() {
    this.initChart();
    window.addEventListener('resize', this.resizeChart);
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.resizeChart);
    this.destroyChart();
  },
  methods: {
    initChart() {
      const chartDom = this.$refs.emrChartContainer;
      this.chart = echarts.init(chartDom);
      
      const option = {
        backgroundColor: 'transparent',
        color: ['#1e88e5', '#64b5f6'],
        tooltip: {
          trigger: 'item',
          backgroundColor: 'rgba(15, 39, 74, 0.8)',
          borderColor: '#1e88e5',
          textStyle: {
            color: '#ffffff'
          },
          formatter: (params) => {
            return `${params.name}: ${params.value}`;
          }
        },
        legend: {
          data: ['当前指标', '目标指标'],
          bottom: 0,
          textStyle: {
            color: '#333',
            fontSize: 12
          },
          itemWidth: 15,
          itemHeight: 10,
          icon: 'roundRect'
        },
        radar: {
          shape: 'polygon',
          center: ['50%', '50%'],
          radius: '65%',
          nameGap: 15,
          splitNumber: 4,
          axisName: {
            color: '#0d47a1',
            fontSize: 12,
            fontWeight: 'bold',
            backgroundColor: 'rgba(255, 255, 255, 0.7)',
            padding: [3, 5],
            borderRadius: 3
          },
          splitArea: {
            areaStyle: {
              color: ['rgba(255, 255, 255, 0.1)', 'rgba(30, 136, 229, 0.05)', 
                     'rgba(30, 136, 229, 0.1)', 'rgba(30, 136, 229, 0.2)'],
              shadowColor: 'rgba(0, 0, 0, 0.1)',
              shadowBlur: 10
            }
          },
          axisLine: {
            lineStyle: {
              color: 'rgba(30, 136, 229, 0.3)'
            }
          },
          splitLine: {
            lineStyle: {
              color: 'rgba(30, 136, 229, 0.3)'
            }
          },
          indicator: this.indicators
        },
        series: [
          {
            type: 'radar',
            emphasis: {
              lineStyle: {
                width: 4
              }
            },
            data: this.chartData
          }
        ]
      };

      this.chart.setOption(option);
    },
    resizeChart() {
      if (this.chart) {
        this.chart.resize();
      }
    },
    destroyChart() {
      if (this.chart) {
        this.chart.dispose();
        this.chart = null;
      }
    }
  }
};
</script>

<style>
.emr-dashboard-container {
  font-family: 'Helvetica Neue', Arial, sans-serif;
  padding: 10px;
  background-color: #f5f7fa;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.emr-dashboard-card {
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(13, 71, 161, 0.1);
  overflow: hidden;
  width: 100%;
  max-width: 1050px;
  display: flex;
  flex-direction: column;
}

.emr-dashboard-header {
  background: linear-gradient(135deg, #0d47a1 0%, #1976d2 100%);
  color: white;
  padding: 25px 30px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.emr-dashboard-title {
  margin: 0;
  font-size: 24px;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.emr-dashboard-subtitle {
  margin-top: 5px;
  font-size: 14px;
  opacity: 0.8;
}

.emr-chart-container {
  height: 400px;
  width: 100%;
  padding: 20px;
}

.emr-analysis-container {
  padding: 0 30px 30px;
}

.emr-analysis-title, .emr-recommendations-title {
  color: #0d47a1;
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 2px solid #e3f2fd;
}

.emr-analysis-content {
  background-color: #f8fafc;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 25px;
}

.emr-analysis-text {
  margin: 0;
  line-height: 1.6;
  color: #333;
  font-size: 15px;
}

.emr-highlight {
  color: #d32f2f;
  font-weight: 500;
}

.emr-highlight-positive {
  color: #388e3c;
  font-weight: 500;
}

.emr-recommendations-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.emr-recommendations-list li {
  display: flex;
  margin-bottom: 15px;
  background-color: #f8fafc;
  border-radius: 8px;
  padding: 15px;
  transition: all 0.3s ease;
}

.emr-recommendations-list li:hover {
  background-color: #e3f2fd;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(13, 71, 161, 0.1);
}

.emr-recommendation-icon {
  color: #1976d2;
  margin-right: 15px;
  display: flex;
  align-items: flex-start;
  padding-top: 2px;
}

.emr-recommendation-content {
  flex: 1;
  line-height: 1.5;
}

.emr-recommendation-content strong {
  color: #0d47a1;
}

@media (max-width: 768px) {
  .emr-dashboard-container {
    padding: 10px;
  }
  
  .emr-dashboard-header {
    padding: 20px;
  }
  
  .emr-dashboard-title {
    font-size: 20px;
  }
  
  .emr-chart-container {
    height: 350px;
  }
  
  .emr-analysis-container {
    padding: 0 20px 20px;
  }
}
</style>