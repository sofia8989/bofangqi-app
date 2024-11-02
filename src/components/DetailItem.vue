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
		<img class="rounded-[5px]  w-full" :style="{ 'height': item.type == 2 ? '195px' : height }" :src="img" style="object-fit: cover;"   @error="onImageError()"/>
		<img  v-if="item.type_id!==69" style="width: 25px;height:14px;position: absolute;top:0;right:0px;z-index: 1;" src="@/assets/images/shortVideo/vip.png" />
		<div class="mt-[5px] text-left text-black w-full overflow-hidden text-ellipsis whitespace-wrap text">{{
			item.vodName }}{{ item.type }}
		</div>
	</div>
</template>
<script setup>
//  import { fetchImage } from '@/utils/imageUtils'; // 导入封装的函数
import { $clickAd, getImgUrl, $get } from '@/utils';
import { useRouter } from 'vue-router';
import { config } from '@/store/config'
import { ref, computed, onMounted, watch } from 'vue'
//  import { watch } from 'less';
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


//获取图片正确内容
const configStore = config()
const configData = computed(() => $get(configStore, 'configData', {}))
const imageBase64 = ref()
const imgUrl = ref('')

const fetchImage = async (url) => {
	// imgUrl.value='http://api.dahuangua.com/imgBase64/cover/1.xyz'
	if (url.substring(0, 4)=='http') {
		imgUrl.value = url
	} else if (url.substring(0, 4)=='blob') {
		return
	} else {
		imgUrl.value = configData.value.config.AwsS3Host + url
	}
	const response = await fetch(imgUrl.value);
	if (!response.ok) {
	}
	imageBase64.value = await response.text()
	convertBase64ToUrl(imageBase64.value)
}
const imageUrl = ref()
const convertBase64ToUrl = (fileContent) => {
	const byteCharacters = atob(fileContent); // 解码 Base64
	const byteNumbers = new Uint8Array(byteCharacters.length);
	for (let i = 0; i < byteCharacters.length; i++) {
		byteNumbers[i] = byteCharacters.charCodeAt(i);
	}
	const blob = new Blob([byteNumbers], { type: 'image/jpeg' }); // 根据实际类型修改
	props.item.vodPic = URL.createObjectURL(blob); // 创建 URL
	img.value = URL.createObjectURL(blob)
}
//获取图片正确内容
const img = ref('')
watch(() => props.item, (vala) => {
	fetchImage(props.item.vodPic)
})

const onImageError=()=> {
    img.value = '/assets/default.png'
    }
const goVideoList = (item) => {
	router.push({ name: 'welfare', query: { item } });
}
const router = useRouter()
const toDetail = () => {
	if (props.isClick) { return }
	router.push({ path: `/video-detail/${props.item.vodId}` })
}

onMounted(() => {
	fetchImage(props.item.vodPic)
})
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
