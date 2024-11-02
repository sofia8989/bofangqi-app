<template>
	<div class="mineBox h-page overflow-y-auto scrollbar text-[#2F2F42]">
		<!-- <Topboot class="z-10"></Topboot> -->
		<div>
			<div class="flex items-scenter justify-between pt-[4px] title" v-if="deviceUser">
				<div class="flex" style="align-items: center;" @click="router.push({ name: 'information' })">
					<div class="avatar">
						<!-- 头像 -->
						<img class="w-[49px]" v-if="deviceUser?.avatar == ''"
							src="../../assets/images/information/touxiang.png" alt="">
						<img class="w-[49px] h-[49px]" style="border-radius: 49px;" v-else :src="avatar" alt="">
						<img v-if="deviceUser.userGroupId == 3"
							class="absolute bottom-[0px] right-[-2px] w-[20px] h-[20px]"
							src="@/assets/images/mine/vip_icon.png" alt="" srcset="">
					</div>
					<!-- 用户名+id -->
					<div class="flex flex-col nameBox">
						<div class="text-[16px] font-normal mb-[2px] name" style="white-space: nowrap;">
							<span>{{ deviceUser?.nickname }}</span>
							<img class="vip" src="../../assets/images/mine/vip.svg" />
							<img class="" src="../../assets/images/mine/bianji.svg" />

						</div>
						<div class="text-[10px] text-[#999] mb-[2px] id">
							<img src="../../assets/images/mine/id.svg" />
							<span>{{ deviceUser?.userId }}
							</span>
						</div>
						<!-- <div class="text-[#E26767] text-[10px] font-semibold">每日免费观影：长视频1次，短视频5次</div> -->
					</div>
				</div>
				<!-- 邀请码 -->
				<div class="flex items-center">
					<div class="invitationCode" @click="goCode">
						邀请码
					</div>
				</div>
			</div>
			<div class="flex items-scenter justify-between pt-[4px] title" v-else>
				<div class="flex" style="align-items: center;" @click="router.push({ name: 'login' })">
					<div class="avatar">
						<!-- 头像 -->
						<img class="w-[49px]" src="../../assets/images/information/touxiang.png" alt="">
					</div>
					<!-- 用户名+id -->
					<div class="flex flex-col nameBox">
						<div class="text-[16px] font-normal mb-[2px] name">
							<span>登录/注册</span>
							<img style="margin-top: 2px;" src="../../assets/images/mine/rightBtn.svg" />

						</div>
						<!-- <div class="text-[#E26767] text-[10px] font-semibold">每日免费观影：长视频1次，短视频5次</div> -->
					</div>
				</div>
			</div>

			<!-- vip观影开始 -->
			<div class="h-[32px] w-[100%] vipWatch">
				<img class="w-[20px] h-[20px]  top-0 left-[28px]" src="@/assets/images/detail/video-icon.svg" />
				<div class="h-full  flex items-center font-semibold  top-0 left-[65px] text-[14px] "
					style="margin-left: 10px;" v-if="deviceUser?.userGroupId == 1||deviceUser?.userGroupId == 2">
					VIP视频观影券<span style="color:#F83E3C;">{{ timesWatched }}</span>张,每日可以免费获得<span
						style="color:#F83E3C;">3</span>张</div>
				<div class="h-full  flex items-center font-semibold  top-0 left-[65px] text-[14px] "
					style="margin-left: 10px;" v-if="deviceUser?.userGroupId == 3">
					尊敬的VIP，您的会员到期时间为<span style="color:#F83E3C;">{{ deviceUser?.userGroupExpiryDate }}</span></div>

			</div>
			<!-- vip观影开始 -->

			<!-- 会员中心开始  -->
			<div class="flex justify-between items-center mt-[6px] p-[10px] bg-no-repeat bg-size 
				 bg-[url(@/assets/images/mine/vipBack.png)]" style="padding: 0px 25px;width: 100%; height: 55px;">
				<img class="w-[28px] h-[28px]" src="@/assets/images/mine/fx-vip.svg" alt="">
				<img class="w-[200px] h-[37px] share" @click="shareShow = true" src="@/assets/images/mine/invi.svg"
					alt="">

				<img class="w-[90px] h-[30px]" @click="router.push({ name: 'recharge' })"
					src="@/assets/images/mine/open-vip.svg" alt="">
			</div>
			<!-- 会员中心结束 -->

			<!-- 列表开始 -->
			<div class="listBox">
				<!-- 身份卡 -->
				<div class="list">
					<div class="label" @click="cardShow = true">
						<div class="left">
							<img src="@/assets/images/mine/idCard.svg" />
							<div class="name">身份卡</div>
						</div>

						<img src="@/assets/images/mine/right.svg" />
					</div>
					<div class="hr"></div>
				</div>
				<!-- 免费获取vip -->
				<div class="list">
					<div class="label" @click="shareShow = true">
						<div class="left">
							<img src="@/assets/images/mine/mfVip.svg" />
							<div class="name">免费获取VIP</div>
						</div>

						<img src="@/assets/images/mine/right.svg" />
					</div>
					<div class="hr"></div>
				</div>
				<!-- ai脱衣 -->
				<div class="list">
					<div class="label">
						<div class="left">
							<img src="@/assets/images/mine/aiTy.svg" />
							<div class="name">AI脱衣</div>
						</div>

						<img src="@/assets/images/mine/right.svg" />
					</div>
					<div class="hr"></div>
				</div>
				<!-- 我的收藏 -->
				<div class="list">
					<div class="label" @click="router.push({ name: 'history', params: { type: 1 } })">
						<div class="left">
							<img src="@/assets/images/mine/collect.svg" />
							<div class="name">我的收藏</div>
						</div>

						<img src="@/assets/images/mine/right.svg" />
					</div>
					<div class="hr"></div>
				</div>
				<!-- 观影记录 -->
				<div class="list">
					<div class="label" @click="router.push({ name: 'history', params: { type: 2 } })">
						<div class="left">
							<img src="@/assets/images/mine/history.svg" />
							<div class="name">观影记录</div>
						</div>

						<img src="@/assets/images/mine/right.svg" />
					</div>
					<div class="hr"></div>
				</div>
				<!-- 我的消息 -->
				<div class="list">
					<div class="label" @click="router.push({ name: 'myMessage', params: { type: 1 } })">
						<div class="left">
							<img src="@/assets/images/mine/message.svg" />
							<div class="name">我的消息</div>
						</div>

						<img src="@/assets/images/mine/right.svg" />
					</div>
					<div class="hr"></div>
				</div>
				<!-- 意见反馈 -->
				<div class="list">
					<div class="label" @click="router.push({ name: 'proposal' })">
						<div class="left">
							<img src="@/assets/images/mine/opinion.svg" />
							<div class="name">意见反馈</div>
						</div>

						<img src="@/assets/images/mine/right.svg" />
					</div>
					<div class="hr"></div>
				</div>
				<!-- 联系我们 -->
				<div class="list">
					<!-- @click="open(globalConfig?.WebsiteCustomerService)" -->
					<div class="label" @click="showContact = true">
						<div class="left">
							<img src="@/assets/images/mine/contact.svg" />
							<div class="name">联系我们</div>
						</div>

						<img src="@/assets/images/mine/right.svg" />
					</div>
					<div class="hr"></div>
				</div>
				<!-- 退出登录 -->
				<div class="list">
					<div class="label" @click="showLogin = true">
						<div class="left">
							<img src="@/assets/images/mine/signOut.svg" />
							<div class="name">退出登录</div>
						</div>

						<img src="@/assets/images/mine/right.svg" />
					</div>
					<div class="hr"></div>
				</div>

			</div>

			<!-- <div class="text-center h-[43px] mb-[6px] text-[15px] border-liner flex justify-center items-center rounded-[100px]"
				@click="showLogin(2)">
				<div class="bg-id w-[calc(100%-1px)] h-[41px] flex justify-center items-center rounded-[100px]">
					<van-icon name="exchange" color="#fff" />
					<span class=" text-white text-[15px]">切换账号</span>
				</div>
			</div> -->

		</div>


		<idPop v-model="cardShow" />
		<!-- <login v-model="loginShow" :type="loginType"></login> -->
		<sharePop v-model="shareShow" />
		<!-- 邀请码 -->
		<van-dialog v-model:show="codeShow" style="border-radius: 26px;width: 300px;">
			<template #footer>
				<div class="bg-[#fff] br-[20px] popBox">
					<img src="../../assets/images/mine/back.svg" class="w-full h-full" />
					<img src="../../assets/images/mine/close.svg" class="close" @click="codeShow = false" />
					<div class="text-center text-black popTitle">
						请输入分享者提供的邀请码
					</div>
					<div class="inputBox">
						<div class="box">
							<input v-model="inviteCodeVal" maxlength="6" type="number" />
							<div class="btn" @click="getZt()">粘贴</div>
						</div>
					</div>

					<div class="flex justify-around  items-center btnBox ">
						<div class="btn" @click="getInviteBtn">领取奖励</div>
					</div>

				</div>

			</template>
		</van-dialog>
		<!-- 登录弹窗 -->
		<loginPop v-model="showLogin" @updateData="handleData"></loginPop>
		<!-- 联系我们弹窗 -->
		<contact v-model="showContact"></contact>

	</div>
</template>
<script setup name="mine">
import { ref, computed, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { config } from '@/store/config'
import { $get, getImgUrl, openLink } from '@/utils';
import idPop from '@/views/mine/components/idPop.vue'
import login from '@/views/mine/components/login.vue'
import sharePop from '@/views/mine/components/sharePop.vue'
import loginPop from "@/views/mine/components/loginPop.vue";
import contact from "@/views/mine/components/contact.vue";
import { inviteCode } from '@/service/baseApi'
import { showToast } from 'vant'
import { getUserInfo } from '@/service/loginApi'
const configStore = config()
const router = useRouter()
import { fetchImage } from '@/utils/imageUtils'; // 导入封装的函数
const avatar = ref('')

/**
 * @description 全局配置
 */
const globalConfig = computed(() => $get(configStore, 'configData.config', {}))
/**
 * @description 用户信息
 */
const deviceUser = computed(() => $get(configStore, 'deviceUser', {}))
/**
 * @description 我的广告
 */
const xlMyInfoApp = computed(() => $get(configStore, 'templateData.xlMyInfoApp.adList', []))
const getZt = async () => {
	try {
		inviteCodeVal.value = await navigator.clipboard.readText();
	} catch (err) {
		console.error('Failed to read clipboard contents:', err);
	}
};
fetchImage(deviceUser.value.avatar).then((val) => {

	avatar.value = val
});

const informationList = reactive({
	AiFaceImg: '',
	AiFaceVideo: '',
	AiPicture: '',
	balance: '',
	identityCard: '',
	nickname: '',
	phoneState: '',
	userGroupExpiryDate: '',
	userGroupId: '',
	userId: '',
	avatar: '',
	userName: '',
	profile: '',
})
const getInformation = async () => {
	const listData = await getUserInfo({})
	if (listData.code == 200) {
		informationList.profile = listData.result.profile
		informationList.userName = listData.result.userName
		informationList.avatar = listData.result.avatar
		informationList.AiFaceImg = listData.result.AiFaceImg
		informationList.AiFaceVideo = listData.result.AiFaceVideo
		informationList.AiPicture = listData.result.AiPicture
		informationList.balance = listData.result.balance
		informationList.identityCard = listData.result.identityCard
		informationList.nickname = listData.result.nickname
		informationList.phoneState = listData.result.phoneState
		informationList.userGroupExpiryDate = listData.result.userGroupExpiryDatev
		informationList.userGroupId = listData.result.userGroupId
		informationList.userId = listData.result.userId
		// chooseIndex.value = listData.result.gender
		// sex.value= listData.result.gender
	}
}
// 登录弹窗
const showLogin = ref(false)
// 联系弹窗
const showContact = ref(false)
const cardShow = ref(false)
const codeShow = ref(false)
const goCode = () => {
	codeShow.value = true
}
const inviteCodeVal = ref('')
const getInviteBtn = async () => {
	if (inviteCodeVal.value == '') {
		showToast({
			message: "邀请码不能为空"
		})
		return
	}
	const listData = await inviteCode({
		inviteCode: inviteCodeVal.value
	})
	if (listData.code == 200) {
		showToast({
			message: "验证成功"
		})
		codeShow.value = false
	} else {
		showToast({
			message: listData.msg
		})
	}
}
const handleData = (value) => {
	if (value == 1) {
		showLogin.value = false
	}
}

const loginShow = ref(true)
const loginType = ref(1)
const getShortCount = () => {
	let count = 5
	let shortVideoCount = +window.localStorage.getItem('shortVideoCount')
	if (shortVideoCount) {
		count -= shortVideoCount
	}
	if (count < 0) {
		count = 0
	}
	return count
}
const timesWatched = ref(0)
const setCount = () => {
	console.log('走这里了吗')
	let _videoIdList = JSON.parse(window.localStorage.getItem('_videoIdList')) || []
	timesWatched.value = 3 - _videoIdList.length
}
// const goshare = () => {
// 	router.push({ path: '/share' })
// }
const open = (url) => {
	openLink(url)
}
// const showLogin = (type) => {
// 	loginShow.value = true
// 	loginType.value = type
// }
onMounted(async () => {
	getInformation()
	setCount()
})

const shareShow = ref(false)
</script>
<style lang="less" scoped>
// .tips-text {
// 	&::before {
// 		content: '';
// 		position: absolute;
// 		width: 0;
// 		height: 0;
// 		border-left: 11px solid transparent;
// 		border-right: 11px solid transparent;
// 		border-bottom: 13px solid #494949;
// 		right: 18px;
// 		top: -12px;
// 	}
// }

.border-liner {
	background: linear-gradient(90deg, #2D57CC 0%, #AC63FF 100%);
}

.bg-id {
	background: linear-gradient(90deg, #2D57CC 0%, #AC63FF 100%);
}

.bg-size {
	background-size: 100% 100%;
}

.title {
	background: linear-gradient(270deg, #E6E0EB 0%, #D0CBEF 100%);
	width: 100%;
	height: 128px;
	padding: 40px 12px 12px 12px;


	.avatar {
		margin-right: 10px;

		img {
			width: 60px;
			height: 60px;
			border: 30px;
		}


	}

	.nameBox {
		.name {
			font-family: PingFang SC;
			font-size: 16px;
			font-weight: 600;
			line-height: 22.4px;
			text-align: left;
			display: flex;

			.vip {
				margin: 0 5px;
			}

			span {
				max-width: 120px;
				height: 20px;
				overflow: hidden;
			}
		}

		.id {
			display: flex;
			align-items: center;
			line-height: 20px;
			margin-top: 2px;

			img {
				width: 12px;
				height: 12px;
				border-radius: 2px;

			}

			span {
				font-family: PingFang SC;
				font-size: 12px;
				font-weight: 600;
				line-height: 16.8px;
				text-align: left;

			}
		}
	}


	.invitationCode {
		width: 66px;
		height: 32px;
		padding: 6px 12px 6px 12px;
		border-radius: 38px;
		background-color: #F83E3C;
		font-family: PingFang SC;
		font-size: 14px;
		font-weight: 600;
		line-height: 19.6px;
		text-align: left;
		color: #fff;
	}


}

.share {
	width: 200px;
}

.vipWatch {
	background: #FDF0DB;
	display: flex;
	align-items: center;
	justify-content: center;

}

.listBox {
	padding: 0 20px;
	margin-bottom: 40px;

	.list {

		// height: 55px;
		.label {
			height: 55px;
			display: flex;
			align-items: center;
			justify-content: space-between;

			.left {
				display: flex;

				img {
					width: 16px;
					height: 16px;
					margin-right: 12px;
				}

				.name {
					font-family: PingFang SC;
					font-size: 13px;
					font-weight: 400;
					line-height: 18.2px;
					text-align: left;

				}
			}

			img {
				width: 12px;
				height: 12px;
			}

		}

		.hr {
			width: 323px;
			height: 1px;
			background: #F0F0F0;

		}

	}
}

.popBox {
	.close {
		position: absolute;
		top: 5px;
		right: 5px;
	}

	.popTitle {
		width: 100%;
		position: absolute;
		top: 30px;
		color: #000000;

		input {
			width: 188px;
			height: 36px;
			border-radius: 18px;
			border: 1px;
		}


	}

	.inputBox {
		width: 100%;
		display: flex;
		justify-content: center;
		height: 60px;
		align-items: center;

		.box {
			display: flex;
			width: 188px;
			position: relative;

			input {

				height: 36px;
				border-radius: 18px;
				border: 1px solid #F0F0F0;
				padding-left: 10px;

			}

			.btn {
				width: 70px;
				height: 36px;
				border-radius: 18px;
				background: #775DF9;
				font-family: PingFang SC;
				font-size: 14px;
				font-weight: 600;
				line-height: 36px;
				text-align: center;
				color: #fff;
				position: absolute;
				right: 0;


			}
		}

	}



	.btnBox {
		width: 100%;
		display: flex;
		align-items: center;
		padding: 20px 0 10px 0;

		.btn {
			width: 188px;
			height: 40px;
			line-height: 40px;
			border-radius: 20px;
			background: var(--main-1, #F83E3C);
			color: #FFFFFF;
			text-align: center;

		}


	}

}
</style>
