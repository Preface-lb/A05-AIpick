<template>
  <div class="cca-analysis-container">
    <div class="cca-header-section">
      <h1 class="cca-main-title">教学楼容量与使用率分析</h1>
      <div class="cca-subtitle">校区教学资源分布情况</div>
    </div>
    
    <div class="cca-chart-card">
      <div id="main" ref="chartContainer"></div>
    </div>
    
    <div class="cca-analysis-card">
      <h2 class="cca-section-title">数据分析</h2>
      <div class="cca-analysis-content">
        <p>不同教学楼的排课后使用占比存在显著差异。西一教学楼的排课占比最高，接近400，而东一教学楼的排课占比最低，接近0。整体来看，西区域的教学楼（西一、西二、西三）排课占比普遍高于东区域（东一、东二、东三）和文区域（文一、文二、文三、文四）。</p>
      </div>
      
      <h2 class="cca-section-title">建议</h2>
      <div class="cca-recommendations">
        <div class="cca-recommendation-item">
          <div class="cca-recommendation-icon">
            <i class="cca-recommendation-number">1</i>
          </div>
          <div class="cca-recommendation-text">
            <h3>优化资源分配</h3>
            <p>将部分课程从高占比的教学楼（如西一）调整到低占比的教学楼（如东一、东二），以平衡资源利用。</p>
          </div>
        </div>
        
        <div class="cca-recommendation-item">
          <div class="cca-recommendation-icon">
            <i class="cca-recommendation-number">2</i>
          </div>
          <div class="cca-recommendation-text">
            <h3>关注低利用率教学楼</h3>
            <p>调查东一等低占比教学楼的原因，是否因为设施不足、位置不便等，并采取措施提升其利用率。</p>
          </div>
        </div>
        
        <div class="cca-recommendation-item">
          <div class="cca-recommendation-icon">
            <i class="cca-recommendation-number">3</i>
          </div>
          <div class="cca-recommendation-text">
            <h3>合理规划课程</h3>
            <p>在排课时，考虑教学楼的承载能力和实际需求，避免过度集中或闲置。</p>
          </div>
        </div>
        
        <div class="cca-recommendation-item">
          <div class="cca-recommendation-icon">
            <i class="cca-recommendation-number">4</i>
          </div>
          <div class="cca-recommendation-text">
            <h3>持续监测与调整</h3>
            <p>定期分析排课数据，及时调整策略，确保教学资源的高效利用。</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts';

export default {
  name: 'ClassroomCapacityAnalysis',
  data() {
    return {
      myChart: null,
      buildings: ['东一', '东二', '东三', '中楼', '西一', '西二', '西三', '文一', '文二', '文三', '文四'],
      usageData: [10, 52, 200, 334, 390, 330, 220, 237, 174, 322, 269],
      activeIndex: -1
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
      this.myChart = echarts.init(this.$refs.chartContainer);
      this.updateChartOption();
    },
    updateChartOption() {
      const option = {
        title: {
          text: '各教学楼使用占比',
          left: 'center',
          top: 10,
          textStyle: {
            color: '#6366f1',
            fontSize: 18,
            fontWeight: 'normal'
          }
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          },
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          borderColor: '#e2e8f0',
          borderWidth: 1,
          textStyle: {
            color: '#334155'
          },
          formatter: (params) => {
            const data = params[0];
            return `<div style="padding: 4px 8px;">
                      <div style="font-weight: bold; margin-bottom: 4px;">${data.name}</div>
                      <div>使用占比: <span style="color: #6366f1; font-weight: bold;">${data.value}</span></div>
                    </div>`;
          }
        },
        grid: {
          left: '5%',
          right: '5%',
          bottom: '10%',
          top: '15%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: this.buildings,
          axisTick: {
            alignWithLabel: true,
            lineStyle: {
              color: '#cbd5e1'
            }
          },
          axisLine: {
            lineStyle: {
              color: '#cbd5e1'
            }
          },
          axisLabel: {
            color: '#64748b',
            fontSize: 12,
            interval: 0,
            rotate: 0
          }
        },
        yAxis: {
          type: 'value',
          name: '使用占比',
          nameTextStyle: {
            color: '#64748b',
            fontSize: 12,
            padding: [0, 0, 0, 0]
          },
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          splitLine: {
            lineStyle: {
              color: '#e2e8f0',
              type: 'dashed'
            }
          },
          axisLabel: {
            color: '#64748b',
            fontSize: 12
          }
        },
        series: [
          {
            name: '使用占比',
            type: 'bar',
            barWidth: '50%',
            data: this.usageData.map((value, index) => {
              return {
                value: value,
                itemStyle: {
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    { offset: 0, color: '#8b5cf6' },
                    { offset: 1, color: '#6366f1' }
                  ]),
                  borderRadius: [4, 4, 0, 0]
                },
                emphasis: {
                  itemStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                      { offset: 0, color: '#a78bfa' },
                      { offset: 1, color: '#818cf8' }
                    ])
                  }
                }
              };
            }),
            emphasis: {
              focus: 'series'
            },
            animationDelay: function(idx) {
              return idx * 100;
            }
          }
        ],
        animationEasing: 'elasticOut',
        animationDelayUpdate: function(idx) {
          return idx * 5;
        }
      };
      
      this.myChart.setOption(option);
    },
    resizeChart() {
      if (this.myChart) {
        this.myChart.resize();
      }
    },
    destroyChart() {
      if (this.myChart) {
        this.myChart.dispose();
        this.myChart = null;
      }
    },
    highlightBuilding(index) {
      this.activeIndex = index;
      // Could implement highlighting logic here
    }
  }
};
</script>

<style scoped>
.cca-analysis-container {
  font-family: 'Inter', 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  color: #1e293b;
  background-color: #f8fafc;
}

.cca-header-section {
  text-align: center;
  margin-bottom: 2rem;
}

.cca-main-title {
  font-size: 2rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 0.5rem;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.cca-subtitle {
  font-size: 1.1rem;
  color: #64748b;
  margin-bottom: 1rem;
}

.cca-chart-card {
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(99, 102, 241, 0.1);
  padding: 1.5rem;
  margin-bottom: 2rem;
  transition: all 0.3s ease;
}

.cca-chart-card:hover {
  box-shadow: 0 8px 30px rgba(99, 102, 241, 0.15);
}

#main {
  width: 100%;
  height: 500px;
}

.cca-analysis-card {
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(99, 102, 241, 0.1);
  padding: 2rem;
  transition: all 0.3s ease;
}

.cca-analysis-card:hover {
  box-shadow: 0 8px 30px rgba(99, 102, 241, 0.15);
}

.cca-section-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #6366f1;
  margin-bottom: 1.5rem;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid #e0e7ff;
}

.cca-analysis-content {
  margin-bottom: 2rem;
  line-height: 1.7;
  color: #334155;
  font-size: 1.05rem;
}

.cca-recommendations {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-top: 1.5rem;
}

.cca-recommendation-item {
  display: flex;
  background-color: #f8fafc;
  border-radius: 8px;
  padding: 1.25rem;
  transition: all 0.3s ease;
  border-left: 4px solid #6366f1;
}

.cca-recommendation-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(99, 102, 241, 0.15);
}

.cca-recommendation-icon {
  margin-right: 1rem;
  display: flex;
  align-items: flex-start;
  justify-content: center;
}

.cca-recommendation-number {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: white;
  border-radius: 50%;
  font-style: normal;
  font-weight: 600;
  font-size: 0.9rem;
}

.cca-recommendation-text h3 {
  font-size: 1.1rem;
  font-weight: 600;
  color: #334155;
  margin-bottom: 0.5rem;
}

.cca-recommendation-text p {
  font-size: 0.95rem;
  color: #64748b;
  line-height: 1.6;
}

@media (max-width: 768px) {
  .cca-analysis-container {
    padding: 1rem;
  }
  
  .cca-main-title {
    font-size: 1.75rem;
  }
  
  .cca-recommendations {
    grid-template-columns: 1fr;
  }
  
  #main {
    height: 400px;
  }
}
</style>