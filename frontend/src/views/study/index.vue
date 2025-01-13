<template>
  <div class="study-container">
    <!-- 搜索区域 -->
    <div class="search-section">
      <div class="search-box">
        <el-input
          v-model="searchQuery"
          placeholder="搜索课程..."
          class="search-input"
          prefix-icon="Search"
          clearable
        />
        <el-select
          v-model="difficultyLevel"
          placeholder="难度等级"
          class="difficulty-select"
          clearable
        >
          <el-option label="初级" value="beginner" />
          <el-option label="中级" value="intermediate" />
          <el-option label="高级" value="advanced" />
        </el-select>
        <el-button type="primary" class="search-btn">
          <el-icon><Search /></el-icon>
          搜索
        </el-button>
      </div>
    </div>

    <!-- 其他内容... -->
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Search } from '@element-plus/icons-vue'

const searchQuery = ref('')
const difficultyLevel = ref('')
</script>

<style scoped lang="scss">
.study-container {
  .search-section {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    padding: 40px 0;
    margin-bottom: 30px;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  .search-box {
    max-width: 800px;
    margin: 0 auto;
    padding: 0 20px;
    display: flex;
    gap: 12px;
    align-items: center;

    .search-input {
      flex: 1;

      :deep(.el-input__wrapper) {
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        border-radius: 8px;
        padding: 8px 16px;
        background: rgba(255, 255, 255, 0.95);
        
        &:hover, &:focus {
          background: #fff;
        }
      }

      :deep(.el-input__inner) {
        height: 40px;
        font-size: 15px;
      }
    }

    .difficulty-select {
      width: 140px;

      :deep(.el-input__wrapper) {
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        border-radius: 8px;
        padding: 8px 16px;
        background: rgba(255, 255, 255, 0.95);
        
        &:hover, &:focus {
          background: #fff;
        }
      }

      :deep(.el-input__inner) {
        height: 40px;
        font-size: 15px;
      }
    }

    .search-btn {
      height: 40px;
      padding: 0 24px;
      border-radius: 8px;
      font-size: 15px;
      display: flex;
      align-items: center;
      gap: 6px;
      background: #fff;
      color: #764ba2;
      border: none;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      transition: all 0.3s;

      &:hover {
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        background: #f8f9fa;
      }

      .el-icon {
        font-size: 18px;
      }
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .study-container {
    .search-box {
      flex-direction: column;
      gap: 16px;

      .difficulty-select {
        width: 100%;
      }

      .search-btn {
        width: 100%;
      }
    }
  }
}
</style> 