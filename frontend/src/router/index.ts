import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import { useUserStore } from '@/stores/user'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index.vue'),
    meta: { title: '登录', noAuth: true }
  },
  {
    path: '/',
    name: 'Layout',
    component: () => import('@/layout/index.vue'),
    children: [
      {
        path: '',
        name: 'Home',
        component: () => import('@/views/home/index.vue'),
        meta: { title: '首页', noAuth: true }
      },
      {
        path: 'courses',
        name: 'Courses',
        component: () => import('@/views/courses/index.vue'),
        meta: { title: '课程中心' }
      },
      {
        path: 'courses/:id',
        name: 'CourseDetail',
        component: () => import('@/views/courses/detail.vue'),
        meta: { title: '课程详情' }
      },
      {
        path: 'courses/:id/learn',
        name: 'CourseLearn',
        component: () => import('@/views/courses/learn.vue'),
        meta: { title: '课程学习' }
      },
      {
        path: 'exam',
        name: 'Exam',
        component: () => import('@/views/exam/index.vue'),
        meta: { title: '考试中心' }
      },
      {
        path: 'exam/:id',
        name: 'ExamDetail',
        component: () => import('@/views/exam/detail.vue'),
        meta: { title: '考试详情' }
      },
      {
        path: 'exam/:id/result',
        name: 'ExamResult',
        component: () => import('@/views/exam/result.vue'),
        meta: { title: '考试结果' }
      }
    ]
  },
  {
    path: '/admin',
    component: () => import('@/views/admin/home.vue'),
    meta: { 
      requiresAuth: true,
      roles: ['admin']
    },
    children: [
      {
        path: '',
        redirect: '/admin/question-bank'
      },
      {
        path: 'question-bank',
        name: 'QuestionBank',
        component: () => import('@/views/admin/question-bank/index.vue'),
        meta: { title: '题库管理' }
      },
      {
        path: 'ai-generate',
        name: 'AiGenerate',
        component: () => import('@/views/admin/question-bank/ai-generate.vue'),
        meta: { title: 'AI智能出题' }
      },
      {
        path: 'exam',
        name: 'ExamManage',
        component: () => import('@/views/admin/exam/index.vue'),
        meta: { title: '试卷管理' }
      },
      {
        path: 'exam-generate',
        name: 'ExamGenerate',
        component: () => import('@/views/admin/exam/generate.vue'),
        meta: { title: '试卷生成' }
      },
      {
        path: 'exam/manage',
        name: 'ExamManage',
        component: () => import('@/views/admin/exam/manage.vue'),
        meta: { title: '考试管理' }
      },
      {
        path: 'courses',
        name: 'CourseManage',
        component: () => import('@/views/admin/courses/index.vue'),
        meta: { title: '课程管理' }
      },
      {
        path: 'courses/create',
        name: 'CourseCreate',
        component: () => import('@/views/admin/courses/edit.vue'),
        meta: { title: '创建课程' }
      },
      {
        path: 'courses/edit/:id',
        name: 'CourseEdit',
        component: () => import('@/views/admin/courses/edit.vue'),
        meta: { title: '编辑课程' }
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫
router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore()
  const title = to.meta.title as string
  if (title) {
    document.title = `${title} - AI智能课堂`
  }

  // 如果是不需要登录的页面，直接放行
  if (to.meta.noAuth) {
    next()
    return
  }

  // 需要登录但未登录，跳转到登录页
  if (!userStore.isLoggedIn) {
    next({
      path: '/login',
      query: { redirect: to.fullPath }
    })
    return
  }

  if (to.meta.requiresAuth) {
    if (!userStore.isLoggedIn) {
      next('/login')
      return
    }
    
    // 检查用户角色权限
    if (to.meta.roles && !to.meta.roles.some(role => userStore.hasRole(role))) {
      next('/403')  // 跳转到无权限页面
      return
    }
  }

  next()
})

export default router 