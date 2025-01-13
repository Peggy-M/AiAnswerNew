<template>
  <div class="exam-result">
    <el-card class="result-card">
      <template #header>
        <div class="card-header">
          <h2>考试结果</h2>
          <el-tag :type="getScoreType(examResult.score)">
            {{ examResult.score }}分
          </el-tag>
        </div>
      </template>
      
      <!-- 基本信息 -->
      <div class="result-info">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="考试名称">{{ examResult.name }}</el-descriptions-item>
          <el-descriptions-item label="考试时间">{{ examResult.examTime }}</el-descriptions-item>
          <el-descriptions-item label="用时">{{ examResult.duration }}分钟</el-descriptions-item>
          <el-descriptions-item label="总分">{{ examResult.totalScore }}分</el-descriptions-item>
          <el-descriptions-item label="及格分">{{ examResult.passScore }}分</el-descriptions-item>
          <el-descriptions-item label="状态">
            <el-tag :type="examResult.score >= examResult.passScore ? 'success' : 'danger'">
              {{ examResult.score >= examResult.passScore ? '及格' : '不及格' }}
            </el-tag>
          </el-descriptions-item>
        </el-descriptions>
      </div>

      <!-- 得分分布 -->
      <div class="score-distribution">
        <h3>得分分布</h3>
        <div class="chart-container">
          <div class="score-item" v-for="item in scoreDistribution" :key="item.type">
            <div class="label">{{ item.label }}</div>
            <el-progress
              :percentage="(item.score / examResult.totalScore) * 100"
              :color="item.color"
              :format="(percentage) => `${item.score}分`"
            />
          </div>
        </div>
      </div>

      <!-- 错题分析 -->
      <div class="wrong-questions" v-if="wrongQuestions.length">
        <h3>错题分析</h3>
        <el-collapse>
          <el-collapse-item 
            v-for="question in wrongQuestions" 
            :key="question.id"
            :title="`第${question.index}题 (${question.type})`"
          >
            <div class="question-content">
              <p class="question-title">{{ question.title }}</p>
              <div class="options" v-if="['single', 'multiple'].includes(question.questionType)">
                <div 
                  v-for="option in question.options" 
                  :key="option.value"
                  class="option-item"
                  :class="{
                    'correct': option.value === question.correctAnswer,
                    'wrong': option.value === question.userAnswer
                  }"
                >
                  {{ option.label }}. {{ option.content }}
                </div>
              </div>
              <div class="answer-analysis">
                <p><strong>正确答案：</strong>{{ question.correctAnswer }}</p>
                <p><strong>你的答案：</strong>{{ question.userAnswer }}</p>
                <p><strong>解析：</strong>{{ question.analysis }}</p>
              </div>
            </div>
          </el-collapse-item>
        </el-collapse>
      </div>

      <!-- 操作按钮 -->
      <div class="action-buttons">
        <el-button type="primary" @click="retakeExam">重新考试</el-button>
        <el-button @click="router.push('/exam')">返回考试中心</el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

// 考试结果数据
const examResult = ref({
  name: 'JavaScript进阶模拟考试',
  examTime: '2024-01-15 10:00',
  duration: 85,
  totalScore: 100,
  passScore: 60,
  score: 75
})

// 得分分布
const scoreDistribution = ref([
  { type: 'single', label: '单选题', score: 30, color: '#409EFF' },
  { type: 'multiple', label: '多选题', score: 25, color: '#67C23A' },
  { type: 'judge', label: '判断题', score: 10, color: '#E6A23C' },
  { type: 'essay', label: '简答题', score: 10, color: '#F56C6C' }
])

// 错题列表
const wrongQuestions = ref([
  {
    id: 1,
    index: 3,
    type: '单选题',
    questionType: 'single',
    title: '关于Vue.js的生命周期，下列说法错误的是？',
    options: [
      { value: 'A', label: 'A', content: 'created钩子中可以访问数据' },
      { value: 'B', label: 'B', content: 'mounted钩子中DOM已经挂载完成' },
      { value: 'C', label: 'C', content: 'beforeDestroy钩子中组件实例仍然完全可用' },
      { value: 'D', label: 'D', content: 'beforeCreate钩子中可以访问数据' }
    ],
    correctAnswer: 'D',
    userAnswer: 'A',
    analysis: 'beforeCreate钩子函数在实例初始化之后，数据观测(data observer)和event/watcher事件配置之前被调用，此时无法访问数据。'
  }
])

// 获取分数类型
const getScoreType = (score: number) => {
  if (score >= 90) return 'success'
  if (score >= 60) return 'warning'
  return 'danger'
}

// 重新考试
const retakeExam = () => {
  router.push(`/exam/${route.params.id}`)
}

// 获取考试结果
onMounted(async () => {
  // TODO: 从API获取考试结果
})
</script>

<style scoped lang="scss">
.exam-result {
  padding: 20px;
  
  .result-card {
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      
      h2 {
        margin: 0;
      }
    }
    
    .result-info {
      margin-bottom: 30px;
    }
    
    .score-distribution {
      margin-bottom: 30px;
      
      h3 {
        margin-bottom: 20px;
      }
      
      .chart-container {
        padding: 0 20px;
        
        .score-item {
          margin-bottom: 15px;
          
          .label {
            margin-bottom: 5px;
          }
        }
      }
    }
    
    .wrong-questions {
      margin-bottom: 30px;
      
      h3 {
        margin-bottom: 20px;
      }
      
      .question-content {
        .question-title {
          font-weight: bold;
          margin-bottom: 15px;
        }
        
        .options {
          margin-bottom: 15px;
          
          .option-item {
            padding: 8px;
            margin-bottom: 8px;
            border-radius: 4px;
            
            &.correct {
              background: rgba(103, 194, 58, 0.1);
              color: #67C23A;
            }
            
            &.wrong {
              background: rgba(245, 108, 108, 0.1);
              color: #F56C6C;
            }
          }
        }
        
        .answer-analysis {
          padding: 15px;
          background: #f5f7fa;
          border-radius: 4px;
          
          p {
            margin-bottom: 8px;
            
            &:last-child {
              margin-bottom: 0;
            }
          }
        }
      }
    }
    
    .action-buttons {
      display: flex;
      justify-content: center;
      gap: 20px;
    }
  }
}
</style> 