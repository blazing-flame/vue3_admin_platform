//创建用户相关的小仓库
import { defineStore } from 'pinia'
import { reqLogin, reqUserInfo, reqLogout } from '@/api/user'

import { ref } from 'vue'
import { SET_TOKEN, GET_TOKEN, REMOVE_TOKEN } from '@/utils/token'
import { constantRoute, asyncRoute, anyRoute } from '@/router/routes'
import router from '@/router'
import type {
  loginFormData,
  loginResponseData,
  userInfoResponseData,
  LogoutResponseData,
} from '@/api/user/type'
//引入深拷贝方法
//@ts-ignore
import cloneDeep from 'lodash/cloneDeep'

//  import type {UserState} from './types/type.ts'

const useUserStore = defineStore('user', () => {
  // const token = ref(localStorage.getItem('token'))
  const token = ref(GET_TOKEN()) //用户唯一标识token
  const menuRoutes = ref(constantRoute) //仓库存储生成菜单需要数组
  const username = ref('')
  const avatar = ref('')
  const buttons = ref<string[]>([]) //存储当前用户是否拥有某些按钮权限
  //用户登录的方法
  const userLogin = async (data: loginFormData) => {
    const result: loginResponseData = await reqLogin(data)
    //登录请求:成功200->token
    // console.log(result.data.token);
    if (result.code == 200) {
      // 由于 pinia|vuex 存储数据其实用的就是一个js对象
      //pinia仓库存储token
      token.value = result.data ?? null

      // localStorage.setItem('token',result.data.token??'')
      SET_TOKEN(result.data ?? '')
      // 保证当前async函数返回一个成功的promise
      return 'ok'
    } else {
      return Promise.reject(new Error(result.data))
    }
  }
  //获取用户信息方法
  const userInfo = async () => {
    //获取用户信息进行存储仓库当中[用户头像、名字]
    const result: userInfoResponseData = await reqUserInfo()
    //如果获取用户信息成功，存储用户信息
    if (result.code == 200) {
      username.value = result.data.name
      avatar.value = result.data.avatar
      buttons.value = result.data.buttons
      //计算当前用户需要展示的异步路由
      let userAsyncRoute = filterAsyncRoute(
        cloneDeep(asyncRoute),
        result.data.routes,
      )
      //左侧菜单需要数据准备完毕
      menuRoutes.value = [...constantRoute, ...userAsyncRoute, ...anyRoute]
      //目前路由器管理的只有常量路由：用户计算完异步路由，任意路由需要动态追加
      const addRoutes = [...userAsyncRoute, ...anyRoute]
      addRoutes.forEach((route: any) => {
        router.addRoute(route)
      })
      return 'ok'
    } else {
      return Promise.reject(new Error(result.message))
    }
  }
  //用户退出登录的方法
  const userLogout = async () => {
    const result: LogoutResponseData = await reqLogout()
    if (result.code == 200) {
      token.value = ''
      username.value = ''
      avatar.value = ''
      REMOVE_TOKEN()
      location.reload()
      return 'ok'
    } else {
      return Promise.reject(new Error(result.message))
    }
  }
  //过滤当前用户需要展示的异步路由
  function filterAsyncRoute(asyncRoute: any, routes: any) {
    return asyncRoute.filter((item: any) => {
      if (routes.includes(item.name)) {
        if (item.children) {
          item.children = filterAsyncRoute(item.children, routes)
        }
        return true
      }
    })
  }

  return {
    userLogin,
    token,
    menuRoutes,
    userInfo,
    username,
    avatar,
    userLogout,
    filterAsyncRoute,
    buttons,
  }
})
export default useUserStore
