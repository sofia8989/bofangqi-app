<!--短视频-- 同城茶馆 -->
<template>
  <div>
    <section class="px-[8px] pt-[8px] mb-[12px] rounded-[8px]  text-[#2F2F42]" v-for="(itemdata, index)  in itemList"
      :key="index" style="border-bottom: 1px #F0F0F0 solid;">
      <template v-if="itemdata.adId">
        <img class="w-100% max-h-[350px]" @click.stop="$clickAd(itemdata)" v-olazyload="getImgUrl(itemdata)" alt=""
          srcset="">
        <div
          class="pl-[5px] mt-[5px]  pr-[12px] overflow-hidden text-[16px] font-medium text-ellipsis whitespace-nowrap">
          {{ itemdata.nickname }}</div>
      </template>
      <template v-else>
        <div style="display: flex;align-items: center;justify-content: space-between;" @click.stop="goRely(itemdata)">
          <div class="flex h-[39px] items-center">
            <img class="w-[30px] h-[30px] rounded-[50%] mr-[11px]" :src="listf.avatar" alt="">

            <div>
              <div class="text-[13px] font-medium flex">
                <span v-if="type == 2">{{ listf.nickname }}</span>
                <span v-else>{{ itemdata.nickname }}</span>
                <!-- <img src="../../../assets/images/shortVideo/address.svg" style="margin:0 5px 0 10px;" />
              <span class="text-[#84898c] text-[12px]">{{ itemdata?.cityName || '未知' }}·{{ itemdata?.distance
                }}km</span> -->

              </div>
              <div class="teaHouse" v-if="itemdata.type == 4">
                <div class="tea">[茶馆]</div>
                <div class="teaTime">2024-08-05 22:19</div>
              </div>
            </div>

          </div>
          <div style="color: #F83E3C;" @click.stop="deleteBtn(itemdata.id)">
            删除

          </div>


        </div>
        <!-- <div class="text-[16px] font-medium overflow-hidden text-ellipsis whitespace-nowrap">{{ itemdata.title }}</div> -->
        <div class="textOVerThree">{{ itemdata.title }}</div>
        <div class="img-box mt-[14px] justify-between grid grid-cols-3 gap-[10px]">
          <template v-for="(item, index) in itemdata.img_src" :key="index" v-if="type != 1">
            <img @click.stop="showImagePreview(item)" class="w-[106px] h-[106px] rounded-[4px] object-cover" :src="item"
              v-olazyload="getImgUrl(item)" />
            <!-- <img v-if="item.url.length == 2" @click="showImagePreview" class="w-[170px] h-[170px] rounded-[4px] object-cover" 
          v-olazyload="getImgUrl(item,'url')" /> -->
          </template>
          <van-image-preview v-model:show="show" :index="imgIndex" :images="itemdata.img_src" @change="onChange">
            <!-- <template v-slot:index>第{{ indexPage }}页</template> -->
          </van-image-preview>


        </div>
        <!-- 观看数、点赞数和日期 -->

      </template>
      <div class="card-item-footer mt-[16px] mb-[5px] pb-[6px] zanBox">
        <div class="zan">
          <img class="w-[16px] h-[16px]" src="../../../assets/images/shortVideo/message-gray.svg" />
          {{ formatNumber(itemdata.reply) }}
        </div>
        <!-- <div class="zan"  @click="clickBtn(itemdata.id,index)" v-if="itemdata.isClick==0" >
        <img class="w-[16px] h-[16px]"  src="../../../assets/images/reply/zan.svg" />
        {{ itemdata.click }} <span v-show="false">{{ val }}</span>
      </div>
      <div class="zan"  @click="cancelBtn(itemdata.id,index)" v-else>
        <img class="w-[16px] h-[16px]" src="../../../assets/images/shortVideo/zan-tc.svg" />
        {{ itemdata.click }} <span v-show="false">{{ val }}</span>
      </div> -->
      </div>
    </section>

  </div>

</template>

<script setup name="actualItem">
import { useRoute } from 'vue-router'
import router from '@/router'
import { teaClick, teaCancelClick, fllow, cancelFllow, deleteSc } from '@/service/baseApi'
import { $clickAd, getImgUrl } from "@/utils"
import { showToast } from 'vant'
import { defineEmits, onMounted, reactive, ref } from 'vue'
const emit = defineEmits(['updateValue'])
import { mySend } from '@/service/baseApi'
const $route = useRoute()
const props = defineProps({
  itemList: Array,
  type: Number,
  listf: Object
})


const  ListA=ref()
const init = async () => {
    const listData = await mySend({})
    ListA.value = listData.result.postData.list
    
}

const propsCopy = ref([...props.itemList])
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
// 取消赞
const cancelBtn = async (id, i) => {
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

// 删除按钮
const deleteBtn = async (id) => {
  const listData = await deleteSc({
    postId: id,
  })
  if (listData.code == 200) {
    showToast({
      type: "success",
      message: "删除成功!"
    })
    props.itemList.forEach((item,index) => {
           if(id==item.id){
            props.itemList.splice(index, 1)
           }
    })
  }

}
const formatNumber = (num) => {
  return num > 10000 ? (num / 10000).toFixed(2) + '万' : num
}
const show = ref(false)
const imgIndex = ref(0)
const showImagePreview = (val, leg) => {
  imgIndex.value = Math.floor(Math.random() * leg);
  show.value = true
}
const onChange = (index) => {
  console.log(index, '+++++')
  indexPage.value = index + 1
}
// 跳转回复页面
const goRely = (item) => {
  router.push({ name: 'reply', query: item });
}
init()
onMounted(()=>{
  init()
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