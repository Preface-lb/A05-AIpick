<template>
  <div class="welcome-message">
    <h1>{{ message }}</h1>
  </div>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'WelcomeMessage',
  data() {
    return {
      message: '欢迎来到 查看成绩！',
    };
  },
});
</script>

<style scoped>
.welcome-message {
  text-align: center;
  margin-top: 50px;
}

h1 {
  color: #42b983;
  font-size: 24px;
}
</style>