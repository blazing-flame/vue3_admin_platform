//SPU管理模块的接口
import request from '@/utils/request'
import type {
  SkuInfoData,
  SkuData,
  SpuData,
  HasSpuResponseData,
  AllTradeMark,
  SpuHasImg,
  SaleAttrResponseData,
  HasSaleAttrResponseData,
} from './type'

//SPU管理模块接口地址
enum API {
  //获取已有的SPU的数据的接口地址
  HASSPU_URL = '/admin/product/',
  //获取全部品牌数据的接口地址
  ALLTRADEMARK_URL = '/admin/product/baseTrademark/getTrademarkList',
  //获取某个SPU下面的全部的售卖商品的SKU图片的接口地址
  IMAGE_URL = '/admin/product/spuImageList/',
  //获取某个SPU下全部的已有的销售属性接口地址
  SPUHASSALEATTR_URL = '/admin/product/spuSaleAttrList/',
  //获取整个项目全部的销售属性[颜色，版本，尺码]的接口地址
  ALLSALEATTR_URL = '/admin/product/baseSaleAttrList',
  //追加一个新的SPU的接口地址
  ADDSPU_URL = '/admin/product/saveSpuInfo',
  //更新已有的SPU的接口地址
  UPDATESPU_URL = '/admin/product/updateSpuInfo',
  //追加一个新的SKU的接口地址
  ADDSKU_URL = '/admin/product/saveSkuInfo',
  //查看某一个已有SPU下的售卖商品(SKU)的接口地址
  SKUINFO = '/admin/product/findBySpuId/',
  //删除已有SPU的接口地址
  REMOVESPU_URL = '/admin/product/deleteSpu/',
}
//获取某一个三级分类下已有的SPU的数据接口方法
export const reqHasSpu = (
  page: number,
  limit: number,
  category3Id: string | number,
) =>
  request.get<any, HasSpuResponseData>(
    API.HASSPU_URL + `${page}/${limit}?category3Id=${category3Id}`,
  )
//获取全部的SPU品牌的数据的接口方法
export const reqAllTradeMark = () =>
  request.get<any, AllTradeMark>(API.ALLTRADEMARK_URL)
//获取某个SPU下面的全部的售卖商品的SKU图片的接口方法
export const reqSpuImageList = (id: number) =>
  request.get<any, SpuHasImg>(API.IMAGE_URL + id)
//获取某个SPU下全部的已有的销售属性接口方法
export const reqSpuHasSaleAttr = (id: number) =>
  request.get<any, SaleAttrResponseData>(API.SPUHASSALEATTR_URL + id)
//获取整个项目全部的销售属性[颜色，版本，尺码]的接口方法
export const reqAllSaleAttr = () =>
  request.get<any, HasSaleAttrResponseData>(API.ALLSALEATTR_URL)
//追加一个新的SPU的接口方法
//更新已有的SPU的接口方法
//data：即为新增的SPU | 已有的SPU对象
export const reqAddOrUpdateSpu = (data: SpuData) => {
  //如果SPU对象拥有ID，更新已有的SPU
  if (data.id) {
    return request.post<any, any>(API.UPDATESPU_URL, data)
  }
  return request.post<any, any>(API.ADDSPU_URL, data)
}
//添加SKU的接口方法
export const reqAddSku = (data: SkuData) =>
  request.post<any, any>(API.ADDSKU_URL, data)
//查看某一个已有SPU下的售卖商品(SKU)的接口方法
export const reqSkuList = (spuId: number | string) =>
  request.get<any, SkuInfoData>(API.SKUINFO + spuId)
//删除已有SPU的接口方法
export const reqRemoveSpu = (spuId: number | string) =>
  request.delete<any, any>(API.REMOVESPU_URL + spuId)
