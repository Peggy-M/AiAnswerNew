import request from '@/utils/request'

export interface GenerateParams {
  category: number[]
  type: string
  difficulty: string
  keywords: string
  count: number
}

export const generateQuestions = (params: GenerateParams) => {
  return request({
    url: '/api/ai/generate-questions',
    method: 'post',
    data: params
  })
} 