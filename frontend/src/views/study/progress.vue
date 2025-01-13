<template>
  <div class="study-progress">
    <el-card v-for="course in courses" :key="course.id" class="course-progress">
      <template #header>
        <div class="course-header">
          <span>{{ course.name }}</span>
          <el-progress
            :percentage="course.progress"
            :status="course.progress === 100 ? 'success' : ''"
          />
        </div>
      </template>
      <div class="course-detail">
        <p>已学习章节: {{ course.completedChapters }}/{{ course.totalChapters }}</p>
        <p>最近学习: {{ course.lastStudyTime }}</p>
        <el-button type="primary" size="small" @click="continueLearning(course.id)">
          继续学习
        </el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

interface Course {
  id: number
  name: string
  progress: number
  completedChapters: number
  totalChapters: number
  lastStudyTime: string
}

const courses = ref<Course[]>([
  {
    id: 1,
    name: '示例课程1',
    progress: 60,
    completedChapters: 3,
    totalChapters: 5,
    lastStudyTime: '2024-01-12 10:30'
  },
  {
    id: 2,
    name: '示例课程2',
    progress: 30,
    completedChapters: 2,
    totalChapters: 6,
    lastStudyTime: '2024-01-11 15:20'
  }
])

const continueLearning = (courseId: number) => {
  router.push(`/course/${courseId}`)
}
</script>

<style scoped lang="scss">
.study-progress {
  .course-progress {
    margin-bottom: 20px;
    
    .course-header {
      display: flex;
      align-items: center;
      gap: 20px;
      
      span {
        min-width: 100px;
      }
      
      .el-progress {
        flex: 1;
      }
    }
    
    .course-detail {
      p {
        margin-bottom: 10px;
        color: #666;
      }
    }
  }
}
</style> 