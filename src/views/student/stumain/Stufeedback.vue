<template>
  <div class="feedback-center">
    <header class="header">
      <h1>学生反馈中心</h1>
      <p>请提供您对课程安排的反馈，帮助我们改进服务</p>
    </header>

    <div class="card">
      <form @submit.prevent="submitFeedback">
        <section class="feedback-section">
          <h2>课程安排问题</h2>
          <p>请选择您遇到的问题（可多选）：</p>
          
          <div class="checkbox-group">
            <div class="checkbox-item">
              <input 
                type="checkbox" 
                id="dependency" 
                v-model="feedback.issues.dependency"
              >
              <label for="dependency">
                <strong>课程依赖冲突</strong>
                <div class="description">主要由于某些课程需要按照特定顺序进行，但排课系统未能正确安排。</div>
              </label>
            </div>
            
            <div class="checkbox-item">
              <input 
                type="checkbox" 
                id="classroom" 
                v-model="feedback.issues.classroom"
              >
              <label for="classroom">
                <strong>教室冲突</strong>
                <div class="description">主要由于教室数量不足或排课系统错误。</div>
              </label>
            </div>
            
            <div class="checkbox-item">
              <input 
                type="checkbox" 
                id="resource" 
                v-model="feedback.issues.resource"
              >
              <label for="resource">
                <strong>资源问题</strong>
                <div class="description">主要由于特定教学资源（如实验室、设备）在同一时间被多门课程使用。</div>
              </label>
            </div>
            
            <div class="checkbox-item">
              <input 
                type="checkbox" 
                id="location" 
                v-model="feedback.issues.location"
              >
              <label for="location">
                <strong>位置冲突</strong>
                <div class="description">主要由于连续的课程被安排在距离过远的位置。</div>
              </label>
            </div>
            
            <div class="checkbox-item">
              <input 
                type="checkbox" 
                id="time" 
                v-model="feedback.issues.time"
              >
              <label for="time">
                <strong>时间冲突</strong>
                <div class="description">主要由于两门或多门课程被安排在同一时间，导致学生或教师无法同时参加。</div>
              </label>
            </div>
          </div>
        </section>

        <section class="feedback-section">
          <h2>课程内容满意度</h2>
          <div class="satisfaction-survey">
            <div class="rating-group">
              <p>您对课程内容的总体满意度：</p>
              <div class="rating">
                <div 
                  v-for="n in 5" 
                  :key="n" 
                  class="rating-item"
                  :class="{ active: feedback.satisfaction >= n }"
                  @click="feedback.satisfaction = n"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="star-icon">
                    <path fill-rule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clip-rule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>

            <div class="aspect-rating">
              <div class="aspect-item">
                <span>教学质量：</span>
                <div class="rating-small">
                  <div 
                    v-for="n in 5" 
                    :key="n" 
                    class="rating-item-small"
                    :class="{ active: feedback.teachingQuality >= n }"
                    @click="feedback.teachingQuality = n"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="star-icon-small">
                      <path fill-rule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clip-rule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>

              <div class="aspect-item">
                <span>课程内容：</span>
                <div class="rating-small">
                  <div 
                    v-for="n in 5" 
                    :key="n" 
                    class="rating-item-small"
                    :class="{ active: feedback.courseContent >= n }"
                    @click="feedback.courseContent = n"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="star-icon-small">
                      <path fill-rule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clip-rule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>

              <div class="aspect-item">
                <span>学习资源：</span>
                <div class="rating-small">
                  <div 
                    v-for="n in 5" 
                    :key="n" 
                    class="rating-item-small"
                    :class="{ active: feedback.learningResources >= n }"
                    @click="feedback.learningResources = n"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="star-icon-small">
                      <path fill-rule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clip-rule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section class="feedback-section">
          <h2>其他意见</h2>
          <div class="textarea-container">
            <textarea 
              v-model="feedback.comments" 
              placeholder="请输入您的其他意见或建议..."
              rows="4"
            ></textarea>
          </div>
        </section>

        <div class="submit-container">
          <button type="submit" class="submit-button">提交反馈</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue';

const feedback = reactive({
  issues: {
    dependency: false,
    classroom: false,
    resource: false,
    location: false,
    time: false
  },
  satisfaction: 0,
  teachingQuality: 0,
  courseContent: 0,
  learningResources: 0,
  comments: ''
});

const submitFeedback = () => {
  // 这里可以添加提交逻辑，例如发送到后端API
  console.log('提交的反馈:', feedback);
  alert('感谢您的反馈！');
  
  // 重置表单
  Object.keys(feedback.issues).forEach(key => {
    feedback.issues[key] = false;
  });
  feedback.satisfaction = 0;
  feedback.teachingQuality = 0;
  feedback.courseContent = 0;
  feedback.learningResources = 0;
  feedback.comments = '';
};
</script>

<style scoped>
@import '@/style/global.css';

.feedback-center {
  font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
  color: #333;
}

.header {
  text-align: center;
  margin-bottom: 30px;
}

.header h1 {
  color: #1976d2;
  margin-bottom: 10px;
  font-size: 50px;
  font-family: 'ZPMDZ', sans-serif;
  font-weight: 1000;
}

.header p {
  color: #666;
  font-family: 'ZCOOLXiaoWei', sans-serif;
}

.card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 30px;
}

.feedback-section {
  margin-bottom: 30px;
}

.feedback-section h2 {
  color: #1976d2;
  font-size: 1.3rem;
  margin-bottom: 15px;
  padding-bottom: 8px;
  border-bottom: 2px solid #e3f2fd;
}

.checkbox-group {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.checkbox-item {
  display: flex;
  align-items: flex-start;
  padding: 12px;
  border-radius: 6px;
  background-color: #f5f9ff;
  transition: background-color 0.2s;
}

.checkbox-item:hover {
  background-color: #e3f2fd;
}

.checkbox-item input[type="checkbox"] {
  margin-top: 4px;
  margin-right: 12px;
  width: 18px;
  height: 18px;
  accent-color: #1976d2;
}

.checkbox-item label {
  flex: 1;
  cursor: pointer;
}

.description {
  margin-top: 4px;
  font-size: 0.9rem;
  color: #666;
}

.satisfaction-survey {
  background-color: #f5f9ff;
  padding: 20px;
  border-radius: 6px;
}

.rating-group {
  margin-bottom: 20px;
}

.rating {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

.rating-item {
  cursor: pointer;
  color: #ccc;
  transition: color 0.2s;
}

.rating-item.active {
  color: #1976d2;
}

.star-icon {
  width: 30px;
  height: 30px;
}

.aspect-rating {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.aspect-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.rating-small {
  display: flex;
  gap: 5px;
}

.rating-item-small {
  cursor: pointer;
  color: #ccc;
  transition: color 0.2s;
}

.rating-item-small.active {
  color: #1976d2;
}

.star-icon-small {
  width: 20px;
  height: 20px;
}

.textarea-container {
  margin-top: 10px;
}

textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  resize: vertical;
  font-family: inherit;
  transition: border-color 0.2s;
}

textarea:focus {
  outline: none;
  border-color: #1976d2;
}

.submit-container {
  display: flex;
  justify-content: center;
  margin-top: 30px;
}

.submit-button {
  background-color: #1976d2;
  color: white;
  border: none;
  padding: 12px 30px;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.submit-button:hover {
  background-color: #1565c0;
}

@media (max-width: 600px) {
  .card {
    padding: 20px;
  }
  
  .aspect-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 5px;
  }
}
</style>