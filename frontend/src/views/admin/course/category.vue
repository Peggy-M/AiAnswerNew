<template>
  <div class="category-manage">
    <!-- 操作栏 -->
    <div class="operation-bar">
      <el-button type="primary" @click="handleAdd">
        <el-icon><Plus /></el-icon>新增分类
      </el-button>
    </div>

    <!-- 分类表格 -->
    <el-table
      :data="categoryList"
      row-key="id"
      border
      :tree-props="{ children: 'children' }"
      v-loading="loading"
    >
      <el-table-column prop="name" label="分类名称" />
      <el-table-column prop="code" label="分类编码" width="150" />
      <el-table-column prop="sort" label="排序" width="80" align="center" />
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
      <el-table-column prop="createTime" label="创建时间" width="180" />
      <el-table-column label="操作" width="250">
        <template #default="{ row }">
          <el-button type="primary" link @click="handleAdd(row)">添加子分类</el-button>
          <el-button type="primary" link @click="handleEdit(row)">编辑</el-button>
          <el-button type="danger" link @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分类表单对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogType === 'add' ? '新增分类' : '编辑分类'"
      width="500px"
    >
      <el-form
        ref="categoryFormRef"
        :model="categoryForm"
        :rules="categoryRules"
        label-width="80px"
      >
        <el-form-item label="上级分类">
          <el-tree-select
            v-model="categoryForm.parentId"
            :data="categoryOptions"
            :props="{ label: 'name', value: 'id' }"
            placeholder="请选择上级分类"
            clearable
          />
        </el-form-item>
        <el-form-item label="分类名称" prop="name">
          <el-input v-model="categoryForm.name" placeholder="请输入分类名称" />
        </el-form-item>
        <el-form-item label="分类编码" prop="code">
          <el-input v-model="categoryForm.code" placeholder="请输入分类编码" />
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input-number v-model="categoryForm.sort" :min="0" :max="999" />
        </el-form-item>
        <el-form-item label="状态">
          <el-switch
            v-model="categoryForm.status"
            :active-value="1"
            :inactive-value="0"
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
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import type { FormInstance } from 'element-plus'
import { ElMessage, ElMessageBox } from 'element-plus'

// 分类列表数据
const loading = ref(false)
const categoryList = ref([
  {
    id: 1,
    name: '前端开发',
    code: 'frontend',
    sort: 1,
    status: 1,
    createTime: '2024-01-12 10:00:00',
    children: [
      {
        id: 11,
        name: 'Vue.js',
        code: 'vue',
        sort: 1,
        status: 1,
        createTime: '2024-01-12 10:00:00'
      },
      {
        id: 12,
        name: 'React',
        code: 'react',
        sort: 2,
        status: 1,
        createTime: '2024-01-12 10:00:00'
      }
    ]
  },
  {
    id: 2,
    name: '后端开发',
    code: 'backend',
    sort: 2,
    status: 1,
    createTime: '2024-01-12 10:00:00',
    children: [
      {
        id: 21,
        name: 'Java',
        code: 'java',
        sort: 1,
        status: 1,
        createTime: '2024-01-12 10:00:00'
      },
      {
        id: 22,
        name: 'Python',
        code: 'python',
        sort: 2,
        status: 1,
        createTime: '2024-01-12 10:00:00'
      }
    ]
  }
])

// 分类选项（用于上级分类选择）
const categoryOptions = ref(categoryList.value)

// 对话框相关
const dialogVisible = ref(false)
const dialogType = ref<'add' | 'edit'>('add')
const categoryFormRef = ref<FormInstance>()
const categoryForm = reactive({
  parentId: null as number | null,
  name: '',
  code: '',
  sort: 1,
  status: 1
})

// 表单验证规则
const categoryRules = {
  name: [
    { required: true, message: '请输入分类名称', trigger: 'blur' }
  ],
  code: [
    { required: true, message: '请输入分类编码', trigger: 'blur' }
  ]
}

// 处理新增
const handleAdd = (row?: any) => {
  dialogType.value = 'add'
  dialogVisible.value = true
  if (categoryFormRef.value) {
    categoryFormRef.value.resetFields()
  }
  if (row) {
    categoryForm.parentId = row.id
  }
}

// 处理编辑
const handleEdit = (row: any) => {
  dialogType.value = 'edit'
  dialogVisible.value = true
  Object.assign(categoryForm, row)
}

// 处理删除
const handleDelete = async (row: any) => {
  try {
    await ElMessageBox.confirm(
      row.children?.length 
        ? '该分类下包含子分类，确定要删除吗？' 
        : '确定要删除该分类吗？',
      '提示',
      { type: 'warning' }
    )
    console.log('删除分类:', row)
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
  if (!categoryFormRef.value) return
  
  await categoryFormRef.value.validate(async (valid) => {
    if (valid) {
      console.log('提交表单:', categoryForm)
      // TODO: 实现提交逻辑
      ElMessage.success(dialogType.value === 'add' ? '添加成功' : '更新成功')
      dialogVisible.value = false
    }
  })
}
</script>

<style scoped lang="scss">
.category-manage {
  .operation-bar {
    margin-bottom: 20px;
  }
}
</style> 