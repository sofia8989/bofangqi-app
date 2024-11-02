<!-- 福利（AV）页面 -->

<template>
  <div class="home-page h-page overflow-x-hidden scrollbar" >
    <!-- 头部 -->
    <!-- 是否嵌套在av搜索页 -->
    <template v-if="route.name === 'searchav'">
      <div class="text-[18px] pl-[14px] text-white">推荐视频</div>
      <!-- <JiuGongGe :list="xlAVApp"></JiuGongGe> -->
      <ScrollList :loading="state.loading" :finished="state.finished" :refresh="state.refresh" :list="computedVideoList"
        @onLoad="onLoad" @onRefresh="onRefresh">
        <div class="grid gap-y-[13px] gap-x-[10px] grid-cols-2 pt-0 pb-[14px] px-[10px]">
          <DetailItem v-for="(item, i) in computedVideoList" :item="item" :key="item.vodId"> </DetailItem>
        </div>
      </ScrollList>
    </template> 
    <template v-else>
      <van-swipe ref="swipeRef" :loop="false" class="bg-black/5" lazy-render @change="changeSwipe"
        :show-indicators="false">
        <van-swipe-item v-for="(item, index) in typeList" :key="index">
          <SwipeAd :list="xlAVBanner" />
          <ScrollList  :loading="state.loading" :finished="state.finished" :refresh="state.refresh"
            :list="computedVideoList" @onLoad="onLoad" @onRefresh="onRefresh" style="background-color: #fff;">
            <div class="grid gap-y-[8px] gap-x-[10px] grid-cols-2 pt-0 pb-[14px] px-[10px]" style="background-color: #fff;" >
              <DetailItem v-for="(item, i) in computedVideoList" :item="item" :key="i" >
              </DetailItem>
            </div>
          </ScrollList>
          <!-- <div class="h-[80px]"></div> -->
        </van-swipe-item>
      </van-swipe>
    </template>
    <van-back-top bottom="80" />
  </div>
</template>
<script setup name="welfare">
import { watch, reactive, onMounted, computed, onDeactivated, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { config } from '@/store/config'
import { getTypeList, getvideoRecordList } from '@/service/community'
import { getTopSubTypeList } from "@/service/video";
import JiuGongGe from "@/components/Jiugongge.vue";
import { $get, getImgUrl, inject_ad_home_swper } from '@/utils'
import { useChoiceList } from '@/store/choiceList'
import Media from '@/components/Media.vue'
import { welfareView } from '@/service/home'
import Topboot from "@/components/Topboot.vue";
import noticeBarIcon from "@/assets/images/notice-bar-icon.svg"
const props = defineProps({
    type: {
        type: Number,
        default: 1
    },
    indexNav: {
        type: Number,
        default: 1
    }
})
const choiceList = useChoiceList()
const configStore = config()
const route = useRoute()
const router = useRouter()

const active = ref(0)
const activeTypeId = ref(0)
const typeList = ref([])
const state = reactive({
  videoList: [], // 视频列表数据
  pageNum: 1,
  loading: false,
  finished: false,
  refresh: false,
  first: true,
  pagecount: 0
})
const swipeRef = ref()
/**
 * @description logo
 */
const xlHomeLogo = computed(() => $get(configStore, 'templateData.xlHomeLogo.adList.0', {}))
/**
 * @description 插入的精选视频
 */
const choiceVideoList = computed(() => $get(choiceList, 'videoList', []))
/**
 * @description 轮播图
 */
const xlAVBanner = computed(() => $get(configStore, 'templateData.xlAVBanner.adList', []))
/**
 * @description 九宫格
 */
const xlAVApp = computed(() => $get(configStore, 'templateData.xlAVApp.adList', []))
/**
 * @description 视频嵌入
 */
const xlAVVideoInsertion = computed(() => $get(configStore, 'templateData.xlAVVideoInsertion.adList', []))
/**
 * @description 文字广告
 */
const xlHomeTextList = computed(() => $get(configStore, 'templateData.xlHomeTextList.adList', []))

const computedVideoList = computed(() => inject_ad_home_swper(state.videoList, xlAVVideoInsertion.value,![69,47].includes(+activeTypeId.value) ? choiceVideoList.value : []))

const AppNotify = computed(() => $get(configStore, 'configData.config.AppNotify', ''))
const changetab = (index) => {
  swipeRef.value?.swipeTo(index)
}
const changeSwipe = (index) => {
  active.value = index
  changeTabid(index)
}
const changeTabid = (index) => {
  activeTypeId.value = typeList.value[index].typeId
  state.refresh = true
  state.pageNum = 1
  state.videoList = []
  if (activeTypeId.value == 34) {
    get_top_sub_type_list()
  } else {
    init()
  }
}

// delay 为防抖时间
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


// 加载数据 
const init = async () => {
  let params = {
    page: state.pageNum,
        pageSize: 20,
        type: props.type
  }
  const res = await getvideoRecordList(params)
  if (params.page == 1) {
    state.videoList = res.result.list
  } else {
    state.videoList.push(...res.result.list)
  }
  state.pagecount = res.result.total
  state.refresh = false
  state.first = false
  state.loading = false
  state.finished = res.result.total <= state.videoList.length
}
// 下拉刷新
const onRefresh = async () => {
  state.refresh = true
  state.pageNum = 1
  state.videoList = []
  await init()
}


const toSearch = () => {
  router.push({ path: `/searchav/${activeTypeId.value}` })
}
const loadType = () => {
  if (route.name === 'searchav') {
    setTimeout(() => {
      activeTypeId.value = route.params.type
      init()
    })
  } else {
    getTypeList().then((res) => {
      typeList.value = res.result
      activeTypeId.value = res.result[0].typeId
      init()
    })
  }
}
const subList = ref([])
const get_top_sub_type_list = async () => {
  let res = await getTopSubTypeList({ type: "top_chuanmei" })
  subList.value = res.result || []
}
onMounted(() => {
  loadType()
  welfareView({channelKey: window.localStorage.getItem("_pageName") || 'index.html'})
})

</script>

<style lang="less" scoped>
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 375px;
  height: 51px;

  .title {
    flex: 1;
    border-radius: 5px;
    background-color: #fff;
    color: #929292;
    font-family: PingFang SC;
    font-size: 13px;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
    padding: 8px 15px;
    margin-left: 7px;
    margin-right: 7px;
    display: flex;
    justify-content: space-between;
  }
}

:deep(.van-tabs) {
  --van-tab-active-text-color: #fff;
  --van-tab-font-size: 16px;
  --van-tabs-line-height: 38px;
  --van-tabs-nav-background: #fff;
  --van-tabs-bottom-bar-width: 0;
  --van-tabs-bottom-bar-height: 0;
  --van-tab-text-color: #2F2F42;
  // --van-tabs-bottom-bar-color: linear-gradient(69.79deg, #DE43D2 22.69%, #E41B79 81.62%);
  border-radius: 5px 5px 0 0;
  overflow: hidden;

  .van-tab {
    height: 24px;
    margin-top: 5px;
  }

  .van-tab--active {
    background: linear-gradient(90deg, #2D57CC 0%, #AC63FF 100%);
    border-radius: 5px;
  }
}

.bg-menu {
  background: linear-gradient(90deg, #2D57CC 0%, #AC63FF 100%);
}
</style>
