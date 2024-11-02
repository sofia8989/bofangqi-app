<!-- 头部广告 -->
<template>
  <div class="flex overflow-hidden mx-[10px] text-white" @click="isVip && viewImg()">
    <template v-for="(item, i) in list" :key="item.prostitutePicId">
      <div v-if="i < 3" class="flex-auto flex-shrink-0 flex-grow-0 mr-[10px] relative">
        <img class="w-[143px] h-[193px] rounded-[6px]" v-olazyload="getImgUrl(item, name)" alt="">
        <div v-if="i == 2" class=" bg-black/85 absolute top-0 left-0 w-full h-full rounded-[6px]" @click=" !isVip && $router.push({name:'recharge'})">
          <div class="flex flex-col justify-center pl-[16px] w-full h-full" >
            <template v-if="!isVip">
              <img class="w-[16px] mb-[5px]" src="@/assets/images/actual/vip.png" alt="" srcset="">
              <div class="vertical-rl w-[16px]">解锁更多高清大图</div>
            </template>
            <template v-else>
              <img class="w-[16px] mb-[5px]" src="@/assets/images/actual/check.png" alt="" srcset="">
              <div class="vertical-rl w-[16px]">查看高清大图</div>
            </template>

          </div>
        </div>
      </div>
    </template>
  </div>
  <!-- <van-swipe class="my-swipe" :autoplay="3000" indicator-color="white">
    <van-swipe-item v-for="item of list">
        <div class="swipeImg h-[245px]">
        <img class="h-full object-cover" @click="viewImg"  v-olazyload="getImgUrl(item, name)" alt="" srcset="">
        </div>
    </van-swipe-item>
    <template #indicator="{ active, total }">
      <div class="custom-indicator1">
        <div class="item" :class="{ active: item == active + 1 }" v-for="item of total"></div>
      </div>
    </template>
  </van-swipe> -->
  <van-image-preview teleport="body"  v-model:show="show" :images="images" :close-on-click-image="false">
    <template #image="{ src }">
      <img class="van-image__img" style="object-fit: contain;" v-olazyload="src" alt="">
    </template>
  </van-image-preview>
</template>
<script setup name="SwipeImagePreview">
import { $get, getImgUrl } from '@/utils';
import { config } from '@/store/config'
import { computed } from 'vue'
import { ref } from 'vue';
const props = defineProps({
  list: Array,
  name: String
})
const configStore = config()
const isVip = computed(() => $get(configStore, "deviceUser.userGroupId", 1) == 3)
const show = ref(false)
const images = computed(() => props.list?.map(item => getImgUrl(item, props.name)))
const viewImg = async () => {
  show.value = true
}
</script>

<style lang="less" scoped>
.my-swipe .van-swipe-item {
  color: #fff;
  font-size: 20px;
  line-height: 150px;
  text-align: center;
  background-color: #212121;
  padding: 0 10px;
  border-radius: 5px;
  padding-bottom: 10px;

  img {
    border-radius: 5px;
  }
}

.swipeImg {
  width: 100%;
  border-radius: 5px;
  display: flex;
  background-color: #fff;
  justify-content: center;
}

.custom-indicator1 {
  position: absolute;
  bottom: 15px;
  left: 50%;
  display: flex;
  transform: translate(-50%);
  // background-color: #EDEDEF;
  border-radius: 5px;

  .item {
    width: 6px;
    height: 6px;
    background-color: #ededef;
    border-radius: 5px;
    margin: 0 3px;
  }

  .active {
    background-color: #fe2b54;
  }
}

.vertical-rl {
  writing-mode: vertical-rl;
}
</style>
