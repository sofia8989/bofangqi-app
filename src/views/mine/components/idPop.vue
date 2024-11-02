<!-- 免费获取vip -->
<template>
    <div v-show="show" @click.stop="show = false"
        class="z-[100] max-w-[500px] text-white my-0 mx-auto px-[45px]  bottom-0 right-0 fixed top-0 left-0 bg-black/80 flex flex-col justify-center items-center ">

        <div ref="reference" @click.stop="show = true" class="w-full h-auto relative mb-[20px]">

            <img src="@/assets/images/login/idCard.png" alt="" srcset="">
            <!--  -->
            <div class="absolute w-full h-auto  top-[150px] p-[8px] left-[50%] translate-x-[-20.5%] border-solid rounded-[10px] w-[130px] h-[130px] display: flex;
            flex-direction: column;align-items: center;justify-content: center;">
                <qrcode-vue :value="informationList.identityCard" :size="110" level="H" />
            </div>

            <div class="absolute top-[270px] left-[49%] translate-x-[-48%]"
                style="display: flex;align-items: center; line-height: 70px;justify-content: center;">
                <img style="margin-right: 5px;" src="../../../assets/images/mine/id.svg" />
                <span color="#fff">{{ deviceUser?.userId }}</span>
            </div>
            <div class="absolute top-[335px] left-[49%] translate-x-[-48%]"
                style="display: flex;align-items: center; line-height: 70px;justify-content: center;color: #000;">
                <div class="flex" style="flex-direction: row;">
                    <div class="mr-[5px]" style="font-family: PingFang SC;font-size: 14px;font-weight: 400;line-height: 19.6px;color: #333;width: 60px;
">永久地址</div>
                    <div style="font-family: PingFang SC;font-size: 14px;font-weight: 600;line-height: 19.6px;color: #F83F3D;display: inline-block;width: 160px;
"> {{ baseURL }}</div>
                </div>

            </div>


        </div>
        <div class="btn" @click="downloadqCode">点击保存</div>
    </div>
</template>

<script setup name="idPop">
import { watch, ref, computed, onMounted, nextTick, reactive } from 'vue';
import QrcodeVue from 'qrcode.vue'
import { config } from '@/store/config'
import { $get } from '@/utils';
import { htmlTocanvas } from "@/utils/html2canvas";
import { getUserInfo } from '@/service/loginApi';
import http from '@/utils/axios'
const baseURL = window.location.hostname; // 获取 baseURL
const props = defineProps({
    modelValue: {
        type: Boolean,
        default: false
    },
    load: {
        type: Boolean,
        default: false
    },
    confirm: {
        type: Function,
    }
})
const configStore = config()
/**
 * @description 用户信息
 */
const deviceUser = computed(() => $get(configStore, 'deviceUser', {}))
const configData = computed(() => $get(configStore, 'configData', {}))
/**
 * @description 身份卡
 * 
 */


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
        informationList.gender = listData.result.gender
        // chooseIndex.value = listData.result.gender
        // sex.value= listData.result.gender
    }
}
const reference = ref()
const downloadqCode = () => {
    htmlTocanvas(reference.value, '#fff', `id-${deviceUser?.value.userId}`)
    window.localStorage.setItem("loadqCode", 1)
}
const emits = defineEmits(['update:modelValue', 'confirm'])
const show = computed({
    set(val) {
        emits("update:modelValue", val)
    },
    get() {
        return props.modelValue
    }
})
defineExpose({ downloadqCode })
watch(() => show.value, (val) => {
    if (val && props.load) {
        nextTick(() => {
            setTimeout(() => {
                downloadqCode()
                show.value = false
                if (props.confirm) {
                    props.confirm()
                }
            }, 1000)
        })
    }
})
onMounted(async () => {
    getInformation()
})
</script>
<style scoped lang="less">
.border-s {
    border: 2px solid #4d473b;
}

.btn {
    width: 260px;
    height: 40px;
    border-radius: 38px;
    background: #F83E3C;
    font-family: PingFang SC;
    font-size: 14px;
    font-weight: 600;
    line-height: 40px;
    text-align: center;

}
</style>