<template>
    <van-popup position="right" teleport="body" class="h-full w-full !overflow-hidden !bg-white"
        v-model:show="showBottom">
        <NavHeader class="withdrawalPop" title="提现" :callBack="close">
            <template v-slot="left">
                <span class=" text-white" @click="$router.push({ name: 'withdrawalsRecord' })">提现记录</span>
            </template>
        </NavHeader>
        <div class="withdrawal px-[10px]">
            <van-notice-bar class="!h-[26px] rounded-[6px] !bg-[#fff]" color="#f47725"
            :left-icon="noticeBarIcon" :text="GameNotify" />
            <div
                class="w-full mt-[20px] h-[50px] pl-[20px] flex items-center bg-top bg-contain bg-no-repeat bg-[url(@/assets/images/game/balanceBg.png)]">
                <div>
                    <span class=" text-black text-[14px] font-normal mr-[3px]">钱包余额:</span>
                    <span class="text-[#1D1913] text-[18px] font-semibold">{{ gCoin }}</span>
                </div>
            </div>
            <div class="w-full mt-[6px] text-[#979797]" v-if="withdrawalType == 1">银行卡提现金额最低要求200元,并需为100的倍数流水需达到充值金额的一倍即可提现
            </div>
            <div class="w-full mt-[6px] text-[#979797]" v-else>USDT最低提现额度200元流水需达到充值金额一倍即可提现</div>
            <div class="text-[15px] text-white mt-[20px]">填写提现金额</div>
            <van-field v-model="state.coin" type="number" :border="false" :formatter="(val) => formatter(val, gCoin)"
                class="!bg-[#fff] h-[50px] rounded-[10px] mt-[11px]" style="--van-field-input-text-color:#979797;"
                clearable>
                <template #button>
                    <van-button size="small" class="text-[#F7931E]" type="text">全部</van-button>
                </template>
            </van-field>
            <template v-if="withdrawalType == 1">
                <div class="text-[15px] text-white mt-[20px]">填写收款人信息</div>
                <div class="flex justify-between">
                    <van-field v-model="state.accountName" type="text" placeholder="输入开户名" :border="false"
                        class="!bg-[#fff] h-[50px] flex-auto flex-shrink-0 flex-grow-0  mr-[10px] !w-[140px] rounded-[10px] mt-[11px]"
                        style="--van-field-input-text-color:#979797" clearable>
                    </van-field>
                    <van-field v-model="state.bankName" type="number" :maxlength="19" placeholder="选择开户行"
                        class="!bg-[#fff] h-[50px] flex-1 rounded-[10px] mt-[11px]"
                        style="--van-field-input-text-color:#979797" clearable>
                    </van-field>
                </div>
                <van-field v-model="state.accountNo" type="number" placeholder="输入银行卡号" :border="false"
                    class="!bg-[#fff] h-[50px] rounded-[10px] mt-[11px]" style="--van-field-input-text-color:#979797"
                    clearable>
                </van-field>
            </template>
            <template v-else>
                <div class="text-[15px] text-white mt-[5px]">提币协议</div>
                <div class="mt-[20px] grid grid-cols-2 gap-[10px]">
                    <div @click="state.usdtProtocol = item.vcProtocol"
                        class="w-full h-[50px] bg-[#fff] flex justify-center items-center text-[15px] text-[#979797] rounded-[10px] border-solid border-[1px] "
                        :class="[state.usdtProtocol == item.vcProtocol ? 'border-[#FF3E84]' : 'border-[#fff]']"
                        v-for="item in usdtProtocols" :key="item.vcProtocol">
                        <div :class="{ 'text-[#FF3E84]': state.usdtProtocol == item.vcProtocol }">{{ item.vcProtocolName }}
                        </div>
                    </div>
                </div>
                <div class="text-[15px] text-white mt-[20px]">输入数字货币地址</div>
                <van-field v-model="state.usdtAddress" type="text" placeholder="输入数字货币地址" :border="false"
                    class="!bg-[#fff] h-[50px] rounded-[10px] mt-[11px]" style="--van-field-input-text-color:#979797"
                    clearable>
                </van-field>
            </template>
        </div>
        <div class=" fixed bottom-[52px] w-full px-[10px]">
            <van-button @click="withdrawal" block
                color="linear-gradient(90deg, #2D57CC 0%, #AC63FF 100%)">立即提现</van-button>
        </div>
    </van-popup>
</template>
<script setup name="withdrawalPop">
import { computed, reactive, watch, ref } from "vue";
import { gameBalance } from '@/store/game'
import { $get, formatter } from "@/utils";
import { config } from '@/store/config'
import { GetbankList, Withdrawal, VcTypeBox } from "@/service/game"
import { showToast } from "vant";
import noticeBarIcon from "@/assets/images/notice-bar-icon.svg"
const GameBalance = gameBalance()
const configStore = config()
const props = defineProps({
    modelValue: {
        type: Boolean,
        required: true
    },
    withdrawalType: {
        type: Number,
        required: true
    },
});
/**
 * 全局余额
 */
const gCoin = computed(() => $get(GameBalance, 'allBalance.coin'))
const GameNotify = computed(() => $get(configStore, 'configData.config.GameNotify', ''))
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
const state = reactive({
    accountName: "",
    accountNo: "",
    bankName: "",
    coin: 0,
    usdtAddress: "",
    usdtProtocol: "",
})
const bankList = ref([])
const getbankList = async () => {
    let res = await GetbankList({})
    bankList.value = res.data
}
const usdtProtocols = ref([])
const getVcTypeBox = async () => {
    let res = await VcTypeBox()
    let list = $get(res, 'data', [])
    usdtProtocols.value = list.filter(item => item.payType === 'DIGITAL_CURRENCY')
    state.usdtProtocol = $get(usdtProtocols, 'value.0.vcProtocol')
}
const withdrawal = async () => {
    if (!state.coin) return showToast({
        type: "fail",
        message: '请输入提款金额'
    })
    if (props.withdrawalType === 0) {
        if (!state.usdtAddress) return showToast({
            type: "fail",
            message: '请输入提款地址'
        })
    } else {

    }
    let params = props.withdrawalType === 0 ? {
        coin: state.coin,
        usdtAddress: state.usdtAddress,
        usdtProtocol: state.usdtProtocol,
        withdrawalType: 0
    } : {
        coin: state.coin,
        accountName: state.accountName,
        accountNo: state.accountNo,
        bankName: state.bankName,
        withdrawalType: 1
    }
    let res = await Withdrawal(params)
    if (res.code === 0) {
        showToast({
            type: "success",
            message: '提款申请已发出，请耐心等待'
        })
        close()
    } else {
        showToast({
            type: "fail",
            message: res.msg
        })
    }

}
watch(() => props.modelValue, (val) => {
    if (val) {
        if (props.withdrawalType === 1 && bankList.value.length == 0) {
            getbankList()
        } else if (props.withdrawalType === 0 && usdtProtocols.value.length == 0) {
            getVcTypeBox()
        }
    } else {
        state.usdtProtocol = ''
    }
})

</script>
<style lang="less" scoped>
.withdrawal {
    :deep(.van-notice-bar__content) {
        color: #fff
    }
}
</style>
<style lang="less">
.withdrawalPop {
    .van-nav-bar__title {
        font-size: 18px;
    }
}
</style>