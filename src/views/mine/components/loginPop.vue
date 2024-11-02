<!-- 登录弹窗 -->
<template>
    <van-popup v-model:show="showBottom" class="!bg-white scrollbar !overflow-y-hidden text-[#2F2F42]" position="bottom"
        round :style="{ height: '25%' }" teleport="body" close-on-click-overlay>
        <!-- <div class="sticky top-0 left-0 right-0  py-[16px] px-[23px] flex justify-between title">
            <div></div>
            <van-icon class="" name="close" color="#2F2F42" size="20" @click="showBottom = false" />
        </div> -->
        <div class="w-full h-[600px] overflow-y-auto scrollbar px-[23px] chooseList">
            <van-uploader v-model="fileList" multiple :max-size="2 * 1024" :max-count="1" deletable
                    :before-read="beforeRead" >
                    <div class="lable boder" style="width: 95vw;">
               
               扫描身份卡登录
           </div>
                </van-uploader>
           
            <div class="lable  boder" @click="goLogin()">
                账号密码等
            </div>
            <div class="lable " style="color: #F83E3C;" @click="showBottom = false">
                取消
            </div>


        </div>

    </van-popup>
</template>
<script setup>
import { computed, onMounted,ref,reactive } from "vue";
import { useRouter } from 'vue-router'
import {cardLogin  } from '@/service/baseApi'
import { showToast } from 'vant'
import { config } from '@/store/config'
import { getUserInfo } from '@/service/loginApi'
import { defineEmits } from 'vue'
// const emit = defineEmits(['updateData'])
const configStore = config()
const router = useRouter()

const props = defineProps({
    cur_vip: {
        type: Object,
        default: () => ({})
    },
    modelValue: {
        type: Boolean,
        default: false
    },
})
import jsQR from 'jsqr'; // 使用 import 语法导入

const fileList = ref([]);
const imgList = ref('');
const sex = ref('');
const codeContent=ref('')

// 添加图片
const beforeRead = (file, type) => {
    const reader = new FileReader();

    // 读取文件为数据URL
    reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
            // 创建一个画布
            const canvas = document.createElement("canvas");
            const context = canvas.getContext("2d");
            // 设置画布大小
            canvas.width = img.width;
            canvas.height = img.height;
            // 将图片绘制到画布上
            context.drawImage(img, 0, 0, img.width, img.height);
            // 获取画布的图像数据
            const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
            const code = jsQR(imageData.data, imageData.width, imageData.height);
            if (code) {
                console.log("二维码内容:", code.data);
                sqCode(code.data)
            } else {
                console.log("未找到二维码");
            }
        };
        // 将数据URL设为图像src
        img.src = event.target.result;
    };
    // 读取文件内容
    reader.readAsDataURL(file);
    
}
// 去登陆页面
const goLogin=()=>{
    showBottom.value=false
    router.push({ name: 'login' })
}

// 上传图片
const sqCode = async (code) => {
    localStorage.clear()
    const listData = await cardLogin({
        identityCard:code,
    })
    if (listData.code == 200) {
        
        configStore.token=''
        showToast({
            message: "登录成功"
        })
        console.log(configStore.token,'configStore')
        localStorage.setItem('config', listData.result.token);
        configStore.token=listData.result.token
        configStore.deviceUser=listData.result.userInfo
        showBottom.value=false
    }else{
        showToast({
            message:listData.msg
        })
    }
}
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
    profile:'',
})
const getInformation = async () => {
    const listData = await getUserInfo({})
    if (listData.code == 200) {
        informationList.profile=listData.result.profile
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
const emits = defineEmits(['update:modelValue', 'payConfirm'])


const showBottom = computed({
    set(val) {
        emits("update:modelValue", val)
    },
    get() {
        return props.modelValue
    }
})


onMounted(() => {

})

</script>
<style lang="less" scoped>
.chooseList {
    padding: 20px 10px;

    .lable {
        height: 60px;
        font-family: PingFang SC;
        font-size: 16px;
        font-weight: 600;
        line-height: 60px;
        text-align: center;
        color: var(--c3, #333333);


    }

    .boder {
        border-bottom: 1px solid #F0F0F0;
    }
}
</style>