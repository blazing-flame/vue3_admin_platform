//小仓库：layout组件相关配置仓库

import { defineStore } from 'pinia'
import { ref } from 'vue'
import useUserStore from '@/store/modules/user'
import { useRouter, useRoute } from 'vue-router'

const useLayoutSettingStore = defineStore('SettingStore', () => {
  const fold = ref(false) //用于控制菜单是展开还是收起
  const refresh = ref(false) //用于控制刷新效果

  const userStore = useUserStore()
  const router = useRouter()
  const route = useRoute()

  const changeIcon = () => {
    fold.value = !fold.value
  }
  //刷新按钮点击回调
  const updateRefresh = () => {
    refresh.value = !refresh.value
  }
  //全屏按钮点击回调
  const fullScreen = () => {
    //DOM对象的一个属性：可以用来判断当前是不是全屏模式【全屏：true】
    const full = document.fullscreenElement
    //切换为全屏模式
    if (!full) {
      //文档根节点的方法requestFullscreen，实现全屏模式
      document.documentElement.requestFullscreen()
    } else {
      //退出全屏
      document.exitFullscreen()
    }
  }

  //退出登录点击的回调
  const logout = async () => {
    //第一件事：需要向服务器发出请求[退出登录接口]
    //第二件事情：仓库中关于用户相关的数据清空[token|username|avatar]
    //第三件事情：跳转到登录页面
    await userStore.userLogout()
    router.push({ path: '/login', query: { redirect: route.path } })
  }

  return {
    fold,
    changeIcon,
    refresh,
    updateRefresh,
    fullScreen,
    logout,
    userStore,
    router,
    route,
  }
})
export default useLayoutSettingStore
