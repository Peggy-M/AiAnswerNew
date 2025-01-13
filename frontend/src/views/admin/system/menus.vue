<template>
  <div class="menu-manage">
    <!-- 操作栏 -->
    <div class="operation-bar">
      <el-button type="primary" @click="handleAdd">
        <el-icon><Plus /></el-icon>新增菜单
      </el-button>
    </div>

    <!-- 菜单表格 -->
    <el-table
      :data="menuList"
      row-key="id"
      border
      :tree-props="{ children: 'children' }"
      v-loading="loading"
    >
      <el-table-column prop="name" label="菜单名称" />
      <el-table-column prop="path" label="路由路径" />
      <el-table-column prop="component" label="组件路径" />
      <el-table-column prop="icon" label="图标" width="100">
        <template #default="{ row }">
          <el-icon v-if="row.icon">
            <component :is="row.icon" />
          </el-icon>
        </template>
      </el-table-column>
      <el-table-column prop="sort" label="排序" width="80" />
      <el-table-column prop="status" label="状态" width="100">
        <template #default="{ row }">
          <el-switch
            v-model="row.status"
            :active-value="1"
            :inactive-value="0"
            @change="handleStatusChange(row)"
          />
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200">
        <template #default="{ row }">
          <el-button type="primary" link @click="handleAdd(row)">添加子菜单</el-button>
          <el-button type="primary" link @click="handleEdit(row)">编辑</el-button>
          <el-button type="danger" link @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 菜单表单对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogType === 'add' ? '新增菜单' : '编辑菜单'"
      width="500px"
    >
      <el-form
        ref="menuFormRef"
        :model="menuForm"
        :rules="menuRules"
        label-width="80px"
      >
        <el-form-item label="上级菜单">
          <el-tree-select
            v-model="menuForm.parentId"
            :data="menuOptions"
            :props="{ label: 'name', value: 'id' }"
            placeholder="请选择上级菜单"
            clearable
          />
        </el-form-item>
        <el-form-item label="菜单名称" prop="name">
          <el-input v-model="menuForm.name" placeholder="请输入菜单名称" />
        </el-form-item>
        <el-form-item label="路由路径" prop="path">
          <el-input v-model="menuForm.path" placeholder="请输入路由路径" />
        </el-form-item>
        <el-form-item label="组件路径" prop="component">
          <el-input v-model="menuForm.component" placeholder="请输入组件路径" />
        </el-form-item>
        <el-form-item label="图标" prop="icon">
          <el-input v-model="menuForm.icon" placeholder="请输入图标名称" />
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input-number v-model="menuForm.sort" :min="0" :max="999" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit">确定</el-button>
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

// 菜单列表数据
const loading = ref(false)
const menuList = ref([
  {
    id: 1,
    name: '系统管理',
    path: '/system',
    component: 'Layout',
    icon: 'Setting',
    sort: 1,
    status: 1,
    children: [
      {
        id: 11,
        name: '用户管理',
        path: 'users',
        component: 'system/users',
        icon: 'User',
        sort: 1,
        status: 1
      },
      {
        id: 12,
        name: '角色管理',
        path: 'roles',
        component: 'system/roles',
        icon: 'UserFilled',
        sort: 2,
        status: 1
      }
    ]
  },
  {
    id: 2,
    name: '课程管理',
    path: '/course',
    component: 'Layout',
    icon: 'Reading',
    sort: 2,
    status: 1,
    children: [
      {
        id: 21,
        name: '课程列表',
        path: 'list',
        component: 'course/list',
        icon: 'List',
        sort: 1,
        status: 1
      }
    ]
  }
])

// 菜单选项（用于上级菜单选择）
const menuOptions = ref(menuList.value)

// 对话框相关
const dialogVisible = ref(false)
const dialogType = ref<'add' | 'edit'>('add')
const menuFormRef = ref<FormInstance>()
const menuForm = reactive({
  parentId: null as number | null,
  name: '',
  path: '',
  component: '',
  icon: '',
  sort: 1,
  status: 1
})

// 表单验证规则
const menuRules = {
  name: [
    { required: true, message: '请输入菜单名称', trigger: 'blur' }
  ],
  path: [
    { required: true, message: '请输入路由路径', trigger: 'blur' }
  ],
  component: [
    { required: true, message: '请输入组件路径', trigger: 'blur' }
  ]
}

// 处理新增
const handleAdd = (row?: any) => {
  dialogType.value = 'add'
  dialogVisible.value = true
  if (menuFormRef.value) {
    menuFormRef.value.resetFields()
  }
  if (row) {
    menuForm.parentId = row.id
  }
}

// 处理编辑
const handleEdit = (row: any) => {
  dialogType.value = 'edit'
  dialogVisible.value = true
  Object.assign(menuForm, row)
}

// 处理删除
const handleDelete = async (row: any) => {
  try {
    await ElMessageBox.confirm(
      row.children?.length 
        ? '该菜单下包含子菜单，确定要删除吗？' 
        : '确定要删除该菜单吗？',
      '提示',
      { type: 'warning' }
    )
    console.log('删除菜单:', row)
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
  if (!menuFormRef.value) return
  
  await menuFormRef.value.validate(async (valid) => {
    if (valid) {
      console.log('提交表单:', menuForm)
      // TODO: 实现提交逻辑
      ElMessage.success(dialogType.value === 'add' ? '添加成功' : '更新成功')
      dialogVisible.value = false
    }
  })
}
</script>

<style scoped lang="scss">
.menu-manage {
  .operation-bar {
    margin-bottom: 20px;
  }
}
</style> 