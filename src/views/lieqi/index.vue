<!-- 短视频页面 -->
<template>
    <div class="home-page h-page " @click.stop="popUp = false">
      <div style="width: 100%;height: 148px;opacity: 0.6px;
      background: linear-gradient(180deg, #111111 0%, rgba(17, 17, 17, 0) 100%);position: absolute;"
        v-if="hotIndex == 1 || hotIndex == 0"> </div>
  
      <div class="hotNav" >
        <img src="../../assets/images/search/return.svg" style="position: absolute;top: 30px;left: 20px;"
                @click="changePage">
        <div class="navName" @click="changeHot(0)" style="color:#000;">
          <div class="name" :class="hotIndex == 0 ? 'chooseName' : 'name'">推荐</div>
          <div class="line" :class="hotIndex == 0 ? 'chooseLine' : 'line'"></div>
        </div>
        <div class="navName" @click="changeHot(1)">
          <div class="name" :class="hotIndex == 1 ? 'chooseName' : 'name'">最新</div>
          <div class="line" :class="hotIndex == 1 ? 'chooseLine' : 'line'"></div>
        </div>
      </div>
   
      <van-swipe ref="swipeRef" :loop="false" lazy-render class="bg-white"  @change="changeSwipe" :show-indicators="false">
        <!-- 推荐 /最新 -->
        <van-swipe-item style="background-color: #000;">
          <shortVideo v-if="hotIndex == 0" :type="hotIndex" :shortTag="route.query.id"
            :style="iPhoneShow ? 'height:calc(100vh - 0px);' : 'height:calc(100vh - px);'">
          </shortVideo>
          <van-back-top immediate bottom="80" />
        </van-swipe-item>
        <!-- 最新 -->
        <van-swipe-item style="background-color: #000;">
          <shortVideo v-if="hotIndex == 1" :type="hotIndex" :shortTag="route.query.id"
            :style="iPhoneShow ? 'height:calc(100vh - 0px);' : 'height:calc(100vh - 0px);'">
          </shortVideo>
          <van-back-top immediate bottom="80" />
        </van-swipe-item>
      
      </van-swipe>
  
    
    </div>
  </template>
  <script setup name="home">
  import { nextTick, onMounted, reactive, ref, computed, watch } from 'vue'
  import { config } from '@/store/config'
  import { getProstituteList } from '@/service/prostituteApi'
  import { useRoute, useRouter } from 'vue-router'
  import { getTypeList, getAdultList } from '@/service/community'
  import { $get, getImgUrl, inject_ad_home_swper, randomCount, $clickAd, inject_advertise_swiper, inject_advertise_live_swiper } from '@/utils';
import shortVideo from './components/short.vue'
  import { showToast } from 'vant'
  import { getLiveList } from '@/service/liveApi'
  import { get_prostitute_type_list } from "@/utils/prostituteTypeList";
  import { useChoiceList } from '@/store/choiceList'

  const choiceList = useChoiceList()
  const configStore = config()
  const router = useRouter()
  const route = useRoute()
  const prostituteTypelist = computed(() => get_prostitute_type_list().prostituteTypeList.value.slice(1, 3))
  /**
   * @description logo
   */
  const xlHomeLogo = computed(() => $get(configStore, 'templateData.xlHomeLogo.adList.0', {}))
  /**
   * @description 插入的精选视频
   */
  const choiceVideoList = computed(() => $get(choiceList, 'videoList', []))
  /**
   * @description 文字广告
   */
  const xlHomeTextList = computed(() => $get(configStore, 'templateData.xlHomeTextList.adList', []))
  /**
   * @description 轮播图
   */
  const xlHomeBanner = computed(() => $get(configStore, 'templateData.xlHomeBanner.adList', []))
  /**
   * @description 直播轮播图
   */
  const xlLiveBanner = computed(() => $get(configStore, 'templateData.xlLiveBanner.adList', []))
  /**
   * @description 九宫格
   */
  const xlHomeApp = computed(() => $get(configStore, 'templateData.xlHomeApp.adList', []))
  /**
   * @description 视频嵌入
   */
  const xlHomeVideoInsertion = computed(() => $get(configStore, 'templateData.xlHomeVideoInsertion.adList', []))
  const AppNotify = computed(() => $get(configStore, 'configData.config.AppNotify', ''))
  const videoList = ref([])
  const computedVideoList = computed(() => inject_ad_home_swper(videoList.value, xlHomeVideoInsertion.value).slice(0, 12))
  const recommendActive = ref(0)
  const iPhoneShow=ref('false')
  if (/Mobi|Android|iPhone/i.test(navigator.userAgent)) {
    iPhoneShow.value=true
  }else{
    iPhoneShow.value=false
  }
  const changeNewVideo = () => {
    if (recommendActive.value + 1 < computedVideoList.value.length) {
      recommendActive.value++
    } else {
      recommendActive.value = 0
    }
  }
  console.log(route.query.id,'-----------------------*********----------------------')
const changePage = () => {
    router.go(-1)

}
  const recommendActiveBg = computed(() => {
    let item = computedVideoList.value[recommendActive.value]
    return item?.adId ? getImgUrl(item) : item?.vodPic
  })
  const getVideoList = async () => {
    let params = { typeId: 47, pageSize: 12, page: 1 }
    let res = await getAdultList(params)
    videoList.value = res?.result?.list || []
  }
  const gosend = () => {
    router.push({ path: 'send' })
  }
  const goMyCenter = () => {
    router.push({ path: 'myCenter' })
  }
  
  const toInfo = (routerView, item) => {
    // router.push({ path: routerView, query: { adId: item.adId } })
    router.push({ path: routerView })
  }
  const hotIndex = ref(0)
  
  const popUp = ref(false)
  const navIndex = ref(false)
  const changeHot = (index) => {
    if (index == 0 || index == 1) {
      navIndex.value = false
    } else {
      navIndex.value = true
    }
    hotIndex.value = index
    swipeRef.value?.swipeTo(index)
    changeSwipe(index)
  }
  const goPopUp = () => {
    popUp.value = !popUp.value
  }
  
  const typeList = ref([])
  const active = ref(0)
  const activeTypeId = ref(49)
  const get_type_list = async () => {
    let res = await getTypeList({ modules: 'Home' })
    typeList.value = res.result
    // typeList.value.splice(1, 0, { typeId: -1, typeName: "直播" })
    typeList.value.push({ typeId: -2, typeName: '抖阴' })
    init()
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
  const computedStateList = computed(() => inject_advertise_swiper(state.videoList, xlHomeVideoInsertion.value, choiceVideoList.value))
  const swipeRef = ref()
  const changeTab = (index) => {
  
    swipeRef.value?.swipeTo(index)
  }
  const changeSwipe = (index) => {
    hotIndex.value = index
    active.value = index
    set_active_type_id(index)
  }
  const set_active_type_id = (index) => {
    activeTypeId.value = typeList.value[index].typeId
    if (![-1, -2].includes(activeTypeId.value)) {
      state.refresh = true
      state.pageNum = 1
      state.videoList = []
      nextTick(() => init())
    }
  }
  // 上拉加载
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
  const init = async () => {
    const listData = await getAdultList({
      typeId: activeTypeId.value,
      page: state.pageNum,
      pageSize: 20
    })
    if (state.pageNum == 1) {
      state.videoList = listData.result.list || []
    } else {
      state.videoList.push(...listData.result.list)
    }
  
    state.pagecount = listData.result.total
    state.refresh = false
    state.first = false
    state.loading = false
    state.finished = listData.result.total <= state.videoList.length
  }
  
  // 下拉刷新
  const onRefresh = async () => {
    state.refresh = true
    state.pageNum = 1
    state.videoList = []
    await init()
  }
  
  const prostitute = reactive({
    list: [],
    total: 0,
    page: 1
  })
  
  const changeProstitute = () => {
    let page = 1
    if (prostitute.page * 9 < prostitute.total) {
      page += prostitute.page
    }
    if (page != prostitute.page) {
      prostitute.page = page
      prostitute.list = []
      getprostitutelist()
    } else {
      showToast({
        type: "fail",
        message: "没有更多的妹子"
      })
    }
  }
  const getprostitutelist = async () => {
  
    let res = await getProstituteList({
      prostituteTypeId: 2,
      page: prostitute.page,
      pageSize: 3
    })
    prostitute.total = (res?.result?.total || 0)
    prostitute.list = (res.result.list || []).map(item => {
      item.count = randomCount(50, 200)
      return item
    })
  
  }
  
  const getprostitutePictureRelation = (prostitutePictureRelation = []) => {
    let data = prostitutePictureRelation[0]
    return getImgUrl(data, 'url')
  }
  const clickTab = (item) => {
    router.push({ name: "actual", query: { id: item.prostituteTypeId } })
  }
  const loadData = () => {
    if (configStore.token) {
      get_type_list()
      getVideoList()
      getprostitutelist()
      getlivelist()
  
    } else {
      setTimeout(() => {
        loadData()
      }, 100)
    }
  }
  /**
   * @description 直播嵌入
   */
  const xlLiveInsertion = computed(() => $get(configStore, 'templateData.xlLiveInsertion.adList', []))
  const liveState = reactive({
    page: 1,
    list: [],
    loading: false,
    finished: false,
    refresh: false,
    first: true,
    total: 0
  })
  
  const computedLiveList = computed(() => inject_advertise_live_swiper(liveState.list, xlLiveInsertion.value, 5))
  const getlivelist = async () => {
  
    let params = { page: liveState.page, pageSize: 20 }
    let res = await getLiveList(params)
    let list = (res.result.list || []).map(item => {
      item.diamond_count = randomCount(3, 10)
      item.liveViewers = randomCount(10, 300)
      return item
    })
    if (liveState.page == 1) {
      liveState.list = list
    } else {
      liveState.list.push(...list)
    }
    liveState.refresh = false
    liveState.first = false
    liveState.loading = false
    liveState.finished = res.result.total <= liveState.list.length
    liveState.total = res.result?.total
  }
  const onLoadlive = () => {
    if (liveState.first) return
    if (liveState.list.length >= liveState.total) {
      liveState.finished = true
      return
    }
    liveState.loading = true
    liveState.page++
    getlivelist()
  }
  const onRefreshlive = async () => {
    liveState.refresh = true
    liveState.page = 1
    liveState.list = []
    await getlivelist()
  }
  watch(() => route.name, (val) => {
    if (val == 'home') {
      let index = typeList.value.findIndex(item => item.typeId == route.params.typeId)
      if (index !== -1) {
        changeTab(index)
      }
    }
  })
  onMounted(() => {
  
    loadData()
    window.route = route
  })
  
  </script>
  <style lang="less" scoped>
  .text2 {
    border-radius: 19px;
    background: linear-gradient(90deg, #2D57CC 0%, #AC63FF 100%);
    padding: 1px 8px;
    color: #FFF;
    font-family: Inter;
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
  }
  
  // 导航栏
  :deep(.van-tabs) {
    --van-tab-active-text-color: #F83E3C;
    --van-tab-font-size: 14px;
    --van-tabs-line-height: 38px;
    --van-tab-active-font-weight: 900;
    --van-tab-font-weight: 400;
    // --van-tabs-nav-background: #212121;
    --van-tabs-bottom-bar-width: 0;
    --van-tabs-bottom-bar-height: 0;
    --van-tab-text-color: #333333;
    // --van-tabs-bottom-bar-color: linear-gradient(69.79deg, #DE43D2 22.69%, #E41B79 81.62%);
    border-radius: 5px 5px 0 0;
    overflow: hidden;
    // --van-tabs-active-border-bottom: 3px #F83E3C solid;
    // :deep(.van-tabs--line) {
    // 	height: 1px;
    // 	width: 60px;
    // 	background-color: #F83E3C;
  
    // }
    .van-tabs__nav--line {
      height: 30px;
    }
  
    :deep(.van-tab__text) {
      font-family: PingFang SC;
      font-size: 14px;
  
  
      text-align: center;
  
    }
  
    .van-tabs__line {
      width: 20px;
      height: 3px;
      border-radius: 3px;
  
    }
  
    .van-tab {
      height: 24px;
      margin-top: 5px;
      padding-bottom: 10px;
  
  
    }
  
    :deep(.van-tab--grow) {
      padding: 0 10px;
  
    }
  
    .van-tab--active {
      // border-bottom: 3px #F83E3C solid;
      padding-bottom: 10px;
      // background: linear-gradient(90deg, #FFCF54 0%, #F48218 78.23%);
      // border-radius: 5px;
    }
  
  
  }
  
  // 导航栏右侧
  .tabBoxRight {
    display: flex;
    justify-content: flex-end;
    margin-top: 13px;
  
    .box {
      width: 30px;
      height: 20px;
      display: flex;
      justify-content: center;
    }
  }
  
  .bg-size {
    background-size: 100% 100% !important;
    background-position: left top !important;
  
    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.2);
      -webkit-backdrop-filter: blur(2px);
      backdrop-filter: blur(2px);
    }
  
  }
  
  .hotNav {
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    z-index: 999;
    height: 90px;
    width: 100%;
  
    .navName {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 25%;
  
  
      .name {
  
        font-family: PingFang SC;
        font-size: 16px;
        font-weight: 400;
        line-height: 22px;
        text-align: center;
         color: #fff;
      }
  
      .chooseName {
        font-family: PingFang SC;
        font-size: 18px;
        font-weight: 600;
        line-height: 22px;
        text-align: center;
          color: #fff;
      }
  
      .line {
        width: 20px;
        height: 3px;
        border-radius: 3px;
        // background-color: #fff;
        margin-top: 5px;
  
      }
  
      .chooseLine {
        width: 20px;
        height: 3px;
        border-radius: 3px;
        background-color: #FE2B54;
        margin-top: 5px;
      }
    }
  }
  
  .content {
    padding-top: 90px;
    color: #000;
  }
  
  .popUpBox {
    position: absolute;
    top: 50px;
    right: 20px;
    z-index: 999;
  
    .popUp {
      z-index: 999;
      width: 106px;
      height: 96px;
  
    }
  
    .popTxt {
      position: absolute;
      top: 20px;
      left: 20px;
      width: 106px;
      height: 96px;
  
      .popBtn {
        width: 80px;
        line-height: 30px;
        display: flex;
        color: #333333;
      }
    }
  }
  </style>
  