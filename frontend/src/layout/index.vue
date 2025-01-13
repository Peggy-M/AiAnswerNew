<template>
  <div class="layout">
    <!-- 检查用户是否有权限访问当前路由 -->
    <template v-if="checkPermission">
      <Navbar />
      <div class="main-content">
        <router-view />
      </div>
    </template>
    <template v-else>
      <div class="no-permission">
        <h1>403</h1>
        <p>抱歉，您没有权限访问该页面</p>
        <el-button type="primary" @click="$router.push('/')">返回首页</el-button>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'
import Navbar from './components/Navbar.vue'

const route = useRoute()
const userStore = useUserStore()

const checkPermission = computed(() => {
  if (!route.meta.requiresAuth) return true
  if (!route.meta.roles) return true
  return route.meta.roles.some(role => userStore.hasRole(role))
})
</script>

<style scoped>
.layout {
  min-height: 100vh;
}

.main-content {
  padding-top: 60px;  /* 为导航栏留出空间 */
}

.no-permission {
  padding: 20px;
  text-align: center;
}
</style> 