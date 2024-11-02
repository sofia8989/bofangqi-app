<!-- 绑定手机号 -->
<template>
    <van-popup position="right" teleport="body" class="h-full w-full !overflow-hidden !bg-white"
        v-model:show="showBottom">
        <NavHeader :title="titles.title" :callBack="close"></NavHeader>
        <div class="text-[#2F2F42]  pl-[7px] pr-[15px]">
            <div class="text-[18px] font-medium pt-[12px] pb-[20px]">{{ titles.subtitle }}</div>
            <div>
                <div>
                    <van-field class="text-15px !pl-[12px] rounded-[8px] text-mainText items-center h-[48px] !bg-[#F2F3F5]"
                        clearable type="number" :border="false" :maxlength="11" autocomplete="off"
                        v-model="loginInfo.phoneNumber" clear-trigger="always" placeholder="请输入手机号"
                        :formatter="formatterNum" @keyup.enter="!loginInfo.phoneNumber && getmessage()">
                        <template #left-icon>
                            <div class="flex items-center text-[18px] mr-[6px] text-[#2F2F42] border-r pr-[6px]">
                                +86
                            </div>
                        </template>
                    </van-field>
                </div>
                <div class="my-[16px]">
                    <van-field class="text-15px !py-[8px]  rounded-[8px] items-center  h-[48px] !bg-[#F2F3F5]"
                        clearable :border="false" :maxlength="6" type="number" autocomplete="off" v-model="loginInfo.code"
                        clear-trigger="always" placeholder="请输入验证码" :formatter="formatterNum"
                        @keyup.enter="!loading && submit()">
                        <template #button>
                            <van-button size="small" :disabled="!loginInfo.phoneNumber" :loading="loading" @click="getmessage"
                                class="!text-[#AC63FF] text[14px] font-normal !border-none !bg-[#F2F3F5]">发送验证码</van-button>
                        </template>
                    </van-field>
                </div>
                <div class="my-[16px] flex justify-center items-center" v-if="type == 2">
                    <div class="bg-[#AC63FF] flex justify-center items-center px-[18px] py-[10px] rounded-[8px]"
                        @click="parse">
                        <svg-icon name="q-code" color="#fff" class="w-[16px] h-[16px] mr-[9px]"></svg-icon>
                        <span class="text-[#fff]">身份卡登录1</span>
                    </div>

                </div>
                <div>
                    <van-button color="linear-gradient(90deg, #2D57CC 0%, #AC63FF 100%)"
                        :disabled="!loginInfo.code || !loginInfo.phoneNumber" block @click="submit">{{ titles.btntext
                        }}</van-button>
                </div>
            </div>
        </div>
        <input type="file" style="display: none;" accept="image/png,image/jpeg" name="qr_code" id="qr_code" ref="qr_code"
            @change="fileChange" />
    </van-popup>
</template>
<script setup name="login">
import { computed, ref, watch } from "vue";
import { getMessageCode, messageLogin, bindCellPhone, identityCardLogin } from "@/service/loginApi"
import { config } from '@/store/config'
import { getQrUrl } from '@/utils/parse_code'
const configStore = config()
import { showToast } from "vant";
const props = defineProps({
    modelValue: Boolean,
    type: {
        type: Number,
        default: 1
    }
});
const emits = defineEmits(['update:modelValue', 'next']);
const titles = computed(() => {
    let titles = {
        title: "绑定手机号",
        subtitle: "绑定手机号",
        btntext: "立即绑定"
    }
    if (props.type == 2) {
        titles = {
            title: "切换账号",
            subtitle: "验证码登录",
            btntext: "立即切换"
        }
    }
    return titles
})
const showBottom = computed({
    get() {
        return props.modelValue;
    },
    set() {
        close();
    },
});
const close = () => {
    emits("update:modelValue", false)
}
const loginInfo = ref({
    phoneNumber: "",
    messageId: "",
    code: ""
})
const loading = ref(false)
const formatterNum = (value) => value.replace(/[^0-9]/, "");
const getmessage = async () => {
    loading.value = true
    let res = await getMessageCode({ phoneNumber: loginInfo.value.phoneNumber })
    if (res.code == 200) {
        loginInfo.value.messageId = res.result.messageId
        showToast({
            type: "success",
            message: "获取短信成功"
        })
    } else {
        showToast({
            type: "fail",
            message: "获取短信失败"
        })
        loading.value = false
    }
}
const submit = async () => {
    let api = props.type == 1 ? bindCellPhone : messageLogin
    let res = await api(loginInfo.value)
    if (res.code == 200) {
        showToast({
            type: "success",
            message: "绑定成功"
        })
        if (props.type == 2) {
            configStore.updatedUserInfo(res.result)
        }
        close()
    } else {
        showToast({
            type: "fail",
            message: "绑定失败"
        })
    }
    loading.value = false
}
const qr_code = ref()
const parse = () => {
    qr_code.value.click()
}
const fileChange = async (e) => {
    let res = await getQrUrl(e.target.files[0])
    if (res) {
        idCardLogin(res.data)
    } else {
        showToast({
            type: "fail",
            message: "身份卡识别失败"
        })
    }
}
const idCardLogin = async (identityCard) => {
    let res = await identityCardLogin({ identityCard })
    if (res.code == 200) {
        configStore.updatedUserInfo(res.result)
        showToast({
            type: "success",
            message: "身份卡登录成功"
        })
        close()
    } else {
        showToast({
            type: "fail",
            message: "身份卡登录失败"
        })
    }

}
</script>
<style lang="less" scoped>
.border-r {
    border-right: 2px solid #616161
}

:deep(.van-field) {
    .van-field__control {
        color: #2F2F42 !important;
    }
}
</style>