<template>
  <div class="exam-center">
    <el-card>
      <template #header>
        <div class="card-header">
          <h3>考试中心</h3>
        </div>
      </template>

      <div class="exam-list">
        <el-empty v-if="publishedExams.length === 0" description="暂无可参加的考试" />
        
        <el-row v-else :gutter="20">
          <el-col 
            v-for="exam in publishedExams" 
            :key="exam.id" 
            :xs="24" 
            :sm="12" 
            :md="8"
          >
            <el-card class="exam-card" shadow="hover">
              <div class="exam-info">
                <h4>{{ exam.name }}</h4>
                <div class="meta">
                  <div class="meta-item">
                    <el-icon><Timer /></el-icon>
                    <span>{{ exam.duration }}分钟</span>
                  </div>
                  <div class="meta-item">
                    <el-icon><Collection /></el-icon>
                    <span>{{ exam.totalScore }}分</span>
                  </div>
                  <div class="meta-item">
                    <el-icon><Warning /></el-icon>
                    <div class="difficulty-tags">
                      <el-tag
                        v-for="diff in exam.difficulty"
                        :key="diff"
                        :type="getDifficultyType(diff)"
                        class="difficulty-tag"
                        size="small"
                      >
                        {{ getDifficultyLabel(diff) }}
                      </el-tag>
                    </div>
                  </div>
                </div>
                
                <div class="exam-time">
                  <div class="time-item">
                    <label>开始时间：</label>
                    <span>{{ formatDateTime(exam.startTime) }}</span>
                  </div>
                  <div class="time-item">
                    <label>结束时间：</label>
                    <span>{{ formatDateTime(exam.endTime) }}</span>
                  </div>
                </div>

                <div class="exam-status">
                  <el-tag :type="getExamStatusType(exam)">
                    {{ getExamStatusLabel(exam) }}
                  </el-tag>
                </div>
              </div>

              <div class="exam-footer">
                <el-button 
                  type="primary" 
                  :disabled="!canTakeExam(exam)"
                  @click="startExam(exam.id)"
                >
                  {{ getExamButtonLabel(exam) }}
                </el-button>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Timer, Collection, Warning } from '@element-plus/icons-vue'
import { useExamStore } from '@/stores/exam'
import type { Exam } from '@/types/exam'

const router = useRouter()
const examStore = useExamStore()

// 在组件挂载时加载试卷数据
onMounted(() => {
  examStore.loadExams()
})

// 获取已发布的考试
const publishedExams = computed(() => {
  return examStore.exams.filter(exam => exam.status === 'published')
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

// 格式化日期时间
const formatDateTime = (dateStr?: string) => {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleString()
}

// 获取考试状态
const getExamStatus = (exam: Exam) => {
  const now = new Date().getTime()
  const startTime = new Date(exam.startTime || '').getTime()
  const endTime = new Date(exam.endTime || '').getTime()

  if (now < startTime) return 'notStarted'
  if (now > endTime) return 'ended'
  return 'inProgress'
}

// 获取考试状态标签
const getExamStatusLabel = (exam: Exam) => {
  const status = getExamStatus(exam)
  const labels: Record<string, string> = {
    notStarted: '未开始',
    inProgress: '进行中',
    ended: '已结束'
  }
  return labels[status] || status
}

// 获取考试状态样式
const getExamStatusType = (exam: Exam) => {
  const status = getExamStatus(exam)
  const types: Record<string, string> = {
    notStarted: 'info',
    inProgress: 'success',
    ended: 'warning'
  }
  return types[status] || 'info'
}

// 获取按钮文字
const getExamButtonLabel = (exam: Exam) => {
  const status = getExamStatus(exam)
  const labels: Record<string, string> = {
    notStarted: '未开始',
    inProgress: '开始考试',
    ended: '已结束'
  }
  return labels[status] || '开始考试'
}

// 检查是否可以参加考试
const canTakeExam = (exam: Exam) => {
  const now = new Date().getTime()
  const startTime = new Date(exam.startTime || '').getTime()
  const endTime = new Date(exam.endTime || '').getTime()
  
  return now >= startTime && now <= endTime
}

// 开始考试
const startExam = (examId: number) => {
  router.push(`/exam/${examId}`)
}
</script>

<style scoped lang="scss">
.exam-center {
  padding: 20px;
  
  .exam-list {
    .exam-card {
      height: 100%;
      margin-bottom: 20px;
      
      .exam-info {
        h4 {
          margin: 0 0 15px 0;
          font-size: 18px;
        }
        
        .meta {
          display: flex;
          gap: 20px;
          margin-bottom: 15px;
          
          .meta-item {
            display: flex;
            align-items: center;
            gap: 5px;
            color: #666;
            
            .el-icon {
              font-size: 16px;
            }
          }
        }
        
        .exam-time {
          margin-bottom: 15px;
          
          .time-item {
            margin-bottom: 5px;
            color: #666;
            
            label {
              display: inline-block;
              width: 80px;
            }
          }
        }
        
        .exam-status {
          margin-bottom: 15px;
        }
      }
      
      .exam-footer {
        display: flex;
        justify-content: center;
        
        .el-button {
          width: 120px;
        }
      }
    }
  }

  .difficulty-tags {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;

    .difficulty-tag {
      margin: 0;
    }
  }

  .meta {
    .meta-item {
      &:has(.difficulty-tags) {
        flex-direction: column;
        align-items: flex-start;
        gap: 8px;
      }

      .difficulty-tags {
        display: flex;
        gap: 4px;
        flex-wrap: wrap;

        .difficulty-tag {
          margin: 0;
        }
      }
    }
  }
}
</style> 