<template>
    <div class="w-full h-full overflow-hidden">
        <NavHeader class="h-[44px]" title="充值" :callBack="() => $router.push({ name: 'ai' })">
        </NavHeader>
        <div class="h-[calc(100vh-44px)] overflow-y-auto overflow-x-hidden text-white py-[8px] scrollbar">
            <van-tabs type="card" background="#212121" title-inactive-color="#979797" title-active-color="#fff" shrink
                v-model:active="state.type" line-height="0" line-width="0" lazy-render swipeable>
                <van-tab v-for="item in aiTypeList" :key="item.value" :name="item.value" :title="item.name">
                    <div class="px-[20px] mt-[21px]">
                        <div class="text-[14px] mb-[12px]">请选择充值金额</div>
                        <div class="grid grid-cols-2 gap-x-[15px] gap-y-[12px]">
                            <div class="bg-[#2B2B2B] h-[69px] rounded-[10px] flex pl-[14px]"
                                @click="state.goodsId = item.goodsId" :class="{ 'active': item.goodsId == state.goodsId }"
                                v-for="item in aiGoodslist" :key="item.id">
                                <div class="flex-1 pt-[9px]">
                                    <div>
                                        <span class="text-[12px]">￥</span>
                                        <span class="text-[18px]">{{ item.goodsPresentPrice }}</span>
                                    </div>
                                    <div :class="{ 'text-white': item.goodsId == state.goodsId }"
                                        class="text-[10px] text-[#999]">{{ item.goodsIntroduction }}</div>
                                </div>
                                <div class="flex justify-center items-center flex-1">
                                    <img class="w-[56px] h-[56px]" src="@/assets/images/ai/money-icon.png" alt="">
                                </div>
                            </div>
                        </div>
                        <div class="mt-[30px]">
                            <div class="text-[14px] mb-[15px]">请选择支付方式</div>
                            <div class="grid grid-cols-5 gap-y-[12px] gap-x-[24px]">
                                <div class=" h-[60px] py-[8px] rounded-[6px]"
                                    @click="state.paymentChannelId = item.paymentChannelId"
                                    :class="item.paymentChannelId == state.paymentChannelId ? 'active' : 'border-[1px] border-[#EDEDED] border-solid'"
                                    v-for="item in channel_list" :key="item.id">
                                    <div class="w-full flex justify-center items-center mb-[4px]">
                                        <img class="w-[24px] h-[24px]" :src="getIcon(item.typeKey)" alt="" srcset="">
                                    </div>
                                    <div
                                        class="text-[10px] text-center w-full overflow-hidden text-ellipsis whitespace-nowrap">
                                        {{ item.channelAlias || item.channelName }}</div>
                                </div>
                            </div>
                        </div>
                        <div class="mt-[30px]">
                            <van-button class=" rounded-[6px]" :disabled="payLoading"
                                color="linear-gradient(90deg, #2D57CC 0%, #AC63FF 100%)" block
                                @click="confirm">立即支付</van-button>
                        </div>
                    </div>
                </van-tab>
            </van-tabs>
        </div>
    </div>
</template>
<script setup name="aiecharge">
import { computed, ref, onMounted, reactive,watch } from "vue";
import { aiTypeList } from "@/data/aiShareData"
import zfb_icon from '@/assets/images/recharge/zfb_icon.png'
import wx_icon from '@/assets/images/recharge/wx_icon.png'
import { getAiGoodsList, paymentChannelList, createVipOrder } from "@/service/payApi"
import { useRoute } from "vue-router";
import { $get, openLink } from "@/utils";
const route = useRoute()
const state = reactive({
    type: 3,
    goodsId: 1,
    paymentChannelId: 1
})
const channel_list = ref([])
const getIcon = (key) => {
    let icon = zfb_icon
    switch (key) {
        case "Alipay":
            icon = zfb_icon
            break;
        case "Wechat":
            icon = wx_icon
            break;
        default:
            break;
    }
    return icon
}
const aiGoods = ref([])
const aiGoodslist = computed(() => (aiGoods.value.find(item => item.type == state.type) || {}).goodsList || [])
const get_ai_goods_list = async () => {
    let res = await getAiGoodsList()
    aiGoods.value = res.result
}

const getpaymentChannelList = async () => {
    let res = await paymentChannelList()
    let payments = res.result || []
    let channelList = []
    payments.forEach(payment => {
        let list = (payment.availableChannelsRelation || []).map(item => {
            item.typeKey = payment.typeKey
            return item
        })
        channelList.push(...list)
    });
    state.paymentChannelId = channelList[0]?.paymentChannelId
    channel_list.value = channelList
}
const payLoading = ref(false)
const confirm = async () => {
    payLoading.value = true
    let res = await createVipOrder({
        paymentChannelId: state.paymentChannelId,
        pageName: window.localStorage.getItem("_pageName") || "index.html",
        goodsId: state.goodsId
    })
    if (res.result.payUrl) {
        openLink(res.result.payUrl)
    } else {
        showToast({
            type: "fail",
            message: "发生错误请重新再试！"
        })
    }
    payLoading.value = false
}
onMounted(() => {
    let type = route.query.type
    if (type) {
        state.type = +type
    }
    get_ai_goods_list()
    getpaymentChannelList()
})
watch(() => aiGoodslist.value, (value) => {
    state.goodsId = $get(value, '0.goodsId')
})
</script>
<style lang="less" scoped>
:deep(.van-tabs--card) {
    --van-tabs-default-color: transparent;
    --van-tabs-card-height: 38px;

    .van-tabs__nav {
        background-color: #fff !important;
        border-radius: 20px;
        padding: 2px;

        .van-tab--active {
            border-radius: 20px;
            background: linear-gradient(90deg, #2D57CC 0%, #AC63FF 100%);
        }
    }

    .van-tabs__wrap {
        display: flex;
        justify-content: center;
    }

}

.active {
    background: linear-gradient(90deg, #2D57CC 0%, #AC63FF 100%);

}
</style>