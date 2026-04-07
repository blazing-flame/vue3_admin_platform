//用户管理模块的接口
import request from '@/utils/request'
import type {
  UserResponseData,
  User,
  AllRolesResponseData,
  SetRolesData,
} from './type'
//枚举地址
enum API {
  //获取全部用户已有的账号信息的接口地址
  ALLUSER = '/admin/acl/user/',
  //添加一个新的账号的接口地址
  ADDUSER_URL = '/admin/acl/user/save',
  //更新已有账号的接口地址
  UPDATEUSER_URL = '/admin/acl/user/update',
  //获取全部职位以及当前账号拥有职位的接口地址
  ALLROLES = '/admin/acl/user/toAssign/',
  //给某一用户分配角色的接口地址
  SETROLES_URL = '/admin/acl/user/doAssignRole',
  //删除某一账号的接口地址
  DELETEUSER_URL = '/admin/acl/user/remove/',
  //批量删除的接口地址
  DELETEALLUSER_URL = '/admin/acl/user/batchRemove',
}

//获取全部用户已有的账号信息的接口方法
export const reqUserInfo = (page: number, limit: number, username: string) =>
  request.get<any, UserResponseData>(
    API.ALLUSER + `${page}/${limit}?username=${username}`,
  )

//添加或更新账号的接口方法
export const reqAddOrUpdateUser = (data: User) => {
  //更新
  if (data.id) {
    return request.put<any, User>(API.UPDATEUSER_URL, data)
  } else {
    //添加
    return request.post<any, User>(API.ADDUSER_URL, data)
  }
}
//获取全部职位以及当前账号拥有职位的接口方法
export const reqAllRoles = (adminId: number) =>
  request.get<any, AllRolesResponseData>(API.ALLROLES + adminId)
//给某一用户分配角色的接口方法
export const reqSetUserRoles = (data: SetRolesData) =>
  request.post<any, any>(API.SETROLES_URL, data)
//删除某一账号的接口方法
export const reqRemoveUser = (id: number) =>
  request.delete<any, any>(API.DELETEUSER_URL + id)
//批量删除的接口方法
export const reqSelectUser = (idList: number[]) =>
  request.delete<any, any>(API.DELETEALLUSER_URL, { data: idList })
