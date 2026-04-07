<template>
  <div>
    <!-- 三级分类全局组件 -->
    <Category :scene="scene" />
    <el-card style="margin: 10px 0">
      <div v-show="scene == 0">
        <el-button
          @click="addAttr"
          type="primary"
          icon="Plus"
          style="color: white; padding: 10px"
          :disabled="!categoryStore.c3Id"
        >
          添加属性
        </el-button>
        <el-table border style="margin: 10px 0" :data="attrArr">
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
              <img src="/beauty.jpg" style="width: 700px; height: 380px" />
              <span>暂无数据</span>
            </div>
          </template>
          <el-table-column
            label="序号"
            type="index"
            align="center"
            width="80px"
          ></el-table-column>
          <el-table-column
            label="属性名称"
            width="120px"
            prop="attrName"
          ></el-table-column>
          <el-table-column label="属性值名称">
            <template #="{ row, $index }">
              <el-tag
                style="margin: 5px"
                :type="['primary', 'success', 'warning', 'danger'][index % 4]"
                v-for="(item, index) in row.attrValueList"
                :key="item.id"
              >
                {{ item.valueName }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="120px">
            <template #="{ row, $indev }">
              <el-button
                @click="updateAttr(row)"
                type="warning"
                icon="Edit"
                style="width: 40px"
              ></el-button>
              <el-popconfirm
                :title="`你确定要删除${row.attrName}吗?`"
                width="200px"
                @confirm="deleteAttr(row.id)"
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
      </div>
      <div v-show="scene == 1">
        <!-- 展示添加属性与修改数据的结构 -->
        <el-form :inline="true">
          <el-form-item label="属性名称">
            <el-input
              placeholder="请输入属性名称"
              v-model="attrParams.attrName"
            ></el-input>
          </el-form-item>
        </el-form>
        <el-button
          @click="addAttrValue"
          :disabled="!attrParams.attrName"
          type="primary"
          icon="Plus"
          style="padding: 10px; color: white"
        >
          添加属性值
        </el-button>
        <el-button
          type="danger"
          style="padding: 10px; color: white"
          @click="cancel"
        >
          取消
        </el-button>
        <el-table
          :data="attrParams.attrValueList"
          border
          style="margin: 10px 0"
        >
          <el-table-column
            label="序号"
            width="80px"
            type="index"
            align="center"
          ></el-table-column>
          <el-table-column label="属性值名称" align="center">
            <!-- row：即为当前属性值对象 -->
            <template #="{ row, $index }">
              <el-input
                :ref="(element: any) => (inputArr[$index] = element)"
                v-if="row.flag"
                @blur="toLook(row, $index)"
                v-model="row.valueName"
                placeholder="请输入"
              />
              <div
                v-else
                @click="toEdit(row, $index)"
                style="
                  background-image: linear-gradient(
                    90deg,
                    #8b008b,
                    #ff4500,
                    #ffa500,
                    #ffd700,
                    #00ff00,
                    #00ced1,
                    #1e90ff,
                    #8a2be2
                  );
                "
              >
                {{ row.valueName }}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="属性值操作" align="center">
            <template #="{ row, $index }">
              <el-button
                type="danger"
                icon="Delete"
                style="padding: 10px"
                @click="attrParams.attrValueList.splice($index, 1)"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-button
          type="primary"
          style="padding: 10px; color: white"
          @click="save"
          :disabled="
            attrParams.attrValueList.length === 0 ||
            attrParams.attrValueList.some(
              (item) => item.valueName.trim() === '',
            )
          "
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
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts" name="attr">
import useCategoryStore from '@/store/modules/category'
import { watch, ref, reactive, nextTick, onBeforeUnmount, onMounted } from 'vue'
import type {
  Attr,
  AttrValue,
  AttrResponseData,
  AttrList,
} from '@/api/product/attr/type'
import { reqAddOrUpdateAttr, reqRemoveAttr, reqAttr } from '@/api/product/attr'
import { ElMessage } from 'element-plus'
const categoryStore = useCategoryStore()
//存储已有属性和属性值
const attrArr = ref<AttrList>([])
//定义card组件内容切换变量
const scene = ref<number>(0) //scene=0,显示原table,scene=1,展示添加与修改的table
//收集新增的属性的数据
const attrParams = reactive<Attr>({
  attrName: '', //新增的属性的名字
  attrValueList: [
    //新增的属性值数组
  ],
  categoryId: '', //三级分类的id
  categoryLevel: 3, //代表的是几级分类
})
//准备一个数组：将来存储对应的组件实例el-input
const inputArr = ref<any>([])
//监听仓库三级分类id变化
watch(
  () => categoryStore.c3Id,
  () => {
    //清空上一次查询属性与属性值
    attrArr.value = []
    //保证三级分类id得有才能发请求
    if (!categoryStore.c3Id) return
    getAttr()
  },
)

//获取已有的属性和属性值方法
const getAttr = async () => {
  const { c1Id, c2Id, c3Id } = categoryStore
  const result: AttrResponseData = await reqAttr(c1Id, c2Id, c3Id)
  if (result.code == 200) {
    attrArr.value = result.data
  }
}

//添加属性按钮的回调
const addAttr = () => {
  //每一次点击时候先清空数据
  Object.assign(attrParams, {
    attrName: '', //新增的属性的名字
    attrValueList: [
      //新增的属性值数组
    ],
    categoryId: categoryStore.c3Id, //三级分类的id
    categoryLevel: 3, //代表的是几级分类
  })
  //切换为添加与修改属性的table
  scene.value = 1
}

//修改属性按钮的回调
const updateAttr = (row: Attr) => {
  //切换为添加与修改属性的table
  scene.value = 1
  //将已有属性对象赋值给attrParams对象
  Object.assign(attrParams, JSON.parse(JSON.stringify(row)))
}

//取消按钮的回调
const cancel = () => {
  scene.value = 0
}

//添加属性值按钮的回调
const addAttrValue = () => {
  //点击添加属性值按钮时，向数组添加属性值对象
  attrParams.attrValueList.push({
    valueName: '',
    flag: true, //控制每一个属性值编辑模式与查看模式的切换
  })
  //添加属性值时要聚焦
  nextTick(() => {
    inputArr.value[attrParams.attrValueList.length - 1].focus()
  })
}

//保存按钮的回调
const save = async () => {
  //发请求
  const result: any = await reqAddOrUpdateAttr(attrParams)
  //添加或者修改已有属性成功
  if (result.code == 200) {
    //切换场景
    scene.value = 0
    //提示信息
    ElMessage({
      type: 'success',
      message: attrParams.id ? '修改属性成功' : '添加属性成功',
    })
    //获取全部已有属性和属性值
    getAttr()
  } else {
    ElMessage({
      type: 'error',
      message: attrParams.id ? '修改属性失败' : '添加属性失败',
    })
  }
}

//属性值失去焦点切换查看模式回调
const toLook = (row: AttrValue, $index: number) => {
  //非法情况1：当编辑框为空值时不允许blur,不能变成div
  if (row.valueName.trim() == '') {
    //删空元素
    attrParams.attrValueList.splice($index, 1)
    ElMessage({
      type: 'error',
      message: '属性值不能为空',
    })
    return
  }
  //非法情况2：属性值重复blur时直接干掉该行数据
  const repeat = attrParams.attrValueList.find((item) => {
    //切记要把自己扣除出去，否则自己和自己判断，那就不知道是不是重复了
    if (item != row) {
      //这里是不同对象，表示内存中不同地址，即使值一样也是不一样的
      return item.valueName === row.valueName
    }
  })

  if (repeat) {
    attrParams.attrValueList.splice($index, 1)
    ElMessage({
      type: 'error',
      message: '属性值不能重复',
    })
    return
  }

  //切换到div
  row.flag = false
}

//属性值点击切换编辑模式回调
const toEdit = (row: AttrValue, $index: number) => {
  row.flag = true
  //nextTick:响应式数据发生变化，再获取渲染完成更新后的DOM(组件实例)
  nextTick(() => {
    inputArr.value[$index].focus()
  })
}

//删除已有属性的回调
const deleteAttr = async (attrId: number) => {
  const result: any = await reqRemoveAttr(attrId)
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: '删除属性成功',
    })
    //再次获取已有属性和属性值
    getAttr()
  } else {
    ElMessage({
      type: 'error',
      message: '删除属性失败',
    })
  }
}

//路由组件销毁时，把仓库数据清空
onBeforeUnmount(() => {
  categoryStore.$reset()
})

onMounted(() => {
  categoryStore.$reset()
})
</script>

<style scoped></style>
