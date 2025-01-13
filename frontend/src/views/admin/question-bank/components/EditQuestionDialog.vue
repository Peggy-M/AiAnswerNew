<template>
  <el-dialog
    v-model="dialogVisible"
    :title="question ? '编辑题目' : '新增题目'"
    width="60%"
  >
    <el-form 
      v-if="question"
      ref="formRef"
      :model="form"
      label-width="100px"
    >
      <el-form-item label="题目类型">
        <el-select v-model="form.type" disabled style="width: 100%">
          <el-option label="单选题" value="single" />
          <el-option label="多选题" value="multiple" />
          <el-option label="判断题" value="judge" />
          <el-option label="编程题" value="coding" />
        </el-select>
      </el-form-item>

      <el-form-item label="难度等级">
        <el-select v-model="form.difficulty" style="width: 100%">
          <el-option label="入门" value="beginner" />
          <el-option label="初级" value="elementary" />
          <el-option label="中级" value="intermediate" />
          <el-option label="高级" value="advanced" />
        </el-select>
      </el-form-item>

      <el-form-item label="题目内容">
        <el-input
          v-model="form.title"
          type="textarea"
          :rows="3"
          placeholder="请输入题目内容"
        />
      </el-form-item>

      <!-- 选项（单选/多选题） -->
      <template v-if="['single', 'multiple'].includes(form.type)">
        <el-form-item 
          v-for="(option, index) in form.options" 
          :key="option.value"
          :label="`选项${option.value}`"
        >
          <el-input v-model="option.content" placeholder="请输入选项内容" />
        </el-form-item>
      </template>

      <el-form-item label="正确答案">
        <template v-if="form.type === 'single'">
          <el-select v-model="form.correctAnswer" style="width: 100%">
            <el-option
              v-for="option in form.options"
              :key="option.value"
              :label="option.value"
              :value="option.value"
            />
          </el-select>
        </template>

        <template v-else-if="form.type === 'multiple'">
          <el-select
            v-model="form.correctAnswer"
            multiple
            style="width: 100%"
          >
            <el-option
              v-for="option in form.options"
              :key="option.value"
              :label="option.value"
              :value="option.value"
            />
          </el-select>
        </template>

        <template v-else-if="form.type === 'judge'">
          <el-radio-group v-model="form.correctAnswer">
            <el-radio :label="true">正确</el-radio>
            <el-radio :label="false">错误</el-radio>
          </el-radio-group>
        </template>

        <template v-else>
          <el-input
            v-model="form.correctAnswer"
            type="textarea"
            :rows="4"
            placeholder="请输入参考答案代码"
          />
        </template>
      </el-form-item>

      <el-form-item label="题目解析">
        <el-input
          v-model="form.analysis"
          type="textarea"
          :rows="3"
          placeholder="请输入题目解析"
        />
      </el-form-item>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSave">
          保存
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import { ElMessage } from 'element-plus'
import type { Question } from '@/types/question'

const props = defineProps<{
  modelValue: boolean
  question?: Question
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'save', question: Question): void
}>()

const dialogVisible = ref(false)
const form = reactive<Question>({
  type: 'single',
  difficulty: 'intermediate',
  title: '',
  options: [],
  correctAnswer: '',
  analysis: ''
})

// 监听对话框显示状态
watch(() => props.modelValue, (val) => {
  dialogVisible.value = val
})

// 监听对话框关闭
watch(dialogVisible, (val) => {
  emit('update:modelValue', val)
})

// 监听题目数据
watch(() => props.question, (val) => {
  if (val) {
    Object.assign(form, val)
  }
}, { immediate: true })

// 保存题目
const handleSave = () => {
  if (!form.title.trim()) {
    ElMessage.warning('请输入题目内容')
    return
  }
  if (!form.correctAnswer) {
    ElMessage.warning('请设置正确答案')
    return
  }
  if (!form.analysis.trim()) {
    ElMessage.warning('请输入题目解析')
    return
  }

  emit('save', { ...form })
  dialogVisible.value = false
}
</script> 