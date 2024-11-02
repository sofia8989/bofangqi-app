<template>
  <div class="detail-page text-[#2F2F42] h-full overflow-x-hidden scrollbar">
    <div class="wrap">
      <div class="sticky top-0 z-10">
        <!-- <Topboot></Topboot> -->
        <div class="relative">
          <div v-show="!showAdvertise">
            <iframe :src="isIframe" v-if="isIframe" frameborder="0"></iframe>
            <div class="w-full bg-black h-[210px]" v-else id="dplayer" ref="dpRef"></div>
          </div>
          <div class="w-full h-[210px]" v-if="showAdvertise">
            <img class="w-full h-full" @click="$clickAd(xlAVDetailDuration)"
              v-olazyload="getImgUrl(xlAVDetailDuration)" />
            <div
              class="absolute top-[15px] right-[15px] bg-black/50 text-[#fff] py-[8px] px-[10px] text-center text-[14px] rounded-[6px] font-normal"
              @click.stop="showAdvertise = false">
              <span v-if="time > 0">跳过{{ time }}</span>
              <van-icon v-else class="p-[4px]" size="18px" color="#fff" name="cross" />
            </div>
          </div>
          <div v-if="showOpenVip"
            class="z-10 absolute top-0 left-0 bg-black/90 w-full h-full flex justify-center items-center">
            <div class="flex justify-center flex-col flex-auto flex-shrink-0 flex-grow-0 items-center">
              <div class="text-[20px] text-white" style="font-family: PingFang SC;font-weight: 600;text-align: center;
                ">今日免费观影结束</div>
              <div class="font-semibold mt-[17px] mb-[17px]" style="color:#FDF0DB ;">开通VIP可享受不限次数观影特权</div>
              <div>
                <van-button @click="sharePop" round
                  class="w-[150px] text-[12px] !px-0 !border-solid !border-[1px] !border-[#979797] !mr-[14px]" style="font-family: PingFang SC;font-size: 14px;font-weight: 600;line-height: 28px;text-align: center;
                  background: linear-gradient(143.31deg, #FFE9C4 14%, #F9D4A0 45.22%, #C47744 78.37%); color: #592610;
                "> 立即开通VIP</van-button>
                <van-button @click="getUser" round class="w-[150px]" style="font-family: PingFang SC;
                font-size: 14px;font-weight: 600;line-height: 28px;text-align: center;background: var(--main-1, #F83E3C);color: var(--cf, #FFFFFF);

">已开通，刷新状态</van-button>
              </div>
            </div>
          </div>
          <div v-if="endplay"
            class="z-[11] absolute top-0 left-0 bg-black/70 w-full h-full flex justify-center items-center">
            <van-icon @click="$router.go(0)" class="absolute top-[15px] right-[15px]" name="replay" color="#fff"
              size="16px" />
            <div class="flex flex-col">
              <div class="m-auto mb-[8px] text-[14px] text-white">分享越多，奖励越多！</div>
              <div class="m-auto">
                <van-button @click="sharePop" round class="h-[32px]"
                  color="linear-gradient(180deg, #F8806F 0%, #F34745 100%)">分享视频</van-button>
              </div>
            </div>
          </div>
          <div @click="router.go(-1)" class="absolute top-[15px] left-[15px] z-10">
            <svg-icon class="h-[24px] w-[24px]" color="#fff" name="w-back" />
          </div>
          <div @click="goRouter('recharge')" v-if="showOpenViptips" class="absolute bottom-[0px] bg-black/80 z-10 h-[30px] w-[100%]
             text-white px-[10px] h-[23px] flex justify-between items-center ">
            <div style="font-family: PingFang SC;font-size: 13px;font-weight: 600;line-height: 22px;
            text-align: center;color: #FFE9C4;">开通VIP专享视频，您当前可试看30s。</div>
            <van-button @click="$router.push({ name: 'recharge' })" round class="h-[23px]"
              color="linear-gradient(180deg, #F8806F 0%, #F34745 100%)" style="background: linear-gradient(143.31deg, #FFE9C4 14%, #F9D4A0 45.22%, #C47744 78.37%);
              font-family: PingFang SC;font-size: 13px;font-weight: 600;text-align: center;color: #592610;
">开通VIP会员</van-button>
          </div>
          <div v-if="showOpenViptips" class="absolute bottom-[150px] 
             text-white" style="display: flex;justify-content: center;width: 100%;">
            <div style="font-family: PingFang SC;font-size:20px;font-weight: 400;line-height: 22px;
            text-align: center;">
              试看片段，充值后可看完整版</div>

          </div>
        </div>
      </div>

      <!-- 会员提示次数开始 -->
      <div v-if="!isVip" class="pl-[24px] pr-[12px] h-[38px]  relative title">

        <div style="display: flex;">
          <img class="w-[20px] h-[20px]  top-0 left-[28px]" src="@/assets/images/detail/video-icon.svg" />
          <div class="h-full  flex items-center font-semibold  top-0 left-[65px] text-[14px] "
            style="margin-left: 10px;">
            VIP视频观影券<span style="color:#F83E3C;">{{ timesWatched }}</span>张,每日可以免费获得<span
              style="color:#F83E3C;">3</span>张</div>
        </div>
      </div>
      <!-- 会员提示次数结束 -->
      <div class="text-left text-[14px] m-[10px] mb-0 font-bold">{{ state.vodTitle }}</div>
      <!-- 浏览次数一行 开始 -->
      <div class="shareBox flex justify-between px-[10px] pb-[5px]">
        <div class="leftBox">
          <div class="views">
            <img src="../../assets/images/detail/video_right.svg" />
            <div class="text" >{{ state.click }}w次播放量</div>
          </div>
          <div class="views">
            <img class="time" src="../../assets/images/detail/time.svg" />
            <div class="text" >{{ state.vod_time_add }}</div>
          </div>
        </div>
        <div class="rightBox">
          <img class="share" @click="sharePop" src="../../assets/images/detail/share.png" />
          <img class="zan" v-if="state.collect == 0" @click="favorite_video(state.commentId, 0)"
            src="../../assets/images/detail/zan.svg" />
          <img class="zan" v-else @click="favorite_video(state.commentId, 1)"
            src="../../assets/images/detail/zan_choose.svg" />
        </div>
      </div>
      <!-- 浏览次数一行结束 -->
      <!-- <div class="flex justify-between px-[10px] pb-[5px]">
        <div class="flex items-center">
          <van-button class="  !h-[25px] rounded-[4px] scale-90"
            :class="[state.collect == 0 ? '!text-[#25252a]' : '!text-white']" icon="star"
            color="linear-gradient(90deg, #2D57CC 0%, #AC63FF 100%)">{{ state.collect == 0 ? '收藏' : '已收藏'
            }}</van-button>
        </div>
        <div >
          <van-icon class="pr-[5px]" color="#AC63FF" size="20px" name="share-o" />
          <span class="text-[#AC63FF] font-medium text-[16px]">分享得VIP</span>
        </div>
      </div> -->
      <Swiper></Swiper>
      <van-tabs v-model:active="active" @change="changeTab" shrink background="#fff" color="#F83E3C"
        title-active-color="#F83E3C" title-inactive-color="#2F2F42">
        <van-tab title="热门应用">
          <JiuGongGe class="mb-[5px]" :list="videoinfo" rounded10></JiuGongGe>
        </van-tab>
        <van-tab title="推荐视频">
          <ScrollList class="mt-[5px]" :loading="params.loading" :finished="params.finished" :refresh="params.refresh"
            :list="list" @onLoad="onLoad" @onRefresh="onRefresh">
            <div class="grid gap-[10px] grid-cols-2 px-[10px]">
              <DetailItem v-for="(item, i) in list" :item="item" :key="item.vodId"></DetailItem>
            </div>
          </ScrollList>
        </van-tab>
      </van-tabs>
    </div>
    <van-popup v-model:show="videoshare" position="bottom" style="border-radius: 20px 20px 0 0;"
      :style="{ height: '504px', '--van-popup-background': '#fff' }">
      <div class="nav">
        <div class="kong"></div>
        <div class="text">分享视频</div>
        <img src="../../assets/images/detail/close.png" @click="close" />
      </div>
      <div class=" flex flex-col items-center w-full p-[10px] textBox">
        <div class="txt">
          <p><span>新用户两天内邀请用户可免费获得<span style="color: #F83E3C;">7</span>天VIP，老用户邀请用户可获得<span
                style="color: #F83E3C;">3</span>天VIP。</span>
            因浏览器兼容性原因，部分用户需要安装后手动输入您的邀请码来获取奖励。</p>
        </div>
        <div ref="qrcodeRef">
          <qrcode-vue class="border-[5px] border-solid border-[#fff]" :value="shareurl" :size="180" level="H" />
          <div class="code"> 邀请码 <span style="color: #F83E3C;">{{ deviceUser?.userId }}</span></div>
        </div>
        <van-button @click="downloadqrcode" round block class="my-[16px]" color="#F83E3C">保存二维码分享</van-button>
        <van-button @click="copyUrl(shareurl)" round block color="#F83E3C">复制链接地址分享</van-button>
      </div>
    </van-popup>
  </div>
</template>
<script setup name="video-detail">
import { ref, reactive, onMounted, nextTick, computed, watch, onBeforeUnmount, shallowRef } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getVideoDetail } from '@/service/video'
import { getRecommendedList, favoriteVideo } from '@/service/community'
import { config } from '@/store/config'
import JiuGongGe from "@/components/Jiugongge.vue";
import Hls from 'hls.js'
import DPlayer from 'dplayer'
import Topboot from "@/components/Topboot.vue";
import { $get, getImgUrl, $clickAd, inject_advertise_swiper, copyString } from '@/utils'
import { showToast } from 'vant'
import QrcodeVue from 'qrcode.vue'
import { htmlTocanvas } from "@/utils/html2canvas";
import { getUserInfo } from '@/service/loginApi'

/**
 * @description 详情观看广告
 */
const xlAVDetailDuration = computed(() => $get(configStore, 'templateData.xlAVDetailDuration.adList.0', {}))
/**
 * @description 详情观看广告
 */
const xlAVApp = computed(() => $get(configStore, 'templateData.xlAVApp.adList', []))
/**
 * @description 导航九宫格
 */
const videoinfo = computed(() => $get(configStore, 'templateData.videoinfo.adList', []))
/**
 * @description 视频广告注入
 */
const xlHomeVideoInsertion = computed(() => $get(configStore, 'templateData.xlHomeVideoInsertion.adList', []))
const isVip = computed(() => $get(configStore, "deviceUser.userGroupId", 1) == 3)
const deviceUser = computed(() => $get(configStore, 'deviceUser', {}))

const active = ref(0)
let dp;
const dpRef = shallowRef()
const route = useRoute()
const router = useRouter()

const time = ref(0)
/**
 * @description 视频第一次播放
 */
const firstPlay = ref(false)
const showAdvertise = ref(false)
const showOpenVip = ref(false)
const configStore = config()
const isIframe = ref('')
const showOpenViptips = ref(false)
const endplay = ref(false)
const videoshare = ref(false)
const shareurl = ref('')
const qrcodeRef = ref()
const params = reactive({
  pageNum: 1,
  loading: false,
  finished: false,
  refresh: false,
  first: true,
  videoList: [], // 视频列表数据
  pagecount: 0
})
const informationList = reactive({
  AiFaceImg: '',
  AiFaceVideo: '',
  AiPicture: '',
  balance: '',
  identityCard: '',
  nickname: '',
  phoneState: '',
  userGroupExpiryDate: '',
  userGroupId: '',
  userId: '',
  avatar: '',
  userName: '',
  profile: '',
})
const getUser = async () => {
  const listData = await getUserInfo({})
  if (listData.code == 200) {
    configStore.deviceUser = listData.result
    if (listData.result.userGroupId == 3) {
      init(route.params.id)
      showOpenVip.value = false
    } else {
      showToast({
        message: "暂未开通会员！"
      })
    }
  }
}
const list = reactive([])
const state = reactive({
  parent: true,
  placeholder: '',
  commentPid: route.params.id,
  commentId: route.params.id,
  vodTitle: '', // 标题
  adList: [], // 广告列表
  htmlList: [], // 文本节点列表
  vodContent: '', // 文本
  swiper: [], // 广告
  swiperSecond: [], // 内页头部广告
  swiperThird: [], // 福利专区
  swiperFourth: [], // 娱乐专区
  videoUrl: '',
  collect: 0,
  isFree: false,
})
const timesWatched = ref(0)
const setCount = () => {
  let _videoIdList = JSON.parse(window.localStorage.getItem('_videoIdList')) || []
  timesWatched.value = 3 - _videoIdList.length
}
// 初始化
const init = async (id) => {
  const { result } = await getVideoDetail(id)
  state.vodTitle = result.vodName
  if (result.vodPlayUrl.indexOf('http') == -1 && result.vodApi) {
    isIframe.value = result.vodApi
    return
  }
  const date = new Date(result.vod_time_add * 1000);
  const options = { year: 'numeric', month: 'long', day: 'numeric', };

  isIframe.value = null
  state.videoUrl = result.vodPlayUrl.substr(result.vodPlayUrl.indexOf('http'))
  state.collect = result.collect
  state.click = result.click
  state.vod_time_add = new Intl.DateTimeFormat('zh-CN', options).format(date);
  state.isFree = result.isFree == 1
  if (isVip.value || !xlAVDetailDuration.value?.adId) {
    setTimeout(() => {
      initDplayer(state.videoUrl)
    }, 0)
  }
}

// 初始化播放器
const initDplayer = (url) => {
  firstPlay.value = true
  dp = new DPlayer({
    container: dpRef.value,
    preload: 'metadata',
    autoplay: false,
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
      url: url,
      type: 'customHls',
      customType: {
        customHls: function (video, player) {
          const hls = new Hls()
          hls.loadSource(video.src || url)
          hls.attachMedia(video)
        }
      }
    }
  })
  let _videoIdList = JSON.parse(window.localStorage.getItem('_videoIdList')) || []
  let videoId = route.params.id
  dp.on("ended", () => {
    endplay.value = true
  })
  let vlength = _videoIdList.length
  // let Limited = !isVip.value && vlength == 3 && !_videoIdList.includes(videoId) && !state.isFree
  // if (vlength < 3 && !_videoIdList.includes(videoId) && !state.isFree) {
  //   _videoIdList.push(videoId)
  //   window.localStorage.setItem('_videoIdList', JSON.stringify(_videoIdList))
  // }
  let Limited = !isVip.value && vlength == 3 && !_videoIdList.includes(videoId) && !state.isFree
  if (vlength < 3 && !_videoIdList.includes(videoId)) {
    _videoIdList.push(videoId)
    window.localStorage.setItem('_videoIdList', JSON.stringify(_videoIdList))
  }
  if (Limited) {
    showOpenViptips.value = true
    dp.on('timeupdate', () => {
      let curTime = dp.video.currentTime
      if (curTime >= 35) {
        showOpenViptips.value = false
        dp.pause()
        showOpenVip.value = true
        return
      }
    })
  }
  setCount()
}
const interval = ref()
const setInter = () => {
  if (xlAVDetailDuration.value?.adId) {
    showAdvertise.value = true
    time.value = 3
    clearInterval(interval.value)
    interval.value = setInterval(() => {
      if (time.value > 0) {
        time.value--
      } else {
        showAdvertise.value = false
      }
      if (!showAdvertise.value) {
        clearInterval(interval.value)
      }
    }, 1000)
  } else {
    showAdvertise.value = false
  }
}
const close = () => {
  videoshare.value = false
}
const sharePop = () => {
  videoshare.value = true
  shareurl.value = `${window.location.href}?pageName=f001&inviteCode=${$get(configStore, 'deviceUser.userId', "")}`
}
const downloadqrcode = () => {
  htmlTocanvas(qrcodeRef.value, '#212121', `vidoeoshare`)
  videoshare.value = false
}
const copyUrl = (url) => {
  copyString(url)
  videoshare.value = false
}
// 返回时销毁播放器
onBeforeUnmount(() => {
  dp && dp.destroy()
  showOpenVip.value = false
})

// 下拉刷新
const onRefresh = async () => {
  params.refresh = true
  params.pageNum = 1
  params.videoList = []
  await recommendedList()
}

// 上拉加载
const onLoad = async () => {
  if (params.first) return
  if (params.pageNum >= params.pagecount) {
    params.finished = true
    return
  }
  params.loading = true
  params.pageNum++
  recommendedList()
}

// 猜你喜欢
const recommendedList = async () => {
  getRecommendedList({ page: params.pageNum, pageSize: 6, vodId: route.params.id }).then((res) => {
    list.push(...res.result.list)
    params.videoList.push(...res.result.list)
    params.pagecount = res.result.total
    params.refresh = false
    params.first = false
    params.loading = false
    params.finished = params.pagecount <= params.videoList.length
  })
}

const goRouter = (name) => {


}

const favorite_video = async (vodId, type) => {
  let params = { vodId }
  type == 1 && (params.type = 1)
  let res = await favoriteVideo(params)
  let msgOp = {
    type: 'fail',
    message: res.msg
  }
  if (res.code == 200) {
    msgOp = {
      type: "success",
      message: type == 0 ? "收藏成功" : "取消收藏成功"
    }
    state.collect = type == 0 ? 1 : 0
  }
  showToast(msgOp)
}

watch(
  () => route.params.id,
  (val, old) => {
    state.commentPid = val
    endplay.value = false
    showOpenViptips.value = false
    showOpenVip.value = false
    if (val) {
      dp && dp.destroy()
      setInter()
      init(val)
    }
  }
)

watch(() => showAdvertise.value, (val) => {
  if (!val) {
    nextTick(() => {
      initDplayer(state.videoUrl)
    }, 0)
  }
})
const changeTab = (index) => {
  if (index === 1 && params.first) {
    recommendedList()
  }
}
onMounted(async () => {
  //页面刚进入加载的
  await init(route.params.id)

  if (isVip.value) {
    showAdvertise.value = false
  } else {
    setInter()
  }
  setCount()
})
</script>
<style lang="less" scoped>
iframe {
  width: 100vw;
  height: 210px;
}

.title {
  background-color: #FDF0DB;
  display: flex;
  align-items: center;
  justify-content: center;
}

.bg-color {
  background: linear-gradient(90deg, #2D57CC 0%, #AC63FF 100%);
  line-height: 23px;
}

.nav {
  display: flex;
  justify-content: space-between;
  padding: 5px 20px;

  .kong {
    width: 30px;
  }

  .text {
    font-family: PingFang SC;
    font-size: 16px;
    font-weight: 600;
    line-height: 22.4px;
    text-align: center;

  }

  img {
    width: 30px;
  }
}

.textBox {
  .txt {
    width: 327px;
    height: 84px;
    font-family: PingFang SC;
    font-size: 14px;
    // font-weight: 600;
    line-height: 28px;
    text-align: left;


    span {
      font-family: PingFang SC;
      font-size: 14px;
      font-weight: 600;
      line-height: 28px;
      text-align: left;

    }

  }
}

.code {
  font-family: PingFang SC;
  font-size: 14px;
  font-weight: 400;
  line-height: 28px;
  text-align: center;

  span {
    font-family: PingFang SC;
    font-size: 20px;
    font-weight: 600;
    text-align: left;
    text-decoration: underline
  }

}

.shareBox {
  margin-top: 10px;
  display: flex;
  align-items: center;

  .leftBox {
    display: flex;
    align-items: center;

    .views {
      display: flex;
      align-items: center;

      img {
        // width: 12px;
        // height: 12px;
        margin-right: 2px;
      }

      .time {
        margin-left: 10px;
      }

      .text {
        font-family: PingFang SC;
        font-size: 12px;
        font-weight: 400;
        line-height: 16.8px;
        text-align: left;


      }
    }
  }

  .rightBox {
    display: flex;
    align-items: center;

    .share {
      width: 76px;
      height: 20px;
      margin-right: 10px;
    }
  }

}
</style>
