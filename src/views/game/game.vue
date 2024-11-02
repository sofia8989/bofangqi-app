<template>
    <div class="game-page text-white h-page overflow-y-auto scrollbar px-[10px] pb-[80px] bg-[#1f1f1f]">
        <div class="h-[54px] w-full sticky top-0 z-[999] flex  items-center text-[18px] font-medium  bg-[#1f1f1f]">
            <div class="w-[109px] h-[40px] rounded-[20px] px-[16px] text-[12px] bg-[#fff]">
                <div>
                    <span class="pr-[3px]">钱包余额:</span>
                    <span class="text-[#f47725] text-[11px] font-normal">{{ gCoin || '0.00' }}</span>
                </div>
                <div>
                    <span class="pr-[3px]">游戏余额:</span>
                    <span class="text-[#f47725] text-[11px] font-normal">{{ manufacturerCoin || '0.00' }}</span>
                </div>
            </div>
            <van-button @click="transferShow = true" class="!px-[8px] !h-[32px] !ml-[3px]" icon="exchange" round
                color="linear-gradient(90deg, #2D57CC 0%, #AC63FF 100%)">划转</van-button>
            <van-button @click="clikcRecharage" class="!px-[8px] !h-[32px] !ml-[3px]" :icon="rqIcon" round
                color="linear-gradient(90deg, #2D57CC 0%, #AC63FF 100%)">充值</van-button>
            <van-button @click="show = true" class="!px-[8px] !h-[32px] !ml-[3px]" round :icon="wmIcon"
                color="linear-gradient(90deg, #2D57CC 0%, #AC63FF 100%)">提现</van-button>
        </div>
        <SwipeAd :ispd="false" class="mt-[10px]" :list="xlHomeBanner" />
        <van-notice-bar class="!h-[26px] rounded-[6px] !bg-[#1f1f1f] !px-0 !my-[12px]" color="#f47725"
            :left-icon="noticeBarIcon" :text="GameNotify" />
        <div class="grid grid-cols-4 p-[10px] gap-x-[30px] bg-[#fff] rounded-[10px]">
            <div v-for="item in activityList" :key="item.id" @click="activityClick(item.id)">
                <img class="w-[50px] h-[50px]" :src="item.src" alt="">
                <div class="text-[15px]">{{ item.name }}</div>
            </div>
        </div>
        <van-tabs v-model:active="activeType" background="#1f1f1f" style="--van-tabs-line-height:32px"
            title-active-color="#fff" title-inactive-color="#fff" line-height="0" shrink line-width="0" lazy-render swipeable>
            <van-tab v-for="item of typeList" :title="item.typeName">
                <div class="grid grid-cols-4 gap-[14px] mt-[12px]">
                    <div class="flex flex-col items-center" @click="platformLogin(item.id)" v-for="item in gameList"
                        :key="item.id">
                        <img class="w-[70px] h-[70px] rounded-[50%]" v-olazyload="item.img" alt="">
                        <div class="mt-[1px] w-full text-center overflow-hidden whitespace-nowrap text-ellipsis"> {{
                        item.name }}
                        </div>
                    </div>
                </div>
            </van-tab>
        </van-tabs>

        <!-- <div class="py-[11px] text-[14px]">游戏列表</div>
        <div class="flex rounded-[8px]">
            <div class="w-[70px] flex-shrink-0 flex-grow-0 flex justify-center  rounded-l-[8px]">
                <div @click="activeId = item.id"
                    :class="['w-[70px] h-[70px] rounded-tl-[8px] flex flex-col justify-center items-center', item.id == activeId ? ' bg-[#AC63FF] rounded-l-[8px]' : 'bg-[#fff] rounded-bl-[8px]']"
                    v-for="item in manufacturers" :key="item.id">
                    <img class="w-[32px] h-[32px] rounded-[50%]" :src="item.src" alt="">
                    <div>{{ item.name }}</div>
                </div>

            </div>
            <div class="bg-[#AC63FF] flex-1 rounded-r-[8px] px-[10px]">
                <div class="flex justify-between pt-[10px]">
                    <div>
                        <div class="text-[15px] font-semibold mb-[12px]">
                            {{ activeManufacturer?.name }}
                        </div>
                        <div class="flex items-center">
                            <span class="pr-[3px]">余额:</span>
                            <span class="text-[#f47725] text-[18px] font-normal">{{ manufacturerCoin || '0.00' }}</span>
                        </div>
                    </div>

                </div>
               
            </div>
        </div> -->
        <selectPop v-model="show" title="选择提现方式" @select="select" :aisleList="aisleList" />
        <withdrawalPop v-model="withdrawalShow" :withdrawalType="withdrawalType" />
        <transferPop :activeManufacturer="activeManufacturer" :manufacturerCoin="manufacturerCoin"
            v-model="transferShow"></transferPop>
        <rechargePop :title="rechargeTitle" v-model="rechargeShow"></rechargePop>
        <van-back-top bottom="80" />
    </div>
</template>
<script setup name="game">
import { $get, openLink } from "@/utils";
import { computed, ref, onMounted } from "vue";
import { config } from '@/store/config'
import { gameBalance } from '@/store/game'
import welfare from '@/assets/images/game/welfare.png'
import firstCharge from '@/assets/images/game/first-charge.png'
import limited from '@/assets/images/game/limited.png'
import transport from '@/assets/images/game/transport.png'
import pgGame from '@/assets/images/game/pg-game.png'
import bankIcon from '@/assets/images/game/bankIcon.png'
import usdtIcon from '@/assets/images/game/usdtIcon.png'
import { GetGameList, PlatformLogin } from "@/service/game";
import withdrawalPop from '@/views/game/components/withdrawalPop.vue'
import selectPop from '@/views/game/components/selectPop.vue'
import transferPop from '@/views/game/components/transferPop.vue'
import rechargePop from '@/views/game/components/rechargePop.vue'
import rqIcon from '@/assets/images/game/rq-icon.png'
import wmIcon from '@/assets/images/game/wm-icon.png'
import noticeBarIcon from "@/assets/images/notice-bar-icon.svg"
import { showToast } from "vant";
const configStore = config()
const GameBalance = gameBalance()
/**
 * @description 轮播图
 */
const xlHomeBanner = computed(() => $get(configStore, 'templateData.xlGameBanner.adList', []))
const GameNotify = computed(() => $get(configStore, 'configData.config.GameNotify', ''))
/**
 * 全局余额
 */
const gCoin = computed(() => $get(GameBalance, 'allBalance.coin'))

const activityList = ref([
    { name: "首充福利", src: firstCharge, id: 1, },
    // { name: "流水福利", src: welfare, id: 2 },
    // { name: "限时充值", src: limited, id: 3 },
    // { name: "失利转运", src: transport, id: 4 },
])
const activityClick = (id) => {
    switch (id) {
        case 1:
            rechargeShow.value = true
            rechargeTitle.value = '首充福利'
            break;

        default:
            break;
    }
}
const manufacturers = ref([
    {
    name: 'PG游戏',
    id: 22,
    src: pgGame
}
])
const activeId = ref(22)
const activeManufacturer = computed(() => manufacturers.value.find(item => item.id == activeId.value) || {})
/**
 * 平台余额
 */
const manufacturerCoin = computed(() => $get(($get(GameBalance, 'allBalance.list', []).find(item => item.id == activeId.value) || {}), 'coin', '0.00'))
const typeList = ref([
    {
    typeName: "电子",
    id: 222
},
])
const activeType = ref(0)
const gameList = ref([])
const getGameList = async () => {
    let res = await GetGameList({
        current: 1,
        size: 500,
        data: {
            category: 0,
            id: 222
        }
    }
    )
    gameList.value = res.data?.list
}

const platformLogin = async (slotId = 1) => {
    let { id } = typeList.value[activeType.value]
    let res = await PlatformLogin({ id, slotId })
    if (res.code === 0) {
        openLink($get(res, 'data.url'))
    } else {
        showToast({
            type: 'fail',
            message: res.msg
        })
    }

}




const show = ref(false)
const withdrawalType = ref(1)
const withdrawalShow = ref(false)
const aisleList = ref([
    // { payChannelShowName: "银行卡", icon: bankIcon, id: 1 },
    { payChannelShowName: "usdt", icon: usdtIcon, id: 0 },
])

const select = ({ id }) => {
    withdrawalType.value = id
    show.value = false
    withdrawalShow.value = true
}

const transferShow = ref(false)

const rechargeShow = ref(false)
const rechargeTitle = ref('')
const clikcRecharage = () => {
    rechargeShow.value = true
    rechargeTitle.value = '游戏充值'
}
onMounted(() => {
    getGameList()
    GameBalance.getAllQueryBalance()
})
</script>
<style lang="less" scoped>
.game-page {
    :deep(.van-notice-bar__content) {
        color: #fff
    }

    :deep(.van-tabs) {
        .van-tab {
            height: 24px;
            margin-top: 6px;
        }
        .van-tab--active {
            background: linear-gradient(90deg, #FFCF54 0%, #F48218 78.23%);
            border-radius: 5px;
        }
    }
}
</style>