<template>
  <div class="admin-layout">
    <el-container>
      <el-aside width="200px" class="aside">
        <div class="logo">
          <h2>AI智能课堂</h2>
        </div>
        <el-menu
          :default-active="$route.path"
          class="el-menu-vertical"
          background-color="#304156"
          text-color="#bfcbd9"
          active-text-color="#409EFF"
          :collapse="isCollapse"
          router
        >
          <el-menu-item index="/admin">
            <el-icon><HomeFilled /></el-icon>
            <span>控制台</span>
          </el-menu-item>
          
          <el-sub-menu index="1">
            <template #title>
              <el-icon><Setting /></el-icon>
              <span>系统管理</span>
            </template>
            <el-menu-item index="/admin/system/users">用户管理</el-menu-item>
            <el-menu-item index="/admin/system/roles">角色管理</el-menu-item>
            <el-menu-item index="/admin/system/menus">菜单管理</el-menu-item>
            <el-menu-item index="/admin/system/logs">日志管理</el-menu-item>
          </el-sub-menu>
          
          <el-sub-menu index="2">
            <template #title>
              <el-icon><Notebook /></el-icon>
              <span>课程管理</span>
            </template>
            <el-menu-item index="/admin/course/list">课程列表</el-menu-item>
            <el-menu-item index="/admin/course/category">课程分类</el-menu-item>
          </el-sub-menu>
          
          <el-sub-menu index="3">
            <template #title>
              <el-icon><Edit /></el-icon>
              <span>考试管理</span>
            </template>
            <el-menu-item index="/admin/exam/list">考试列表</el-menu-item>
            <el-menu-item index="/admin/exam/questions">题库管理</el-menu-item>
            <el-menu-item index="/admin/exam/ai-questions">AI出题</el-menu-item>
          </el-sub-menu>
          
          <el-sub-menu index="4">
            <template #title>
              <el-icon><DataAnalysis /></el-icon>
              <span>数据分析</span>
            </template>
            <el-menu-item index="/admin/analysis/study">学习分析</el-menu-item>
            <el-menu-item index="/admin/analysis/exam">考试分析</el-menu-item>
          </el-sub-menu>
        </el-menu>
      </el-aside>
      
      <el-container class="main-container">
        <el-header class="header">
          <div class="header-left">
            <el-icon class="fold-btn" @click="toggleCollapse">
              <Fold v-if="!isCollapse" />
              <Expand v-else />
            </el-icon>
            <el-breadcrumb separator="/">
              <el-breadcrumb-item v-for="(item, index) in breadcrumb" :key="index">
                <router-link :to="item.path">{{ item.name }}</router-link>
              </el-breadcrumb-item>
            </el-breadcrumb>
          </div>
          
          <div class="header-right">
            <el-dropdown>
              <span class="user-info">
                管理员
                <el-icon><ArrowDown /></el-icon>
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item>个人中心</el-dropdown-item>
                  <el-dropdown-item divided @click="handleLogout">退出登录</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </el-header>
        
        <el-main class="main">
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { 
  HomeFilled, 
  Setting, 
  Notebook, 
  Edit, 
  DataAnalysis, 
  ArrowDown,
  Fold,
  Expand
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const route = useRoute()
const router = useRouter()
const isCollapse = ref(false)

// 动态生成面包屑
const breadcrumb = computed(() => {
  const matched = route.matched.filter(item => item.name)
  return matched.map(item => ({
    path: item.path,
    name: item.meta.title || item.name
  }))
})

// 切换侧边栏
const toggleCollapse = () => {
  isCollapse.value = !isCollapse.value
}

// 退出登录
const handleLogout = () => {
  localStorage.removeItem('token')
  router.push('/login')
  ElMessage.success('退出成功')
}
</script>

<style scoped lang="scss">
.admin-layout {
  height: 100vh;
  
  .aside {
    background-color: #304156;
    transition: width 0.3s;
    overflow: hidden;
    
    .logo {
      height: 60px;
      line-height: 60px;
      text-align: center;
      color: #fff;
      font-size: 20px;
      border-bottom: 1px solid #1f2d3d;
      
      h2 {
        margin: 0;
        font-weight: 600;
      }
    }
    
    .el-menu {
      border-right: none;
      
      &:not(.el-menu--collapse) {
        width: 200px;
      }
    }
  }
  
  .main-container {
    .header {
      background-color: #fff;
      border-bottom: 1px solid #dcdfe6;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 15px;
      
      .header-left {
        display: flex;
        align-items: center;
        
        .fold-btn {
          padding: 0 15px;
          font-size: 20px;
          cursor: pointer;
          
          &:hover {
            color: #409EFF;
          }
        }
        
        .el-breadcrumb {
          margin-left: 15px;
        }
      }
      
      .header-right {
        .user-info {
          display: flex;
          align-items: center;
          cursor: pointer;
          color: #606266;
          
          .el-icon {
            margin-left: 5px;
          }
        }
      }
    }
    
    .main {
      background-color: #f0f2f5;
      padding: 20px;
      height: calc(100vh - 60px);
      overflow-y: auto;
    }
  }
}

:deep(.el-menu-item) {
  &.is-active {
    background-color: #263445 !important;
  }
}

:deep(.el-sub-menu__title) {
  &:hover {
    background-color: #263445 !important;
  }
}
</style> 