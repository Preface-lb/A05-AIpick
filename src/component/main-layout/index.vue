<script setup lang="ts"></script>

<template>
  <el-container>
    <el-main class="custom-main"><router-view></router-view></el-main>
  </el-container>
</template>

<style scoped>
.custom-main {
  padding: 0 !important; /* 重置 el-main 的内边距 */
}
</style>
