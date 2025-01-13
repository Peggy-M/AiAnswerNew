import { defineStore } from 'pinia'
import type { Course } from '@/types/course'

// 初始课程数据
const initialCourses: Course[] = [
  {
    id: 1,
    title: 'Python基础入门',
    description: '零基础学习Python编程',
    cover: '/images/course1.jpg',
    level: 'beginner',
    studentCount: 1234,
    duration: 120
  },
  {
    id: 2,
    title: 'Web前端开发',
    description: '从零开始学习前端开发',
    cover: '/images/course2.jpg',
    level: 'intermediate',
    studentCount: 890,
    duration: 180
  }
]

export const useCourseStore = defineStore('course', {
  state: () => ({
    courses: [] as Course[]
  }),

  actions: {
    addCourse(course: Partial<Course>) {
      const newCourse: Course = {
        id: Date.now(),
        studentCount: 0,
        title: '',
        description: '',
        cover: '',
        level: '',
        duration: 0,
        ...course
      }
      this.courses.push(newCourse)
      // 保存到本地存储
      this.saveCourses()
    },

    updateCourse(id: number, course: Partial<Course>) {
      const index = this.courses.findIndex(c => c.id === id)
      if (index !== -1) {
        this.courses[index] = { ...this.courses[index], ...course }
        // 保存到本地存储
        this.saveCourses()
      }
    },

    removeCourse(id: number) {
      const index = this.courses.findIndex(c => c.id === id)
      if (index !== -1) {
        this.courses.splice(index, 1)
        // 保存到本地存储
        this.saveCourses()
      }
    },

    getCourseById(id: number) {
      return this.courses.find(c => c.id === id)
    },

    // 从本地存储加载课程
    loadCourses() {
      const savedCourses = localStorage.getItem('courses')
      if (savedCourses) {
        this.courses = JSON.parse(savedCourses)
      } else {
        // 如果本地存储中没有数据，使用初始数据
        this.courses = initialCourses
        this.saveCourses()
      }
    },

    // 保存课程到本地存储
    saveCourses() {
      localStorage.setItem('courses', JSON.stringify(this.courses))
    }
  }
}) 