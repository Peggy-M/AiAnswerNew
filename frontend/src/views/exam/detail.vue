<template>
  <div class="exam-detail">
    <div class="exam-header">
      <h2>{{ examDetail.name }}</h2>
      <div class="exam-info">
        <span>剩余时间：{{ formatTime(examConfig.timeRemaining) }}</span>
        <el-button type="primary" @click="submitExam">交卷</el-button>
      </div>
    </div>
    
    <div class="question-list">
      <div v-for="question in examQuestions" :key="question.id" class="question-item">
        <h3>{{ question.id }}. {{ question.title }}</h3>
        
        <!-- 单选题 -->
        <div v-if="question.type === 'single'" class="options">
          <el-radio-group v-model="answers[question.id]">
            <el-radio 
              v-for="option in question.options" 
              :key="option.value" 
              :label="option.value"
            >
              {{ option.content }}
            </el-radio>
          </el-radio-group>
        </div>

        <!-- 多选题 -->
        <div v-if="question.type === 'multiple'" class="options">
          <el-checkbox-group v-model="answers[question.id]">
            <el-checkbox 
              v-for="option in question.options" 
              :key="option.value" 
              :label="option.value"
            >
              {{ option.content }}
            </el-checkbox>
          </el-checkbox-group>
        </div>

        <!-- 判断题 -->
        <div v-if="question.type === 'judge'" class="options">
          <el-radio-group v-model="answers[question.id]">
            <el-radio :label="true">正确</el-radio>
            <el-radio :label="false">错误</el-radio>
          </el-radio-group>
        </div>

        <!-- 编程题 -->
        <div v-if="question.type === 'coding'" class="coding">
          <p class="description">{{ question.description }}</p>
          <el-input
            v-model="answers[question.id]"
            type="textarea"
            :rows="10"
            placeholder="请在此输入你的代码"
          />
          <div class="template" v-if="question.template">
            <p>参考模板：</p>
            <pre><code>{{ question.template }}</code></pre>
          </div>
        </div>
      </div>
    </div>

    <!-- 提交确认对话框 -->
    <el-dialog
      v-model="submitDialogVisible"
      title="确认提交"
      width="30%"
    >
      <span>确定要提交试卷吗？提交后将无法修改答案。</span>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="submitDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="confirmSubmit">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const answers = ref<Record<number, any>>({})
const submitDialogVisible = ref(false)

// 考试详情数据
const examDetail = ref({
  id: 1,
  name: 'Vue.js 3.0 核心技术评估',
  description: '本次考试主要考察Vue 3.0的核心概念和实践应用能力，包括Composition API、响应式系统等内容',
  duration: 90,
  totalScore: 100,
  passScore: 60,
  questionCount: 30,
  startTime: '2024-01-20 14:00',
  endTime: '2024-01-20 15:30'
})

// 考试配置
const examConfig = ref({
  timeRemaining: 90 * 60,
  autoSubmit: true,
  showAnalysis: false,
  shuffleQuestions: false,
  shuffleOptions: false
})

// 考试题目数据
const examQuestions = ref([
  {
    id: 1,
    type: 'single',
    score: 2,
    title: '在Vue 3中，哪个API用于创建响应式对象？',
    options: [
      { value: 'A', content: 'reactive()' },
      { value: 'B', content: 'ref()' },
      { value: 'C', content: 'computed()' },
      { value: 'D', content: 'watch()' }
    ],
    correctAnswer: 'A',
    analysis: 'reactive()是Vue 3中用于创建响应式对象的核心API，它返回一个对象的响应式代理'
  },
  // ... 其他题目数据保持不变
])

// 格式化时间
const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
}

// 倒计时
let timer: number
const startTimer = () => {
  timer = window.setInterval(() => {
    if (examConfig.value.timeRemaining > 0) {
      examConfig.value.timeRemaining--
    } else {
      clearInterval(timer)
      submitExam()
    }
  }, 1000)
}

// 提交考试
const submitExam = () => {
  submitDialogVisible.value = true
}

// 确认提交
const confirmSubmit = () => {
  submitDialogVisible.value = false
  // TODO: 提交答案到服务器
  router.push(`/exam/${route.params.id}/result`)
}

onMounted(() => {
  startTimer()
})

onUnmounted(() => {
  clearInterval(timer)
})
</script>

<style scoped lang="scss">
.exam-detail {
  padding: 20px;
  
  .exam-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    padding-bottom: 20px;
    border-bottom: 1px solid #eee;
    
    .exam-info {
      display: flex;
      align-items: center;
      gap: 20px;
    }
  }
  
  .question-list {
    .question-item {
      margin-bottom: 30px;
      padding: 20px;
      background: #fff;
      border-radius: 4px;
      box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
      
      h3 {
        margin-bottom: 15px;
      }
      
      .options {
        padding-left: 20px;
      }

      .coding {
        .description {
          margin-bottom: 15px;
          color: #666;
        }

        .template {
          margin-top: 15px;
          padding: 15px;
          background: #f5f7fa;
          border-radius: 4px;

          pre {
            margin: 0;
            code {
              display: block;
              padding: 10px;
              background: #fff;
              border-radius: 4px;
            }
          }
        }
      }
    }
  }
}
</style> 