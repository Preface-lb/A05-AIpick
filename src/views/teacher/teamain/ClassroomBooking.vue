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
          <select
            v-model="filters.campus"
            @change="onFilterChange"
            class="border p-2 rounded"
          >
            <option value="">全部校区</option>
            <option value="库尔勒校区">库尔勒校区</option>
            <option value="铁门关校区">铁门关校区</option>
          </select>

          <select
            v-model="filters.airConditioner"
            @change="onFilterChange"
            class="border p-2 rounded"
          >
            <option value="">空调不限</option>
            <option :value="1">有空调</option>
            <option :value="0">无空调</option>
          </select>

          <!-- 新增教室类型选择框 -->
          <select
            v-model="filters.classroomType"
            @change="onFilterChange"
            class="border p-2 rounded"
          >
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
    <div
      class="table-container mt-6 bg-white rounded-xl shadow-md overflow-hidden"
    >
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr
              class="bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              <th class="px-6 py-3 sticky top-0">教室编号</th>
              <th class="px-6 py-3 sticky top-0">位置</th>
              <th class="px-6 py-3 sticky top-0">容量</th>
              <th class="px-6 py-3 sticky top-0">教室类型</th>
              <th class="px-6 py-3 sticky top-0">设备状态</th>
              <th class="px-6 py-3 sticky top-0">操作</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr
              v-for="classroom in classrooms"
              :key="classroom.id"
              class="hover:bg-gray-50 transition-colors duration-150"
            >
              <td class="px-6 py-4 text-sm font-medium text-gray-900">
                {{ classroom.name }}
              </td>
              <td class="px-6 py-4 text-sm text-gray-500">
                {{ classroom.building }} {{ classroom.floor }}楼
              </td>
              <td class="px-6 py-4 text-sm text-gray-500">
                {{ classroom.size }}人
              </td>
              <td class="px-6 py-4 text-sm text-gray-500">
                {{ classroom.classroomType }}
              </td>
              <td class="px-6 py-4">
                <span
                  :class="
                    classroom.deviceStatus === 1
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  "
                  class="px-2 inline-flex text-xs font-semibold rounded-full"
                >
                  {{ classroom.deviceStatus === 1 ? '正常' : '维修' }}
                </span>
              </td>
              <td class="px-6 py-4 text-sm text-gray-500">
                <button
                  v-if="classroom.deviceStatus === 1"
                  @click="openTimeSlotModal(classroom.id)"
                  class="px-3 py-1 text-sm text-white bg-green-600 hover:bg-green-500 rounded-md transition-colors duration-200"
                >
                  预约
                </button>
                <button
                  v-else
                  disabled
                  class="px-3 py-1 text-sm text-white bg-gray-400 cursor-not-allowed rounded-md"
                >
                  已预约
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 分页 -->
      <div
        class="px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6"
      >
        <p class="text-sm text-gray-700">
          显示第 <span class="font-medium">{{ pagination.pageNum }}</span> 页，
          共 <span class="font-medium">{{ pagination.total }}</span> 条记录
        </p>
        <nav class="inline-flex space-x-1">
          <button
            @click="prevPage"
            :disabled="pagination.pageNum <= 1"
            class="px-3 py-1 border rounded hover:bg-gray-100 transition-colors duration-200"
          >
            上一页
          </button>
          <button
            v-for="page in pageRange"
            :key="page"
            @click="changePage(page)"
            class="px-3 py-1 border rounded hover:bg-gray-100 transition-colors duration-200"
            :class="{ 'bg-gray-200': page === pagination.pageNum }"
          >
            {{ page }}
          </button>
          <button
            @click="nextPage"
            :disabled="pagination.pageNum >= totalPages"
            class="px-3 py-1 border rounded hover:bg-gray-100 transition-colors duration-200"
          >
            下一页
          </button>
        </nav>
      </div>
    </div>

    <!-- 时间段选择模态框 -->
    <div
      v-if="timeSlotModalVisible"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div
        class="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 transform transition-all duration-300 scale-100 opacity-100"
      >
        <div class="p-6">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-medium text-gray-900">选择预约时间段</h3>
            <button
              @click="closeTimeSlotModal"
              class="text-gray-400 hover:text-gray-500"
            >
              <i class="fa fa-times"></i>
            </button>
          </div>

          <div class="mb-4">
            <p class="text-sm text-gray-600 mb-2">
              请选择您要预约的课程时间段：
            </p>
            <div class="grid grid-cols-2 gap-2">
              <div
                v-for="(timeSlot, index) in timeSlots"
                :key="index"
                class="relative"
              >
                <input
                  type="checkbox"
                  :id="'time-slot-' + index"
                  :value="timeSlot.value"
                  v-model="selectedTimeSlots"
                  class="hidden peer"
                />
                <label
                  :for="'time-slot-' + index"
                  class="block p-3 border rounded-md cursor-pointer text-center text-sm hover:bg-gray-50 transition-colors duration-200 peer-checked:bg-green-100 peer-checked:border-green-500"
                >
                  {{ timeSlot.label }}
                </label>
              </div>
            </div>
          </div>

          <div class="flex justify-end space-x-3">
            <button
              @click="closeTimeSlotModal"
              class="px-4 py-2 border text-gray-700 rounded-md hover:bg-gray-50 transition-colors duration-200"
            >
              取消
            </button>
            <button
              @click="submitBooking"
              class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-500 transition-colors duration-200"
            >
              确认预约
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed, watch } from 'vue'
import type {
  ClassroomItem,
  PaginationResult,
  ClassroomFilters,
  BookingTimeSlots,
  BookingResult,
} from '@/api/tea-classroom'
import { getCourseTable, submitClassroomBooking } from '@/api/tea-classroom'

export default defineComponent({
  name: 'ClassroomBooking',
  setup() {
    const classrooms = ref<ClassroomItem[]>([])
    const pagination = ref({ pageNum: 1, pageSize: 10, total: 0 })
    const loading = ref(false)
    const filters = ref<ClassroomFilters>({
      campus: '',
      airConditioner: undefined,
      classroomType: '',
    })

    // 时间段选择相关
    const timeSlotModalVisible = ref(false)
    const currentClassroomId = ref(0)
    const timeSlots = ref([
      { label: '第1节 (08:00-08:45)', value: 'one' },
      { label: '第2节 (08:55-09:40)', value: 'two' },
      { label: '第3节 (10:00-10:45)', value: 'three' },
      { label: '第4节 (10:55-11:40)', value: 'four' },
      { label: '第5节 (14:00-14:45)', value: 'five' },
      { label: '第6节 (14:55-15:40)', value: 'six' },
      { label: '第7节 (16:00-16:45)', value: 'seven' },
      { label: '第8节 (16:55-17:40)', value: 'eight' },
      { label: '第9节 (19:00-19:45)', value: 'nine' },
      { label: '第10节 (19:55-20:40)', value: 'ten' },
      { label: '第11节 (20:50-21:35)', value: 'eleven' },
    ])
    const selectedTimeSlots = ref<string[]>([])

    const totalPages = computed(() =>
      Math.ceil(pagination.value.total / pagination.value.pageSize),
    )

    const fetchClassrooms = async () => {
      loading.value = true
      try {
        const res: PaginationResult = await getCourseTable(
          pagination.value.pageNum,
          pagination.value.pageSize,
          filters.value,
        )
        classrooms.value = res.rows
        pagination.value.total = res.total
      } catch (error) {
        console.error('获取教室列表失败', error)
        alert('获取教室列表失败，请稍后再试')
      } finally {
        loading.value = false
      }
    }

    // 打开时间段选择模态框
    const openTimeSlotModal = (id: number) => {
      const room = classrooms.value.find((r) => r.id === id)
      if (!room || room.deviceStatus !== 1) return

      currentClassroomId.value = id
      selectedTimeSlots.value = [] // 清空之前的选择
      timeSlotModalVisible.value = true
    }

    // 关闭时间段选择模态框
    const closeTimeSlotModal = () => {
      timeSlotModalVisible.value = false
    }

    // 提交预约
    const submitBooking = async () => {
      if (selectedTimeSlots.value.length === 0) {
        alert('请至少选择一个时间段')
        return
      }

      // 构建提交数据
      const bookingData: BookingTimeSlots = {
        one: 0,
        two: 0,
        three: 0,
        four: 0,
        five: 0,
        six: 0,
        seven: 0,
        eight: 0,
        nine: 0,
        ten: 0,
        eleven: 0,
        classroomId: currentClassroomId.value,
      }

      // 根据选择设置时间段（1是选中，0是没选）
      selectedTimeSlots.value.forEach((slot) => {
        bookingData[slot as keyof BookingTimeSlots] = 1
      })

       try {
    loading.value = true;
    await submitClassroomBooking(bookingData); // 直接调用，成功时无需接收返回值
    
    // 更新教室状态（无论接口是否返回状态，本地直接更新）
    const roomIndex = classrooms.value.findIndex(
      r => r.id === currentClassroomId.value
    );
    if (roomIndex !== -1) {
      classrooms.value[roomIndex].deviceStatus = 0;
    }
    
    alert(`预约成功！时间段：${
      selectedTimeSlots.value
        .map(slot => timeSlots.value.find(t => t.value === slot)?.label || '')
        .join(', ')
    }`);
  } catch (error: any) {
    // 错误处理统一在 catch 中
    alert(`预约失败：${error.message || '请稍后再试'}`);
  } finally {
    timeSlotModalVisible.value = false;
    loading.value = false;
  }
    }

    const pageRange = computed(() => {
      const current = pagination.value.pageNum
      const total = totalPages.value
      const start = Math.max(1, current - 2)
      const end = Math.min(total, start + 4)
      return Array.from({ length: end - start + 1 }, (_, i) => start + i)
    })

    const prevPage = () => {
      if (pagination.value.pageNum > 1) {
        pagination.value.pageNum--
        fetchClassrooms()
      }
    }

    const nextPage = () => {
      if (pagination.value.pageNum < totalPages.value) {
        pagination.value.pageNum++
        fetchClassrooms()
      }
    }

    const changePage = (page: number) => {
      if (page !== pagination.value.pageNum) {
        pagination.value.pageNum = page
        fetchClassrooms()
      }
    }

    const onFilterChange = () => {
      pagination.value.pageNum = 1
      fetchClassrooms()
    }

    onMounted(() => {
      fetchClassrooms()
    })

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
      openTimeSlotModal,
      closeTimeSlotModal,
      submitBooking,
      timeSlotModalVisible,
      timeSlots,
      selectedTimeSlots,
    }
  },
})
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
