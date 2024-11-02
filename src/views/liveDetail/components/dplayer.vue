<template>
    <div class="w-full h-full relative text-white">
        <div class="w-full h-full liveDetail" :id="`liveDetail${id}`" ref="liveRef"></div>
        <div class="absolute top-[8px] h-[33px] w-full  flex justify-between items-center pl-[9px] pr-[14px]">
            <div class="bg-left-bg rounded-[39px] h-full flex items-center px-[5px]">
                <img class="w-[26px] h-[26px] rounded-[50%] " v-olazyload="getImgUrl(state?.liveDetail, 'streamerAvatar')" alt=""
                    srcset="">
                <span class="px-[4px]">{{ state?.liveDetail?.streamerNickname }}</span>
                <van-button class="!h-[24px] !px-[7px] !rounded-[20px] !text-[11px]"
                    color="linear-gradient(90deg, #2D57CC 0%, #AC63FF 100%)">关注</van-button>
            </div>
            <div class="flex justify-end items-center">
                <div class="bg-black/30 px-[7.5px] rounded-[21px] h-[26px] flex items-center mr-[8px]">{{
                    state?.liveDetail?.liveViewers }}</div>
                <van-icon class="z-[100]" size="16px" color="#fff" @click="$router.push({ name: 'home' })" name="cross" />
            </div>
        </div>
        <div class="absolute bottom-[34px] ml-[6px]">
            <div class="p-[6px] w-[285px] rounded-[8px] bg-black/50 mb-[6px] text-[11px] font-normal text-[#36E9CB]">{{
                state?.announcement }}</div>
            <div class="p-[6px] w-[302px] rounded-[8px] bg-black/50 flex  flex-auto flex-shrink-0 flex-grow-0">
                <span
                    class="block flex-1 text-[10px] rounded-[20px] px-[6px] m-[3px] font-normal whitespace-nowrap h-[14px] bg-[#27BFE9] mr-[4px]">系统</span>
                <div class="line-h" @click="$clickAd(xlLiveText)">
                    <span>主播上传了</span>
                    <span class="text-[#EF8727]">自己的联系方式,</span>
                    <span class="text-[#E5D21E]">立即解锁Ta的名片</span>
                    <span>
                        于主播关系更近一步！
                    </span>
                </div>
            </div>
        </div>
        <div class="absolute bottom-[109px] w-[65px] right-[6px] z-[11]" v-if="xlLiveFloat.length > 0">
            <div class="mb-[24px]" v-for="item in xlLiveFloat.slice(0, 2)" :key="item.adId">
                <img @click="$clickAd(item)" class="w-full" v-olazyload="getImgUrl(item)" alt="">
            </div>
        </div>
        <div v-if="showOpenVip" @touchstart.stop
            class="z-10 absolute top-0 left-0 bg-black/70 w-full h-full flex justify-center items-center">
            <div class="flex justify-center flex-col flex-auto flex-shrink-0 flex-grow-0 items-center">
                <div class="font-semibold text-white mb-[17px]">立即开通会员，美女直播随意看</div>
                <div>
                    <van-button @click="$router.push({ name: 'share' })"
                        class="w-[120px] text-[12px] !px-0 !border-solid !border-[1px] !border-[#979797] !mr-[14px]"
                        color="transparent">分享好友领VIP</van-button>
                    <van-button @click="$router.push({ name: 'recharge' })" class="w-[120px]"
                        color="linear-gradient(69.79deg, #DE43D2 22.69%, #E41B79 81.62%)">立即开通VIP</van-button>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup name="livedplayer">
import Hls from 'hls.js'
import DPlayer from 'dplayer'
import { ref, onMounted, computed, shallowRef, onBeforeUnmount } from 'vue'
import { getLiveDetail } from "@/service/liveApi";
import { getImgUrl, $clickAd, $get, randomCount, $set } from '@/utils';
import { config } from '@/store/config'
import { watch } from 'vue';
import { useRoute } from "vue-router"
import { global } from '@/store/global'
const props = defineProps({
    id: {
        type: Number,
        required: true
    },
    active: {
        type: Number,
        required: true
    }
})
const route = useRoute()
const configStore = config()
const globalStore = global()
/**
 * @description 直播漂浮
 */
const xlLiveFloat = computed(() => $get(configStore, 'templateData.xlLiveFloat.adList', []))
/**
 * @description 文字广告
 */
const xlLiveText = computed(() => $get(configStore, 'templateData.xlLiveText.adList.0', {}))
// const isVip = computed(() => $get(configStore, "deviceUser.userGroupId", 1))

const liveRef = shallowRef()
const showOpenVip = ref(false)
const state = ref({})
let dp;
const getlivedetail = async () => {
    let res = await getLiveDetail({ liveId: props.id })
    let data = res?.result || {}
    $set(data, 'liveDetail.liveViewers', randomCount(10, 300))
    state.value = data
    !globalStore.showRechargeDialog && initDplayer()
}
const initDplayer = async () => {
    // if (window.localStorage.getItem("_live_id") && !isVip.value) {
    //     showOpenVip.value = true
    //     return
    // }
    // if (!isVip.value) {
    //     window.localStorage.setItem("_live_id", $get(state, 'value.liveDetail.liveId', 1))
    // }
    const liveUrl = state.value.liveDetail.liveUrl
    if (!liveRef.value || !liveUrl) return
    let autoplay = +$get(route,'params.id',0) == props.id
    dp = new DPlayer({
        container: liveRef.value,
        preload: 'metadata',
        autoplay,
        live: true,
        theme: '#2C2A2A',
        loop: false,
        screenshot: true,
        airplay: true,
        chromecast: true,
        hotkey: true,
        volume: 0,
        mutex: true,
        lang: 'zh-cn',
        video: {
            url: liveUrl,
            // pic: pic,
            type: 'customHls',
            customType: {
                customHls: function (video, player) {
                    const hls = new Hls()
                    hls.loadSource(video.src || liveUrl)
                    hls.attachMedia(video)
                    hls.on(Hls.Events.MANIFEST_LOADED, () => {
                        if (props.active == props.id) {
                            video.play()
                        }
                    })
                }
            }
        }
    })
    // dp.on('timeupdate', () => {
    //     let curTime = dp.video.currentTime
    //     if (!isVip.value && curTime >= 60) {
    //         dp.pause()
    //         showOpenVip.value = true
    //         return
    //     }
    // })
}
watch(() => props.active, (val) => {
    dp && dp.pause()
    if (props.id == val) {
        dp && dp.play()
    }
})
onMounted(() => {
    getlivedetail()
})
onBeforeUnmount(() => {
    dp && dp.destroy()
})
</script>
<style scoped lang="less">
.liveDetail {
    :deep(.dplayer-controller) {
        display: none !important;
    }

    :deep(.dplayer-video-wrap) {
        background: rgba(0, 0, 0, 0.7);
    }
}

.bg-left-bg {
    background: linear-gradient(89.86deg, rgba(0, 0, 0, 0.36) 3.83%, rgba(217, 217, 217, 0) 98.61%);
}
</style>