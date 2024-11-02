<template>
	<!-- 列表 -->
	<van-swipe v-if="item.type == 1 || item.type == 3" :class="{ 'col-span-2': item.type == 3 }" :autoplay="3000"
		:show-indicators="false">
		<van-swipe-item v-for="ad of item.list" :key="ad.adId">
			<img @click="$clickAd(ad)" class="w-full rounded-[5px]"
				:style="{ 'height': item.type == 1 ? height : '200px' }" v-olazyload="getImgUrl(ad)">
			<div class="mt-[5px] text-left text-black w-full dden text-ellipsis whitespace-nowrap">{{ ad.adName
				}}</div>
		</van-swipe-item>
	</van-swipe>
	<div v-else-if="item.adId" class="cursor-pointer" @click="$clickAd(item)">
		<img class="rounded-[5px] w-full" :style="{ height }" v-olazyload="getImgUrl(item)" />
		<div class="mt-[5px] text-left text-black w-full overflow-hidden text-ellipsis whitespace-nowrap">{{ item.adName
			}}
		</div>
	</div>

	<!-- 首页用的视频 -->
	<div :class="['relative', { 'col-span-2': item.type == 2 }]" v-else @click="toDetail">
		<!-- <img src="@/assets/images/vip_icon1.png" class="absolute h-[18px] top-0 left-0"> -->
		<img class="rounded-[5px]  w-full" :style="{ 'height': item.type == 2 ? '195px' : height }"
			v-olazyload="getVideoCover(item.vodPic)" />
		<div class="mt-[5px] text-left text-black w-full overflow-hidden text-ellipsis whitespace-wrap text">{{
			item.vodName }}{{ item.type }}22222
		</div>
	</div>
</template>
<script setup>
import { $clickAd, getImgUrl, getVideoCover } from '@/utils';
import { useRouter } from 'vue-router'
const props = defineProps({
	// 资源详情
	item: {
		type: Object,
		default: {
			vodPic: '', // 封面图片
			vodName: '', // 标题
			vodId: [], // ID
		}
	},
	isClick: {
		type: Boolean,
		default: false
	},
	height: {
		type: String,
		default: '97.5px'
	}

})
const goVideoList=(item)=>{
    router.push({ name: 'welfare', query: {item} });
}
const router = useRouter()
const toDetail = () => {
	if (props.isClick) { return }
	router.push({ path: `/video-detail/${props.item.vodId}` })
}
</script>
<style>
.text {
	display: -webkit-box;
	-webkit-line-clamp: 2;
	-webkit-box-orient: vertical;
	overflow: hidden;
	text-overflow: ellipsis;
	max-height: 3.0em;
	/* 设置为行高的两倍 */
	line-height: 1.5em;
	/* 这里的行高应与下面p标签中的行高一致 */
}
</style>
