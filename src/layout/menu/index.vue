<template>
  <template v-for="item in menuList" :key="item.path">
    <!-- 没有子路由 -->
    <el-menu-item
      :index="item.path"
      v-if="!item.children && !item.meta.hidden"
      @click="goRoute"
    >
      <el-icon>
        <component :is="item.meta.icon"></component>
      </el-icon>
      <template #title>
        <span>{{ item.meta.title }}</span>
      </template>
    </el-menu-item>
    <!-- 有子路由但只有一个 -->
    <el-menu-item
      :index="item.children[0].path"
      v-if="
        item.children &&
        item.children.length == 1 &&
        !item.children[0].meta.hidden
      "
      @click="goRoute"
    >
      <el-icon>
        <component :is="item.children[0].meta.icon"></component>
      </el-icon>
      <template #title>
        <span>{{ item.children[0].meta.title }}</span>
      </template>
    </el-menu-item>
    <!-- 有子路由且超过一个 -->
    <el-sub-menu
      v-if="item.children && item.children.length > 1"
      :index="item.path"
    >
      <template #title>
        <el-icon>
          <component :is="item.meta.icon"></component>
        </el-icon>
        <span>{{ item.meta.title }}</span>
      </template>
      <Menu :menuList="item.children" />
    </el-sub-menu>
  </template>
</template>

<script setup lang="ts" name="Menu">
defineProps(['menuList'])
import { useRouter } from 'vue-router'

const router = useRouter()

const goRoute = (c: any) => {
  router.push(c.index)
  // console.log(c)
}
</script>

<style scoped></style>
