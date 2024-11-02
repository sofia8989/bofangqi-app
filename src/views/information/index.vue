<template>
    <div class="overflow-y-auto h-[calc(100vh-116px)] overflow-x-hidden scrollbar">
        <NavHeader title="完善信息" :callBack="close">
            <!-- <template v-slot="left">
                <span class="text-[#2F2F42]" @click="router.push({ name: 'rechargeRecord' })">充值记录</span>
            </template> -->
        </NavHeader>
        <div class="loginBox">
            <div class="logo">
                <van-uploader v-model="fileList" multiple :max-size="2 * 1024" :max-count="1" deletable
                    :before-read="beforeRead" class="addBtn">
                    <img v-if="imgList == ''" src="../../assets/images/information/touxiang.png" />
                    <img v-else :src="imgList" />
                    <div class="avatarBtn">更换头像</div>
                </van-uploader>

            </div>
            <div class="inputBox">
                <div class="text">
                    <div class="textName">昵称</div>
                </div>
                <input v-model="informationList.nickname" placeholder="请输入昵称"
                    :style="{ borderColor: '#F0F0F0', borderWidth: '2px' }" style="width:100%;height: 36px;background-color: #F6F6F6;
border: 1px solid #F0F0F0;border-radius: 5px;line-height: 36px; padding: 0 5px;" maxlength="20" minlength="6" />
            </div>
            <div class="inputBox">
                <div class="text">
                    <div class="textName">用户名</div>
                </div>
                <input v-model="informationList.userName" placeholder="请输入长度为6-20位的用户名"
                    :style="{ borderColor: '#F0F0F0', borderWidth: '2px' }" style="width:100%;height: 36px;background-color: #F6F6F6;border: 1px solid #F0F0F0;
                    border-radius: 5px;line-height: 36px; padding: 0 5px;"  v-if="userShow==true"/>
                <input v-model="informationList.userName" placeholder="请输入长度为6-20位的用户名"
                    :style="{ borderColor: '#F0F0F0', borderWidth: '2px' }" style="width:100%;height: 36px;background-color: #F6F6F6;
border: 1px solid #F0F0F0;border-radius: 5px;line-height: 36px; padding: 0 5px;" disabled v-else/>
            </div>
            <div class="inputBox">
                <div class="text">
                    <div class="textName">密码</div>
                    <div class="txt" style="text-decoration: underline;
                color: #F83E3C;" @click="router.push({ name: 'changePassword' })">修改密码</div>
                </div>
                <input v-model="password" type="password" :style="{ borderColor: '#F0F0F0', borderWidth: '2px' }" style="width:100%;height: 36px;background-color: #F6F6F6;border: 1px solid #F0F0F0;
                border-radius: 5px;line-height: 36px; padding: 0 5px;"   disabled/>
            </div>
            <div class="inputBox">
                <div class="text">
                    <div class="textName">性别</div>
                </div>
                <div class="sexBox" v-if="sex == null">
                    <div class="chooseBox" style="margin-right: 20px;" @click="chooseBtn(0)"
                        :class="chooseIndex == 0 ? 'chooseTxt' : 'noChoose'">
                        <img src="../../assets/images/information/noChoose.svg" v-if="chooseIndex == 1" />
                        <img src="../../assets/images/information/choose.svg" v-else />
                        女
                    </div>
                    <div class="chooseBox" @click="chooseBtn(1)" :class="chooseIndex == 1 ? 'chooseTxt' : 'noChoose'">
                        <img src="../../assets/images/information/noChoose.svg" v-if="chooseIndex == 0" />
                        <img src="../../assets/images/information/choose.svg" v-else />
                        男
                    </div>

                </div>
                <div class="sexBox" v-else>
                    <div class="chooseBox" style="margin-right: 20px;"
                        :class="chooseIndex == 0 ? 'chooseTxt' : 'noChoose'">
                        <img src="../../assets/images/information/noChoose.svg" v-if="chooseIndex == 1" />
                        <img src="../../assets/images/information/choose.svg" v-else />
                        女
                    </div>
                    <div class="chooseBox" :class="chooseIndex == 1 ? 'chooseTxt' : 'noChoose'">
                        <img src="../../assets/images/information/noChoose.svg" v-if="chooseIndex == 0" />
                        <img src="../../assets/images/information/choose.svg" v-else />
                        男
                    </div>

                </div>
            </div>
            <div class="inputBox">
                <div class="text">
                    <div class="textName">个人简介</div>
                    <div class="txt">最多120字</div>
                </div>
                <textarea class="textarea" @input="checkCharCount" v-model="informationList.profile"></textarea>
            </div>

            <div class="submitBtn">
                <div class="submit" @click="getChangeBtn()">提交</div>
            </div>




        </div>

    </div>
</template>
<script setup name="recharge">
import { ref, onMounted, reactive } from 'vue'
import { getUserInfo } from '@/service/loginApi'
import router from "@/router";
import { upLoadImg, changeData } from '@/service/baseApi'
import http from '@/utils/axios'
import { showToast } from 'vant'
import { fetchImage } from '@/utils/imageUtils'; // 导入封装的函数
const baseURL = http.defaults.baseURL; // 获取 baseURL

const name = ref()
const password = ref('123456')
// 发布切换
const chooseIndex = ref(1)
const fileList = ref([])
const imgList = ref('')
const sex = ref('')
const userShow=ref(false)
// 添加图片
const beforeRead = (file, type) => {
    upload(file)
}
// 上传图片
const upload = async (file) => {
    const listData = await upLoadImg({
        file: file
    })
    if (listData.code == 200) {
        // let url = baseURL + listData.result.path
        informationList.avatar = listData.result.path
        //  imgList.value=url
        imgList.value = window.URL.createObjectURL(file)
        showToast({
            message: "上传成功"
        })
    } else {
        showToast({
            message: "上传失败"
        })
    }
}
// 修改资料接口
const getChangeBtn = async () => {
    if (informationList.userName.length < 6) {
        showToast({
            message: "请输入长度为6-20位的用户名"
        })
        return
    }
    const listData = await changeData({
        userName: informationList.userName,
        nickname: informationList.nickname,
        avatar: informationList.avatar,
        gender: chooseIndex.value,
        profile: informationList.profile,

    })
    if (listData.code == 200) {
        showToast({
            message: "修改成功"
        })
        router.go(-1)
    }
}

const chooseBtn = (index) => {
    chooseIndex.value = index
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
    profile: '',
})
const getInformation = async () => {
    const listData = await getUserInfo({})
    if (listData.code == 200) {
        if (!listData.result.avatar == '') {
            fetchImage(listData.result.avatar).then((val) => {
                imgList.value = val
            });
        } else {
            imgList.value = ''
        }
        if(listData.result.userName==''){
            userShow.value=true
        }else{
            userShow.value=false
        }


        informationList.profile = listData.result.profile
        informationList.userName = listData.result.userName
        informationList.avatar = listData.result.avatar
        // imgList.value= listData.result.avatar
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
        if (listData.result.gender == null) {
            chooseIndex.value = 0
        } else {
            chooseIndex.value = listData.result.gender
        }

        sex.value = listData.result.gender
    }
}
onMounted(async () => {
    getInformation()
})




const close = () => {
    router.go(-1)
}

</script>
<style lang="less" scoped>
.loginBox {
    width: 100%;

    .logo {
        height: 150px;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;

        img {
            width: 80px;
            height: 80px;
            border-radius: 40px;

        }

        .avatarBtn {
            width: 60px;
            height: 20px;
            border-radius: 61px;
            background: #775DF9;
            color: #FFFFFF;
            text-align: center;
            position: relative;
            top: -10px;
            left: 10px;
        }
    }

    .inputBox {
        padding: 10px;

        .text {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;

            .textName {
                font-family: PingFang SC;
                font-size: 12px;
                font-weight: 400;
                line-height: 16.8px;
                text-align: left;
                color: var(--c3, #333333);
            }

            .txt {
                font-family: PingFang SC;
                font-size: 12px;
                font-weight: 400;
                line-height: 16.8px;
                text-align: left;
                color: #999999;


            }
        }

        .sexBox {
            display: flex;
            align-items: center;

            .chooseBox {
                display: flex;

                img {
                    margin: 0 3px;
                }


            }

            .chooseTxt {
                font-family: PingFang SC;
                font-size: 12px;
                font-weight: 600;
                line-height: 16.8px;
                text-align: left;
                color: #000000;

            }

            .noChoose {
                font-size: 12px;
                font-weight: 400;
                line-height: 16.8px;
                text-align: left;
                color: #666666;
            }

        }

        .textarea {
            width: 100%;
            height: 63px;
            border-radius: 5px;
            border: 1px solid #F0F0F0;
            background: #F6F6F6;
            font-family: PingFang SC;
            font-size: 14px;
            font-weight: 400;
            line-height: 18px;
            text-align: left;
            color: #333;
            padding: 10px;
        }

    }

    .btnBox {
        margin: 20px 0;
        display: flex;
        justify-content: space-evenly;

        .btn {
            width: 170px;
            height: 40px;
            line-height: 40px;
            border-radius: 20px;
            background: var(--cc, #CCCCCC);
            color: #FFFFFF;
            text-align: center;
        }
    }

    .tsBox {
        padding: 10px;

        .tsTitle {
            display: flex;
            align-items: center;

            .jx {
                width: 3px;
                height: 14px;
                border-radius: 3px;
                background: #F83E3C;
                margin-right: 5px;

            }

            .txt {
                font-family: PingFang SC;
                font-size: 13px;
                font-weight: 600;
                line-height: 18.2px;

            }
        }

        .tsTxt {
            font-family: PingFang SC;
            font-size: 13px;
            font-weight: 400;
            line-height: 30px;
            text-align: left;

        }
    }

    .submitBtn {
        width: 100%;
        height: 70px;
        position: fixed;
        bottom: 0px;
        padding: 10px;

        .submit {
            width: 100%;
            height: 44px;
            border-radius: 38px;
            background: var(--main-1, #F83E3C);
            font-family: PingFang SC;
            font-size: 14px;
            font-weight: 600;
            line-height: 44px;
            text-align: center;
            color: #F0F0F0;

        }
    }

}
</style>