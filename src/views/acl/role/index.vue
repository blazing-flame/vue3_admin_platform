<template>
  <div>
    <el-card>
      <el-form :inline="true">
        <el-form-item label="角色名称:" style="margin: 0">
          <el-input placeholder="请输入角色名称" v-model="keyword"></el-input>
        </el-form-item>
        <el-form-item style="margin: 0 30px">
          <el-button
            type="primary"
            style="color: white; padding: 10px"
            :disabled="!keyword"
            @click="search"
          >
            搜索
          </el-button>
          <el-button
            type="primary"
            style="color: white; padding: 10px"
            @click="reset"
          >
            重置
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card style="margin: 10px 0">
      <el-button
        type="primary"
        style="color: white; padding: 10px"
        icon="Plus"
        @click="addRole"
      >
        添加职位
      </el-button>
      <el-table border style="margin: 10px 0" :data="allRoles">
        <el-table-column
          type="index"
          align="center"
          label="#"
        ></el-table-column>
        <el-table-column align="center" label="id" prop="id"></el-table-column>
        <el-table-column
          align="center"
          label="角色名称"
          prop="roleName"
        ></el-table-column>
        <el-table-column
          align="center"
          label="创建时间"
          prop="createTime"
        ></el-table-column>
        <el-table-column
          align="center"
          label="更新时间"
          prop="updateTime"
        ></el-table-column>
        <el-table-column align="center" label="操作" width="260px">
          <!-- row即为已有职位对象 -->
          <template #="{ row, $index }">
            <el-button
              type="primary"
              style="color: white; padding: 10px"
              icon="User"
              size="small"
              @click="setPermission(row)"
            >
              分配权限
            </el-button>
            <el-button
              type="success"
              style="color: white; padding: 10px"
              icon="Edit"
              size="small"
              @click="updateRole(row)"
            >
              编辑
            </el-button>
            <el-popconfirm
              :title="`你确定要删除${row.roleName}吗?`"
              width="200px"
              @confirm="deleteRole(row.id)"
            >
              <template #reference>
                <el-button
                  type="danger"
                  size="small"
                  icon="Delete"
                  style="color: white; padding: 10px"
                >
                  删除
                </el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        v-model:current-page="pageNo"
        v-model:page-size="limit"
        :page-sizes="[10, 20, 30, 40]"
        :background="true"
        layout="prev, pager, next, jumper, ->, sizes, total"
        :total="total"
        @current-change="getHasRoles"
        @size-change="handler"
      />
    </el-card>
    <!-- 添加职位与更新已有职位的结构：对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="RoleParams.id ? '更新角色' : '添加角色'"
    >
      <el-form :model="RoleParams" :rules="rules" ref="formRef">
        <el-form-item label="角色名称" prop="roleName">
          <el-input
            placeholder="请输入角色名称"
            v-model="RoleParams.roleName"
          ></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button
          type="primary"
          style="color: white; padding: 10px"
          @click="dialogVisible = false"
        >
          取消
        </el-button>
        <el-button
          type="primary"
          style="color: white; padding: 10px"
          @click="save"
        >
          确定
        </el-button>
      </template>
    </el-dialog>
    <!-- 抽屉组件：分配角色的菜单权限与按钮的权限 -->
    <!-- <el-drawer v-model="drawer">
            <template #header>
                <h4>分配权限</h4>
            </template>
            <template #default>
                <el-tree
                    style="max-width: 600px"
                    :data="menuArr"
                    show-checkbox
                    node-key="id"
                    default-expand-all
                    :default-checked-keys="[1]"
                    :props="defaultProps"
                />
            </template>
            <template #footer>
                <div style="flex: auto">
                    <el-button type="primary" @click="drawer = false" style="color:white;padding:10px;">取消</el-button>
                    <el-button type="primary" style="color:white;padding:10px;">确认</el-button>
                </div>
            </template>
        </el-drawer> -->
    <el-drawer
      v-model="drawer"
      size="420px"
      :with-header="false"
      class="permission-drawer"
    >
      <div class="drawer-container">
        <!-- 自定义header -->
        <div class="drawer-header">
          <div class="header-left">
            <div class="header-icon">
              <el-icon><Lock /></el-icon>
            </div>
            <div>
              <h3 class="header-title">分配权限</h3>
              <p class="header-sub">为角色配置菜单与操作权限</p>
            </div>
          </div>
          <el-icon class="close-btn" @click="drawer = false"><Close /></el-icon>
        </div>

        <!-- 树形区域 -->
        <div class="drawer-body">
          <div class="tree-wrapper">
            <el-tree
              ref="tree"
              style="background: transparent"
              :data="menuArr"
              show-checkbox
              node-key="id"
              default-expand-all
              :default-checked-keys="selectArr"
              :props="defaultProps"
              class="permission-tree"
            />
          </div>
        </div>

        <!-- footer -->
        <div class="drawer-footer">
          <el-button class="btn-cancel" @click="drawer = false">取消</el-button>
          <el-button class="btn-confirm" type="primary" @click="handler1">
            确认
          </el-button>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, nextTick } from 'vue'
import {
  reqRemoveRole,
  reqAllRolesList,
  reqAddOrUpdateRole,
  reqAllMenuList,
  reqSetPermission,
} from '@/api/acl/role'
import type {
  AllRolesResponseData,
  AllRolesList,
  RoleData,
  MenuResponseData,
  MenuList,
} from '@/api/acl/role/type'
import useLayoutSettingStore from '@/store/modules/setting'
import { ElMessage } from 'element-plus'
import { Lock, Close } from '@element-plus/icons-vue'
import useUserStore from '@/store/modules/user'
const userStore = useUserStore()
//获取仓库
const settingStore = useLayoutSettingStore()
//默认页码
const pageNo = ref<number>(1)
//一页展示多少个数据
const limit = ref<number>(10)
//存储职位关键字
const keyword = ref<string>('')
//存储全部已有职位
const allRoles = ref<AllRolesList>([])
//职位总个数
const total = ref<number>(0)
//控制对话框显示与隐藏
const dialogVisible = ref<boolean>(false)
//获取form组件实例
const formRef = ref<any>()
//控制抽屉的显示与隐藏
const drawer = ref<boolean>(false)
//存储用户权限数据的数组
const menuArr = ref<MenuList>([])
//存储勾选的节点ID的数组(最低级)
const selectArr = ref<number[]>([])
//获取tree组件实例
const tree = ref<any>()
//收集新增角色数据
const RoleParams = reactive<RoleData>({
  id: undefined,
  roleName: '',
})
//组件挂载完毕
onMounted(() => {
  getHasRoles()
})
//发请求获取全部职位
const getHasRoles = async (pager = 1) => {
  //当前页码
  pageNo.value = pager
  const result: AllRolesResponseData = await reqAllRolesList(
    pageNo.value,
    limit.value,
    keyword.value,
  )
  if (result.code == 200) {
    total.value = result.data.total
    allRoles.value = result.data.records
  }
}
//分页器下拉菜单
const handler = () => {
  getHasRoles()
}
//搜索按钮的回调
const search = () => {
  //根据关键字获取相应用户数据
  getHasRoles()
  keyword.value = ''
}

//重置按钮回调
const reset = () => {
  settingStore.refresh = !settingStore.refresh
}

//添加角色按钮回调
const addRole = () => {
  dialogVisible.value = true
  //清空数据和校验内容
  Object.assign(RoleParams, {
    id: undefined,
    roleName: '',
  })
  nextTick(() => {
    formRef.value.clearValidate()
  })
}
//更新角色按钮的回调
const updateRole = (row: RoleData) => {
  dialogVisible.value = true
  //存储已有角色(带有ID)
  Object.assign(RoleParams, row)
  nextTick(() => {
    formRef.value.clearValidate()
  })
}
//自定义校验规则回调
const validatorRoleName = (rule: any, value: any, callback: any) => {
  if (value.trim().length >= 2) {
    callback()
  } else {
    callback(new Error('角色名称至少2位'))
  }
}
//角色校验规则
const rules = {
  roleName: [{ required: true, trigger: 'blur', validator: validatorRoleName }],
}
//对话框确定按钮的回调
const save = async () => {
  //先校验完再发请求
  await formRef.value.validate()
  //发请求添加或更新角色
  const result = await reqAddOrUpdateRole(RoleParams)
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: RoleParams.id ? '更新角色成功' : '添加角色成功',
    })
    dialogVisible.value = false
    //再次获取角色
    getHasRoles(RoleParams.id ? pageNo.value : 1)
  }
}

//分配权限按钮回调
const setPermission = async (row: RoleData) => {
  drawer.value = true
  //收集当前角色分类权限的数据
  Object.assign(RoleParams, row)
  //根据角色获取权限
  const result: MenuResponseData = await reqAllMenuList(RoleParams.id as number)
  if (result.code == 200) {
    menuArr.value = result.data
    selectArr.value = filterSelectArr(menuArr.value, [])
  }
}

const filterSelectArr = (allData: any, initData: any) => {
  allData.forEach((item: any) => {
    if (item.select && !item.children) {
      initData.push(item.id)
    }
    if (item.children) {
      filterSelectArr(item.children, initData)
    }
  })
  return initData
}

//树形控件展示名字和菜单
const defaultProps = {
  children: 'children',
  label: 'name',
}

//抽屉确定按钮回调
const handler1 = async () => {
  //角色的ID
  const roleId = RoleParams.id as number
  //选中节点的ID
  const arr1 = tree.value.getCheckedKeys()
  //半选中节点的ID
  const arr2 = tree.value.getHalfCheckedKeys()
  //合并数组
  const permissionId = [...arr1, ...arr2]
  //下发权限
  const result: any = await reqSetPermission(roleId, permissionId)
  if (result.code == 200) {
    drawer.value = false
    ElMessage({ type: 'success', message: '分配权限成功' })
  } else {
    ElMessage({ type: 'error', message: '分配权限失败' })
  }
}
//删除已有角色
const deleteRole = async (id: number) => {
  const result: any = await reqRemoveRole(id)
  if (result.code == 200) {
    ElMessage({ type: 'success', message: '删除角色成功' })
    getHasRoles(allRoles.value.length > 1 ? pageNo.value : pageNo.value - 1)
  }
}
</script>

<style scoped>
/* 覆盖el-drawer面板本身 */
:deep(.el-drawer) {
  background: linear-gradient(
    160deg,
    #eef2ff 0%,
    #f0fdf4 60%,
    #ffffff 100%
  ) !important;
  border-left: 1px solid rgba(148, 163, 184, 0.2);
  box-shadow: -8px 0 40px rgba(0, 0, 0, 0.08);
}

:deep(.el-drawer__body) {
  padding: 0 !important;
  overflow: hidden;
}

/* 整体容器 */
.drawer-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  color: #334155;
}

/* Header */
.drawer-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px 24px 20px;
  border-bottom: 1px solid rgba(148, 163, 184, 0.15);
  background: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(8px);
  flex-shrink: 0;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 14px;
}

.header-icon {
  width: 42px;
  height: 42px;
  border-radius: 10px;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  color: #fff;
  box-shadow: 0 4px 15px rgba(99, 102, 241, 0.3);
}

.header-title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
  letter-spacing: 0.5px;
}

.header-sub {
  margin: 2px 0 0;
  font-size: 12px;
  color: #94a3b8;
}

.close-btn {
  font-size: 20px;
  color: #94a3b8;
  cursor: pointer;
  padding: 4px;
  border-radius: 6px;
  transition: all 0.2s;
}

.close-btn:hover {
  color: #475569;
  background: rgba(148, 163, 184, 0.15);
}

/* 树形区域 */
.drawer-body {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
}

.drawer-body::-webkit-scrollbar {
  width: 4px;
}

.drawer-body::-webkit-scrollbar-track {
  background: transparent;
}

.drawer-body::-webkit-scrollbar-thumb {
  background: rgba(148, 163, 184, 0.3);
  border-radius: 4px;
}

.tree-wrapper {
  background: rgba(255, 255, 255, 0.6);
  border: 1px solid rgba(148, 163, 184, 0.15);
  border-radius: 12px;
  padding: 12px 8px;
  backdrop-filter: blur(4px);
}

/* 树形控件样式 */
:deep(.permission-tree .el-tree-node__content) {
  height: 36px;
  border-radius: 8px;
  transition: background 0.2s;
  color: #475569;
}

:deep(.permission-tree .el-tree-node__content:hover) {
  background: rgba(99, 102, 241, 0.08) !important;
  color: #3730a3;
}

:deep(.permission-tree .el-tree-node.is-current > .el-tree-node__content) {
  background: rgba(99, 102, 241, 0.1) !important;
}

:deep(.permission-tree .el-checkbox__inner) {
  background: #fff;
  border-color: #cbd5e1;
  border-radius: 4px;
}

:deep(.permission-tree .el-checkbox__input.is-checked .el-checkbox__inner) {
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  border-color: transparent;
}

:deep(
  .permission-tree .el-checkbox__input.is-indeterminate .el-checkbox__inner
) {
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  border-color: transparent;
}

:deep(.permission-tree .el-tree-node__expand-icon) {
  color: #94a3b8;
}

:deep(.permission-tree .el-tree-node__label) {
  font-size: 13.5px;
  color: #334155;
}

/* Footer */
.drawer-footer {
  padding: 16px 24px 24px;
  border-top: 1px solid rgba(148, 163, 184, 0.15);
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  flex-shrink: 0;
  background: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(8px);
}

.btn-cancel {
  background: rgba(148, 163, 184, 0.1) !important;
  border: 1px solid rgba(148, 163, 184, 0.25) !important;
  color: #64748b !important;
  border-radius: 8px !important;
  padding: 8px 20px !important;
  transition: all 0.2s !important;
}

.btn-cancel:hover {
  background: rgba(148, 163, 184, 0.2) !important;
  color: #334155 !important;
}

.btn-confirm {
  background: linear-gradient(135deg, #6366f1, #8b5cf6) !important;
  border: none !important;
  border-radius: 8px !important;
  padding: 8px 24px !important;
  color: #fff !important;
  box-shadow: 0 4px 15px rgba(99, 102, 241, 0.3) !important;
  transition: all 0.2s !important;
}

.btn-confirm:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(99, 102, 241, 0.45) !important;
}
</style>
