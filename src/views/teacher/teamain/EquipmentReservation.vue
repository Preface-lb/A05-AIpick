<template>
  <div class="classroom-booking">
    <h2 class="booking-title">设备预约</h2>
    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>设备名称</th>
            <th>品牌型号</th>
            <th>位置</th>
            <th>可用时间段</th>
            <th>状态</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="classroom in classrooms" :key="classroom.id">
            <td>{{ classroom.roomNumber }}</td>
            <td>{{ classroom.location }}</td>
            <td>{{ classroom.capacity }}</td>
            <td>{{ classroom.availableTime }}</td>
            <td :class="classroom.status === '可用' ? 'available' : 'booked'">
              {{ classroom.status }}
            </td>
            <td>
              <button
                v-if="classroom.status === '可用'"
                @click="bookClassroom(classroom.id)"
                class="book-button"
              >
                预约
              </button>
              <button v-else class="booked-button" disabled>已预约</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
  
  <script>
export default {
  data() {
    return {
      classrooms: [
        {
          id: 1,
          roomNumber: 'C303',
          location: '西楼三层303',
          capacity: '200人',
          availableTime: '9:00-18:00',
          status: '可用',
        },
        {
          id: 2,
          roomNumber: 'C304',
          location: '西楼三层304',
          capacity: '150人',
          availableTime: '9:00-18:00',
          status: '已预约',
        },
        // 添加更多教室信息
      ],
    }
  },
  methods: {
    bookClassroom(classroomId) {
      // 在这里处理预约逻辑
      // 例如：更新教室状态、发送请求到后端等
      const classroom = this.classrooms.find((room) => room.id === classroomId)
      if (classroom && classroom.status === '可用') {
        classroom.status = '已预约'
        alert(`已成功预约教室 ${classroom.roomNumber}`)
      }
    },
  },
}
</script>
  
  <style>
.classroom-booking {
  font-family: 'Arial', sans-serif;
  max-width: 1200px;
  margin: 20px auto;
  padding: 20px;
  background-color: #ffffff;
  border-radius: 15px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.booking-title {
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

.table-container {
  overflow-x: auto;
  background-color: #f8f9fa;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

th,
td {
  border: 1px solid #e9ecef;
  padding: 15px;
  text-align: left;
  font-size: 14px;
}

th {
  background-color: #f1f3f5;
  font-weight: 600;
  color: #333;
}

tr:nth-child(even) {
  background-color: #ffffff;
}

tr:hover {
  background-color: #f8f9fa;
}

.available {
  color: #28a745;
  font-weight: bold;
}

.booked {
  color: #dc3545;
  font-weight: bold;
}

.book-button {
  background-color: #28a745;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s ease;
}

.book-button:hover {
  background-color: #218838;
}

.booked-button {
  background-color: #6c757d;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: not-allowed;
  font-size: 14px;
  opacity: 0.7;
}
</style>