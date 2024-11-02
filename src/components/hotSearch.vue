<template>
    <div class="px-[10px] pt-[7px] pb-[28px] bg-black/80">
        <div class=" text-[14px] font-normal text-white mb-[5px]">大家都在搜</div>
        <div v-if="searchList.length > 0" class="flex flex-wrap flex-auto flex-grow-0 flex-shrink-0">
            <div @click="hanldClick(item)"
                class="flex justify-center items-center h-[36px] px-[18px] mb-[10px] mr-[10px] text-[#969696] bg-[#fff]"
                v-for="item in searchList" :key="item">
                <span class="text-[#EC366E]" v-if="item.adId">{{ item.adName }}</span>
                <span v-else>{{ item }}</span>
            </div>
        </div>
        <div v-else class="text-white  text-center text-[14px]">暂无数据.....</div>
    </div>
</template>
<script setup>
import { ref, computed, onMounted } from 'vue'
import { reqsearchKeyWords } from '@/service/community'
import { config } from '@/store/config'
import { $clickAd, $get, inject_video } from '@/utils';
const configStore = config()
/**
* @description 文字广告
*/
const xlHomeTextList = computed(() => $get(configStore, 'templateData.xlHomeTextList.adList', []))
const hotSearch = ref([])
const searchList = computed(() => inject_video(hotSearch.value, xlHomeTextList.value, 3).slice(0, 24))
const emits = defineEmits(['search'])
const get_keyword = async () => {
    let res = await reqsearchKeyWords()
    hotSearch.value = res?.result || []
}
const hanldClick = (item) => {
    if (item.adId) {
        $clickAd(item)
    } else {
        emits("search", item)
    }
}
onMounted(() => {
    get_keyword()
})
</script>