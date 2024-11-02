<template>
    <div class="grid grid-cols-5 pt-[5px] pb-[5px]" :style="type==0 ?'background:#F9F8FC;':'backkground:#fff;'">
        <div v-for="(item, i) in list" @click="$clickAd(item)" class="flex justify-center flex-col items-center mb-[5px]">
            <img class="w-[50px] h-[50px]" style="object-fit: cover;" :class="rounded10 ? 'rounded-[10px]' : 'rounded-[10px]'" :src="item.imageUrl"
                  @error="onImageError(i)"/>
            <div class="mt-[5px]  text-black text-center w-full overflow-hidden text-ellipsis whitespace-nowrap"
               >
                {{ item.adName }} </div>
            <div class="w-[150px] px-[10px] rounded-[17px] text-[#FBEA88] border-[1px] border-solid border-[#FBEA88] flex items-center justify-between "
                v-if="isload">

                <svg-icon name="download" color="#FBEA88" class="w-[13px] h-[13px]"></svg-icon>
                <span>下载</span>
            </div>
        </div>
    </div>
</template>
<script setup name="Jiugongge">
import { onMounted, ref, computed, watch } from 'vue'
import { $clickAd, getImgUrl } from '@/utils';
import { $get } from '@/utils';
import { config } from '@/store/config'
const configStore = config()
import { fetchImage } from '@/utils/imageUtils'; // 导入封装的函数
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
    },
    type:{
        type: Number,
    }
})
const arrUrl = ref([])
const active = ref('')
watch(() => props.list, (vala) => {
    arrUrl.value = []
    vala.forEach((item, index) => {
        fetchImage(item.imageUrl).then((val) => {
            props.list[index].imageUrl=val
        });
    })
})
onMounted(() => {
    props.list.forEach((item, index) => {
        fetchImage(item.imageUrl).then((val) => {
            props.list[index].imageUrl=val
        });
    })
})

const onImageError=(i)=> {
    props.list[i].imageUrl = '/assets/default.png'
    }

</script>
