<template>
    <div class="hello-world">
      <h2>{{ message }}</h2>
      <button @click="updateMessage">点击更新消息</button>
    </div>
  </template>
  
  <script>
  export default {
    name: "HelloWorld",
    data() {
      return {
        message: "Hello Vue!"
      };
    },
    methods: {
      updateMessage() {
        this.message = "消息已更新！";
      }
    }
  };
  </script>
  
  <style scoped>
  .hello-world {
    margin: 20px;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 8px;
  }
  </style>