<template>
    <div v-if="modelValue" class="absolute right-[10px] bottom-[1.92rem] -translate-y-[10px] h-[104px] w-[104px]">
        <div class="absolute -top-[14px] -right-[11px]">
            <img class="w-[26px]" src="@/assets/images/close.png" alt="" @click="close">
        </div>
        <img @click="$clickAd(data)" class="w-full" v-if="getImgUrl(data)" v-olazyload="getImgUrl(data)" alt="">
    </div>
</template>

<script setup>
import { $clickAd, getImgUrl } from "@/utils"
const props = defineProps({
    data: {
        type: Object,
        default: () => ({})
    },
    modelValue: {
        type: Boolean,
        default: false
    }
})
const emits = defineEmits(['update:show'])
const close = () => {
    emits("update:modelValue", false)
}
</script>