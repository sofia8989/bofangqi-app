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
  </div>
</template>

<script setup>
import { watch, ref, onMounted, toRaw, reactive, onUnmounted, computed, nextTick } from 'vue'
import { config } from '@/store/config'
import { global } from '@/store/global'
import Hls from 'hls.js'
import DPlayer from 'dplayer'
import { useRouter, useRoute } from 'vue-router'
import { getlqShort } from '@/service/community'
import Floating from '@/components/Floating.vue'
import { $clickAd, $get, getImgUrl, inject_shortVideo_advertise, randomCount } from '@/utils'
import { getLike, cancelLike, getCollect, cancelCollect, focusDy, focusCancel, sendComment, commentList } from '@/service/baseApi'
import sharePop from '@/views/mine/components/sharePop.vue'
import { showToast } from 'vant'
const deviceUser = computed(() => $get(configStore, 'deviceUser', {}))

import { fetchImage } from '@/utils/imageUtils'; // 导入封装的函数
const props = defineProps({
  type:Number,
  shortTag:String
})

console.log(props,'------------------')


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

// 评论列表
const videoChartId=ref('')
const videoIndex=ref('')
const tgList = ref([])

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




const collectionVal = ref(0)
const collectShow = ref(true)

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
  !isVip.value && setShortVideoCount()


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
  console.log(props.shortTag,'5555555555555555')
  let params = {
    shortTag:props.shortTag,
    sortType: props.type,
    page: listObj.pageNum,
    pageSize: listObj.pageSize
  }
  let res = await getlqShort(params)

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