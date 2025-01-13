<template>
  <div class="question-bank">
    <!-- 搜索和操作栏 -->
    <div class="operation-bar">
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="题目类型">
          <el-select v-model="searchForm.type" placeholder="请选择类型" clearable>
            <el-option label="单选题" value="single" />
            <el-option label="多选题" value="multiple" />
            <el-option label="判断题" value="judge" />
            <el-option label="简答题" value="essay" />
          </el-select>
        </el-form-item>
        <el-form-item label="难度">
          <el-select v-model="searchForm.difficulty" placeholder="请选择难度" clearable>
            <el-option label="简单" value="easy" />
            <el-option label="中等" value="medium" />
            <el-option label="困难" value="hard" />
          </el-select>
        </el-form-item>
        <el-form-item label="关键词">
          <el-input v-model="searchForm.keyword" placeholder="请输入关键词" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>
      
      <div class="operation-buttons">
        <el-button type="primary" @click="handleAdd">
          <el-icon><Plus /></el-icon>新增题目
        </el-button>
        <el-button type="success" @click="handleImport">
          <el-icon><Upload /></el-icon>批量导入
        </el-button>
      </div>
    </div>

    <!-- 题目列表 -->
    <el-table :data="questionList" v-loading="loading" style="width: 100%">
      <el-table-column type="selection" width="55" />
      <el-table-column prop="type" label="题目类型" width="100">
        <template #default="{ row }">
          <el-tag :type="getTypeTag(row.type)">{{ getTypeLabel(row.type) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="title" label="题目" show-overflow-tooltip />
      <el-table-column prop="difficulty" label="难度" width="100">
        <template #default="{ row }">
          <el-tag :type="getDifficultyTag(row.difficulty)">
            {{ getDifficultyLabel(row.difficulty) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" width="180" />
      <el-table-column label="操作" width="180" fixed="right">
        <template #default="{ row }">
          <el-button type="primary" link @click="handleEdit(row)">编辑</el-button>
          <el-button type="primary" link @click="handlePreview(row)">预览</el-button>
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

    <!-- 题目表单对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogType === 'add' ? '新增题目' : '编辑题目'"
      width="800px"
    >
      <el-form
        ref="questionFormRef"
        :model="questionForm"
        :rules="questionRules"
        label-width="100px"
      >
        <el-form-item label="题目类型" prop="type">
          <el-select v-model="questionForm.type" placeholder="请选择题目类型">
            <el-option label="单选题" value="single" />
            <el-option label="多选题" value="multiple" />
            <el-option label="判断题" value="judge" />
            <el-option label="简答题" value="essay" />
          </el-select>
        </el-form-item>
        <el-form-item label="题目" prop="title">
          <el-input
            v-model="questionForm.title"
            type="textarea"
            rows="3"
            placeholder="请输入题目"
          />
        </el-form-item>
        
        <!-- 选项（单选/多选题） -->
        <template v-if="['single', 'multiple'].includes(questionForm.type)">
          <el-form-item
            v-for="(option, index) in questionForm.options"
            :key="index"
            :label="`选项${String.fromCharCode(65 + index)}`"
            :prop="`options.${index}.content`"
            :rules="{ required: true, message: '请输入选项内容', trigger: 'blur' }"
          >
            <div class="option-item">
              <el-input v-model="option.content" placeholder="请输入选项内容" />
              <el-checkbox
                v-if="questionForm.type === 'multiple'"
                v-model="option.isCorrect"
              >
                正确答案
              </el-checkbox>
              <el-radio
                v-else
                v-model="questionForm.correctAnswer"
                :label="String.fromCharCode(65 + index)"
              >
                正确答案
              </el-radio>
              <el-button 
                type="danger" 
                link 
                @click="removeOption(index)"
                :disabled="questionForm.options.length <= 2"
              >
                删除
              </el-button>
            </div>
          </el-form-item>
          <el-form-item>
            <el-button 
              type="primary" 
              link 
              @click="addOption"
              :disabled="questionForm.options.length >= 6"
            >
              添加选项
            </el-button>
          </el-form-item>
        </template>
        
        <!-- 判断题答案 -->
        <el-form-item v-if="questionForm.type === 'judge'" label="正确答案" prop="correctAnswer">
          <el-radio-group v-model="questionForm.correctAnswer">
            <el-radio label="true">正确</el-radio>
            <el-radio label="false">错误</el-radio>
          </el-radio-group>
        </el-form-item>
        
        <!-- 简答题答案 -->
        <el-form-item v-if="questionForm.type === 'essay'" label="参考答案" prop="correctAnswer">
          <el-input
            v-model="questionForm.correctAnswer"
            type="textarea"
            rows="3"
            placeholder="请输入参考答案"
          />
        </el-form-item>
        
        <el-form-item label="答案解析" prop="analysis">
          <el-input
            v-model="questionForm.analysis"
            type="textarea"
            rows="3"
            placeholder="请输入答案解析"
          />
        </el-form-item>
        
        <el-form-item label="难度" prop="difficulty">
          <el-select v-model="questionForm.difficulty" placeholder="请选择难度">
            <el-option label="简单" value="easy" />
            <el-option label="中等" value="medium" />
            <el-option label="困难" value="hard" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit">确定</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 预览对话框 -->
    <el-dialog
      v-model="previewVisible"
      title="题目预览"
      width="600px"
    >
      <div class="question-preview">
        <div class="question-title">
          <el-tag :type="getTypeTag(currentQuestion.type)" class="type-tag">
            {{ getTypeLabel(currentQuestion.type) }}
          </el-tag>
          <span>{{ currentQuestion.title }}</span>
        </div>
        
        <!-- 选项 -->
        <div v-if="['single', 'multiple'].includes(currentQuestion.type)" class="options">
          <div 
            v-for="(option, index) in currentQuestion.options" 
            :key="index"
            class="option-item"
          >
            <span class="option-label">{{ String.fromCharCode(65 + index) }}.</span>
            <span>{{ option.content }}</span>
            <el-tag 
              v-if="option.isCorrect || currentQuestion.correctAnswer === String.fromCharCode(65 + index)"
              type="success"
              size="small"
            >
              正确答案
            </el-tag>
          </div>
        </div>
        
        <!-- 判断题答案 -->
        <div v-if="currentQuestion.type === 'judge'" class="judge-answer">
          <span>正确答案：</span>
          <el-tag type="success">
            {{ currentQuestion.correctAnswer === 'true' ? '正确' : '错误' }}
          </el-tag>
        </div>
        
        <!-- 简答题答案 -->
        <div v-if="currentQuestion.type === 'essay'" class="essay-answer">
          <div class="answer-label">参考答案：</div>
          <div class="answer-content">{{ currentQuestion.correctAnswer }}</div>
        </div>
        
        <!-- 解析 -->
        <div class="analysis">
          <div class="analysis-label">答案解析：</div>
          <div class="analysis-content">{{ currentQuestion.analysis }}</div>
        </div>
      </div>
    </el-dialog>

    <!-- 导入对话框 -->
    <el-dialog
      v-model="importVisible"
      title="批量导入题目"
      width="500px"
    >
      <el-upload
        class="upload-demo"
        drag
        action="/api/questions/import"
        :on-success="handleImportSuccess"
        :before-upload="beforeImport"
      >
        <el-icon class="el-icon--upload"><upload-filled /></el-icon>
        <div class="el-upload__text">
          将文件拖到此处，或<em>点击上传</em>
        </div>
        <template #tip>
          <div class="el-upload__tip">
            请上传 Excel 文件，且文件大小不超过 5MB
          </div>
        </template>
      </el-upload>
      <div class="template-download">
        <el-button type="primary" link @click="downloadTemplate">
          下载导入模板
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { Plus, Upload, UploadFilled } from '@element-plus/icons-vue'
import type { FormInstance } from 'element-plus'
import { ElMessage, ElMessageBox } from 'element-plus'

// 搜索表单
const searchForm = reactive({
  type: '',
  difficulty: '',
  keyword: ''
})

// 题目列表数据
const loading = ref(false)
const questionList = ref([
  {
    id: 1,
    type: 'single',
    title: '示例单选题',
    difficulty: 'easy',
    createTime: '2024-01-12 10:00:00',
    options: [
      { content: '选项A', isCorrect: false },
      { content: '选项B', isCorrect: true },
      { content: '选项C', isCorrect: false }
    ],
    correctAnswer: 'B',
    analysis: '答案解析示例'
  },
  {
    id: 2,
    type: 'multiple',
    title: '示例多选题',
    difficulty: 'medium',
    createTime: '2024-01-12 11:00:00',
    options: [
      { content: '选项A', isCorrect: true },
      { content: '选项B', isCorrect: true },
      { content: '选项C', isCorrect: false }
    ],
    analysis: '答案解析示例'
  }
])

// 分页
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(100)

// 对话框相关
const dialogVisible = ref(false)
const dialogType = ref<'add' | 'edit'>('add')
const questionFormRef = ref<FormInstance>()
const questionForm = reactive({
  type: 'single',
  title: '',
  options: [
    { content: '', isCorrect: false },
    { content: '', isCorrect: false }
  ],
  correctAnswer: '',
  analysis: '',
  difficulty: 'medium'
})

// 预览相关
const previewVisible = ref(false)
const currentQuestion = ref({} as any)

// 导入相关
const importVisible = ref(false)

// 表单验证规则
const questionRules = {
  type: [
    { required: true, message: '请选择题目类型', trigger: 'change' }
  ],
  title: [
    { required: true, message: '请输入题目', trigger: 'blur' }
  ],
  correctAnswer: [
    { required: true, message: '请选择正确答案', trigger: 'change' }
  ],
  difficulty: [
    { required: true, message: '请选择难度', trigger: 'change' }
  ]
}

// 获取题目类型标签
const getTypeTag = (type: string) => {
  const types: Record<string, string> = {
    single: '',
    multiple: 'success',
    judge: 'warning',
    essay: 'info'
  }
  return types[type] || ''
}

const getTypeLabel = (type: string) => {
  const types: Record<string, string> = {
    single: '单选题',
    multiple: '多选题',
    judge: '判断题',
    essay: '简答题'
  }
  return types[type] || type
}

// 获取难度标签
const getDifficultyTag = (difficulty: string) => {
  const types: Record<string, string> = {
    easy: 'success',
    medium: 'warning',
    hard: 'danger'
  }
  return types[difficulty] || ''
}

const getDifficultyLabel = (difficulty: string) => {
  const types: Record<string, string> = {
    easy: '简单',
    medium: '中等',
    hard: '困难'
  }
  return types[difficulty] || difficulty
}

// 处理搜索
const handleSearch = () => {
  console.log('搜索条件:', searchForm)
  // TODO: 实现搜索逻辑
}

// 重置搜索
const resetSearch = () => {
  searchForm.type = ''
  searchForm.difficulty = ''
  searchForm.keyword = ''
  handleSearch()
}

// 处理新增
const handleAdd = () => {
  dialogType.value = 'add'
  dialogVisible.value = true
  if (questionFormRef.value) {
    questionFormRef.value.resetFields()
  }
}

// 处理编辑
const handleEdit = (row: any) => {
  dialogType.value = 'edit'
  dialogVisible.value = true
  Object.assign(questionForm, row)
}

// 处理删除
const handleDelete = async (row: any) => {
  try {
    await ElMessageBox.confirm('确定要删除该题目吗？', '提示', {
      type: 'warning'
    })
    console.log('删除题目:', row)
    ElMessage.success('删除成功')
  } catch {
    // 取消删除
  }
}

// 处理预览
const handlePreview = (row: any) => {
  currentQuestion.value = row
  previewVisible.value = true
}

// 处理选项操作
const addOption = () => {
  questionForm.options.push({ content: '', isCorrect: false })
}

const removeOption = (index: number) => {
  questionForm.options.splice(index, 1)
}

// 处理导入
const handleImport = () => {
  importVisible.value = true
}

const beforeImport = (file: File) => {
  const isExcel = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  if (!isExcel) {
    ElMessage.error('只能上传 Excel 文件！')
    return false
  }
  const isLt5M = file.size / 1024 / 1024 < 5
  if (!isLt5M) {
    ElMessage.error('文件大小不能超过 5MB！')
    return false
  }
  return true
}

const handleImportSuccess = (response: any) => {
  console.log('导入成功:', response)
  ElMessage.success('导入成功')
  importVisible.value = false
  // TODO: 刷新列表
}

// 下载模板
const downloadTemplate = () => {
  console.log('下载模板')
  // TODO: 实现下载模板逻辑
}

// 处理表单提交
const handleSubmit = async () => {
  if (!questionFormRef.value) return
  
  await questionFormRef.value.validate(async (valid) => {
    if (valid) {
      console.log('提交表单:', questionForm)
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
.question-bank {
  .operation-bar {
    margin-bottom: 20px;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    background: #fff;
    padding: 20px;
    border-radius: 4px;
    
    .operation-buttons {
      display: flex;
      gap: 10px;
    }
  }
  
  .pagination-container {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
  }
  
  .option-item {
    display: flex;
    align-items: center;
    gap: 10px;
    
    .el-input {
      flex: 1;
    }
  }
  
  .question-preview {
    .question-title {
      margin-bottom: 20px;
      
      .type-tag {
        margin-right: 10px;
      }
    }
    
    .options {
      .option-item {
        margin-bottom: 10px;
        
        .option-label {
          margin-right: 10px;
          font-weight: bold;
        }
        
        .el-tag {
          margin-left: 10px;
        }
      }
    }
    
    .judge-answer,
    .essay-answer {
      margin-top: 20px;
    }
    
    .analysis {
      margin-top: 20px;
      padding-top: 20px;
      border-top: 1px solid #eee;
      
      .analysis-label {
        font-weight: bold;
        margin-bottom: 10px;
      }
    }
  }
  
  .template-download {
    margin-top: 20px;
    text-align: center;
  }
}
</style> 