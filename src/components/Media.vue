<template>
    <div class="text-white" v-if="videoList.length > 0">
        <titleItem :title="mediaItem.typeName" />
        <div class="grid gap-y-[8px] gap-x-[10px] grid-cols-2 pt-0 px-[10px]">
            <DetailItem v-for="(item, i) in videoList" :item="item" :key="item.vodId || item.adId || i">
            </DetailItem>
        </div>
        <div class="grid gap-y-[8px] gap-x-[10px] grid-cols-2 pt-[16px] px-[10px]">
            <button @click="status = !status"
                class="bg-[#fff] rounded-[6px] relative text-[14px] h-[39px] w-[173px] flex justify-center items-center">
                <svg-icon name="change-icon" color="#FF3E84"
                    class="w-[12px] h-[12px] mr-[4px] relative top-[2px]"></svg-icon>
                <span>换一换</span>
            </button>
            <button @click="goHome"
                class="bg-[#fff] rounded-[6px] relative text-[14px] h-[39px] w-[173px] flex justify-center items-center">
                <span>查看更多</span>
                <svg-icon name="go-iocn" color="#FF3E84"
                    class="w-[12px] h-[12px] ml-[4px] relative top-[2px]"></svg-icon>
            </button>
        </div>
    </div>
</template>
<script setup name="Media">
import { ref, onMounted, computed } from "vue";
import titleItem from "@/views/home/components/titleItem.vue";
import { $get, setVideoType } from "@/utils";
import { useRouter } from "vue-router";
const props = defineProps({
    mediaItem: {
        type: Object,
        default: () => ({})
    }
})
const router = useRouter()
const goHome = () => {
    router.push({ name: 'home', params: { typeId: $get(props, 'mediaItem.typeId') } })
}
const status = ref(false)
const videoList = computed(() => {
    let list = $get(props, 'mediaItem.videoList', [])
    return setVideoType(status.value ? list.slice(0, 7) : list.slice(7))
})

</script>