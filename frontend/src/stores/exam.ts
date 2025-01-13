import { defineStore } from 'pinia'
import type { Exam } from '@/types/exam'

export const useExamStore = defineStore('exam', {
  state: () => ({
    exams: [] as Exam[]
  }),

  actions: {
    // 添加试卷
    addExam(exam: Exam) {
      const newExam = {
        ...exam,
        id: Date.now(),
        status: 'draft',
        createTime: new Date().toISOString(),
        updateTime: new Date().toISOString()
      }
      this.exams.push(newExam)
      this.saveExams()
      console.log('Added exam:', newExam) // 添加调试日志
    },

    // 更新试卷
    updateExam(id: number, updates: Partial<Exam>) {
      const index = this.exams.findIndex(e => e.id === id)
      if (index !== -1) {
        this.exams[index] = { ...this.exams[index], ...updates }
        this.saveExams()
      }
    },

    // 发布试卷
    publishExam(id: number, startTime: string, endTime: string) {
      console.log('Publishing exam with id:', id)
      console.log('Start time:', startTime)
      console.log('End time:', endTime)
      
      const index = this.exams.findIndex(e => e.id === id)
      console.log('Found exam at index:', index)
      
      if (index !== -1) {
        const updatedExam = {
          ...this.exams[index],
          status: 'published',
          startTime,
          endTime,
          updateTime: new Date().toISOString()
        }
        this.exams[index] = updatedExam
        this.saveExams()
        console.log('Updated exam:', updatedExam)
        console.log('Current exams:', this.exams)
      } else {
        console.warn('Exam not found with id:', id)
      }
    },

    // 删除试卷
    removeExam(id: number) {
      const index = this.exams.findIndex(e => e.id === id)
      if (index !== -1) {
        this.exams.splice(index, 1)
        this.saveExams()
      }
    },

    // 从本地存储加载试卷
    loadExams() {
      const savedExams = localStorage.getItem('exams')
      if (savedExams) {
        this.exams = JSON.parse(savedExams)
      }
    },

    // 保存试卷到本地存储
    saveExams() {
      localStorage.setItem('exams', JSON.stringify(this.exams))
    }
  }
}) 