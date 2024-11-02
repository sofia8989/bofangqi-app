import { defineStore } from 'pinia'
export const global = defineStore({
  id: 'global',
  state: () => {
    return {
      homeCache: {
        scrollTop: 0,
        page: 1,
        typeId: '',
      },
      showMainDialog: false,
      showRechargeDialog: false,
      showPopUps: false,
      showLoading:false
    }
  },

  actions: {
    setHomeCache({ scrollTop, page, typeId }) {
      if (scrollTop) {
        this.homeCache.scrollTop = scrollTop
      }
      if (page) {
        this.homeCache.page = page
      }
      if (typeId != undefined) {
        this.homeCache.typeId = typeId
      }
    },
    setShowPopUps(val) {
      this.showPopUps = val
    },
    setShowLoading(val) {
      this.showLoading = val
    },
  }
})
