<template>
    <div class="othergame h-page scrollbar overflow-x-hidden text-white bg-[#0b0b20]"  >
        <div class="w-full  h-full "  @click="goUrl()">
            <img class="w-full h-full" style="object-fit: cover;" :src="imgUrl"  @error="onImageError()" no-default="no" alt="" />
        </div>
    </div>
</template>
<script setup name="othergame">
import { watch, reactive, onMounted, computed, onDeactivated, ref } from 'vue'
import { config } from '@/store/config'
import { $get, getImgUrl, $clickAd, randomCount } from '@/utils'
import { fetchImage } from '@/utils/imageUtils'; // 导入封装的函数
import { getgameList } from '@/service/community'
const configStore = config()
/**
 * @description 导航九宫格
 */
const game = computed(() => $get(configStore, 'templateData.sportGameInfo.adList.0', {}))
// 轮播图接口
const imgUrl=ref()
const list=ref()
const init = async () => {
    const listData = await getgameList()
    if(listData.code==200){
         fetchImage(listData.result.img).then((val) => {
            imgUrl.value=val
        });
        list.value=listData.result

    }
}
const onImageError=()=> {
    imgUrl.value= '/assets/default.png'
    }
const goUrl =()=>{
    window.open(list.value.url, '_blank');
//    window.location.href =list.value.url;
}
init()
</script>