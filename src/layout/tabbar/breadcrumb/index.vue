<template>
  <!-- 顶部左侧静态 -->
  <el-icon style="margin-right: 10px" @click="layoutSettingStore.changeIcon">
    <component :is="layoutSettingStore.fold ? 'Expand' : 'Fold'"></component>
    <!-- <Fold v-if="layoutSettingStore.fold"/>
          <Expand v-else/> -->
  </el-icon>
  <!-- 左侧面包屑 -->
  <el-breadcrumb separator-icon="ArrowRight">
    <!-- 面包屑动态展示路由名字和标题 -->
    <el-breadcrumb-item
      v-for="item in route.matched"
      :key="item.path"
      v-show="item.meta.title"
      :to="item.path"
    >
      <!-- 图标 -->
      <el-icon style="margin: 0 5px; vertical-align: middle">
        <component :is="item.meta.icon"></component>
      </el-icon>
      <!-- 面包屑展示匹配路由的标题 -->
      <span>{{ item.meta.title }}</span>
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script setup lang="ts" name="Breadcrumb">
import { useRoute } from 'vue-router'
import useLayoutSettingStore from '@/store/modules/setting'
const layoutSettingStore = useLayoutSettingStore()
const route = useRoute()
// console.log(route.matched);
</script>

<style scoped></style>
