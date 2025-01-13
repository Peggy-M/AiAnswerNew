import { defineStore } from 'pinia'
import type { Question } from '@/types/question'

export const useQuestionStore = defineStore({
  id: 'question',
  
  state: () => ({
    questions: [] as Question[]
  }),

  actions: {
    addQuestions(questions: Question[]) {
      const questionsWithId = questions.map(question => ({
        ...question,
        id: Date.now() + Math.random(),
        createTime: new Date().toISOString()
      }))
      this.questions.push(...questionsWithId)
      console.log('Added questions:', this.questions)
    },

    removeQuestion(id: number) {
      const index = this.questions.findIndex(q => q.id === id)
      if (index !== -1) {
        this.questions.splice(index, 1)
      }
    },

    updateQuestion(id: number, question: Partial<Question>) {
      const index = this.questions.findIndex(q => q.id === id)
      if (index !== -1) {
        this.questions[index] = {
          ...this.questions[index],
          ...question,
          updateTime: new Date().toISOString()
        }
      }
    }
  }
}) 