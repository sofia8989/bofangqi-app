<template>
	<van-dialog v-model:show="showMainDialog" class="main-dialog" teleport="body" :show-confirm-button="false">
		<div class="px-[30px] flex flex-col justify-center items-center"  v-if="getImgUrl(adList[dialogIndex])">
			<img class="w-[210px] h-[315px] rounded-[10px]" @click="$clickAd(adList[dialogIndex])"
			v-olazyload="getImgUrl(adList[dialogIndex])" alt="">
			<van-icon class="main-dialog-close mt-[20px]" name="close" color="#fff" size="40" @click="closeMainDialog" />
		</div>
	</van-dialog>
</template>

<script setup name="MatchaDialog">
import { watch, ref, computed, nextTick } from 'vue';
import { config } from '@/store/config';
import { global } from '@/store/global';
import { useRoute } from 'vue-router'
import { $clickAd, getImgUrl, $get } from "@/utils"
import Popups from '@/assets/images/detail/Pop-ups.png'
const route = useRoute()
const globalStore = global()
const configStore = config()
// const isVip = computed(() => $get(configStore, "deviceUser.userGroupId", 1) === 3)
const showPop = ref(false)
const adList = ref([])
const showMainDialog = ref(false)
const dialogIndex = ref(0)
const closeMainDialog = () => {
	showMainDialog.value = false
	if (dialogIndex.value + 1 >= adList.value.length) {
		adList.value = []
		dialogIndex.value = 0
		if (showPop.value) {
			// globalStore.setShowPopUps(true)
		}
	} else {
		setTimeout(() => {
			dialogIndex.value++
			showMainDialog.value = true
		}, 500)
	}
}
const addDialog = (list = []) => {
	if (list.length > 0) {
		adList.value = list
		setTimeout(() => {
			showMainDialog.value = true
		}, 0)
	}else{
		// globalStore.setShowPopUps(true)
	}
}
/**
 * 
 * @description 详情返回
 * 
 */
watch(() => route.name, (val, old) => {
	if (!['share', 'recharge'].includes(val) && old == "video-detail" /** && !isVip.value */) {
		addDialog($get(configStore, 'templateData.xlAVDetailReturn.adList', []))
		showPop.value = false
	}
})
/**
 *
 * @description 首页弹窗
 * 
 */
watch(() => globalStore.showMainDialog, (val) => {
	if (val && ['home','nav'].includes(route.name)) {
		addDialog($get(configStore, 'templateData.xlHomeDialog.adList', []))
		globalStore.showMainDialog = false
		showPop.value = true
	}
})
</script>

<style lang="less">
.van-dialog.main-dialog {
	width: 100%;
	margin: 0;
	max-width: none;
	border-radius: 0;
	overflow: inherit;
	--van-dialog-background: transparent;
}
</style>