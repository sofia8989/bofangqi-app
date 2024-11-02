<template>
  <div class="actualSearch text-white font-normal text-[12px]">
    <div class="fixed w-full top-0 bg-white z-10">
      <div class="flex h-[44px] items-center">
        <svg-icon class="h-[24px] w-[24px]" color="#fff" name="w-back" @click="$router.go(-1)"/>
        <van-search v-model="state.searchTxt" show-action class="flex-1 ml-2 mr-[2px] rounded-[4px] h-[32px]"
          input-align="left" placeholder="输入搜索关键词" @search="onSearch">
          <template #left-icon>
          </template>
          <template #action>
            <!-- <div @click="onSearch">搜索</div> -->
            <svg-icon @click="onSearch" name="search_2" color="#fff" class="w-[18px] h-[18px]"></svg-icon>
          </template>
        </van-search>
        <div class="flex items-center  px-1" @click="show = true">
          <svg-icon name="select-map" color="#FF60AD" class="w-[20px] h-[20px]"></svg-icon>
          <span class=" text-white text-[14px] pl-[5px]">{{ city }}</span>
        </div>
      </div>
      <div class="filter h-[32px] my-0 mx-auto flex justify-center items-center">
        <div>
          <span @click="sort_change(item.value)"
            :class="['px-1 flex-auto text-[14px] mr-1 h-full', state.sortType == item.value ? 'bg-[#FF60AD] rounded-[4px]' : 'text-[#979797]']"
            v-for="item in sortList" :key="item.value">{{ item.name }}</span>
        </div>
      </div>
    </div>
    <div class="mt-[76px]">
      <ScrollList :loading="state.loading" :finished="state.finished" :refresh="state.refresh" :list="state.videoList"
        @onLoad="onLoad" @onRefresh="onRefresh">
        <CardItem v-for="item in state.videoList" @click="toDetail(item)" :item="item" :key="item.prostituteId">
        </CardItem>
      </ScrollList>
    </div>
    <CityPop @submit="submit" v-model="show" />
    <DetailPop v-model="detailShow" :id="activeId" :activeInfo="activeInfo"/>
  </div>
</template>
<script setup name="actualSearch">
import { ref, computed, onMounted, reactive } from "vue";
import { getProstituteList, getProstituteTypeList, getProsituteDetail } from '@/service/prostituteApi'
import CityPop from '@/views/actual/components/cityPop.vue'
import CardItem from '@/views/actualSearch/components/cardItem.vue'
import DetailPop from '@/views/actual/components/detailPop.vue'
import { showToast } from 'vant'
import { get_prostitute_type_list } from "@/utils/prostituteTypeList";
import { $get } from "@/utils";
const { prostituteTypeList } = get_prostitute_type_list()
const activeInfo = computed(()=>$get(prostituteTypeList,'value.0',{}))
const show = ref(false)
const city = ref('全国')
const submit = (value) => {
  city.value = value
}
const sortList = ref([
  { name: "智能排序", value: 'sort_DESC' },
  { name: "按发布时间", value: 'prostituteId_DESC' },
])

const state = reactive({
  videoList: [], // 视频列表数据
  pageNum: 1,
  searchTxt: "",
  sortType: 'sort_DESC',
  loading: false,
  finished: false,
  refresh: false,
  first: true,
  pagecount: 0
})
const onSearch = () => {
  if (state.searchTxt) {
    init()
  }else{
    showToast('输入搜索关键词')
  }
}
const sort_change = (val) => {
  state.sortType = val
  state.videoList = []
  state.loading = true
  state.pageNum = 1
  init()
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
//   // 加载数据
const init = async () => {
  let params = {
    prostituteTypeId: activeInfo.value.prostituteTypeId || 1,
    page: state.pageNum,
    pageSize: 20,
    sortType: state.sortType
  }
  if (state.searchTxt) params.title = state.searchTxt;
  const listData = await getProstituteList(params)
  const list = listData.result.list || []
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
//   // 下拉刷新
const onRefresh = async () => {
  state.refresh = true
  state.pageNum = 1
  state.videoList = []
  await init()
}
const detailShow = ref(false)
const activeId = ref(0)
const toDetail = async (item) => {
  activeId.value =item.prostituteId
  detailShow.value = true
}
onMounted(() => {
  init()
})
</script>
<style lang="less" scoped>
:deep(.van-search) {
  --van-search-content-background: #fff;
  --van-search-background: #fff;
  --van-search-input-height: 32px;
  --van-field-input-text-color: #c8c9cc;
  --van-search-padding: 0;
  --van-active-color:#fff;
}
</style>