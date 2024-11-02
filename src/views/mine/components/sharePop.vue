<!-- 免费获取vip -->
<template>
	<div v-show="show" @click="show = false"
		class="z-[100] max-w-[500px] text-white my-0 mx-auto px-[45px]  bottom-0 right-0 fixed top-0 left-0 bg-black/80 flex flex-col justify-center items-center ">
		<div class="z-[101] absolute  right-[45px] top-[7vh]">
			<!-- <img @click.stop="show = false" src="@/assets/images/share/share-colse.png" class="w-[24px]" alt="" srcset=""> -->
		</div>
		<div ref="refShare" class="w-full h-auto relative  mb-[20px]">
			<img src="@/assets/images/share/share-bg.png" alt="" srcset="">
			<div
				class="absolute top-[160px] pt-[8px] left-[51%] translate-x-[-48%] border-solid rounded-[10px] w-[110px] h-[112px]">
				<div class="bg-white p-[2px]" style="display: flex;justify-content: center;">
					<qrcode-vue :value="url" :size="100" level="H" />
				</div>
				<div class="text"> 我的邀请码</div>
				<div class="code"> {{deviceUser?.userId}}</div>
				
			</div>
		</div>
		<div class="w-full px-[11px] flex justify-between">
			<van-button class="min-w-[96px] !h-[48px] !text-[14px] !rounded-[100px] !text-white"
				color="linear-gradient(90deg, #2D57CC 0%, #AC63FF 100%)" style="background: #F83E3C;"
				@click.stop="copyString(url)">复制分享链接</van-button>
			<van-button class="min-w-[96px] !h-[48px] !text-[14px] !rounded-[100px] !text-white"
				color="linear-gradient(180deg, #FEAC3B 0%, #F37423 100%)"  style="background: #F83E3C;"
				@click.stop="downloadqCode">保存二维码分享</van-button>
		</div>
	</div>
</template>
<script setup name="sharePop">
import { config } from '@/store/config'
import { ref, onMounted, computed } from 'vue'
import { $get, copyString } from "@/utils";
import { htmlTocanvas } from "@/utils/html2canvas";
import QrcodeVue from 'qrcode.vue'
const props = defineProps({
	modelValue: Boolean,
});
const emits = defineEmits(['update:modelValue']);
const show = computed({
	set(val) {
		emits("update:modelValue", val)
	},
	get() {
		return props.modelValue
	}
})
const configStore = config()
const deviceUser = computed(() => $get(configStore, 'deviceUser', {}))
// const url = `${$get(configStore, 'appConfig.DownloadPageUrl', "")}&inviteCode=${$get(configStore, 'deviceUser.userId', "")}`
const url =  `${window.location.href}?pageName=f001&inviteCode=${$get(configStore, 'deviceUser.userId', "")}`
const refShare = ref()
const downloadqCode = () => {
	htmlTocanvas(refShare.value, '#393939', `share`)
	window.localStorage.setItem("loadqCode", 1)
}
onMounted(() => {
})
</script>
<style scoped lang="less">
.btn-bg {
	background: linear-gradient(180deg, #FFCE53 0%, #F58319 100%);
}

.text {
	font-family: PingFang SC;
	font-size: 12px;
	font-weight: 400;
	line-height: 30px;
	text-align: left;
	color: #000;
	text-align: center;
	margin-top: 10px;
}
.code{
	// margin-top: 10px;
	line-height: 30px;
	font-family: PingFang SC;
    font-size: 0.53333rem;
    font-weight: 600;
    text-align: left;
    text-decoration: underline;
	color: #F83E3C;
	text-align: center;
}

</style>
