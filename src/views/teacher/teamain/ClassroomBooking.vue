<template>
  <div class="classroom-booking">
    <!-- 标题与筛选 -->
    <div class="header">
      <h2 class="text-2xl font-bold text-gray-800">教室预约系统</h2>
      <div class="flex items-center justify-between mt-4 space-x-4">
        <div class="flex items-center space-x-2">
          <span class="inline-block w-3 h-3 rounded-full bg-green-500"></span>
          <span class="text-sm text-gray-600">可用</span>
        </div>
        <div class="flex items-center space-x-2">
          <span class="inline-block w-3 h-3 rounded-full bg-red-500"></span>
          <span class="text-sm text-gray-600">已预约</span>
        </div>

        <div class="flex items-center space-x-4 ml-auto">
          <select v-model="filters.campus" @change="onFilterChange" class="border p-2 rounded">
            <option value="">全部校区</option>
            <option value="库尔勒校区">库尔勒校区</option>
            <option value="铁门关校区">铁门关校区</option>
          </select>

          <select v-model="filters.airConditioner" @change="onFilterChange" class="border p-2 rounded">
            <option value="">空调不限</option>
            <option :value="1">有空调</option>
            <option :value="0">无空调</option>
          </select>

          <!-- 新增教室类型选择框 -->
          <select v-model="filters.classroomType" @change="onFilterChange" class="border p-2 rounded">
            <option value="">教室类型不限</option>
            <option value="多媒体教室">多媒体教室</option>
            <option value="实训车间">实训车间</option>
            <option value="机房">机房</option>
            <option value="普通教室">普通教室</option>
            <option value="汽修实训室">汽修实训室</option>
            <option value="蒙台梭立实训室">蒙台梭立实训室</option>
            <option value="虚拟仿真实训室">虚拟仿真实训室</option>
            <option value="琴房">琴房</option>
            <option value="电工实训室">电工实训室</option>
            <option value="美术教室">美术教室</option>
            <option value="现代电气控制实训室">现代电气控制实训室</option>
            <option value="舞蹈教室">舞蹈教室</option>
            <option value="化工仿真实训室">化工仿真实训室</option>
            <option value="声乐教室">声乐教室</option>
            <option value="自动化生产线实训室">自动化生产线实训室</option>
            <option value="液压气动实训室">液压气动实训室</option>
            <option value="公共教室">公共教室</option>
            <option value="移动一体机">移动一体机</option>
            <option value="活动室">活动室</option>
            <option value="网络实训室">网络实训室</option>
            <option value="幼儿保健室">幼儿保健室</option>
            <option value="机械装调实训室">机械装调实训室</option>
            <option value="网络综合布线室">网络综合布线室</option>
          </select>
        </div>
      </div>
    </div>

    <!-- 表格 -->
    <div class="table-container mt-6 bg-white rounded-xl shadow-md overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <th class="px-6 py-3 sticky top-0">教室编号</th>
              <th class="px-6 py-3 sticky top-0">位置</th>
              <th class="px-6 py-3 sticky top-0">容量</th>
              <th class="px-6 py-3 sticky top-0">教室类型</th>
              <th class="px-6 py-3 sticky top-0">设备状态</th>
              <th class="px-6 py-3 sticky top-0">操作</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="classroom in classrooms" :key="classroom.id" class="hover:bg-gray-50 transition-colors duration-150">
              <td class="px-6 py-4 text-sm font-medium text-gray-900">{{ classroom.name }}</td>
              <td class="px-6 py-4 text-sm text-gray-500">{{ classroom.building }} {{ classroom.floor }}楼</td>
              <td class="px-6 py-4 text-sm text-gray-500">{{ classroom.size }}人</td>
              <td class="px-6 py-4 text-sm text-gray-500">{{ classroom.classroomType }}</td>
              <td class="px-6 py-4">
                <span :class="classroom.deviceStatus === 1 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'" class="px-2 inline-flex text-xs font-semibold rounded-full">
                  {{ classroom.deviceStatus === 1 ? '正常' : '维修' }}
                </span>
              </td>
              <td class="px-6 py-4 text-sm text-gray-500">
                <button
                  v-if="classroom.deviceStatus === 1"
                  @click="bookClassroom(classroom.id)"
                  class="px-3 py-1 text-sm text-white bg-green-600 hover:bg-green-500 rounded-md"
                >
                  预约
                </button>
                <button v-else disabled class="px-3 py-1 text-sm text-white bg-gray-400 cursor-not-allowed rounded-md">已预约</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 分页 -->
      <div class="px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
        <p class="text-sm text-gray-700">
          显示第 <span class="font-medium">{{ pagination.pageNum }}</span> 页，
          共 <span class="font-medium">{{ pagination.total }}</span> 条记录
        </p>
        <nav class="inline-flex space-x-1">
          <button @click="prevPage" :disabled="pagination.pageNum <= 1" class="px-3 py-1 border rounded">上一页</button>
          <button
            v-for="page in pageRange"
            :key="page"
            @click="changePage(page)"
            class="px-3 py-1 border rounded"
            :class="{ 'bg-gray-200': page === pagination.pageNum }"
          >
            {{ page }}
          </button>
          <button @click="nextPage" :disabled="pagination.pageNum >= totalPages" class="px-3 py-1 border rounded">下一页</button>
        </nav>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed, watch } from 'vue';
import type { ClassroomItem, PaginationResult, ClassroomFilters } from '@/api/tea-classroom';
import { getCourseTable } from '@/api/tea-classroom';

export default defineComponent({
  name: 'ClassroomBooking',
  setup() {
    const classrooms = ref<ClassroomItem[]>([]);
    const pagination = ref({ pageNum: 1, pageSize: 10, total: 0 });
    const loading = ref(false);
    const filters = ref<ClassroomFilters>({ campus: '', airConditioner: undefined, classroomType: '' });

    const totalPages = computed(() => Math.ceil(pagination.value.total / pagination.value.pageSize));

    const fetchClassrooms = async () => {
      loading.value = true;
      try {
        const res: PaginationResult = await getCourseTable(
          pagination.value.pageNum,
          pagination.value.pageSize,
          filters.value
        );
        classrooms.value = res.rows;
        pagination.value.total = res.total;
      } catch (error) {
        console.error('获取教室列表失败', error);
        alert('获取教室列表失败，请稍后再试');
      } finally {
        loading.value = false;
      }
    };

    const bookClassroom = (id: number) => {
      const room = classrooms.value.find(r => r.id === id);
      if (!room) return;
      loading.value = true;
      setTimeout(() => {
        if (room.deviceStatus === 1) {
          room.deviceStatus = 0;
          alert(`已成功预约教室 ${room.name}`);
        } else {
          alert(`教室 ${room.name} 已被预约`);
        }
        loading.value = false;
      }, 800);
    };

    const pageRange = computed(() => {
      const current = pagination.value.pageNum;
      const total = totalPages.value;
      const start = Math.max(1, current - 2);
      const end = Math.min(total, start + 4);
      return Array.from({ length: end - start + 1 }, (_, i) => start + i);
    });

    const prevPage = () => {
      if (pagination.value.pageNum > 1) {
        pagination.value.pageNum--;
        fetchClassrooms();
      }
    };

    const nextPage = () => {
      if (pagination.value.pageNum < totalPages.value) {
        pagination.value.pageNum++;
        fetchClassrooms();
      }
    };

    const changePage = (page: number) => {
      if (page !== pagination.value.pageNum) {
        pagination.value.pageNum = page;
        fetchClassrooms();
      }
    };

    const onFilterChange = () => {
      pagination.value.pageNum = 1;
      fetchClassrooms();
    };

    onMounted(() => {
      fetchClassrooms();
    });

    return {
      classrooms,
      pagination,
      filters,
      loading,
      totalPages,
      pageRange,
      prevPage,
      nextPage,
      changePage,
      onFilterChange,
      bookClassroom,
    };
  },
});
</script>

<style scoped>
.header {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
th {
  position: sticky;
  top: 0;
  z-index: 10;
}
tr {
  animation: fadeIn 0.3s ease forwards;
}
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>