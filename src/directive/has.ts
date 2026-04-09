import pinia from '@/store'
import useUserStore from '@/store/modules/user'
let userStore = useUserStore(pinia)

export const isHasButton = (app: any) => {
  //全局自定义指令实现按钮权限
  app.directive('has', {
    //使用这个全局自定义指令的DOM|组件挂载完毕的时候会执行一次
    //el → 指令绑定的 DOM 元素
    //options → 包含指令传入值的对象，options.value 就是 v-has="..." 里引号内的值，也就是 "btn.Trademark.add"
    //自定义指令右侧的数值:如果在用户信息buttons数组当中没有
    //从DOM树上干掉
    mounted(el: any, options: any) {
      if (!userStore.buttons.includes(options.value)) {
        el.parentNode.removeChild(el)
        // el.remove()
      }
    },
  })
}
