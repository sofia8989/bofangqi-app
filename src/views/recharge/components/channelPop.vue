<template>
    <van-popup v-model:show="showBottom" class="!bg-white scrollbar !overflow-y-hidden text-[#2F2F42]" position="bottom"
        round :style="{ height: '80%' }" teleport="body" close-on-click-overlay>
        <div class="sticky top-0 left-0 right-0  py-[16px] px-[23px] flex justify-between title">
            <div></div>
            <div class="text-[18px] name">购买VIP会员</div>
            <van-icon class="" name="close" color="#2F2F42" size="20" @click="showBottom = false" />
        </div>
        <div class="w-full h-[600px] overflow-y-auto scrollbar px-[23px] content">
            <div class="title">
                <div class="fk"></div>
                请选择支付方式
            </div>
            <div class="grid grid-cols-5 gap-x-[55px] my-[12px]">
                <div :class="['w-[50px] h-[55px] flex flex-col items-center justify-center  rounded-[6px] border-[1px] border-solid', activePay.paymentTypeId == item.paymentTypeId ? '!border-[#AC63FF] bg-[#fff]' : '!border-[#fff]']"
                    v-for="(item, index) in payments" @click="selectPayment(item)" :key="index"
                    :style="activePay.paymentTypeId == item.paymentTypeId ? 'background: #F2EEFF;' : ''">
                    <img :src="getIcon(item.typeKey)" class="w-[24px]" alt="" srcset="">
                    <span :class="['overflow-hidden text-ellipsis whitespace-nowrap',
                        { 'text-txt font-medium ': activePay.paymentTypeId == item.paymentTypeId }]">
                        {{ item.typeName }}
                    </span>
                </div>
            </div>
            <div class="title">
                <div class="fk"></div>
                请选择支付通道
            </div>
            <div class="grid grid-cols-3 gap-x-[10px] my-[12px]">
                <div :class="['w-[98px] h-[48px] flex items-center justify-center relative rounded-[6px] border-[1px] border-solid', activeChannel.paymentChannelId == item.paymentChannelId ? '!border-[#AC63FF] bg-[#fff]' : '!border-[#929292]']"
                    @click="select(item)" v-for="(item, i) in channelList" :key="item.paymentChannelId"
                    :style="activeChannel.paymentChannelId == item.paymentChannelId ? 'background: #F2EEFF;' : ''">
                    <span class="overflow-hidden text-ellipsis whitespace-nowrap">{{ item.channelAlias ||
                        item.channelName }}</span>
                    <!-- <div
                        class=" absolute bottom-0 right-0 bg-[#AC63FF]/10 w-[37px] h-[17px] rounded-tl-[6px] rounded-br-[6px] text-[#AC63FF] text-center">
                        推荐</div> -->
                </div>
            </div>
            <div class="title">
                <div class="fk"></div>
                充值金额
            </div>
            <div class="grid grid-cols-3 gap-x-[10px] my-[20px] payBox">
                <div class="moneyPay"><span
                        style=" font-weight: 400;font-size: 16px;">￥</span>{{ cur_vip.goodsPresentPrice }}</div>
                <div class="classification">{{ cur_vip.goodsName }}</div>
            </div>
        </div>
        <div class="!absolute bottom-0 px-[23px] w-full h-[80px] bg-[#f2f3f5   ] py-[8px]">
            <van-button :loading="payLoading" style="width: 100%;border-radius: 38px;background: #F83E3C;color: #fff;
" block @click="confirm">确认支付</van-button>
        </div>
    </van-popup>
</template>
<script setup>
import { computed, ref, watch, onMounted } from "vue";
import { paymentChannelList, createVipOrder } from "@/service/payApi";
import zfb_icon from '@/assets/images/recharge/zfb_icon.png'
import wx_icon from '@/assets/images/recharge/wx_icon.png'
import { openLink } from "@/utils";
const props = defineProps({
    cur_vip: {
        type: Object,
        default: () => ({})
    },
    modelValue: {
        type: Boolean,
        default: false
    },
})
const emits = defineEmits(['update:modelValue', 'payConfirm'])
const active = ref()

const payments = ref([])
const activePay = ref({})
const channelList = computed(() => activePay.value?.availableChannelsRelation || [])
const activeChannel = ref({})
const paymentChannelId = ref()
const getpaymentChannelList = async () => {
    let res = await paymentChannelList()
    payments.value = res.result
    const defaultChannel = res.result[0]
    activePay.value = defaultChannel
    activeChannel.value = defaultChannel?.availableChannelsRelation[0]
    paymentChannelId.value = activeChannel.value.paymentChannelId
}

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
const showBottom = computed({
    set(val) {
        emits("update:modelValue", val)
    },
    get() {
        return props.modelValue
    }
})
const select = (item) => {
    activeChannel.value = item
}
const payLoading = ref(false)
const confirm = async () => {
    payLoading.value = true
    let res = await createVipOrder({
        paymentChannelId: activeChannel.value.paymentChannelId,
        pageName: window.localStorage.getItem("_pageName") || "index.html",
        goodsId: props.cur_vip.goodsId
    })
    if (res.result.payUrl) {
        showBottom.value = false
        emits('payConfirm', res.result.payUrl)
        openLink(res.result.payUrl)
    } else {
        showToast({
            type: "fail",
            message: "发生错误请重新再试！"
        })
    }
    payLoading.value = false

}
const selectPayment = (item) => {
    if (activePay.value.paymentTypeId !== item.paymentTypeId) {
        activePay.value = item
        activeChannel.value = item?.availableChannelsRelation[0]
    }
}
onMounted(() => {
    getpaymentChannelList()
})
// watch(() => props.activeChannel, (val) => {
//     active.value = val.paymentChannelId
// })
</script>
<style lang="less" scoped>
.title {
    .name {
        font-family: PingFang SC;
        font-size: 16px;
        font-weight: 600;
        line-height: 22.4px;
        text-align: center;
        color: #333333;

    }
}

.content {
    .title {
        display: flex;
        align-items: center;
        font-family: PingFang SC;
        font-size: 13px;
        font-weight: 600;
        line-height: 18.2px;
        text-align: left;

        .fk {
            width: 3px;
            height: 14px;
            border-radius: 3px;
            background: #F83E3C;
            margin-right: 5px;
        }
    }

    .payBox {
        display: flex;
        align-items: center;
        flex-direction: column;

        .moneyPay {
            font-family: PingFang SC;
            font-size: 30px;
            font-weight: 600;
            line-height: 42px;
            text-align: left;
            color: var(--main-1, #F83E3C);


        }

        .classification {
            font-family: PingFang SC;
            font-size: 12px;
            font-weight: 400;
            line-height: 16.8px;
            text-align: left;

        }
    }
}
</style>