<!-- av搜索页 -->

<template>
  <div class="search_page_container bg-white ">
    <!-- <div class="flex items-center py-[10px] pl-[14px] bg-black/80 w-[100%] pr-[6px] justify-between sticky top-0 z-10">
      <van-search v-model="searchTxt" show-action autofocus class="flex-1 rounded-[4px] h-[34px]" placeholder="请输入搜索关键词"
        @search="onSearch" @focus="showHot = true" background="#fff">
        <template #action>
          <div @click="onSearch">搜索</div>
        </template>
      </van-search>
      <span class="ml-[8px] text-[#EC366E] text-[14px]" @click="changePage">取消</span>
    </div> -->
    <!-- <div class="sticky top-[54px] z-10" @click="showHot = false">
      <HotSearch v-show="showHot" @search="onSearch" class="absolute top-0 left-0 w-full z-10"></HotSearch>
    </div> -->
    <NavHeader class="h-[44px]" title="更多" bg="#fff" :callBack="() => $router.go(-1)"></NavHeader>
    
    <!-- <SwipeAd :list="xlAVBanner" /> -->
    <!-- 搜索结结果页 -->
    <template v-if="isResultPage == true" >
        <ScrollList  :loading="listObj.isloading" :finished="listObj.isfinished" :refresh="listObj.isRefreshing"
          :list="listObj.listData" @onLoad="onLoad" @onRefresh="onRefresh">
          <div class="grid gap-y-[8px] gap-x-[10px] grid-cols-2 pt-0 pb-[14px] px-[10px]" style="margin-top:10px;">
            <DetailItem v-for="(item, i) in listObj.listData" :item="item" :key="item.vodId" class="ppp" ></DetailItem>
          </div>
        </ScrollList>
      </template>
    <Welfare style="margin-top: 10px;"  v-if="!isResultPage" />
  </div>
</template>

<script setup>
import { ref, computed, reactive, onMounted, watch } from 'vue'
import { config } from '@/store/config'
import { reqsearchKeyWords, getAdultList } from '@/service/community'
import { showLoadingToast, closeToast } from 'vant';
import Welfare from '@/views/welfare/welfare.vue'
import HotSearch from "@/components/hotSearch.vue";
import { $get } from '@/utils'
import router from '@/router'
const configStore = config()

const searchTxt = ref('')
const isResultPage = ref(false)
const historySearch = ref([])
const avtiveTab = ref(1)
const showHot = ref(false)
/**
 * @description 轮播图
 */
const xlAVBanner = computed(() => $get(configStore, 'templateData.xlAVBanner.adList', []))
const onSearch = (val) => {
  Object.assign(listObj, initListObj())
  showHot.value = false
  if (typeof val === 'string') {
    searchTxt.value = val
  }
  loadList()
}

const initListObj = () => ({
  listData: [],
  pageNum: 1,
  pageSize: 20,
  pageAount: 0,
  isRefreshing: false,
  isloading: false,
  isfinished: false
})
// 列表数据对象
const listObj = reactive(initListObj())

/**
 * 加载搜索数据
 */
const loadList = async () => {
  if (!searchTxt.value) return
  try {
    listObj.isloading = true
    setHistoryRecords(searchTxt.value)
    let res = {}
    let params = { vodName: searchTxt.value, page: listObj.pageNum, pageSize: 10 }
    res = await getAdultList(params)
    isResultPage.value = true
    if (res?.result?.list?.length) {
      if (avtiveTab.value != 1) {
        res.result.list.forEach(item => {
          item.commit = Math.floor(Math.random() * 500) + 1
        })
      }
      listObj.listData.push(...res.result.list)

    }
    listObj.isfirst = false
    listObj.pageAount = res.result.total
    listObj.isfinished = res.result.total <= listObj.listData.length
  } catch (error) {
    console.error(error)
  }
  listObj.isloading = false
  listObj.isRefreshing = false
}

/**
 * 下拉刷新
 */
const onRefresh = async () => {
  if (listObj.isloading) return
  Object.assign(listObj, initListObj())
  listObj.isRefreshing = true
  loadList()
}

/**
 * 上拉加载更多
 */
const onLoad = async () => {
  if (listObj.isfirst) return
  if (listObj.listData.length >= listObj.pageAount) {
    listObj.isfinished = true
    return
  }
  listObj.pageNum++
  loadList()
}

const changePage = () => {
  if (isResultPage.value) {
    searchTxt.value = ''
    isResultPage.value = false
    historySearch.value = getHistoryRecords()
    showHot.value = false
    return
  }
  router.go(-1)
}
const clearHistory = () => {
  localStorage.searchItems = ''
  historySearch.value = []
}
/**
 * 从缓存中获取搜索数据
 */
const getHistoryRecords = () => {
  const it = localStorage.searchItems
  return it ? [...new Set(JSON.parse(it))].slice(-15) : []
}
/**
 * 存储搜索数据到浏览器
 * @param {string} txt 
 */
const setHistoryRecords = (txt) => {
  if (typeof txt === 'string' && txt) {
    let it = getHistoryRecords()
    localStorage.searchItems = JSON.stringify(it.concat(txt))
  }
}


watch(() => listObj.isloading, (nv) => {
  if (nv) {
    showLoadingToast({
      duration: 0,
      forbidClick: true,
      message: '加载中...',
    });
  } else {
    closeToast()
  }
})

watch(avtiveTab, () => {
  Object.assign(listObj, initListObj())
  loadList()
})

onMounted(async () => {
})

</script>

<style scoped lang="less">
.search_page_container {
  --van-search-content-background: transparent;
  --van-search-action-text-color: #969798;
  --van-field-input-text-color: #c8c9cc;
}

.swipe-imgbox {
  height: 90px;
  width: 100%;
  background: no-repeat center center/100% 100%;
}

.custom-indicator {
  position: absolute;
  bottom: 15px;
  left: 50%;
  display: flex;
  transform: translate(-50%);
  border-radius: 5px;

  .item {
    width: 6px;
    height: 6px;
    background-color: #EDEDEF;
    border-radius: 5px;
    margin: 0 3px;
  }

  .active {
    background-color: #FE2B54;
  }
}
</style>
