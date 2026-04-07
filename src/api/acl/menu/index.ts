//菜单管理的接口
import request from '@/utils/request'
import type { MenuResponseData, MenuParams } from './type'
//枚举地址
enum API {
  //获取全部菜单与按钮的标识数据的接口地址
  ALLPERMISSION_URL = '/admin/acl/permission',
  //给某一级菜单添加子菜单
  ADDMENU_URL = '/admin/acl/permission/save',
  //更新某一个已有菜单
  UPDATEMENU_URL = '/admin/acl/permission/update',
  //删除某一个已有菜单
  DELETEMENU_URL = '/admin/acl/permission/remove/',
}
//获取全部菜单与按钮的标识数据的接口方法
export const reqAllPermission = () =>
  request.get<any, MenuResponseData>(API.ALLPERMISSION_URL)
//给某一级菜单添加子菜单或更新某一个已有菜单
export const reqAddOrUpdateMenu = (data: MenuParams) => {
  if (data.id) {
    return request.put<any, any>(API.UPDATEMENU_URL, data)
  }
  return request.post<any, any>(API.ADDMENU_URL, data)
}
//删除某一个已有菜单
export const reqRemoveMenu = (id: number) =>
  request.delete<any, any>(API.DELETEMENU_URL + id)
