<template>
  <div class="notifications-dashboard">
    <div class="notification-stats">
      <div class="stat-card">
        <div class="stat-info">
          <span class="stat-value">2</span>
          <span class="stat-label">未读通知</span>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-info">
          <span class="stat-value">{{ notifications.length }}</span>
          <span class="stat-label">全部通知</span>
        </div>
      </div>
    </div>

    <transition-group 
      name="notification-list" 
      tag="div" 
      class="notification-grid"
    >
      <div 
        v-for="(notification, index) in notifications" 
        :key="index"
        class="notification-card"
        :class="{ 'unread': !notification.read }"
      >
        <div class="card-content">
          <div class="card-header">
            <h3 class="card-title">{{ notification.title }}</h3>
            <span class="card-date">{{ notification.date || '今天' }}</span>
          </div>
          <div class="card-type">
            <span class="type-label">{{ notification.type }}</span>
          </div>
          <div class="card-divider"></div>
          <p class="card-message">{{ notification.message }}</p>
          <div class="card-actions">
            <button class="action-button primary">
              标记已读
            </button>
            <button class="action-button secondary">
              详情
            </button>
          </div>
        </div>
      </div>
    </transition-group>

    <div class="pagination-container">
      <button class="pagination-button" disabled>
        <
      </button>
      <button class="pagination-number active">1</button>
      <button class="pagination-number">2</button>
      <button class="pagination-button">>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, h, computed } from 'vue';

// Data
const notifications = ref([
  {
    title: '调课通知',
    type: '调课',
    message: '2024年2月15日，数学课调至下午3点。请各位同学相互转告，按时参加。',
    date: '2024-02-10',
    read: false
  },
  {
    title: '选课通知',
    type: '选课',
    message: '2024年春季选课系统已开放，请及时登录系统进行选课。选课截止日期为2024年2月20日。',
    date: '2024-02-05',
    read: false
  },
  {
    title: '考试安排',
    type: '考试',
    message: '期末考试将于下周开始，请查看附件了解详细的考试时间和地点安排。',
    date: '2024-01-20',
    read: true
  },
  {
    title: '教材领取',
    type: '教材',
    message: '新学期教材已到，请各班班长于本周五前到教务处领取并分发。',
    date: '2024-01-15',
    read: true
  }
]);

// Methods
const getTypeClass = (type) => {
  const typeMap = {
    '调课': 'schedule',
    '选课': 'course',
    '考试': 'exam',
    '教材': 'book'
  };
  return typeMap[type] || 'default';
};
</script>

<style scoped>
/* Base Styles */
.notifications-dashboard {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Inter', 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif;
  color: #1a202c;
}

/* Notification Stats */
.notification-stats {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
}

.stat-card {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 16px;
  background: white;
  border-radius: 16px;
  padding: 16px 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(226, 232, 240, 0.8);
  transition: all 0.3s;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
}

.stat-info {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: 24px;
  font-weight: 700;
  color: #1e40af;
}

.stat-label {
  font-size: 14px;
  color: #64748b;
}

/* Notification Grid */
.notification-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
}

.notification-card {
  position: relative;
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(226, 232, 240, 0.8);
  transition: all 0.3s;
}

.notification-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.1);
}

.notification-card.unread::before {
  content: '';
  position: absolute;
  top: 16px;
  right: 16px;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
  z-index: 1;
}

.card-content {
  padding: 24px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.card-title {
  font-size: 18px;
  font-weight: 600;
  color: #1e3a8a;
  margin: 0;
  padding-right: 16px;
}

.card-date {
  font-size: 12px;
  color: #64748b;
  background: #f1f5f9;
  padding: 4px 8px;
  border-radius: 6px;
  white-space: nowrap;
}

.card-type {
  margin-bottom: 16px;
}

.type-label {
  display: inline-block;
  font-size: 13px;
  font-weight: 500;
  padding: 4px 10px;
  border-radius: 6px;
}

.type-label.schedule {
  color: #1e40af;
  background: rgba(59, 130, 246, 0.1);
}

.type-label.course {
  color: #5b21b6;
  background: rgba(139, 92, 246, 0.1);
}

.type-label.exam {
  color: #b91c1c;
  background: rgba(239, 68, 68, 0.1);
}

.type-label.book {
  color: #047857;
  background: rgba(16, 185, 129, 0.1);
}

.card-divider {
  height: 1px;
  background: linear-gradient(to right, rgba(226, 232, 240, 0), rgba(226, 232, 240, 1), rgba(226, 232, 240, 0));
  margin: 16px 0;
}

.card-message {
  font-size: 14px;
  line-height: 1.6;
  color: #475569;
  margin: 0 0 20px 0;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.card-actions {
  display: flex;
  gap: 12px;
}

.action-button {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
}

.action-button.primary {
  background: #3b82f6;
  color: white;
}

.action-button.primary:hover {
  background: #2563eb;
}

.action-button.secondary {
  background: #f1f5f9;
  color: #1e40af;
}

.action-button.secondary:hover {
  background: #e2e8f0;
}

/* Pagination */
.pagination-container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
}

.pagination-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: white;
  border: 1px solid #e2e8f0;
  color: #1e40af;
  cursor: pointer;
  transition: all 0.2s;
}

.pagination-button:hover:not(:disabled) {
  background: #f1f5f9;
  border-color: #cbd5e1;
}

.pagination-button:disabled {
  color: #cbd5e1;
  cursor: not-allowed;
}

.pagination-number {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: white;
  border: 1px solid #e2e8f0;
  font-size: 14px;
  font-weight: 500;
  color: #1e40af;
  cursor: pointer;
  transition: all 0.2s;
}

.pagination-number:hover:not(.active) {
  background: #f1f5f9;
  border-color: #cbd5e1;
}

.pagination-number.active {
  background: #3b82f6;
  color: white;
  border-color: #3b82f6;
}

/* Animations */
.notification-list-enter-active,
.notification-list-leave-active {
  transition: all 0.3s ease;
}

.notification-list-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.notification-list-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

/* Responsive Adjustments */
@media (max-width: 768px) {
  .notification-stats {
    flex-direction: column;
  }
  
  .notification-grid {
    grid-template-columns: 1fr;
  }
}
</style>