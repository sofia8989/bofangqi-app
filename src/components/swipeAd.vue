<!-- 头部广告 -->
<template>
  <van-swipe :autoplay="3000" indicator-color="white">
    <van-swipe-item  :class="{'px-[10px] py-[5px]': ispd}" v-for="item of list">
      <img @click="$clickAd(item)"  v-olazyload="getImgUrl(item)" class="w-full h-[165px] " :class="{'rounded-[5px]':isrounded}" alt="">
    </van-swipe-item>
    <template #indicator="{ active, total }">
      <div class="flex absolute bottom-[15px] left-[50%] translate-x-[-50%]">
        <div class="w-[6px] h-[6px] mx-[3px] bg-[#ededef] rounded-[50%]" :class="{ '!bg-[#fe2b54]': item == active + 1 }" v-for="item of total"></div>
      </div>
    </template>
  </van-swipe>
</template>
<script setup name="ImageAd">
import { $clickAd, getImgUrl } from '@/utils';
const props = defineProps({
  list: {
    type: Array,
    default: () => ([])
  },
  ispd:{
    type:Boolean,
    default:true
  },
  isrounded:{
    type:Boolean,
    default:true
  }
})
</script>
