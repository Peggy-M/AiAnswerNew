<template>
  <div class="exam-manage">
    <el-card>
      <template #header>
        <div class="card-header">
          <h3>考试管理</h3>
          <div class="header-actions">
            <el-button type="primary" @click="$router.push('/admin/exam-generate')">
              生成试卷
            </el-button>
          </div>
        </div>
      </template>

      <!-- 搜索栏 -->
      <div class="search-bar">
        <el-input
          v-model="searchKeyword"
          placeholder="搜索试卷名称"
          style="width: 200px"
          clearable
        />
        <el-select v-model="statusFilter" placeholder="状态筛选" clearable>
          <el-option label="草稿" value="draft" />
          <el-option label="已发布" value="published" />
          <el-option label="已结束" value="ended" />
        </el-select>
      </div>

      <!-- 考试列表 -->
      <el-table :data="filteredExams" style="width: 100%">
        <el-table-column prop="name" label="试卷名称" min-width="180" />
        
        <el-table-column prop="difficulty" label="难度" width="280">
          <template #default="{ row }">
            <div class="difficulty-tags">
              <el-tag
                v-for="diff in row.difficulty"
                :key="diff"
                :type="getDifficultyType(diff)"
                class="difficulty-tag"
              >
                {{ getDifficultyLabel(diff) }}
              </el-tag>
            </div>
          </template>
        </el-table-column>
        
        <el-table-column prop="duration" label="时长" width="100">
          <template #default="{ row }">
            {{ row.duration }}分钟
          </template>
        </el-table-column>
        
        <el-table-column prop="totalScore" label="总分" width="80" />
        
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">
              {{ getStatusLabel(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        
        <el-table-column label="考试时间" width="300">
          <template #default="{ row }">
            <template v-if="row.status !== 'draft'">
              {{ formatDateTime(row.startTime) }} 至 {{ formatDateTime(row.endTime) }}
            </template>
            <span v-else>-</span>
          </template>
        </el-table-column>
        
        <el-table-column label="操作" width="250" fixed="right">
          <template #default="{ row }">
            <el-button 
              v-if="row.status === 'draft'"
              type="primary" 
              link
              @click="handlePublish(row)"
            >
              发布
            </el-button>
            <el-button 
              v-if="row.status === 'published'"
              type="warning" 
              link
              @click="handleModifyTime(row)"
            >
              修改时间
            </el-button>
            <el-button 
              type="primary" 
              link
              @click="handlePreview(row)"
            >
              预览
            </el-button>
            <el-button 
              v-if="row.status === 'draft'"
              type="danger" 
              link
              @click="handleDelete(row)"
            >
              删除
            </el-button>
            <el-button 
              v-if="row.status === 'published'"
              type="danger" 
              link
              @click="handleEnd(row)"
            >
              结束考试
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 发布/修改时间对话框 -->
    <el-dialog
      v-model="showTimeDialog"
      :title="currentExam?.status === 'published' ? '修改考试时间' : '发布考试'"
      width="500px"
    >
      <el-form :model="timeForm" label-width="100px">
        <el-form-item label="开始时间">
          <el-date-picker
            v-model="timeForm.startTime"
            type="datetime"
            placeholder="选择开始时间"
          />
        </el-form-item>
        
        <el-form-item label="结束时间">
          <el-date-picker
            v-model="timeForm.endTime"
            type="datetime"
            placeholder="选择结束时间"
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showTimeDialog = false">取消</el-button>
          <el-button type="primary" @click="confirmTimeUpdate">
            确定
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useExamStore } from '@/stores/exam'
import type { Exam } from '@/types/exam'

const router = useRouter()
const examStore = useExamStore()

// 搜索和筛选
const searchKeyword = ref('')
const statusFilter = ref('')

// 过滤后的考试列表
const filteredExams = computed(() => {
  return examStore.exams.filter(exam => {
    const matchKeyword = !searchKeyword.value || 
      exam.name.toLowerCase().includes(searchKeyword.value.toLowerCase())
    const matchStatus = !statusFilter.value || exam.status === statusFilter.value
    return matchKeyword && matchStatus
  })
})

// 时间修改相关
const showTimeDialog = ref(false)
const currentExam = ref<Exam>()
const timeForm = ref({
  startTime: '',
  endTime: ''
})

// 获取难度标签
const getDifficultyLabel = (difficulty: string) => {
  const labels: Record<string, string> = {
    beginner: '入门',
    elementary: '初级',
    intermediate: '中级',
    advanced: '高级'
  }
  return labels[difficulty] || difficulty
}

// 获取难度对应的标签类型
const getDifficultyType = (difficulty: string) => {
  const types: Record<string, '' | 'success' | 'warning' | 'danger'> = {
    beginner: '',          // 默认蓝色
    elementary: 'success', // 绿色
    intermediate: 'warning', // 黄色
    advanced: 'danger'     // 红色
  }
  return types[difficulty] || ''
}

// 获取状态标签和样式
const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    draft: '草稿',
    published: '已发布',
    ended: '已结束'
  }
  return labels[status] || status
}

const getStatusType = (status: string) => {
  const types: Record<string, string> = {
    draft: 'info',
    published: 'success',
    ended: 'warning'
  }
  return types[status] || 'info'
}

// 格式化日期时间
const formatDateTime = (dateStr?: string) => {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleString()
}

// 发布考试
const handlePublish = (exam: Exam) => {
  console.log('Publishing exam:', exam)
  currentExam.value = exam
  timeForm.value = {
    startTime: '',
    endTime: ''
  }
  showTimeDialog.value = true
}

// 修改考试时间
const handleModifyTime = (exam: Exam) => {
  currentExam.value = exam
  timeForm.value = {
    startTime: exam.startTime || '',
    endTime: exam.endTime || ''
  }
  showTimeDialog.value = true
}

// 确认时间更新
const confirmTimeUpdate = () => {
  console.log('Confirming time update...')
  console.log('Current exam:', currentExam.value)
  console.log('Time form:', timeForm.value)

  if (!timeForm.value.startTime || !timeForm.value.endTime) {
    ElMessage.warning('请选择考试时间')
    return
  }

  if (new Date(timeForm.value.endTime) <= new Date(timeForm.value.startTime)) {
    ElMessage.warning('结束时间必须晚于开始时间')
    return
  }

  if (currentExam.value?.id) {
    try {
      if (currentExam.value.status === 'draft') {
        const startTime = new Date(timeForm.value.startTime).toISOString()
        const endTime = new Date(timeForm.value.endTime).toISOString()
        
        console.log('Publishing exam with:', {
          id: currentExam.value.id,
          startTime,
          endTime
        })
        
        examStore.publishExam(
          currentExam.value.id,
          startTime,
          endTime
        )
        ElMessage.success('发布成功')
      } else {
        examStore.updateExam(currentExam.value.id, {
          startTime: new Date(timeForm.value.startTime).toISOString(),
          endTime: new Date(timeForm.value.endTime).toISOString()
        })
        ElMessage.success('时间修改成功')
      }
      showTimeDialog.value = false
    } catch (error) {
      console.error('Error during publish/update:', error)
      ElMessage.error('操作失败，请重试')
    }
  } else {
    console.warn('No current exam id found')
  }
}

// 预览试卷
const handlePreview = (exam: Exam) => {
  // TODO: 实现试卷预览功能
}

// 删除试卷
const handleDelete = (exam: Exam) => {
  ElMessageBox.confirm(
    '确定要删除这份试卷吗？',
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    if (exam.id) {
      examStore.removeExam(exam.id)
      ElMessage.success('删除成功')
    }
  })
}

// 结束考试
const handleEnd = (exam: Exam) => {
  ElMessageBox.confirm(
    '确定要结束这场考试吗？',
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    if (exam.id) {
      examStore.updateExam(exam.id, {
        status: 'ended',
        endTime: new Date().toISOString()
      })
      ElMessage.success('考试已结束')
    }
  })
}

// 在组件挂载时加载试卷数据
onMounted(() => {
  examStore.loadExams()
})
</script>

<style scoped lang="scss">
.exam-manage {
  padding: 20px;

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    
    h3 {
      margin: 0;
    }
  }

  .search-bar {
    margin-bottom: 20px;
    display: flex;
    gap: 15px;
  }

  .difficulty-tags {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;

    .difficulty-tag {
      margin: 0;
    }
  }
}
</style> 