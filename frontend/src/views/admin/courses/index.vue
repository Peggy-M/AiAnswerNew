<template>
  <div class="course-manage">
    <el-card>
      <template #header>
        <div class="card-header">
          <h3>课程管理</h3>
          <div class="header-actions">
            <el-button type="primary" @click="$router.push('/admin/courses/create')">
              创建课程
            </el-button>
          </div>
        </div>
      </template>

      <!-- 搜索栏 -->
      <div class="search-bar">
        <el-input
          v-model="searchKeyword"
          placeholder="搜索课程名称"
          style="width: 200px"
          clearable
        />
        <el-select v-model="levelFilter" placeholder="难度筛选" clearable>
          <el-option label="入门" value="beginner" />
          <el-option label="初级" value="elementary" />
          <el-option label="中级" value="intermediate" />
          <el-option label="高级" value="advanced" />
        </el-select>
      </div>

      <!-- 课程列表 -->
      <el-table :data="filteredCourses" style="width: 100%">
        <el-table-column prop="cover" label="封面" width="120">
          <template #default="{ row }">
            <el-image
              :src="row.cover"
              :preview-src-list="[row.cover]"
              fit="cover"
              style="width: 80px; height: 60px"
            />
          </template>
        </el-table-column>

        <el-table-column prop="title" label="课程名称" min-width="180" />
        
        <el-table-column prop="level" label="难度" width="100">
          <template #default="{ row }">
            <el-tag :type="getDifficultyType(row.level)">
              {{ getDifficultyLabel(row.level) }}
            </el-tag>
          </template>
        </el-table-column>
        
        <el-table-column prop="studentCount" label="学习人数" width="120" />
        
        <el-table-column prop="duration" label="课程时长" width="120">
          <template #default="{ row }">
            {{ row.duration }}分钟
          </template>
        </el-table-column>
        
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button 
              type="primary" 
              link
              @click="$router.push(`/admin/courses/edit/${row.id}`)"
            >
              编辑
            </el-button>
            <el-button 
              type="danger" 
              link
              @click="handleDelete(row)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useCourseStore } from '@/stores/course'

const courseStore = useCourseStore()

// 在组件挂载时加载课程数据
onMounted(() => {
  courseStore.loadCourses()
})

// 搜索和筛选
const searchKeyword = ref('')
const levelFilter = ref('')

// 过滤后的课程列表
const filteredCourses = computed(() => {
  return courseStore.courses.filter(course => {
    const matchKeyword = !searchKeyword.value || 
      course.title.toLowerCase().includes(searchKeyword.value.toLowerCase())
    const matchLevel = !levelFilter.value || course.level === levelFilter.value
    return matchKeyword && matchLevel
  })
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

// 获取难度标签类型
const getDifficultyType = (difficulty: string) => {
  const types: Record<string, '' | 'success' | 'warning' | 'danger'> = {
    beginner: '',
    elementary: 'success',
    intermediate: 'warning',
    advanced: 'danger'
  }
  return types[difficulty] || ''
}

// 删除课程
const handleDelete = (course: any) => {
  ElMessageBox.confirm(
    '确定要删除这门课程吗？',
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    courseStore.removeCourse(course.id)
    ElMessage.success('删除成功')
  })
}
</script>

<style scoped lang="scss">
.course-manage {
  padding: 20px;

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    
    h3 {
      margin: 0;
    }
  }

  .search-bar {
    margin-bottom: 20px;
    display: flex;
    gap: 15px;
  }
}
</style> 