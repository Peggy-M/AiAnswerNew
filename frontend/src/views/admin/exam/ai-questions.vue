<template>
  <div class="ai-questions">
    <!-- AI出题配置 -->
    <el-card class="config-card">
      <template #header>
        <div class="card-header">
          <span>AI出题配置</span>
        </div>
      </template>
      
      <el-form :model="configForm" label-width="100px">
        <el-form-item label="题目类型">
          <el-checkbox-group v-model="configForm.types">
            <el-checkbox label="single">单选题</el-checkbox>
            <el-checkbox label="multiple">多选题</el-checkbox>
            <el-checkbox label="judge">判断题</el-checkbox>
            <el-checkbox label="essay">简答题</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        
        <el-form-item label="题目数量">
          <el-input-number 
            v-model="configForm.count" 
            :min="1" 
            :max="50"
            placeholder="请输入题目数量"
          />
        </el-form-item>
        
        <el-form-item label="难度分布">
          <div class="difficulty-sliders">
            <div class="slider-item">
              <span>简单：{{ configForm.difficulty.easy }}%</span>
              <el-slider
                v-model="configForm.difficulty.easy"
                :max="100"
                @change="handleDifficultyChange('easy')"
              />
            </div>
            <div class="slider-item">
              <span>中等：{{ configForm.difficulty.medium }}%</span>
              <el-slider
                v-model="configForm.difficulty.medium"
                :max="100"
                @change="handleDifficultyChange('medium')"
              />
            </div>
            <div class="slider-item">
              <span>困难：{{ configForm.difficulty.hard }}%</span>
              <el-slider
                v-model="configForm.difficulty.hard"
                :max="100"
                @change="handleDifficultyChange('hard')"
              />
            </div>
          </div>
        </el-form-item>
        
        <el-form-item label="知识点">
          <el-select
            v-model="configForm.topics"
            multiple
            filterable
            allow-create
            default-first-option
            placeholder="请选择或输入知识点"
          >
            <el-option
              v-for="item in topicOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        
        <el-form-item label="其他要求">
          <el-input
            v-model="configForm.requirements"
            type="textarea"
            rows="3"
            placeholder="请输入其他具体要求"
          />
        </el-form-item>
        
        <el-form-item>
          <el-button type="primary" @click="handleGenerate" :loading="generating">
            {{ generating ? '生成中...' : '开始生成' }}
          </el-button>
          <el-button @click="resetConfig">重置配置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 生成结果 -->
    <el-card v-if="generatedQuestions.length" class="result-card">
      <template #header>
        <div class="card-header">
          <span>生成结果</span>
          <div class="header-actions">
            <el-button type="primary" @click="handleSaveAll">保存全部</el-button>
            <el-button @click="handleRegenerate">重新生成</el-button>
          </div>
        </div>
      </template>
      
      <div class="question-list">
        <div 
          v-for="(question, index) in generatedQuestions" 
          :key="index"
          class="question-item"
        >
          <div class="question-header">
            <div class="question-info">
              <el-tag :type="getTypeTag(question.type)" class="type-tag">
                {{ getTypeLabel(question.type) }}
              </el-tag>
              <el-tag :type="getDifficultyTag(question.difficulty)">
                {{ getDifficultyLabel(question.difficulty) }}
              </el-tag>
            </div>
            <div class="question-actions">
              <el-button type="primary" link @click="handleEdit(index)">编辑</el-button>
              <el-button type="success" link @click="handleSave(index)">保存</el-button>
              <el-button type="danger" link @click="handleRemove(index)">移除</el-button>
            </div>
          </div>
          
          <div class="question-content">
            <div class="question-title">{{ question.title }}</div>
            
            <!-- 选项 -->
            <div v-if="['single', 'multiple'].includes(question.type)" class="options">
              <div 
                v-for="(option, optIndex) in question.options" 
                :key="optIndex"
                class="option-item"
              >
                <span class="option-label">{{ String.fromCharCode(65 + optIndex) }}.</span>
                <span>{{ option.content }}</span>
                <el-tag 
                  v-if="option.isCorrect"
                  type="success"
                  size="small"
                >
                  正确答案
                </el-tag>
              </div>
            </div>
            
            <!-- 判断题答案 -->
            <div v-if="question.type === 'judge'" class="judge-answer">
              <span>正确答案：</span>
              <el-tag type="success">
                {{ question.correctAnswer === 'true' ? '正确' : '错误' }}
              </el-tag>
            </div>
            
            <!-- 简答题答案 -->
            <div v-if="question.type === 'essay'" class="essay-answer">
              <div class="answer-label">参考答案：</div>
              <div class="answer-content">{{ question.correctAnswer }}</div>
            </div>
            
            <!-- 解析 -->
            <div class="analysis">
              <div class="analysis-label">答案解析：</div>
              <div class="analysis-content">{{ question.analysis }}</div>
            </div>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'

// AI配置表单
const configForm = reactive({
  types: ['single'],
  count: 10,
  difficulty: {
    easy: 30,
    medium: 40,
    hard: 30
  },
  topics: [] as string[],
  requirements: ''
})

// 知识点选项
const topicOptions = ref([
  { value: 'vue', label: 'Vue.js' },
  { value: 'react', label: 'React' },
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' }
])

// 生成状态
const generating = ref(false)
const generatedQuestions = ref<any[]>([])

// 处理难度分布变化
const handleDifficultyChange = (type: string) => {
  const total = Object.values(configForm.difficulty).reduce((a, b) => a + b, 0)
  if (total > 100) {
    const diff = total - 100
    const others = ['easy', 'medium', 'hard'].filter(t => t !== type)
    const reduce = diff / others.length
    others.forEach(t => {
      configForm.difficulty[t as keyof typeof configForm.difficulty] = Math.max(
        0,
        configForm.difficulty[t as keyof typeof configForm.difficulty] - reduce
      )
    })
  }
}

// 重置配置
const resetConfig = () => {
  configForm.types = ['single']
  configForm.count = 10
  configForm.difficulty = {
    easy: 30,
    medium: 40,
    hard: 30
  }
  configForm.topics = []
  configForm.requirements = ''
}

// 开始生成
const handleGenerate = async () => {
  if (!configForm.types.length) {
    ElMessage.warning('请至少选择一种题目类型')
    return
  }
  
  if (configForm.count < 1) {
    ElMessage.warning('题目数量必须大于0')
    return
  }
  
  generating.value = true
  try {
    // TODO: 调用AI生成接口
    await new Promise(resolve => setTimeout(resolve, 2000)) // 模拟请求
    generatedQuestions.value = [
      {
        type: 'single',
        title: '示例单选题',
        difficulty: 'easy',
        options: [
          { content: '选项A', isCorrect: false },
          { content: '选项B', isCorrect: true },
          { content: '选项C', isCorrect: false }
        ],
        correctAnswer: 'B',
        analysis: '答案解析示例'
      },
      {
        type: 'multiple',
        title: '示例多选题',
        difficulty: 'medium',
        options: [
          { content: '选项A', isCorrect: true },
          { content: '选项B', isCorrect: true },
          { content: '选项C', isCorrect: false }
        ],
        analysis: '答案解析示例'
      }
    ]
    ElMessage.success('生成成功')
  } catch (error) {
    ElMessage.error('生成失败')
  } finally {
    generating.value = false
  }
}

// 重新生成
const handleRegenerate = () => {
  generatedQuestions.value = []
  handleGenerate()
}

// 编辑题目
const handleEdit = (index: number) => {
  console.log('编辑题目:', generatedQuestions.value[index])
  // TODO: 实现编辑逻辑
}

// 保存题目
const handleSave = (index: number) => {
  console.log('保存题目:', generatedQuestions.value[index])
  ElMessage.success('保存成功')
  // TODO: 实现保存逻辑
}

// 移除题目
const handleRemove = (index: number) => {
  generatedQuestions.value.splice(index, 1)
  ElMessage.success('已移除')
}

// 保存全部
const handleSaveAll = async () => {
  try {
    console.log('保存全部题目:', generatedQuestions.value)
    // TODO: 实现批量保存逻辑
    ElMessage.success('保存成功')
  } catch (error) {
    ElMessage.error('保存失败')
  }
}

// 获取题目类型标签
const getTypeTag = (type: string) => {
  const types: Record<string, string> = {
    single: '',
    multiple: 'success',
    judge: 'warning',
    essay: 'info'
  }
  return types[type] || ''
}

const getTypeLabel = (type: string) => {
  const types: Record<string, string> = {
    single: '单选题',
    multiple: '多选题',
    judge: '判断题',
    essay: '简答题'
  }
  return types[type] || type
}

// 获取难度标签
const getDifficultyTag = (difficulty: string) => {
  const types: Record<string, string> = {
    easy: 'success',
    medium: 'warning',
    hard: 'danger'
  }
  return types[difficulty] || ''
}

const getDifficultyLabel = (difficulty: string) => {
  const types: Record<string, string> = {
    easy: '简单',
    medium: '中等',
    hard: '困难'
  }
  return types[difficulty] || difficulty
}
</script>

<style scoped lang="scss">
.ai-questions {
  .config-card {
    margin-bottom: 20px;
    
    .difficulty-sliders {
      .slider-item {
        margin-bottom: 20px;
        
        &:last-child {
          margin-bottom: 0;
        }
      }
    }
  }
  
  .result-card {
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      
      .header-actions {
        display: flex;
        gap: 10px;
      }
    }
    
    .question-list {
      .question-item {
        padding: 20px;
        border: 1px solid #eee;
        border-radius: 4px;
        margin-bottom: 20px;
        
        &:last-child {
          margin-bottom: 0;
        }
        
        .question-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 15px;
          
          .question-info {
            display: flex;
            gap: 10px;
          }
        }
        
        .question-content {
          .question-title {
            font-size: 16px;
            margin-bottom: 15px;
          }
          
          .options {
            .option-item {
              margin-bottom: 10px;
              
              .option-label {
                margin-right: 10px;
                font-weight: bold;
              }
              
              .el-tag {
                margin-left: 10px;
              }
            }
          }
          
          .judge-answer,
          .essay-answer {
            margin-top: 15px;
          }
          
          .analysis {
            margin-top: 15px;
            padding-top: 15px;
            border-top: 1px dashed #eee;
            
            .analysis-label {
              font-weight: bold;
              margin-bottom: 10px;
            }
          }
        }
      }
    }
  }
}
</style> 