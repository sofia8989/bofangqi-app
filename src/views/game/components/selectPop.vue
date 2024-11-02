<template>
    <van-popup v-model:show="showBottom" class="!bg-[#fff] text-white scrollbar !overflow-y-hidden" position="bottom"
        round :style="{ height: '50%' }" teleport="body" close-on-click-overlay>
        <div class="w-full text-center text-[16px] py-[18px] px-[19px] flex justify-between">
            <div></div>
            <div class="text-center ">{{ title }}</div>
            <div><van-icon class="" name="close" color="#fff" size="16" @click="showBottom = false" /></div>
        </div>
        <div class="w-full h-full overflow-y-auto scrollbar mt-[20px] px-[19px]">
            <div v-for="item in aisleList" :key="item.id" @click="select(item)"
                class="flex justify-between items-center mb-[16px] px-[12px] bg-[#2F2E2E] rounded-[6px] h-[48px]">
                <div class="flex items-center text-[15px]">
                    <img class="w-[24px] h-[24px] mr-[6px]" :src="item.icon" alt="">
                    <span>{{ item.payChannelShowName }}</span>
                </div>
                <van-icon size="18px" name="arrow" />
            </div>
            <div class="h-[165px]"></div>
        </div>
        <div class="!absolute bottom-0 px-[23px] w-full h-[85px] bg-[#fff] py-[8px]">
            <ul class="ml-[4px] text-[12px]">
                <li>1.出现风险提示请不用担心，重新支付即可。</li>
                <li>2.当前支付通道无法付款时请选择其他支付方式。</li>
                <li>3.付款遇到其他问题请联系 <span class="text-[#FF3E84]">在线客服</span> 处理。</li>
            </ul>
        </div>
    </van-popup>
</template>
<script setup name="selectPop">
import { computed, ref, watch } from "vue";
const props = defineProps({
    aisleList: {
        type: Array,
        default: () => ([])
    },
    modelValue: {
        type: Boolean,
        default: false
    },
    title: {
        type: String,
        default: ''
    },
})
const emits = defineEmits(['update:modelValue', 'select'])
const active = ref()
const showBottom = computed({
    set(val) {
        emits("update:modelValue", val)
    },
    get() {
        return props.modelValue
    }
})
const select = (item) => {
    emits("select", item)
}
</script>