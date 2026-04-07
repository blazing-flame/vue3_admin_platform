<template>
  <el-form label-width="80px">
    <el-form-item label="SKU名称">
      <el-input placeholder="SKU名称" v-model="skuParams.skuName"></el-input>
    </el-form-item>
    <el-form-item label="价格(元)">
      <el-input
        placeholder="价格(元)"
        type="number"
        v-model="skuParams.price"
      ></el-input>
    </el-form-item>
    <el-form-item label="重量(克)">
      <el-input
        placeholder="重量(克)"
        type="number"
        v-model="skuParams.weight"
      ></el-input>
    </el-form-item>
    <el-form-item label="SKU描述">
      <el-input
        placeholder="SKU描述"
        type="textarea"
        v-model="skuParams.skuDesc"
      ></el-input>
    </el-form-item>
    <!-- v-model 绑定一个不存在的属性不会报错，用户选择时会动态把这个属性写到 item 对象上，因为 item 在响应式数组里，Vue 能追踪到，所以 attrArr/saleArr 的每个 item 就自动携带了用户的选择结果。 -->
    <el-form-item label="平台属性">
      <el-form :inline="true">
        <el-form-item
          v-for="item in attrArr"
          :key="item.id"
          :label="item.attrName"
        >
          <el-select style="width: 120px" v-model="item.attrIdAndValueId">
            <el-option
              :value="`${item.id}:${attrValue.id}`"
              v-for="attrValue in item.attrValueList"
              :key="attrValue.id"
              :label="attrValue.valueName"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-form-item>
    <el-form-item label="销售属性">
      <el-form :inline="true">
        <el-form-item
          v-for="item in saleArr"
          :key="item.id"
          :label="item.saleAttrName"
        >
          <el-select style="width: 120px" v-model="item.saleIdAndValueId">
            <el-option
              :value="`${item.id}:${saleAttrValue.id}`"
              v-for="saleAttrValue in item.spuSaleAttrValueList"
              :key="saleAttrValue.id"
              :label="saleAttrValue.saleAttrValueName"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-form-item>
    <el-form-item label="图片名称">
      <el-table border :data="imgArr" ref="table">
        <el-table-column
          type="selection"
          width="80px"
          align="center"
        ></el-table-column>
        <el-table-column label="图片">
          <template #="{ row, $index }">
            <img :src="row.imgUrl" style="width: 100px; height: 100px" />
          </template>
        </el-table-column>
        <el-table-column label="名称" prop="imgName"></el-table-column>
        <el-table-column label="操作">
          <template #="{ row, $index }">
            <el-button
              type="warning"
              style="padding: 10px; color: white"
              @click="handler(row)"
            >
              设置默认
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>
    <el-form-item>
      <el-button
        type="primary"
        style="padding: 10px; color: white"
        @click="save"
      >
        保存
      </el-button>
      <el-button
        type="danger"
        style="padding: 10px; color: white"
        @click="cancel"
      >
        取消
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts" name="SkuForm">
//引入请求API
import { reqAttr } from '@/api/product/attr'
import {
  reqAddSku,
  reqSpuImageList,
  reqSpuHasSaleAttr,
} from '@/api/product/spu'
import type { AttrResponseData, AttrList } from '@/api/product/attr/type'
import type {
  SkuData,
  SaleAttrResponseData,
  SpuHasImg,
  SaleAttr,
  Image,
} from '@/api/product/spu/type'
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'

//自定义事件方法
const $emit = defineEmits(['change-scene'])
//存储平台属性
const attrArr = ref<AttrList>([])
//存储销售属性
const saleArr = ref<SaleAttr[]>([])
//存储照片墙
const imgArr = ref<Image[]>([])
//获取table组件实例
const table = ref<any>()
//收集SKU参数
const skuParams = reactive<SkuData>({
  //父组件传递过来的数据
  category3Id: '', //三级分类ID
  spuId: '', //已有SPU的ID
  tmId: '', //品牌的ID
  //v-model收集
  skuName: '', //新增的SKU的名字
  price: '', //SKU的价格
  weight: '', //SKU的重量
  skuDesc: '', //SKU的描述
  skuAttrValueList: [
    //平台属性的收集
  ],
  skuSaleAttrValueList: [
    //销售属性
  ],
  skuDefaultImg: '', //售卖SKU图片地址
})

//当前子组件的方法对外暴露
const initSkuData = async (
  c1Id: number | string,
  c2Id: number | string,
  spu: any,
) => {
  // 先重置数据
  skuParams.skuName = ''
  skuParams.price = ''
  skuParams.weight = ''
  skuParams.skuDesc = ''
  skuParams.skuAttrValueList = []
  skuParams.skuSaleAttrValueList = []
  skuParams.skuDefaultImg = ''
  //收集数据
  skuParams.category3Id = spu.category3Id
  skuParams.spuId = spu.id
  skuParams.tmId = spu.tmId
  //获取平台属性
  const result: AttrResponseData = await reqAttr(c1Id, c2Id, spu.category3Id)
  //获取对应的销售属性
  const result1: SaleAttrResponseData = await reqSpuHasSaleAttr(spu.id)
  //获取对应的照片墙数据
  const result2: SpuHasImg = await reqSpuImageList(spu.id)
  //存储平台属性
  attrArr.value = result.data
  //存储销售属性
  saleArr.value = result1.data
  //存储照片墙
  imgArr.value = result2.data
}
//取消按钮的回调
const cancel = () => {
  $emit('change-scene', { flag: 0, params: '' })
}
//设置默认图片的方法回调
const handler = (row: any) => {
  //点击的时候，全部图片的复选框不勾选
  table.value.clearSelection()

  //复选框选中
  table.value.toggleRowSelection(row, true)
  //收集图片地址
  skuParams.skuDefaultImg = row.imgUrl
}

//保存按钮方法
const save = async () => {
  //整理参数
  //平台属性
  //方法1：
  //prev 是 reduce 每一轮传进来的参数，它的值来自于上一轮的返回值。next为当前项元素,[]是prev的初始值
  skuParams.skuAttrValueList = attrArr.value.reduce((prev: any, next: any) => {
    if (next.attrIdAndValueId) {
      const [attrId, valueId] = next.attrIdAndValueId.split(':')
      prev.push({
        attrId,
        valueId,
      })
    }
    return prev
  }, [])
  //销售属性
  skuParams.skuSaleAttrValueList = saleArr.value.reduce(
    (prev: any, next: any) => {
      if (next.saleIdAndValueId) {
        const [saleAttrId, saleAttrValueId] = next.saleIdAndValueId.split(':')
        prev.push({
          saleAttrId,
          saleAttrValueId,
        })
      }
      return prev
    },
    [],
  )
  //方法2:
  // skuParams.skuAttrValueList = attrArr.value.filter((item: any) => item.attrIdAndValueId).map((item: any) => {
  //     let [attrId, valueId] = item.attrIdAndValueId.split(':')
  //     return { attrId, valueId }
  // })
  // skuParams.skuSaleAttrValueList = saleArr.value.filter((item: any) => item.saleIdAndValueId).map((item: any) => {
  //     let [saleAttrId, saleAttrValueId] = item.saleIdAndValueId.split(':')
  //     return { saleAttrId, saleAttrValueId }
  // })

  //添加SKU的请求
  const result = await reqAddSku(skuParams)
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: '添加SKU成功',
    })
    //通知父组件场景切换为0
    $emit('change-scene', { flag: 0, params: '' })
  } else {
    ElMessage({
      type: 'error',
      message: '添加SKU失败',
    })
  }
}

//对外暴露方法
defineExpose({ initSkuData })
</script>

<style scoped></style>
