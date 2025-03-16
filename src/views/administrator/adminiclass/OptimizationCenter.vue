<template>
  <div class="app-container">
    <div class="content-wrapper">
      <!-- Header -->
      <header class="header">
        <h1 class="title">课程管理系统优化建议</h1>
        <p class="subtitle">基于数据分析的教学资源分配与管理优化方案</p>
        <div class="divider"></div>
      </header>

      <!-- Main Content -->
      <div class="sections-grid">
        <!-- Section 1 -->
        <section class="section section-blue">
          <div class="section-header">
            <div class="icon-wrapper">
              <svg xmlns="http://www.w3.org/2000/svg" class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19 21V5a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v16" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M1 21h22" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 7v.01" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 11v.01" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 15v.01" />
              </svg>
            </div>
            <h2 class="section-title">教学楼资源分配与利用</h2>
          </div>
          <div class="section-content">
            <ul class="suggestion-list">
              <li class="suggestion-item">
                <div class="check-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                  </svg>
                </div>
                <p class="suggestion-text">
                  <span class="highlight">优化资源分配：</span>将部分课程从高占比的教学楼（如西一）调整到低占比的教学楼（如东一、东二），以平衡资源利用。
                </p>
              </li>
              <li class="suggestion-item">
                <div class="check-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                  </svg>
                </div>
                <p class="suggestion-text">
                  <span class="highlight">关注低利用率教学楼：</span>调查东一等低占比教学楼的原因，是否因为设施不足、位置不便等，并采取措施提升其利用率。
                </p>
              </li>
              <li class="suggestion-item">
                <div class="check-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                  </svg>
                </div>
                <p class="suggestion-text">
                  <span class="highlight">合理规划课程：</span>在排课时，考虑教学楼的承载能力和实际需求，避免过度集中或闲置。
                </p>
              </li>
              <li class="suggestion-item">
                <div class="check-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                  </svg>
                </div>
                <p class="suggestion-text">
                  <span class="highlight">持续监测与调整：</span>定期分析排课数据，及时调整策略，确保教学资源的高效利用。
                </p>
              </li>
            </ul>
          </div>
        </section>

        <!-- Section 2 -->
        <section class="section section-green">
          <div class="section-header">
            <div class="icon-wrapper">
              <svg xmlns="http://www.w3.org/2000/svg" class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <h2 class="section-title">教学与设备管理</h2>
          </div>
          <div class="section-content">
            <ul class="suggestion-list">
              <li class="suggestion-item">
                <div class="check-icon check-icon-green">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                  </svg>
                </div>
                <p class="suggestion-text">
                  <span class="highlight">均衡教师工作量：</span>合理分配教学任务，避免部分教师工作量过大。
                </p>
              </li>
              <li class="suggestion-item">
                <div class="check-icon check-icon-green">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                  </svg>
                </div>
                <p class="suggestion-text">
                  <span class="highlight">提高设备利用率：</span>检查设备配置和使用情况，提升低利用率教学楼的设备使用效率。针对使用频率较高的设备（如话筒），加强日常维护和定期检查，确保设备的稳定性和使用寿命。
                </p>
              </li>
              <li class="suggestion-item">
                <div class="check-icon check-icon-green">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                  </svg>
                </div>
                <p class="suggestion-text">
                  <span class="highlight">关注学生出勤：</span>针对出勤率较低的情况，可以引入考勤系统或改进教学方法，提高学生出勤率。
                </p>
              </li>
            </ul>
          </div>
        </section>

        <!-- Section 3 -->
        <section class="section section-purple">
          <div class="section-header">
            <div class="icon-wrapper">
              <svg xmlns="http://www.w3.org/2000/svg" class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
              </svg>
            </div>
            <h2 class="section-title">设备使用与维护</h2>
          </div>
          <div class="section-content">
            <ul class="suggestion-list">
              <li class="suggestion-item">
                <div class="check-icon check-icon-purple">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                  </svg>
                </div>
                <p class="suggestion-text">
                  <span class="highlight">设备维护与更新：</span>针对使用频率较高的设备（如话筒），应加强日常维护和定期检查，确保设备的稳定性和使用寿命。对于使用量较低的设备（如音响），可以考虑优化配置或更新技术，以提高使用效率。
                </p>
              </li>
              <li class="suggestion-item">
                <div class="check-icon check-icon-purple">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                  </svg>
                </div>
                <p class="suggestion-text">
                  <span class="highlight">活动安排与资源调配：</span>根据设备使用趋势，合理安排活动时间和资源投入。在使用高峰期（如六月）提前做好设备准备和人员培训。对于使用量较低的时期（如七月和八月），可以安排设备的保养和维修工作，同时开展相关培训活动，提高设备的利用率。
                </p>
              </li>
              <li class="suggestion-item">
                <div class="check-icon check-icon-purple">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                  </svg>
                </div>
                <p class="suggestion-text">
                  <span class="highlight">数据分析与决策支持：</span>建立设备使用数据的定期分析机制，通过数据驱动决策，优化设备管理和资源配置。结合历史数据和未来活动计划，制定科学合理的设备采购和更新计划，避免资源浪费和设备短缺。
                </p>
              </li>
            </ul>
          </div>
        </section>

        <!-- Section 4 -->
        <section class="section section-amber">
          <div class="section-header">
            <div class="icon-wrapper">
              <svg xmlns="http://www.w3.org/2000/svg" class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 class="section-title">排课系统优化</h2>
          </div>
          <div class="section-content">
            <ul class="suggestion-list">
              <li class="suggestion-item">
                <div class="check-icon check-icon-amber">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                  </svg>
                </div>
                <p class="suggestion-text">
                  <span class="highlight">解决课程依赖冲突：</span>优化排课系统算法，确保能够正确识别和安排具有依赖关系的课程。
                </p>
              </li>
              <li class="suggestion-item">
                <div class="check-icon check-icon-amber">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                  </svg>
                </div>
                <p class="suggestion-text">
                  <span class="highlight">优化资源分配机制：</span>合理规划教学资源（如实验室、设备）的使用，避免在同一时间被多门课程使用。
                </p>
              </li>
              <li class="suggestion-item">
                <div class="check-icon check-icon-amber">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                  </svg>
                </div>
                <p class="suggestion-text">
                  <span class="highlight">避免位置冲突：</span>加强排课系统的教室管理功能，确保同一教室在同一时间不会被安排多门课程。
                </p>
              </li>
              <li class="suggestion-item">
                <div class="check-icon check-icon-amber">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                  </svg>
                </div>
                <p class="suggestion-text">
                  <span class="highlight">减少时间冲突：</span>优化排课算法，尽量避免将两门或多门课程安排在同一时间，确保学生和教师能够顺利参加所有课程。
                </p>
              </li>
            </ul>
          </div>
        </section>
      </div>

      <!-- Footer -->
      <footer class="footer">
        <p>© {{ new Date().getFullYear() }} 课程管理系统 | 数据驱动的教学资源优化平台</p>
      </footer>
    </div>
  </div>
</template>

<script>
export default {
  name: 'OptimizationSuggestions',
  data() {
    return {
      currentYear: new Date().getFullYear()
    }
  },
  mounted() {
    // Animation effect when component mounts
    const sections = document.querySelectorAll('section');
    sections.forEach((section, index) => {
      setTimeout(() => {
        section.classList.add('visible');
      }, 100 * index);
    });
  }
}
</script>

<style scoped>
/* Base styles */
.app-container {
  background: linear-gradient(to bottom right, #f9fafb, #f3f4f6);
  min-height: 100vh;
  padding: 1.5rem;
}

.content-wrapper {
  max-width: 1200px;
  margin: 0 auto;
}

/* Header styles */
.header {
  text-align: center;
  margin-bottom: 3rem;
  padding-top: 2rem;
}

.title {
  font-size: 2rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0.75rem;
}

@media (min-width: 768px) {
  .title {
    font-size: 2.5rem;
  }
}

.subtitle {
  color: #4b5563;
  max-width: 48rem;
  margin: 0 auto;
}

.divider {
  width: 5rem;
  height: 0.25rem;
  background-color: #3b82f6;
  margin: 1.5rem auto 0;
  border-radius: 9999px;
}

/* Grid layout */
.sections-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
}

@media (min-width: 768px) {
  .sections-grid {
    grid-template-columns: 1fr 1fr;
  }
}

/* Section styles */
.section {
  background-color: white;
  border-radius: 0.75rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  overflow: hidden;
  opacity: 0.7;
  transition: all 0.5s ease;
  transform: translateY(0);
}

.section.visible {
  opacity: 1;
}

.section:hover {
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  transform: translateY(-8px);
}

.section-header {
  padding: 1rem;
  display: flex;
  align-items: center;
}

.section-blue .section-header {
  background-color: #2563eb;
}

.section-green .section-header {
  background-color: #059669;
}

.section-purple .section-header {
  background-color: #7c3aed;
}

.section-amber .section-header {
  background-color: #d97706;
}

.icon-wrapper {
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 9999px;
  padding: 0.5rem;
  margin-right: 0.75rem;
}

.icon {
  height: 1.5rem;
  width: 1.5rem;
  color: white;
}

.section-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: white;
}

.section-content {
  padding: 1.5rem;
}

/* Suggestion list styles */
.suggestion-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.suggestion-item {
  display: flex;
  align-items: flex-start;
}

.check-icon {
  flex-shrink: 0;
  height: 1.25rem;
  width: 1.25rem;
  color: #3b82f6;
  margin-top: 0.125rem;
}

.check-icon-green {
  color: #059669;
}

.check-icon-purple {
  color: #7c3aed;
}

.check-icon-amber {
  color: #d97706;
}

.suggestion-text {
  margin-left: 0.75rem;
  color: #4b5563;
  font-size: 0.875rem;
}

.highlight {
  font-weight: 500;
}

/* Footer styles */
.footer {
  margin-top: 4rem;
  margin-bottom: 2rem;
  text-align: center;
  color: #6b7280;
  font-size: 0.875rem;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>