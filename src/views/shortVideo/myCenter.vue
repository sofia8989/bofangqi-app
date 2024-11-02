<!-- 实战页面 -->

<template>
    <div class="actual-page h-page scrollTop">
        <!-- 顶部 -->
        <div class="topBox">
            <!-- 搜索框开始 -->
            <div class="flex items-center py-[10px] pl-[14px]  w-[100%] pr-[6px] justify-between sticky top-0 z-10">
                <img src="../../assets/images/search/return.svg" @click="changePage">
                <div class="name">我的中心</div>
                <div class=" flexBox name" @click="goSend">
                    <img src="../../assets/images/shortVideo/sendTie.svg">
                    <div>发帖</div>
                </div>
            </div>
            <!-- 搜索框结束 -->

            <div class="flex items-scenter justify-between pt-[4px] title">
                <div class="flex" style="align-items: center;">
                    <div class="avatar">
                        <!-- 头像 -->
                        <img class="w-[60px]"  :src="listf.avatar" alt="">
                    </div>
                    <!-- 用户名+id -->
                    <div class="flex flex-col nameBox">
                        <div class="text-[16px] font-normal mb-[2px] name">
                            <span>{{ listf.nickname }}</span>

                        </div>
                        <div class="text-[10px] text-[#999] mb-[2px] id">
                            <span class="num"> <span class="color">{{ listB }}</span> 粉丝</span>
                            <span class="num"><span class="color">{{ listc }}</span> 关注</span>
                            <span class="num"><span class="color">{{ listd }}</span> 发布</span>
                        </div>

                    </div>
                </div>
            </div>


        </div>
        <div class="contentName">
            我的发布
            <div class="hr"></div>
        </div>
        <div class="px-[10px]" style="overflow: scroll;height: calc(100vh - 199px);">
            <ActualItem :isClick="true" :listf="listf" :itemList="ListA" :type="2">
            </ActualItem>
        </div>

        <van-back-top bottom="80" />
       
    </div>
</template>
<script setup name="myCenter">
import { watch, reactive, onMounted, ref, computed,onUnmounted} from 'vue'
import { config } from '@/store/config'
import ActualItem from './components/actualItem.vue'
import { useRoute, useRouter } from 'vue-router'
import { mySend } from '@/service/baseApi'
import { fetchImage } from '@/utils/imageUtils'; // 导入封装的函数

const router = useRouter()
const configStore = config()
const route = useRoute()
const ListA = ref([])
const listB = ref()
const listc = ref()
const listd = ref()
const listf = reactive({
    nickname: '',
    avatar: '',
})


const show = ref(false)
const active = ref(0)

// 加载数据
const dd = async () => {
    const listData = await mySend({})
    fetchImage(listData.result.userData.avatar).then((val) => {
        listf.avatar = val
        });
        
    ListA.value = listData.result.postData.list
    listB.value = listData.result.PostInfoData.click
    listc.value = listData.result.PostInfoData.fouce
    listd.value = listData.result.PostInfoData.release
    listf.nickname = listData.result.userData.nickname
    
}
onMounted(() => {
    dd()
})
const activeId = ref(0)
const detailShow = ref(false)
const changePage = () => {
    router.go(-1);

}
const goSend = () => {
    router.push({ path: 'send' })
}

const city = ref('全国')
const submit = (value) => {
    city.value = value
}
const userId = sessionStorage.getItem('userId');
watch(() => detailShow.value, (val) => {
    if (val) configStore.runCode();
})

</script>
<style lang="less" scoped>
.actual-page {
    :deep(.van-tabs) {
        height: 100%;
        --van-tabs-line-height: 43px;
        --van-tabs-nav-background: transparent;
        --van-tabs-bottom-bar-color: #FF60AD;
        --van-tab-active-text-color: #fff;
        --van-tab-text-color: #979797;

        .van-tabs__nav--card {
            margin-left: 10px;
        }

        .van-tabs__nav--line {
            padding-left: 14px;
        }

        .van-tabs__nav {
            --van-tabs-default-color: #fff;
            background-color: #fff;
        }

        .van-tabs__line {
            bottom: 16px;
            width: 28px;
        }

        .van-tab {
            font-size: 16px;
            font-weight: 400;
            line-height: 55px;
            color: #2F2F42;

            &.van-tab--active {
                font-weight: 600;
                background: linear-gradient(90deg, #2D57CC 0%, #AC63FF 100%) !important;
                border-radius: 5px;
                color: #fff;
            }
        }
    }
}

.swipeImg {
    background-repeat: no-repeat;
    height: 185px;
    width: 100%;
    background-size: 100% 100%;
    background-position: 100% 100%;
}

.tabs-item {
    line-height: 25px;
    border-radius: 5px;
}

.bg-active {
    background: linear-gradient(180deg, #FE6E88 0%, #FD357B 100%);
}

.bg-none {
    background: rgba(26, 26, 26, 1);
}

.topBox {
    width: 375px;
    height: 199px;
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

        img {
            margin-right: 5px;
        }
    }

    .title {
        width: 100%;
        height: 128px;
        padding: 12px 12px 12px 12px;


        .avatar {
            margin-right: 10px;

            img {
                width: 60px;
                height: 60px;
                border-radius: 30px;
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


    }
}

.contentName {
    width: 100%;
    height: 40px;
    border-radius: 10px 10px 0 0;
    margin-top: -40px;
    background-color: #fff;
    font-family: PingFang SC;
    font-size: 14px;
    font-weight: 600;
    line-height: 30px;
    text-align: center;
    color: #F83E3C;
    display: flex;
    flex-direction: column;
    align-items: center;

    .hr {
        width: 20px;
        height: 3px;
        border-radius: 3px;
        background: #F83E3C;
    }

}
</style>
