<template>
  <div class="home">
    <el-card class="welcome-card">
      <div class="welcome-inner">
        <img :src="userStore.avatar" class="avatar" />
        <div class="info">
          <h3 class="greeting">
            {{ getTime() }}好，
            <span class="username">{{ userStore.username }}</span>
          </h3>
          <p class="subtitle">优选商品运营平台</p>
        </div>
      </div>
    </el-card>
    <svg-icon
      name="welcome"
      width="500px"
      height="400px"
      style="display: flex; justify-content: center"
    ></svg-icon>
  </div>
</template>

<script setup lang="ts">
import useUserStore from '@/store/modules/user'
import { getTime } from '@/utils/time'
const userStore = useUserStore()
</script>

<style scoped>
.home {
  padding: 20px;
}

.welcome-card {
  background: linear-gradient(135deg, #1d2b4f 0%, #16213e 60%, #0f172a 100%);
  border: none;
  border-radius: 16px;
}

.welcome-card :deep(.el-card__body) {
  padding: 30px 36px;
}

.welcome-inner {
  display: flex;
  align-items: center;
  gap: 20px;
}

.avatar {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  border: 3px solid rgba(255, 255, 255, 0.25);
  object-fit: cover;
  flex-shrink: 0;
}

.info {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.greeting {
  font-size: 22px;
  font-weight: 600;
  color: #ffffff;
  margin: 0;
}

.username {
  color: #60a5fa;
}

.subtitle {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.5);
  margin: 0;
}
</style>
