<template>
  <div class="course-learn">
    <div class="course-header">
      <h2>{{ courseTitle }}</h2>
    </div>
    <div class="course-content">
      <!-- 课程视频播放器 -->
      <div class="video-player">
        <video-player v-if="currentSection" :src="currentSection.videoUrl" />
      </div>
      
      <!-- 课程大纲 -->
      <div class="course-outline">
        <el-tabs v-model="activeTab">
          <el-tab-pane label="课程大纲" name="outline">
            <el-tree
              :data="courseOutline"
              :props="defaultProps"
              @node-click="handleNodeClick"
            />
          </el-tab-pane>
          <el-tab-pane label="课程笔记" name="notes">
            课程笔记内容
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const courseId = route.params.id

const courseTitle = ref('课程标题')
const activeTab = ref('outline')
const currentSection = ref(null)

const courseOutline = ref([
  {
    label: '第1章 课程介绍',
    children: [
      { label: '1.1 课程概述', videoUrl: '' },
      { label: '1.2 环境准备', videoUrl: '' }
    ]
  },
  // ... 其他章节
])

const defaultProps = {
  children: 'children',
  label: 'label'
}

const handleNodeClick = (data: any) => {
  if (data.videoUrl !== undefined) {
    currentSection.value = data
  }
}

onMounted(async () => {
  // TODO: 加载课程信息
  console.log('加载课程:', courseId)
})
</script>

<style scoped lang="scss">
.course-learn {
  padding: 20px;
  
  .course-header {
    margin-bottom: 20px;
    padding-bottom: 20px;
    border-bottom: 1px solid #eee;
  }
  
  .course-content {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 20px;
    
    .video-player {
      background: #000;
      aspect-ratio: 16/9;
      border-radius: 4px;
    }
    
    .course-outline {
      background: #fff;
      padding: 20px;
      border-radius: 4px;
      box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
    }
  }
}
</style> 