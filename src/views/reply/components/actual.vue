<!--短视频-- 同城 -->
<template>
  <div>
    <section class="px-[8px] pt-[8px] mb-[12px] rounded-[8px]  text-[#2F2F42]"
      style="border-bottom: 1px #F0F0F0 solid;">
      <template v-if="itemdata.adId">
        <img class="w-[50px] h-[50px] br-[25px]" style="border-radius: 25px;" :src="propsCopy.avatar" >
        <div
          class="pl-[5px] mt-[5px]  pr-[12px] overflow-hidden text-[16px] font-medium text-ellipsis whitespace-nowrap">
          {{ itemdata.nickname }}</div>
      </template>
      <template v-else>
        <div class="flex h-[60px] items-center">
          <img class="w-[50px] h-[50px] mr-[5px]" style="border-radius: 25px;" :src="propsCopy.avatar"  >
          <div class="text-[14px] font-medium flex" style="font-weight: 600;">
            <span>{{ itemdata.nickname }}</span>
          </div>
        </div>
        <!-- <div class="text-[16px] font-medium overflow-hidden text-ellipsis whitespace-nowrap">{{ itemdata.title }}</div> -->
        <div :class="more == 1 ? 'all' : 'textOVerThree'"  class="text-[16px]">{{ itemdata.title }}</div>
        <div v-if="itemdata.title.length > 80">
          <div class="moreBtn" @click="showMore(1)" v-if="more == 0">
            <img src="../../../assets/images/shortVideo/down.svg" style="margin:0 5px;border-radius: 5px;" /> 显示更多
          </div>
          <div class="moreBtn" @click="showMore(0)" v-else>
            <img src="../../../assets/images/shortVideo/up.svg" style="margin:0 5px;" /> 显示更少
          </div>
        </div>


        <div class="img-box mt-[14px] justify-between grid grid-cols-3 gap-[10px]"> 
          <template v-for="(item, index) in itemdata.img_src" :key="item.img_src">
            <img v-if="item.length > 2" @click="showImagePreview(index, item.length)"
              class="w-[106px] h-[106px] rounded-[4px] " :src="item"   style="object-fit: cover;"   @error="onImageError(index)"/>
            <img v-if="item.length == 2" @click="showImagePreview(index, item.length)"
              class="w-[170px] h-[170px] rounded-[4px] " :src="item"  style="object-fit: cover;"   @error="onImageError(index)" />
          </template>

          <van-image-preview v-model:show="show" :index="imgIndex" :images="item" @change="onChange">
            <template v-slot:index>第{{ indexPage }}页</template>
          </van-image-preview>


        </div>
        <!-- 观看数、点赞数和日期 -->

      </template>

      <div class="card-item-footer mt-[16px] mb-[5px] pb-[6px] zanBox">
        <div class="zan flex" >
          <img class="w-[16px] h-[16px]" src="../../../assets/images/shortVideo/message-gray.svg" />
          {{ formatNumber(itemdata.reply) }}
        </div>
        <div class="zan flex" @click="clickBtn(itemdata.id, index,1)" v-if="itemdata.isClick == 0">
          <img class="w-[16px] h-[16px]" src="../../../assets/images/reply/zan.svg" />
          {{ propsCopy.click }} <span v-show="false">{{ val }}</span>
        </div>
        <div class="zan flex" @click="cancelBtn(itemdata.id, index,1)" v-else>
          <img class="w-[16px] h-[16px]" src="../../../assets/images/shortVideo/zan-tc.svg" />
          {{ propsCopy.click }} <span v-show="false">{{ val }}</span>
        </div>
      </div>
      <div class=""></div>
    </section>

    <!-- <ScrollList :loading="state.loading" :finished="state.finished" :refresh="state.refresh" :list="videoList"
      @onLoad="onLoad" @onRefresh="onRefresh"> -->

    <div class="leaveList">
      <div class="leave" v-for="item, index in listPl">
        <div class="nav">
          <div class="left">
            <img src="@/assets/images/information/touxiang.png" v-if="item.avatar==''||item.avatar==undefined" />
            <img :src="item.avatar" v-else />
           
            <div class="name">{{ item.nickname }}</div>
          </div>
          <div class="right">
            <div class="zan flex" @click="clickBtn(item.id, index,2)" v-if="item.isClick == 0">
              <img class="w-[16px] h-[16px]" src="../../../assets/images/reply/zan.svg" />
              {{ item.click }}<span v-show="false"> {{ val }}</span>
            </div>
            <div class="zan flex" @click="cancelBtn(item.id, index,2)" v-else>
              <img class="w-[16px] h-[16px]" src="../../../assets/images/shortVideo/zan-tc.svg" />
              {{ item.click }}<span v-show="false"> {{ val }}</span>
            </div>
            <!-- <img src="../../../assets/images/reply/zan.svg" /> -->
            <!-- <div class="text">{{ item.click }}</div> -->
          </div>
        </div>
        <div class="content">
          {{ item.content }}
        </div>
      </div>


    </div>
    <!-- </ScrollList> -->

    <div class="reply">
      <van-field v-model="textarea" placeholder="请输入内容" :style="{ borderColor: '#F0F0F0', borderWidth: '2px' }" style="width: 283px;height: 36px;background-color: #F6F6F6;
     border: 1px solid #F0F0F0;border-radius: 10px;color:#000;" />
      <div class="btn" @click="sendBtn(itemdata.id)">评论</div>
    </div>


  </div>

</template>

<script setup name="actual">
import { watch, reactive, onMounted, ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import router from '@/router'
import { $clickAd, getImgUrl, $get, inject_advertise, randomCount } from "@/utils"
import { windowWidth } from 'vant/lib/utils';
import { sendList } from '@/service/baseApi'
import { config } from '@/store/config'
import { teaClick, teaCancelClick, info } from '@/service/baseApi'
import { get_prostitute_type_list } from "@/utils/prostituteTypeList";
import { showToast } from 'vant'
import { fetchImage } from '@/utils/imageUtils'; // 导入封装的函数
const deviceUser = computed(() => $get(configStore, 'deviceUser', {}))
const { prostituteTypeList } = get_prostitute_type_list()
const configStore = config()
const xlProstituteListInsertion = computed(() => $get(configStore, 'templateData.xlProstituteListInsertion.adList.0', ""))
const $route = useRoute()
const props = defineProps({
  itemdata: Object
})

const propsCopy = ref(props.itemdata)
const imgBox=ref([])
const avatar=ref([])
if(propsCopy.value.avatar){
  fetchImage(propsCopy.value.avatar).then((img) => {
  avatar.value=img
        });
}


const imgUser=ref()
if(deviceUser.value.avatar!==''){
  fetchImage(deviceUser.value.avatar).then((img) => {
      imgUser.value=img
     });
}else{
  imgUser.value=''
}

  

const active = ref(0)

const textarea = ref()
const show = ref(false)
const indexPage = ref(1)
const onChange = (index) => {
  indexPage.value = index + 1
}
const val =ref(0)
//点赞
const clickBtn = async (id, i,k) => {
  const listData = await teaClick({
    type: k,
    postId: id
  })
  if (listData.code == 200) {
    if(k==1){
      console.log( propsCopy.value,'999999')
      propsCopy.value.click++
      propsCopy.value.isClick = 1
    }else{
      console.log( listPl.value,'88888')
      listPl.value[i].click++
      val.value++
      console.log(val.value)
      listPl.value[i].isClick = 1
    }
    
    showToast({
      type: "success",
      message: "点赞成功!"
    })
  }
}
// 取消赞
const cancelBtn = async (id, i,k) => {
  const listData = await teaCancelClick({
    type: k,
    postId: id
  })
  if (listData.code == 200) {
    
    if(k==1){
      propsCopy.value.click--
      propsCopy.value.isClick = 0
    }else{
      val.value--
      listPl.value[i].click--
      listPl.value[i].isClick = 0
    }
   
    
    showToast({
      type: "success",
      message: "取消成功!"
    })
  }
}
const more = ref(0)
// 显示更多
const showMore = (val) => {
  more.value = val
}
const listPl=ref([])
// 加载数据
const init = async () => {
  const listData = await info({
    postId: props.itemdata.id,
    page: state.pageNum,
    pageSize: 20,
  })
  let list = listData.result.replyData.list || []
  list.forEach((team,i) => {
   
      fetchImage(team.avatar).then((img) => {
           team.avatar=img
           listPl.value.push(team)
        });
    
    
   })
  list = list.map(item => {
    item.distance = randomCount(1, 30) / 10
    return item
  })
   
 
  if (state.pageNum === 1) {
    state.videoList = list
    console.log(state.videoList,'state.videoList')

  } else {
    state.videoList.push(...list)
  }
  state.pagecount = listData.result.total
  state.refresh = false
  state.first = false
  state.loading = false
  state.finished = listData.result.total <= state.videoList.length
}

// 发送消息
const sendBtn = async (id) => {
  if(textarea.value==''){
    showToast({
      message: "请输入内容"
    })
    return
  }
  const listData = await sendList({
    type: props.itemdata.type,
    content: textarea.value,
    postId: id,
  })
  
  if (listData.code == 200) {
    
    showToast({
      message: "发送成功!"
    })
    let Obj={
      id:'',
      nickname:deviceUser.value.nickname ,
      click:0,
      isClick:0,
      content:textarea.value,
      avatar:imgUser.value ,
    }
    console.log('imgUser',imgUser.value)
    listPl.value.push(Obj)
    textarea.value = ''
  }

}
const formatNumber = (num) => {
  return num > 10000 ? (num / 10000).toFixed(2) + '万' : num
}
const replyContent = ref()

const imgIndex = ref(0)
const showImagePreview = (val, leg) => {
  imgIndex.value = Math.floor(Math.random() * leg);
  show.value = true

}
// 跳转回复页面
const goRely = () => {
  router.push({ name: 'reply' });
}
const onLoad = async () => {
  if (state.first) return
  if (state.videoList.length >= state.pagecount) {
    state.finished = true
    return
  }
  state.loading = true
  state.pageNum++
  init()
}
// 下拉刷新
const onRefresh = async () => {
  state.refresh = true
  state.pageNum = 1
  state.videoList = []
  console.log(videoList, '55')
  if (videoList) {

  }
  await init()
}
const state = reactive({
  videoList: [], // 视频列表数据
  pageNum: 1,
  loading: false,
  finished: false,
  refresh: false,
  first: true,
  pagecount: 0
})
const activeInfo = computed(() => $get(prostituteTypeList, `value.${active.value}`) || {})
// const videoList = computed(() => {
//   let item = ""
//   let id = $get(activeInfo, 'value.prostituteTypeId', 1)
//   if (id == 1) {
//     item = xlProstituteListInsertion.value
//   } else if (id == 2) {
//     item = xlProstituteListInsertion1.value
//   } else if (id == 3) {
//     item = xlProstituteListInsertion2.value
//   }
//   return inject_advertise(state.videoList, item)
// })
const onImageError=(i)=> {
  props.itemdata.value.img_src[i] = '/assets/default.png'
  console.log(props.itemdata.value)
    }

const videoList=ref([])
onMounted(() => {
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

.leaveList {

  .leave {
    .nav {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .left {
        display: flex;
        align-items: center;

        img {
          width: 40px;
          height: 40px;
          border-radius: 20px;
          margin-right: 10px;
        }

        .name {
          font-family: PingFang SC;
          font-size: 14px;
          font-weight: 600;
          line-height: 19.6px;
          text-align: left;

        }

      }

      .right {
        display: flex;

        img {
          width: 16px;
          height: 16px;
          margin-right: 10px;

        }

        .text {
          font-family: PingFang SC;
          font-size: 12px;
          font-weight: 400;
          line-height: 16.8px;
          text-align: center;

        }

      }

    }

    .content {
      width: calc(100% - 50px);
      padding: 10px 0;
      margin-left: 50px;
      font-family: PingFang SC;
      font-size: 16px;
      font-weight: 400;
      line-height: 26px;
      text-align: left;
      border-bottom: 1px solid #F0F0F0;
    }
  }


}

:deep(.van-field__control) {
  color: #000;
}

.reply {
  width: 100%;
  height: 50px;
  border-top: 1px solid #F0F0F0;
  position: fixed;
  bottom: 0px;
  left: 0px;
  padding-right: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .btn {
    width: 60px;
    height: 36px;
    border-radius: 38px;
    line-height: 36px;
    text-align: center;
    background: var(--main-1, #F83E3C);
    font-family: PingFang SC;
    font-size: 14px;
    font-weight: 600;
    color: #F0F0F0;
  }
}

:deep(.van-cell) {
  padding: 5px;
}
</style>