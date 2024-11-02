<template>
	<div class="share_box overflow-x-hidden h-full mb-[12px] scrollbar bg-black text-white">
		<NavHeader textcolor="#fff" bg="#000" title="邀请分享"></NavHeader>
		<div class="w-full h-full bg-[#141213]">
			<div class="w-[375px] h-[516px] relative top-[-46px]">
				<img class="w-full h-full" src="@/assets/images/share/invite-bg1.png" alt="" srcset="" />
			</div>
			<div class="relative top-[-186px] px-[10px] w-full">
				<img class="w-full h-auto z-10" src="@/assets/images/share/invite-q-code.png" alt="" />
				<div class=" w-full absolute top-[53px] flex flex-col items-center justify-center">
					<span class="text-[#E0BC91] text-[18px] pb-[30px]">每邀请1人，送2天VIP，无限领取</span>
					<div ref="poster" class="p-[4px] bg-white">
						<qrcode-vue :value="url" :size="138" level="H" />
					</div>
				</div>
				<div class="w-full absolute flex justify-between bottom-[26px] pl-[20px] pr-[40px]">
					<van-button @click="copyString(url)" class="w-[145px] !h-[44px] !rounded-[100px] !text-[#6A330B]"
						color="linear-gradient(90deg, #FAE6CB 4.68%, #F1C797 98.16%)">复制推广链接</van-button>
					<van-button @click="htmlTocanvas(poster)" class="w-[145px] !h-[44px] !rounded-[100px] !text-[#6A330B]"
						color="linear-gradient(90deg, #FAE6CB 4.68%, #F1C797 98.16%)">保存二维码</van-button>
				</div>
			</div>
			<div class="relative top-[-186px] px-[10px]">
				<img class="w-full" src="@/assets/images/share/invite-count.png" alt="" srcset="">
				<div class="absolute top-[45px] right-[66px] font-normal text-[18px] text-[#6A330B]">
					累计推广成功人数：<span class=" font-medium text-[#430000]">{{ state.total }}</span>人
				</div>
			</div>
			<div class="relative top-[-170px] px-[10px]">
				<img class="w-full" src="@/assets/images/share/invite-rule.png" alt="" srcset="">
			</div>
		</div>
		<div v-show="show" @click="show =false" class="z-[100] max-w-[500px] my-0 mx-auto  bottom-0 right-0 fixed top-0 left-0 bg-black/80 flex flex-col justify-center items-center ">
			<div class="w-full h-auto relative px-[25px] mb-[33px]">
				<img src="@/assets/images/share/share-bg.text?raw" alt="" srcset="">
				<div
					class="absolute bottom-[85px] p-[4px] right-[45px] border-solid border-[2.5px] border-[#fff] rounded-[10px] w-[110px] h-[112px]">
					<div class="bg-white p-[2px]">
						<qrcode-vue :value="url" :size="93" level="H" />
					</div>	
				</div>
			</div>
			<div class="w-full px-[11px]">
				<div
					class="pl-[15px] text-[20px] pr-[16px] w-full h-[48px] rounded-[100px] btn-bg flex items-center justify-between">
					<span class=" overflow-hidden whitespace-nowrap text-ellipsis">
						官网地址：{{ url }}
					</span>
					<van-button class="!w-[96px] min-w-[96px] !h-[28px] !text-[14px] !rounded-[100px] !text-black" color="#fff"
						@click.stop="copyString(url)">复制链接</van-button>
				</div>
			</div>
		</div>
	</div>
</template>
<script setup name="share">
import { config } from '@/store/config'
import { ref, onMounted } from 'vue'
import { $get, copyString } from "@/utils";
import { getMyInvitationList } from '@/service/shareApi'
import QrcodeVue from 'qrcode.vue'
import { htmlTocanvas } from "@/utils/html2canvas";

const configStore = config()
const url = `${$get(configStore, 'appConfig.DownloadPageUrl', "")}&inviteCode=${$get(configStore, 'deviceUser.userId', "")}`
const state = ref({
	pageNum: 1,
	total: 0,
})
const show =ref(true)
const poster = ref()
const init = async () => {
	const listData = await getMyInvitationList({
		page: 1,
		pageSize: 1
	})
	state.value.total = listData.result.total
}

onMounted(() => {
	init()
})
</script>
<style scoped lang="less">
.btn-bg {
	background: linear-gradient(180deg, #F8806F 0%, #F34745 100%);
}
</style>
