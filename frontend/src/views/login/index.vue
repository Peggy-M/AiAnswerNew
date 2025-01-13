<template>
  <div class="login-container">
    <div class="login-box">
      <div class="login-left">
        <div class="welcome-text">
          <h1>AI智能课堂</h1>
          <p>智能学习，未来教育</p>
        </div>
        <img src="@/assets/images/login-illustration.svg" alt="登录插画" class="login-illustration">
      </div>
      
      <div class="login-form">
        <h2>账号登录</h2>
        <p class="subtitle">欢迎回来，请输入您的账号信息</p>
        
        <el-form ref="formRef" :model="loginForm" :rules="rules">
          <el-form-item prop="username">
            <el-input
              v-model="loginForm.username"
              placeholder="请输入用户名"
              prefix-icon="User"
            />
          </el-form-item>
          
          <el-form-item prop="password">
            <el-input
              v-model="loginForm.password"
              type="password"
              placeholder="请输入密码"
              prefix-icon="Lock"
              show-password
            />
          </el-form-item>
          
          <div class="remember-forgot">
            <el-checkbox v-model="rememberMe">记住我</el-checkbox>
            <a href="#" class="forgot-link">忘记密码？</a>
          </div>
          
          <el-button type="primary" class="login-button" @click="handleLogin">
            登录
          </el-button>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { User, Lock } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { ElLoading } from 'element-plus'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const formRef = ref()

const loginForm = reactive({
  username: '',
  password: ''
})

const rememberMe = ref(false)

const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, message: '用户名至少3个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码至少6个字符', trigger: 'blur' }
  ]
}

const handleLogin = async () => {
  if (!formRef.value) return
  await formRef.value.validate(async (valid: boolean) => {
    
    if (valid) {
      try {
        const loading = ElLoading.service({
          lock: true,
          text: '登录中...',
          background: 'rgba(0, 0, 0, 0.7)'
        })
        
        const success = await userStore.login(loginForm)
        
        loading.close()
        
        if (success) {
          ElMessage.success('登录成功')
          // 获取重定向地址，如果没有则跳转到首页
          const redirect = route.query.redirect as string
          await router.replace(redirect || '/')
        } else {
          ElMessage.error('登录失败，请检查用户名和密码')
        }
      } catch (error) {
        ElMessage.error('登录出错，请重试')
      }
    }
  })
}
</script>

<style scoped lang="scss">
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.login-box {
  display: flex;
  background: white;
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  width: 1000px;
  max-width: 90%;
  min-height: 600px;
}

.login-left {
  flex: 1;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white;
  
  .welcome-text {
    text-align: center;
    margin-bottom: 40px;
    
    h1 {
      font-size: 36px;
      font-weight: bold;
      margin-bottom: 10px;
    }
    
    p {
      font-size: 18px;
      opacity: 0.9;
    }
  }
  
  .login-illustration {
    width: 80%;
    max-width: 400px;
  }
}

.login-form {
  flex: 1;
  padding: 60px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  
  h2 {
    font-size: 28px;
    font-weight: bold;
    color: #333;
    margin-bottom: 10px;
  }
  
  .subtitle {
    color: #666;
    margin-bottom: 40px;
  }
  
  .el-input {
    height: 50px;
    
    :deep(.el-input__wrapper) {
      background: #f5f7fa;
      border: none;
      border-radius: 10px;
      padding: 0 20px;
    }
    
    :deep(.el-input__inner) {
      height: 50px;
    }
  }
  
  .remember-forgot {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 20px 0;
    
    .forgot-link {
      color: #666;
      text-decoration: none;
      
      &:hover {
        color: #409EFF;
      }
    }
  }
  
  .login-button {
    width: 100%;
    height: 50px;
    border-radius: 10px;
    font-size: 16px;
    margin-top: 20px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border: none;
    
    &:hover {
      opacity: 0.9;
    }
  }
}

@media (max-width: 768px) {
  .login-box {
    flex-direction: column;
  }
  
  .login-left {
    padding: 30px;
  }
  
  .login-form {
    padding: 30px;
  }
}
</style> 