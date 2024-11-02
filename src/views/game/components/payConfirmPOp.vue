<template>
    <van-popup position="right" teleport="body" class="h-full w-full !overflow-hidden !bg-white"
        v-model:show="showBottom">
        <NavHeader class="withdrawalPop" title="支付确认" :callBack="close"></NavHeader>
        <div class="bg-[#2B2B2B] text-[#787878] tex-[14px] font-normal px-[20px] py-[10px]">
            <div class="flex justify-between items-center h-[42px]">
                <div>充值内容</div>
                <div class="text-white">游戏币</div>
            </div>
            <div class="flex justify-between items-center h-[42px]">
                <div>充值金额</div>
                <div class="text-white">{{ state.amount }}</div>
            </div>
            <div class="flex justify-between items-center h-[42px]">
                <div>充值方式</div>
                <div class="text-white">{{ state.payChannelShowName }}</div>
            </div>
        </div>
        <div class="text-center text-[#FF3E84] my-[10px] px-[35.5px]">
            请尽快发起支付，否则可能失效，支付成功后，一般会在10分钟内到账，如未到账请退出重进或联系客服！
        </div>
        <div class="px-[10px]">
            <van-button @click="confirm" block
                color="linear-gradient(90deg, #2D57CC 0%, #AC63FF 100%)">立即充值</van-button>
        </div>
          
   
    </van-popup>
</template>
<script setup name="withdrawalPop">
import { computed, reactive, watch, onMounted } from "vue";
import { gameBalance } from '@/store/game'
import { $get, formatter } from "@/utils";
import { showToast } from "vant";
const GameBalance = gameBalance()
const props = defineProps({
    modelValue: {
        type: Boolean,
        required: true
    },
    state: {
        type: Object,
        required: true
    },
});
const emits = defineEmits(['update:modelValue', 'confirm']);
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
const confirm = () => {
    emits("confirm")
}



onMounted(() => {
    // if (props.withdrawalType == 1) {
    //     getbankList()
    // }
})
</script>
