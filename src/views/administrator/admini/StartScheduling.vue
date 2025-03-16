<template>
  <div class="schedule-container">
    <el-card class="schedule-card">
      <h2>课程排课信息</h2>
      <div class="horizontal-timeline">
        <div
          class="timeline-item"
          v-for="(step, index) in steps"
          :key="index"
          :style="{ left: `${index * 100 / (steps.length - 1)}%` }"
        >
          <div class="timeline-content">
            <el-tag type="success" class="step-title">{{ step.title }}</el-tag>
            <p class="step-description">{{ step.description }}</p>
          </div>
          <div class="timeline-point"></div>
        </div>
      </div>
      <div class="timeline-line"></div>
      <el-progress :percentage="progress" status="success" class="horizontal-progress"></el-progress>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      steps: [
        { title: "课程选择", time: "第一步", description: "选择需要排课的课程" },
        { title: "教师选择", time: "第二步", description: "分配教师与课表" },
        { title: "优先排课设置", time: "第三步", description: "设置优先排课规则" },
        { title: "人性化排课设置", time: "第四步", description: "设置人性化排课参数" },
        { title: "禁排设置", time: "第五步", description: "设置禁止排课时段" },
        { title: "AI权限配置", time: "第六步", description: "配置AI排课权限" },
        { title: "开始排课", time: "第七步", description: "启动AI智能排课" },
      ],
      progress: 0
    };
  },
  mounted() {
    this.initAnimation();
    this.startProgressAnimation();
  },
  methods: {
    initAnimation() {
      const steps = this.steps.length;
      for (let i = 0; i < steps; i++) {
        setTimeout(() => {
          const stepElement = document.querySelector(`.timeline-item:nth-child(${i + 1})`);
          if (stepElement) {
            stepElement.style.opacity = 1;
            stepElement.style.transform = 'translateY(0)';
          }
        }, i * 200); // 每个步骤延迟200ms出现
      }
    },
    startProgressAnimation() {
      let currentProgress = 0;
      const interval = setInterval(() => {
        currentProgress += 100 / (this.steps.length * 0.1);
        if (currentProgress >= 100) {
          clearInterval(interval);
        }
        this.progress = currentProgress;
      }, 300); // 每300ms增加进度
    }
  }
};
</script>

<style scoped>
.schedule-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

.schedule-card {
  width: 90%;
  height: 400px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  position: relative;
}

.horizontal-timeline {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 20px 0;
  position: relative;
  height: 100px;
  overflow-x: auto;
  scrollbar-width: none; /* Firefox */
}

.horizontal-timeline::-webkit-scrollbar {
  display: none; /* Chrome, Safari, Edge */
}

.timeline-item {
  position: absolute;
  bottom: 0;
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.3s ease, transform 0.3s ease;
  width: 120px;
}

.timeline-content {
  text-align: center;
}

.step-title {
  margin-bottom: 5px;
}

.step-description {
  margin: 0;
  font-size: 12px;
  color: #666;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.timeline-point {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: #409EFF;
  margin: 0 auto;
  margin-top: 10px;
}

.timeline-line {
  position: absolute;
  top: 50px;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: #409EFF;
  z-index: -1;
}

.horizontal-progress {
  margin-top: 60px;
  height: 6px;
}

/* 调整时间轴节点样式 */
::v-deep(.el-progress-bar__inner) {
  transition: width 1s linear;
}
</style>