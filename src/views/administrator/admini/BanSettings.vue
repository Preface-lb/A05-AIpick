<template>
  <div class="schedule-exclusion">
    <div class="page-header">
      <h2>排课规则设置</h2>
      <p class="subtitle">设置各维度的禁排规则，优化排课效果</p>
    </div>
    
    <!-- 时间维度禁排设置 -->
    <div class="exclusion-section">
      <div class="section-header">
        <h3>时间维度禁排设置</h3>
        <el-button type="primary" size="medium" @click="addTimeExclusion" class="add-button">
          <i class="el-icon-plus"></i> 添加时间禁排规则
        </el-button>
      </div>
      <el-table 
        :data="timeExclusions" 
        border 
        style="width: 100%"
        :header-cell-style="headerCellStyle"
        :cell-style="cellStyle"
        empty-text="暂无时间禁排规则，请点击添加按钮创建"
      >
        <el-table-column prop="dateRange" label="日期范围" min-width="220">
          <template #default="scope">
            <el-date-picker
              v-model="scope.row.dateRange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              class="custom-date-picker"
            />
          </template>
        </el-table-column>
        <el-table-column prop="timeRange" label="时间段" min-width="220">
          <template #default="scope">
            <el-time-picker
              v-model="scope.row.timeRange"
              is-range
              format="HH:mm"
              value-format="HH:mm"
              range-separator="至"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              placeholder="选择时间范围"
              class="custom-time-picker"
            />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120" align="center">
          <template #default="scope">
            <el-button 
              size="small" 
              type="danger" 
              plain
              @click="deleteTimeExclusion(scope.$index)"
              class="delete-button"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    
    <!-- 教师维度禁排设置 -->
    <div class="exclusion-section">
      <div class="section-header">
        <h3>教师维度禁排设置</h3>
        <el-button type="primary" size="medium" @click="addTeacherExclusion" class="add-button">
          <i class="el-icon-plus"></i> 添加教师禁排规则
        </el-button>
      </div>
      <el-table 
        :data="teacherExclusions" 
        border 
        style="width: 100%"
        :header-cell-style="headerCellStyle"
        :cell-style="cellStyle"
        empty-text="暂无教师禁排规则，请点击添加按钮创建"
      >
        <el-table-column prop="teacherName" label="教师姓名" min-width="180">
          <template #default="scope">
            <el-input v-model="scope.row.teacherName" placeholder="请输入教师姓名" class="custom-input" />
          </template>
        </el-table-column>
        <el-table-column prop="dateRange" label="日期范围" min-width="220">
          <template #default="scope">
            <el-date-picker
              v-model="scope.row.dateRange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              class="custom-date-picker"
            />
          </template>
        </el-table-column>
        <el-table-column prop="timeRange" label="时间段" min-width="220">
          <template #default="scope">
            <el-time-picker
              v-model="scope.row.timeRange"
              is-range
              format="HH:mm"
              value-format="HH:mm"
              range-separator="至"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              placeholder="选择时间范围"
              class="custom-time-picker"
            />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120" align="center">
          <template #default="scope">
            <el-button 
              size="small" 
              type="danger" 
              plain
              @click="deleteTeacherExclusion(scope.$index)"
              class="delete-button"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    
    <!-- 学生维度禁排设置 -->
    <div class="exclusion-section">
      <div class="section-header">
        <h3>学生维度禁排设置</h3>
        <el-button type="primary" size="medium" @click="addStudentExclusion" class="add-button">
          <i class="el-icon-plus"></i> 添加学生禁排规则
        </el-button>
      </div>
      <el-table 
        :data="studentExclusions" 
        border 
        style="width: 100%"
        :header-cell-style="headerCellStyle"
        :cell-style="cellStyle"
        empty-text="暂无学生禁排规则，请点击添加按钮创建"
      >
        <el-table-column prop="className" label="班级" min-width="180">
          <template #default="scope">
            <el-input v-model="scope.row.className" placeholder="请输入班级名称" class="custom-input" />
          </template>
        </el-table-column>
        <el-table-column prop="dateRange" label="日期范围" min-width="220">
          <template #default="scope">
            <el-date-picker
              v-model="scope.row.dateRange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              class="custom-date-picker"
            />
          </template>
        </el-table-column>
        <el-table-column prop="timeRange" label="时间段" min-width="220">
          <template #default="scope">
            <el-time-picker
              v-model="scope.row.timeRange"
              is-range
              format="HH:mm"
              value-format="HH:mm"
              range-separator="至"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              placeholder="选择时间范围"
              class="custom-time-picker"
            />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120" align="center">
          <template #default="scope">
            <el-button 
              size="small" 
              type="danger" 
              plain
              @click="deleteStudentExclusion(scope.$index)"
              class="delete-button"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    
    <!-- 课程维度禁排设置 -->
    <div class="exclusion-section">
      <div class="section-header">
        <h3>课程维度禁排设置</h3>
        <el-button type="primary" size="medium" @click="addCourseExclusion" class="add-button">
          <i class="el-icon-plus"></i> 添加课程禁排规则
        </el-button>
      </div>
      <el-table 
        :data="courseExclusions" 
        border 
        style="width: 100%"
        :header-cell-style="headerCellStyle"
        :cell-style="cellStyle"
        empty-text="暂无课程禁排规则，请点击添加按钮创建"
      >
        <el-table-column prop="courseName" label="课程名称" min-width="180">
          <template #default="scope">
            <el-input v-model="scope.row.courseName" placeholder="请输入课程名称" class="custom-input" />
          </template>
        </el-table-column>
        <el-table-column prop="allowedTimeRange" label="允许的时间段" min-width="220">
          <template #default="scope">
            <el-time-picker
              v-model="scope.row.allowedTimeRange"
              is-range
              format="HH:mm"
              value-format="HH:mm"
              range-separator="至"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              placeholder="选择时间范围"
              class="custom-time-picker"
            />
          </template>
        </el-table-column>
        <el-table-column prop="frequency" label="授课频率" min-width="180">
          <template #default="scope">
            <el-input v-model="scope.row.frequency" placeholder="请输入授课频率（如每周2次）" class="custom-input" />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120" align="center">
          <template #default="scope">
            <el-button 
              size="small" 
              type="danger" 
              plain
              @click="deleteCourseExclusion(scope.$index)"
              class="delete-button"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    
    <!-- 教室维度禁排设置 -->
    <div class="exclusion-section">
      <div class="section-header">
        <h3>教室维度禁排设置</h3>
        <el-button type="primary" size="medium" @click="addClassroomExclusion" class="add-button">
          <i class="el-icon-plus"></i> 添加教室禁排规则
        </el-button>
      </div>
      <el-table 
        :data="classroomExclusions" 
        border 
        style="width: 100%"
        :header-cell-style="headerCellStyle"
        :cell-style="cellStyle"
        empty-text="暂无教室禁排规则，请点击添加按钮创建"
      >
        <el-table-column prop="classroomName" label="教室名称" min-width="180">
          <template #default="scope">
            <el-input v-model="scope.row.classroomName" placeholder="请输入教室名称" class="custom-input" />
          </template>
        </el-table-column>
        <el-table-column prop="maintenanceDateRange" label="维护日期范围" min-width="220">
          <template #default="scope">
            <el-date-picker
              v-model="scope.row.maintenanceDateRange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              class="custom-date-picker"
            />
          </template>
        </el-table-column>
        <el-table-column prop="maxWeeklyUsage" label="每周最大使用次数" width="180">
          <template #default="scope">
            <el-input-number 
              v-model="scope.row.maxWeeklyUsage" 
              :min="0" 
              controls-position="right"
              class="custom-number-input"
            />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120" align="center">
          <template #default="scope">
            <el-button 
              size="small" 
              type="danger" 
              plain
              @click="deleteClassroomExclusion(scope.$index)"
              class="delete-button"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    
    <!-- 角色维度禁排设置 -->
    <div class="exclusion-section">
      <div class="section-header">
        <h3>角色维度禁排设置</h3>
        <el-button type="primary" size="medium" @click="addRoleExclusion" class="add-button">
          <i class="el-icon-plus"></i> 添加角色禁排规则
        </el-button>
      </div>
      <el-table 
        :data="roleExclusions" 
        border 
        style="width: 100%"
        :header-cell-style="headerCellStyle"
        :cell-style="cellStyle"
        empty-text="暂无角色禁排规则，请点击添加按钮创建"
      >
        <el-table-column prop="roleName" label="角色名称" min-width="180">
          <template #default="scope">
            <el-select v-model="scope.row.roleName" placeholder="请选择角色" class="custom-select">
              <el-option label="教学秘书" value="teaching_secretary" />
              <el-option label="教研室主任" value="department_head" />
              <el-option label="教务管理员" value="teaching_admin" />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column prop="restrictedTime" label="受限时间段" min-width="220">
          <template #default="scope">
            <el-time-picker
              v-model="scope.row.restrictedTime"
              is-range
              format="HH:mm"
              value-format="HH:mm"
              range-separator="至"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              placeholder="选择时间范围"
              class="custom-time-picker"
            />
          </template>
        </el-table-column>
        <el-table-column prop="restrictedOperations" label="受限操作" min-width="220">
          <template #default="scope">
            <el-select 
              v-model="scope.row.restrictedOperations" 
              multiple 
              placeholder="请选择受限操作"
              class="custom-select"
            >
              <el-option label="排课" value="scheduling" />
              <el-option label="调课" value="adjusting" />
              <el-option label="查看课表" value="viewing" />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120" align="center">
          <template #default="scope">
            <el-button 
              size="small" 
              type="danger" 
              plain
              @click="deleteRoleExclusion(scope.$index)"
              class="delete-button"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    
    <!-- 保存按钮 -->
    <div class="save-button">
      <el-button type="primary" size="large" @click="saveExclusions" class="submit-button">
        保存所有禁排设置
      </el-button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      timeExclusions: [],
      teacherExclusions: [],
      studentExclusions: [],
      courseExclusions: [],
      classroomExclusions: [],
      roleExclusions: [],
      headerCellStyle: {
        background: '#f5f7fa',
        color: '#606266',
        fontWeight: 'bold',
        borderBottom: '1px solid #EBEEF5',
        padding: '12px 0'
      },
      cellStyle: {
        padding: '12px 8px'
      }
    };
  },
  methods: {
    // 时间维度
    addTimeExclusion() {
      this.timeExclusions.push({
        dateRange: [],
        timeRange: []
      });
      this.$message({
        message: '已添加新的时间禁排规则',
        type: 'success'
      });
    },
    deleteTimeExclusion(index) {
      this.$confirm('确定要删除该时间禁排规则吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.timeExclusions.splice(index, 1);
        this.$message({
          type: 'success',
          message: '删除成功!'
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });          
      });
    },
    
    // 教师维度
    addTeacherExclusion() {
      this.teacherExclusions.push({
        teacherName: '',
        dateRange: [],
        timeRange: []
      });
      this.$message({
        message: '已添加新的教师禁排规则',
        type: 'success'
      });
    },
    deleteTeacherExclusion(index) {
      this.$confirm('确定要删除该教师禁排规则吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.teacherExclusions.splice(index, 1);
        this.$message({
          type: 'success',
          message: '删除成功!'
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });          
      });
    },
    
    // 学生维度
    addStudentExclusion() {
      this.studentExclusions.push({
        className: '',
        dateRange: [],
        timeRange: []
      });
      this.$message({
        message: '已添加新的学生禁排规则',
        type: 'success'
      });
    },
    deleteStudentExclusion(index) {
      this.$confirm('确定要删除该学生禁排规则吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.studentExclusions.splice(index, 1);
        this.$message({
          type: 'success',
          message: '删除成功!'
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });          
      });
    },
    
    // 课程维度
    addCourseExclusion() {
      this.courseExclusions.push({
        courseName: '',
        allowedTimeRange: [],
        frequency: ''
      });
      this.$message({
        message: '已添加新的课程禁排规则',
        type: 'success'
      });
    },
    deleteCourseExclusion(index) {
      this.$confirm('确定要删除该课程禁排规则吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.courseExclusions.splice(index, 1);
        this.$message({
          type: 'success',
          message: '删除成功!'
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });          
      });
    },
    
    // 教室维度
    addClassroomExclusion() {
      this.classroomExclusions.push({
        classroomName: '',
        maintenanceDateRange: [],
        maxWeeklyUsage: 0
      });
      this.$message({
        message: '已添加新的教室禁排规则',
        type: 'success'
      });
    },
    deleteClassroomExclusion(index) {
      this.$confirm('确定要删除该教室禁排规则吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.classroomExclusions.splice(index, 1);
        this.$message({
          type: 'success',
          message: '删除成功!'
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });          
      });
    },
    
    // 角色维度
    addRoleExclusion() {
      this.roleExclusions.push({
        roleName: '',
        restrictedTime: [],
        restrictedOperations: []
      });
      this.$message({
        message: '已添加新的角色禁排规则',
        type: 'success'
      });
    },
    deleteRoleExclusion(index) {
      this.$confirm('确定要删除该角色禁排规则吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.roleExclusions.splice(index, 1);
        this.$message({
          type: 'success',
          message: '删除成功!'
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });          
      });
    },
    
    // 保存所有禁排设置
    saveExclusions() {
      const allExclusions = {
        timeExclusions: this.timeExclusions,
        teacherExclusions: this.teacherExclusions,
        studentExclusions: this.studentExclusions,
        courseExclusions: this.courseExclusions,
        classroomExclusions: this.classroomExclusions,
        roleExclusions: this.roleExclusions
      };
      
      // 这里可以将数据发送到后端API
      console.log('保存的禁排设置:', allExclusions);
      
      this.$notify({
        title: '成功',
        message: '所有禁排设置已保存成功！',
        type: 'success',
        duration: 3000
      });
    }
  }
};
</script>

<style scoped>
.schedule-exclusion {
  padding: 30px;
  background-color: #f8f9fc;
  min-height: 100vh;
  color: #333;
}

.page-header {
  margin-bottom: 30px;
  text-align: center;
}

.page-header h2 {
  font-size: 28px;
  color: #1e88e5;
  margin-bottom: 10px;
  font-weight: 500;
}

.subtitle {
  color: #606266;
  font-size: 16px;
}

.exclusion-section {
  margin-bottom: 30px;
  background-color: #fff;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.exclusion-section:hover {
  box-shadow: 0 4px 16px 0 rgba(0, 0, 0, 0.08);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-header h3 {
  margin: 0;
  color: #1e88e5;
  font-size: 18px;
  font-weight: 500;
  position: relative;
  padding-left: 12px;
}

.section-header h3::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 18px;
  background-color: #1e88e5;
  border-radius: 2px;
}

.add-button {
  background-color: #1e88e5;
  border-color: #1e88e5;
  padding: 10px 20px;
  transition: all 0.3s;
}

.add-button:hover {
  background-color: #1976d2;
  border-color: #1976d2;
}

.delete-button {
  transition: all 0.3s;
}

.delete-button:hover {
  background-color: #f56c6c;
  color: white;
}

.save-button {
  text-align: center;
  margin-top: 40px;
  padding-bottom: 40px;
}

.submit-button {
  padding: 12px 40px;
  font-size: 16px;
  background-color: #1e88e5;
  border-color: #1e88e5;
  transition: all 0.3s;
}

.submit-button:hover {
  background-color: #1976d2;
  border-color: #1976d2;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(30, 136, 229, 0.3);
}

/* 自定义表单控件样式 */
.custom-input {
  width: 100%;
}

.custom-date-picker,
.custom-time-picker,
.custom-select,
.custom-number-input {
  width: 100%;
}

/* 表格样式优化 */
:deep(.el-table) {
  border-radius: 4px;
  overflow: hidden;
}

:deep(.el-table th) {
  background-color: #f5f7fa !important;
}

:deep(.el-table--border th:first-child) {
  border-left: 1px solid #EBEEF5;
}

:deep(.el-table--border th:last-child) {
  border-right: 1px solid #EBEEF5;
}

:deep(.el-table__empty-text) {
  color: #909399;
  padding: 30px 0;
}

/* 响应式调整 */
@media screen and (max-width: 768px) {
  .schedule-exclusion {
    padding: 15px;
  }
  
  .exclusion-section {
    padding: 15px;
  }
  
  .section-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .section-header h3 {
    margin-bottom: 15px;
  }
  
  .add-button {
    width: 100%;
    margin-bottom: 15px;
  }
  
  .submit-button {
    width: 100%;
  }
}
</style>