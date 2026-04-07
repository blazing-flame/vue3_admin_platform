<template>
  <el-form label-width="100px">
    <el-form-item label="SPU名称">
      <el-input placeholder="请输入SPU名称" v-model="SpuParams.spuName" />
    </el-form-item>
    <el-form-item label="SPU品牌">
      <el-select style="width: 200px" v-model="SpuParams.tmId">
        <el-option
          v-for="item in allTradeMark"
          :key="item.id"
          :label="item.tmName"
          :value="item.id"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="SPU描述">
      <el-input
        type="textarea"
        placeholder="请输入描述"
        v-model="SpuParams.description"
      />
    </el-form-item>
    <el-form-item label="SPU图标">
      <!-- v-model:fileList-> 展示默认图片  读：imgList 里有什么图片，上传区域就展示什么图片（回显已有图片用的就是这个） 写：用户新增或删除了图片，imgList 自动同步更新
                 action:上传图片的接口地址
                 list-type:文件列表类型
            -->
      <el-upload
        v-model:file-list="imgList"
        action="/api/admin/product/fileUpload"
        list-type="picture-card"
        :on-preview="handlePictureCardPreview"
        :on-remove="handleRemove"
        :before-upload="handleUpload"
        :headers="{ token: userStore.token }"
      >
        <el-icon><Plus /></el-icon>
      </el-upload>

      <el-dialog v-model="dialogVisible">
        <img :src="dialogImageUrl" alt="Preview Image" style="width: 100%" />
      </el-dialog>
    </el-form-item>
    <el-form-item label="SPU销售属性">
      <!-- 展示销售属性的下拉菜单 -->
      <!-- 这里的v-model->写：用户选了某个选项，那个选项的 :value（比如 "1:颜色"）自动写入 saleAttrIdAndValueName,下拉框显示颜色
                  v-model 实际上主要用的是写的方向，就是收集用户选了哪个属性，读的方向在这个场景下没有实际意义，因为saleAttrIdAndValueName开始为空值，下拉框本来就是“请选择”
             -->
      <el-select
        v-model="saleAttrIdAndValueName"
        style="width: 200px"
        :placeholder="
          unSelectSaleAttr.length
            ? `还可选择${unSelectSaleAttr.length}个`
            : '无'
        "
      >
        <el-option
          :value="`${item.id}:${item.name}`"
          v-for="(item, index) in unSelectSaleAttr"
          :key="item.id"
          :label="item.name"
        ></el-option>
      </el-select>
      <el-button
        @click="addSaleAttr"
        :disabled="!saleAttrIdAndValueName"
        type="primary"
        icon="Plus"
        style="padding: 10px; color: white; margin-left: 10px"
      >
        添加属性
      </el-button>
      <!-- 展示销售属性与属性值 -->
      <el-table border style="margin: 10px 0" :data="saleAttr">
        <el-table-column
          label="序号"
          type="index"
          align="center"
          width="80px"
        ></el-table-column>
        <el-table-column
          label="销售属性名字"
          width="120px"
          prop="saleAttrName"
        ></el-table-column>
        <el-table-column label="销售属性值">
          <!-- row即为已有销售属性对象 -->
          <template #="{ row, $index }">
            <el-tag
              v-for="(item, index) in row.spuSaleAttrValueList"
              :key="item.id"
              closable
              style="margin: 0 5px"
              :type="['primary', 'success', 'warning', 'danger'][index % 4]"
              @close="row.spuSaleAttrValueList.splice(index, 1)"
            >
              {{ item.saleAttrValueName }}
            </el-tag>
            <el-input
              :ref="(element: any) => (inputArr[$index] = element)"
              @blur="toLook(row)"
              v-model="row.saleAttrValue"
              v-if="row.flag == true"
              placeholder="请输入属性值名称"
              size="small"
              style="width: 150px"
            />
            <el-button
              @click="toEdit(row, $index)"
              v-else
              type="primary"
              size="small"
              icon="Plus"
              style="padding: 0 10px; color: white; margin-left: 10px"
            ></el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120px">
          <template #="{ row, $index }">
            <el-button
              @click="saleAttr.splice($index, 1)"
              type="danger"
              icon="Delete"
              style="padding: 0 10px; color: white; margin-left: 10px"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>
    <el-form-item>
      <el-button
        :disabled="saleAttr.length > 0 ? false : true"
        @click="save"
        type="primary"
        style="padding: 10px; color: white"
      >
        保存
      </el-button>
      <el-button
        @click="cancel"
        type="danger"
        style="padding: 10px; color: white"
      >
        取消
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts" name="SpuForm">
import useUserStore from '@/store/modules/user'
import type {
  SaleAttrValue,
  HasSaleAttr,
  SaleAttr,
  Image,
  Trademark,
  SpuData,
  SpuHasImg,
  AllTradeMark,
  SaleAttrResponseData,
  HasSaleAttrResponseData,
} from '@/api/product/spu/type'
import {
  reqAddOrUpdateSpu,
  reqAllTradeMark,
  reqSpuImageList,
  reqSpuHasSaleAttr,
  reqAllSaleAttr,
} from '@/api/product/spu/index'
import { ref, computed, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
const userStore = useUserStore()
const $emit = defineEmits(['change-scene'])
//点击取消按钮通知父组件切换场景1
const cancel = () => {
  $emit('change-scene', { flag: 0, params: 'update' })
}
//存储已有的SPU品牌数据
const allTradeMark = ref<Trademark[]>([])
//存储已有的商品图片
const imgList = ref<Image[]>([])
//存储SPU已有的销售属性
const saleAttr = ref<SaleAttr[]>([])
//存储全部销售属性
const allSaleAttr = ref<HasSaleAttr[]>([])
//控制对话框的显示与隐藏
const dialogVisible = ref<boolean>(false)
//存储预览图片地址
const dialogImageUrl = ref<string>('')
//存储已有的SPU对象
const SpuParams = ref<SpuData>({
  category3Id: '', //收集三级分类的ID
  description: '', //SPU的描述
  tmId: '', //品牌的ID
  spuName: '', //SPU的名字
  spuImageList: [],
  spuSaleAttrList: [],
})
//存储还未选择的销售属性的ID和名字
const saleAttrIdAndValueName = ref<string>('')
//准备一个数组：将来存储对应的组件实例el-input
const inputArr = ref<any>([])
//子组件发请求和获取数据的方法
const initHasSpuData = async (spu: SpuData) => {
  //存储已有的SPU对象，将来在模版中展示
  SpuParams.value = spu
  //spu即为父组件传递过来的已有的SPU数据对象（不完整）
  //获取全部品牌完整数据
  const result: AllTradeMark = await reqAllTradeMark()
  //获取某一品牌下全部售卖商品的图片
  const result1: SpuHasImg = await reqSpuImageList(spu.id as number)
  //获取已有SPU的销售属性
  const result2: SaleAttrResponseData = await reqSpuHasSaleAttr(
    spu.id as number,
  )
  //获取整个项目全部SPU的销售属性
  const result3: HasSaleAttrResponseData = await reqAllSaleAttr()

  //存储全部品牌数据
  allTradeMark.value = result.data
  //存储全部已有商品照片
  imgList.value = result1.data.map((item) => {
    return {
      name: item.imgName,
      url: item.imgUrl,
    }
  })
  //存储SPU已有的销售属性
  saleAttr.value = result2.data
  //存储全部销售属性
  allSaleAttr.value = result3.data
}
//照片墙点击预览按钮时触发的钩子
const handlePictureCardPreview = (file: any) => {
  dialogImageUrl.value = file.url
  //对话框弹出
  dialogVisible.value = true
}
//照片墙删除图片的钩子
const handleRemove = () => {}

//照片墙上传成功之前的钩子
const handleUpload = (rawFile: any) => {
  if (
    rawFile.type == 'image/jpg' ||
    rawFile.type == 'image/png' ||
    rawFile.type == 'image/gif' ||
    rawFile.type == 'image/jpeg' ||
    rawFile.type == 'image/webp'
  ) {
    if (rawFile.size / 1024 / 1024 < 8) {
      return true
    } else {
      ElMessage({
        type: 'error',
        message: '上传文件大小大于8M',
      })
      return false
    }
  } else {
    ElMessage({
      type: 'error',
      message: '上传文件格式务必PNG|JPG|GIF',
    })
    return false
  }
}

//计算出当前SPU未拥有的销售属性
const unSelectSaleAttr = computed(() => {
  //全部销售属性：颜色，版本，尺寸
  //当前已有销售属性：颜色，版本
  const unSelectArr = allSaleAttr.value.filter((item) => {
    return saleAttr.value.every((item1) => {
      return item.name != item1.saleAttrName
    })
  })
  return unSelectArr
})

//添加销售属性的方法
const addSaleAttr = () => {
  /*
    baseSaleAttrId: number,
    saleAttrName: string,
    spuSaleAttrValueList:spuSaleAttrValueList
    */
  const [baseSaleAttrId, saleAttrName] = saleAttrIdAndValueName.value.split(':')
  //准备一个新的销售对象，将来带给服务器即可
  const newSaleAttr: SaleAttr = {
    baseSaleAttrId: Number(baseSaleAttrId),
    saleAttrName,
    spuSaleAttrValueList: [],
  }
  //追加到数组当中去
  saleAttr.value.push(newSaleAttr)
  //清空收集的数据
  saleAttrIdAndValueName.value = ''
}

//属性值按钮点击事件
const toEdit = (row: SaleAttr, $index: number) => {
  //点击按钮，编辑模式出来
  row.flag = true
  row.saleAttrValue = ''
  //等DOM更新完后，执行此函数自动聚焦
  nextTick(() => {
    inputArr.value[$index].focus()
  })
}

//表单元素失去焦点的事件回调
const toLook = (row: SaleAttr) => {
  //整理收集到的属性ID和属性值名字
  const { baseSaleAttrId, saleAttrValue } = row
  //整理成服务器需要的属性值形式
  const newSaleAttrValue: SaleAttrValue = {
    baseSaleAttrId,
    saleAttrValueName: saleAttrValue as string,
  }
  //非法情况一判断：不能为空
  if ((saleAttrValue as string).trim() == '') {
    ElMessage({
      type: 'error',
      message: '属性值不能为空',
    })
    return
  }
  //判断属性值在数组中是否存在
  const repeat = row.spuSaleAttrValueList.find((item) => {
    return item.saleAttrValueName == saleAttrValue
  })
  if (repeat) {
    ElMessage({
      type: 'error',
      message: '属性值重复',
    })
    return
  }

  //追加新的属性值对象
  row.spuSaleAttrValueList.push(newSaleAttrValue)
  //切换为查看模式
  row.flag = false
}

//点击保存按钮的回调
const save = async () => {
  //整理参数
  //1.照片墙的数据
  SpuParams.value.spuImageList = imgList.value.map((item: any) => {
    return {
      imgName: item.name,
      imgUrl: (item.response && item.response.data) || item.url,
    }
  })
  //2.销售属性的数据
  SpuParams.value.spuSaleAttrList = saleAttr.value
  //发请求：添加SPU|更新已有SPU
  const result = await reqAddOrUpdateSpu(SpuParams.value)
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: SpuParams.value.id ? '更新SPU成功' : '添加SPU成功',
    })
    //通知父组件切换场景为0
    $emit('change-scene', {
      flag: 0,
      params: SpuParams.value.id ? 'update' : 'add',
    })
  } else {
    ElMessage({
      type: 'error',
      message: SpuParams.value.id ? '更新SPU失败' : '添加SPU失败',
    })
  }
}

//添加一个新的SPU初始化请求方法
const initAddSpu = async (c3Id: number | string) => {
  //清空数据
  Object.assign(SpuParams.value, {
    id: undefined,
    category3Id: '', //收集三级分类的ID
    description: '', //SPU的描述
    tmId: '', //品牌的ID
    spuName: '', //SPU的名字
    spuImageList: [],
    spuSaleAttrList: [],
  })
  //清空照片墙和销售属性
  imgList.value = []
  saleAttr.value = []
  saleAttrIdAndValueName.value = ''
  //存储c3Id
  SpuParams.value.category3Id = c3Id
  //获取全部品牌完整数据
  const result: AllTradeMark = await reqAllTradeMark()
  //获取整个项目全部SPU的销售属性
  const result1: HasSaleAttrResponseData = await reqAllSaleAttr()
  allTradeMark.value = result.data
  allSaleAttr.value = result1.data
}
//对外暴露
defineExpose({ initHasSpuData, initAddSpu })
</script>

<style scoped></style>
