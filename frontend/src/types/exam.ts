import type { Question } from './question'

export interface Exam {
  id: number
  name: string
  duration: number
  difficulty: string[]
  totalScore: number
  questions: Question[]
  status: 'draft' | 'published' | 'ended'
  startTime?: string
  endTime?: string
  createTime?: string
  updateTime?: string
} 