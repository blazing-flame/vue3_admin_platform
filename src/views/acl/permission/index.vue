<template>
  <div>
    <el-table
      :data="PermissionArr"
      style="width: 100%; margin-bottom: 20px"
      row-key="id"
      border
    >
      <el-table-column label="名称" prop="name"></el-table-column>
      <el-table-column label="权限值" prop="code"></el-table-column>
      <el-table-column label="修改时间" prop="updateTime"></el-table-column>
      <el-table-column label="操作">
        <!-- row即为已有菜单和按钮的对象的数据 -->
        <template #="{ row, $index }">
          <el-button
            type="primary"
            @click="addPermission(row)"
            style="color: white; padding: 10px"
            icon="Plus"
            size="small"
            :disabled="row.level == 4 ? true : false"
          >
            {{ row.level == 3 ? '添加功能' : '添加菜单' }}
          </el-button>
          <el-button
            type="success"
            @click="updatePermission(row)"
            style="color: white; padding: 10px"
            icon="Edit"
            size="small"
            :disabled="row.level == 1 ? true : false"
          >
            编辑
          </el-button>
          <el-popconfirm
            :title="`你确定要删除${row.name}吗?`"
            width="220px"
            @confirm="deleteMenu(row.id)"
          >
            <template #reference>
              <el-button
                type="danger"
                style="color: white; padding: 10px"
                icon="Delete"
                size="small"
                :disabled="row.level == 1 ? true : false"
              >
                删除
              </el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      v-model="dialogVisible"
      :title="menuData.id ? '更新菜单' : '添加菜单'"
    >
      <el-form>
        <el-form-item label="名称">
          <el-input placeholder="请输入菜单名称" v-model="menuData.name" />
        </el-form-item>
        <el-form-item label="权限">
          <el-input placeholder="请输入权限值" v-model="menuData.code" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button
            style="color: white; padding: 10px"
            type="primary"
            @click="dialogVisible = false"
          >
            取消
          </el-button>
          <el-button
            style="color: white; padding: 10px"
            type="primary"
            @click="save"
          >
            确定
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import {
  reqAllPermission,
  reqAddOrUpdateMenu,
  reqRemoveMenu,
} from '@/api/acl/menu'
import type {
  PermissionList,
  MenuResponseData,
  Permission,
  MenuParams,
} from '@/api/acl/menu/type'
import { ElMessage } from 'element-plus'
//存储菜单的数组
const PermissionArr = ref<PermissionList>([])
//控制对话框显示与隐藏
const dialogVisible = ref<boolean>(false)
//存储携带的菜单的参数
const menuData = reactive<MenuParams>({
  code: '',
  id: 0,
  level: 0,
  name: '',
  pid: 0,
})
//组件挂载完毕
onMounted(() => {
  getHasPermission()
})

//获取菜单的方法
const getHasPermission = async () => {
  const result: MenuResponseData = await reqAllPermission()
  if (result.code == 200) {
    PermissionArr.value = result.data
  }
}

//添加菜单按钮的回调
const addPermission = (row: Permission) => {
  //清空数据
  Object.assign(menuData, {
    code: '',
    id: 0,
    level: 0,
    name: '',
    pid: 0,
  })
  dialogVisible.value = true
  //收集新增的菜单的level数字
  menuData.level = row.level + 1
  //给谁新增子菜单:新菜单的父级等于当前点击行的id
  menuData.pid = row.id as number
}
//编辑按钮的回调
const updatePermission = (row: Permission) => {
  dialogVisible.value = true
  //点击编辑按钮收集已有菜单数据进行更新
  Object.assign(menuData, row)
}

//添加菜单中确定按钮的回调
const save = async () => {
  //发请求
  const result: any = await reqAddOrUpdateMenu(menuData)
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: menuData.id ? '更新菜单成功' : '添加菜单成功',
    })
    dialogVisible.value = false
    //再次获取全部菜单数据
    getHasPermission()
  } else {
    ElMessage({
      type: 'success',
      message: menuData.id ? '更新菜单失败' : '添加菜单失败',
    })
  }
}
//删除菜单的按钮回调
const deleteMenu = async (id: number) => {
  //发请求
  const result: any = await reqRemoveMenu(id)
  if (result.code == 200) {
    ElMessage({ type: 'success', message: '删除菜单成功' })
    getHasPermission()
  }
}
</script>

<style scoped></style>
