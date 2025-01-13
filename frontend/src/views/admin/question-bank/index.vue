<template>
  <div class="question-bank">
    <el-card>
      <template #header>
        <div class="card-header">
          <h3>题库管理</h3>
          <el-button type="primary" @click="goToAiGenerate">
            AI智能出题
          </el-button>
        </div>
      </template>
      
      <div class="question-list">
        <div v-if="questions.length === 0" class="empty-tip">
          暂无题目，请先使用 AI 智能出题添加题目
        </div>
        
        <div 
          v-else
          v-for="question in questions" 
          :key="question.id" 
          class="question-item"
        >
          <div class="question-header">
            <span class="question-type">{{ getQuestionTypeLabel(question.type) }}</span>
            <span class="question-difficulty">{{ getDifficultyLabel(question.difficulty) }}</span>
          </div>
          <div class="question-content">
            <h4>{{ question.title }}</h4>
            <p>{{ question.analysis }}</p>
          </div>
          <div class="question-actions">
            <el-button type="primary" link @click="editQuestion(question.id)">编辑</el-button>
            <el-button type="danger" link @click="deleteQuestion(question.id)">删除</el-button>
          </div>
        </div>
      </div>
    </el-card>
    
    <!-- 添加编辑对话框 -->
    <edit-question-dialog
      v-model="showEditDialog"
      :question="currentQuestion"
      @save="handleSaveQuestion"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useQuestionStore } from '@/stores/question'
import type { Question } from '@/types/question'
import EditQuestionDialog from './components/EditQuestionDialog.vue'
import { ElMessage } from 'element-plus'

const router = useRouter()
const questionStore = useQuestionStore()

// 使用 store 中的题目数据
const questions = computed(() => {
  console.log('Questions from store:', questionStore.questions)
  return questionStore.questions
})

const goToAiGenerate = () => {
  router.push({ name: 'AiGenerate' })
}

// 添加状态
const showEditDialog = ref(false)
const currentQuestion = ref<Question>()

// 修改编辑方法
const editQuestion = (id: number) => {
  const question = questions.value.find(q => q.id === id)
  if (question) {
    currentQuestion.value = { ...question }
    showEditDialog.value = true
  }
}

// 处理保存
const handleSaveQuestion = (question: Question) => {
  if (question.id) {
    questionStore.updateQuestion(question.id, question)
    ElMessage.success('保存成功')
  }
}

const deleteQuestion = (id: number) => {
  questionStore.removeQuestion(id)
}

// 获取题目类型标签
const getQuestionTypeLabel = (type: string) => {
  const labels: Record<string, string> = {
    single: '单选题',
    multiple: '多选题',
    judge: '判断题',
    coding: '编程题'
  }
  return labels[type] || type
}

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
</script>

<style scoped lang="scss">
.question-bank {
  padding: 20px;
  
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    
    h3 {
      margin: 0;
    }
  }
  
  .question-list {
    .question-item {
      margin-bottom: 20px;
      padding: 20px;
      border: 1px solid #eee;
      border-radius: 4px;
      
      &:last-child {
        margin-bottom: 0;
      }
      
      .question-header {
        display: flex;
        gap: 10px;
        margin-bottom: 10px;
        
        .question-type,
        .question-difficulty {
          padding: 2px 8px;
          border-radius: 4px;
          font-size: 12px;
          background: #f5f7fa;
        }
      }
      
      .question-content {
        h4 {
          margin: 0 0 10px 0;
        }
      }
      
      .question-actions {
        margin-top: 15px;
        display: flex;
        justify-content: flex-end;
        gap: 10px;
      }
    }
  }

  .empty-tip {
    text-align: center;
    padding: 40px 0;
    color: #909399;
    font-size: 14px;
  }
}
</style> 