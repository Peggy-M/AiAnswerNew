<template>
  <div class="exam-list">
    <!-- 搜索和操作栏 -->
    <div class="operation-bar">
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="考试名称">
          <el-input v-model="searchForm.name" placeholder="请输入考试名称" />
        </el-form-item>
        <el-form-item label="考试类型">
          <el-select v-model="searchForm.type" placeholder="请选择类型" clearable>
            <el-option label="正式考试" value="formal" />
            <el-option label="模拟考试" value="mock" />
            <el-option label="练习测试" value="practice" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="请选择状态" clearable>
            <el-option label="未开始" value="pending" />
            <el-option label="进行中" value="processing" />
            <el-option label="已结束" value="finished" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>
      
      <div class="operation-buttons">
        <el-button type="primary" @click="handleAdd">
          <el-icon><Plus /></el-icon>新增考试
        </el-button>
      </div>
    </div>

    <!-- 考试列表 -->
    <el-table :data="examList" v-loading="loading" style="width: 100%">
      <el-table-column prop="name" label="考试名称" show-overflow-tooltip />
      <el-table-column prop="type" label="考试类型" width="100">
        <template #default="{ row }">
          <el-tag :type="getTypeTag(row.type)">{{ getTypeLabel(row.type) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="duration" label="考试时长" width="100">
        <template #default="{ row }">
          {{ row.duration }}分钟
        </template>
      </el-table-column>
      <el-table-column prop="startTime" label="开始时间" width="180" />
      <el-table-column prop="endTime" label="结束时间" width="180" />
      <el-table-column prop="status" label="状态" width="100">
        <template #default="{ row }">
          <el-tag :type="getStatusTag(row.status)">
            {{ getStatusLabel(row.status) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="280" fixed="right">
        <template #default="{ row }">
          <el-button type="primary" link @click="handleEdit(row)">编辑</el-button>
          <el-button type="success" link @click="handleQuestions(row)">试题管理</el-button>
          <el-button type="warning" link @click="handleGrades(row)">成绩管理</el-button>
          <el-button type="danger" link @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="pagination-container">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :total="total"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <!-- 考试表单对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogType === 'add' ? '新增考试' : '编辑考试'"
      width="600px"
    >
      <el-form
        ref="examFormRef"
        :model="examForm"
        :rules="examRules"
        label-width="100px"
      >
        <el-form-item label="考试名称" prop="name">
          <el-input v-model="examForm.name" placeholder="请输入考试名称" />
        </el-form-item>
        <el-form-item label="考试类型" prop="type">
          <el-select v-model="examForm.type" placeholder="请选择考试类型">
            <el-option label="正式考试" value="formal" />
            <el-option label="模拟考试" value="mock" />
            <el-option label="练习测试" value="practice" />
          </el-select>
        </el-form-item>
        <el-form-item label="考试时长" prop="duration">
          <el-input-number 
            v-model="examForm.duration" 
            :min="1"
            :max="999"
            placeholder="请输入考试时长(分钟)"
          />
        </el-form-item>
        <el-form-item label="考试时间" prop="timeRange">
          <el-date-picker
            v-model="examForm.timeRange"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            value-format="YYYY-MM-DD HH:mm:ss"
          />
        </el-form-item>
        <el-form-item label="考试说明" prop="description">
          <el-input
            v-model="examForm.description"
            type="textarea"
            rows="4"
            placeholder="请输入考试说明"
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

// 搜索表单
const searchForm = reactive({
  name: '',
  type: '',
  status: ''
})

// 考试列表数据
const loading = ref(false)
const examList = ref([
  {
    id: 1,
    name: '期中考试',
    type: 'formal',
    duration: 120,
    startTime: '2024-01-15 14:00:00',
    endTime: '2024-01-15 16:00:00',
    status: 'pending',
    description: '2024年上学期期中考试'
  },
  {
    id: 2,
    name: '模拟测试',
    type: 'mock',
    duration: 90,
    startTime: '2024-01-16 10:00:00',
    endTime: '2024-01-16 11:30:00',
    status: 'processing',
    description: '期中考试模拟测试'
  }
])

// 分页
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(100)

// 考试表单对话框
const dialogVisible = ref(false)
const dialogType = ref<'add' | 'edit'>('add')
const examFormRef = ref<FormInstance>()
const examForm = reactive({
  name: '',
  type: '',
  duration: 60,
  timeRange: [] as string[],
  description: ''
})

// 表单验证规则
const examRules = {
  name: [
    { required: true, message: '请输入考试名称', trigger: 'blur' }
  ],
  type: [
    { required: true, message: '请选择考试类型', trigger: 'change' }
  ],
  duration: [
    { required: true, message: '请输入考试时长', trigger: 'blur' }
  ],
  timeRange: [
    { required: true, message: '请选择考试时间', trigger: 'change' }
  ]
}

// 获取考试类型标签
const getTypeTag = (type: string) => {
  const types: Record<string, string> = {
    formal: 'danger',
    mock: 'warning',
    practice: 'info'
  }
  return types[type] || 'info'
}

const getTypeLabel = (type: string) => {
  const types: Record<string, string> = {
    formal: '正式考试',
    mock: '模拟考试',
    practice: '练习测试'
  }
  return types[type] || type
}

// 获取状态标签
const getStatusTag = (status: string) => {
  const types: Record<string, string> = {
    pending: 'info',
    processing: 'success',
    finished: ''
  }
  return types[status] || 'info'
}

const getStatusLabel = (status: string) => {
  const types: Record<string, string> = {
    pending: '未开始',
    processing: '进行中',
    finished: '已结束'
  }
  return types[status] || status
}

// 处理搜索
const handleSearch = () => {
  console.log('搜索条件:', searchForm)
  // TODO: 实现搜索逻辑
}

// 重置搜索
const resetSearch = () => {
  searchForm.name = ''
  searchForm.type = ''
  searchForm.status = ''
  handleSearch()
}

// 处理新增
const handleAdd = () => {
  dialogType.value = 'add'
  dialogVisible.value = true
  if (examFormRef.value) {
    examFormRef.value.resetFields()
  }
}

// 处理编辑
const handleEdit = (row: any) => {
  dialogType.value = 'edit'
  dialogVisible.value = true
  const { startTime, endTime, ...rest } = row
  Object.assign(examForm, {
    ...rest,
    timeRange: [startTime, endTime]
  })
}

// 处理删除
const handleDelete = async (row: any) => {
  try {
    await ElMessageBox.confirm('确定要删除该考试吗？', '提示', {
      type: 'warning'
    })
    console.log('删除考试:', row)
    ElMessage.success('删除成功')
  } catch {
    // 取消删除
  }
}

// 处理试题管理
const handleQuestions = (row: any) => {
  console.log('管理试题:', row)
  // TODO: 跳转到试题管理页面
}

// 处理成绩管理
const handleGrades = (row: any) => {
  console.log('管理成绩:', row)
  // TODO: 跳转到成绩管理页面
}

// 处理表单提交
const handleSubmit = async () => {
  if (!examFormRef.value) return
  
  await examFormRef.value.validate(async (valid) => {
    if (valid) {
      const [startTime, endTime] = examForm.timeRange
      const submitData = {
        ...examForm,
        startTime,
        endTime
      }
      console.log('提交表单:', submitData)
      // TODO: 实现提交逻辑
      ElMessage.success(dialogType.value === 'add' ? '添加成功' : '更新成功')
      dialogVisible.value = false
    }
  })
}

// 处理分页大小改变
const handleSizeChange = (val: number) => {
  pageSize.value = val
  // TODO: 重新加载数据
}

// 处理页码改变
const handleCurrentChange = (val: number) => {
  currentPage.value = val
  // TODO: 重新加载数据
}
</script>

<style scoped lang="scss">
.exam-list {
  .operation-bar {
    margin-bottom: 20px;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    background: #fff;
    padding: 20px;
    border-radius: 4px;
  }
  
  .pagination-container {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
  }
}
</style> 