<template>
  <div class="layout_container">
    <!-- 左侧菜单 -->
    <div class="layout_slider" :class="{ fold: layoutSettingStore.fold }">
      <Logo />
      <!-- 展示菜单 -->
      <!-- 滚动组件 -->
      <el-scrollbar class="scrollbar">
        <el-menu
          :collapse="layoutSettingStore.fold"
          :default-active="route.path"
          background-color="#001529"
          text-color="white"
          active-text-color="yellowgreen"
        >
          <!-- 根据路由动态显示菜单 -->
          <Menu :menuList="userStore.menuRoutes" />
        </el-menu>
      </el-scrollbar>
    </div>
    <!-- 顶部导航 -->
    <div class="layout_tabbar" :class="{ fold: layoutSettingStore.fold }">
      <Tabbar />
    </div>
    <!-- 内容展示区域 -->
    <div class="layout_main" :class="{ fold: layoutSettingStore.fold }">
      <Main></Main>
    </div>
  </div>
</template>

<script setup lang="ts" name="Layout">
import { useRoute } from 'vue-router'
import Logo from './logo/index.vue'
import Menu from './menu/index.vue'
import useUserStore from '@/store/modules/user'
import Main from './main/index.vue'
import Tabbar from './tabbar/index.vue'
import useLayoutSettingStore from '@/store/modules/setting'
const userStore = useUserStore()

const route = useRoute()
const layoutSettingStore = useLayoutSettingStore()
// console.log(route);
</script>

<style scoped lang="scss">
.layout_container {
  width: 100%;
  height: 100vh;
  overflow: hidden;
  .layout_slider {
    width: $base-menu-width;
    height: 100vh;
    background: $base-menu-background;
    transition: all 0.3s;
    .scrollbar {
      width: 100%;
      height: (100vh-$base-menu-logo-height);
      color: white;
      .el-menu {
        border-right: none;
      }
    }
    &.fold {
      width: $base-menu-min-width;
      .el-sub-menu__title span {
        display: none;
      }
    }
  }
  .layout_tabbar {
    position: fixed;
    width: calc(100% - $base-menu-width);
    height: $base-tabbar-height;
    top: 0px;
    left: $base-menu-width;
    transition: all 0.3s;
    &.fold {
      width: calc(100vw - $base-menu-min-width);
      left: $base-menu-min-width;
    }
  }
  .layout_main {
    position: absolute;
    width: calc(100% - $base-menu-width);
    height: calc(100vh - $base-tabbar-height);
    left: $base-menu-width;
    top: $base-tabbar-height;
    box-sizing: border-box; // 加这个，padding就不会再撑大元素了
    padding: 20px;
    overflow: auto;
    transition: all 0.3s;
    background-color: $base-main-background;
    &.fold {
      width: calc(100vw - $base-menu-min-width);
      left: $base-menu-min-width;
    }
  }
}
</style>
