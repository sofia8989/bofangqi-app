<template>
    <van-swipe :autoplay="3000" :show-indicators="false" class="col-span-2" v-if="item.length">
        <van-swipe-item v-for="ad of item" :key="ad.adId">
            <img @click="$clickAd(ad)" class="bg-no-repeat w-full h-[92px] rounded-[5px]" v-olazyload="getImgUrl(ad)" />
        </van-swipe-item>
    </van-swipe>
    <div v-else class="relative" @click="$router.push({ name: 'liveDetail', params: { id: item.liveId } })">
        <img class="w-[175px] h-[125px] rounded-[10px] object-cover" alt="" v-olazyload="getImgUrl(item, 'liveCover')" srcset="">
        <!-- <div class="absolute top-[3px] left-[3px] rounded-[20px] px-[6px] flex justify-between items-center bg-black/40">
            <img class="w-[13px] h-[10px] mr-[2.5px]" src="@/assets/images/diamond-icon.png" alt="" srcset="">
            <span>{{ item.diamond_count }}钻石/分钟</span>
        </div>  -->
        <div class="absolute w-full h-[48px] top-[77px] bg-live px-[9px] flex justify-between">
            <div>
                <div class="text-[14px] w-[115px] left-[10px] font-normal overflow-hidden whitespace-nowrap text-ellipsis">
                    {{ item.liveTitle }}</div>
                <div class="text-[12px] left-[10px] flex items-center">
                    <img class="w-[12px] h-[12px] mr-[4px]" src="@/assets/images/gifzhibo.gif" alt="" srcset="" />
                    <span class="text-[12px]">{{ item.streamerNickname }}</span>
                </div>
            </div>
            <div class="flex items-center pt-[14px]">
                <div class="w-[4px] h-[4px] rounded-[50%] mr-[5px] bg-[#F78F22]"></div>
                <div class="text-[11px]">{{ item.liveViewers }}</div>
            </div>
        </div>
    </div>
</template>
<script setup name="liveItem">
import { getImgUrl } from '@/utils';
const props = defineProps({
    item: {
        type: Object,
        default: () => ({})
    }
})
</script>
<style lang="less" scoped>
.bg-live {
    background: linear-gradient(0deg, #000000 28.85%, rgba(0, 0, 0, 0) 98.08%);
}
</style>