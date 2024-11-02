<template>
    <div class="overflow-y-auto h-[calc(100vh-30px)] overflow-x-hidden scrollbar">
        <!-- 顶部 -->
        <div class="topBox">
            <!-- 搜索框开始 -->
            <div class="flex items-center py-[10px] pl-[14px]  w-[100%] pr-[6px] justify-between sticky top-0 z-10">
                <img src="../../assets/images/search/return.svg" @click="changePage">
                <div class="name">用户中心</div>
                <div class=" flexBox name">
                    <!-- <img src="../../assets/images/recharge/question.svg"> -->
                </div>
            </div>
            <!-- 搜索框结束 -->
            <div class="flex items-scenter justify-between pt-[4px] title">
                <div class="flex" style="align-items: center;">
                    <div class="avatar">
                        <!-- 头像 -->
                        <img class="w-[49px] " style="border-radius: 49px;" v-if="deviceUser?.avatar" :src="avatar" alt="">
                        <img class="w-[49px]" v-else src="@/assets/images/avatar.png" alt="">
                    </div>
                    <!-- 用户名+id -->
                    <div class="flex flex-col nameBox">
                        <div class="text-[16px] font-normal mb-[2px] name">
                            <span>{{ deviceUser?.nickname }}</span>
                        </div>
                        <div class="id" v-if="deviceUser?.userGroupId == 3">
                            <img class="vip" src="../../assets/images/mine/vip.svg" />
                            普通会员
                        </div>
                    </div>
                </div>
                <div class="btnBox" @click="router.push({ name: 'rechargeRecord' })">
                    充值记录
                </div>
            </div>
        </div>
        <div class="contentName"> </div>
        <div class="  text-[12px] br-[10px] contentBox">

            <!-- 限时永久卡 -->
            <div v-if="newcomerGoods?.remainTime"
                class="w-full h-[120px]  mb-[10px] relative bg-size bg-[url('@/assets/images/recharge/new_discount.png')]">
                <van-count-down class="text-[14px]" :time="newcomerGoods?.remainTime * 1000">
                    <template #default="timeData">
                        <span class="absolute bottom-[9px] right-[93px] text-white">{{ fillIn(timeData.hours) }}</span>
                        <span class="absolute bottom-[9px] right-[54px] text-white">{{ fillIn(timeData.minutes)
                            }}</span>
                        <span class="absolute bottom-[9px] right-[15px] text-white">{{ fillIn(timeData.seconds)
                            }}</span>
                    </template>
                </van-count-down>
            </div>
            <!-- 会员种类 -->
            <div class="flex overflow-y-hidden overflow-x-auto scrollbar mb-[18px] " style="padding: 10px;">

                <div @click="chooseCard(index, item)" v-for="item, index in goodsList" :key="index"
                    class="cardBox select-none rounded-[10px] flex-auto text-[#AC63FF] flex-grow-0 flex-shrink-0 mr-[10px] flex flex-col items-center p-[4px] bg-[#fff] border-mainBg">
                    <div class="longcard">
                        <img class="card" v-if="index == 0" src="../../assets/images/recharge/longCard.png" />
                        <img class="content" v-if="index == 0" src="../../assets/images/recharge/longContent.svg" />
                        <img class="card" v-if="index == 1" src="../../assets/images/recharge/yearCard.png" />
                        <img class="content" v-if="index == 1" src="../../assets/images/recharge/yearContent.svg" />
                        <img class="card" v-if="index == 2" src="../../assets/images/recharge/monthCard.png" />
                        <img class="content" v-if="index == 2" src="../../assets/images/recharge/monthContent.svg" />

                        <div class="price" v-if="index == 0">
                            <div class="money">￥{{ item.goodsPresentPrice }}</div>
                            <div class="moneyLate">原价<span
                                    style="text-decoration-line: line-through;">￥{{ item.goodsOriginalPrice }}</span>
                            </div>
                        </div>
                        <div class="price" v-if="index == 1">
                            <div class="money" style="color: #571807;">￥{{ item.goodsPresentPrice }}</div>
                            <div class="moneyLate" style="color: #5A2008;">原价<span
                                    style="text-decoration-line: line-through;">￥{{ item.goodsOriginalPrice }}</span>
                            </div>
                        </div>
                        <div class="price" v-if="index == 2">
                            <div class="money" style="color: #2C4264;">￥{{ item.goodsPresentPrice }}</div>
                            <div class="moneyLate" style="color: #2C4264;">原价<span
                                    style="text-decoration-line: line-through;">￥{{ item.goodsOriginalPrice }}</span>
                            </div>
                        </div>
                        <img class="chooseCard" v-if="cardIndex == index"
                            src="../../assets/images/recharge/chooseCard.svg" />

                    </div>
                </div>

            </div>

            <div class="btnBox">
                <div class="flex titleLable  ">
                    <div class="fk"></div>
                    <div v-if="active==0">永久会员7项特权</div>
                    <div v-if="active==1">年度会员5项特权</div>
                    <div v-if="active==2">月度会员3项特权</div>
                </div>
                <div class="vipBox" v-if="active==0">
                    <div class="vipTq">
                        <img src="../../assets/images/recharge/vip1.png" />
                        <div class="txt">无限观影</div>
                    </div>
                    <div class="vipTq">
                        <img src="../../assets/images/recharge/vip2.png" />
                        <div class="txt">尊贵身份</div>
                    </div>
                    <div class="vipTq">
                        <img src="../../assets/images/recharge/vip3.png" />
                        <div class="txt">会员标识</div>
                    </div>
                    <div class="vipTq">
                        <img src="../../assets/images/recharge/vip4.png" />
                        <div class="txt">专属客服</div>
                    </div>
                    <div class="vipTq">
                        <img src="../../assets/images/recharge/vip5.png" />
                        <div class="txt">无限下载</div>
                    </div>
                    <div class="vipTq">
                        <img src="../../assets/images/recharge/vip6.png" />
                        <div class="txt">极速播放</div>
                    </div>
                    <div class="vipTq">
                        <img src="../../assets/images/recharge/vip7.png" />
                        <div class="txt">高清视频</div>
                    </div>

                </div>

                <div class="vipBox" v-if="active==1">
                    <div class="vipTq">
                        <img src="../../assets/images/recharge/vip1.png" />
                        <div class="txt">无限观影</div>
                    </div>
                    <div class="vipTq">
                        <img src="../../assets/images/recharge/vip2.png" />
                        <div class="txt">尊贵身份</div>
                    </div>
                    <div class="vipTq">
                        <img src="../../assets/images/recharge/vip3.png" />
                        <div class="txt">会员标识</div>
                    </div>
                    <div class="vipTq">
                        <img src="../../assets/images/recharge/vip4.png" />
                        <div class="txt">专属客服</div>
                    </div>
                    <div class="vipTq">
                        <img src="../../assets/images/recharge/vip5.png" />
                        <div class="txt">无限下载</div>
                    </div>
                
                </div>
                <div class="vipBox" v-if="active==2">
                    <div class="vipTq">
                        <img src="../../assets/images/recharge/vip1.png" />
                        <div class="txt">无限观影</div>
                    </div>
                    <div class="vipTq">
                        <img src="../../assets/images/recharge/vip3.png" />
                        <div class="txt">会员标识</div>
                    </div>
                    <div class="vipTq">
                        <img src="../../assets/images/recharge/vip7.png" />
                        <div class="txt">高清视频</div>
                    </div>

                </div>


            </div>
            <div class=" mt-[18px] px-[10px] btnBox">
                <div class="flex titleLable  ">
                    <div class="fk"></div>
                    <div>温馨提示</div>
                </div>
                <div class="ml-[4px] text-[#979797] mb-[100px]">
                    <div><span class="numDot">1</span>多次支付失败，请尝试其他支付方式或者稍后再试。</div>
                    <div><span class="numDot">2</span>支付成功后一般10分钟到账，否则请通过意见反馈联系客服。</div>
                    <div><span class="numDot">3</span>部分安卓手机支付时误报病毒，请忽略即可。</div>
                </div>
            </div>
        </div>
        <div class="fixed bottom-0 w-full h-[70px] max-w-[375px] bg-[#f2f3f5] px-[10px] py-[8px] bottomBox">
            <div class="mb-[14px] text-[16px] money">
                <span class="text-[#333333]">合计
                    <span class="text-[#F83E3C]" style="font-weight: 600;"> ¥{{ cur_vip.goodsPresentPrice }}元</span>
                </span>
                <div class="yhText">
                    已优惠0元
                </div>
            </div>
            <div class="flex-auto flex-shrink-0 flex-grow-0">
                <!-- <van-button :icon="qq_icon" plain @click="openService"
                    class="!mr-[10px] w-[100px] !bg-transparent !text-[#2F2F42] !border-[#505050]">客服</van-button> -->
                <van-button style="background-color: #F83E3C;color: #FFFFFF;width: 103px;height:36px;
                border-radius: 18px;" block @click="goPay(0)">去支付</van-button>
            </div>
        </div>
        <channelPop v-model="show" @payConfirm="payConfirm" :cur_vip="cur_vip"></channelPop>
        <idPop v-model="idShow" load :confirm="() => show = true"></idPop>
        <!-- 立即支付跳身份卡或者注册弹窗 -->
        <van-dialog v-model:show="tipShow" style="border-radius: 26px;width: 300px;">
            <template #footer>
                <div class="bg-[#fff] br-[20px] popBox">
                    <img src="../../assets/images/mine/back.svg" class="w-full h-full" />
                    <div class="text-center text-black popTitle">
                        为了保证您的VIP权益请先
                    </div>
                    <div class="saveTxt">
                        保存身份卡或者注册账号
                    </div>

                    <div class="flex justify-around  items-center btnBox " @click="goPayUrl">
                        <div class="btn" style="width: 130px;" @click.stop="router.push({ name: 'login' })">注册账号</div>
                        <div class="btn" style="width: 130px;" @click="saveCode">保存身份卡</div>
                    </div>
                    <div class="jump" @click="goPay(1)">
                        跳过，直接支付。
                    </div>

                </div>

            </template>
        </van-dialog>

        <van-dialog v-model:show="payTipsShow" style="border-radius: 26px;width: 300px;">
            <template #footer>
                <div class="bg-[#fff] popBox">
                    <img src="../../assets/images/mine/back.svg" class="w-full h-full" />
                    <img src="../../assets/images/mine/close.svg" class="close" @click="payTipsShow = false" />
                    <div class="text-center text-black popTitle">
                        确认支付结果
                    </div>
                    <div class="flex justify-around  items-center m-[20px]">
                        <VanButton class="!text-white  !px-[25px]" round color="#F83E3C" @click="paySuccess">支付成功
                        </VanButton>
                        <VanButton class="!px-[25px]" round @click="goPayUrl">去支付</VanButton>
                    </div>

                </div>

            </template>
        </van-dialog>
    </div>
</template>
<script setup name="recharge">
import { computed, ref, onMounted, onUnmounted } from "vue";
import { config } from '@/store/config';
import zfb_icon from '@/assets/images/recharge/zfb_icon.png'
import wx_icon from '@/assets/images/recharge/wx_icon.png'
import ic_active from '@/assets/images/recharge/ic_active.png'
import vip_month from '@/assets/images/recharge/vip_month.png'
import vip_permanent from '@/assets/images/recharge/vip_permanent.png'
import vip_quarter from '@/assets/images/recharge/vip_quarter.png'
import vip_year from '@/assets/images/recharge/vip_year.png'
import qq_icon from '@/assets/images/recharge/qq_icon.png'
import { paymentChannelList, createVipOrder, getVipGoodsList } from "@/service/payApi";
import idPop from '@/views/mine/components/idPop.vue'
import channelPop from "@/views/recharge/components/channelPop.vue";
import router from "@/router";
import { openLink, fillIn, copyString, $get } from "@/utils";
import { showToast } from "vant";
import { fetchImage } from '@/utils/imageUtils'; // 导入封装的函数
const userGroupId = computed(() => $get(configStore, "deviceUser.userGroupId", 1))
const configStore = config()
const newcomerGoods = computed(() => goodsList.value.find(item => item.goodsType == 'NewUser') || {})
const goodsList = ref([])
const cur_vip = computed(() => goodsList.value[active.value] || {})
const payments = ref([])
const active = ref(0)
const activePay = ref({})
const channelList = computed(() => activePay.value?.availableChannelsRelation || [])
const activeChannel = ref({})
const paymentChannelId = ref()
const deviceUser = computed(() => $get(configStore, 'deviceUser', {}))
const avatar =ref('')
fetchImage(deviceUser.value.avatar).then((val) => {
	   avatar.value=val
        });

const getpaymentChannelList = async () => {
    let res = await paymentChannelList()
    payments.value = res.result
    const defaultChannel = res.result[0]
    activePay.value = defaultChannel
    activeChannel.value = defaultChannel?.availableChannelsRelation[0]
    paymentChannelId.value = activeChannel.value.paymentChannelId
}
const changePage = () => {
    router.go(-1);

}
const cardIndex = ref(0)
const chooseCard = (index, item) => {
    cardIndex.value = index
    active.value = index
}
const getIcon = (key) => {
    let icon = zfb_icon
    switch (key) {
        case "Alipay":
            icon = zfb_icon
            break;
        case "Wechat":
            icon = wx_icon
            break;
        default:
            break;
    }
    return icon
}
const getVipImg = (key) => {
    let img = vip_month
    switch (key) {
        case "Month":
            img = vip_month
            break;
        case "Quarter":
            img = vip_quarter
            break;
        case "Forever":
            img = vip_permanent
            break;
        default:
            img = vip_year
            break;
    }
    return img
}
const show = ref(false)
const idShow = ref(false)
const tipShow = ref(false)
const jumpOver = ref(false)
const jump = () => {
    tipShow.value = false
}
const saveCode = () => {
    tipShow.value = false
    idShow.value = true
}
const selectPayment = (item) => {
    if (activePay.value.paymentTypeId !== item.paymentTypeId) {
        activePay.value = item
        activeChannel.value = item?.availableChannelsRelation[0]
    }

}
const payLoading = ref(false)
const confirm = async () => {
    payLoading.value = true
    let res = await createVipOrder({
        paymentChannelId: activeChannel.value.paymentChannelId,
        pageName: window.localStorage.getItem("_pageName") || "index.html",
        goodsId: cur_vip.value.goodsId
    })
    if (res.result.payUrl) {
        show.value = false
        openLink(res.result.payUrl)
    } else {
        showToast({
            type: "fail",
            message: "发生错误请重新再试！"
        })
    }
    payLoading.value = false

}
const vipGoodsList = async () => {
    let res = await getVipGoodsList()
    goodsList.value = res.result
}
const select = (item) => {
    activeChannel.value = item
}
const close = () => {
    router.go(-1)
}
// 客服
const openService = () => {
    let qq = '2249695726'
    copyString(qq)
    openLink(`https://wpa.qq.com/msgrd?v=3&uin=${qq}&site=qq&menu=yes&jumpflag=1`)
}
const goPay = (type) => {
    if (type == 0) {
        tipShow.value = true
    } else {
        show.value = true
        tipShow.value = false
    }



    // payTipsShow=true
    // let loadqCode = window.localStorage.getItem('loadqCode')
    // if (type == 1 || userGroupId.value != 1 || loadqCode) {
    //     show.value = true;
    //     tipShow.value = false
    //     return
    // }
    // if (!jumpOver.value) {
    //     tipShow.value = true
    // }
}
let payTimer = null
const payTipsShow = ref(true)
const payUrl = ref('')
const payConfirm = (url) => {
    payUrl.value = url
    if (payTimer) {
        clearTimeout(payTimer)
    }
    payTimer = setTimeout(() => {
        payTipsShow.value = true
    }, 15 * 1000)

}
const goPayUrl = () => {
    openLink(payUrl.value)
    payTipsShow.value = false
}
const paySuccess = () => {
    payTipsShow.value = false
    configStore.updateUserInfo()
}
onMounted(() => {
    vipGoodsList()
    getpaymentChannelList()
})
onUnmounted(() => {
    if (payTimer) {
        clearTimeout(payTimer)
    }
})
</script>
<style lang="less" scoped>
.linear-color {
    background-image: linear-gradient(180deg, #E73737 -8.33%, #C817A1 120.83%);
    -webkit-background-clip: text;
    color: transparent;
}

.border-mainBg {


    &.border-none {
        border: none !important;
    }

    &::before {
        display: none;
    }
}

.bg-size {
    background-size: 100% 100%;
}

.bg-duction {
    background: linear-gradient(90deg, #2D57CC 0%, #AC63FF 100%);
    border-radius: 0 6px 0 10px;
}

.line-h {
    line-height: 18px;
    font-family: PingFang SC;
    font-size: 13px;
    font-weight: 600;
    line-height: 18.2px;
    text-align: left;

}

.btnBox {
    .titleLable {
        padding: 10px;
        align-items: center;
        font-family: PingFang SC;
        font-size: 13px;
        font-weight: 600;
        line-height: 18.2px;
        text-align: left;

        .fk {
            width: 3px;
            height: 14px;
            border-radius: 1.5px;
            background: #F83E3C;
            margin-right: 5px;
        }
    }

    .vipBox {
        display: flex;
        flex-wrap: wrap;
        justify-content: flex-start;

        .vipTq {
            width: 75px;
            display: flex;
            flex-direction: column;
            align-items: center;
            margin-bottom: 10px;

            img {
                width: 47px;
                height: 47px;
                font-family: PingFang SC;
                font-size: 10px;
                font-weight: 400;
                line-height: 14px;
                text-align: center;

            }

        }

    }

    .numDot {
        display: inline-block;
        width: 14px;
        height: 14px;
        line-height: 14px;
        text-align: center;
        border-radius: 7px;
        background: #EAEAEA;
        margin-right: 5px
    }



}

.topBox {
    width: 375px;
    // height: 199px;
    background: linear-gradient(270.52deg, #582683 0.45%, #5448A0 100.9%);

    .name {
        font-family: PingFang SC;
        font-size: 16px;
        font-weight: 600;
        line-height: 22px;
        text-align: center;
        color: #FFFFFF;

    }

    .flexBox {
        display: flex;
        width: 20px;

        img {
            margin-right: 5px;
        }
    }

    .title {
        width: 100%;
        height: 128px;
        padding: 12px 12px 12px 12px;
        align-items: center;

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
                    width: 120px;
                    height: 20px;
                    overflow: hidden;
                }
            }

            .id {
                display: flex;
                align-items: center;
                line-height: 20px;
                margin-top: 2px;
                font-family: PingFang SC;
                font-size: 12px;
                font-weight: 400;
                color: #fff;

                .num {
                    font-family: PingFang SC;
                    font-size: 12px;
                    font-weight: 600;
                    line-height: 16.8px;
                    text-align: left;
                    color: #FFFFFF99;
                    margin-right: 10px;

                    .color {
                        color: #FFFFFF;

                    }

                }
            }
        }

        .btnBox {
            width: 85px;
            height: 32px;
            border-radius: 16px;
            line-height: 32px;
            font-family: PingFang SC;
            font-size: 14px;
            font-weight: 600;
            line-height: 32px;
            text-align: center;
            background: var(--main-1, #F83E3C);
            color: #FFFFFF;

        }


    }
}

.contentName {
    width: 100%;
    height: 10px;
    border-radius: 10px 10px 0 0;
    margin-top: -9px;
    background-color: #fff;
    font-family: PingFang SC;
    font-size: 14px;
    font-weight: 600;
}



.cardBox {
    margin-right: 10px;

    .longcard {
        position: relative;

        .card {
            width: 139px;
            height: 157px;
        }

        .content {
            position: absolute;
            top: 45px;
            left: 10px;
        }

        .price {

            position: absolute;
            bottom: 10px;
            left: 10px;
            right: 10px;
            display: flex;
            align-items: center;
            justify-content: space-between;

            .money {
                font-family: PingFang SC;
                font-size: 16px;
                font-weight: 600;
                color: #EBC26F;
            }

            .moneyLate {
                font-family: PingFang SC;
                font-size: 10px;
                font-weight: 600;
                color: #91794D;
                opacity: 0.5;

            }
        }
    }

    .chooseCard {
        width: 139px;
        height: 157px;
        position: absolute;
        top: 0;
        left: 0;
    }

}

.bottomBox {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .money {
        .yhText {
            font-family: PingFang SC;
            font-size: 10px;
            font-weight: 400;
            line-height: 18px;
            text-align: left;
            color: #333333;

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

    .saveTxt {
        font-family: PingFang SC;
        font-size: 18px;
        font-weight: 600;
        line-height: 25.2px;
        text-align: center;
        color: #F83E3C;
        margin-top: 10px;
    }



    .btnBox {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-evenly;
        padding: 20px 0 10px 0;

        .btn {
            width: 103px;
            height: 40px;
            line-height: 40px;
            border-radius: 20px;
            background: var(--main-1, #F83E3C);
            color: #FFFFFF;
            text-align: center;
            font-family: PingFang SC;
            font-size: 14px;
            font-weight: 600;


        }


    }

    .jump {
        padding: 10px 0 20px 0;
        font-family: PingFang SC;
        font-size: 12px;
        font-weight: 400;
        line-height: 16.8px;
        text-align: center;
        color: var(--c3, #333333);
        text-decoration: underline;

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