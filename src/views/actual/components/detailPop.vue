<template>
    <van-popup position="right" teleport="body" class="h-full w-full !overflow-hidden !bg-white"
        v-model:show="showBottom">
        <NavHeader :title="activeInfo.title" :callBack="close"></NavHeader>
        <van-swipe vertical :show-indicators="false" @change="change" class="h-full" :loop="false" lazy-render
            ref="swipeRef">
            <van-swipe-item v-for="id in state.list" :key="id">
                <detailItem :id="id" :activeInfo="activeInfo"></detailItem>
            </van-swipe-item>
        </van-swipe>
    </van-popup>
</template>
<script setup name="detailPop">
import { computed, reactive, watch } from "vue";
import { getProstituteList } from "@/service/prostituteApi";
import detailItem from "@/views/actual/components/detailItem.vue";
const props = defineProps({
    modelValue: {
        type: Boolean,
        required: true
    },
    id: {
        type: Number,
        required: true
    },
    activeInfo: {
        type: Object,
        required: true
    }
});
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
    list: new Set(),
    page: 1,
    total: 0
})
// 加载数据
const get_prostitute_list = async () => {
    const res = await getProstituteList({
        prostituteTypeId: props.activeInfo?.prostituteTypeId,
        prostituteTypeKey: props.activeInfo?.prostituteTypeKey,
        page: state.page,
        pageSize: 20
    })
    let list = res.result?.list || []
    list = list.forEach(item => {
        state.list.add(item.prostituteId)
    })
    state.total = res.result?.total
}
const change = (index) => {
    if ((state.list.size - (index + 1)) <= 1 && state.total > state.list.size) {
        state.page++
        get_prostitute_list()
    }
}
watch(() => props.modelValue, (val) => {
    if (val) {
        state.list.add(props.id)
        get_prostitute_list()
    } else {
        state.list.clear()
        state.page = 1
        state.total = 0
    }
})
</script>
<style lang="less" scoped>
.btn-reserve {
    border: 0.5px solid #FF60AD;
    line-height: 37px;
    border-radius: 6px;
}

.bg-distance {
    background: linear-gradient(69.79deg, #DE43D2 22.69%, #E41B79 81.62%);
}
</style>