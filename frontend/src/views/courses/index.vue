<template>
  <div class="courses-container">
    <!-- 搜索区域 -->
    <div class="search-section">
      <h1>探索课程</h1>
      <p class="subtitle">发现适合你的学习内容</p>
      <div class="search-box">
        <el-input
          v-model="searchQuery"
          placeholder="搜索感兴趣的课程..."
          class="search-input"
          prefix-icon="Search"
          clearable
        />
        <el-select
          v-model="difficultyLevel"
          placeholder="难度等级"
          class="difficulty-select"
          clearable
        >
          <el-option label="初级" value="beginner" />
          <el-option label="中级" value="intermediate" />
          <el-option label="高级" value="advanced" />
        </el-select>
        <el-button type="primary" class="search-btn">
          <el-icon><Search /></el-icon>
          搜索
        </el-button>
      </div>
    </div>

    <!-- 课程列表 -->
    <div class="course-list">
      <el-row :gutter="24">
        <el-col 
          v-for="course in filteredCourses" 
          :key="course.id" 
          :xs="24" 
          :sm="12" 
          :md="8" 
          :lg="6"
        >
          <div class="course-card" @click="router.push(`/courses/${course.id}`)">
            <div class="course-image">
              <img :src="course.cover" :alt="course.title">
              <div class="course-level" :class="course.level">{{ course.level }}</div>
            </div>
            <div class="course-info">
              <h3>{{ course.title }}</h3>
              <p>{{ course.description }}</p>
              <div class="course-meta">
                <span class="students">
                  <el-icon><User /></el-icon>
                  {{ course.studentCount }}人学习
                </span>
                <span class="duration">
                  <el-icon><Timer /></el-icon>
                  {{ course.duration }}分钟
                </span>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>

    <!-- 分页 -->
    <div class="pagination">
      <el-pagination
        v-model:current-page="currentPage"
        :page-size="pageSize"
        :total="totalCourses"
        layout="total, prev, pager, next"
        background
        @current-change="handlePageChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Search, User, Timer } from '@element-plus/icons-vue'

const router = useRouter()
const searchQuery = ref('')
const difficultyLevel = ref('')
const currentPage = ref(1)
const pageSize = ref(12)
const totalCourses = ref(100)

// 课程数据
const courses = ref([
  {
    id: 1,
    title: 'Python基础入门',
    description: '零基础学习Python编程',
    cover: 'https://img.freepik.com/free-vector/programming-concept-illustration_114360-1351.jpg',
    level: '入门',
    studentCount: 1234,
    duration: 120
  },
  {
    id: 2,
    title: 'Web前端开发',
    description: '从零开始学习前端开发',
    cover: 'https://img.freepik.com/free-vector/website-development-banner_33099-1687.jpg',
    level: '进阶',
    studentCount: 890,
    duration: 180
  },
  {
    id: 3,
    title: '数据结构与算法',
    description: '掌握编程核心竞争力',
    cover: 'https://img.freepik.com/free-vector/big-data-processing-concept_24908-50897.jpg',
    level: '高级',
    studentCount: 567,
    duration: 150
  },
  {
    id: 4,
    title: '人工智能基础',
    description: 'AI时代必备知识',
    cover: 'https://img.freepik.com/free-vector/artificial-intelligence-concept-illustration_114360-7000.jpg',
    level: '入门',
    studentCount: 789,
    duration: 160
  }
])

// 过滤课程
const filteredCourses = computed(() => {
  return courses.value.filter(course => {
    const matchKeyword = course.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                        course.description.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchLevel = !difficultyLevel.value || course.level === difficultyLevel.value
    return matchKeyword && matchLevel
  })
})

// 页码改变
const handlePageChange = (page: number) => {
  currentPage.value = page
  // 这里可以调用接口重新获取数据
}
</script>

<style scoped lang="scss">
.courses-container {
  padding: 30px;
  min-height: calc(100vh - 60px);
  background: #f8fafc;

  .search-section {
    text-align: center;
    margin-bottom: 40px;
    
    h1 {
      font-size: 32px;
      font-weight: 600;
      color: #1a1a1a;
      margin-bottom: 8px;
    }
    
    .subtitle {
      color: #666;
      font-size: 16px;
      margin-bottom: 24px;
    }
  }

  .search-box {
    max-width: 800px;
    margin: 0 auto;
    display: flex;
    gap: 12px;
    align-items: center;
    background: white;
    padding: 20px;
    border-radius: 12px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);

    .search-input {
      flex: 1;

      :deep(.el-input__wrapper) {
        box-shadow: 0 0 0 1px #e5e7eb !important;
        border-radius: 8px;
        padding: 8px 16px;
        transition: all 0.3s;
        
        &:hover, &:focus {
          box-shadow: 0 0 0 1px var(--el-color-primary) !important;
        }
      }
    }

    .difficulty-select {
      width: 140px;

      :deep(.el-input__wrapper) {
        box-shadow: 0 0 0 1px #e5e7eb !important;
        border-radius: 8px;
        
        &:hover, &:focus {
          box-shadow: 0 0 0 1px var(--el-color-primary) !important;
        }
      }
    }

    .search-btn {
      height: 40px;
      padding: 0 24px;
      border-radius: 8px;
      font-weight: 500;
    }
  }

  .course-list {
    margin-bottom: 40px;
  }

  .course-card {
    background: white;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
    transition: all 0.3s;
    margin-bottom: 24px;
    cursor: pointer;
    border: 1px solid #e5e7eb;
    
    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 24px rgba(0, 0, 0, 0.06);
    }
    
    .course-image {
      position: relative;
      height: 180px;
      
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      
      .course-level {
        position: absolute;
        top: 12px;
        right: 12px;
        padding: 4px 12px;
        border-radius: 20px;
        font-size: 12px;
        font-weight: 500;
        
        &.入门 {
          background: #e6f4ff;
          color: #1677ff;
        }
        
        &.进阶 {
          background: #fff3e6;
          color: #fa8c16;
        }
        
        &.高级 {
          background: #fff1f0;
          color: #f5222d;
        }
      }
    }
    
    .course-info {
      padding: 20px;
      
      h3 {
        font-size: 16px;
        font-weight: 600;
        color: #1a1a1a;
        margin-bottom: 8px;
        line-height: 1.4;
      }
      
      p {
        color: #666;
        font-size: 14px;
        line-height: 1.6;
        margin-bottom: 16px;
        height: 44px;
        overflow: hidden;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }
      
      .course-meta {
        display: flex;
        justify-content: space-between;
        color: #8c8c8c;
        font-size: 13px;
        
        span {
          display: flex;
          align-items: center;
          gap: 4px;
          
          .el-icon {
            font-size: 14px;
          }
        }
      }
    }
  }

  .pagination {
    display: flex;
    justify-content: center;
    margin-top: 20px;
  }
}

// 响应式设计
@media (max-width: 768px) {
  .courses-container {
    padding: 20px;
    
    .search-section {
      h1 {
        font-size: 24px;
      }
    }
    
    .search-box {
      flex-direction: column;
      gap: 12px;
      padding: 16px;

      .difficulty-select {
        width: 100%;
      }

      .search-btn {
        width: 100%;
      }
    }
  }
}
</style> 