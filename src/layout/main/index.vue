<template>
  <div class="maincolor">
    <!-- 路由组件出口位置 -->
    <router-view v-slot="{ Component }">
      <transition name="fade">
        <!-- 渲染layout一级路由组件的子路由 -->
        <component :is="Component" v-if="flag" />
      </transition>
    </router-view>
  </div>
</template>

<script setup lang="ts" name="Main">
import { watch, ref, nextTick } from 'vue'
import useLayoutSettingStore from '@/store/modules/setting'
const layoutSettingStore = useLayoutSettingStore()
//控制当前路由组件是否销毁重建
const flag = ref(true)
//监听仓库内部数据是否发生变化，如果发生变化，说明用户点击过刷新按钮
watch(
  () => layoutSettingStore.refresh,
  () => {
    //点击刷新按钮组件销毁
    flag.value = false
    nextTick(() => {
      flag.value = true
    })
  },
)
</script>

<style scoped lang="scss">
.fade-enter-from {
  opacity: 0;
  /* transform: rotate(0deg); */
  transform: scale(0);
}

.fade-enter-active {
  transition: all 0.3s;
}

.fade-enter-to {
  opacity: 1;
  /* transform: rotate(360deg); */
  transform: scale(1);
}
</style>
