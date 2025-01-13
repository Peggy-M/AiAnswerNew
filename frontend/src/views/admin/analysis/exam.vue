<template>
  <div class="exam-analysis">
    <!-- 数据概览 -->
    <el-row :gutter="20">
      <el-col :span="6">
        <el-card shadow="hover" class="data-card">
          <template #header>
            <div class="card-header">
              <span>考试总数</span>
              <el-tag type="success">实时</el-tag>
            </div>
          </template>
          <div class="card-content">
            <div class="number">156</div>
            <div class="compare">
              较上月 <span class="up">+12</span>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="data-card">
          <template #header>
            <div class="card-header">
              <span>参考人次</span>
              <el-tag type="warning">月度</el-tag>
            </div>
          </template>
          <div class="card-content">
            <div class="number">2,345</div>
            <div class="compare">
              较上月 <span class="up">+234</span>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="data-card">
          <template #header>
            <div class="card-header">
              <span>平均分</span>
              <el-tag type="info">月度</el-tag>
            </div>
          </template>
          <div class="card-content">
            <div class="number">78.5</div>
            <div class="compare">
              较上月 <span class="up">+2.1</span>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="data-card">
          <template #header>
            <div class="card-header">
              <span>及格率</span>
              <el-tag type="info">月度</el-tag>
            </div>
          </template>
          <div class="card-content">
            <div class="number">85.6%</div>
            <div class="compare">
              较上月 <span class="down">-1.2%</span>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 图表分析 -->
    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :span="12">
        <el-card class="chart-card">
          <template #header>
            <div class="card-header">
              <span>成绩分布</span>
              <el-select v-model="selectedExam" size="small" style="width: 200px">
                <el-option
                  v-for="exam in examOptions"
                  :key="exam.value"
                  :label="exam.label"
                  :value="exam.value"
                />
              </el-select>
            </div>
          </template>
          <div class="chart-container">
            <!-- 这里放成绩分布图表 -->
            <div class="placeholder-chart">成绩分布图表</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="chart-card">
          <template #header>
            <div class="card-header">
              <span>题目正确率分析</span>
              <el-radio-group v-model="questionType" size="small">
                <el-radio-button label="all">全部</el-radio-button>
                <el-radio-button label="single">单选题</el-radio-button>
                <el-radio-button label="multiple">多选题</el-radio-button>
                <el-radio-button label="judge">判断题</el-radio-button>
              </el-radio-group>
            </div>
          </template>
          <div class="chart-container">
            <!-- 这里放题目正确率分析图表 -->
            <div class="placeholder-chart">题目正确率分析图表</div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 考试详情 -->
    <el-card style="margin-top: 20px">
      <template #header>
        <div class="card-header">
          <span>考试详情</span>
          <div class="header-actions">
            <el-input
              v-model="searchKeyword"
              placeholder="搜索考试"
              style="width: 200px"
            />
            <el-button type="primary" @click="handleExport">导出数据</el-button>
          </div>
        </div>
      </template>
      
      <el-table :data="examList" v-loading="loading" style="width: 100%">
        <el-table-column prop="name" label="考试名称" />
        <el-table-column prop="type" label="考试类型" width="100">
          <template #default="{ row }">
            <el-tag :type="getTypeTag(row.type)">{{ getTypeLabel(row.type) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="studentCount" label="参考人数" width="100" align="center" />
        <el-table-column prop="avgScore" label="平均分" width="100" align="center" />
        <el-table-column prop="passRate" label="及格率" width="120" align="center">
          <template #default="{ row }">
            <el-progress
              :percentage="row.passRate"
              :status="getProgressStatus(row.passRate)"
            />
          </template>
        </el-table-column>
        <el-table-column prop="maxScore" label="最高分" width="100" align="center" />
        <el-table-column prop="minScore" label="最低分" width="100" align="center" />
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link @click="handleDetail(row)">详情</el-button>
            <el-button type="success" link @click="handleAnalysis(row)">试题分析</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :total="total"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

// 考试选择
const selectedExam = ref('')
const examOptions = ref([
  { value: '1', label: '2024年第一次月考' },
  { value: '2', label: '2024年期中考试' }
])

// 题目类型
const questionType = ref('all')

// 搜索关键词
const searchKeyword = ref('')

// 表格数据
const loading = ref(false)
const examList = ref([
  {
    id: 1,
    name: '2024年第一次月考',
    type: 'formal',
    studentCount: 120,
    avgScore: 78.5,
    passRate: 85.6,
    maxScore: 98,
    minScore: 45
  },
  {
    id: 2,
    name: '模拟考试',
    type: 'mock',
    studentCount: 98,
    avgScore: 82.3,
    passRate: 92.1,
    maxScore: 100,
    minScore: 55
  }
])

// 分页
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(100)

// 获取考试类型标签
const getTypeTag = (type: string) => {
  const types: Record<string, string> = {
    formal: 'danger',
    mock: 'warning',
    practice: 'info'
  }
  return types[type] || ''
}

const getTypeLabel = (type: string) => {
  const types: Record<string, string> = {
    formal: '正式考试',
    mock: '模拟考试',
    practice: '练习测试'
  }
  return types[type] || type
}

// 获取进度条状态
const getProgressStatus = (rate: number) => {
  if (rate >= 90) return 'success'
  if (rate >= 60) return ''
  return 'exception'
}

// 导出数据
const handleExport = () => {
  ElMessage.success('导出成功')
  // TODO: 实现导出逻辑
}

// 查看详情
const handleDetail = (row: any) => {
  console.log('查看详情:', row)
  // TODO: 实现查看详情逻辑
}

// 试题分析
const handleAnalysis = (row: any) => {
  console.log('试题分析:', row)
  // TODO: 实现试题分析逻辑
}

// 处理分页大小改变
const handleSizeChange = (val: number) => {
  pageSize.value = val
  // TODO: 重新加载数据
}

// 处理页码改变
const handleCurrentChange = (val: number) => {
  currentPage.value = val
  // TODO: 重新加载数据
}
</script>

<style scoped lang="scss">
.exam-analysis {
  .data-card {
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .card-content {
      .number {
        font-size: 24px;
        font-weight: bold;
        margin: 10px 0;
      }
      
      .compare {
        color: #666;
        font-size: 14px;
        
        .up {
          color: #67c23a;
        }
        
        .down {
          color: #f56c6c;
        }
      }
    }
  }
  
  .chart-card {
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .chart-container {
      height: 300px;
      
      .placeholder-chart {
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #f5f7fa;
        color: #909399;
      }
    }
  }
  
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    
    .header-actions {
      display: flex;
      gap: 10px;
    }
  }
  
  .pagination-container {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
  }
}
</style> 