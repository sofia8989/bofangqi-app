<template>
    <van-popup position="right" teleport="body" class="h-full w-full !overflow-hidden !bg-white text-white"
        v-model:show="showBottom">
        <NavHeader class="h-[44px]" title="" :callBack="close"></NavHeader>
        <div class=" h-[calc(100%-160px)] overflow-y-auto overflow-x-hidden scrollbar pb-[30px]">
            <Player v-if="type == 2" :url="getVideoUrl(data)" />
            <div v-else class="w-full">
                <img class="w-full" v-olazyload="getImgUrl({ ...data, fileType: 'awsS3' }, 'picName')" alt="" srcset="">
            </div>
            <Tips class="mt-[16px] px-[10px]" />
            <div class="flex justify-around items-center mt-[20px] px-[10px]">
                <div class="flex flex-col items-center">
                    <img class="w-[48px]" src="@/assets/images/ai/face1.png" alt="">
                    <div class="mt-[8px]">正面无遮挡</div>
                </div>
                <div class="flex flex-col items-center">
                    <img class="w-[48px]" src="@/assets/images/ai/face2.png" alt="">
                    <div class="mt-[8px]">不挡额头</div>
                </div>
                <div class="flex flex-col items-center">
                    <img class="w-[48px]" src="@/assets/images/ai/face3.png" alt="">
                    <div class="mt-[8px]">不挡眼睛</div>
                </div>
            </div>
            <div class="px-[10px]">
                <div class="text-[16px] py-[16px]">上传脸部信息</div>
                <div>
                    <div class="overflow-y-auto w-full flex flex-col items-center">
                        <van-uploader :upload-icon="updateIcon" v-model="fileList" multiple :max-size="2 * 1024"
                            :max-count="1" deletable :before-read="beforeRead" />
                    </div>
                </div>
            </div>
        </div>
        <div
            class="w-full h-[116px] bg-[#191919] absolute bottom-0 left-0 px-[20px] pt-[8px] pb-[27px] flex flex-col justify-between items-center">
            <div class="text-[14px]">免费次数{{ '0' }}</div>
            <van-button color="linear-gradient(90deg, #2D57CC 0%, #AC63FF 100%)" block
                @click="generate">生成</van-button>
        </div>
    </van-popup>
</template>
<script setup name="aiRecordListPop">
import { computed, ref } from "vue";
import { config } from '@/store/config'
import Player from '@/views/ai/components/player.vue'
import Tips from '@/views/ai/components/tips.vue'
import { getImgUrl,getVideoUrl } from "@/utils";
import updateIcon from '@/assets/images/ai/update-icon.png'
const props = defineProps({
    modelValue: Boolean,
    type: {
        type: Number,
        default: 3
    },
    data: {
        type: Object,
        default: () => ({})
    }
});
const emits = defineEmits(['update:modelValue', 'updatePic', 'createdAi']);
const showBottom = computed({
    get() {
        return props.modelValue || false;
    },
    set() {
        close();
    },
});
const close = () => {
    emits("update:modelValue", false)
}

const fileList = ref([])
const beforeRead = (file) => {
    fileList.value[0] = { url: window.URL.createObjectURL(file), file }
    emits("updatePic", file, 1)
}
const generate = () => {
    emits("createdAi")
}
</script>
<style lang="less" scoped>
:deep(.van-uploader) {
    --van-uploader-size: 90px;
    .van-uploader__upload {
        border-radius: 6px;
        border: 1px solid #868485;
        background-color: #fff;
    }
}
</style>