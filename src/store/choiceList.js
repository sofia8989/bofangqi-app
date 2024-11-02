import { defineStore } from 'pinia'
import { getAdultList } from '@/service/community'
export const useChoiceList = defineStore('choiceList', {
  state: () => {
    return {
      videoList: [],
    }
  },
  actions: {
    /**
     * 设置精选视频列表数据
     * @param {Array} list 
     * @param {Boolean} isclear 
     */
    async getChoiceList() {
      let params = { typeId: 69, pageSize: 30, page: 1 }
      let res = await getAdultList(params)
      this.videoList = res?.result?.list || []
    }
  },
  persist: {
    enabled: true,
    strategies: [
      {
        key: 'choiceList',
        storage: localStorage
      }
    ]
  }
})