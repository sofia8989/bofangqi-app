<template>
	<div class="sticky top-0 bg-white">
		<div v-if="!inStandaloneMode" class="w-full h-[51px]  px-[10px] flex items-center ">
			<!-- <div class="flex w-[20px] h-[20px] flex-auto flex-shrink-0 flex-grow-0 bg-black/70 rounded-[50%]"><van-icon
					class="m-auto" @click.stop="show = true" name="cross" color="#fff" size="14px" /></div> -->
			<div class="flex-1 pl-[8px]" @click.stop="topDownloadClick">
				<img class="h-[36px]" src="@/assets/images/logo.png" alt="">
			</div>
			
			<van-button
				class="flex-auto flex-shrink-0 flex-grow-0 w-[84px] !h-[31px] !text-[12px] !rounded-[18px]" style="background: #00D5BC;color: #fff;" 
				 @click.stop="topDownloadClick">立即安装</van-button>
		</div>
		<van-dialog teleport="body" v-model:show="show" :showConfirmButton="false">
			<div class="pt-[36px] pb-[16px] w-[]">
				<div class=" text-center pb-[16px] text-[#212121]">
					<p>将应用安装到手机桌面，</p>
					<p>安装限时送VIP会员,</p>
					<p>经过360安全检测,请放心使用。</p>
				</div>
				<div class="flex justify-between px-[48px]">
					<van-button class="w-[84px] !h-[31px] !text-[12px] !rounded-[18px] !text-white" color="#adadad"
						@click.stop="show = false">再看看</van-button>
					<van-button class=" w-[84px] !h-[31px] !text-[12px] !rounded-[18px] !text-white" color="linear-gradient(180deg, #FFE9AB 0%, #F4D338 100%)"
						@click.stop="topDownloadClick">立即安装</van-button>
				</div>
			</div>
		</van-dialog>
	</div>

</template>
<script setup name="Topboot">
import { inStandaloneMode, deviceType } from '@/utils/common.js'
import { ref, computed } from 'vue';
import { config } from '@/store/config'
import { $get,getHashPageName,downloadApp,openLink } from '@/utils'
import { downClick } from '@/service/home';
const configStore = config()
const op = ref()
const channelKey = window.localStorage.getItem("_pageName") ? window.localStorage.getItem("_pageName") : getHashPageName().pageName =='index.html' ? "f001" :  getHashPageName().pageName
/**
 * @description 导航九宫格
 */
const topDownload = computed(() => $get(configStore, 'templateData.topDownload.adList.0', {}))
const show = ref(false)
const isIos = computed(() => deviceType() == 'IOS')
const isAndroid = computed(() => deviceType() == 'Android')
const topDownloadClick = () => {
	if (topDownload.value.adId) {
		downClick({ channelKey }).then(res => {

		})
	}
	// if (isIos.value) {
	// 	loadApp()
	// } else {
	// 	download()
	// }
	openLink(`${location.origin}/landpage?channelCode=${channelKey}`)
}

// const download = async () => {
// 	op.value?.wakeupOrInstall?.()
// }
// onMounted(() => {
// 	if (!isIos.value) {
// 		const s = document.createElement('script')
// 		s.type = 'text/javascript'
// 		s.src = '//web.cdn.openinstall.io/openinstall.js'
// 		s.addEventListener(
// 			'load',
// 			async () => {
// 				var data = OpenInstall?.parseUrlParams?.() //解析获取参数
// 				new OpenInstall(
// 					{
// 						appKey: "deyp1g",
// 						channelCode:channelKey,
// 						preferWakeup: true,
// 						onready: function () {
// 							op.value = this
// 						},
// 					},
// 					{ ...data, channelCode:channelKey }
// 				)
// 			},
// 			false
// 		)
// 		document.head.appendChild(s)
// 	}
// })
</script>
<style  scoped>
.bg-jb{
	background: linear-gradient(90deg, #2D57CC 0%, #AC63FF 100%);
}
</style>