<template>
  <div class="wrong-questions">
    <el-tabs v-model="activeTab">
      <el-tab-pane 
        v-for="subject in subjects" 
        :key="subject.id"
        :label="subject.name"
        :name="subject.id.toString()"
      >
        <div class="question-list">
          <div v-for="question in subject.questions" :key="question.id" class="question-item">
            <h4>{{ question.title }}</h4>
            <p class="wrong-answer">你的答案：{{ question.userAnswer }}</p>
            <p class="correct-answer">正确答案：{{ question.correctAnswer }}</p>
            <div class="question-actions">
              <el-button type="primary" size="small" @click="reviewQuestion(question.id)">
                重新练习
              </el-button>
            </div>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const activeTab = ref('1')

interface Question {
  id: number
  title: string
  userAnswer: string
  correctAnswer: string
}

interface Subject {
  id: number
  name: string
  questions: Question[]
}

const subjects = ref<Subject[]>([
  {
    id: 1,
    name: '科目一',
    questions: [
      {
        id: 1,
        title: '示例错题1',
        userAnswer: 'A',
        correctAnswer: 'B'
      },
      {
        id: 2,
        title: '示例错题2',
        userAnswer: 'C',
        correctAnswer: 'D'
      }
    ]
  }
])

const reviewQuestion = (questionId: number) => {
  console.log('复习题目:', questionId)
}
</script>

<style scoped lang="scss">
.wrong-questions {
  .question-list {
    .question-item {
      padding: 15px;
      border: 1px solid #eee;
      border-radius: 4px;
      margin-bottom: 15px;
      
      h4 {
        margin-bottom: 10px;
      }
      
      .wrong-answer {
        color: #f56c6c;
        margin-bottom: 5px;
      }
      
      .correct-answer {
        color: #67c23a;
        margin-bottom: 10px;
      }
      
      .question-actions {
        display: flex;
        justify-content: flex-end;
      }
    }
  }
}
</style> 