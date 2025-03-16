<template>
  <div class="advanced-scheduling">
    <!-- 教师排课节数限制 -->
    <section class="teacher-limit-section">
      <h2>教师排课节数限制</h2>
      <div class="teacher-limit-container">
        <div class="teacher-list">
          <div class="teacher-item" v-for="teacher in teachers" :key="teacher.id">
            <div class="teacher-info">
              <span class="teacher-name">{{ teacher.name }}</span>
            </div>
            <div class="limit-settings">
              <div class="limit-item">
                <label>每天：</label>
                <input type="number" v-model.number="teacher.dailyMax" class="limit-input">
              </div>
              <div class="limit-item">
                <label>每周：</label>
                <input type="number" v-model.number="teacher.weeklyMax" class="limit-input">
              </div>
              <div class="limit-item">
                <label>上午：</label>
                <input type="number" v-model.number="teacher.morningMax" class="limit-input">
              </div>
              <div class="limit-item">
                <label>下午：</label>
                <input type="number" v-model.number="teacher.afternoonMax" class="limit-input">
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 特定课程安排规则 -->
    <section class="special-course-section">
      <h2>特定课程安排规则</h2>
      <div class="special-course-container">
        <div class="course-rule">
          <label>体育课只能安排在下午：</label>
          <input type="checkbox" v-model="sportsAfternoonOnly" class="rule-checkbox">
        </div>
        <div class="course-rule">
          <label>体育课后是否安排课：</label>
          <select v-model="courseAfterSports" class="rule-select">
            <option value="allow">允许</option>
            <option value="disallow">不允许</option>
          </select>
        </div>
        <div class="course-rule">
          <label>学校晚上是否上课：</label>
          <select v-model="eveningClasses" class="rule-select">
            <option value="yes">是</option>
            <option value="no">否</option>
          </select>
        </div>
        <div class="course-rule">
          <label>实验课程是否只能安排在晚上：</label>
          <input type="checkbox" v-model="experimentsEveningOnly" class="rule-checkbox">
        </div>
      </div>
    </section>

    <!-- 多学时课程排课规则 -->
    <section class="multi-hour-course-section">
      <h2>多学时课程排课规则</h2>
      <div class="multi-hour-container">
        <div class="multi-hour-rule">
          <label>多学时课程是否连续排：</label>
          <select v-model="multiHourContinuous" class="rule-select">
            <option value="yes">是</option>
            <option value="no">否</option>
          </select>
        </div>
      </div>
    </section>

    <!-- 周学时安排方式 -->
    <section class="weekly-hour-section">
      <h2>周学时安排方式</h2>
      <div class="weekly-hour-container">
        <div class="weekly-hour-rule">
          <label>当周学时无法被连排节次整除时：</label>
          <select v-model="weeklyHourArrangement" class="rule-select">
            <option value="split">按单双周拆分</option>
            <option value="reduce">降低连排节次</option>
          </select>
        </div>
      </div>
    </section>

    <!-- 保存按钮 -->
    <div class="save-section">
      <button class="save-btn" @click="saveSettings">保存设置</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AdvancedScheduling',
  data() {
    return {
      teachers: [
        {
          id: 1,
          name: '男老师',
          dailyMax: 4,
          weeklyMax: 12,
          morningMax: 2,
          afternoonMax: 2
        },
        {
          id: 2,
          name: '女老师',
          dailyMax: 4,
          weeklyMax: 12,
          morningMax: 2,
          afternoonMax: 2
        }
      ],
      sportsAfternoonOnly: true,
      courseAfterSports: 'disallow',
      eveningClasses: 'yes',
      experimentsEveningOnly: false,
      multiHourContinuous: 'yes',
      weeklyHourArrangement: 'split'
    };
  },
  methods: {
    saveSettings() {
      console.log('保存的设置:', {
        teachers: this.teachers,
        sportsAfternoonOnly: this.sportsAfternoonOnly,
        courseAfterSports: this.courseAfterSports,
        eveningClasses: this.eveningClasses,
        experimentsEveningOnly: this.experimentsEveningOnly,
        multiHourContinuous: this.multiHourContinuous,
        weeklyHourArrangement: this.weeklyHourArrangement
      });

      alert('设置已保存！');
    }
  }
};
</script>

<style scoped>
/* 整体容器样式 */
.advanced-scheduling {
  max-width: 1200px;
  margin: 0 auto;
  padding: 30px;
  background-color: #f8f9fa;
  border-radius: 12px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  font-family: 'Helvetica Neue', Arial, sans-serif;
}

/* 模块标题样式 */
section {
  margin-bottom: 40px;
  background-color: white;
  padding: 25px;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
}

h2 {
  font-size: 22px;
  color: #2c3e50;
  margin-bottom: 25px;
  border-bottom: 2px solid #e2e7ee;
  padding-bottom: 10px;
}

/* 教师排课节数限制样式 */
.teacher-limit-container {
  margin-top: 15px;
}

.teacher-list {
  margin-top: 15px;
}

.teacher-item {
  border-bottom: 1px solid #e2e7ee;
  padding: 15px 0;
}

.teacher-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.teacher-name {
  font-weight: 500;
}

.limit-settings {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 15px;
}

.limit-item {
  display: flex;
  align-items: center;
}

.limit-item label {
  flex: 1;
  font-weight: 500;
  color: #2c3e50;
}

.limit-input {
  flex: 1;
  padding: 6px;
  border: 1px solid #e2e7ee;
  border-radius: 4px;
  text-align: center;
}

/* 特定课程安排规则样式 */
.special-course-container {
  margin-top: 15px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 15px;
}

.course-rule {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}

.course-rule label {
  flex: 1;
  font-weight: 500;
  color: #2c3e50;
}

.rule-checkbox {
  margin-left: 10px;
}

.rule-select {
  flex: 1;
  padding: 6px;
  border: 1px solid #e2e7ee;
  border-radius: 4px;
}

/* 多学时课程排课规则样式 */
.multi-hour-container {
  margin-top: 15px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 15px;
}

/* 周学时安排方式样式 */
.weekly-hour-container {
  margin-top: 15px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 15px;
}

/* 保存按钮样式 */
.save-section {
  text-align: center;
  margin-top: 30px;
}

.save-btn {
  background: linear-gradient(135deg, #1a73e8, #4285f4);
  color: white;
  padding: 14px 32px;
  font-size: 16px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.save-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}
</style>
