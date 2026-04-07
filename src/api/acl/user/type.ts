//账号信息都有的ts类型
export interface ResponseData {
  code: number
  message: string
  ok: boolean
}

//一个账号信息的ts类型
export interface User {
  createTime?: string
  updateTim?: string
  id?: number
  username: string
  roleName?: string
  password: string
  name: string
  phone?: null
}
//数组包含的全部用户信息
export type records = User[]

//获取接口返回的全部信息的ts类型
export interface UserResponseData extends ResponseData {
  data: {
    records: records
    total: number
    size: number
    current: number
    pages: number
  }
}

//代表一个职位的ts类型
export interface RoleData {
  id?: number
  createTime: string
  remark: string
  roleName: string
  updateTime: string
}

//全部职位列表
export type AllRolesList = RoleData[]

//获取全部职位的接口返回的数据ts类型
export interface AllRolesResponseData extends ResponseData {
  data: {
    assignRoles: AllRolesList
    allRolesList: AllRolesList
  }
}

//给用户分配角色接口携带参数的类型
export interface SetRolesData {
  roleIdList: number[]
  userId: number
}
