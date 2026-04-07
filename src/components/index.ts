//引入项目 中全部的全局组件
import SvgIcon from './SvgIcon/index.vue'
import Pagination from './Pagination/index.vue'
import Category from './Category/index.vue'
//引入element-plus的所有图标
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

//全局对象
// const components = [SvgIcon, Pagination]

/* export default{
    //务必叫做install方法
    install(app:any){
        //遍历 components 数组，每次循环把当前元素赋值给 component，也就是依次拿到 SvgIcon、Pagination 这些组件。
        components.forEach(component => {
            //把数组里的每个组件都注册为全局组件
            app.component(component.name, component)
          })
    }
} */

const allGlobalComponent: Record<string, any> = {
  SvgIcon,
  Pagination,
  Category,
}

export default {
  // 务必叫做install方法
  install(app: any) {
    // 注册项目全部的全局组件
    // console.log(Object.keys(allGlobalComponent));
    //把对象的所有 key 取出来变成数组,遍历这个数组，每次循环用 app.component() 注册一个组件：
    Object.keys(allGlobalComponent).forEach((key) => {
      // 注册为全局组件
      app.component(key, allGlobalComponent[key])
    })
    //将element-plus提供图标注册为全局组件
    for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
      app.component(key, component)
    }
  },
}
