//角色管理模块的接口
import request from '@/utils/request'
import type { AllRolesResponseData, RoleData, MenuResponseData } from './type'
//枚举地址
enum API {
  //获取全部职位的接口地址
  ALLROLE_URL = '/admin/acl/role/',
  //新增职位的接口地址
  ADDROLE_URL = '/admin/acl/role/save',
  //更新职位的接口地址
  UPDATEROLE_URL = '/admin/acl/role/update',
  //获取菜单的数据的接口地址
  ALLPERMISSION_URL = '/admin/acl/permission/toAssign/',
  //给角色分配权限的接口地址
  SETPERMISSION_URL = '/admin/acl/permission/doAssign',
  //删除已有角色
  REMOVEROLE_URL = '/admin/acl/role/remove/',
}
//获取全部职位的接口方法
export const reqAllRolesList = (
  page: number,
  limit: number,
  roleName: string,
) =>
  request.get<any, AllRolesResponseData>(
    API.ALLROLE_URL + `${page}/${limit}?roleName=${roleName}`,
  )
//新增职位与更新职位的接口方法
export const reqAddOrUpdateRole = (data: RoleData) => {
  if (data.id) {
    return request.put<any, any>(API.UPDATEROLE_URL, data)
  }
  return request.post<any, any>(API.ADDROLE_URL, data)
}
//获取菜单的数据的接口方法
export const reqAllMenuList = (roleId: number) =>
  request.get<any, MenuResponseData>(API.ALLPERMISSION_URL + roleId)
//给角色分配权限的接口方法
export const reqSetPermission = (roleId: number, permissionId: number[]) =>
  request.post<any, any>(
    API.SETPERMISSION_URL + `?roleId=${roleId}&permissionId=${permissionId}`,
  )
//删除已有角色
export const reqRemoveRole = (id: number) =>
  request.delete<any, any>(API.REMOVEROLE_URL + id)
