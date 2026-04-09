<template>
  <div class="box">
    <img src="../../assets//images/error_images/404.png" alt="" />
    <el-button
      @click="goHome"
      type="warning"
      style="color: white; padding: 10px"
    >
      首页
    </el-button>
  </div>
</template>

<script setup lang="ts" name="404">
import { useRouter } from 'vue-router'
let router = useRouter()
const goHome = () => {
  router.push('/home')
}
</script>

<style scoped lang="scss">
.box {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
  background: linear-gradient(135deg, #667eea, #764ba2);
  img {
    width: 1000px;
    height: auto;
  }
}
</style>
