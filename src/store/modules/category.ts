//商品分类全局组件小仓库
import { defineStore } from 'pinia'
import { reqC1, reqC2, reqC3 } from '@/api/product/attr'
import { ref } from 'vue'
import type { CategoryResponseData } from '@/api/product/attr/type'
const useCategoryStore = defineStore('Category', () => {
  //存储一级分类的数组数据
  const c1Arr = ref<any>([])
  //存储一级分类的id
  const c1Id = ref<number | string>('')
  //存储一级分类下的二级分类的数组数据
  const c2Arr = ref<any>([])
  //存储二级分类的id
  const c2Id = ref<number | string>('')
  //存储二级分类下的三级分类的数组数据
  const c3Arr = ref<any>([])
  //存储三级分类的id
  const c3Id = ref<number | string>('')
  //获取一级分类方法
  const getC1 = async () => {
    //发请求获取一级分类数据
    const result: CategoryResponseData = await reqC1()
    if (result.code == 200) {
      c1Arr.value = result.data
    }
  }
  //获取二级分类方法
  const getC2 = async () => {
    //发请求获取二级分类数据
    const result: CategoryResponseData = await reqC2(c1Id.value)
    if (result.code == 200) {
      c2Arr.value = result.data
    }
  }
  //获取三级分类方法
  const getC3 = async () => {
    //发请求获取三级分类数据
    const result: CategoryResponseData = await reqC3(c2Id.value)
    if (result.code == 200) {
      c3Arr.value = result.data
    }
  }

  // 手动实现 $reset
  const $reset = () => {
    c1Id.value = ''
    c2Id.value = ''
    c3Id.value = ''
    c1Arr.value = []
    c2Arr.value = []
    c3Arr.value = []
  }

  return { getC1, c1Arr, c1Id, getC2, c2Arr, c2Id, c3Arr, getC3, c3Id, $reset }
})
export default useCategoryStore
