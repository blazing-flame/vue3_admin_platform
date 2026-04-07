<template>
  <div>
    <el-card>
      <el-form :inline="true">
        <el-form-item label="用户名:" style="margin: 0">
          <el-input placeholder="请输入用户名" v-model="keyword"></el-input>
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
        @click="addUser"
      >
        添加用户
      </el-button>
      <el-button
        type="danger"
        style="color: white; padding: 10px"
        :disabled="!selectIdArr.length"
        @click="deleteSelectUser"
      >
        批量删除
      </el-button>
      <el-table
        @selection-change="selectChange"
        border
        style="margin: 10px 0"
        :data="userArr"
      >
        <el-table-column type="selection" align="center"></el-table-column>
        <el-table-column
          label="#"
          align="center"
          type="index"
        ></el-table-column>
        <el-table-column label="id" align="center" prop="id"></el-table-column>
        <el-table-column
          label="用户名字"
          align="center"
          prop="username"
        ></el-table-column>
        <el-table-column
          label="用户名称"
          align="center"
          prop="name"
        ></el-table-column>
        <el-table-column
          label="用户角色"
          align="center"
          prop="roleName"
        ></el-table-column>
        <el-table-column
          label="创建时间"
          align="center"
          prop="createTime"
        ></el-table-column>
        <el-table-column
          label="更新时间"
          align="center"
          prop="updateTime"
        ></el-table-column>
        <el-table-column label="操作" width="260px" align="center">
          <template #="{ row, $index }">
            <el-button
              type="primary"
              size="small"
              icon="User"
              style="color: white; padding: 10px"
              @click="setRole(row)"
            >
              分配角色
            </el-button>
            <el-button
              type="success"
              size="small"
              icon="Edit"
              style="color: white; padding: 10px"
              @click="updateUser(row)"
            >
              编辑
            </el-button>
            <el-popconfirm
              :title="`你确定要删除${row.username}吗?`"
              width="200px"
              @confirm="deleteUser(row.id)"
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
      <!-- 分页器 -->
      <el-pagination
        v-model:current-page="pageNo"
        v-model:page-size="limit"
        :page-sizes="[5, 7, 9, 11]"
        :background="true"
        layout="prev, pager, next, jumper, ->, sizes,total"
        :total="total"
        @current-change="getHasUser"
        @size-change="handler"
      />
    </el-card>
    <!-- 抽屉结构:完成添加新的用户账号|更新已有的账号信息 -->
    <!-- <el-drawer v-model="drawer"> -->
    <!-- 头部标题:将来文字内容应该动态的 -->
    <!-- <template #header>
            <h4>{{ userParams.id ? '更新用户' : '添加用户' }}</h4>
            </template> -->
    <!-- 身体部分 -->
    <!-- <template #default>
            <el-form :model="userParams" :rules="rules" ref="formRef">
                <el-form-item label="用户姓名" prop="username">
                <el-input
                    placeholder="请输入用户姓名"
                    v-model="userParams.username"
                ></el-input>
                </el-form-item>
                <el-form-item label="用户昵称" prop="name">
                <el-input
                    placeholder="请输入用户昵称"
                    v-model="userParams.name"
                ></el-input>
                </el-form-item>
                <el-form-item label="用户密码" prop="password" v-if="!userParams.id">
                <el-input
                    placeholder="请输入用户密码"
                    v-model="userParams.password"
                ></el-input>
                </el-form-item>
            </el-form>
            </template>
            <template #footer>
            <div style="flex: auto">
                <el-button @click="cancel" style="color:#333;padding:10px;">取消</el-button>
                <el-button type="primary" @click="save" style="color:white;padding:10px;">确定</el-button>
            </div>
            </template>
        </el-drawer> -->
    <el-drawer v-model="drawer" size="420px" :with-header="false">
      <div class="custom-drawer">
        <!-- Header -->
        <div class="drawer-header">
          <div class="header-left">
            <span class="header-tag">USER MANAGEMENT</span>
            <h4 class="header-title">
              {{ userParams.id ? '更新用户' : '添加用户' }}
            </h4>
          </div>
          <el-button
            :icon="Close"
            circle
            size="small"
            @click="cancel"
            class="close-btn"
          />
        </div>
        <!-- Body -->
        <div class="drawer-body">
          <div class="avatar-section">
            <div class="avatar-circle">👤</div>
            <span class="avatar-hint">新用户信息</span>
          </div>

          <el-form :model="userParams" :rules="rules" ref="formRef">
            <el-form-item prop="username">
              <div class="form-label">
                <span class="icon">👤</span>
                用户姓名
              </div>
              <el-input
                v-model="userParams.username"
                placeholder="请输入用户姓名"
                class="custom-input"
              />
              <div class="tip-text">用于登录系统的唯一标识</div>
            </el-form-item>
            <el-form-item prop="name">
              <div class="form-label">
                <span class="icon">✏️</span>
                用户昵称
              </div>
              <el-input
                v-model="userParams.name"
                placeholder="请输入用户昵称"
                class="custom-input"
              />
              <div class="tip-text">显示在界面中的名称</div>
            </el-form-item>
            <el-form-item prop="password" v-show="!userParams.id">
              <div class="form-label">
                <span class="icon">🔒</span>
                用户密码
              </div>
              <el-input
                v-model="userParams.password"
                type="password"
                placeholder="请输入用户密码"
                class="custom-input"
                show-password
              />
              <div class="tip-text">建议使用字母+数字组合,6位以上</div>
            </el-form-item>
          </el-form>
        </div>
        <!-- Footer -->
        <div class="drawer-footer">
          <el-button class="btn-cancel" @click="cancel">取消</el-button>
          <el-button type="primary" class="btn-confirm" @click="save">
            确认
          </el-button>
        </div>
      </div>
    </el-drawer>
    <!-- 抽屉结构：对某一个用户进行角色分配 -->
    <!-- <el-drawer v-model="drawer1">
            <template #header>
                <h4>分配角色(职位)</h4>
            </template>
            <template #default>
                <el-form>
                    <el-form-item label="用户名字">
                        <el-input v-model="userParams.username" :disabled="true"></el-input>
                    </el-form-item>
                    <el-form-item label="职位列表">
                        <el-checkbox v-model="checkAll" :indeterminate="isIndeterminate" @change="handleCheckAllChange">全选</el-checkbox> -->
    <!-- 显示职位的复选框 -->
    <!-- <el-checkbox-group v-model="AssignRolesArr" @change="handleCheckedRolesChange">
                            <el-checkbox v-for="(role,index) in AllRolesArr" :key="role.id" :label="role">{{ role.roleName }}</el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                </el-form>
            </template>
            <template #footer>
                <div style="flex: auto">
                    <el-button>取消</el-button>
                    <el-button type="primary">确认</el-button>
                </div>
            </template>
        </el-drawer> -->
    <el-drawer v-model="drawer1" size="460px" :with-header="false">
      <div class="role-drawer">
        <!-- Header -->
        <div class="role-drawer-header">
          <div class="role-header-bg"></div>
          <div class="role-header-content">
            <div>
              <div class="role-header-eyebrow">ROLE ASSIGNMENT</div>
              <div class="role-header-title">分配角色(职位)</div>
            </div>
            <el-button
              :icon="Close"
              circle
              @click="drawer1 = false"
              class="role-close-btn"
            />
          </div>
          <div class="role-user-pill-bar">
            <div class="role-user-pill">
              <div class="role-user-avatar">👤</div>
              <div class="role-user-name">{{ userParams.username }}</div>
              <div class="role-user-label">当前用户</div>
            </div>
          </div>
        </div>

        <!-- Body -->
        <div class="role-drawer-body">
          <div class="role-section-label">职位列表</div>

          <div class="role-check-all-row">
            <el-checkbox
              v-model="checkAll"
              :indeterminate="isIndeterminate"
              @change="handleCheckAllChange"
            >
              全选
            </el-checkbox>
            <span class="role-check-sub">
              已选 {{ AssignRolesArr.length }} / 共
              {{ AllRolesArr.length }} 个职位
            </span>
          </div>

          <el-checkbox-group
            v-model="AssignRolesArr"
            @change="handleCheckedRolesChange"
            class="roles-grid"
          >
            <div
              v-for="role in AllRolesArr"
              :key="role.id"
              :class="[
                'role-card',
                AssignRolesArr.includes(role) ? 'checked' : '',
              ]"
            >
              <el-checkbox :label="role">
                <div class="role-card-info">
                  <div class="role-card-name">{{ role.roleName }}</div>
                  <span
                    v-if="AssignRolesArr.includes(role)"
                    class="role-card-badge"
                  >
                    已分配
                  </span>
                </div>
              </el-checkbox>
            </div>
          </el-checkbox-group>
        </div>

        <!-- Footer -->
        <div class="role-drawer-footer">
          <el-button class="role-btn-cancel" @click="drawer1 = false">
            取消
          </el-button>
          <el-button
            type="primary"
            class="role-btn-confirm"
            @click="confirmAssignRole"
          >
            确认分配
          </el-button>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, nextTick } from 'vue'
import {
  reqRemoveUser,
  reqSelectUser,
  reqSetUserRoles,
  reqAddOrUpdateUser,
  reqUserInfo,
  reqAllRoles,
} from '@/api/acl/user/index'
import type {
  UserResponseData,
  records,
  User,
  AllRolesResponseData,
  AllRolesList,
  SetRolesData,
} from '@/api/acl/user/type'
import { ElMessage } from 'element-plus'
import { Close } from '@element-plus/icons-vue'
import useUserStore from '@/store/modules/user'
import useLayoutSettingStore from '@/store/modules/setting'
const userStore = useUserStore()
//默认页码
const pageNo = ref<number>(1)
//一页展示多少个数据
const limit = ref<number>(5)
//用户总个数
const total = ref<number>(0)
//存储所有用户的数组
const userArr = ref<records>([])
//控制添加与更新用户抽屉的显示与隐藏
const drawer = ref<boolean>(false)
//控制角色分配抽屉的显示与隐藏
const drawer1 = ref<boolean>(false)
//存储全部职位的数组
const AllRolesArr = ref<AllRolesList>([])
//存储当前用户职位的数据
const AssignRolesArr = ref<AllRolesList>([])
//存储批量删除的用户的id
const selectIdArr = ref<number[]>([])
//收集用户输入进来的用户名|关键字
const keyword = ref<string>('')
//获取setting仓库
const settingStore = useLayoutSettingStore()
//收集用户信息的响应式数据
const userParams = reactive<User>({
  username: '',
  password: '',
  name: '',
})
//获取form组件实例
const formRef = ref<any>()
//组件挂载完毕
onMounted(() => {
  getHasUser()
})
//获取全部已有的用户信息
const getHasUser = async (pager = 1) => {
  //当前页码
  pageNo.value = pager
  const result: UserResponseData = await reqUserInfo(
    pageNo.value,
    limit.value,
    keyword.value,
  )
  if (result.code == 200) {
    total.value = result.data.total
    userArr.value = result.data.records
  }
}
//分页器下拉菜单
const handler = () => {
  getHasUser()
}
//添加用户按钮的回调
const addUser = () => {
  //清空ID信息
  // userParams.id = undefined
  drawer.value = true
  //清空数据
  Object.assign(userParams, {
    id: undefined,
    username: '',
    password: '',
    name: '',
  })
  //第一次页面挂载时，用nextTick获取更新后的DOM,并清除上一次验证后的残留信息
  nextTick(() => {
    formRef.value.clearValidate()
  })
}

//更新已有的用户数据的回调
const updateUser = (row: User) => {
  drawer.value = true
  //存储已有账号信息
  Object.assign(userParams, row)
  //用nextTick获取更新后的DOM,并清除上一次验证后的残留信息
  nextTick(() => {
    formRef.value.clearValidate()
  })
}
//抽屉确认按钮的回调
const save = async () => {
  //点击保存按钮时，保证表单校验全部通过再发请求
  await formRef.value.validate()
  //确认按钮：添加用户或者更新用户
  const result: any = await reqAddOrUpdateUser(userParams)
  if (result.code == 200) {
    //关闭抽屉
    drawer.value = false
    //提示消息
    ElMessage({
      type: 'success',
      message: userParams.id ? '更新用户成功' : '添加用户成功',
    })
    //再次发请求获取所有用户数据
    getHasUser(userParams.id ? pageNo.value : 1)
    //浏览器自动刷新一次
    // window.location.reload()
    // 如果是编辑的是当前登录用户，重新拉一次用户信息，先判断是不是改自己
    await userStore.userInfo()
  } else {
    //关闭抽屉
    drawer.value = false
    //提示消息
    ElMessage({
      type: 'success',
      message: userParams.id ? '更新用户失败' : '添加用户失败',
    })
  }
}

//抽屉取消按钮的回掉
const cancel = () => {
  drawer.value = false
}
//校验用户名字的回调函数
const validateUsername = (rule: any, value: any, callback: any) => {
  if (value.trim().length >= 2) {
    callback()
  } else {
    callback(new Error('用户名长度至少2位'))
  }
}
//校验用户昵称的回调函数
const validateName = (rule: any, value: any, callback: any) => {
  if (value.trim().length >= 2) {
    callback()
  } else {
    callback(new Error('用户昵称长度至少2位'))
  }
}
//校验用户昵称的回调函数
const validatePassword = (rule: any, value: any, callback: any) => {
  if (value.trim().length >= 6) {
    callback()
  } else {
    callback(new Error('用户密码长度至少6位'))
  }
}
//表单校验规则对象
const rules = {
  //用户名字
  username: [{ required: true, trigger: 'blur', validator: validateUsername }],
  //用户昵称
  name: [{ required: true, trigger: 'blur', validator: validateName }],
  //用户密码
  password: [{ required: true, trigger: 'blur', validator: validatePassword }],
}
//分配角色按钮回调
const setRole = async (row: User) => {
  Object.assign(userParams, row)
  //获取全部职位数据与当前职位数据
  const result: AllRolesResponseData = await reqAllRoles(
    userParams.id as number,
  )
  if (result.code == 200) {
    //存储全部职位
    AllRolesArr.value = result.data.allRolesList
    //存储当前职位
    AssignRolesArr.value = result.data.assignRoles
    //显示抽屉
    drawer1.value = true
  }
}

//测试复选框代码
//全选复选框收集数据：是否全选
const checkAll = ref(false)
//设置不确定状态，仅负责样式控制,即一条杠
const isIndeterminate = ref(true)
//全选复选框的change事件
const handleCheckAllChange = (val: boolean) => {
  //val:true:全选，false:全不选
  //若为全选，则将全部职位赋值给已有职位
  AssignRolesArr.value = val ? AllRolesArr.value : []
  //全选有√
  isIndeterminate.value = false
}
//底部复选框change事件
const handleCheckedRolesChange = (value: string[]) => {
  //选的角色的个数
  const checkedCount = value.length
  //若选的角色个数等于全部职位个数，则全选
  checkAll.value = checkedCount === AllRolesArr.value.length
  //控制状态
  isIndeterminate.value =
    checkedCount > 0 && checkedCount < AllRolesArr.value.length
}

//点击分配角色按钮的回调
const confirmAssignRole = async () => {
  //收集参数
  const data: SetRolesData = {
    userId: userParams.id as number,
    //遍历并返回新的只有勾选的id的数组
    roleIdList: AssignRolesArr.value.map((item) => item.id as number),
  }
  //发请求
  const result = await reqSetUserRoles(data)
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: '分配角色成功',
    })
    drawer1.value = false
    //获取更新完毕后的所有信息
    getHasUser(pageNo.value)
  } else {
    ElMessage({
      type: 'error',
      message: '分配角色失败',
    })
  }
}

//删除用户按钮的回调
const deleteUser = async (userId: number) => {
  const result: any = await reqRemoveUser(userId)
  if (result.code == 200) {
    ElMessage({ type: 'success', message: '删除用户成功' })
    getHasUser(userArr.value.length > 1 ? pageNo.value : pageNo.value - 1)
  }
}

//table复选框勾中触发的事件
const selectChange = (value: any) => {
  // selectIdArr.value = value
  // 当前页所有用户的id
  const currentPageAllIds = userArr.value.map((item) => item.id)
  // 当前页勾选的id
  const currentPageIds = value.map((item: any) => item.id)
  // 过滤掉当前页的id（保留其他页已选的）
  const otherPageIds = selectIdArr.value.filter(
    (id) => !currentPageAllIds.includes(id),
  )
  // 合并其他页已选 + 当前页新选
  selectIdArr.value = [...otherPageIds, ...currentPageIds]
}

//批量删除按钮回调
const deleteSelectUser = async () => {
  //收集参数
  // let idList:any = selectIdArr.value.map(item=>item.id);
  //发请求
  const result: any = await reqSelectUser(selectIdArr.value)
  if (result.code == 200) {
    ElMessage({ type: 'success', message: '批量删除用户成功' })
    getHasUser(userArr.value.length > 1 ? pageNo.value : pageNo.value - 1)
  }
  selectIdArr.value = [] // 删完清空
}

//搜索按钮的回调
const search = () => {
  //根据关键字获取相应用户数据
  getHasUser()
  //清空关键字
  keyword.value = ''
}

//重置按钮的回调
const reset = () => {
  settingStore.refresh = !settingStore.refresh
}
</script>

<style scoped>
/* 抽屉1 */
.custom-drawer {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.drawer-header {
  padding: 28px 32px 24px;
  border-bottom: 1px solid #f1f5f9;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 4px;
    background: linear-gradient(180deg, #3b82f6, #6366f1);
    border-radius: 0 2px 2px 0;
  }
}

.header-tag {
  font-size: 11px;
  font-weight: 500;
  color: #3b82f6;
  letter-spacing: 0.08em;
}

.header-title {
  font-size: 20px;
  font-weight: 700;
  color: #0f172a;
}

.drawer-body {
  flex: 1;
  padding: 24px 32px;
  overflow-y: auto;
}

.avatar-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px 0 28px;
  gap: 8px;
}

.avatar-circle {
  width: 72px;
  height: 72px;
  border-radius: 22px;
  background: linear-gradient(135deg, #dbeafe, #e0e7ff);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  box-shadow: 0 4px 16px rgba(99, 102, 241, 0.18);
}

.avatar-hint {
  font-size: 12px;
  color: #94a3b8;
}

.form-label {
  font-size: 13px;
  font-weight: 500;
  color: #374151;
  margin-bottom: 6px;
  display: flex;
  align-items: center;
  gap: 6px;

  .icon {
    width: 18px;
    height: 18px;
    background: #eff6ff;
    border-radius: 5px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 10px;
  }
}

.tip-text {
  font-size: 11.5px;
  color: #94a3b8;
  margin-top: 4px;
}

:deep(.custom-input .el-input__wrapper) {
  border-radius: 12px;
  border: 1.5px solid #e2e8f0;
  background: #fafafa;
  box-shadow: none;
  height: 46px;

  &:hover,
  &.is-focus {
    border-color: #3b82f6;
    background: #fff;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
}

.drawer-footer {
  padding: 20px 32px 28px;
  border-top: 1px solid #f1f5f9;
  display: flex;
  gap: 12px;

  .btn-cancel,
  .btn-confirm {
    flex: 1;
    height: 46px;
    border-radius: 12px;
    font-size: 14px;
  }

  .btn-confirm {
    background: linear-gradient(135deg, #3b82f6, #6366f1);
    border: none;
    box-shadow: 0 4px 14px rgba(99, 102, 241, 0.35);

    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 6px 20px rgba(99, 102, 241, 0.45);
    }
  }
}

/* 抽屉2 */
.role-drawer {
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.role-drawer-header {
  position: relative;
  background: linear-gradient(135deg, #064e3b 0%, #065f46 60%, #047857 100%);
  overflow: hidden;
  flex-shrink: 0;
}

.role-header-bg {
  position: absolute;
  inset: 0;
  background-image:
    radial-gradient(
      circle at 20% 50%,
      rgba(16, 185, 129, 0.25) 0%,
      transparent 50%
    ),
    radial-gradient(
      circle at 80% 20%,
      rgba(52, 211, 153, 0.2) 0%,
      transparent 40%
    );
}

.role-header-content {
  position: relative;
  padding: 28px 28px 20px;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}

.role-header-eyebrow {
  font-size: 10px;
  font-weight: 500;
  color: rgba(52, 211, 153, 0.9);
  letter-spacing: 0.15em;
  margin-bottom: 6px;
}

.role-header-title {
  font-size: 22px;
  font-weight: 700;
  color: #fff;
}

:deep(.role-close-btn) {
  border: 1px solid rgba(255, 255, 255, 0.2) !important;
  background: rgba(255, 255, 255, 0.1) !important;
  color: rgba(255, 255, 255, 0.7) !important;
  &:hover {
    background: rgba(255, 255, 255, 0.2) !important;
    color: #fff !important;
  }
}

.role-user-pill-bar {
  position: relative;
  padding: 0 28px 24px;
}

.role-user-pill {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 10px;
  padding: 10px 16px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.role-user-avatar {
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, #10b981, #34d399);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 15px;
}

.role-user-name {
  font-size: 14px;
  font-weight: 600;
  color: #fff;
}
.role-user-label {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.5);
  margin-left: auto;
}

.role-drawer-body {
  flex: 1;
  overflow-y: auto;
  padding: 28px;
}

.role-section-label {
  font-size: 11px;
  font-weight: 600;
  color: #94a3b8;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: #f1f5f9;
  }
}

.role-check-all-row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  background: #f8fafc;
  border-radius: 10px;
  margin-bottom: 14px;
  border: 1px solid #e2e8f0;
}

.role-check-sub {
  font-size: 11px;
  color: #94a3b8;
  margin-left: auto;
}

.roles-grid {
  display: grid !important;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.role-card {
  padding: 14px 16px;
  border: 1.5px solid #e2e8f0;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
  &:hover {
    border-color: #10b981;
    background: #f0fdf4;
  }
  &.checked {
    border-color: #10b981;
    background: #f0fdf4;
  }
}

.role-card-name {
  font-size: 13px;
  font-weight: 500;
  color: #1e293b;
}
.role-card-badge {
  display: inline-block;
  margin-top: 3px;
  padding: 1px 6px;
  border-radius: 10px;
  font-size: 10px;
  background: #dcfce7;
  color: #16a34a;
}

.role-drawer-footer {
  padding: 20px 28px 28px;
  border-top: 1px solid #f1f5f9;
  display: flex;
  gap: 12px;

  .role-btn-cancel,
  .role-btn-confirm {
    flex: 1;
    height: 46px;
    border-radius: 12px;
    font-size: 14px;
  }

  .role-btn-confirm {
    background: linear-gradient(135deg, #10b981, #059669);
    border: none;
    box-shadow: 0 4px 14px rgba(16, 185, 129, 0.35);
    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 6px 20px rgba(16, 185, 129, 0.45);
    }
  }
}
</style>
