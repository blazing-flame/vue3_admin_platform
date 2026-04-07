export interface ResponseData {
  code: number
  message: string
  ok: boolean
}

//代表一个职位的ts类型
export interface RoleData {
  id?: number
  createTime?: string
  remark?: string
  roleName: string
  updateTime?: string
}
//全部职位列表
export type AllRolesList = RoleData[]

//获取全部职位的接口返回的数据ts类型
export interface AllRolesResponseData extends ResponseData {
  data: {
    records: AllRolesList
    current: number
    pages: number
    searchCount: boolean
    size: number
    total: number
  }
}

//菜单的ts类型
export interface MenuData {
  createTime: string
  updateTime: string
  id: number
  name: string
  pid: number
  code: string
  toCode: string
  type: number
  status: string
  level: number
  children?: MenuList
  select: boolean
}
export type MenuList = MenuData[]

//菜单权限与按钮权限的TS类型
export interface MenuResponseData extends ResponseData {
  data: MenuList
}
