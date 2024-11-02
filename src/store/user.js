import { defineStore } from 'pinia'

export const user = defineStore({
  id: 'userInfo',
  state: () => {
    return {
      userInfo: {
        user_id: 0,
        user_name: '',
        is_vip: 0,
        user_end_time: 0,
        invite_reg_num: 0
      }
    }
  },
  getters: {
    getToken: (state) => {
      return state.token + 1
    }
  },
  actions: {

    setLoginInfo(userInfo) {
      this.userInfo = { ...userInfo }
    }
  },
  persist: {
    enabled: true,
    strategies: [
      {
        key: 'userInfo',
        storage: localStorage
      }
    ]
  }
})
