<template>
    <div class="overflow-y-auto h-[calc(100vh-116px)] overflow-x-hidden scrollbar">
        <NavHeader title="注册登录" :callBack="close">
            <!-- <template v-slot="left">
                <span class="text-[#2F2F42]" @click="router.push({ name: 'rechargeRecord' })">充值记录</span>
            </template> -->
        </NavHeader>
        <div class="loginBox">
            <div class="logo">
                <img src="../../assets/images/login/logo.png" />
            </div>
            <div class="inputBox">
                <div class="text">
                    <div class="textName">用户名</div>
                    <div class="txt">请输入长度为6-20位的用户名</div>
                </div>
                <input v-model="userName" placeholder="请输入用户名" :style="{ borderColor: '#F0F0F0', borderWidth: '2px' }"
                    style="width:100%;height: 36px;background-color: #F6F6F6;
border: 1px solid #F0F0F0;border-radius: 5px;line-height: 36px; padding: 0 5px;" maxlength="20" minlength="6" />
            </div>
            <div class="inputBox">
                <div class="text">
                    <div class="textName">密码</div>
                    <div class="txt">请输入长度为4-20位的密码</div>
                </div>
                <input v-model="password" type="password" :style="{ borderColor: '#F0F0F0', borderWidth: '2px' }" style="width:100%;height: 36px;background-color: #F6F6F6;
border: 1px solid #F0F0F0;border-radius: 5px;line-height: 36px; padding: 0 5px;" maxlength="20" minlength="4" />
            </div>

            <div class="btnBox" v-if="password == '' || userName == ''">
                <div class="btn">
                    立即注册
                </div>
                <div class="btn">
                    立即登录
                </div>
            </div>
            <div class="btnBox" v-else>
                <div class="btn" style="background-color:#F83E3C;" @click="getRegiste">
                    立即注册
                </div>
                <div class="btn" style="background-color:#F83E3C;" @click="getLogin">
                    立即登录
                </div>
            </div>
            <div class="tsBox">
                <div class="tsTitle">
                    <div class="jx"></div>
                    <div class="txt">提示</div>
                </div>
                <ul class="tsTxt">
                    <li>1.请务必记住自己的账号密码</li>
                    <li>2.不提供密码找回功能</li>
                    <li>3.登录后可保存身份卡防止忘记密码</li>
                </ul>
            </div>


        </div>

    </div>
</template>
<script setup name="recharge">

import router from "@/router";
import { login, registe } from '@/service/baseApi'
import { ref } from "vue";
import { showToast } from 'vant'
import { config } from '@/store/config'
const configStore = config()
const userName = ref('')
const password = ref('')
// 登录
const getLogin = async () => {
    if (password.value.length < 6) {
        showToast({
            message: "请输入长度为6-20位的密码"
        })
        return
    }
    if (userName.value.length < 6) {
        showToast({
            message: "请输入长度为6-20位的用户名"
        })
        return
    }
    const listData = await login({
        userName: userName.value,
        password: password.value
    })
    if (listData.code == 200) {
        showToast({
            message: "登录成功"
        })
        localStorage.setItem('token', listData.result.token);
        configStore.token = listData.result.token
        console.log(configStore, "configStore")
        router.go(-1)
    } else {
        showToast({
            message: listData.msg
        })
    }
}


// 注册
const getRegiste = async () => {
    if (password.value.length < 4) {
        showToast({
            message: "请输入长度为4-20位的密码"
        })
        return
    }
    if (userName.value.length < 6) {
        showToast({
            message: "请输入长度为6-20位的用户名"
        })
        return
    }
    const listData = await registe({
        userName: userName.value,
        password: password.value,
        deviceId: configStore.$state.uuid,
    })
    if (listData.code == 200) {
        showToast({
            message: "注册成功"
        })
        router.go(-1)
    } else {
        showToast({
            message: listData.msg
        })
    }
}
const close = () => {
    router.go(-1)
}

</script>
<style lang="less" scoped>
.loginBox {
    width: 100%;

    .logo {
        height: 200px;
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
                color: var(--c9, #999999);
            }
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
}
</style>