<template>
  <div>
    <!-- 三级分类全局组件 -->
    <Category :scene="scene" />
    <el-card style="margin: 10px 0">
      <div v-show="scene == 0">
        <el-button
          @click="addSpu"
          type="primary"
          icon="Plus"
          style="padding: 10px; color: white"
          :disabled="!categoryStore.c3Id"
        >
          添加SPU
        </el-button>
        <!-- 展示已有SPU数据 -->
        <el-table :data="records" style="margin: 10px 0" border>
          <!-- 空数据插槽 -->
          <template #empty>
            <div
              style="
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
              "
            >
              <img src="/beauty1.jpg" style="width: 700px; height: 380px" />
              <span>暂无数据</span>
            </div>
          </template>
          <el-table-column
            label="序号"
            type="index"
            align="center"
            width="80px"
          ></el-table-column>
          <el-table-column label="SPU名称" prop="spuName"></el-table-column>
          <el-table-column label="SPU描述" prop="description"></el-table-column>
          <el-table-column label="操作">
            <!-- row即为已有的spu对象 -->
            <template #="{ row, $index }">
              <el-tooltip content="添加SKU" placement="bottom">
                <el-button
                  @click="addSku(row)"
                  type="primary"
                  icon="Plus"
                  style="width: 40px"
                ></el-button>
              </el-tooltip>
              <el-tooltip content="修改SPU" placement="bottom">
                <el-button
                  @click="updateSpu(row)"
                  type="warning"
                  icon="Edit"
                  style="width: 40px"
                ></el-button>
              </el-tooltip>
              <el-tooltip content="查看SKU" placement="bottom">
                <el-button
                  type="success"
                  icon="View"
                  style="width: 40px"
                  @click="findSku(row)"
                ></el-button>
              </el-tooltip>
              <el-popconfirm
                :title="`你确定要删除${row.spuName}吗?`"
                width="200px"
                @confirm="deleteSpu(row)"
              >
                <template #reference>
                  <el-button
                    type="danger"
                    icon="Delete"
                    style="width: 40px"
                  ></el-button>
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页器 -->
        <el-pagination
          v-model:current-page="pageNo"
          v-model:page-size="limit"
          :page-sizes="[3, 5, 7, 9]"
          :background="true"
          layout="prev, pager, next, jumper, ->, sizes, total,"
          :total="total"
          @current-change="getHasSpu"
          @size-change="changeSize"
        />
      </div>
      <!-- 添加SPU|修改SPU的子组件 -->
      <SpuForm
        ref="spu"
        v-show="scene == 1"
        @change-scene="changeScene"
      ></SpuForm>
      <!-- 添加SKU的子组件 -->
      <SkuForm
        ref="sku"
        v-show="scene == 2"
        @change-scene="changeScene"
      ></SkuForm>
      <!-- dialog对话框：展示已有的SKU数据 -->
      <el-dialog v-model="show" title="SKU列表">
        <el-table border :data="skuArr">
          <el-table-column label="SKU名字" prop="skuName"></el-table-column>
          <el-table-column label="SKU价格" prop="price"></el-table-column>
          <el-table-column label="SKU重量" prop="weight"></el-table-column>
          <el-table-column label="SKU图片">
            <template #="{ row, $index }">
              <img
                :src="row.skuDefaultImg"
                style="width: 100px; height: 100px"
              />
            </template>
          </el-table-column>
        </el-table>
      </el-dialog>
    </el-card>
  </div>
</template>

<script setup lang="ts" name="Spu">
import { ref, watch, onBeforeUnmount } from 'vue'
//引入分类的仓库
import useCategoryStore from '@/store/modules/category'
import { reqSkuList, reqHasSpu, reqRemoveSpu } from '@/api/product/spu'
import type {
  SkuInfoData,
  HasSpuResponseData,
  Records,
  SpuData,
  SkuData,
} from '@/api/product/spu/type'
import SpuForm from './spuForm.vue'
import SkuForm from './skuForm.vue'
import { ElMessage } from 'element-plus'
const categoryStore = useCategoryStore()
//场景切换
const scene = ref<number>(0) //0：显示已有SPU  1：添加SPU|修改SPU 2：添加SKU
//当前页码
const pageNo = ref<number>(1)
//每一页展示多少条数据
const limit = ref<number>(3)
//存储已有SPU数据
const records = ref<Records>([])
//存储已有SPU数据条目
const total = ref<number>(0)
//获取子组件实例SpuForm
const spu = ref<any>()
//获取子组件实例SkuForm
const sku = ref<any>()
//存储全部的SKU数据
const skuArr = ref<SkuData[]>([])
//控制对话框显示
const show = ref<boolean>(false)
//监听三级分类id变化
watch(
  () => categoryStore.c3Id,
  () => {
    //清空上一次Spu数据
    records.value = []
    //保证三级分类id得有才能发请求
    if (!categoryStore.c3Id) return
    getHasSpu()
  },
)

//获取三级分类下已有的SPU数据
const getHasSpu = async (pager = 1) => {
  //当场景1和2为默认页面时，不会出现请求参数错误问题
  if (!categoryStore.c3Id) return
  //修改当前页码
  pageNo.value = pager
  const result: HasSpuResponseData = await reqHasSpu(
    pageNo.value,
    limit.value,
    categoryStore.c3Id,
  )
  if (result.code == 200) {
    records.value = result.data.records
    total.value = result.data.total
  }
}

//分页器下拉菜单发生变化时触发
const changeSize = () => {
  getHasSpu()
}

//添加新的SPU按钮的回调
const addSpu = () => {
  //切换为场景1
  scene.value = 1
  //点击添加SPU按钮调用子组件方法
  spu.value.initAddSpu(categoryStore.c3Id)
}

//修改已有Spu按钮的回调
const updateSpu = (row: SpuData) => {
  //切换为场景1
  scene.value = 1
  //调用子组件实例方法获取完整的已有的SPU数据
  spu.value.initHasSpuData(row)
}

//子组件SpuForm绑定自定义事件：让子组件通知父组件切换场景0
const changeScene = (obj: any) => {
  //子组件SpuForm点击取消变为场景0
  scene.value = obj.flag
  //再次获取全部SPU数据
  if (obj.params == 'update') {
    //更新留在当前页
    getHasSpu(pageNo.value)
  } else if (obj.params == 'add') {
    //添加留在第一页
    getHasSpu()
  }
  // params为''时（SKU取消）不发请求
}
//添加SKU按钮的回调
const addSku = (row: SpuData) => {
  //切换为场景2
  scene.value = 2
  //调用子组件方法初始化添加SKU的数据
  sku.value.initSkuData(categoryStore.c1Id, categoryStore.c2Id, row)
}

//查看SKU列表按钮的回调
const findSku = async (row: SpuData) => {
  const result: SkuInfoData = await reqSkuList(Number(row.id))
  if (result.code == 200) {
    skuArr.value = result.data
    //显示对话框
    show.value = true
  }
}

//删除已有SPU按钮的回调
const deleteSpu = async (row: SpuData) => {
  const result: any = await reqRemoveSpu(Number(row.id))
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: '删除SPU成功',
    })
    //再次获取剩余已有SPU的数据
    getHasSpu(records.value.length > 1 ? pageNo.value : pageNo.value - 1)
  } else {
    ElMessage({
      type: 'error',
      message: '删除SPU失败',
    })
  }
}

//路由组件销毁时，清空数据
onBeforeUnmount(() => {
  categoryStore.$reset()
})
</script>

<style scoped></style>
