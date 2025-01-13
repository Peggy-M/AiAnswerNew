<template>
  <div class="exam-generate">
    <el-card class="form-card">
      <template #header>
        <div class="card-header">
          <h3>试卷生成</h3>
        </div>
      </template>

      <el-form :model="examForm" label-width="100px">
        <el-form-item label="试卷名称">
          <el-input v-model="examForm.name" placeholder="请输入试卷名称" />
        </el-form-item>

        <el-form-item label="考试时长">
          <el-select v-model="examForm.duration" style="width: 200px">
            <el-option label="60分钟" :value="60" />
            <el-option label="90分钟" :value="90" />
            <el-option label="120分钟" :value="120" />
          </el-select>
        </el-form-item>

        <el-form-item label="试卷难度">
          <el-select 
            v-model="examForm.difficulty" 
            multiple
            collapse-tags
            collapse-tags-tooltip
            placeholder="请选择试卷难度（可多选）"
            style="width: 100%"
          >
            <el-option label="入门" value="beginner" />
            <el-option label="初级" value="elementary" />
            <el-option label="中级" value="intermediate" />
            <el-option label="高级" value="advanced" />
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleGenerate">生成试卷</el-button>
          <el-button @click="handlePreview" :disabled="!examQuestions.length">
            预览试卷
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 试卷预览对话框 -->
    <el-dialog
      v-model="showPreview"
      title="试卷预览"
      width="80%"
      top="5vh"
    >
      <div class="exam-preview">
        <div class="exam-header">
          <h1>{{ examForm.name }}</h1>
          <div class="exam-info">
            <div class="info-item">
              <el-icon><Timer /></el-icon>
              <span>考试时长：{{ examForm.duration }}分钟</span>
            </div>
            <div class="info-item">
              <el-icon><Collection /></el-icon>
              <span>总分：100分</span>
            </div>
            <div class="info-item">
              <el-icon><Warning /></el-icon>
              <span>难度：{{ formatDifficulty(examForm.difficulty) }}</span>
            </div>
          </div>
          <div class="exam-tips">
            <p>注意事项：</p>
            <ol>
              <li>请认真阅读题目，按要求作答。</li>
              <li>选择题请在选项中选择正确答案。</li>
              <li>判断题请选择"正确"或"错误"。</li>
              <li>编程题请按照要求编写代码并注意代码规范。</li>
            </ol>
          </div>
        </div>

        <div class="question-sections">
          <div 
            v-for="type in questionTypes" 
            :key="type.value"
            class="section"
          >
            <template v-if="getQuestionsByType(type.value).length">
              <div class="section-header">
                <h2>{{ type.label }}</h2>
                <span class="score">（每题{{ getQuestionScore(type.value) }}分）</span>
              </div>
              
              <div 
                v-for="(question, index) in getQuestionsByType(type.value)"
                :key="question.id"
                class="question-item"
              >
                <div class="question-title">
                  <span class="question-number">{{ index + 1 }}.</span>
                  {{ question.title }}
                </div>
                
                <template v-if="['single', 'multiple'].includes(question.type)">
                  <div class="options-grid">
                    <div 
                      v-for="option in question.options"
                      :key="option.value"
                      class="option-item"
                    >
                      <span class="option-label">{{ option.value }}</span>
                      {{ option.content }}
                    </div>
                  </div>
                </template>

                <template v-else-if="question.type === 'judge'">
                  <div class="judge-options">
                    <div class="option-item">
                      <el-radio :label="true" disabled>正确</el-radio>
                    </div>
                    <div class="option-item">
                      <el-radio :label="false" disabled>错误</el-radio>
                    </div>
                  </div>
                </template>

                <template v-else>
                  <div class="coding-area">
                    <p class="requirement">{{ question.title }}</p>
                    <div class="code-box">
                      请在此处编写代码
                    </div>
                  </div>
                </template>
              </div>
            </template>
          </div>
        </div>
      </div>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showPreview = false">关闭</el-button>
          <el-button type="primary" @click="handleSaveExam">
            保存试卷
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Timer, Collection, Warning } from '@element-plus/icons-vue'
import { useQuestionStore } from '@/stores/question'
import { useExamStore } from '@/stores/exam'
import type { Question } from '@/types/question'

const questionStore = useQuestionStore()
const examStore = useExamStore()
const router = useRouter()
const showPreview = ref(false)
const examQuestions = ref<Question[]>([])

// 题型配置
const questionTypes = [
  { label: '单选题', value: 'single' },
  { label: '多选题', value: 'multiple' },
  { label: '判断题', value: 'judge' },
  { label: '编程题', value: 'coding' }
]

interface ExamForm {
  name: string
  duration: number
  difficulty: string[]
}

// 试卷表单简化
const examForm = reactive<ExamForm>({
  name: '',
  duration: 90,
  difficulty: []
})

// 预设试卷配置
const examConfigs = {
  beginner: {
    single: { count: 15, score: 2 },
    multiple: { count: 8, score: 4 },
    judge: { count: 10, score: 2 },
    coding: { count: 1, score: 10 }
  },
  elementary: {
    single: { count: 12, score: 2 },
    multiple: { count: 10, score: 4 },
    judge: { count: 8, score: 2 },
    coding: { count: 2, score: 10 }
  },
  intermediate: {
    single: { count: 10, score: 2 },
    multiple: { count: 10, score: 4 },
    judge: { count: 5, score: 2 },
    coding: { count: 3, score: 10 }
  },
  advanced: {
    single: { count: 8, score: 2 },
    multiple: { count: 8, score: 4 },
    judge: { count: 4, score: 2 },
    coding: { count: 4, score: 12 }
  }
}

// 生成试卷
const handleGenerate = () => {
  if (!validateForm()) return

  try {
    // 处理多个难度
    const questions: Question[] = []
    
    // 为每个选中的难度生成对应数量的题目
    examForm.difficulty.forEach(difficulty => {
      const config = examConfigs[difficulty]
      const difficultyQuestions = generateQuestionsForDifficulty(config, difficulty)
      questions.push(...difficultyQuestions)
    })

    examQuestions.value = questions

    if (examQuestions.value.length > 0) {
      ElMessage.success('试卷生成成功')
      showPreview.value = true
    } else {
      ElMessage.warning('题库中没有足够的题目，请调整难度')
    }
  } catch (error) {
    console.error('Generate error:', error)
    ElMessage.error('生成试卷失败，请重试')
  }
}

// 为特定难度生成题目
const generateQuestionsForDifficulty = (config: any, difficulty: string) => {
  const questions: Question[] = []
  const allQuestions = questionStore.questions

  // 按题型和难度筛选题目
  Object.entries(config).forEach(([type, typeConfig]: [string, any]) => {
    if (typeConfig.count > 0) {
      const typeQuestions = allQuestions.filter(q => 
        q.type === type && 
        q.difficulty === difficulty
      )

      // 根据难度数量平均分配题目数量
      const adjustedCount = Math.floor(typeConfig.count / examForm.difficulty.length)
      if (adjustedCount > 0) {
        const selectedQuestions = shuffleArray(typeQuestions).slice(0, adjustedCount)
        questions.push(...selectedQuestions)
      }
    }
  })

  return questions
}

// 获取题目分数
const getQuestionScore = (type: string) => {
  // 如果选择了多个难度，取平均分数
  const scores = examForm.difficulty.map(diff => examConfigs[diff][type].score)
  return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
}

// 表单验证
const validateForm = () => {
  if (!examForm.name.trim()) {
    ElMessage.warning('请输入试卷名称')
    return false
  }

  if (!examForm.duration) {
    ElMessage.warning('请选择考试时长')
    return false
  }

  if (!examForm.difficulty) {
    ElMessage.warning('请选择试卷难度')
    return false
  }

  return true
}

// 数组随机排序
const shuffleArray = <T>(array: T[]): T[] => {
  const newArray = [...array]
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]]
  }
  return newArray
}

// 按题型获取题目
const getQuestionsByType = (type: string) => {
  return examQuestions.value.filter(q => q.type === type)
}

// 预览试卷
const handlePreview = () => {
  showPreview.value = true
}

// 保存试卷
const handleSaveExam = () => {
  const exam: Exam = {
    id: Date.now(), // 确保设置了唯一的 id
    name: examForm.name,
    duration: examForm.duration,
    difficulty: examForm.difficulty,
    totalScore: calculateTotalScore(),
    questions: examQuestions.value,
    status: 'draft',
    createTime: new Date().toISOString(),
    updateTime: new Date().toISOString()
  }
  
  console.log('Saving exam:', exam)
  examStore.addExam(exam)
  ElMessage.success('试卷保存成功')
  router.push('/admin/exam/manage')
}

// 格式化难度显示
const formatDifficulty = (difficulties: string[]) => {
  const labels: Record<string, string> = {
    beginner: '入门',
    elementary: '初级',
    intermediate: '中级',
    advanced: '高级'
  }
  
  if (!difficulties || difficulties.length === 0) return ''
  
  return difficulties
    .map(diff => labels[diff] || diff)
    .join('/')
}
</script>

<style scoped lang="scss">
.exam-preview {
  padding: 20px;
  background: #fff;
  
  .exam-header {
    text-align: center;
    margin-bottom: 40px;
    
    h1 {
      font-size: 24px;
      margin-bottom: 20px;
    }
    
    .exam-info {
      display: flex;
      justify-content: center;
      gap: 40px;
      margin-bottom: 30px;
      
      .info-item {
        display: flex;
        align-items: center;
        gap: 8px;
        color: #666;
        
        .el-icon {
          font-size: 18px;
        }
      }
    }
    
    .exam-tips {
      text-align: left;
      background: #f5f7fa;
      padding: 15px 20px;
      border-radius: 4px;
      
      p {
        font-weight: bold;
        margin-bottom: 10px;
      }
      
      ol {
        margin: 0;
        padding-left: 20px;
        
        li {
          color: #666;
          line-height: 1.6;
        }
      }
    }
  }
  
  .question-sections {
    .section {
      margin-bottom: 40px;
      
      .section-header {
        display: flex;
        align-items: center;
        margin-bottom: 20px;
        padding-bottom: 10px;
        border-bottom: 2px solid #409EFF;
        
        h2 {
          margin: 0;
          font-size: 18px;
        }
        
        .score {
          margin-left: 10px;
          color: #666;
        }
      }
      
      .question-item {
        margin-bottom: 30px;
        
        .question-title {
          font-size: 16px;
          margin-bottom: 15px;
          
          .question-number {
            color: #409EFF;
            margin-right: 8px;
            font-weight: bold;
          }
        }
        
        .options-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 15px;
          
          .option-item {
            padding: 10px;
            background: #f5f7fa;
            border-radius: 4px;
            
            .option-label {
              color: #409EFF;
              font-weight: bold;
              margin-right: 8px;
            }
          }
        }
        
        .judge-options {
          display: flex;
          gap: 30px;
          margin-top: 10px;
        }
        
        .coding-area {
          .requirement {
            color: #666;
            margin-bottom: 15px;
          }
          
          .code-box {
            background: #1e1e1e;
            color: #d4d4d4;
            padding: 15px;
            border-radius: 4px;
            font-family: monospace;
            min-height: 100px;
          }
        }
      }
    }
  }
}

:deep(.el-select) {
  .el-select__tags {
    padding: 3px 0;
  }
}
</style> 