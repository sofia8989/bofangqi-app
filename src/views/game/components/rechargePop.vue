<template>
    <van-popup position="right" teleport="body" class="h-full w-full !overflow-hidden !bg-white"
        v-model:show="showBottom">
        <NavHeader class="rechargePop" :title="title" :callBack="close">
            <template v-slot="left">
                <span class=" text-white" @click="$router.push({ name: 'rechargeGameRecord' })">充值记录</span>
            </template>
        </NavHeader>
        <div class="px-[10px]">
            <div
                class="w-full mt-[20px] h-[50px] pl-[20px] flex items-center bg-top bg-contain bg-no-repeat bg-[url(@/assets/images/game/balanceBg.png)]">
                <div>
                    <span class=" text-black text-[14px] font-normal mr-[3px]">钱包余额:</span>
                    <span class="text-[#1D1913] text-[18px] font-semibold">{{ gCoin }}</span>
                </div>
            </div>
            <div class="my-[14px]">
                <div class="text-[14px] text-white mb-[6px]">请选择充值金额</div>
                <div class="grid grid-cols-3 gap-[10px]">
                    <div v-for="item in amount_list" @click="coin = item.amount"
                        :class="{ ' border-[#FF3E84]': coin === item.amount }"
                        class="w-[110px] h-[120px] rounded-[10px] bg-[#fff] flex flex-col justify-between items-center border-solid border-[1px]">
                        <div
                            class="w-full rounded-tl-[10px] h-[30px] rounded-tr-[10px]  text-center bg-color text-white text-[12px] font-medium">
                            {{ item.actType === '0' ? `首存赠${item.actValue}天VIP` : `首存赠${item.actValue}游戏币` }}
                        </div>
                        <div class="flex flex-col items-center justify-between">
                            <img class="w-[28px]" src="@/assets/images/game/gold.png" alt="">
                            <div class=" text-white text-[16px] font-semibold">{{ item.amount }}</div>
                        </div>
                        <div class="pb-[7px] text-[#888888] text-[14px] font-normal">游戏币</div>
                    </div>
                </div>
            </div>
            <van-button @click="getPayOnLineList" block
                color="linear-gradient(90deg, #2D57CC 0%, #AC63FF 100%)">立即支付</van-button>
        </div>
        <selectPop v-model="show" title="选择支付方式" @select="select" :aisleList="aisleList" />
        <payConfirmPOp v-model="confirmShow" @confirm="ofnlinePay"
            :state="{ amount: coin, payChannelShowName: payItem.payChannelShowName }" />
    </van-popup>
</template>
<script setup name="withdrawalPop">
import { computed, reactive, ref, onMounted, watch } from "vue";
import { gameBalance } from '@/store/game'
import { $get, formatter, openLink } from "@/utils";
import { AmountList, PayOnLineList, OnlinePay } from "@/service/game"
import { showToast } from "vant";
import selectPop from '@/views/game/components/selectPop.vue'
import payConfirmPOp from '@/views/game/components/payConfirmPOp.vue'
const GameBalance = gameBalance()
const props = defineProps({
    modelValue: {
        type: Boolean,
        required: true
    },
    title: {
        type: String,
        required: true
    }
});
/**
 * 全局余额
 */
const gCoin = computed(() => $get(GameBalance, 'allBalance.coin'))
const emits = defineEmits(['update:modelValue']);
const showBottom = computed({
    get() {
        return props.modelValue;
    },
    set() {
        close();
    },
});
const close = () => {
    emits("update:modelValue", false)
}
const coin = ref(0)
const payItem = ref({})
const amount_list = ref([])
const show = ref(false)
const aisleList = ref([])
const confirmShow = ref(false)
const getAmountList = async () => {
    let res = await AmountList({})
    amount_list.value = res.data
    coin.value = $get(res, 'data.0.amount')
}
const getPayOnLineList = async () => {
    let res = await PayOnLineList({ coin: coin.value })
    aisleList.value = res.data
    show.value = true
}
const select = (item) => {
    payItem.value = item
    confirmShow.value = true
}
const ofnlinePay = async () => {
    let res = await OnlinePay({ payAmount: coin.value, id: payItem.value.id })
    if (res.code === 0) {
        openLink(res.data.url)
        confirmShow.value = false
    } else {
        showToast({
            type: "fail",
            message: res.msg
        })
    }
}
watch(() => props.modelValue, (val) => {
    if (val && amount_list.value.length == 0) {
        getAmountList()
    }
})


onMounted(() => {

})
</script>
<style lang="less" scoped>
.bg-color {
    background: linear-gradient(90deg, #2D57CC 0%, #AC63FF 100%);
    line-height: 30px;
}
</style>
<style lang="less">
.rechargePop {
    .van-nav-bar__title {
        font-size: 18px;
    }
}
</style>