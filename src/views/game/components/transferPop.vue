<template>
    <van-overlay :show="showBottom">
        <div class="flex justify-center items-center h-full" @click.stop>
            <div class="h-[240px] w-[285px] bg-[#fff] rounded-[10px] px-[24px] py-[16px]">
                <div class="flex justify-between items-center">
                    <div></div>
                    <div>{{ title }}</div>
                    <div class="relative left-[16px]"><van-icon @click="showBottom = false" name="cross" color="#fff"
                            size="16px" /></div>
                </div>
                <div :class="{ 'flex-row-reverse': !forward }"
                    class="mt-[18px] flex justify-between h-[42px] border-[1px] border-[#D9D9D9] border-solid items-center rounded-[6px] px-[35px]">
                    <div>{{ name }}</div>
                    <div @click="forward = !forward"
                        class="w-[24px] h-[24px] rounded-[50%] bg-[#FF3E84] flex justify-center items-center"> <van-icon
                            name="exchange" size="15px" color="#fff" /></div>
                    <div>{{ activeManufacturer.name }}</div>
                </div>
                <div class="mt-[18px] h-[42px] border-[1px] border-[#D9D9D9] border-solid rounded-[6px]">
                    <van-field v-model="state.coin" type="number" placeholder="输入划转金额" :border="false"
                        class="!bg-[#fff] !pb-0 !pt-[4px] !rounded-t-[6px]"
                        style="--van-field-input-text-color:#979797" clearable>
                        <template #button>
                            <van-button @click="setCoin" size="small" class="text-[#FF3E84]" type="text">全部</van-button>
                        </template>
                    </van-field>
                </div>
                <div class="mt-[18px]">
                    <van-button @click="transfer" block
                        color="linear-gradient(90deg, #2D57CC 0%, #AC63FF 100%)">划转</van-button>
                </div>
            </div>
        </div>
    </van-overlay>
</template>
<script setup name="transferPop">
import { computed, ref } from 'vue'
import { CoinTransfer } from "@/service/game";
import { config } from '@/store/config'
import { showToast } from 'vant';
import { gameBalance } from '@/store/game'
import { $get, formatter } from '@/utils';
const configStore = config()
const GameBalance = gameBalance()
/**
 * 全局余额
 */
const gCoin = computed(() => $get(GameBalance, 'allBalance.coin'))
const GameNotify = computed(() => $get(configStore, 'configData.config.GameNotify', ''))
const props = defineProps({
    modelValue: {
        type: Boolean,
        required: true
    },
    activeManufacturer: {
        type: Object,
        required: true
    },
    manufacturerCoin: {
        type: String,
        required: true
    },
});
const name = '钱包'
const forward = ref(true)
const title = computed(() => forward.value ? `从${name}划转至${props.activeManufacturer.name}` : `从${props.activeManufacturer.name}划转至${name}`)
const emits = defineEmits(['update:modelValue']);
const showBottom = computed({
    set(val) {
        emits("update:modelValue", val)
    },
    get() {
        return props.modelValue
    }
})
const state = ref({
    coin: '',
    name: "",
})
const close = () => {
    emits("update:modelValue", false)
    forward.value = true
    state.value.coin = ''
}
const transfer = async () => {
    if (state.value.coin >= 0 ) return showToast({
        type: "fail",
        message: '请输入划转金额'
    })
    let res = await CoinTransfer({ ...state.value, direction: forward.value ? 0 : 1, id: props.activeManufacturer.id })
    if (res.code === 0) {
        GameBalance.getAllQueryBalance()
        showToast({
            type: "success",
            message: "划转成功"
        })
        close()
    } else {
        showToast({
            type: "fail",
            message: res.msg
        })
    }
}
const setCoin = () => {
    if (forward.value) {
        state.value.coin = gCoin.value
    } else {
        state.value.coin = props.manufacturerCoin
    }
}
</script>