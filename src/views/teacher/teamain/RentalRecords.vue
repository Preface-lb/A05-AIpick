<template>
  <div class="rental-records">
    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>日期</th>
            <th>资源类型</th>
            <th>资源名称</th>
            <th>租用时间段</th>
            <th>用途</th>
            <th>状态</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="record in rentalRecords" :key="record.id">
            <td>{{ record.date }}</td>
            <td>{{ record.resourceType }}</td>
            <td>{{ record.resourceName }}</td>
            <td>{{ record.timePeriod }}</td>
            <td>{{ record.purpose }}</td>
            <td
              :class="record.status === '进行中' ? 'in-progress' : 'completed'"
            >
              {{ record.status }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
  
<script>
import { ref, onMounted } from 'vue';
import { getRentalRecords } from '@/api/rental';

export default {
  setup() {
    const rentalRecords = ref([]);

    const loadRentalRecords = async () => {
      try {
        const data = await getRentalRecords();
        rentalRecords.value = data;
      } catch (error) {
        console.error('获取租用记录失败:', error);
      }
    };

    onMounted(() => {
      loadRentalRecords();
    });

    return {
      rentalRecords
    };
  }
};
</script>

  
  <style>
.rental-records {
  font-family: 'Arial', sans-serif;
  max-width: 1200px;
  margin: 20px auto;
  padding: 20px;
  background-color: #ffffff;
  border-radius: 15px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
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

.in-progress {
  color: #28a745;
  font-weight: bold;
}

.completed {
  color: #007bff;
  font-weight: bold;
}

/* 添加一些额外的美化 */
th:first-child,
td:first-child {
  border-radius: 8px 0 0 8px;
}

th:last-child,
td:last-child {
  border-radius: 0 8px 8px 0;
}

tr:first-child th {
  background-color: #f1f3f5;
  border-top: none;
}

tr:last-child td {
  border-bottom: none;
}
</style>