export interface Question {
  id?: number
  type: 'single' | 'multiple' | 'judge' | 'coding'
  difficulty: string
  title: string
  options?: Array<{
    value: string
    content: string
  }>
  correctAnswer: string | string[] | boolean
  analysis: string
  score?: number
  category?: string[]
  tags?: string[]
  createTime?: string
  updateTime?: string
} 