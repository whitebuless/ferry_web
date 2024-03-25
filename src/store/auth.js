import { defineStore } from 'pinia'

export const useAuthStore = defineStore('authStore', {
  state: () => ({
    UserInfoStore: {
      id: '',
      name: '',
      email: '',
      role: ''
    }
  }),
  getters: {
    userName: (state) => state.UserInfoStore.name,
    userRole: (state) => state.UserInfoStore.role
  },
  actions: {
    set_user(info) {
      this.UserInfoStore.id = info.id
      this.UserInfoStore.name = info.name
      this.UserInfoStore.email = info.email
      this.UserInfoStore.role = info.role
    },
    logout() {
      this.UserInfoStore.id = ''
      this.UserInfoStore.name = ''
      this.UserInfoStore.email = ''
      this.UserInfoStore.role = ''
    }
  }
})
