<template>
    <div v-if="showMainDialog" class="fixed w-[100vw] h-[100vh] z-[1000] top-0 left-0">
        <div
            class="absolute top-[40%] translate-x-[-50%] translate-y-[-50%] left-[50%]  w-[290px] h-[158px] rounded-[30px] bg-white/100"
             style="border: 1px solid #ccc; border-radius: 30px;border: 1px solid #ccc;">
             <img src="../assets/images/mine/back.svg" class=" w-[100%]" style="position: absolute;top:0px;left: 0;" />
             <img src="../assets/images/mine/close.svg" class="close" style="position: absolute;top:10px;right: 10px;z-index: 99;" @click="colse()"/>
            <div class="pt-[80px] pb-[55px] px-[14px] border-radius: 20px;border: 1px solid #ccc;}">
                <div v-if="route.name == 'short-video'" class="text-white text-[16px] text-center font-normal">
                    今日免费次数还剩<span class="text-[#E7166B]">0</span>次
                </div>
                <div v-else class="text-black text-[16px] text-center font-normal text" 
                 style="position: absolute;top:40px;left:0;text-align: center;width: 100%;">立即分享好友，美女直播随意看</div>
                <div class="flex  py-[15px] text-[10px]" style="padding: 0 0px;justify-content: center;">
                  
                    <van-button @click="shareShow = true" class="!text-white w-[130px] h-[40px] rounded-[20px] "
                        color="#F83E3C">
                        分享好友免费看
                    </van-button>
                </div>
            </div>
            <!-- <div class="w-full relative bottom-[0px] flex justify-center">
                <div @click="colse()" class=" reative bottom-[0px] flex justify-center w-[30px] h-[30PX]"
                    style="background-color: #F1F1F1;border-radius: 50%;display: flex;justify-content: center;align-items: center;">
                    <img src="../assets/images/search/clean.svg" />
                </div>
            </div> -->

        </div>



        <div v-if="route.name == 'short-video'"
            class="absolute bottom-0 w-full h-[195px] bg-[#120E0D] pt-[32px] pb-[58px]">
            <div class="text-black text-[15px] text-center">
                您今日的免费观影次数已用完此时段无法观看
            </div>
            <div class="flex items-center justify-center pt-[12px] pb-[40px]">
                <div class="w-[43px] h-[1px] bg-[#D9D9D9]"></div>
                <div class="text-[#D9D9D9] px-[5px]">已享受免费福利</div>
                <div class="w-[43px] h-[1px] bg-[#D9D9D9]"></div>
            </div>
            <div class="text-[#D9D3B4] text-center">请前往开通会员即可观看！</div>
        </div>
        <sharePop v-model="shareShow" />
    </div>
</template>

<script setup name="NoVipDialog">
import { watch, ref, computed } from 'vue';
import { global } from '@/store/global';
import { config } from '@/store/config'
import { useRouter, useRoute } from 'vue-router'
import { $get, $clickAd } from '@/utils';
import sharePop from '@/views/mine/components/sharePop.vue'
import { rule } from 'postcss';
const globalStore = global()
const router = useRouter()
const route = useRoute()
const configStore = config()
const showMainDialog = computed(() => globalStore.showRechargeDialog)

const DownloadPageUrl = $get(configStore, 'appConfig.DownloadPageUrl', "")
/**
 * @description 详情返回
 */
const shareShow = ref(false)
const colse = (name) => {
    globalStore.showRechargeDialog = false

    // if (name!='') {
    //     shareShow.value=true
    //     console.log(shareShow.value,'++++')
    // }
}
const download = () => {
    globalStore.showRechargeDialog = false
    let ad = {}
    if (route.name == 'liveDetail') {
        ad = $get(configStore, 'templateData.xlLiveInduce.adList.0', {})
    } else if (route.name == 'short-video') {
        ad = $get(configStore, 'templateData.xlShortInduce.adList.0', {})
    }
    ad.adId && $clickAd(ad)
}
watch(() => route.name, (val) => {
    globalStore.showRechargeDialog = false
})
</script>
<style lang="less">
.van-dialog.novip-dialog {
    width: 100%;
    margin: 0;
    max-width: none;
    border-radius: 0;
    overflow: inherit;
    --van-dialog-background: transparent;
}

.text {
    font-family: PingFang SC;
    font-size: 14px;
    font-weight: 400;
    line-height: 19.6px;
    text-align: center;

}
</style>
