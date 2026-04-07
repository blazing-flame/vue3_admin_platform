<template>
  <div>
    <router-view />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
onMounted(() => {
  const savedColor = localStorage.getItem('themeColor')
  if (savedColor) {
    document.documentElement.style.setProperty('--el-color-primary', savedColor)
    document.documentElement.style.setProperty('--el-color-success', savedColor)
    document.documentElement.style.setProperty('--el-color-warning', savedColor)
    document.documentElement.style.setProperty('--el-color-danger', savedColor)
    document.documentElement.style.setProperty('--el-color-info', savedColor)
  }
})
</script>

<style scoped lang="scss"></style>
