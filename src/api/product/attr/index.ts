//属性管理模块接口
import request from '@/utils/request'
import type { CategoryResponseData, AttrResponseData, Attr } from './type'

//属性管理模块接口地址
enum API {
  //获取一级分类接口地址
  C1_URL = '/admin/product/getCategory1',
  //获取二级分类接口地址
  C2_URL = '/admin/product/getCategory2/',
  //获取三级分类接口地址
  C3_URL = '/admin/product/getCategory3/',
  //获取分类下已有的属性名称和属性值
  ATTR_URL = '/admin/product/attrInfoList/',
  //添加或修改已有属性的接口
  ADDORDATEATTR_URL = '/admin/product/saveAttrInfo',
  //删除已有属性的接口地址
  DELETEATTR_URL = '/admin/product/deleteAttr/',
}

//获取一级分类接口方法
export const reqC1 = () => request.get<any, CategoryResponseData>(API.C1_URL)
//获取二级分类接口方法
export const reqC2 = (category1Id: number | string) =>
  request.get<any, CategoryResponseData>(API.C2_URL + category1Id)
//获取三级分类接口方法
export const reqC3 = (category2Id: number | string) =>
  request.get<any, CategoryResponseData>(API.C3_URL + category2Id)
//获取分类下已有的属性名称和属性值的接口方法
export const reqAttr = (
  c1Id: number | string,
  c2Id: number | string,
  c3Id: number | string,
) =>
  request.get<any, AttrResponseData>(API.ATTR_URL + `${c1Id}/${c2Id}/${c3Id}`)
//新增或修改已有的属性接口方法
export const reqAddOrUpdateAttr = (data: Attr) =>
  request.post<any, any>(API.ADDORDATEATTR_URL, data)
//删除已有属性的接口方法
export const reqRemoveAttr = (attrId: number) =>
  request.delete<any, any>(API.DELETEATTR_URL + attrId)
