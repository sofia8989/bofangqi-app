<!-- 实战页面 -->

<template>
    <div style="background:#F9F8FC;" >
      <div class="recommendBox">
                    <img src="@/assets/images/nav/scFriend.png" />
                    <div class="hotTitle">情趣商城</div>
                    <div class="hotEnglish"></div>
                </div>
          <!-- 列表 -->
          <!-- <ScrollList :loading="state.loading" :finished="state.finished" :refresh="state.refresh" :list="videoList"
            @onLoad="onLoad" @onRefresh="onRefresh"> -->
            <div class="px-[10px] pt-[9px] grid grid-cols-2 gap-[5px]">
              <ShopMall v-for="item in state.videoList" :item="item" :key="item.prostituteId" @click="toDetail(item)">
              </ShopMall>
            </div>  
          <!-- </ScrollList> -->
    </div>
  </template>
  <script setup name="actual">
  import { watch, reactive, onMounted, ref, computed } from 'vue'
  import { config } from '@/store/config'
  import {getQqList } from '@/service/community'
  import ActualItem from '@/views/actual/components/actualItem.vue'
  import ShopMall from '@/views/nav/components/shop.vue'
  import CityPop from '@/views/actual/components/cityPop.vue'
  import DetailPop from '@/views/actual/components/detailPop.vue'
  import JiuGongGe from "@/components/Jiugongge.vue";
  import { useRoute } from "vue-router";
  import { $clickAd, $get, inject_advertise, randomCount } from '@/utils'
  import { get_prostitute_type_list } from "@/utils/prostituteTypeList";
  import { fetchImage } from '@/utils/imageUtils'; // 导入封装的函数
  const { prostituteTypeList } = get_prostitute_type_list()
  const configStore = config()
  const route = useRoute()
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
  
  
  // const selectType = () => {
  //   let index = 0
  //   let id = route.query?.id
  //   if (id) {
  //     let findI = prostituteTypeList.value.findIndex(item => item.prostituteTypeId == id) 
  //     index =  findI == -1 ? 0 : findI
  //   }
  //   active.value = index
  //   init()
  // }
  // 加载数据
  const init = async () => {
    const listData = await getQqList({})
    let list = listData.result || []
    list = list.map(item => {
      item.distance = randomCount(1, 30) / 10
      return item
    })
    listData.result.forEach(item => {
    fetchImage(item.cover).then((val) => {
      item.cover=val
      state.videoList.push(item)
    });
  });
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
  // watch(() => detailShow.value, (val) => {
  //   if (val) configStore.runCode();
  // })
  // watch(()=>route.query.id,(val)=>{
  //   if(val){
  //     selectType()
  //   }
  // })
  onMounted(() => {
    init()
  })
  </script>
  <style lang="less" scoped>
  .recommendBox {
    background: #F9F8FC;
    display: flex;
    align-items: center;
    padding: 8px 10px;

    img {
        width: 18px;
        height: 18px;
        margin-right: 5px;
    }

    .hotTitle {
        font-family: PingFang SC;
        font-size: 14px;
        font-weight: 600;
        line-height: 20px;
        color: #FF2E7E;
        margin-right: 5px;
    }


    .hotEnglish {
        font-family: PingFang SC;
        font-size: 14px;
        font-weight: 400;
        line-height: 20px;
        color: #B9BBBF;

    }
}
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
  </style>