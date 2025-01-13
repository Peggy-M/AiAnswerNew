
export interface LoginParams {
  username: string
  password: string
}

export interface LoginResponse {
  data: {
    token: string
    id: number
    username: string
    avatar?: string
    roles: string[]
  }
}

export function login(data: LoginParams) {
  debugger
  // 临时使用 Promise 模拟登录
  return new Promise<LoginResponse>((resolve) => {
    setTimeout(() => {
      resolve({
        data: {
          token: 'mock-token',
          id: 1,
          username: data.username,
          roles: data.username === 'teacher' ? ['admin'] : [],
          avatar: ''
        }
      })
    }, 1000)
  })
  
  // 实际的 API 调用代码
  // return request<LoginResponse>({
  //   url: '/api/login',
  //   method: 'post',
  //   data
  // })
} 