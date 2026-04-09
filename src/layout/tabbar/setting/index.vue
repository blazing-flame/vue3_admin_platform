<template>
  <el-button
    size="small"
    icon="Refresh"
    circle
    @click="layoutSettingStore.updateRefresh"
  ></el-button>
  <el-button
    size="small"
    icon="FullScreen"
    circle
    @click="layoutSettingStore.fullScreen"
  ></el-button>
  <el-popover placement="bottom" title="主题设置" :width="300" trigger="hover">
    <!-- 表单元素 -->
    <el-form>
      <el-form-item label="主题颜色">
        <el-color-picker
          @change="setColor"
          :teleported="false"
          v-model="color"
          show-alpha
          :predefine="predefineColors"
        />
      </el-form-item>
      <el-form-item label="暗黑模式">
        <el-switch
          v-model="dark"
          size="larger"
          active-icon="MoonNight"
          inactive-icon="Sunny"
          inline-prompt
          @change="changeDark"
        />
      </el-form-item>
    </el-form>
    <template #reference>
      <el-button size="small" icon="Setting" circle></el-button>
    </template>
  </el-popover>
  <img
    :src="userStore.avatar"
    style="width: 24px; height: 24px; margin: 0 10px; border-radius: 50%"
  />
  <!-- 下拉菜单 -->
  <el-dropdown>
    <span class="el-dropdown-link">
      {{ userStore.username }}
      <el-icon class="el-icon--right">
        <arrow-down />
      </el-icon>
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item @click="layoutSettingStore.logout">
          退出登录
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup lang="ts" name="Setting">
import useLayoutSettingStore from '@/store/modules/setting'
import useUserStore from '@/store/modules/user'
import { ref } from 'vue'
const userStore = useUserStore()
const layoutSettingStore = useLayoutSettingStore()
//收集开关数据
const dark = ref<boolean>(false)
const color = ref('rgba(255, 69, 0, 0.68)')
const predefineColors = ref([
  '#ff4500',
  '#ff8c00',
  '#ffd700',
  '#90ee90',
  '#00ced1',
  '#1e90ff',
  '#c71585',
  'rgba(255, 69, 0, 0.68)',
  'rgb(255, 120, 0)',
  'hsv(51, 100, 98)',
  'hsva(120, 40, 94, 0.5)',
  'hsl(181, 100%, 37%)',
  'hsla(209, 100%, 56%, 0.73)',
  '#c7158577',
])
//Switch开关的change事件进行暗黑转换
const changeDark = () => {
  //获取HTML根节点
  const html = document.documentElement
  //判断HTML标签是否有类名
  // dark.value?html.className='dark':html.className=''
  html.className = dark.value ? 'dark' : ''
}
//主题颜色的设置
const setColor = () => {
  //通过JS修改根节点样式对象属性和属性值
  const html = document.documentElement
  html.style.setProperty('--el-color-primary', color.value) //primary 蓝色
  html.style.setProperty('--el-color-success', color.value) // success 绿色
  html.style.setProperty('--el-color-warning', color.value) // warning 橙色
  html.style.setProperty('--el-color-danger', color.value) // danger 红色
  html.style.setProperty('--el-color-info', color.value) // info 灰色
  // 本地存起来
  // localStorage.setItem('themeColor', color.value)
}
</script>

<style scoped>
.el-dropdown-link {
  display: inline-flex;
  align-items: center;
  cursor: pointer;
}
</style>
