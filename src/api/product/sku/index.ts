//SKU模块接口管理
import request from '@/utils/request'
import type { SkuResponseData, SkuInfoData } from './type'
//枚举地址
enum API {
  //获取已有的SKU商品的数据的接口地址
  SKU_URL = '/admin/product/list/',
  //商品上架的接口地址
  ONSALE_URL = '/admin/product/onSale/',
  //商品下架的接口地址
  CANCELSALE_URL = '/admin/product/cancelSale/',
  //获取商品详情的接口地址
  SKUINFO_URL = '/admin/product/getSkuInfo/',
  //删除已有的SKU的接口地址
  DELETESKU_URL = '/admin/product/deleteSku/',
}
//获取已有的SKU商品的数据的接口方法
export const reqSkuList = (page: number, limit: number) =>
  request.get<any, SkuResponseData>(API.SKU_URL + `${page}/${limit}`)
//商品上架的接口方法
export const reqOnSaleSku = (skuId: number) =>
  request.get<any, any>(API.ONSALE_URL + skuId)
//商品下架的接口方法
export const reqCancelSaleSku = (skuId: number) =>
  request.get<any, any>(API.CANCELSALE_URL + skuId)
//获取商品详情的接口方法
export const reqSkuInfo = (skuId: number) =>
  request.get<any, SkuInfoData>(API.SKUINFO_URL + skuId)
//删除已有的SKU的接口方法
export const reqRemoveSku = (skuId: number) =>
  request.delete<any, any>(API.DELETESKU_URL + skuId)
