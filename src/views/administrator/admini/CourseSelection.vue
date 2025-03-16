<template>
    <div class="course-selection">
      <h2 class="title">课程选择管理</h2>
      <div class="input-container">
        <label for="course-codes" class="input-label">
          请输入不选择的课程编码（多个编码用逗号分隔，可为空）：
        </label>
        <input
          type="text"
          id="course-codes"
          v-model="courseCodesInput"
          placeholder="例如：CS1012023001, MATH1012023002"
          class="course-input"
        />
        <button class="validate-btn" @click="validateCourseCodes">验证并提交</button>
      </div>
      <div v-if="validationResults.length > 0" class="results">
        <h3 class="results-title">验证结果：</h3>
        <ul class="results-list">
          <li
            v-for="(result, index) in validationResults"
            :key="index"
            :class="['result-item', result.valid ? 'valid' : 'invalid']"
          >
            <span class="code">{{ result.code }}</span>
            <span class="message">{{ result.message }}</span>
          </li>
        </ul>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: "CourseSelection",
    data() {
      return {
        courseCodesInput: '',
        validationResults: []
      };
    },
    methods: {
      async validateCourseCodes() {
        // 清空之前的验证结果
        this.validationResults = [];
        
        // 如果输入为空，直接触发事件返回空数组
        if (!this.courseCodesInput.trim()) {
          this.$emit('codes-validated', []);
          return;
        }
        
        // 分割输入的课程编码
        const codes = this.courseCodesInput.split(',').map(code => code.trim());
        
        // 验证每个课程编码
        for (const code of codes) {
          // 检查编码格式是否正确（11位）
          if (code.length !== 11) {
            this.validationResults.push({
              code: code,
              valid: false,
              message: '编码格式错误（长度不是11位）'
            });
            continue;
          }
          
          // 调用后端API验证编码是否存在
          try {
            const response = await this.checkCourseCodeExistence(code);
            if (response.exists) {
              this.validationResults.push({
                code: code,
                valid: true,
                message: '编码有效'
              });
            } else {
              this.validationResults.push({
                code: code,
                valid: false,
                message: '编码不存在'
              });
            }
          } catch (error) {
            this.validationResults.push({
              code: code,
              valid: false,
              message: '验证失败，请稍后再试'
            });
            console.error('验证课程编码失败:', error);
          }
        }
        
        // 触发事件，将验证结果传递给父组件
        this.$emit('codes-validated', this.validationResults);
      },
      async checkCourseCodeExistence(code) {
        // 这里模拟API调用
        return new Promise((resolve) => {
          setTimeout(() => {
            // 模拟部分编码不存在
            const exists = !['INVALID1234567890', 'TEST1234567890'].includes(code);
            resolve({ exists });
          }, 500);
        });
      }
    }
  };
  </script>
  
  <style scoped>
  /* 整体容器 */
  .course-selection {
    max-width: 900px;
    margin: 140px auto 50px;
    padding: 30px;
    background-color: #f8f9fa;
    border-radius: 12px;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
    font-family: 'Helvetica Neue', Arial, sans-serif;
  }
  
  /* 标题 */
  .title {
    font-size: 28px;
    color: #1a73e8;
    text-align: center;
    margin-bottom: 30px;
    font-weight: 600;
  }
  
  /* 输入容器 */
  .input-container {
    margin-bottom: 30px;
  }
  
  /* 标签 */
  .input-label {
    display: block;
    margin-bottom: 12px;
    font-size: 16px;
    font-weight: 500;
    color: #2c3e50;
  }
  
  /* 输入框 */
  .course-input {
    width: 100%;
    padding: 14px;
    font-size: 16px;
    border: 2px solid #e2e7ee;
    border-radius: 8px;
    outline: none;
    transition: border-color 0.3s ease, box-shadow 0.3s ease;
    margin-bottom: 20px;
  }
  .course-input:focus {
    border-color: #1a73e8;
    box-shadow: 0 0 8px rgba(26, 115, 232, 0.2);
  }
  
  /* 按钮 */
  .validate-btn {
    background: linear-gradient(135deg, #1a73e8, #4285f4);
    color: #fff;
    padding: 14px 28px;
    font-size: 16px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    display: block;
    margin: 0 auto;
  }
  .validate-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  }
  
  /* 验证结果区域 */
  .results {
    margin-top: 30px;
  }
  .results-title {
    font-size: 22px;
    color: #2c3e50;
    margin-bottom: 20px;
    text-align: center;
  }
  
  /* 结果列表 */
  .results-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  .result-item {
    padding: 14px 20px;
    border-radius: 6px;
    margin-bottom: 14px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 16px;
    transition: background-color 0.3s ease;
  }
  .result-item.valid {
    background-color: #e8f0fe;
    border-left: 5px solid #1a73e8;
    color: #1a73e8;
  }
  .result-item.invalid {
    background-color: #fef0f0;
    border-left: 5px solid #ea4335;
    color: #ea4335;
  }
  .code {
    font-weight: 500;
  }
  .message {
    font-style: italic;
  }
  </style>