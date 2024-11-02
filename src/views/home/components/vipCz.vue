<!-- 免费获取vip -->
<template>
    <div v-show="show" @click="show = false"
        class="z-[100] max-w-[500px] text-white my-0 mx-auto px-[45px]  bottom-0 right-0 fixed top-0 left-0 bg-black/80 flex flex-col justify-center items-center ">
        <div class="z-[101] absolute  right-[45px] top-[7vh]">
        </div>
        <div ref="refShare" class="w-full h-auto relative  mb-[20px]">

            <img src="@/assets/images/share/vipCz.png" alt="" srcset="">
            <img src="../../../assets/images/mine/closeWhite.svg" class="close"  @click="show = false"/>
            <div class="absolute w-[100%]  top-[130px] pt-[8px] pd-[8px] left-[50.8%] translate-x-[-51%] border-solid rounded-[10px] "
                style="    display: flex; flex-direction: column;align-items: center; padding: 0 3px;">
                <div class="downTime">限时优惠倒计时</div>
                <div class="time">{{ formattedTime }}</div>
                <div
                    style="width: 100%;height: 88px;margin-top: 15px; margin-bottom: 30px;display: flex;justify-content: space-between;">
                    <div class="cardBox" v-for="item, index in goodsList" :key="index" v-show="index<3">
                        <img class="back" v-if="index == 0" src="@/assets/images/share/vipBack1.png">
                        <img class="back" v-if="index == 1" src="@/assets/images/share/vipBack2.png">
                        <img class="back" v-if="index == 2" src="@/assets/images/share/vipBack3.png">
                        <div class="contentBox">
                            <img src="@/assets/images/share/zuanshi.svg">
                            <div class="vipName" v-if="index == 0">{{ item.goodsName }}</div>
                            <div class="vipName" style="background:linear-gradient(94.8deg, #683F0E 15.98%, #561806 81.66%); -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;" v-if="index == 1">{{ item.goodsName }}</div>
                            <div class="vipName" style="background:linear-gradient(94.8deg, #3F5C87 15.98%, #0C192D 81.66%);-webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
" v-if="index == 2">{{ item.goodsName }}</div>
                            <div class="nowPrice" v-if="index == 0">￥{{ item.goodsPresentPrice }}</div>
                            <div class="nowPrice" style="color: #571807;" v-if="index == 1">￥{{ item.goodsPresentPrice
                                }}</div>
                            <div class="nowPrice" style="color: #2C4264;" v-if="index == 2">￥{{ item.goodsPresentPrice
                                }}</div>
                            <div class="oldPrice" style="color: #EBC26F;" v-if="index == 0">原价<span>￥{{
                                item.goodsOriginalPrice }}</span></div>
                            <div class="oldPrice" style="color: #5A2008;" v-if="index == 1">原价<span>￥{{
                                item.goodsOriginalPrice }}</span></div>
                            <div class="oldPrice" style="color: #2C4264;" v-if="index == 2">原价<span>￥{{
                                item.goodsOriginalPrice }}</span></div>
                        </div>
                    </div>
                </div>
                <!-- <img src="@/assets/images/share/card.svg" style="width: 260px;height: 88px;margin-top: 15px; margin-bottom: 30px;" alt="" srcset=""> -->
                <div class="btn" @click="router.push({ name: 'recharge' })"> 立即充值</div>

            </div>
        </div>
    </div>
</template>
<script setup name="sharePop">
import { config } from '@/store/config'
import { ref, onMounted, computed, onUnmounted } from 'vue'
import { $get, copyString } from "@/utils";
import { htmlTocanvas } from "@/utils/html2canvas";
import { useRouter } from 'vue-router'
import { getVipGoodsList } from "@/service/payApi";
const router = useRouter()
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
const goodsList = ref()
const vipGoodsList = async () => {
    let res = await getVipGoodsList()
    goodsList.value = res.result
}
const configStore = config()
const url = `${$get(configStore, 'appConfig.DownloadPageUrl', "")}&inviteCode=${$get(configStore, 'deviceUser.userId', "")}`
const refShare = ref()
const downloadqCode = () => {
    htmlTocanvas(refShare.value, '#393939', `share`)
    window.localStorage.setItem("loadqCode", 1)
}
// 倒计时开始
const totalSeconds = 5 * 60 * 60; // 5小时转换为秒
const remainingTime = ref(totalSeconds);

const formattedTime = computed(() => {
    const hours = String(Math.floor(remainingTime.value / 3600)).padStart(2, '0');
    const minutes = String(Math.floor((remainingTime.value % 3600) / 60)).padStart(2, '0');
    const seconds = String(remainingTime.value % 60).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
});

const startCountdown = () => {
    if (remainingTime.value > 0) {
        remainingTime.value--;
    } else {
        clearInterval(interval);
    }
};
vipGoodsList()
let interval;

onMounted(() => {
    interval = setInterval(startCountdown, 1000); // 每秒执行一次

});

onUnmounted(() => {
    clearInterval(interval); // 组件卸载时清理定时器
});


</script>
<style scoped lang="less">
.btn-bg {
    background: linear-gradient(180deg, #FFCE53 0%, #F58319 100%);
}
.close{
    position: absolute;
    top: 50px;
    right: 10px;
    color: #fff;
}

.text {
    font-family: PingFang SC;
    font-size: 12px;
    font-weight: 400;
    line-height: 16.8px;
    text-align: left;
    color: #000;
    text-align: center;
    margin-top: 15px;
}

.code {
    font-family: PingFang SC;
    font-size: 0.53333rem;
    font-weight: 600;
    text-align: left;
    text-decoration: underline;
    color: #F83E3C;
    text-align: center;
}

.btn {
    width: 260px;
    height: 50px;
    top: 552px;
    left: 57px;
    border-radius: 49px;
    background-color: #F83E3C;
    // margin-top: 15px;
    line-height: 50px;
    text-align: center;
    font-family: PingFang SC;
    font-size: 16px;
    font-weight: 600;
    color: #FFFFFF;
}

.downTime {
    font-family: PingFang SC;
    font-size: 13px;
    font-weight: 400;
    line-height: 20px;
    text-align: center;
    color: #666666;
}

.time {
    font-family: PingFang SC;
    font-size: 32px;
    font-weight: 400;
    line-height: 44.8px;
    text-align: center;
    color: #F83E3C;


}

.cardBox {
    width: 100%;
    height: 88px;
    position: relative;
    display: flex;
    justify-content: center;

    .back {
        width: 80px;
        height: 88px;
    }

    .contentBox {
        width: 80px;
        height: 88px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;
        padding: 3px 0;
        position: absolute;
        top: 0;

        img {
            width: 38px;
            height: 32px;
            margin-top: -5px;
        }

        .vipName {
            background: linear-gradient(270deg, #DBA131 0%, #F0CC83 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            font-family: PingFang SC;
            font-size: 12px;
            font-weight: 600;
            line-height: 16.8px;
            text-align: center;
        }

        .nowPrice {
            font-family: PingFang SC;
            font-size: 16px;
            font-weight: 600;
            line-height: 18px;
            text-align: left;
            color: #EBC26F;
        }

        .oldPrice {
            font-family: PingFang SC;
            font-size: 10px;
            font-weight: 600;
            line-height: 14px;
            text-align: left;
            color: #91794D;
            opacity: 0.5;

            span {
                text-decoration: line-through;
            }
        }

    }
}
</style>
