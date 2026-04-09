<template>
  <div>
    <el-card class="box-card">
      <!-- 卡片顶部添加品牌按钮 -->
      <el-button
        type="primary"
        size="default"
        icon="Plus"
        style="padding: 10px; color: white"
        @click="addTrademark"
        v-has="`btn.Trademark.add`"
      >
        添加品牌
      </el-button>
      <!-- 表格组件：用于展示已有的平台数据 -->
      <!-- 
            table
            ---border:可以设置表格纵向是否有边框
            table-column
            ---label：某一个列表
            ---width：设置这列宽度
            ---align：设置这一列对齐方式
         -->
      <el-table style="margin: 10px 0" border :data="trademarkArr">
        <el-table-column
          label="序号"
          width="80px"
          align="center"
          type="index"
        />
        <!-- table-column默认展示数据用div -->
        <el-table-column label="品牌名称">
          <template #="{ row }">
            <pre style="color: blueviolet">{{ row.tmName }}</pre>
          </template>
        </el-table-column>
        <el-table-column label="品牌LOGO">
          <template #="{ row }">
            <img :src="row.logoUrl" width="150px" height="120px" />
          </template>
        </el-table-column>
        <el-table-column label="品牌操作">
          <template #="{ row }">
            <el-button
              type="primary"
              icon="Edit"
              style="width: 50px"
              @click="updateTrademark(row)"
            ></el-button>
            <el-popconfirm
              :title="`您确定要删除${row.tmName}吗?`"
              width="250px"
              icon="Delete"
              @confirm="removetrademark(row.id)"
            >
              <template #reference>
                <el-button
                  type="danger"
                  icon="Delete"
                  style="width: 50px"
                ></el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页器组件
              pagination:
                 v-model:current-page:设置分页器当前页码
                 v-model:page-size:每页显示数据条目个数
                 page-sizes：下拉菜单数据
                 background:设置分页器按钮背景颜色
                 layout:可以设置分页器6个子组件布局
          -->
      <el-pagination
        @current-change="getHasTrademark"
        @size-change="changeSize"
        v-model:current-page="pageNo"
        v-model:page-size="limit"
        :page-sizes="[3, 5, 7, 9]"
        :background="true"
        layout=" prev, pager, next, jumper, ->, sizes ,total"
        :total="total"
      />
    </el-card>
    <!-- 对话框组件：在添加品牌与修改已有品牌的业务时候使用结构 -->
    <!-- 
         v-model:用于控制对话框的显示和隐藏  true：显示  false：隐藏 
         title：设置对话框左上角标题
    -->
    <el-dialog
      v-model="dialogFormVisible"
      :title="trademarkParams.id ? '修改品牌' : '添加品牌'"
      width="500"
    >
      <el-form
        style="width: 80%"
        :model="trademarkParams"
        :rules="rules"
        ref="formRef"
      >
        <el-form-item label="品牌名称" label-width="100px" prop="tmName">
          <el-input
            placeholder="请您输入品牌名称"
            v-model="trademarkParams.tmName"
          />
        </el-form-item>
        <el-form-item label="品牌LOGO" label-width="100px" prop="logoUrl">
          <!-- upload组件属性：action图片上传路径必须书写/api，否则代理服务器不发送这次post请求 -->
          <el-upload
            class="avatar-uploader"
            action="/api/admin/product/fileUpload"
            :headers="headers"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img
              v-if="trademarkParams.logoUrl"
              :src="trademarkParams.logoUrl"
              class="avatar"
            />
            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
          </el-upload>
        </el-form-item>
      </el-form>
      <!-- 具名插槽：footer -->
      <template #footer>
        <el-button
          type="primary"
          style="width: 50px; color: white"
          @click="confirm"
        >
          确定
        </el-button>
        <el-button
          type="primary"
          style="width: 50px; color: white"
          @click="cancel"
        >
          取消
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts" name="trademark">
import { ref, onMounted, reactive, nextTick } from 'vue'
import {
  reqHasTrademark,
  reqAddOrUpdateTrademark,
  reqDeleteTrademark,
} from '@/api/product/trademark'
import type {
  Records,
  TradeMarkResponseData,
  Trademark,
} from '@/api/product/trademark/type'
import type { UploadProps } from 'element-plus'
import { ElMessage } from 'element-plus'
//当前页码
const pageNo = ref<number>(1)
//每一页展示多少条数据
const limit = ref<number>(3)
//存储已有品牌数据总数
const total = ref<number>(0)
//存储已有品牌数组
const trademarkArr = ref<Records>([])
//控制对话框显示与隐藏的数据
const dialogFormVisible = ref<boolean>(false)
//定义新增品牌参数
const trademarkParams = reactive<Trademark>({
  tmName: '',
  logoUrl: '',
})
//获取el-form组件实例
const formRef = ref()

// el-upload 上传 http 请求头，携带 Token
// 引入用户相关的仓库
import useUserStore from '@/store/modules/user'
// 获取用户相关的小仓库：获取仓库内部token，登录成功以后携带给服务器
const userStore = useUserStore()
const headers = { Token: userStore.token }

//获取已有品牌的接口封装为一个函数：在任何情况下想获取数据，调用次函数即可
const getHasTrademark = async (currentPage = 1) => {
  pageNo.value = currentPage
  const result: TradeMarkResponseData = await reqHasTrademark(
    pageNo.value,
    limit.value,
  )
  // console.log(result);

  if (result.code == 200) {
    //存储已有品牌总个数
    total.value = result.data.total
    trademarkArr.value = result.data.records
  }
}
//组件挂载完毕，发一次请求，获取一页三个数据
onMounted(() => {
  getHasTrademark()
})
//分页器当前页码发生变化的时候会触发
//对于当前页码发生变化的自定义组件，组件pagination向父组件回传数据(当前页码)
// const changePageNo = (a) => {
//   console.log(a);

//   //当前页码发生变化的时候再次发请求获取对应已有品牌数据展示
//   getHasTrademark()

// }

//当下拉菜单发生变化的时候触发
//这个自定义事件，分页器组件会将下拉菜单选择数据返回
const changeSize = () => {
  //当前每一页数据量发生变化时，页数归一
  // pageNo.value = 1
  getHasTrademark()
}

//添加品牌按钮的回调
const addTrademark = () => {
  //对话框显示
  dialogFormVisible.value = true
  //清空收集数据
  trademarkParams.id = undefined
  trademarkParams.logoUrl = ''
  trademarkParams.tmName = ''
  //第一种写法：ts的?写法
  // formRef.value?.clearValidate();

  //
  nextTick(() => {
    formRef.value.clearValidate()
  })
}

//修改已有品牌按钮的回调
const updateTrademark = (row: Trademark) => {
  //清空校验规则错误提示信息
  nextTick(() => {
    formRef.value.clearValidate()
  })
  //对话框显示
  dialogFormVisible.value = true
  //ES6合并语法对象
  Object.assign(trademarkParams, row)
  // trademarkParams.id = row.id
  // //展示已有品牌的数据
  // trademarkParams.tmName = row.tmName
  // trademarkParams.logoUrl = row.logoUrl
}

//对话框底部确定按钮
const confirm = async () => {
  //发请求之前，对整个表单进行校验
  await formRef.value.validate()
  const result: any = await reqAddOrUpdateTrademark(trademarkParams)

  //添加|修改品牌成功
  if (result.code == 200) {
    //关闭对话框
    dialogFormVisible.value = false
    //弹出提示信息
    ElMessage({
      type: 'success',
      message: trademarkParams.id ? '修改品牌成功' : '添加品牌成功',
    })
    //再次获取数据总条数
    getHasTrademark(trademarkParams.id ? pageNo.value : 1)
  } else {
    ElMessage({
      type: 'success',
      message: trademarkParams.id ? '修改品牌失败' : '添加品牌失败',
    })
    //关闭对话框
    dialogFormVisible.value = false
  }
}

//对话框底部取消按钮
const cancel = () => {
  dialogFormVisible.value = false
}

//上传图片组件->上传图片之前触发的钩子函数
const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
  //钩子是在图片上传成功之前触发，上传文件之前可以约束文件类型和大小
  //要求：上传文件格式png|jpg|gif 8M
  if (
    rawFile.type == 'image/jpg' ||
    rawFile.type == 'image/png' ||
    rawFile.type == 'image/gif' ||
    rawFile.type == 'image/jpeg'
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

//图片上传成功的钩子
const handleAvatarSuccess: UploadProps['onSuccess'] = (
  response,
  uploadFile,
) => {
  //response:当前这次上传图片post请求服务器返回的数据
  //收集上传图片的地址，添加一个新的品牌的时候带给服务器
  trademarkParams.logoUrl = response.data
  //如果图片上传成功，清除图片校验结果
  formRef.value.clearValidate()
}

//品牌自定义校验规则方法
const validatortmName = (rule: any, value: any, callback: any) => {
  if (value.trim().length >= 2) {
    callback()
  } else {
    callback(new Error('品牌名称大于等于两位'))
  }
}
const validatorLogoUrl = (rule: any, value: any, callback: any) => {
  //如果图片上传

  if (value) {
    callback()
  } else {
    callback(new Error('LOGO图片务必上传'))
  }
}

//表单校验规则
const rules = {
  tmName: [{ required: true, trigger: 'blur', validator: validatortmName }],
  logoUrl: [{ required: true, validator: validatorLogoUrl }],
}

//气泡确认框确定按钮的回调
const removetrademark = async (id: number) => {
  console.log(id)

  //点击确定按钮删除已有品牌
  const result = await reqDeleteTrademark(id)
  if (result.code == 200) {
    //删除
    ElMessage({
      type: 'success',
      message: '删除品牌成功',
    })
    //再次获取已有品牌总数
    getHasTrademark(
      trademarkArr.value.length > 1 ? pageNo.value : pageNo.value - 1,
    )
  } else {
    ElMessage({
      type: 'error',
      message: '删除品牌失败',
    })
  }
}
</script>

<style scoped>
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>
