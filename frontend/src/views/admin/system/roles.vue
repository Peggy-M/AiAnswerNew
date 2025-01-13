<template>
  <div class="role-manage">
    <!-- 操作栏 -->
    <div class="operation-bar">
      <el-button type="primary" @click="handleAdd">
        <el-icon><Plus /></el-icon>新增角色
      </el-button>
    </div>

    <!-- 角色列表 -->
    <el-table :data="roleList" v-loading="loading" style="width: 100%">
      <el-table-column prop="name" label="角色名称" />
      <el-table-column prop="code" label="角色编码" />
      <el-table-column prop="description" label="描述" />
      <el-table-column prop="createTime" label="创建时间" />
      <el-table-column prop="status" label="状态">
        <template #default="{ row }">
          <el-switch
            v-model="row.status"
            :active-value="1"
            :inactive-value="0"
            @change="handleStatusChange(row)"
          />
        </template>
      </el-table-column>
      <el-table-column label="操作" width="250">
        <template #default="{ row }">
          <el-button type="primary" link @click="handleEdit(row)">编辑</el-button>
          <el-button type="success" link @click="handlePermission(row)">权限设置</el-button>
          <el-button type="danger" link @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 角色表单对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogType === 'add' ? '新增角色' : '编辑角色'"
      width="500px"
    >
      <el-form
        ref="roleFormRef"
        :model="roleForm"
        :rules="roleRules"
        label-width="80px"
      >
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="roleForm.name" placeholder="请输入角色名称" />
        </el-form-item>
        <el-form-item label="角色编码" prop="code">
          <el-input v-model="roleForm.code" placeholder="请输入角色编码" />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input
            v-model="roleForm.description"
            type="textarea"
            placeholder="请输入角色描述"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit">确定</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 权限设置对话框 -->
    <el-dialog
      v-model="permissionDialogVisible"
      title="权限设置"
      width="600px"
    >
      <el-tree
        ref="permissionTreeRef"
        :data="permissionTree"
        show-checkbox
        node-key="id"
        :props="{ label: 'name' }"
        :default-checked-keys="selectedPermissions"
      />
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="permissionDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handlePermissionSubmit">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import type { FormInstance } from 'element-plus'
import { ElMessage, ElMessageBox } from 'element-plus'

// 角色列表数据
const loading = ref(false)
const roleList = ref([
  {
    id: 1,
    name: '超级管理员',
    code: 'SUPER_ADMIN',
    description: '系统超级管理员',
    createTime: '2024-01-12',
    status: 1
  },
  {
    id: 2,
    name: '教师',
    code: 'TEACHER',
    description: '教师角色',
    createTime: '2024-01-12',
    status: 1
  },
  {
    id: 3,
    name: '学生',
    code: 'STUDENT',
    description: '学生角色',
    createTime: '2024-01-12',
    status: 1
  }
])

// 角色表单对话框
const dialogVisible = ref(false)
const dialogType = ref<'add' | 'edit'>('add')
const roleFormRef = ref<FormInstance>()
const roleForm = reactive({
  name: '',
  code: '',
  description: ''
})

// 表单验证规则
const roleRules = {
  name: [
    { required: true, message: '请输入角色名称', trigger: 'blur' }
  ],
  code: [
    { required: true, message: '请输入角色编码', trigger: 'blur' }
  ]
}

// 权限树对话框
const permissionDialogVisible = ref(false)
const permissionTreeRef = ref()
const currentRoleId = ref<number>()
const selectedPermissions = ref<number[]>([])

// 模拟权限树数据
const permissionTree = ref([
  {
    id: 1,
    name: '系统管理',
    children: [
      { id: 11, name: '用户管理' },
      { id: 12, name: '角色管理' },
      { id: 13, name: '菜单管理' }
    ]
  },
  {
    id: 2,
    name: '课程管理',
    children: [
      { id: 21, name: '课程列表' },
      { id: 22, name: '课程分类' }
    ]
  }
])

// 处理新增
const handleAdd = () => {
  dialogType.value = 'add'
  dialogVisible.value = true
  if (roleFormRef.value) {
    roleFormRef.value.resetFields()
  }
}

// 处理编辑
const handleEdit = (row: any) => {
  dialogType.value = 'edit'
  dialogVisible.value = true
  Object.assign(roleForm, row)
}

// 处理删除
const handleDelete = async (row: any) => {
  try {
    await ElMessageBox.confirm('确定要删除该角色吗？', '提示', {
      type: 'warning'
    })
    console.log('删除角色:', row)
    ElMessage.success('删除成功')
  } catch {
    // 取消删除
  }
}

// 处理状态改变
const handleStatusChange = (row: any) => {
  console.log('状态改变:', row)
  // TODO: 实现状态更新逻辑
}

// 处理表单提交
const handleSubmit = async () => {
  if (!roleFormRef.value) return
  
  await roleFormRef.value.validate(async (valid) => {
    if (valid) {
      console.log('提交表单:', roleForm)
      // TODO: 实现提交逻辑
      ElMessage.success(dialogType.value === 'add' ? '添加成功' : '更新成功')
      dialogVisible.value = false
    }
  })
}

// 处理权限设置
const handlePermission = (row: any) => {
  currentRoleId.value = row.id
  permissionDialogVisible.value = true
  // 模拟获取已选权限
  selectedPermissions.value = [11, 12, 21]
}

// 处理权限提交
const handlePermissionSubmit = async () => {
  if (!permissionTreeRef.value) return
  
  const checkedKeys = permissionTreeRef.value.getCheckedKeys()
  const halfCheckedKeys = permissionTreeRef.value.getHalfCheckedKeys()
  const allSelectedKeys = [...checkedKeys, ...halfCheckedKeys]
  
  console.log('提交权限:', {
    roleId: currentRoleId.value,
    permissions: allSelectedKeys
  })
  
  ElMessage.success('权限设置成功')
  permissionDialogVisible.value = false
}
</script>

<style scoped lang="scss">
.role-manage {
  .operation-bar {
    margin-bottom: 20px;
  }
}
</style> 