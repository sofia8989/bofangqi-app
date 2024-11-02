import { defineStore } from 'pinia'

export const browser = defineStore({
  id: 'browser',
  state: () => {
    return {
      isMobile: true,
      isSafari: true
    }
  },
  actions: {
    setBrowser() {
      let isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      )
      let isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent)
      this.isMobile = isMobile
      this.isSafari = isSafari
    }
  },
  persist: {
    enabled: true,
    strategies: [
      {
        key: 'browser',
        storage: localStorage
      }
    ]
  }
})
