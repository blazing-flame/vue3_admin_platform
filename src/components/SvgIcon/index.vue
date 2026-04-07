<template>
  <div>
    <svg :style="{ width, height }">
      <use :href="prefix + name" :fill="color" />
    </svg>
  </div>
</template>

<script setup lang="ts">
defineProps({
  prefix: {
    type: String,
    default: '#icon-',
  },
  name: String,
  color: {
    type: String,
    default: '',
  },
  width: {
    type: String,
    default: '160px',
  },
  height: {
    type: String,
    default: '160px',
  },
})
</script>

<style scoped></style>
