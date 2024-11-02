<template>
    <div
        class="actualDetail pt-1 text-black font-normal text-[12px] overflow-auto  bg-white w-full h-[calc(100%-46px)]">
        <SwipeImagePreview :list="state.prostitutePictureRelation" name="url"></SwipeImagePreview>
        <div class="rounded-[10px] py-[8px] px-[15px] mt-[10px] mx-[10px] bg-[#fff]">
            <div class="flex flex-col">
                <div class="text-[16px] font-semibold">{{ state.title }}</div>
                <div class="text-[#6A6A6A] text-[13px] min-w-[90px]">{{ (state?.createTime || '').substring(0, 10) }}</div>
            </div>
            <div class="text-[13px] pt-[7px] border-solid border-t-[1px] border-[#585858]">
                <template v-if="activeInfo.prostituteTypeId == 1">
                    <div>
                        <span>妹子年龄：</span>
                        <span>{{ state?.extension?.age }}</span>
                    </div>
                    <div>
                        <span>服务项目：</span>
                        <span>{{ state?.extension?.service }}</span>
                    </div>
                    <div>
                        <span>服务时间：</span>
                        <span>{{ state?.extension?.number }}小时</span>
                    </div>
                    <div>
                        <span>服务费用：</span>
                        <span>{{ state?.extension?.cost }}</span>
                    </div>
                </template>
                <template v-if="activeInfo.prostituteTypeId == 2">
                    <div>
                        <span>服务费用：</span>
                        <span class="text-[#FF60AD]"> {{ computePic(state?.extension) }}</span>
                    </div>
                    <div>
                        <span>服务项目：</span>
                        <span>{{ state?.extension?.service }}</span>
                    </div>
                </template>
                <template v-if="activeInfo.prostituteTypeId == 3">
                    <div>
                        <span>服务费用：</span>
                        <span class="text-[#FF60AD]"> {{ computePic(state?.extension) }}</span>
                    </div>
                    <div>
                        <span>性别：</span>
                        <span>{{ state?.extension?.gender }}</span>/
                        <span>年龄：</span>
                        <span>{{ state?.extension?.age }}</span>/
                        <span>身高：</span>
                        <span>{{ state?.extension?.height }}</span>
                    </div>
                </template>
            </div>
        </div>
        <div class="mt-[10px] rounded-[10px] py-[8px] px-[15px] mx-[10px] bg-[#fff]">
            <div class="pb-[8px]">
                <img class="w-[81px]" src="@/assets/images/actual/connect.png" alt="" srcset="">
            </div>
            <div v-if="isVip" class=" flex justify-between items-center">
                <div>
                    <div>
                        <span>详细地址：</span>
                        <span>{{ computeStr(state?.address) }}</span>
                    </div>
                    <div>
                        <span>联系方式：</span>
                        <span>{{ computeStr(state?.contact) }}</span>
                    </div>
                </div>
                <div class="px-[10px] text-[#FF60AD] h-[37px] text-[12px] btn-reserve text-center"
                    @click="checkData(state)">
                    查看联系方式
                </div>
            </div>
            <div v-else class="flex justify-between">
                <van-button color="linear-gradient(90deg, #F5678B 0%, #F755C8 100%)" block
                    @click="$router.push({name:'recharge'})" class="!mr-[5px]">会员解锁</van-button>
                <van-button  color="linear-gradient(90deg, #FF8E3D 0%, #FFA901 100%)" block
                    @click="$router.push({name:'share'})">分享解锁</van-button>
            </div>
        </div>
        <div class="mt-[10px] rounded-[10px] py-[8px] px-[15px] mx-[10px] bg-[#fff]">
            <div class="pb-[8px]">
                <img class="w-[81px]" src="@/assets/images/actual/report.png" alt="" srcset="">
            </div>
            <div>
                {{ state.content }}
            </div>
        </div>
        <div class="h-[20px]"></div>
        <van-dialog v-model:show="show" teleport="body" class="!bg-transparent" :show-confirm-button="false">
            <div class="w-full m-auto relative mt-[90px]">
                <van-icon class="!absolute right-[13px] top-[6px]" color="#fff" name="close" size="30" @click="show = false" />
                <img class="mb-[15px] w-[300px] h-[450px] m-auto" src="@/assets/images/actual/d_bg.png" alt="" srcset="">
                <img @click="confirm" class="w-[185px] m-auto absolute bottom-[12px] left-[74px]"
                    src="@/assets/images/actual/d_btn.png" alt="" srcset="">
            </div>
        </van-dialog>
    </div>
</template>
<script setup>
import { computed, ref, onMounted } from "vue";
import { config } from '@/store/config'
import SwipeImagePreview from "@/components/SwipeImagePreview.vue";
import { copyString, $clickAd, openLink, $get, randomCount, getImgUrl } from "@/utils"
import { prostituteClick, getProsituteDetail } from "@/service/prostituteApi";
const props = defineProps({
    id: {
        type: Number,
        required: true
    },
    activeInfo: {
        type: Object,
        required: true
    }
});
const state = ref({})
const getDetail = async () => {
    let res = await getProsituteDetail({ prostituteId: props.id })
    state.value = { ...res.result, distance: randomCount(1, 30) / 10 }
}
const configStore = config()
const isVip = computed(() => $get(configStore, "deviceUser.userGroupId", 1) == 3)
const xlProstituteType = computed(() => $get(configStore, 'templateData.xlProstituteType.adList', []))
const show = ref(false)
const showText = ref(false)


const computePic = (extension = {}) => {
    let str = ''
    if (extension.cost) {
        str = extension.cost
    } else {
        str = `${extension.costP}/p,${extension.cost2P}/2p,${extension.costN}/包夜`
    }
    return str
}
const computeStr = (str) => {
    if (showText.value) return str
    let _str = '********'
    if (str) {
        _str = str.substring(0, 3) + '******' + str.substring(str.length - 3, str.length)
    }
    return _str
}
const checkData = (item) => {
    if (item.type == 'Ad') {
        show.value = true
        $clickAd(item.prostituteType, 'relatedAdId')
    } else {
        let str = `地址：${item.address}  联系方式：${item.contact}`
        copyString(str)
        showText.value = true
        prostituteClick({ prostituteId: item.prostituteId })
    }
}
const confirm = () => {
    let id = state?.value.prostituteType?.relatedAdId
    let url = xlProstituteType.value.find(item => item.adId == id)?.url || ''
    if (url) {
        openLink(url)
    }
    show.value = false
}

onMounted(() => {
    getDetail()
})
</script>
<style lang="less" scoped>
.btn-reserve {
    border: 0.5px solid #f47725;
    line-height: 35px;
    border-radius: 6px;
}


:deep(.van-dialog) {
    &.d-bg {
        --van-dialog-background: transparent !important;
    }
}

.bg-distance {
    background: linear-gradient(69.79deg, #DE43D2 22.69%, #E41B79 81.62%);
}
</style>