//服务器返回的数据中都有的数据类型
export interface ResponseData {
  code: number
  message: string
  ok: boolean
}

//Spu数据的ts类型
export interface SpuData {
  id?: number
  spuName: string
  description: string
  category3Id: string | number
  tmId: number | string
  spuImageList: null | Image[]
  spuSaleAttrList: null | SaleAttr[]
}
//包含所有已有SPU数据的数组
export type Records = SpuData[]

//已有SPU接口返回的数据类型
export interface HasSpuResponseData extends ResponseData {
  data: {
    records: Records
    total: number
    size: number
    current: number
    searchCount: boolean
    pages: number
  }
}

//品牌数据的TS类型
export interface Trademark {
  id: number
  tmName: string
  logoUrl: string
}
//品牌接口返回的数据类型
export interface AllTradeMark extends ResponseData {
  data: Trademark[]
}

//商品图片数据的ts类型
export interface Image {
  id?: number
  imgName?: string
  imgUrl?: string
  spuId?: number
  name?: string
  url?: string
}
//商品图片接口返回的数据类型
export interface SpuHasImg extends ResponseData {
  data: Image[]
}

//已有的销售属性值对象的ts类型
export interface SaleAttrValue {
  id?: number
  saleAttrValueName: string
  baseSaleAttrId: number
  spuId?: number
}
//存储已有的销售属性值的数组的类型
export type spuSaleAttrValueList = SaleAttrValue[]
//销售属性对象的ts类型
export interface SaleAttr {
  id?: number
  baseSaleAttrId: number
  saleAttrName: string
  spuId?: number
  spuSaleAttrValueList: spuSaleAttrValueList
  flag?: boolean
  saleAttrValue?: string
  saleIdAndValueId?: string
}
//销售属性接口返回的数据类型
export interface SaleAttrResponseData extends ResponseData {
  data: SaleAttr[]
}

//已有的全部SPU的返回数据类型
export interface HasSaleAttr {
  id: number
  name: string
}
//销售列表接口返回的数据类型
export interface HasSaleAttrResponseData extends ResponseData {
  data: HasSaleAttr[]
}

export interface attr {
  attrId: number | string //平台属性的ID
  valueId: number | string //平台属性值的ID
}
export interface saleAttr {
  saleAttrId: number | string //销售属性ID
  saleAttrValueId: number | string //销售属性值ID
}
//SKU的数据类型
export interface SkuData {
  category3Id: number | string //三级分类ID
  spuId: number | string //已有SPU的ID
  tmId: number | string //品牌的ID
  skuName: string //新增的SKU的名字
  price: number | string //SKU的价格
  weight: number | string //SKU的重量
  skuDesc: string //SKU的描述
  skuAttrValueList?: attr[] //平台属性的收集
  skuSaleAttrValueList?: saleAttr[] //销售属性
  skuDefaultImg: string //售卖SKU图片地址
}

//获取SKU数据接口的ts类型
export interface SkuInfoData extends ResponseData {
  data: SkuData[]
}
