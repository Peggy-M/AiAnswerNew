<template>
  <div class="admin-home">
    <el-menu
      :default-active="activeMenu"
      class="el-menu-vertical-demo"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b"
      router
    >
      <el-menu-item index="/admin/question-bank">
        <el-icon><Document /></el-icon>
        <span>题库管理</span>
      </el-menu-item>
      <el-menu-item index="/admin/ai-generate">
        <el-icon><Edit /></el-icon>
        <span>AI智能出题</span>
      </el-menu-item>
      <el-menu-item index="/admin/exam/manage">
        <el-icon><Document /></el-icon>
        <span>考试管理</span>
      </el-menu-item>
      <el-menu-item index="/admin/courses">
        <el-icon><Reading /></el-icon>
        <span>课程管理</span>
      </el-menu-item>
      <el-menu-item index="/">
        <el-icon><Document /></el-icon>
        <span>返回首页</span>
      </el-menu-item>
    </el-menu>

    <div class="main-content">
      <router-view />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { Document, Edit, Collection, Reading } from '@element-plus/icons-vue'

const route = useRoute()

// 计算当前激活的菜单项
const activeMenu = computed(() => route.path)
</script>

<style scoped lang="scss">
.admin-home {
  display: flex;
  height: calc(100vh - 60px); // 减去顶部导航栏的高度
  
  .el-menu-vertical-demo {
    width: 200px;
    height: 100%;
    border-right: solid 1px #e6e6e6;
  }
  
  .main-content {
    flex: 1;
    padding: 20px;
    overflow-y: auto;
    background: #f5f7fa;
  }
}

:deep(.el-menu-item) {
  .el-icon {
    margin-right: 8px;
  }
}
</style> 