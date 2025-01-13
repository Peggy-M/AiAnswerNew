<template>
  <div class="navbar">
    <div class="nav-left">
      <div class="logo">
        <img src="@/assets/logo.png" alt="Logo">
        <span>AI智能课堂</span>
      </div>
      <div class="nav-group">
        <router-link 
          to="/" 
          class="nav-item" 
          :class="{ active: route.path === '/' }"
          exact
        >
          <el-icon><HomeFilled /></el-icon>
          <span>首页</span>
        </router-link>
        <router-link 
          to="/courses" 
          class="nav-item"
          :class="{ active: route.path.startsWith('/courses') }"
        >
          <el-icon><Reading /></el-icon>
          <span>学习中心</span>
        </router-link>
        <router-link 
          to="/exam" 
          class="nav-item"
          :class="{ active: route.path.startsWith('/exam') }"
        >
          <el-icon><EditPen /></el-icon>
          <span>考试中心</span>
        </router-link>
        <router-link 
          v-if="userStore.hasRole('admin')" 
          to="/admin" 
          class="nav-item"
          :class="{ active: route.path.startsWith('/admin') }"
        >
          <el-icon><Setting /></el-icon>
          <span>后台管理</span>
        </router-link>
      </div>
    </div>

    <div class="nav-right">
      <template v-if="!userStore.isLoggedIn">
        <el-button type="primary" class="login-btn" @click="$router.push('/login')">
          登录
        </el-button>
      </template>

      <template v-else>
        <el-dropdown trigger="click" @command="handleCommand">
          <div class="user-info">
            <el-avatar :size="32" :src="userStore.avatar || defaultAvatar" />
            <span class="username">{{ userStore.username }}</span>
            <el-icon><CaretBottom /></el-icon>
          </div>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="profile">
                <el-icon><User /></el-icon>
                个人中心
              </el-dropdown-item>
              <el-dropdown-item divided command="logout">
                <el-icon><SwitchButton /></el-icon>
                退出登录
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { 
  CaretBottom, 
  User, 
  SwitchButton,
  HomeFilled,
  Reading,
  EditPen,
  Setting
} from '@element-plus/icons-vue'
import defaultAvatar from '@/assets/default-avatar.png'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const handleLogoClick = () => {
  console.log('Logo clicked')
  console.log('Is admin?', userStore.hasRole('admin'))
  
  if (userStore.hasRole('admin')) {
    console.log('Attempting to navigate to AI generate page')
    router.push('/admin/ai-generate').catch(err => {
      console.error('Navigation error:', err)
    })
  } else {
    console.log('Navigating to home page')
    router.push('/')
  }
}

const handleCommand = (command: string) => {
  switch (command) {
    case 'admin':
      router.push('/admin')
      break
    case 'profile':
      router.push('/profile')
      break
    case 'logout':
      userStore.logout()
      router.push('/login')
      break
  }
}
</script>

<style scoped lang="scss">
.navbar {
  height: 60px;
  background: #fff;
  border-bottom: 1px solid #eee;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;

  .nav-left {
    display: flex;
    align-items: center;
    gap: 40px;

    .logo {
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 8px;
      
      &:hover {
        opacity: 0.9;
      }
      
      img {
        height: 32px;
      }
      
      span {
        font-size: 18px;
        font-weight: bold;
        color: #333;
      }
    }

    .nav-group {
      display: flex;
      gap: 4px;

      .nav-item {
        text-decoration: none;
        color: #666;
        padding: 8px 16px;
        border-radius: 6px;
        display: flex;
        align-items: center;
        gap: 6px;
        transition: all 0.3s;
        
        .el-icon {
          font-size: 18px;
        }
        
        span {
          font-size: 15px;
        }
        
        &:hover {
          color: var(--el-color-primary);
          background: var(--el-color-primary-light-9);
        }
        
        &.active {
          color: var(--el-color-primary);
          background: var(--el-color-primary-light-9);
          font-weight: 500;
        }
      }
    }
  }

  .nav-right {
    .login-btn {
      padding: 8px 24px;
      border-radius: 6px;
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 4px 12px;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.3s;
      
      &:hover {
        background: #f5f7fa;
      }
      
      .username {
        font-size: 14px;
        color: #333;
      }
      
      .el-icon {
        color: #999;
        font-size: 12px;
      }
    }
  }
}

:deep(.el-dropdown-menu) {
  .el-dropdown-menu__item {
    display: flex !important;
    align-items: center;
    gap: 8px;
    padding: 8px 16px;
    
    .el-icon {
      margin: 0 !important;
    }
  }
}
</style> 