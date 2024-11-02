<template>
    <van-overlay z-index="100" :show="show" :lock-scroll="false" @click="setShowPopUps(false)"
        style="--van-overlay-background: rgba(0, 0, 0, 0.3)">
        <div class="w-full h-full flex items-center justify-center">
            <div class="h-[308px] w-[274px] relative bg-top bg-contain bg-no-repeat bg-[url(@/assets/images/popups.png)]">
                <div @click.stop class="pt-[100px] pl-[27px] w-[240px] overflow-hidden">
                    <div v-html="htmlString"></div>
                </div>
                <div class="absolute flex justify-center items-center w-full bottom-[-60px]">
                    <div @click="setShowPopUps(false)"
                        class="w-[136px] h-[51px] text-white text-[14px] text-center line-h bg-top bg-contain bg-no-repeat bg-[url(@/assets/images/popups-btn.png)]">
                        我知道了
                    </div>
                </div>
            </div>
        </div>
    </van-overlay>
</template>
<script setup>
import { ref, computed } from 'vue'
import { config } from '@/store/config'
import { global } from "@/store/global";
import { $get } from '@/utils';
import { storeToRefs } from 'pinia';
const useConfig = config()
const { setShowPopUps } = global()
const { showPopUps } = storeToRefs(global())
const htmlString = computed(() => $get(useConfig, 'configData.config.MainAnnouncement'), '')
const show = computed(()=> !!(showPopUps.value && htmlString.value))
</script>
<style scoped>
.bg-size {
    background-size: 100% 100%;
}

.line-h {
    line-height: 38px;
}
</style>