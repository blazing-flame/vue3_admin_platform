//定义分类接口返回数据都有的类型
export interface ResponseData {
  code: number
  message: string
  ok: boolean
}

//不同分类的ts数据类型
export interface CategoryObj {
  //新增的或已有的，可有可无
  id: number | string
  name: string
  category1Id?: number
  category2Id?: number
}

//包含分类属性数据的数组
export type Records = CategoryObj[]

//获取的已有的全部属性的数据ts类型
export interface CategoryResponseData extends ResponseData {
  data: Records
}

//属性与属性值的ts数据类型

//属性值对象的ts类型
export interface AttrValue {
  id?: number
  valueName: string
  attrId?: number
  flag: boolean
}

//存储每一个属性值的数组类型
export type AttrValueList = AttrValue[]

//属性对象
export interface Attr {
  id?: number
  attrName: string
  categoryId: number | string
  categoryLevel: number
  attrValueList: AttrValueList
  attrIdAndValueId?: string
}

//存储每一个对象的数组ts类型
export type AttrList = Attr[]

//属性接口返回的数据类型
export interface AttrResponseData extends ResponseData {
  data: AttrList
}
