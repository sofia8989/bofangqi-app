import { AllQueryBalance } from "@/service/game";
import { defineStore } from 'pinia'

export const gameBalance = defineStore({
    id: 'gameBalance',
    state: () => {
        return {
            allBalance: {
                coin: 0,
                freezeCoin: 0,
                gameCoin: 0,
                list: [
                    {
                        activityApplyOrderId: 0,
                        activityUserStatus: 0,
                        code: 0,
                        coin: 0,
                        gameName: "",
                        id: 0,
                        msg: 0
                    }
                ],
                sumCoin: 0,
                venueCoin: 0
            }
        }
    },
    actions: {
        async getAllQueryBalance() {
            let res = await AllQueryBalance({})
            this.allBalance = res.data
        },
    },
    persist: {
        enabled: true,
        strategies: [
            {
                key: 'gameBalance',
                storage: localStorage
            }
        ]
    }
})
