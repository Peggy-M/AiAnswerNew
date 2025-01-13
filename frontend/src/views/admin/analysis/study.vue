<template>
  <div class="study-analysis">
    <!-- 数据概览 -->
    <el-row :gutter="20">
      <el-col :span="6">
        <el-card shadow="hover" class="data-card">
          <template #header>
            <div class="card-header">
              <span>总学习人数</span>
              <el-tag type="success">实时</el-tag>
            </div>
          </template>
          <div class="card-content">
            <div class="number">1,234</div>
            <div class="compare">
              较上月 <span class="up">+89</span>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="data-card">
          <template #header>
            <div class="card-header">
              <span>总学习时长</span>
              <el-tag type="warning">月度</el-tag>
            </div>
          </template>
          <div class="card-content">
            <div class="number">12,345h</div>
            <div class="compare">
              较上月 <span class="up">+1,234h</span>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="data-card">
          <template #header>
            <div class="card-header">
              <span>平均完课率</span>
              <el-tag type="info">月度</el-tag>
            </div>
          </template>
          <div class="card-content">
            <div class="number">85.6%</div>
            <div class="compare">
              较上月 <span class="down">-2.1%</span>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="data-card">
          <template #header>
            <div class="card-header">
              <span>平均学习时长</span>
              <el-tag type="info">月度</el-tag>
            </div>
          </template>
          <div class="card-content">
            <div class="number">10.5h</div>
            <div class="compare">
              较上月 <span class="up">+0.8h</span>
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
              <span>学习时长趋势</span>
              <el-radio-group v-model="timeRange" size="small">
                <el-radio-button label="week">周</el-radio-button>
                <el-radio-button label="month">月</el-radio-button>
                <el-radio-button label="year">年</el-radio-button>
              </el-radio-group>
            </div>
          </template>
          <div class="chart-container">
            <!-- 这里放学习时长趋势图表 -->
            <div class="placeholder-chart">学习时长趋势图表</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="chart-card">
          <template #header>
            <div class="card-header">
              <span>课程完成情况</span>
              <el-select v-model="courseType" size="small" style="width: 120px">
                <el-option label="所有课程" value="all" />
                <el-option label="必修课程" value="required" />
                <el-option label="选修课程" value="optional" />
              </el-select>
            </div>
          </template>
          <div class="chart-container">
            <!-- 这里放课程完成情况图表 -->
            <div class="placeholder-chart">课程完成情况图表</div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 详细数据 -->
    <el-card style="margin-top: 20px">
      <template #header>
        <div class="card-header">
          <span>课程学习详情</span>
          <div class="header-actions">
            <el-input
              v-model="searchKeyword"
              placeholder="搜索课程"
              style="width: 200px"
            />
            <el-button type="primary" @click="handleExport">导出数据</el-button>
          </div>
        </div>
      </template>
      
      <el-table :data="courseList" v-loading="loading" style="width: 100%">
        <el-table-column prop="name" label="课程名称" />
        <el-table-column prop="studentCount" label="学习人数" width="120" align="center" />
        <el-table-column prop="avgDuration" label="平均学习时长" width="120" align="center" />
        <el-table-column prop="completionRate" label="完课率" width="120" align="center">
          <template #default="{ row }">
            <el-progress
              :percentage="row.completionRate"
              :status="getProgressStatus(row.completionRate)"
            />
          </template>
        </el-table-column>
        <el-table-column prop="avgScore" label="平均分" width="100" align="center" />
        <el-table-column label="操作" width="100" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link @click="handleDetail(row)">详情</el-button>
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

// 时间范围选择
const timeRange = ref('month')

// 课程类型选择
const courseType = ref('all')

// 搜索关键词
const searchKeyword = ref('')

// 表格数据
const loading = ref(false)
const courseList = ref([
  {
    id: 1,
    name: '示例课程1',
    studentCount: 123,
    avgDuration: '10.5h',
    completionRate: 85,
    avgScore: 88
  },
  {
    id: 2,
    name: '示例课程2',
    studentCount: 89,
    avgDuration: '8.2h',
    completionRate: 92,
    avgScore: 90
  }
])

// 分页
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(100)

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
.study-analysis {
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