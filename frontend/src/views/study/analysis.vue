<template>
  <div class="study-analysis">
    <el-row :gutter="20">
      <el-col :span="12">
        <el-card class="analysis-card">
          <template #header>
            <div class="card-header">
              <span>学习时长统计</span>
            </div>
          </template>
          <div class="chart-container">
            <!-- 这里可以放学习时长的图表 -->
            <div class="placeholder-chart">学习时长图表</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="analysis-card">
          <template #header>
            <div class="card-header">
              <span>知识点掌握情况</span>
            </div>
          </template>
          <div class="chart-container">
            <!-- 这里可以放知识点掌握的图表 -->
            <div class="placeholder-chart">知识点掌握图表</div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    
    <el-card class="analysis-card" style="margin-top: 20px;">
      <template #header>
        <div class="card-header">
          <span>AI学习建议</span>
        </div>
      </template>
      <div class="ai-suggestions">
        <p>根据你的学习情况，AI给出以下建议：</p>
        <ul>
          <li>建议加强对XXX知识点的复习</li>
          <li>可以尝试更多的实践练习</li>
          <li>建议增加每日学习时间</li>
        </ul>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped lang="scss">
.study-analysis {
  .analysis-card {
    margin-bottom: 20px;
    
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
    
    .ai-suggestions {
      p {
        margin-bottom: 10px;
      }
      
      ul {
        padding-left: 20px;
        
        li {
          margin-bottom: 5px;
          color: #666;
        }
      }
    }
  }
}
</style> 