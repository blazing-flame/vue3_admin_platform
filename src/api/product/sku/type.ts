export interface ResponseData {
  code: number
  message: string
  ok: boolean
}

//SKU的数据类型
export interface attr {
  id?: number
  valueName?: string
  attrId: number | string //平台属性的ID
  valueId: number | string //平台属性值的ID
}
export interface saleAttr {
  id?: number
  saleAttrValueName?: string
  saleAttrId: number | string //销售属性ID
  saleAttrValueId: number | string //销售属性值ID
}
export interface SkuData {
  category3Id?: number | string //三级分类ID
  spuId?: number | string //已有SPU的ID
  tmId?: number | string //品牌的ID
  skuName?: string //新增的SKU的名字
  price?: number | string //SKU的价格
  weight?: number | string //SKU的重量
  skuDesc?: string //SKU的描述
  skuAttrValueList?: attr[] //平台属性的收集
  skuSaleAttrValueList?: saleAttr[] //销售属性
  skuDefaultImg?: string //售卖SKU图片地址
  isSale?: number //控制商品上架与下架
  id?: number //sku的id
  skuImageList?: any[] // 商品图片列表
}

//获取SKU接口返回的数据类型
export interface SkuResponseData extends ResponseData {
  data: {
    records: SkuData[]
    total: number
    size: number //一页几个数据
    current: number
    searchCount: boolean
    pages: number //一共多少页
  }
}

//获取SKU商品详情接口的ts类型
export interface SkuInfoData extends ResponseData {
  data: SkuData
}
