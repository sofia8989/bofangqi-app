<!--短视频-- 同城茶馆 -->
<template>
  <div>
    <section class="px-[8px] pt-[8px] mb-[12px] rounded-[8px]  text-[#2F2F42]" v-for="(itemdata, index)  in propsCopy"
      :key="index" style="border-bottom: 1px #F0F0F0 solid;">
      <template v-if="itemdata.adId">
        <img class="w-100% max-h-[350px]" @click.stop="$clickAd(itemdata)" :src="itemdata.avatar" alt="" srcset="">
        <div
          class="pl-[5px] mt-[5px]  pr-[12px] overflow-hidden text-[16px] font-medium text-ellipsis whitespace-nowrap">
          {{ itemdata.nickname }}</div>
      </template>
      <template v-else>
        <div style="display: flex;align-items: center;justify-content: space-between;" @click.stop="goRely(itemdata)">
          <div class="flex h-[39px] items-center">
            <!-- <img class="w-[30px] h-[30px] rounded-[50%] mr-[11px]" :src="itemdata.avatar" alt="" srcset=""> -->

            <img class="w-[30px] h-[30px] rounded-[50%] mr-[11px]" src="@/assets/images/information/touxiang.png" v-if="itemdata.avatar==''||itemdata.avatar==undefined" />
            <img class="w-[30px] h-[30px] rounded-[50%] mr-[11px]" :src="itemdata.avatar" alt="" srcset="" v-else />
            <div>
              <div class="text-[13px] font-medium flex">
                <span>{{ itemdata.nickname }}</span>
                <!-- <img src="../../../assets/images/shortVideo/address.svg" style="margin:0 5px 0 10px;" />
              <span class="text-[#84898c] text-[12px]">{{ itemdata?.cityName || '未知' }}·{{ itemdata?.distance
                }}km</span> -->

              </div>
              <div class="teaHouse" v-if="type == 1">
                <div class="tea">[茶馆]</div>
                <div class="teaTime">{{ time(itemdata.create_at) }}</div>
              </div>

            </div>

          </div>
          <div v-if="type == 1">
            <div class="addBtn" @click.stop="fllowBtn(itemdata.id, index)" v-if="itemdata.isFouce == 0">
              <img src="../../../assets/images/shortVideo/add.svg" style="margin:0 5px;" />
              关注<span v-show="false">{{ val }}</span>
            </div>
            <div class="fllowBtn" @click.stop="cancelFllowBtn(itemdata.id, index)" v-if="itemdata.isFouce == 1">
              <img src="../../../assets/images/shortVideo/follow.svg" style="margin:0 5px;" />
              已关注<span v-show="false">{{ val }}</span>
            </div>

          </div>


        </div>
        <!-- <div class="text-[16px] font-medium overflow-hidden text-ellipsis whitespace-nowrap">{{ itemdata.title }}</div> -->
        <div :class="more == 1 ? 'all' : 'textOVerThree'" @click="goRely(itemdata)">{{ itemdata.title }}</div>
        <div v-if="itemdata.title.length > 80">
          <div class="moreBtn" @click="showMore(1)" v-if="more == 0">
            <img src="../../../assets/images/shortVideo/down.svg" style="margin:0 5px;" /> 显示更多
          </div>
          <div class="moreBtn" @click="showMore(0)" v-else>
            <img src="../../../assets/images/shortVideo/up.svg" style="margin:0 5px;" /> 显示更少
          </div>
        </div>


        <div class="img-box mt-[14px] justify-between grid grid-cols-3 gap-[10px]" @click="goRely(itemdata)">
          <template v-for="(item, i) in itemdata.img_src" :key="i" v-if="type != 1">
            <img  class="w-[106px] h-[106px] rounded-[4px] object-cover" :src="item"   @error="onImageError(i,index)" />
            <!-- <img v-if="item.url.length == 2" @click="showImagePreview" class="w-[170px] h-[170px] rounded-[4px] object-cover" 
          v-olazyload="getImgUrl(item,'url')" /> -->
          </template>

        </div>
        <!-- 观看数、点赞数和日期 -->

      </template>
      <div class="card-item-footer mt-[16px] mb-[5px] pb-[6px] zanBox">
        <div class="zan" @click="goRely(itemdata)">
          <img class="w-[16px] h-[16px]" src="../../../assets/images/shortVideo/message-gray.svg" />
          {{ formatNumber(itemdata.reply) }}
        </div>
        <div class="zan" @click="clickBtn(itemdata.id, index)" v-if="itemdata.isClick == 0">
          <img class="w-[16px] h-[16px]" src="../../../assets/images/reply/zan.svg" />
          {{ itemdata.click }} <span v-show="false">{{ val }}</span>
        </div>
        <div class="zan" @click="cancelBtn(itemdata.id, index)" v-else>
          <img class="w-[16px] h-[16px]" src="../../../assets/images/shortVideo/zan-tc.svg" />
          {{ itemdata.click }} <span v-show="false">{{ val }}</span>
        </div>
      </div>
    </section>

  </div>

</template>

<script setup name="actualItem">
import { useRoute } from 'vue-router'
import router from '@/router'
import { teaClick, teaCancelClick, fllow, cancelFllow } from '@/service/baseApi'
import { $clickAd, getImgUrl } from "@/utils"
import { showToast } from 'vant'
import { defineEmits, onMounted, ref, watch } from 'vue'
import { fetchImage } from '@/utils/imageUtils'; // 导入封装的函数
import { parse } from 'vue/compiler-sfc'
const emit = defineEmits(['updateValue'])
const $route = useRoute()
const props = defineProps({
  itemList: Array,
  type: Number
})

const more = ref(0)
// 显示更多
const showMore = (val) => {
  more.value = val
}

const imgBox = ref([])
const propsCopy = ref([...props.itemList])

propsCopy.value.forEach((item, index) => {
  if(item.avatar==''){
    item.avatar=''
}else{
  fetchImage(item.avatar).then((img) => {
    item.avatar = img
  });
}
 
})

propsCopy.value.forEach((item, index) => {
    item.img_src.forEach((val, i) => {
        fetchImage(val).then((img) => {
          item.img_src[i] = img
         });
    })
   
  })
  const onImageError=(i,val)=> {
    propsCopy.value[val].img_src[i] = '/assets/default.png' 
    console.log(propsCopy.value[val].img_src[i],'-----------')
    }
const val = ref()
const clickShow = ref(true)
//点赞
const clickBtn = async (id, i) => {
  const listData = await teaClick({
    type: 1,
    postId: id
  })
  if (listData.code == 200) {
    val.value = propsCopy.value[i].click++
    propsCopy.value[i].isClick = 1

    propsCopy.itemList.forEach(item, index => {
      if (i == index) {
        item.isClick = 0
      }
    })
    // propsCopy.itemList[i].isClick=1
    clickShow.value = i
    showToast({
      type: "success",
      message: "点赞成功!"
    })
  }
}
const time = (val) => {
  let timestampInSeconds = val
  let timestampInMilliseconds = timestampInSeconds * 1000;
  let date = new Date(timestampInMilliseconds);
  let formattedDate = date.toLocaleString();
  return formattedDate
}
// 取消赞
const cancelBtn = async (id, i) => {
  console.log('tongcheng chaguan ')
  const listData = await teaCancelClick({
    type: 1,
    postId: id
  })
  if (listData.code == 200) {
    propsCopy.value[i].click--
    propsCopy.value[i].isClick = 0
    clickShow.value = i
    showToast({
      type: "success",
      message: "取消成功!"
    })
  }
}

const fllowBtn = async (id, i) => {
  const listData = await fllow({
    postId: id,
  })
  if (listData.code == 200) {
    propsCopy.value[i].isFouce = 1

    showToast({
      type: "success",
      message: "关注成功!"
    })
  }

}
// 取消成功
const cancelFllowBtn = async (id, i) => {
  const listData = await cancelFllow({
    postId: id,
  })
  if (listData.code == 200) {
    propsCopy.value[i].isFouce = 0
    showToast({
      type: "success",
      message: "取关成功!"
    })
  }
}

const formatNumber = (num) => {
  return num > 10000 ? (num / 10000).toFixed(2) + '万' : num
}

const showImagePreview = (val) => {
  ImagePreview([{ image: val.value }]);
}
// 跳转回复页面
const goRely = (item) => {
  router.push({ name: 'reply', query: item });
}
onMounted(() => {

})
</script>

<style lang="less" scoped>
.textOVerThree {
  display: -webkit-box;
  overflow: hidden;
  white-space: normal !important;
  text-overflow: ellipsis;
  word-wrap: break-word;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical
}

.all {
  display: -webkit-box;
  overflow: hidden;
  white-space: normal !important;
  text-overflow: ellipsis;
  word-wrap: break-word;
  // -webkit-line-clamp: 3;
  -webkit-box-orient: vertical
}

.moreBtn {
  display: flex;
  font-family: PingFang SC;
  font-size: 12px;
  font-weight: 600;
  line-height: 16.8px;
  color: #F83E3C;
  margin-top: 15px;

}

.zanBox {
  display: flex;
  justify-content: space-around;

  .zan {
    display: flex;

    img {
      margin-right: 10px;
    }
  }
}

.teaHouse {
  display: flex;
  align-items: center;

  .tea {
    font-family: PingFang SC;
    font-size: 10px;
    font-weight: 400;
    line-height: 14px;
    text-align: left;
    color: #F83E3C;
    margin-right: 10px;

  }

  .teaTime {
    font-family: PingFang SC;
    font-size: 10px;
    font-weight: 400;
    line-height: 14px;
    text-align: left;
    color: #666666;

  }

}

.addBtn {
  border: 1px solid #CCCCCC;
  font-family: PingFang SC;
  font-size: 10px;
  font-weight: 400;
  text-align: center;
  width: 60px;
  height: 24px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.fllowBtn {
  font-family: PingFang SC;
  font-size: 10px;
  font-weight: 400;
  text-align: center;
  width: 60px;
  height: 24px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #FFE9E9;
  color: #D37575;

}
</style>