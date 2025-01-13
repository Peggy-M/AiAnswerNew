<template>
  <div class="course-edit">
    <el-card>
      <template #header>
        <div class="card-header">
          <h3>{{ isEdit ? '编辑课程' : '创建课程' }}</h3>
        </div>
      </template>

      <el-form :model="courseForm" label-width="100px">
        <el-form-item label="课程名称">
          <el-input v-model="courseForm.title" placeholder="请输入课程名称" />
        </el-form-item>

        <el-form-item label="课程封面">
          <el-upload
            class="cover-uploader"
            action="/api/upload"
            :show-file-list="false"
            :on-success="handleCoverSuccess"
          >
            <img v-if="courseForm.cover" :src="courseForm.cover" class="cover" />
            <el-icon v-else class="upload-icon"><Plus /></el-icon>
          </el-upload>
        </el-form-item>

        <el-form-item label="课程难度">
          <el-select v-model="courseForm.level" placeholder="请选择难度">
            <el-option label="入门" value="beginner" />
            <el-option label="初级" value="elementary" />
            <el-option label="中级" value="intermediate" />
            <el-option label="高级" value="advanced" />
          </el-select>
        </el-form-item>

        <el-form-item label="课程时长">
          <el-input-number 
            v-model="courseForm.duration" 
            :min="1"
            :step="10"
          />
          <span class="unit">分钟</span>
        </el-form-item>

        <el-form-item label="课程简介">
          <el-input
            v-model="courseForm.description"
            type="textarea"
            :rows="4"
            placeholder="请输入课程简介"
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleSave">保存</el-button>
          <el-button @click="$router.back()">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { useCourseStore } from '@/stores/course'
import type { Course } from '@/types/course'

const route = useRoute()
const router = useRouter()
const courseStore = useCourseStore()

const isEdit = computed(() => route.params.id !== undefined)

const courseForm = ref<Partial<Course>>({
  title: '',
  cover: '',
  level: '',
  duration: 60,
  description: ''
})

// 如果是编辑模式，加载课程数据
onMounted(() => {
  if (isEdit.value && route.params.id) {
    const course = courseStore.getCourseById(Number(route.params.id))
    if (course) {
      courseForm.value = { ...course }
    }
  }
})

// 处理封面上传成功
const handleCoverSuccess = (response: any) => {
  courseForm.value.cover = response.url
}

// 保存课程
const handleSave = () => {
  if (isEdit.value) {
    courseStore.updateCourse(Number(route.params.id), courseForm.value)
  } else {
    courseStore.addCourse(courseForm.value)
  }
  ElMessage.success(`${isEdit.value ? '更新' : '创建'}成功`)
  router.push('/admin/courses')
}
</script>

<style scoped lang="scss">
.course-edit {
  padding: 20px;

  .cover-uploader {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    width: 178px;
    height: 178px;
    display: flex;
    justify-content: center;
    align-items: center;
    
    &:hover {
      border-color: var(--el-color-primary);
    }
    
    .cover {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    
    .upload-icon {
      font-size: 28px;
      color: #8c939d;
    }
  }

  .unit {
    margin-left: 10px;
    color: #666;
  }
}
</style> 