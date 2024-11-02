<template>
    <van-popup position="right" teleport="body" class="h-full w-full !overflow-hidden" v-model:show="showBottom">
        <NavHeader title="国内城市" :callBack="close"></NavHeader>
        <div class="bg-white scrollbar w-full h-[calc(100%-45px)] overflow-auto">
            <van-index-bar>
                <template v-for="item in data.city" :key="item.title">
                <van-index-anchor  :index="item.title" />
                <van-cell v-for="city in item.lists" :key="city" :title="city" @click="submit(city)" />
                </template>
            </van-index-bar>
        </div>
    </van-popup>
</template>
<script setup name="cityPop">
import { computed } from "vue";
import data from "@/data/city.js"
const props = defineProps({
    modelValue: Boolean
});
const emits = defineEmits(['update:modelValue', 'submit']);
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
const submit = (val) => {
    emits("submit", val)
    close()
}
</script>
<style lang="less" scoped>
:deep(.van-index-bar) {
    color: #fff;
    --van-cell-background: #212121;
    --van-index-anchor-sticky-background: #212121;
    --van-cell-text-color: #fff;
    --van-index-anchor-text-color: #fff;
    --van-cell-border-color: transparent;
}
</style>