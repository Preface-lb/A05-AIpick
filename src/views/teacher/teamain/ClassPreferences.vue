<template>
  <div class="class-preferences">
    <h2 class="preferences-title">上课偏好</h2>
    <div class="preferences-container">
      <div class="preference-section">
        <h3>上课时间偏好</h3>
        <div class="preference-item">
          <input
            type="checkbox"
            id="morning"
            v-model="timePreferences.morning"
          />
          <label for="morning">上午</label>
        </div>
        <div class="preference-item">
          <input
            type="checkbox"
            id="afternoon"
            v-model="timePreferences.afternoon"
          />
          <label for="afternoon">下午</label>
        </div>
        <div class="preference-item">
          <input
            type="checkbox"
            id="evening"
            v-model="timePreferences.evening"
          />
          <label for="evening">晚上</label>
        </div>
      </div>

      <div class="preference-section">
        <h3>课程类型偏好</h3>
        <div class="preference-item">
          <input
            type="checkbox"
            id="lecture"
            v-model="coursePreferences.lecture"
          />
          <label for="lecture">理论课</label>
        </div>
        <div class="preference-item">
          <input type="checkbox" id="lab" v-model="coursePreferences.lab" />
          <label for="lab">实验课</label>
        </div>
        <div class="preference-item">
          <input
            type="checkbox"
            id="discussion"
            v-model="coursePreferences.discussion"
          />
          <label for="discussion">讨论课</label>
        </div>
      </div>

      <div class="preference-section">
        <h3>教室类型偏好</h3>
        <div class="preference-item">
          <input
            type="checkbox"
            id="regular"
            v-model="classroomPreferences.regular"
          />
          <label for="regular">普通教室</label>
        </div>
        <div class="preference-item">
          <input
            type="checkbox"
            id="lab-classroom"
            v-model="classroomPreferences.lab"
          />
          <label for="lab-classroom">实验教室</label>
        </div>
        <div class="preference-item">
          <input
            type="checkbox"
            id="multimedia"
            v-model="classroomPreferences.multimedia"
          />
          <label for="multimedia">多媒体教室</label>
        </div>
      </div>

      <div class="preference-section">
        <h3>语言偏好</h3>
        <div class="language-preference">
          <select v-model="languagePreference">
            <option value="中文">中文</option>
            <option value="英文">英文</option>
          </select>
        </div>
      </div>
    </div>
  </div>
</template>
  
  <script>
export default {
  data() {
    return {
      timePreferences: {
        morning: false,
        afternoon: false,
        evening: false,
      },
      coursePreferences: {
        lecture: false,
        lab: false,
        discussion: false,
      },
      classroomPreferences: {
        regular: false,
        lab: false,
        multimedia: false,
      },
      languagePreference: '中文',
    }
  },
}
</script>
  
  <style>
.class-preferences {
  font-family: 'Arial', sans-serif;
  max-width: 800px;
  margin: 20px auto;
  padding: 20px;
  background-color: #ffffff;
  border-radius: 15px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.preferences-title {
  text-align: center;
  color: #333;
  margin-bottom: 20px;
  font-size: 24px;
  font-weight: bold;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 10px;
  background: linear-gradient(135deg, #ffffff 0%, #f8f8f8 100%);
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.preferences-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.preference-section {
  background-color: #f8f9fa;
  border-radius: 10px;
  padding: 15px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.preference-section h3 {
  font-size: 18px;
  font-weight: bold;
  color: #333;
  margin-bottom: 10px;
}

.preference-item {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.preference-item input[type='checkbox'] {
  margin-right: 10px;
  transform: scale(1.2);
}

.preference-item label {
  font-size: 14px;
  color: #666;
}

.language-preference {
  display: flex;
  justify-content: center;
  margin-top: 10px;
}

.language-preference select {
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
}

.language-preference select:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 4px rgba(0, 123, 255, 0.5);
}
</style>