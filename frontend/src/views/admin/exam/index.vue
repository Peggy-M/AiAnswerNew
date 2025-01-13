<template>
  <div class="exam-manage">
    <el-card>
      <template #header>
        <div class="card-header">
          <h3>试卷管理</h3>
          <el-button type="primary" @click="$router.push('/admin/exam-generate')">
            生成试卷
          </el-button>
        </div>
      </template>

      <el-table :data="exams" style="width: 100%">
        <el-table-column prop="name" label="试卷名称" min-width="180" />
        
        <el-table-column prop="difficulty" label="难度" width="100">
          <template #default="{ row }">
            <el-tag :type="getDifficultyType(row.difficulty)">
              {{ getDifficultyLabel(row.difficulty) }}
            </el-tag>
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
            <template v-if="row.status === 'published'">
              {{ row.startTime }} 至 {{ row.endTime }}
            </template>
            <span v-else>-</span>
          </template>
        </el-table-column>
        
        <el-table-column label="操作" width="200" fixed="right">
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
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 发布对话框 -->
    <el-dialog
      v-model="showPublishDialog"
      title="发布试卷"
      width="500px"
    >
      <el-form :model="publishForm" label-width="100px">
        <el-form-item label="开始时间">
          <el-date-picker
            v-model="publishForm.startTime"
            type="datetime"
            placeholder="选择开始时间"
          />
        </el-form-item>
        
        <el-form-item label="结束时间">
          <el-date-picker
            v-model="publishForm.endTime"
            type="datetime"
            placeholder="选择结束时间"
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showPublishDialog = false">取消</el-button>
          <el-button type="primary" @click="confirmPublish">
            确认发布
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useExamStore } from '@/stores/exam'
import type { Exam } from '@/types/exam'

const examStore = useExamStore()
const exams = computed(() => examStore.exams)

const showPublishDialog = ref(false)
const currentExam = ref<Exam>()
const publishForm = ref({
  startTime: '',
  endTime: ''
})

// 获取难度标签和样式
const getDifficultyLabel = (difficulty: string) => {
  const labels: Record<string, string> = {
    beginner: '入门',
    elementary: '初级',
    intermediate: '中级',
    advanced: '高级'
  }
  return labels[difficulty] || difficulty
}

const getDifficultyType = (difficulty: string) => {
  const types: Record<string, string> = {
    beginner: 'info',
    elementary: 'success',
    intermediate: 'warning',
    advanced: 'danger'
  }
  return types[difficulty] || 'info'
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

// 发布试卷
const handlePublish = (exam: Exam) => {
  currentExam.value = exam
  showPublishDialog.value = true
}

const confirmPublish = () => {
  if (!publishForm.value.startTime || !publishForm.value.endTime) {
    ElMessage.warning('请选择考试时间')
    return
  }

  if (new Date(publishForm.value.endTime) <= new Date(publishForm.value.startTime)) {
    ElMessage.warning('结束时间必须晚于开始时间')
    return
  }

  if (currentExam.value?.id) {
    examStore.publishExam(
      currentExam.value.id,
      publishForm.value.startTime,
      publishForm.value.endTime
    )
    ElMessage.success('发布成功')
    showPublishDialog.value = false
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
}
</style> 