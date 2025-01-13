<template>
  <div class="course-card">
    <div class="course-image">
      <img :src="course.cover" :alt="course.title">
      <div class="course-level">{{ course.level }}</div>
    </div>
    <div class="course-info">
      <h3>{{ course.title }}</h3>
      <p>{{ course.description }}</p>
      <div class="course-meta">
        <span>
          <el-icon><User /></el-icon>
          {{ course.studentCount }}人学习
        </span>
        <span>
          <el-icon><Timer /></el-icon>
          {{ course.duration }}分钟
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { User, Timer } from '@element-plus/icons-vue'
import type { Course } from '@/types/course'

defineProps<{
  course: Course
}>()
</script> 