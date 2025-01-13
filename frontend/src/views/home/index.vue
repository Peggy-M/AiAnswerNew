<template>
  <div class="home-container">
    <!-- 顶部Banner -->
    <div class="hero-section">
      <div class="hero-content">
        <h1>AI智能学习平台</h1>
        <p>让学习更智能，让教育更高效</p>
        <el-button type="primary" size="large" @click="router.push('/courses')">
          开始学习
        </el-button>
      </div>
    </div>

    <!-- 课程推荐 -->
    <div class="section course-section">
      <div class="section-header">
        <h2>精选课程</h2>
        <p>为您推荐优质学习内容</p>
      </div>
      
      <el-row :gutter="20">
        <el-col v-for="course in courses" :key="course.id" :xs="24" :sm="12" :md="8" :lg="6">
          <div class="course-card" @click="router.push(`/courses/${course.id}`)">
            <div class="course-image">
              <img :src="course.cover" :alt="course.title">
              <div class="course-level">{{ course.level }}</div>
            </div>
            <div class="course-info">
              <h3>{{ course.title }}</h3>
              <p>{{ course.description }}</p>
              <div class="course-meta">
                <span><el-icon><User /></el-icon>{{ course.studentCount }}人学习</span>
                <span><el-icon><Timer /></el-icon>{{ course.duration }}分钟</span>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>

    <!-- 特色功能 -->
    <div class="section feature-section">
      <div class="section-header">
        <h2>平台特色</h2>
        <p>智能化学习体验</p>
      </div>
      
      <el-row :gutter="30">
        <el-col v-for="feature in features" :key="feature.id" :xs="24" :sm="12" :md="8">
          <div class="feature-card" @click="handleFeatureClick(feature)">
            <el-icon class="feature-icon" :size="40">
              <component :is="feature.icon" />
            </el-icon>
            <h3>{{ feature.title }}</h3>
            <p>{{ feature.description }}</p>
          </div>
        </el-col>
      </el-row>
    </div>

    <!-- 学习数据 -->
    <div class="section stats-section">
      <el-row :gutter="20">
        <el-col v-for="stat in stats" :key="stat.id" :span="6">
          <div class="stat-card">
            <div class="stat-number">{{ stat.number }}</div>
            <div class="stat-label">{{ stat.label }}</div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { User, Timer, Monitor, DataLine, Trophy } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/user'
import { ElMessage } from 'element-plus'

const router = useRouter()
const userStore = useUserStore()

const courses = ref([
  {
    id: 1,
    title: 'Python基础入门',
    description: '零基础学习Python编程',
    cover: '/images/course1.jpg',
    level: '入门',
    studentCount: 1234,
    duration: 120
  },
  {
    id: 2,
    title: 'Web前端开发',
    description: '从零开始学习前端开发',
    cover: '/images/course2.jpg',
    level: '进阶',
    studentCount: 890,
    duration: 180
  },
  {
    id: 3,
    title: '数据结构与算法',
    description: '掌握编程核心竞争力',
    cover: '/images/course3.jpg',
    level: '高级',
    studentCount: 567,
    duration: 150
  },
  {
    id: 4,
    title: '人工智能基础',
    description: 'AI时代必备知识',
    cover: '/images/course4.jpg',
    level: '入门',
    studentCount: 789,
    duration: 160
  }
])

const features = ref([
  {
    id: 1,
    icon: 'Monitor',
    title: 'AI智能出题',
    description: '基于知识图谱的智能题目生成',
    path: '/admin/ai-generate'
  },
  // ... 更多特色
])

const stats = ref([
  {
    id: 1,
    number: '10000+',
    label: '注册学员'
  },
  // ... 更多统计
])

const handleFeatureClick = (feature: any) => {
  if (feature.title === 'AI智能出题') {
    if (userStore.hasRole('admin')) {
      router.push(feature.path)
    } else {
      ElMessage.warning('只有管理员才能访问AI智能出题功能')
    }
  }
  // 其他特性的处理...
}
</script>

<style scoped lang="scss">
.home-container {
  .hero-section {
    height: 500px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    color: white;
    padding: 20px;
    
    .hero-content {
      h1 {
        font-size: 48px;
        font-weight: bold;
        margin-bottom: 20px;
      }
      
      p {
        font-size: 20px;
        margin-bottom: 30px;
        opacity: 0.9;
      }
      
      .el-button {
        padding: 15px 40px;
        font-size: 18px;
        border-radius: 30px;
      }
    }
  }

  .section {
    padding: 80px 20px;
    
    .section-header {
      text-align: center;
      margin-bottom: 50px;
      
      h2 {
        font-size: 36px;
        color: #333;
        margin-bottom: 10px;
      }
      
      p {
        font-size: 18px;
        color: #666;
      }
    }
  }

  .course-card {
    background: white;
    border-radius: 15px;
    overflow: hidden;
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.05);
    transition: transform 0.3s;
    margin-bottom: 20px;
    cursor: pointer;
    
    &:hover {
      transform: translateY(-5px);
      box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
    }
    
    .course-image {
      position: relative;
      height: 200px;
      
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      
      .course-level {
        position: absolute;
        top: 10px;
        right: 10px;
        background: rgba(0, 0, 0, 0.5);
        color: white;
        padding: 5px 10px;
        border-radius: 15px;
        font-size: 12px;
      }
    }
    
    .course-info {
      padding: 20px;
      
      h3 {
        font-size: 18px;
        margin-bottom: 10px;
      }
      
      p {
        color: #666;
        margin-bottom: 15px;
        height: 40px;
        overflow: hidden;
      }
      
      .course-meta {
        display: flex;
        justify-content: space-between;
        color: #999;
        font-size: 14px;
        
        span {
          display: flex;
          align-items: center;
          gap: 5px;
        }
      }
    }
  }

  .feature-card {
    text-align: center;
    padding: 40px 20px;
    background: white;
    border-radius: 15px;
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.05);
    margin-bottom: 20px;
    cursor: pointer;
    transition: all 0.3s;
    
    .feature-icon {
      color: #409EFF;
      margin-bottom: 20px;
    }
    
    h3 {
      font-size: 20px;
      margin-bottom: 10px;
    }
    
    p {
      color: #666;
    }
    
    &:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
    }
  }

  .stats-section {
    background: #f8fafc;
    
    .stat-card {
      text-align: center;
      padding: 30px;
      
      .stat-number {
        font-size: 36px;
        font-weight: bold;
        color: #409EFF;
        margin-bottom: 10px;
      }
      
      .stat-label {
        color: #666;
      }
    }
  }
}
</style> 