<template>
  <div>
    <el-card>
      <el-form :inline="true">
        <el-form-item label="一级分类">
          <el-select
            :disabled="scene == 0 ? false : true"
            style="width: 200px"
            v-model="categoryStore.c1Id"
            @change="handler"
          >
            <!-- option：label即为显示文字，value即为下拉框中收集的数据id，然后v-model接收 -->
            <el-option
              v-for="c1 in categoryStore.c1Arr"
              :key="c1.id"
              :label="c1.name"
              :value="c1.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="二级分类">
          <el-select
            :disabled="scene == 0 ? false : true"
            style="width: 200px"
            v-model="categoryStore.c2Id"
            @change="handler2"
          >
            <!-- option：label即为显示文字，value即为下拉框中收集的数据id，然后v-model接收 -->
            <el-option
              v-for="c2 in categoryStore.c2Arr"
              :key="c2.id"
              :label="c2.name"
              :value="c2.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="三级分类">
          <el-select
            :disabled="scene == 0 ? false : true"
            style="width: 200px"
            v-model="categoryStore.c3Id"
          >
            <!-- option：label即为显示文字，value即为下拉框中收集的数据id，然后v-model接收 -->
            <el-option
              v-for="c3 in categoryStore.c3Arr"
              :key="c3.id"
              :label="c3.name"
              :value="c3.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>
<script setup lang="ts">
// //引入生命周期函数钩子
import { onMounted } from 'vue'
//引入分类相关仓库
import useCategoryStore from '@/store/modules/category'
const categoryStore = useCategoryStore()
//分类全局组件挂载完毕，通知仓库发请求获取一级分类的数据
onMounted(() => {
  getC1()
})

//通知仓库获取一级分类的方法
const getC1 = () => {
  //通知分类仓库发请求获取一级分类的数据
  categoryStore.getC1()
}

defineProps(['scene'])

//一级分类下拉菜单的change事件（选中值的时候触发，以保存一级分类id）
const handler = () => {
  //需要将二级三级分类的数据清空
  categoryStore.c2Id = ''
  categoryStore.c3Arr = []
  categoryStore.c3Id = ''

  //获取二级分类数据
  categoryStore.getC2()
}

//二级分类下拉菜单的change事件（选中值的时候触发，以保存二级分类id）
const handler2 = () => {
  //需要将三级分类的数据清空
  categoryStore.c3Id = ''
  //获取三级分类数据
  categoryStore.getC3()
}
</script>

<style scoped></style>
