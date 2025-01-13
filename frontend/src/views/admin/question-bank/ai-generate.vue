<template>
  <div class="ai-generate">
    <el-card class="generate-form">
      <template #header>
        <div class="card-header">
          <h3>AI智能出题</h3>
        </div>
      </template>
      
      <el-form :model="generateForm" label-width="100px">
        <el-form-item label="课程分类">
          <el-cascader
            v-model="generateForm.category"
            :options="categoryOptions"
            :props="{
              multiple: true,
              checkStrictly: true,
              emitPath: true,
              expandTrigger: 'hover'
            }"
            clearable
            collapse-tags
            collapse-tags-tooltip
            placeholder="请选择课程分类（可多选）"
            style="width: 100%"
          />
        </el-form-item>
        
        <el-form-item label="题目类型">
          <el-select 
            v-model="generateForm.types" 
            multiple
            placeholder="请选择题目类型"
            style="width: 100%"
          >
            <el-option label="单选题" value="single" />
            <el-option label="多选题" value="multiple" />
            <el-option label="判断题" value="judge" />
            <el-option label="编程题" value="coding" />
          </el-select>
        </el-form-item>
        
        <el-form-item label="难度等级">
          <el-select 
            v-model="generateForm.difficulties" 
            multiple
            placeholder="请选择难度"
            style="width: 100%"
          >
            <el-option label="入门" value="beginner" />
            <el-option label="初级" value="elementary" />
            <el-option label="中级" value="intermediate" />
            <el-option label="高级" value="advanced" />
          </el-select>
        </el-form-item>
        
        <el-form-item label="知识点">
          <el-input
            v-model="generateForm.keywords"
            type="textarea"
            :rows="3"
            placeholder="请输入知识点关键词，多个关键词用逗号分隔"
          />
        </el-form-item>
        
        <el-form-item label="生成数量">
          <el-input-number 
            v-model="generateForm.count" 
            :min="1" 
            :max="10"
          />
        </el-form-item>
        
        <el-form-item>
          <el-button 
            type="primary" 
            :loading="generating"
            @click="handleGenerate"
          >
            开始生成
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 生成结果预览 -->
    <el-card v-if="generatedQuestions.length > 0" class="preview-card">
      <template #header>
        <div class="card-header">
          <h3>生成结果预览</h3>
          <el-button type="primary" @click="saveToQuestionBank">
            保存到题库
          </el-button>
        </div>
      </template>
      
      <div class="question-list">
        <div 
          v-for="(question, index) in generatedQuestions" 
          :key="index"
          class="question-item"
        >
          <div class="question-header">
            <span class="question-type">
              {{ getQuestionTypeLabel(question.type) }}
            </span>
            <span class="question-difficulty">
              {{ getDifficultyLabel(question.difficulty) }}
            </span>
          </div>
          
          <div class="question-content">
            <h4>{{ index + 1 }}. {{ question.title }}</h4>
            
            <!-- 选项（单选/多选题） -->
            <template v-if="['single', 'multiple'].includes(question.type)">
              <div 
                v-for="option in question.options" 
                :key="option.value"
                class="option-item"
              >
                {{ option.value }}. {{ option.content }}
              </div>
            </template>
            
            <!-- 答案和解析 -->
            <div class="answer-section">
              <p class="correct-answer">
                <strong>正确答案：</strong>
                {{ formatAnswer(question) }}
              </p>
              <p class="analysis">
                <strong>解析：</strong>
                {{ question.analysis }}
              </p>
            </div>
          </div>
          
          <div class="question-actions">
            <el-button 
              type="danger" 
              link
              @click="removeQuestion(index)"
            >
              删除
            </el-button>
            <el-button 
              type="primary" 
              link
              @click="regenerateQuestion(index)"
            >
              重新生成
            </el-button>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import type { Question } from '@/types/question'
import { useQuestionStore } from '@/stores/question'

const generating = ref(false)
const generatedQuestions = ref<Question[]>([])
const questionStore = useQuestionStore()

// 添加分类选项数据
const categoryOptions = ref([
  {
    value: 'frontend',
    label: '前端开发',
    children: [
      {
        value: 'html',
        label: 'HTML/CSS'
      },
      {
        value: 'javascript',
        label: 'JavaScript'
      },
      {
        value: 'framework',
        label: '前端框架',
        children: [
          {
            value: 'vue',
            label: 'Vue.js'
          },
          {
            value: 'react',
            label: 'React'
          }
        ]
      }
    ]
  },
  {
    value: 'backend',
    label: '后端开发',
    children: [
      {
        value: 'java',
        label: 'Java'
      },
      {
        value: 'python',
        label: 'Python'
      },
      {
        value: 'nodejs',
        label: 'Node.js'
      }
    ]
  }
])

interface GenerateForm {
  category: string[][]
  types: string[]
  difficulties: string[]
  keywords: string
  count: number
}

const generateForm = reactive<GenerateForm>({
  category: [],
  types: [],
  difficulties: [],
  keywords: '',
  count: 1
})

// AI生成题目
const handleGenerate = async () => {
  if (!validateForm()) return
  
  generating.value = true
  try {
    // 调用AI接口生成题目
    const response = await generateQuestions(generateForm)
    generatedQuestions.value = response
    ElMessage.success('题目生成成功！')
  } catch (error) {
    ElMessage.error('生成题目失败，请重试')
  } finally {
    generating.value = false
  }
}

// 表单验证
const validateForm = () => {
  if (generateForm.types.length === 0) {
    ElMessage.warning('请选择题目类型')
    return false
  }
  if (generateForm.difficulties.length === 0) {
    ElMessage.warning('请选择难度等级')
    return false
  }
  if (!generateForm.keywords.trim()) {
    ElMessage.warning('请输入知识点关键词')
    return false
  }
  return true
}

// 调用AI接口生成题目
const generateQuestions = async (params: any) => {
  // TODO: 实现与AI接口的对接
  // 这里是模拟数据
  const questions: Question[] = []
  const topics = params.keywords.split(',').map((k: string) => k.trim())
  
  for (let i = 0; i < params.count; i++) {
    const type = params.types[Math.floor(Math.random() * params.types.length)]
    const difficulty = params.difficulties[Math.floor(Math.random() * params.difficulties.length)]
    const topic = topics[Math.floor(Math.random() * topics.length)]
    
    let question: Question = {
      type,
      difficulty,
      title: '',
      analysis: '',
      correctAnswer: ''
    }
    
    switch (type) {
      case 'single':
      case 'multiple':
        question.title = `关于${topic}的以下说法，${type === 'single' ? '哪项是正确的' : '哪些是正确的'}？`
        question.options = [
          { value: 'A', content: `这是关于${topic}的选项A` },
          { value: 'B', content: `这是关于${topic}的选项B` },
          { value: 'C', content: `这是关于${topic}的选项C` },
          { value: 'D', content: `这是关于${topic}的选项D` }
        ]
        question.correctAnswer = type === 'single' ? 'A' : ['A', 'B']
        question.analysis = `这道题主要考察${topic}的基本概念和应用。正确答案是${question.correctAnswer}，因为...`
        break
        
      case 'judge':
        question.title = `判断：关于${topic}，以下说法是否正确？`
        question.correctAnswer = Math.random() > 0.5
        question.analysis = `这道判断题考察${topic}的概念理解。答案是${question.correctAnswer ? '正确' : '错误'}，因为...`
        break
        
      case 'coding':
        question.title = `请实现一个关于${topic}的功能：`
        question.correctAnswer = `// 这是${topic}的参考答案代码\nfunction example() {\n  // 具体实现\n}`
        question.analysis = `这道编程题主要考察${topic}的实际应用能力。解题思路如下：\n1. 首先...\n2. 然后...\n3. 最后...`
        break
    }
    
    questions.push(question)
  }
  
  return questions
}

// 保存到题库
const saveToQuestionBank = async () => {
  try {
    console.log('Saving questions:', generatedQuestions.value)
    questionStore.addQuestions(generatedQuestions.value)
    console.log('Store questions after save:', questionStore.questions)
    ElMessage.success('保存成功！')
    generatedQuestions.value = []
  } catch (error) {
    console.error('Save error:', error)
    ElMessage.error('保存失败，请重试')
  }
}

// 删除题目
const removeQuestion = (index: number) => {
  generatedQuestions.value.splice(index, 1)
}

// 重新生成单个题目
const regenerateQuestion = async (index: number) => {
  // TODO: 实现重新生成单个题目的逻辑
}

// 获取题目类型标签
const getQuestionTypeLabel = (type: string) => {
  const labels: Record<string, string> = {
    single: '单选题',
    multiple: '多选题',
    judge: '判断题',
    coding: '编程题'
  }
  return labels[type] || type
}

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

// 格式化答案显示
const formatAnswer = (question: Question) => {
  if (question.type === 'judge') {
    return question.correctAnswer ? '正确' : '错误'
  }
  return question.correctAnswer
}
</script>

<style scoped lang="scss">
.ai-generate {
  padding: 20px;
  
  .generate-form {
    margin-bottom: 20px;
  }
  
  .preview-card {
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      
      h3 {
        margin: 0;
      }
    }
    
    .question-list {
      .question-item {
        margin-bottom: 20px;
        padding: 20px;
        border: 1px solid #eee;
        border-radius: 4px;
        
        &:last-child {
          margin-bottom: 0;
        }
        
        .question-header {
          display: flex;
          gap: 10px;
          margin-bottom: 10px;
          
          .question-type,
          .question-difficulty {
            padding: 2px 8px;
            border-radius: 4px;
            font-size: 12px;
            background: #f5f7fa;
          }
        }
        
        .question-content {
          h4 {
            margin: 0 0 10px 0;
          }
          
          .option-item {
            margin-bottom: 8px;
          }
          
          .answer-section {
            margin-top: 15px;
            padding-top: 15px;
            border-top: 1px dashed #eee;
            
            p {
              margin: 5px 0;
            }
          }
        }
        
        .question-actions {
          margin-top: 15px;
          display: flex;
          justify-content: flex-end;
          gap: 10px;
        }
      }
    }
  }
  
  :deep(.el-cascader) {
    .el-input__wrapper {
      padding: 0 12px;
    }
    
    .el-cascader__tags {
      padding: 6px 0;
    }
  }
}
</style> 