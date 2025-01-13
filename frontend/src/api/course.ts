import request from '@/utils/request'

export interface CourseQueryParams {
  page: number
  pageSize: number
  keyword?: string
  level?: string
}

export function getCourseList(params: CourseQueryParams) {
  return request({
    url: '/courses',
    method: 'get',
    params
  })
}

export function getCourseDetail(id: number) {
  return request({
    url: `/courses/${id}`,
    method: 'get'
  })
} 