export interface ResponseData {
  code: number
  message: string
  ok: boolean
}

//菜单的ts类型
export interface Permission {
  createTime: string
  updateTime: string
  id?: number
  name: string
  pid: number
  code: string
  toCode: string
  type: number
  status: string
  level: number
  children?: PermissionList
  select: boolean
}
export type PermissionList = Permission[]

//菜单权限与按钮权限的TS类型
export interface MenuResponseData extends ResponseData {
  data: PermissionList
}
//添加与修改菜单携带参数的类型
export interface MenuParams {
  id?: number //当前菜单自己的唯一标识
  level: number
  code: string
  pid: number //当前菜单的父级菜单的 id（parent id）,如pid=0（全部数据） 表示顶级，没有父级，pid=1，父级是"全部数据"。
  name: string
}
