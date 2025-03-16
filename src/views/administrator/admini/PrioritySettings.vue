<template>
  <div class="scheduling-system">
    
    <!-- 优先级设置模块 -->
    <section class="priority-section">
      <h2>优先级设置</h2>
      
      <!-- 学生所在院系优先 -->
      <div class="priority-block">
        <h3>学生所在院系优先</h3>
        <div class="priority-list">
          <draggable v-model="studentDepartments" handle=".drag-handle">
            <template #item="{ element }">
              <div class="priority-item">
                <span class="drag-handle">↔</span>
                <span class="priority-name">{{ element.name }}</span>
                <input type="number" v-model.number="element.priority" class="priority-input" @change="updatePriorities">
                <button class="delete-btn" @click="removeItem('studentDepartments', element.id)">删除</button>
              </div>
            </template>
          </draggable>
          <div class="add-item">
            <input type="text" v-model="newStudentDepartment" placeholder="输入院系名称" class="add-input">
            <button class="add-btn" @click="addItem('studentDepartments')">添加</button>
          </div>
        </div>
      </div>
      
      <!-- 开课院系优先 -->
      <div class="priority-block">
        <h3>开课院系优先</h3>
        <div class="priority-list">
          <draggable v-model="offeringDepartments" handle=".drag-handle">
            <template #item="{ element }">
              <div class="priority-item">
                <span class="drag-handle">↔</span>
                <span class="priority-name">{{ element.name }}</span>
                <input type="number" v-model.number="element.priority" class="priority-input" @change="updatePriorities">
                <button class="delete-btn" @click="removeItem('offeringDepartments', element.id)">删除</button>
              </div>
            </template>
          </draggable>
          <div class="add-item">
            <input type="text" v-model="newOfferingDepartment" placeholder="输入院系名称" class="add-input">
            <button class="add-btn" @click="addItem('offeringDepartments')">添加</button>
          </div>
        </div>
      </div>
      
      <!-- 课程性质优先 -->
      <div class="priority-block">
        <h3>课程性质优先</h3>
        <div class="priority-list">
          <draggable v-model="courseTypes" handle=".drag-handle">
            <template #item="{ element }">
              <div class="priority-item">
                <span class="drag-handle">↔</span>
                <span class="priority-name">{{ element.name }}</span>
                <input type="number" v-model.number="element.priority" class="priority-input" @change="updatePriorities">
                <button class="delete-btn" @click="removeItem('courseTypes', element.id)">删除</button>
              </div>
            </template>
          </draggable>
          <div class="add-item">
            <input type="text" v-model="newCourseType" placeholder="输入课程性质" class="add-input">
            <button class="add-btn" @click="addItem('courseTypes')">添加</button>
          </div>
        </div>
      </div>
      
      <!-- 学时类型优先 -->
      <div class="priority-block">
        <h3>学时类型优先</h3>
        <div class="priority-list">
          <draggable v-model="hourTypes" handle=".drag-handle">
            <template #item="{ element }">
              <div class="priority-item">
                <span class="drag-handle">↔</span>
                <span class="priority-name">{{ element.name }}</span>
                <input type="number" v-model.number="element.priority" class="priority-input" @change="updatePriorities">
                <button class="delete-btn" @click="removeItem('hourTypes', element.id)">删除</button>
              </div>
            </template>
          </draggable>
          <div class="add-item">
            <input type="text" v-model="newHourType" placeholder="输入学时类型" class="add-input">
            <button class="add-btn" @click="addItem('hourTypes')">添加</button>
          </div>
        </div>
      </div>
      
      <!-- 课程类型优先 -->
      <div class="priority-block">
        <h3>课程类型优先</h3>
        <div class="priority-list">
          <draggable v-model="courseCategories" handle=".drag-handle">
            <template #item="{ element }">
              <div class="priority-item">
                <span class="drag-handle">↔</span>
                <span class="priority-name">{{ element.name }}</span>
                <input type="number" v-model.number="element.priority" class="priority-input" @change="updatePriorities">
                <button class="delete-btn" @click="removeItem('courseCategories', element.id)">删除</button>
              </div>
            </template>
          </draggable>
          <div class="add-item">
            <input type="text" v-model="newCourseCategory" placeholder="输入课程类型" class="add-input">
            <button class="add-btn" @click="addItem('courseCategories')">添加</button>
          </div>
        </div>
      </div>
    </section>
    
    <!-- 排课规则设置模块 -->
    <section class="rules-section">
      <h2>排课规则设置</h2>
      
      <!-- 连排节次规则 -->
      <div class="rule-block">
        <h3>连排节次规则</h3>
        <div class="rule-options">
          <div class="rule-option">
            <label>两节连排开始节次：</label>
            <input type="text" v-model="doublePeriods" placeholder="如：1、3、5、7" class="rule-input">
          </div>
          <div class="rule-option">
            <label>四节连排开始节次：</label>
            <input type="text" v-model="quadPeriods" placeholder="如：1、3、5" class="rule-input">
          </div>
        </div>
      </div>
      
      <!-- 班级固定教室设置 -->
      <div class="rule-block">
        <h3>班级固定教室设置</h3>
        <div class="rule-options">
          <div class="rule-option">
            <label>启用班级固定教室：</label>
            <input type="checkbox" v-model="fixedClassroomEnabled" class="rule-checkbox">
          </div>
          <div class="rule-option">
            <label>合班课程是否适用：</label>
            <input type="checkbox" v-model="combinedClassApplicable" class="rule-checkbox">
          </div>
        </div>
      </div>
      
      <!-- 教室集中度设置 -->
      <div class="rule-block">
        <h3>教室集中度设置</h3>
        <div class="rule-options">
          <div class="rule-option">
            <label>班级排课教室尽量集中：</label>
            <input type="checkbox" v-model="classroomConcentrationByClass" class="rule-checkbox">
          </div>
          <div class="rule-option">
            <label>教师排课教室尽量集中：</label>
            <input type="checkbox" v-model="classroomConcentrationByTeacher" class="rule-checkbox">
          </div>
          <div class="rule-option">
            <label>同一课程使用相同教室：</label>
            <input type="checkbox" v-model="sameClassroomForSameCourse" class="rule-checkbox">
          </div>
        </div>
      </div>
      
      <!-- 班级人数与教室容量匹配 -->
      <div class="rule-block">
        <h3>班级人数与教室容量匹配</h3>
        <div class="rule-options">
          <div class="rule-option">
            <label>自动匹配班级人数与教室容量：</label>
            <input type="checkbox" v-model="autoMatchCapacity" class="rule-checkbox">
          </div>
          <div class="rule-option">
            <label>最小教室容量：</label>
            <input type="number" v-model.number="minClassroomCapacity" class="rule-input-small">
          </div>
          <div class="rule-option">
            <label>最大教室容量：</label>
            <input type="number" v-model.number="maxClassroomCapacity" class="rule-input-small">
          </div>
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
import { Sortable } from 'sortablejs';
import { Draggable } from 'vue3-draggable';

export default {
  name: 'SchedulingSystem',
  components: {
    draggable: Draggable
  },
  data() {
    return {
      // 学生所在院系优先
      studentDepartments: [
        { id: 1, name: '计算机科学与技术学院', priority: 1 },
        { id: 2, name: '电子信息工程学院', priority: 2 },
        { id: 3, name: '机械工程学院', priority: 3 }
      ],
      newStudentDepartment: '',
      
      // 开课院系优先
      offeringDepartments: [
        { id: 1, name: '计算机科学与技术学院', priority: 1 },
        { id: 2, name: '电子信息工程学院', priority: 2 },
        { id: 3, name: '机械工程学院', priority: 3 }
      ],
      newOfferingDepartment: '',
      
      // 课程性质优先
      courseTypes: [
        { id: 1, name: '必修', priority: 1 },
        { id: 2, name: '选修', priority: 2 },
        { id: 3, name: '专业核心课', priority: 3 }
      ],
      newCourseType: '',
      
      // 学时类型优先
      hourTypes: [
        { id: 1, name: '理论学时', priority: 1 },
        { id: 2, name: '实验学时', priority: 2 },
        { id: 3, name: '上机学时', priority: 3 }
      ],
      newHourType: '',
      
      // 课程类型优先
      courseCategories: [
        { id: 1, name: '讲授型', priority: 1 },
        { id: 2, name: '讨论型', priority: 2 },
        { id: 3, name: '实践型', priority: 3 }
      ],
      newCourseCategory: '',
      
      // 连排节次规则
      doublePeriods: '1、3、5、7',
      quadPeriods: '1、3、5',
      
      // 班级固定教室设置
      fixedClassroomEnabled: true,
      combinedClassApplicable: false,
      
      // 教室集中度设置
      classroomConcentrationByClass: true,
      classroomConcentrationByTeacher: true,
      sameClassroomForSameCourse: true,
      
      // 班级人数与教室容量匹配
      autoMatchCapacity: true,
      minClassroomCapacity: 30,
      maxClassroomCapacity: 120
    };
  },
  methods: {
    // 添加新项
    addItem(listName) {
      let newList = this[listName];
      let newValue = this['new' + listName.charAt(0).toUpperCase() + listName.slice(1)];
      
      if (newValue.trim() === '') return;
      
      // 生成新ID
      let newId = newList.length > 0 ? Math.max(...newList.map(item => item.id)) + 1 : 1;
      
      // 添加新项
      newList.push({
        id: newId,
        name: newValue.trim(),
        priority: newList.length + 1
      });
      
      // 清空输入框
      this['new' + listName.charAt(0).toUpperCase() + listName.slice(1)] = '';
      
      // 更新优先级
      this.updatePriorities();
    },
    
    // 删除项
    removeItem(listName, id) {
      const index = this[listName].findIndex(item => item.id === id);
      if (index !== -1) {
        this[listName].splice(index, 1);
        this.updatePriorities();
      }
    },
    
    // 更新优先级
    updatePriorities() {
      // 这里可以根据需要对优先级进行排序和调整
      // 例如，根据优先级数值排序，或确保没有重复的优先级
    },
    
    // 保存设置
    saveSettings() {
      // 这里可以将设置保存到后端或本地存储
      console.log('保存设置:', {
        studentDepartments: this.studentDepartments,
        offeringDepartments: this.offeringDepartments,
        courseTypes: this.courseTypes,
        hourTypes: this.hourTypes,
        courseCategories: this.courseCategories,
        doublePeriods: this.doublePeriods,
        quadPeriods: this.quadPeriods,
        fixedClassroomEnabled: this.fixedClassroomEnabled,
        combinedClassApplicable: this.combinedClassApplicable,
        classroomConcentrationByClass: this.classroomConcentrationByClass,
        classroomConcentrationByTeacher: this.classroomConcentrationByTeacher,
        sameClassroomForSameCourse: this.sameClassroomForSameCourse,
        autoMatchCapacity: this.autoMatchCapacity,
        minClassroomCapacity: this.minClassroomCapacity,
        maxClassroomCapacity: this.maxClassroomCapacity
      });
      
      alert('设置已保存！');
    }
  }
};
</script>

<style scoped>
/* 整体容器样式 */
.scheduling-system {
  max-width: 1200px;
  margin: 0 auto;
  padding: 30px;
  background-color: #f8f9fa;
  border-radius: 12px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  font-family: 'Helvetica Neue', Arial, sans-serif;
}

/* 标题样式 */
.title {
  font-size: 28px;
  color: #1a73e8;
  text-align: center;
  margin-bottom: 40px;
  font-weight: 600;
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

h3 {
  font-size: 18px;
  color: #4a90e2;
  margin-bottom: 15px;
  padding-left: 10px;
  border-left: 4px solid #4a90e2;
}

/* 优先级设置块样式 */
.priority-block {
  margin-bottom: 30px;
}

/* 优先级列表样式 */
.priority-list {
  margin-top: 15px;
}

.priority-item {
  display: flex;
  align-items: center;
  padding: 12px;
  margin-bottom: 8px;
  background-color: #f8f9fa;
  border-radius: 6px;
  border-left: 4px solid #e2e7ee;
  transition: all 0.3s ease;
}

.priority-item:hover {
  background-color: #f0f4f8;
  border-left-color: #1a73e8;
}

.drag-handle {
  margin-right: 15px;
  cursor: move;
  color: #7f8c8d;
}

.priority-name {
  flex: 1;
  margin-right: 15px;
  font-weight: 500;
}

.priority-input {
  width: 60px;
  padding: 6px;
  border: 1px solid #e2e7ee;
  border-radius: 4px;
  text-align: center;
}

.delete-btn {
  background-color: #ea4335;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  margin-left: 10px;
}

.delete-btn:hover {
  background-color: #d33528;
}

/* 添加项样式 */
.add-item {
  display: flex;
  margin-top: 15px;
}

.add-input {
  flex: 1;
  padding: 8px;
  border: 1px solid #e2e7ee;
  border-radius: 4px;
  margin-right: 10px;
}

.add-btn {
  background-color: #1a73e8;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
}

.add-btn:hover {
  background-color: #1565c0;
}

/* 排课规则设置样式 */
.rule-block {
  margin-bottom: 30px;
}

.rule-options {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 15px;
}

.rule-option {
  display: flex;
  align-items: center;
}

.rule-option label {
  flex: 1;
  font-weight: 500;
  color: #2c3e50;
}

.rule-input {
  flex: 2;
  padding: 8px;
  border: 1px solid #e2e7ee;
  border-radius: 4px;
}

.rule-input-small {
  width: 80px;
  padding: 8px;
  border: 1px solid #e2e7ee;
  border-radius: 4px;
}

.rule-checkbox {
  margin-left: 10px;
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