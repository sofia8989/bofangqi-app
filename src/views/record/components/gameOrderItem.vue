<template>
    <div class="w-full h-[88px] rounded-[6px] bg-[#2B2B2B] text-[14px] mt-[8px] p-[10px] flex justify-between text-white font-normal">
        <div>
            <div class="text-[#787878] text-[12px]">订单号： {{ order.orderNo }}</div>
            <div class="font-semibold py-[6px]">{{ order.payChannelName || order.transactionType }}</div>
            <div class="font-normal">{{ type == 4 ? '充值' : '提现' }}</div>
        </div>
        <div>
            <div class="font-normal text-[#787878] text-[12px]">{{ formatTimeGame(order.createTime) }}</div>
            <div class="font-semibold py-[6px]" :style="{ 'color': statusData.color }">{{ statusData.name }}</div>
            <div class="font-semibold">¥{{ order.coinApply }}</div>
        </div>
    </div>
</template>
<script setup name="gameOrderItem">
import { formatTimeGame } from '@/utils/formatTime'
import { computed } from 'vue'
const props = defineProps({
    order: {
        type: Object,
        default: () => ({})
    },
    type: {
        type: Number,
        default: 4
    }
})
const statusData = computed(() => {
    switch (props.order.status) {
        case 1:
            return {
                color: '#ff7a19',
                name: "待处理"
            }
        case 2:
            return {
                color: '#1aac19',
                name: "成功"
            }
        case 3:
            return {
                color: '#fe2b54',
                name: "失败"
            }

        default:
            return {
                color: '#ff7a19',
                name: "待处理"
            }
    }
})
</script>