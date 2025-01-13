<template>
  <div class="course-detail">
    <div class="course-header">
      <div class="course-info">
        <h1>{{ course.title }}</h1>
        <div class="meta">
          <span><el-icon><User /></el-icon>{{ course.studentCount }}人学习</span>
          <span><el-icon><Timer /></el-icon>总时长：{{ course.duration }}分钟</span>
          <span><el-icon><Trophy /></el-icon>难度：{{ course.level }}</span>
        </div>
      </div>
      <el-button type="primary" size="large" @click="startLearning">
        开始学习
      </el-button>
    </div>

    <!-- 课程章节列表 -->
    <div class="course-content">
      <el-tabs>
        <el-tab-pane label="课程章节">
          <div class="chapter-list">
            <div v-for="chapter in course.chapters" :key="chapter.id" class="chapter">
              <div class="chapter-title">
                <h3>{{ chapter.title }}</h3>
                <p>{{ chapter.description }}</p>
              </div>
              <div class="video-list">
                <div v-for="video in chapter.videos" :key="video.id" class="video-item">
                  <span class="video-title">
                    <el-icon><VideoPlay /></el-icon>
                    {{ video.title }}
                  </span>
                  <span class="video-duration">{{ video.duration }}分钟</span>
                </div>
              </div>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="课程介绍">
          <div class="course-description">
            {{ course.description }}
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { User, Timer, Trophy, VideoPlay } from '@element-plus/icons-vue'
import type { Course } from '@/types/course'

const route = useRoute()
const router = useRouter()
const courseId = route.params.id

// 这里应该调用API获取课程详情
const course = ref<Course>({
  id: Number(courseId),
  title: 'Python基础入门',
  description: '零基础学习Python编程...',
  cover: '/images/course1.jpg',
  level: '入门',
  studentCount: 1234,
  duration: 120,
  chapters: [
    {
      id: 1,
      title: '第一章：Python基础语法',
      description: '学习Python的基本语法和数据类型',
      videos: [
        {
          id: 1,
          title: '1.1 Python简介',
          duration: 10,
          url: ''
        },
        {
          id: 2,
          title: '1.2 变量和数据类型',
          duration: 15,
          url: ''
        }
      ]
    }
  ]
})

const startLearning = () => {
  router.push(`/courses/${courseId}/learn`)
}
</script>

<style scoped lang="scss">
.course-detail {
  padding: 20px;
  background: #f5f7fa;
  min-height: calc(100vh - 60px);

  .course-header {
    background: white;
    padding: 30px;
    border-radius: 8px;
    margin-bottom: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .course-info {
      h1 {
        font-size: 24px;
        margin-bottom: 15px;
      }

      .meta {
        display: flex;
        gap: 20px;
        color: #666;

        span {
          display: flex;
          align-items: center;
          gap: 5px;
        }
      }
    }
  }

  .course-content {
    background: white;
    padding: 20px;
    border-radius: 8px;

    .chapter {
      margin-bottom: 20px;

      .chapter-title {
        margin-bottom: 10px;

        h3 {
          font-size: 18px;
          margin-bottom: 5px;
        }

        p {
          color: #666;
          font-size: 14px;
        }
      }

      .video-list {
        .video-item {
          display: flex;
          justify-content: space-between;
          padding: 12px;
          border-radius: 4px;
          cursor: pointer;

          &:hover {
            background: #f5f7fa;
          }

          .video-title {
            display: flex;
            align-items: center;
            gap: 8px;
          }

          .video-duration {
            color: #999;
          }
        }
      }
    }

    .course-description {
      color: #666;
      line-height: 1.6;
    }
  }
}
</style> 