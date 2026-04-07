<template>
  <div class="login_container">
    <el-row>
      <el-col :span="12" :xs="0"></el-col>
      <el-col :span="12" :xs="24">
        <!-- 登录的表单 -->
        <!-- ref获取组件实例，然后可以调用它的方法 -->
        <el-form
          class="login_form"
          :model="loginForm"
          :rules="rules"
          ref="loginForms"
        >
          <h1>Hello</h1>
          <h2>欢迎来到优选商品运营平台</h2>
          <el-form-item prop="username">
            <el-input
              :prefix-icon="User"
              v-model="loginForm.username"
            ></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              type="password"
              :prefix-icon="Lock"
              v-model="loginForm.password"
              show-password
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              :loading="loading"
              class="login_btn"
              type="primary"
              size="default"
              @click="login"
            >
              登录
            </el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts" name="login">
import { User, Lock } from '@element-plus/icons-vue'
import { reactive, ref } from 'vue'
import useUserStore from '@/store/modules/user'
import { useRouter, useRoute } from 'vue-router'
import { ElNotification } from 'element-plus'
import { getTime } from '@/utils/time'
const useStore = useUserStore()
const router = useRouter()
const route = useRoute()
const loading = ref(false)
//获取el-form组件
const loginForms = ref()
//收集账号与密码的数据
const loginForm = reactive({ username: 'admin', password: '111111' })
//登录按钮回调
const login = async () => {
  //保证全部表单项校验通过再发请求
  await loginForms.value.validate()
  loading.value = true
  //点击按钮之后干什么？
  //通知仓库发登录请求
  //请求成功->首页展示数据的地方
  //请求失败->弹出登录失败信xi
  try {
    await useStore.userLogin(loginForm)
    //判断登录的时候，路由路径当中是否有query参数，如果有，就往query参数跳转，否则跳到首页
    const redirect: any = route.query.redirect
    router.push({ path: redirect || '/' })
    ElNotification({
      type: 'success',
      message: '欢迎回来',
      title: `Hi,${getTime()}好`,
    })
  } catch (error) {
    loading.value = false
    ElNotification({
      type: 'error',
      message: (error as Error).message,
    })
  }
}
//自定义校验规则函数
const validateUserName = (rule: any, value: any, callback: any) => {
  //rule:校验规则对象
  //value:表单元素文本内容
  //callback:符合条件放行通过，否则callback方法注入错误提示信息
  if (value.length >= 2) {
    callback()
  } else {
    callback(new Error('账号长度至少2位'))
  }
}
const validatePassword = (rule: any, value: any, callback: any) => {
  //rule:校验规则对象
  //value:表单元素文本内容
  //callback:符合条件放行通过，否则callback方法注入错误提示信息
  if (value.length >= 6) {
    callback()
  } else {
    callback(new Error('密码长度至少6位'))
  }
}
//定义表单校验的配置对象
const rules = {
  username: [{ validator: validateUserName, trigger: 'change' }],
  password: [{ validator: validatePassword, trigger: 'change' }],
}
</script>

<style scoped lang="scss">
.login_container {
  width: 100%;
  height: 100vh;
  background: url('@/assets/images/background.jpg') no-repeat;
  background-size: cover;
  .login_form {
    position: relative;
    width: 80%;
    top: 30vh;
    background: url('@/assets/images/login_form.png') no-repeat;
    background-size: cover;
    padding: 40px;
    h1 {
      color: white;
      font-size: 40px;
    }
    h2 {
      font-size: 20px;
      color: white;
      margin: 20px 0;
    }
    .login_btn {
      width: 100%;
    }
  }
}
</style>
