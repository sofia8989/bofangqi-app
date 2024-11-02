<!-- 轮播图 -->
<template>
    <div style="padding: 0 12px;" >
        <van-swipe class="my-swipe " style="height: 164px; width: 100%;" :autoplay="3000">
            <van-swipe-item v-for="(item, index) in bannerList" :key="index" @click="$clickAd(item)">
                <img :src="item.img_src"  class="swipe-img" />
            </van-swipe-item>
        </van-swipe>
    </div>
</template>
<script setup name="SwipeImagePreview">
import { getbannerList } from '@/service/community'
import { $clickAd, getImgUrl, getVideoCover } from '@/utils';
import { ref } from 'vue';
import { useRouter } from 'vue-router'
import { fetchImage } from '@/utils/imageUtils'; // 导入封装的函数
const router = useRouter()
const bannerList = ref([])
const arrUrl=ref([])
// 轮播图接口
const init = async () => {
    const listData = await getbannerList()
    listData.result.forEach((item,index)=>{
     fetchImage(item.img_src).then((val) => {
        item.img_src=val
        bannerList.value.push(item)
        });
     })
}
// 轮播图跳转
const goBanner = (item) => {
    if (item.is_internal == 0) {
        window.location.href = item.url;
    } else {
        router.push(item.url);
    }
}
init()
</script>

<style lang="less" scoped>
.swipe-img {
    width: 100%;
    height: 100%;
    border-radius: 20px;
}

:deep(.van-swipe__indicators) {
    justify-content: center;
    width: 79px;
    height: 16px;
    padding: 6px 10px 6px 10px;
    border-radius: 67px;
    background: #00000080;
}

:deep(.van-swipe__indicator--active) {
    width: 9px;
    height: 6px;
    border-radius: 6px;
    background-color: #F83E3C;
    position: relative;
    opacity:1;
}
:deep(.van-swipe__indicator){
    opacity:1;
}
:deep(.van-swipe-item){
    width: 100%;
}
</style>