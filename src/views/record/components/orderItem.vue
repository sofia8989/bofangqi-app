<template>
    <div class="w-full h-[100px] rounded-[6px] mt-[8px] p-[10px]" style="border-bottom:1px solid #F0F0F0 ;">
        <div class="flex justify-between text-[#787878] font-normal">
            <div class="ddNum">
                订单号：<span class="num">{{order.orderNo}}</span>
                <div class="copy" @click="copyUrl(order.orderNo)">复制</div>
            </div>
            <div>{{ order.createTime }}</div>

        </div>
        <div class="flex justify-between text-[#2F2F42] text-[14px] pt-[6px]">
            <div class="font-semibold">{{ order.goodsName }}</div>
        </div>
        <div class="flex justify-between text-[#2F2F42] text-[14px] pt-[6px] succedBox">
            <div class="font-semibold succed">支付状态：<span class="succedCG">{{order.statusText}}</span></div>
            <div class="font-normal text-[#333333]">金额<span style="font-weight: 600;">¥{{ order.amount }}</span></div>
        </div>
    </div>
</template>
<script setup name="orderItem">
import { copyString } from '@/utils'
const props = defineProps({
    order: {
        type: Object,
        default: () => ({})
    }
    
})
const copyUrl = (url) => {
  copyString(url)
}
</script>
<style lang="less" scoped>
.ddNum {
    display: flex;
    font-family: PingFang SC;
    font-size: 12px;
    font-weight: 400;
    line-height: 16.8px;

    .num {
        width: 120px;
        overflow: hidden;
        color: #F83E3C;
    }
    .copy {
        color: #484DA0;
        margin-left: 10px;
        text-decoration: underline;
    }

  
}
.succedBox {
        .succed {
            font-family: PingFang SC;
            font-size: 12px;
            font-weight: 400;
            line-height: 16.8px;
            text-align: left;

            .succedCG {
                font-family: PingFang SC;
                font-size: 12px;
                font-weight: 600;
                line-height: 16.8px;
                text-align: left;
                color: #15D504;

            }

        }

    }
</style>