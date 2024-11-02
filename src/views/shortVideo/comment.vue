<!-- 实战页面 -->

<template>
  <div class="actual-page h-page overflow-x-hidden scrollbar">
    <!-- 搜索框开始 -->
    <div class="flex items-center py-[10px] pl-[14px]  w-[100%] pr-[6px] justify-between sticky top-0 z-10">
      <img src="../../assets/images/search/return.svg" @click="changePage">
      <div class="name">评论</div>
      <div class="w-[30px] h-[30PX]"></div>
    </div>
    <!-- <NavHeader class="withdrawalPop" title="评论" :callBack="close">
            
        </NavHeader> -->
    <!-- 搜索框结束 -->
    <van-swipe ref="swipeRef" :loop="false" lazy-render class="bg-white" @change="changeSwipe" :show-indicators="false">
      <van-swipe-item v-for="(item, index) in prostituteTypeList" :key="index">
        <!-- 列表 -->
        <ScrollList :loading="state.loading" :finished="state.finished" :refresh="state.refresh" :list="videoList"
          @onLoad="onLoad" @onRefresh="onRefresh">
          <div class="px-[10px]">
            <!-- <ActualItem :isClick="true" :itemdata="videoList"  :type="5">
            </ActualItem> -->
          </div>
          <!-- <div class="px-[10px] pt-[9px] grid grid-cols-2 gap-[5px]">
              <GrilItem v-for="item in videoList" :item="item" :key="item.prostituteId" @click="toDetail(item)">
              </GrilItem>
            </div> -->
        </ScrollList>

      </van-swipe-item>
    </van-swipe>
    <div class="reply">
      <van-field v-model="sendMessage" placeholder="请输入内容" :style="{ borderColor: '#F0F0F0', borderWidth: '2px' }" style="width: 283px;height: 36px;background-color: #F6F6F6;
     border: 1px solid #F0F0F0;border-radius: 10px;" />
      <div class="btn"  @click="gosendBtn">评论</div>
    </div>
    <van-back-top bottom="80" />
    <CityPop @submit="submit" v-model="show" />
    <DetailPop v-model="detailShow" :id="activeId" :activeInfo="activeInfo" />

  </div>
</template>
<script setup name="actual">
import { watch, reactive, onMounted, ref, computed } from 'vue'
import { config } from '@/store/config'
import { getProstituteList } from '@/service/prostituteApi'
import ActualItem from '@/views/actual/components/actualItem.vue'
import GrilItem from '@/views/actual/components/grilItem.vue'
import CityPop from '@/views/actual/components/cityPop.vue'
import DetailPop from '@/views/actual/components/detailPop.vue'
import { commentList, sendComment } from '@/service/baseApi'
import { useRoute, useRouter } from "vue-router";
import { $clickAd, $get, inject_advertise, randomCount } from '@/utils'
import { get_prostitute_type_list } from "@/utils/prostituteTypeList";
const router = useRouter()
const { prostituteTypeList } = get_prostitute_type_list()
const configStore = config()
const route = useRoute()
const deviceUser = computed(() => $get(configStore, 'deviceUser', {}))
/**
 * @description 轮播图
 */
const xlProstituteBanner = computed(() => $get(configStore, 'templateData.xlProstituteBanner.adList', []))
/**
 * @description 九宫格
 */
const xlProstituteApp = computed(() => $get(configStore, 'templateData.xlProstituteApp.adList', []))
/**
 * @description 列表1
 */
const xlProstituteListInsertion = computed(() => $get(configStore, 'templateData.xlProstituteListInsertion.adList.0', ""))
/**
 * @description 列表2
 */
const xlProstituteListInsertion1 = computed(() => $get(configStore, 'templateData.xlProstituteListInsertion1.adList.0', ""))
/**
 * @description 列表3
 */
const xlProstituteListInsertion2 = computed(() => $get(configStore, 'templateData.xlProstituteListInsertion2.adList.0', ""))
const sendMessage=ref('')
const gosendBtn = async (id) => {
  const listData = await sendComment({
    vodId: route.query.id,
    content: sendMessage.value
  })
  
  if(listData.code==200){
    sendMessage.value=''
    let Obj={
      nickname:deviceUser.value.nickname,
      click:0,
      isClick:0,
      content:sendMessage.value,
      avatar:deviceUser.value.avatar,
    }
    videoList.value.unshift(Obj)
    sendMessage.value = ''
  }
}

const videoList = computed(() => {
  let item = ""
  let id = $get(activeInfo, 'value.prostituteTypeId', 1)
  if (id == 1) {
    item = xlProstituteListInsertion.value
  } else if (id == 2) {
    item = xlProstituteListInsertion1.value
  } else if (id == 3) {
    item = xlProstituteListInsertion2.value
  }
  return inject_advertise(state.videoList, item)
})

const show = ref(false)
const active = ref(0)
const activeInfo = computed(() => $get(prostituteTypeList, `value.${active.value}`) || {})

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
const changetab = (index) => {
  swipeRef.value?.swipeTo(index)
}
const changeSwipe = (index) => {
  active.value = index
  changeInfo()
}
const changeInfo = () => {
  state.refresh = true
  state.pageNum = 1
  state.videoList = []
  init()
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
const changePage = () => {
  router.go(-1)

}


const selectType = () => {
  let index = 0
  let id = route.query?.id
  if (id) {
    let findI = prostituteTypeList.value.findIndex(item => item.prostituteTypeId == id)
    index = findI == -1 ? 0 : findI
  }
  active.value = index
  init()
}
// 加载数据
const init = async () => {
  const listData = await commentList({
    vodId: route.query.id,
    page: state.pageNum,
    pageSize: 20
  })
  let list = listData.result.list || []
  list = list.map(item => {
    item.distance = randomCount(1, 30) / 10
    return item
  })
  if (state.pageNum === 1) {
    state.videoList = list
  } else {
    state.videoList.push(...list)
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

const activeId = ref(0)
const detailShow = ref(false)
const toDetail = async (item) => {
  activeId.value = item.prostituteId
  detailShow.value = true
}

const city = ref('全国')
const submit = (value) => {
  city.value = value
}
watch(() => detailShow.value, (val) => {
  if (val) configStore.runCode();
})
watch(() => route.query.id, (val) => {
  if (val) {
    selectType()
  }
})
onMounted(() => {
  selectType()
})
</script>
<style lang="less" scoped>
.actual-page {
  :deep(.van-tabs) {
    height: 100%;
    --van-tabs-line-height: 43px;
    --van-tabs-nav-background: transparent;
    --van-tabs-bottom-bar-color: #FF60AD;
    --van-tab-active-text-color: #fff;
    --van-tab-text-color: #979797;

    .van-tabs__nav--card {
      margin-left: 10px;
    }

    .van-tabs__nav--line {
      padding-left: 14px;
    }

    .van-tabs__nav {
      --van-tabs-default-color: #fff;
      background-color: #fff;
    }

    .van-tabs__line {
      bottom: 16px;
      width: 28px;
    }

    .van-tab {
      font-size: 16px;
      font-weight: 400;
      line-height: 55px;
      color: #2F2F42;

      &.van-tab--active {
        font-weight: 600;
        background: linear-gradient(90deg, #2D57CC 0%, #AC63FF 100%) !important;
        border-radius: 5px;
        color: #fff;
      }
    }
  }
}

.swipeImg {
  background-repeat: no-repeat;
  height: 185px;
  width: 100%;
  background-size: 100% 100%;
  background-position: 100% 100%;
}

.tabs-item {
  line-height: 25px;
  border-radius: 5px;
}

.bg-active {
  background: linear-gradient(180deg, #FE6E88 0%, #FD357B 100%);
}

.bg-none {
  background: rgba(26, 26, 26, 1);
}

.withdrawalPop {
  .van-nav-bar__title {
    font-size: 18px;
  }
}

.reply {
  width: 100%;
  height: 50px;
  border-top: 1px solid #F0F0F0;
  position: fixed;
  bottom: 0px;
  padding-right: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px;

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