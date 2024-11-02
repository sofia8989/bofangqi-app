<!-- 修改密码 -->
<template>
    <div class="overflow-y-auto h-[calc(100vh-116px)] overflow-x-hidden scrollbar">
        <NavHeader title="修改密码" :callBack="close">
            <!-- <template v-slot="left">
                <span class="text-[#2F2F42]" @click="router.push({ name: 'rechargeRecord' })">充值记录</span>
            </template> -->
        </NavHeader>
        <div class="loginBox">
            <div class="inputBox">
                <div class="text">
                    <div class="textName">新密码</div>
                </div>
                <!-- 展示 -->
                <input v-model="valueo" placeholder="请输入密码"  type="password" id="password-input"
                    :style="{ borderColor: '#F0F0F0', borderWidth: '2px' }" style="width:100%;height: 36px;background-color: #F6F6F6;
border: 1px solid #F0F0F0;border-radius: 5px;line-height: 36px; padding: 0 5px;" v-if="watchIndex == 0" maxlength="20"/>
                <!-- 隐藏 -->
                <input v-model="valueo" placeholder="请输入密码"
                    :style="{ borderColor: '#F0F0F0', borderWidth: '2px' }" style="width:100%;height: 36px;background-color: #F6F6F6;
border: 1px solid #F0F0F0;border-radius: 5px;line-height: 36px; padding: 0 5px;" v-if="watchIndex == 1" maxlength="20"/>

                <img class="watchBtn" @click="changeWatch(0)" v-if="watchIndex == 1"
                    src="../../assets/images/information/watch.svg" />
                <img class="watchBtn" @click="changeWatch(1)" v-if="watchIndex == 0"
                    src="../../assets/images/information/noWatch.svg" />
            </div>
            <div class="inputBox">
                <div class="text">
                    <div class="textName">确认密码</div>
                </div>
                <!-- 展示 -->
                <input v-model="valueConfirm" placeholder="请确认密码" type="password"
                    :style="{ borderColor: '#F0F0F0', borderWidth: '2px' }" style="width:100%;height: 36px;background-color: #F6F6F6;
border: 1px solid #F0F0F0;border-radius: 5px;line-height: 36px; padding: 0 5px;" v-if="confirmIndex == 0" maxlength="20"/>
                <!-- 隐藏 -->
                <input v-model="valueConfirm" placeholder="请确认密码"
                    :style="{ borderColor: '#F0F0F0', borderWidth: '2px' }" style="width:100%;height: 36px;background-color: #F6F6F6;
border: 1px solid #F0F0F0;border-radius: 5px;line-height: 36px; padding: 0 5px;" v-if="confirmIndex == 1" maxlength="20"/>
                <img class="watchBtn" @click="confirmPassword(0)" v-if="confirmIndex == 1"
                    src="../../assets/images/information/watch.svg" />
                <img class="watchBtn" @click="confirmPassword(1)" v-if="confirmIndex == 0"
                    src="../../assets/images/information/noWatch.svg" />
            </div>

            <div class="submitBtn">
                <div class="submit" @click="changePassBtn">提交</div>
            </div>




        </div>

    </div>
</template>
<script setup name="recharge">
import { ref,onMounted } from 'vue'
import { changePassWord } from '@/service/baseApi'
import { showToast } from 'vant'
import router from "@/router";
const valueo=ref()
const valueConfirm=ref()
// 新密码展示隐藏
const watchIndex = ref(0)
const changeWatch = (index) => {
    watchIndex.value = index
}
//确认密码
const confirmIndex = ref(0)
const confirmPassword = (index) => {
    confirmIndex.value = index
}
const changePassBtn = async () => {
    if(valueConfirm.value.length < 6){
        showToast({
            message: "请输入6-20位数的密码"
        })
        return
    }
    if(valueConfirm.value==undefined){
        showToast({
            message: "请确认密码"
        })
        return
    }
    if(valueo.value==undefined){
        showToast({
            message: "请输入修改密码"
        })
        return
    }
    if(valueConfirm.value==valueo.value){
        const listData = await changePassWord({
        password:valueo.value,
    })
    if (listData.code == 200) {
        showToast({
            message: "修改密码成功"
        })
        valueo.value=''
        valueConfirm.value=''
        router.go(-1)
    }
    }else{
        showToast({
            message: "两次密码不一致"
        })
    }
   
}
onMounted(async () => {
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

        img {
            width: 70px;
            height: 70px;

        }
    }

    .inputBox {
        padding: 10px;
        position: relative;

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

        .watchBtn {
            position: absolute;
            bottom: 15px;
            right: 15px;
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