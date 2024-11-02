<!-- 短视频页面 -->

<template>
  <div class="short-video relative">
    <van-swipe vertical :show-indicators="false" @change="videoChange" class="h-full" :loop="false" lazy-render
      ref="vanswipe">
      <van-swipe-item v-for="(item, i) in list"
        :class="{ active: activeVideo == i, 'first-loading': isFirstLoading && activeVideo == i }" :key="item.vodId">
        <div v-if="item.adId" class="h-full relative">
          <img class="h-full w-full" @click="$clickAd(item)" v-olazyload="getImgUrl(item)" alt="" srcset="">
        </div>
        <template v-else>
          <div :id="`player${i}`" class="h-full video-mounted-ele"
            :style="{ 'backgroundImage': `url(${item.vodPic})` }">
          </div>
          <div class="absolute text-white  bottom-[8vh] text-[14px] pl-[16px] w-[80vw]"
            :class="{ 'text-ellipsis overflow-hidden whitespace-nowrap': !item.expand }"
            @click="item.expand = !item.expand">
            {{ item.vodName }}
          </div>

          <ul class="btns absolute text-[14px] text-white top-[40%] right-[2px] mr-[20px]" style="display: flex;
    flex-direction: column; align-items: center;text-align: center;" @click.stop>
            <li class="mb-[10px]" style="display: flex;flex-direction: column; align-items: center;">
              <img class="w-[60px] h-[60px] " style="border-radius: 30px;" :src="item.img_src" />
              <!-- 取关 -->
              <img class="w-[20px] h-[20px] " v-if="focusSwitch" @click="fllowCancelBtn(item.fake_uid, i)"
                style="margin-top: -10px;" src="../../assets/images/shortVideo/quguan.svg" />
              <!-- 关注 -->
              <img class="w-[20px] h-[20px] " style="margin-top: -10px;" v-else
                src="../../assets/images/shortVideo/guanzhu.svg" @click="fllowBtn(item.fake_uid, i)
                  " />
            </li>
            <!-- 喜欢 -->
            <li class="mb-[10px]">
              <img class="w-[28px] h-[28px]" src="../../assets/images/shortVideo/heart_red.svg" v-if="likes"
                @click="getCancelLikeBtn(item.vodId, i)" />
              <img class="w-[28px] h-[28px]" src="../../assets/images/shortVideo/heart_white.svg"
                @click="getLikeBtn(item.vodId, i)" v-else />
              <div>{{ item.click }}</div>
            </li>
            <!-- 评论 -->
            <li class="mb-[10px]" @click="plList(item.vodId,i)">
              <img class="w-[28px] h-[28px]" src="../../assets/images/shortVideo/message.svg" />
              <div>{{ item.reply }}</div>
            </li>
            <!-- 收藏 -->
            <li class="mb-[10px]">
              <!-- 收藏 -->
              <img class="w-[28px] h-[28px]" src="../../assets/images/shortVideo/collect_yellow.svg" v-if="collectShow"
                @click="getCancelCollectBtn(item.vodId)" />
              <img class="w-[28px] h-[28px]" src="../../assets/images/shortVideo/collect_whit.svg" v-else
                @click="getCollectBtn(item.vodId)" />
              <div>{{ collectionVal }}</div>
            </li>

            <li class="mb-[10px]" @click="showPop">
              <img  src="../../assets/images/shortVideo/vip.svg" />
            </li>
            <!-- <li class="mb-[10px]" @click="$router.push({ name: 'share' })">
                <img   src="../../assets/images/shortVideo/vip.svg"/>
              </li> -->
          </ul>
        </template>
        <!-- <comList v-model="showContact" :id=" videoId.vodId"></comList> -->
      </van-swipe-item>
    </van-swipe>
    <div class="absolute inset-0 flex items-center justify-center text-black" @click="rePlay" v-if="isPlayEnd">
      <div>
        <!-- <van-icon name="replay" size="20" color="#fff" /> -->
        <p class="pt-[14px]">重播</p>
      </div>
    </div>

    <div class="!bg-white scrollbar !overflow-y-hidden text-[#2F2F42] " style="width: 100%; height: 60%;position: absolute;bottom: 0px;z-index: 999;" v-if="showContact==true">
          <div class="sticky top-0 left-0 right-0  py-[16px] px-[23px] flex justify-between title">
            <div class="w-[20px]"></div>
            <div>评论</div>
            <van-icon class="" name="close" color="#2F2F42" size="20" @click="showContact = false" />
          </div>
          <div class="w-full h-[600px] overflow-y-auto scrollbar chooseList">

            <div class="leaveList  px-[23px]">
              <div class="leave" v-for="item, index in tgList" :key="index">
                <div class="nav">
                  <div class="left">
                    <img :src="item.avatar" />
                    <div class="name">{{ item.nickname }}</div>
                  </div>
                </div>
                <div class="content">
                  {{ item.content }}
                </div>
              </div>
            </div>
            <div class="reply">
              <van-field v-model="sendMessage" placeholder="请输入内容"
                :style="{ borderColor: '#F0F0F0', borderWidth: '2px' }" style="width: 283px;height: 36px;background-color: #F6F6F6;
     border: 1px solid #F0F0F0;border-radius: 10px;" />
              <div class="btn" @click="gosendBtn">评论</div>
            </div>

          </div>
        </div>
    <Floating v-model="show" :data="xlShortVideoFloat"  ></Floating>
    <sharePop v-model="shareShow"  style="z-index: 9999;position: absolute; top: 20;"/>

  </div>
</template>

<script setup>
import { watch, ref, onMounted, toRaw, reactive, onUnmounted, computed, nextTick } from 'vue'
import { config } from '@/store/config'
import { global } from '@/store/global'
import Hls from 'hls.js'
import DPlayer from 'dplayer'
import { useRouter, useRoute } from 'vue-router'
import { reqvideoList } from '@/service/community'
import Floating from '@/components/Floating.vue'
import { $clickAd, $get, getImgUrl, inject_shortVideo_advertise, randomCount } from '@/utils'
import { getLike, cancelLike, getCollect, cancelCollect, focusDy, focusCancel, sendComment, commentList } from '@/service/baseApi'
import sharePop from '@/views/mine/components/sharePop.vue'
import { showToast } from 'vant'
const deviceUser = computed(() => $get(configStore, 'deviceUser', {}))
import comList from "./components/comList.vue"
import List from '../message/components/list.vue'
import { fetchImage } from '@/utils/imageUtils'; // 导入封装的函数
const props = defineProps({
  type: {
    type: Number,
  },
})


const sortTypeVal = ref(1)
const shareShow = ref(false)
const showPop =()=>{
  shareShow.value=true
}
const showContact = ref(false)
const show = ref(false)
const configStore = config()
const globalStore = global()
const isVip = computed(() => $get(configStore, "deviceUser.userGroupId", 1) == 3)
const likes = ref(true)
const collect = ref({})
const videoId = ref('')
/**
 * @description 列表嵌入
 */
const xlShortVideoInsertion = computed(() => $get(configStore, 'templateData.xlShortVideoInsertion.adList.0', ""))
/**
 * @description 短视频漂浮
 */
const xlShortVideoFloat = computed(() => $get(configStore, 'templateData.xlShortVideoFloat.adList.0', {}))
// 发送消息
const sendMessage = ref('')
const gosendBtn = async () => {
  const listData = await sendComment({
    vodId: videoChartId.value,
    content: sendMessage.value
  })

  if (listData.code == 200) {
    let Obj = {
      nickname: deviceUser.value.nickname,
      content: sendMessage.value,
      avatar: deviceUser.value.avatar,
    }
    tgList.value.push(Obj)
    list.value[videoIndex.value].reply++
    console.log(list.value[videoIndex.value],'list.value[videoIndex]')
    sendMessage.value = ''
    showToast({
      message: "评论成功"
    })
  }else{
    showToast({
      message: "评论失败！"
    })
  }
}
// 评论列表
const videoChartId=ref('')
const videoIndex=ref('')
const tgList = ref([])
const plList = async (id,i) => {
  showContact.value=true
  videoChartId.value=id
  videoIndex.value=i
  tgList.value = []
  let params = {
    vodId: id,
  }
  const res = await commentList(params)
  if (res.code == 200) {

    res.result.list.forEach((item,index)=>{
      fetchImage(item.avatar).then((val) => {
        item.avatar=val
        tgList.value.push(item)
        });
        
    })

  }
}
const router = useRouter()
const activeVideo = ref(0)
const vanswipe = ref()
const isPlayEnd = ref(false)
const isFirst = ref(true)
let dp = null // 当前播放器
let dpPre = null // 前一个播放器
let isFirstLoading = ref(false)
const list = computed(() => inject_shortVideo_advertise(listObj.listData, xlShortVideoInsertion.value))

const listObj = reactive({
  listData: [],
  pageNum: 1,
  pageSize: 10,
  total: 0,
  searchText: '',
  // isRefreshing: false,
  // isloading: false,
  // isfinished: false
})
const focusSwitch = ref(false)
// 关注
const fllowBtn = async (id, index) => {
  const listData = await focusDy({
    fask_uid: id
  })
  if (listData.code == '200') {
    list.value[index].isFocus = 1
    list.value.forEach(item => {
      if (item.fake_uid == id) {
        item.isFocus = 1
      }
    });
    focusSwitch.value = true
    showToast({
      message: "关注成功"
    })
  }
}
// 取消关注
const fllowCancelBtn = async (id, index) => {
  const listData = await focusCancel({
    fask_uid: id
  })
  if (listData.code == '200') {
    list.value[index].isFocus = 0
    focusSwitch.value = false
    list.value.forEach(item => {
      if (item.fake_uid == id) {
        item.isFocus = 0
      }
    });
    showToast({
      message: "取消关注成功"
    })
  }
}
// 点赞
const getLikeBtn = async (id, i) => {
  const listData = await getLike({
    vodId: id
  })

  if (listData.code == '200') {
    showToast({
      message: "点赞成功"
    })
    likes.value = true
    list.value[i].click++
    list.value.forEach(item => {
      if (item.vodId == id) {
        item.isClick = 1
      }
    });
  }
}
//取消赞
const getCancelLikeBtn = async (id, i) => {
  const listData = await cancelLike({
    vodId: id
  })

  if (listData.code == '200') {
    showToast({
      message: "取消赞成功"
    })
    likes.value = false
    list.value[i].click--
    list.value.forEach(item => {
      if (item.vodId == id) {
        item.isClick = 0
      }
    });
  }
}
const collectionVal = ref(0)
const collectShow = ref(true)
//收藏
const getCollectBtn = async (id, i) => {
  const listData = await getCollect({
    vodId: id
  })

  if (listData.code == '200') {
    collectShow.value = true
    collectionVal.value++
    showToast({
      message: "收藏成功"
    })
    list.value.forEach(item => {
      if (item.vodId == id) {
        item.isCollect = 1
      }
    });
  }
}
//取消收藏
const getCancelCollectBtn = async (id, i) => {
  const listData = await cancelCollect({
    vodId: id
  })
  if (listData.code == '200') {
    collectShow.value = false
    collectionVal.value--
    list.value.forEach(item => {
      if (item.vodId == id) {
        item.isCollect = 0
      }
    });

  }
}


//跳转消息页面

const getComment = (isVal) => {
  router.push({ path: 'comment', query: { id: isVal } })
}
const countdownCount = ref(5)
const setCountdownCount = () => {
  if (countdownCount.value <= 0) return
  setTimeout(() => {
    countdownCount.value--
    setCountdownCount()
  }, 1000);
}
const videoChange = (index) => {
  videoId.value = list.value[index]
  console.log(list.value[index].vodId, '555555555')
  !isVip.value && setShortVideoCount()
  collectionVal.value = list.value[index].collection
  // 关注
  if (list.value[index].isFocus == 1) {
    focusSwitch.value = true
  } else {
    focusSwitch.value = false
  }
  // 点赞
  if (list.value[index].isClick == 1) {
    likes.value = true
  } else {
    likes.value = false
  }
  // 收藏
  if (list.value[index].isCollect == 1) {
    collectShow.value = true
  } else {
    collectShow.value = false
  }


  if (countdownCount !== 0 && index === 1) {
    let item = list.value[0]?.adId
    // console.log(item.adId)
    // item.adId &&  $clickAd(item)  focusSwitch.value=false
  }
  if (!isVip.value && getShortVideoCount() > 5) {
    globalStore.showRechargeDialog = true
    dp && dp.pause()
    dpPre && dpPre.pause()
    return
  }
  activeVideo.value = index
  if (dp) {
    dpPre = dp
    setTimeout(() => {
      dpPre.destroy()
    }, 1000)
  }
  setTimeout(() => {
    if (list.value[index]?.adId) {
      open_float()
    } else {
      initDplayer()
    }
  }, isFirst.value ? 1500 : 50);

  isFirst.value = false
  if (list.value.length - activeVideo.value === 1 && listObj.listData.length < listObj.total) {
    listObj.pageNum++
    loadList()
  }
}


/**
 * 初始化播放器
 */
const initDplayer = async () => {
  isFirstLoading.value = false
  const it = activeVideo.value
  let { vodPlayUrl } = $get(list, `value.${it}`, '')
  if (!vodPlayUrl) {
    console.error('视频地址不存在')
    return
  }

  let playerEle = document.getElementById(`player${it}`)
  if (!playerEle) {
    console.error('player dom 元素未加载')
    return
  }
  isFirstLoading.value = true

  // console.log('播放器初始化完成', vodPlayUrl)
  dp = new DPlayer({
    container: document.getElementById(`player${it}`),
    preload: 'metadata',
    autoplay: true,
    theme: '#2C2A2A',
    loop: false,
    screenshot: true,
    airplay: true,
    chromecast: true,
    hotkey: true,
    volume: 0.2,
    mutex: true,
    lang: 'zh-cn',
    video: {
      url: vodPlayUrl,
      // pic: pic,
      type: 'customHls',
      customType: {
        customHls: function (video, player) {
          const hls = new Hls()
          hls.loadSource(video.src || vodPlayUrl)
          hls.attachMedia(video)
          hls.on(Hls.Events.MANIFEST_LOADED, () => {
            video.play()
          })
        }
      }
    }
  })
  dp.on('ended', function () {
    isPlayEnd.value = true
  })
  dp.on('canplay', function () {
    isFirstLoading.value = false
  })
  // 第一帧加载完
  dp.on('loadeddata', function () {
    isFirstLoading.value = false
  })
}

const rePlay = () => {
  if (dp) {
    dp.play()
    isPlayEnd.value = false
  } else {
    console.error('播放器没有挂载')
  }
}

const loadList = async () => {
  let params = {
    sortType: sortTypeVal.value,
    page: listObj.pageNum,
    pageSize: listObj.pageSize
  }
  let res = await reqvideoList(params)

  if (res?.result?.list?.length) {
    res.result.list.forEach((item,index) => {
      item.commit = randomCount(item.likeCount * 0.05, item.likeCount * 0.08)
      item.expand = false
    })
    if (listObj.pageNum == 1) {
      listObj.listData = res.result.list
      setTimeout(() => {
        initDplayer()
      }, 1000)
    } else {
      listObj.listData.push(...res.result.list)
    }

    listObj.listData.forEach((item,index)=>{
      fetchImage(item.img_src).then((val) => {
        listObj.listData[index].img_src=val
        });
    })
    listObj.total = res.result.total
    videoId.value = res.result.list[0]
    // 关注
    if (res.result.list[0].isFocus == 1) {
      focusSwitch.value = true
    } else {
      focusSwitch.value = false
    }
    // 喜欢
    if (res.result.list[0].isClick == 1) {
      likes.value = true
    } else {
      likes.value = false
    }
    // 收藏
    if (res.result.list[0].isCollect == 1) {
      collectShow.value = true
    } else {
      collectShow.value = false
    }
    collectionVal.value = res.result.list[0].collection
  }
}

const open_float = () => {
  if (xlShortVideoFloat.value?.imageUrl) {
    show.value = true
  }
}
const setShortVideoCount = () => {
  let count = getShortVideoCount()
  window.localStorage.setItem('shortVideoCount', ++count)
}
const getShortVideoCount = () => {
  return +window.localStorage.getItem("shortVideoCount")
}
onMounted(async () => {
  if (!isVip.value && getShortVideoCount() > 5) {
    globalStore.showRechargeDialog = true
    return
  }
  open_float()
  await loadList()
  setShortVideoCount()
  setCountdownCount()
})

onUnmounted(() => {
  dp && dp.destroy()
  dpPre && dpPre.destroy()
})


watch(() => props.type, (val) => {
  sortTypeVal.value = val
  console.log(val, 'bianlema ')
  loadList()

})


</script>

<style scoped lang="less">
.first-loading {
  :deep(.dplayer-video-wrap) {
    background: unset;
  }
}
</style>
<style lang="less">
.video-mounted-ele {

  .dplayer-icons-left,
  .dplayer-icons-right {
    display: none;
  }
}
.title {
  font-family: PingFang SC;
  font-size: 16px;
  font-weight: 600;
  line-height: 22.4px;
  text-align: center;
  color: var(--c3, #333333);
}

.leaveList {
  height: calc(100% - 100px);
    overflow: scroll;
    background: #fff;
    padding-bottom: 120px;

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

.reply {
  width: 100%;
  height: 65px;
  border-top: 1px solid #F0F0F0;
  position: fixed;
  bottom: 0px;
  padding-right: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
  background-color: #F0F0F0;

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
</style>