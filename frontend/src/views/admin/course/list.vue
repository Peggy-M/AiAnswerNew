<template>
  <div class="course-list">
    <!-- 搜索和操作栏 -->
    <div class="operation-bar">
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="课程名称">
          <el-input v-model="searchForm.name" placeholder="请输入课程名称" />
        </el-form-item>
        <el-form-item label="课程分类">
          <el-select v-model="searchForm.category" placeholder="请选择分类" clearable>
            <el-option
              v-for="item in categoryOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="请选择状态" clearable>
            <el-option label="已发布" value="published" />
            <el-option label="未发布" value="draft" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>
      
      <div class="operation-buttons">
        <el-button type="primary" @click="handleAdd">
          <el-icon><Plus /></el-icon>新增课程
        </el-button>
      </div>
    </div>

    <!-- 课程列表 -->
    <el-table :data="courseList" v-loading="loading" style="width: 100%">
      <el-table-column prop="name" label="课程名称" show-overflow-tooltip />
      <el-table-column prop="category" label="课程分类" width="120" />
      <el-table-column prop="teacher" label="授课教师" width="120" />
      <el-table-column prop="studentCount" label="学生数" width="100" align="center" />
      <el-table-column prop="status" label="状态" width="100">
        <template #default="{ row }">
          <el-tag :type="row.status === 'published' ? 'success' : 'info'">
            {{ row.status === 'published' ? '已发布' : '未发布' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" width="180" />
      <el-table-column label="操作" width="250" fixed="right">
        <template #default="{ row }">
          <el-button type="primary" link @click="handleEdit(row)">编辑</el-button>
          <el-button type="success" link @click="handleResources(row)">资源管理</el-button>
          <el-button 
            :type="row.status === 'published' ? 'warning' : 'success'" 
            link 
            @click="handlePublish(row)"
          >
            {{ row.status === 'published' ? '下架' : '发布' }}
          </el-button>
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

    <!-- 课程表单对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogType === 'add' ? '新增课程' : '编辑课程'"
      width="600px"
    >
      <el-form
        ref="courseFormRef"
        :model="courseForm"
        :rules="courseRules"
        label-width="100px"
      >
        <el-form-item label="课程名称" prop="name">
          <el-input v-model="courseForm.name" placeholder="请输入课程名称" />
        </el-form-item>
        <el-form-item label="课程分类" prop="category">
          <el-select v-model="courseForm.category" placeholder="请选择分类">
            <el-option
              v-for="item in categoryOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="课程封面" prop="cover">
          <el-upload
            class="cover-uploader"
            action="/api/upload"
            :show-file-list="false"
            :on-success="handleCoverSuccess"
          >
            <img v-if="courseForm.cover" :src="courseForm.cover" class="cover" />
            <el-icon v-else class="cover-uploader-icon"><Plus /></el-icon>
          </el-upload>
        </el-form-item>
        <el-form-item label="课程简介" prop="description">
          <el-input
            v-model="courseForm.description"
            type="textarea"
            rows="4"
            placeholder="请输入课程简介"
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

    <!-- 资源管理对话框 -->
    <el-dialog
      v-model="resourceDialogVisible"
      title="课程资源管理"
      width="800px"
    >
      <el-tabs v-model="resourceActiveTab">
        <el-tab-pane label="课程章节" name="chapters">
          <div class="chapter-list">
            <el-tree
              :data="chapterList"
              node-key="id"
              default-expand-all
            >
              <template #default="{ node, data }">
                <div class="chapter-node">
                  <span>{{ data.name }}</span>
                  <span class="actions">
                    <el-button type="primary" link @click="handleAddSection(data)">
                      添加小节
                    </el-button>
                    <el-button type="primary" link @click="handleEditChapter(data)">
                      编辑
                    </el-button>
                    <el-button type="danger" link @click="handleDeleteChapter(data)">
                      删除
                    </el-button>
                  </span>
                </div>
              </template>
            </el-tree>
            <div class="add-chapter">
              <el-button type="primary" @click="handleAddChapter">
                <el-icon><Plus /></el-icon>添加章节
              </el-button>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="课程资料" name="materials">
          <div class="material-list">
            <el-upload
              class="material-uploader"
              action="/api/upload"
              :on-success="handleMaterialSuccess"
              multiple
            >
              <el-button type="primary">
                <el-icon><Upload /></el-icon>上传资料
              </el-button>
            </el-upload>
            <el-table :data="materialList" style="width: 100%; margin-top: 20px;">
              <el-table-column prop="name" label="资料名称" />
              <el-table-column prop="size" label="大小" width="120" />
              <el-table-column prop="uploadTime" label="上传时间" width="180" />
              <el-table-column label="操作" width="150">
                <template #default="{ row }">
                  <el-button type="primary" link @click="handleDownload(row)">下载</el-button>
                  <el-button type="danger" link @click="handleDeleteMaterial(row)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { Plus, Upload } from '@element-plus/icons-vue'
import type { FormInstance } from 'element-plus'
import { ElMessage, ElMessageBox } from 'element-plus'

// 搜索表单
const searchForm = reactive({
  name: '',
  category: '',
  status: ''
})

// 分类选项
const categoryOptions = ref([
  { label: '前端开发', value: 'frontend' },
  { label: '后端开发', value: 'backend' },
  { label: '移动开发', value: 'mobile' },
  { label: '数据库', value: 'database' }
])

// 课程列表数据
const loading = ref(false)
const courseList = ref([
  {
    id: 1,
    name: 'Vue3实战教程',
    category: '前端开发',
    teacher: '张三',
    studentCount: 100,
    status: 'published',
    createTime: '2024-01-12 10:00:00',
    cover: 'https://example.com/cover1.jpg',
    description: 'Vue3入门到实战的完整教程'
  },
  {
    id: 2,
    name: 'Spring Boot教程',
    category: '后端开发',
    teacher: '李四',
    studentCount: 80,
    status: 'draft',
    createTime: '2024-01-12 11:00:00',
    cover: 'https://example.com/cover2.jpg',
    description: 'Spring Boot从入门到精通'
  }
])

// 分页
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(100)

// 课程表单对话框
const dialogVisible = ref(false)
const dialogType = ref<'add' | 'edit'>('add')
const courseFormRef = ref<FormInstance>()
const courseForm = reactive({
  name: '',
  category: '',
  cover: '',
  description: ''
})

// 表单验证规则
const courseRules = {
  name: [
    { required: true, message: '请输入课程名称', trigger: 'blur' }
  ],
  category: [
    { required: true, message: '请选择课程分类', trigger: 'change' }
  ],
  description: [
    { required: true, message: '请输入课程简介', trigger: 'blur' }
  ]
}

// 资源管理对话框
const resourceDialogVisible = ref(false)
const resourceActiveTab = ref('chapters')
const currentCourseId = ref<number>()

// 章节数据
const chapterList = ref([
  {
    id: 1,
    name: '第一章 课程介绍',
    children: [
      { id: 11, name: '1.1 课程概述' },
      { id: 12, name: '1.2 环境准备' }
    ]
  },
  {
    id: 2,
    name: '第二章 基础知识',
    children: [
      { id: 21, name: '2.1 基本概念' },
      { id: 22, name: '2.2 核心特性' }
    ]
  }
])

// 课程资料数据
const materialList = ref([
  {
    id: 1,
    name: '课程大纲.pdf',
    size: '1.2MB',
    uploadTime: '2024-01-12 10:00:00'
  },
  {
    id: 2,
    name: '示例代码.zip',
    size: '5.6MB',
    uploadTime: '2024-01-12 11:00:00'
  }
])

// 处理搜索
const handleSearch = () => {
  console.log('搜索条件:', searchForm)
  // TODO: 实现搜索逻辑
}

// 重置搜索
const resetSearch = () => {
  searchForm.name = ''
  searchForm.category = ''
  searchForm.status = ''
  handleSearch()
}

// 处理新增
const handleAdd = () => {
  dialogType.value = 'add'
  dialogVisible.value = true
  if (courseFormRef.value) {
    courseFormRef.value.resetFields()
  }
}

// 处理编辑
const handleEdit = (row: any) => {
  dialogType.value = 'edit'
  dialogVisible.value = true
  Object.assign(courseForm, row)
}

// 处理删除
const handleDelete = async (row: any) => {
  try {
    await ElMessageBox.confirm('确定要删除该课程吗？', '提示', {
      type: 'warning'
    })
    console.log('删除课程:', row)
    ElMessage.success('删除成功')
  } catch {
    // 取消删除
  }
}

// 处理发布/下架
const handlePublish = async (row: any) => {
  const action = row.status === 'published' ? '下架' : '发布'
  try {
    await ElMessageBox.confirm(`确定要${action}该课程吗？`, '提示', {
      type: 'warning'
    })
    console.log(`${action}课程:`, row)
    ElMessage.success(`${action}成功`)
  } catch {
    // 取消操作
  }
}

// 处理资源管理
const handleResources = (row: any) => {
  currentCourseId.value = row.id
  resourceDialogVisible.value = true
  resourceActiveTab.value = 'chapters'
}

// 处理封面上传成功
const handleCoverSuccess = (response: any) => {
  courseForm.cover = response.url
  ElMessage.success('上传成功')
}

// 处理表单提交
const handleSubmit = async () => {
  if (!courseFormRef.value) return
  
  await courseFormRef.value.validate(async (valid) => {
    if (valid) {
      console.log('提交表单:', courseForm)
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

// 章节相关操作
const handleAddChapter = () => {
  console.log('添加章节')
  // TODO: 实现添加章节逻辑
}

const handleAddSection = (chapter: any) => {
  console.log('添加小节到章节:', chapter)
  // TODO: 实现添加小节逻辑
}

const handleEditChapter = (chapter: any) => {
  console.log('编辑章节:', chapter)
  // TODO: 实现编辑章节逻辑
}

const handleDeleteChapter = async (chapter: any) => {
  try {
    await ElMessageBox.confirm('确定要删除该章节吗？', '提示', {
      type: 'warning'
    })
    console.log('删除章节:', chapter)
    ElMessage.success('删除成功')
  } catch {
    // 取消删除
  }
}

// 课程资料相关操作
const handleMaterialSuccess = (response: any) => {
  console.log('上传资料成功:', response)
  // TODO: 更新资料列表
  ElMessage.success('上传成功')
}

const handleDownload = (material: any) => {
  console.log('下载资料:', material)
  // TODO: 实现下载逻辑
}

const handleDeleteMaterial = async (material: any) => {
  try {
    await ElMessageBox.confirm('确定要删除该资料吗？', '提示', {
      type: 'warning'
    })
    console.log('删除资料:', material)
    ElMessage.success('删除成功')
  } catch {
    // 取消删除
  }
}
</script>

<style scoped lang="scss">
.course-list {
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
  
  .cover-uploader {
    :deep(.el-upload) {
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      transition: var(--el-transition-duration-fast);
      
      &:hover {
        border-color: var(--el-color-primary);
      }
    }
    
    .cover-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 178px;
      height: 178px;
      text-align: center;
      line-height: 178px;
    }
    
    .cover {
      width: 178px;
      height: 178px;
      display: block;
    }
  }
  
  .chapter-list {
    .chapter-node {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-right: 8px;
      
      .actions {
        display: none;
      }
      
      &:hover .actions {
        display: block;
      }
    }
    
    .add-chapter {
      margin-top: 20px;
      text-align: center;
    }
  }
  
  .material-list {
    .material-uploader {
      display: flex;
      justify-content: center;
    }
  }
}
</style> 