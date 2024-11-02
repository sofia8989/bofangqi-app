<template>
  <div class="bg-[#fff] mb-[12px] rounded-[8px] p-[8px] h-[120px] flex mx-[10px]">
    <div class="flex-0 w-[90px] min-w-[90px] mr-1">
      <img class="h-[104px] w-[90px] rounded-[8px]"
      v-olazyload="getImgUrl(item.prostitutePictureRelation[0], 'url')" alt=""
        srcset="">
    </div>
    <div class="max-w-[240px]">
      <div class="text-[15px] mb-1 text-ellipsis whitespace-nowrap overflow-hidden">{{ item?.title }}</div>
      <div>
        <span>妹子年龄：</span>
        <span>{{ item?.extension?.age }}</span>
      </div>
      <div class="w-full overflow-hidden whitespace-nowrap text-ellipsis">
        <span>服务项目：</span>
        <span>{{ item?.extension?.service }}</span>
      </div>
      <div>
        <span>服务时间：</span>
        <span>{{ item?.extension?.number }}小时</span>
      </div>
      <div>
        <span>服务费用：</span>
        <span>{{ item?.extension?.cost }}</span>
      </div>
    </div>
  </div>
</template>
<script setup name="cardItem">
import { getImgUrl } from "@/utils"
const props = defineProps({
  item: Object,
})
</script>