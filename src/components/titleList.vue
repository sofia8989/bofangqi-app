<template>
    <div class="grid grid-cols-4 " style="background:#F9F8FC;padding:0 12px;">
        <div v-for="(item, i) in list" @click="$clickAd(item)" class="flex justify-center flex-col items-center">
            <div class="mt-[5px]  text-black text-center w-full overflow-hidden text-ellipsis whitespace-nowrap label" style="display: flex;
    align-items: center; justify-content: center;" >
                <img v-if="i==1||i==7" src="@/assets/images/nav/hotIcon.png" style="width: 12px;height: 12px;margin-right: 5px;">
                <img v-if="i==8" src="@/assets/images/nav/newIcon.png" style="width: 12px;height: 12px;margin-right: 5px;">
                <span v-if="i==1||i==7" style="color: #E5613F;"> {{ item.adName }}</span>
                <span v-else-if="i==8" style="color: #38B8CB;"> {{ item.adName }}</span>
                <span v-else>{{ item.adName }}</span>
            </div>
        </div>
    </div>
</template>
<script setup name="Jiugongge">
import { onMounted, ref, computed, watch } from 'vue'
import { $clickAd, getImgUrl } from '@/utils';

const props = defineProps({
    list: {
        type: Array,
        default: () => ([])
    },
    isload: {
        type: Boolean,
        default: false
    },
    rounded10: {
        type: Boolean,
        default: false
    }
})

</script>
<style lang="less" scoped>
.label {
    width: 84px;
    height: 32px;
    border-radius: 5px;
    background: #FFFFFF;
    line-height: 32px;
    font-family: PingFang SC;
    font-size: 12px;
    font-weight: 400;
    color: #333333;
}
</style>
