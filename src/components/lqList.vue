<!-- 猎奇列表页面组件 -->
<template>
	<!-- 列表 -->
	<!-- 首页用的视频 -->
	<div :class="['relative', { 'col-span-2': item.type == 2 }]" @click="toDetail">
		<div>
			<img class="rounded-[10px]  w-full" style="height:158px;object-fit: cover;" :src="imgVal"  @error="onImageError()"  @click="goShort(item)" />
			<img class="w-[90px] h-[41px]" style="position: absolute;bottom: 0px;" v-if="item.num==0" src="../assets/images/red.png" />
			<img class="w-[90px] h-[41px]" style="position: absolute;bottom: 0px;" v-if="item.num==1" src="../assets/images/blue.png" />
			<img class="w-[90px] h-[41px]" style="position: absolute;bottom: 0px;" v-if="item.num==2" src="../assets/images/pouple.png" />
			<img class="w-[90px] h-[41px]" style="position: absolute;bottom: 0px;" v-if="item.num==3" src="../assets/images/pink.png" />
			<img class="w-[90px] h-[41px]" style="position: absolute;bottom: 0px;" v-if="item.num==4" src="../assets/images/orange.png" />
			<img class="w-[90px] h-[41px]" style="position: absolute;bottom: 0px;" v-if="item.num==5" src="../assets/images/blueS.png" />
			<div class="title">{{ item.name }}</div>
		</div>
	</div>
</template>
<script setup>
import { getVideoCover } from '@/utils';
import { useRouter } from 'vue-router'
import { fetchImage } from '@/utils/imageUtils'; // 导入封装的函数
import { ref } from 'vue'
const props = defineProps({
	// 资源详情
	item: {
		type: Object,
		default: {
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
const imgVal = ref('')
fetchImage(props.item.img_src).then((img) => {
	imgVal.value = img
});

const goShort = (item) => {
	router.push({ path: 'lieqiShort', query: { ...item } })
}
const router = useRouter()
const toDetail = () => {
}
const onImageError=(i)=> {
	imgVal.value = '/assets/default.png'
    }
</script>
<style scoped>
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

.title {
	font-family: zihunbiantaoti;
	font-size: 18px;
	font-weight: 800;
	text-align: center;
	position: absolute;
	bottom: 0px;
	font-style: oblique;
	color: #fff;

	/* box-shadow: 2px #00000080; */
	width: 75px;
	height: 40px;
	line-height: 40px;
	padding-top: 5px;
}
</style>
