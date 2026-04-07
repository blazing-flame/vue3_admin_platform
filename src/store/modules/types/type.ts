import type { RouteRecordRaw } from 'vue-router'
import type { Records } from '@/api/product/attr/type'
//定义user小仓库数据类型
export interface UserState {
  menuRoutes: RouteRecordRaw[]
}

//定义分类小仓库数据类型
export interface CategoryState {
  c1Id: string | number
  c1Arr: Records
  c2Arr: Records
}
