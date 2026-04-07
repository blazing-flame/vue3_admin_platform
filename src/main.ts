import { createApp } from 'vue'
import ElementPlus from 'element-plus'
//引入element-plus插件与样式
import 'element-plus/dist/index.css'
import App from './App.vue'
//配置element-plus国际化
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import './styles/reset.scss'
import './styles/index.scss'
//svg插件需要配置代码
import 'virtual:svg-icons-register'
//引入自定义插件对象：注册整个项目全局组件
import globalComponent from '@/components/index.ts'
//引入路由
import router from './router'
//引入仓库
import pinia from './store'
//暗黑模式
import 'element-plus/theme-chalk/dark/css-vars.css'
//获取应用实例对象
const app = createApp(App)
app.use(ElementPlus, {
  locale: zhCn,
})
//安装自定义插件
app.use(globalComponent)
app.use(pinia)
//注册模版路由
app.use(router)

//引入路由鉴权文件
import './permission'
app.mount('#app')

const fun = () => {
  console.log('没有格式化')
}
fun()
