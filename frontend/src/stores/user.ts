import { defineStore } from 'pinia'
import { login } from '@/api/user'
import type { LoginParams } from '@/api/user'

interface UserState {
  token: string | null
  userInfo: {
    id: number
    username: string
    avatar?: string
    roles: string[]
  } | null
}

export const useUserStore = defineStore({
  id: 'user',
  state: (): UserState => ({
    token: null,
    userInfo: null
  }),

  getters: {
    isLoggedIn: (state) => !!state.token && !!state.userInfo,
    username: (state) => state.userInfo?.username,
    avatar: (state) => state.userInfo?.avatar,
    roles: (state) => state.userInfo?.roles || []
  },

  actions: {
    async login(loginForm: LoginParams) {
      try {
        const res = await login(loginForm)
        debugger
        this.setToken(res.data.token)
        this.setUserInfo({
          id: res.data.id,
          username: res.data.username,
          avatar: res.data.avatar,
          roles: res.data.roles
        })
        return true
      } catch (error) {
        console.error('Login error:', error)
        return false
      }
    },

    hasRole(role: string) {
      debugger
      return this.roles.includes(role)
    },

    setUserInfo(userInfo: UserState['userInfo']) {
      this.userInfo = userInfo
    },

    setToken(token: string) {
      this.token = token
    },

    logout() {
      this.token = null
      this.userInfo = null
    }
  },

  persist: true
}) 