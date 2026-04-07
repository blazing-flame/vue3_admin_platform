//创建用户相关的小仓库
import { defineStore } from 'pinia'
import { reqLogin, reqUserInfo, reqLogout } from '@/api/user'

import { ref } from 'vue'
import { SET_TOKEN, GET_TOKEN, REMOVE_TOKEN } from '@/utils/token'
import { constantRoute } from '@/router/routes'
import type {
  loginFormData,
  loginResponseData,
  userInfoResponseData,
  LogoutResponseData,
} from '@/api/user/type'

//  import type {UserState} from './types/type.ts'

const useUserStore = defineStore('user', () => {
  // const token = ref(localStorage.getItem('token'))
  const token = ref(GET_TOKEN())
  const menuRoutes = ref(constantRoute)
  const username = ref('')
  const avatar = ref('')
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
      return 'ok'
    } else {
      return Promise.reject(new Error(result.message))
    }
  }

  return {
    userLogin,
    token,
    menuRoutes,
    userInfo,
    username,
    avatar,
    userLogout,
  }
})
export default useUserStore
