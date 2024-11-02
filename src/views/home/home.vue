<template>
	<div id="page" class="home-page h-page text-white overflow-x-hidden scrollbar">
		<div class="sticky top-0 z-20 bg-white mb-[3px]">
			<vipCz v-model="shareShow" />
			<Topboot></Topboot>
			<!-- 导航栏开始 -->
			<div class="w-full flex items-center h-[46px] pt-[3px]">
				<div class="flex items-center flex-auto pt-[2px] flex-shrink-0 flex-grow-0 w-[300px] h-full">
					<van-tabs v-model:active="active" @change="changeTab" shrink background="#fff" color="#F83E3C"
						title-active-color="#F83E3C" title-inactive-color="#2F2F42">
						<van-tab v-for="item of typeList" :title="item.typeName" @click="handleTabClick(item)">
						</van-tab>
					</van-tabs>
				</div>
				<div class="flex-1 h-full tabBoxRight">
					<div class="box">
						<img class="w-[20px] h-[22px]" style="margin-top:-4px;"
							@click="$router.push({ path: `/search` })" src="../../assets/images/home/search.svg" />
					</div>
					<div class="box">
						<img class="w-[17px] h-[12px]" style="margin-top: 1px;"
							@click="$router.push({ path: `/searchav/${47}` })"
							src="../../assets/images/home/more.png" />
					</div>
				</div>
			</div>
			<!-- 导航栏结束 -->
			<van-notice-bar v-show="activeTypeId != -2" style="--van-notice-bar-height:29px;" color="#9F7070"
				background="#FFF1F1" :left-icon="noticeBarIcon" :text="AppNotify" />
		</div>
		
		
		<van-swipe ref="swipeRef" :loop="false" lazy-render class="bg-white" @change="changeSwipe"
			:show-indicators="false">
			<van-swipe-item v-for="(item, i) in typeList" :key="i">
				<!-- 轮播图 -->
				
				<swiper style="margin-top: 10px;"></swiper>
				<template v-if="activeTypeId == -2 && item.typeId == -2">
					<shortVideo :class="inStandaloneMode ? 'h-[calc(100vh-119px)]' : 'h-[calc(100vh-172px)]'">
					</shortVideo>
				</template>
				
				<template v-else>

					<SwipeAd :list="activeTypeId == -1 ? xlLiveBanner : xlHomeBanner" />
					
					<JiuGongGe :list="videolist" v-if="active== 0" style="margin-top: 10px;"></JiuGongGe>
					<titleItem v-if="activeTypeId != -1" title="今日推荐-更新推荐" :list="typeList[tabIndex]"  @updateData="handleData"/>
					<ScrollList v-if="activeTypeId != -1" :loading="state.loading" :finished="state.finished"
						:refresh="state.refresh" :list="computedStateList" @onLoad="onLoad" @onRefresh="onRefresh">
						<div class="grid gap-y-[8px] gap-x-[10px] grid-cols-2 pt-0 pb-[14px] px-[10px]">
							<DetailItem v-for="(item, i) in computedStateList" :item="item"
								:key="item.vodId || item.adId || i"  >
							</DetailItem>
						</div>
					</ScrollList>
					<img src="" />
				</template>
			</van-swipe-item>
		</van-swipe>
		<van-back-top immediate bottom="80" />
	</div>
</template>
<script setup name="home">
import axios from 'axios';
import { nextTick, onMounted, reactive, ref, computed, watch } from 'vue'
import { config } from '@/store/config'
import { getProstituteList } from '@/service/prostituteApi'
import { useRoute, useRouter } from 'vue-router'
import { getTypeList, getAdultList } from '@/service/community'
import { $get, getImgUrl, inject_ad_home_swper, randomCount, $clickAd, inject_advertise_swiper, inject_advertise_live_swiper } from '@/utils';
import JiuGongGe from "@/components/Jiugongge.vue";
import titleItem from "@/views/home/components/titleItem.vue";
import shortVideo from "@/views/shortVideo/index.vue";
import swiper from "@/components/swiper.vue"
import { showToast } from 'vant'
import DetailItemFree from "./components/DetailItemFree.vue"
import { getLiveList } from '@/service/liveApi'
import { get_prostitute_type_list } from "@/utils/prostituteTypeList";
import { useChoiceList } from '@/store/choiceList'
import { inStandaloneMode } from '@/utils/common.js'
import noticeBarIcon from "@/assets/images/notice-bar-icon.svg"
import vipCz from '@/views/home/components/vipCz.vue'
// import { useImageFetcher } from '@/utils/imageUtils'; // 导入封装的函数

const choiceList = useChoiceList()
const configStore = config()
const router = useRouter()
const route = useRoute()

//获取图片正确内容
const configData = computed(() => $get(configStore, 'configData', {}))
const imageBase64=ref()
const imgUrl=ref('')
const fetchImage=async(url)=> {
       const response = await fetch(imgUrl);
        if (!response.ok) {
        }
		imageBase64.value=await response.text()
		convertBase64ToUrl(imageBase64.value)
    }
	const imageUrl=ref()
	const convertBase64ToUrl=(fileContent)=> {
		try {
        const byteCharacters = atob(fileContent); // 解码 Base64
        const byteNumbers = new Uint8Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const blob = new Blob([byteNumbers], { type: 'image/png' }); // 根据实际类型修改
        imageUrl.value = URL.createObjectURL(blob); // 创建 URL
	} catch (error) {
        console.error("Decoding Base64 failed: ", error);
    }
    }
//获取图片正确内容

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
const videolist= computed(() => $get(configStore, 'templateData.videolist.adList', []))
/**
 * @description 视频嵌入
 */
 const computedStateList = computed(() => inject_advertise_swiper(state.videoList, xlHomeVideoInsertion.value, choiceVideoList.value))
const xlHomeVideoInsertion = computed(() => $get(configStore, 'templateData.xlHomeVideoInsertion.adList', []))
const AppNotify = computed(() => $get(configStore, 'configData.config.AppNotify', ''))
const shareShow = ref(true)
const videoList = ref([])
const computedVideoList = computed(() => inject_ad_home_swper(videoList.value, xlHomeVideoInsertion.value).slice(0, 12))
const recommendActive = ref(0)
const changeNewVideo = () => {
	if (recommendActive.value + 1 < computedVideoList.value.length) {
		recommendActive.value++
	} else {
		recommendActive.value = 0
	}
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

const toInfo = (routerView, item) => {
	// router.push({ path: routerView, query: { adId: item.adId } })
	router.push({ path: routerView })
}

const handleData=(val)=>{
	if(val){
		onRefresh()
	}
}

const handleTabClick = (item) => {
	console.log(item.is_free, '++++++++++++++')
}

const typeList = ref([])
const active = ref(0)
const activeTypeId = ref(49)
const get_type_list = async () => {
	let res = await getTypeList({ modules: 'Home' })
	typeList.value = res.result
	console.log(typeList.value, '8989898989----------------')
	// typeList.value.splice(1, 0, { typeId: -1, typeName: "直播" })
	//typeList.value.push({ typeId: -2, typeName: '抖阴' })
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
const tabIndex=ref(0)
const swipeRef = ref()
// 导航栏切换
const changeTab = (index, item) => {
	if (typeList.value[index].is_free == 1) {
		freeShow.value = false
	} else {
		freeShow.value = true
	}
	tabIndex.value=index
	if (index == 1) {
		// router.push({ name: 'hot' });
	}
	state.videoList=[]
	swipeRef.value?.swipeTo(index)
	changeSwipe(index)
}
const freeShow = ref(true)
const changeSwipe = (index) => {
	tabIndex.value=index
	console.log(index,'456456')
	if (typeList.value[index].is_free == 1) {
		freeShow.value = false
	} else {
		freeShow.value = true
	}
	active.value = index
	set_active_type_id(index)
	document.getElementById('page').scrollTop=0
}
const set_active_type_id = (index) => {
	activeTypeId.value = typeList.value[index].typeId
	if (![-1, -2].includes(activeTypeId.value)) {
		state.refresh = true
		state.pageNum = 1
		state.videoList = []
		nextTick(() => init())
		//init()
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
const init = async (index) => {
	const listData = await getAdultList({
		typeId: activeTypeId.value,
		page: state.pageNum,
		pageSize:20
	})
	if (state.pageNum == 1) {
		state.videoList = listData.result.list || []
	} else {
		state.videoList.push(...listData.result.list)
	}
	if(tabIndex.value!==0){
		state.videoList.forEach(item=>{
			item.type=2
		})
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
	 state.pageNum++
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
	// fetchImage()
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
</style>
