<!-- 福利（AV）页面 -->

<template>
    <div id="page" class="nav-page h-page scrollbar overflow-x-hidden text-white bg-white" style="background:#F9F8FC;"  @scroll="handleScroll">

        <div class="sticky top-0 z-20 bg-white mb-[3px]">
            <Topboot class="z-10"></Topboot>
            <!-- 导航栏开始 -->
            <div class="w-full flex items-center h-[46px] pt-[3px]">
                <van-tabs v-model:active="active" @change="changeTab" shrink background="#fff" color="#F83E3C"
                    title-active-color="#F83E3C" title-inactive-color="#2F2F42">
                    <van-tab title="推荐" @click="handleTabClick(item)">
                    </van-tab>
                    <van-tab title="看片" @click="handleTabClick(item)">
                    </van-tab>
                    <van-tab title="直播" @click="handleTabClick(item)">
                    </van-tab>
                    <van-tab title="约会" @click="handleTabClick(item)">
                    </van-tab>
                    <van-tab title="春药" @click="handleTabClick(item)">
                    </van-tab>
                    <van-tab title="赚钱" @click="handleTabClick(item)">
                    </van-tab>
                </van-tabs>
            </div>
        </div>
        <swiperNav></swiperNav>

        <!-- 页面切换 -->
        <van-swipe ref="swipeRef" :loop="false" lazy-render class="bg-white mb-[50px]" @change="changeSwipe"
            style="background:#F9F8FC;" :show-indicators="false">

            <!-- 推荐 -->
            <van-swipe-item>
                <div v-show="active == 0" class="">
                    <!-- 轮播图 -->

                    <!-- 热门推荐开始 -->
                    <div class="recommendBox">
                        <img src="@/assets/images/nav/hotRecommend.png" />
                        <div class="hotTitle">热门推荐</div>
                        <div class="hotEnglish">Recommend</div>
                    </div>
                    <JiuGongGe :type="0" :list="tuijian" rounded10></JiuGongGe>
                    <titleList :list="fontList" rounded10></titleList>
                    <!-- 热门推荐结束 -->
                    <moneyGame></moneyGame>
                    <scFriend></scFriend>
                    <aliveList></aliveList>
                    <ShopMallList></ShopMallList>
                    <!-- <van-back-top immediate bottom="180" /> -->

                </div>

            </van-swipe-item>
            <!-- 看片 -->
            <van-swipe-item>
                <div v-show="active == 1">
                    <!-- 轮播图 -->
                    <!-- <swiperNav></swiperNav> -->
                    <!-- 热门推荐开始 -->
                    <div class="recommendBox">
                        <img src="@/assets/images/nav/hotRecommend.png" />
                        <div class="hotTitle">热门推荐</div>
                        <div class="hotEnglish">Recommend</div>
                    </div>
                    <JiuGongGe :type="0" :list="kanpian" rounded10></JiuGongGe>
                    <titleList :list="fontList" rounded10></titleList>
                    <moneyGame></moneyGame>
                    <scFriend></scFriend>
                    <!-- <van-back-top immediate bottom="80" /> -->
                </div>

            </van-swipe-item>
            <!-- 直播 -->
            <van-swipe-item>
                <div v-show="active == 2">
                    <!-- 轮播图 -->
                    <!-- <swiperNav></swiperNav> -->
                    <!-- 热门推荐开始 -->
                    <div class="recommendBox">
                        <img src="@/assets/images/nav/hotRecommend.png" />
                        <div class="hotTitle">热门推荐</div>
                        <div class="hotEnglish">Recommend</div>
                    </div>
                    <JiuGongGe :type="0" :list="zhibo" rounded10></JiuGongGe>
                    <aliveList></aliveList>
                    <!-- <van-back-top immediate bottom="80" /> -->
                </div>


            </van-swipe-item>
            <!-- 约会 -->
            <van-swipe-item>
                <div v-show="active == 3">
                    <!-- 轮播图 -->
                    <!-- <swiperNav></swiperNav> -->
                    <!-- 热门推荐开始 -->
                    <div class="recommendBox">
                        <img src="@/assets/images/nav/hotRecommend.png" />
                        <div class="hotTitle">热门推荐</div>
                        <div class="hotEnglish">Recommend</div>
                    </div>
                    <JiuGongGe :type="0" :list="yuehui" rounded10></JiuGongGe>
                    <scFriend></scFriend>
                    <!-- <van-back-top immediate bottom="80" /> -->
                </div>

            </van-swipe-item>
            <!-- 春药 -->
            <van-swipe-item>
                <div v-show="active == 4">
                    <!-- 轮播图 -->
                    <!-- <swiperNav></swiperNav> -->
                    <ShopMallList></ShopMallList>
                    <van-back-top immediate bottom="80" />
                </div>

            </van-swipe-item>
            <!-- 赚钱 -->
            <van-swipe-item>
                <div v-show="active == 5">
                    <!-- 轮播图 -->
                    <!-- <swiperNav></swiperNav> -->
                    <moneyGame></moneyGame>
                    <scFriend></scFriend>
                    <div @click="scrollTop">55555555555555</div>
                    <!-- <van-back-top immediate bottom="100" /> -->
                </div>

            </van-swipe-item>
        </van-swipe>
        <van-back-top bottom="80" />
    </div>
</template>
<script setup name="nav-page">
import { watch, reactive, onMounted, computed, onDeactivated, ref } from 'vue'
import { config } from '@/store/config'
import { $get, getImgUrl, $clickAd, randomCount, getHashPageName } from '@/utils'
import GrilItem from '@/views/actual/components/grilItem.vue'
import JiuGongGe from "@/components/Jiugongge.vue";
import { dhView } from '@/service/home'
import swiperNav from "@/components/swiperNav.vue"
import titleList from "@/components/titleList.vue";
import moneyGame from "@/components/moneyGame.vue";
import scFriend from "@/components/scFriend.vue";
import aliveList from "@/components/aliveList.vue";
import ShopMallList from "@/components/shopMallList.vue";
import { getfontAd } from '@/service/community'
const configStore = config()

/**
 * @description 导航九宫格
 */
const xldh = computed(() => $get(configStore, 'templateData.xldh.adList', []))
const tuijian = computed(() => $get(configStore, 'templateData.tuijian.adList', []))
const kanpian = computed(() => $get(configStore, 'templateData.kanpian.adList', []))
const zhibo = computed(() => $get(configStore, 'templateData.tuijian.adList', []))
const yuehui = computed(() => $get(configStore, 'templateData.yuehui.adList', []))
/**
 * @description 导航视频
 */
const xldhVideo = computed(() => $get(configStore, 'templateData.xldhVideo.adList', []))
/**
 * @description 导航暗网-miyao
 */
const xldhAn = computed(() => $get(configStore, 'templateData.xldhAn.adList', []))
/**
 * @description 导航暗网-cuiqing
 */
const xldhAnQing = computed(() => $get(configStore, 'templateData.xldhAnQing.adList', []))
/**
 * @description 导航暗网-zhuangyang
 */
const xldhAnDick = computed(() => $get(configStore, 'templateData.xldhAnDick.adList', []))
/**
 * @description 导航赚钱
 */
const xldhMoney = computed(() => $get(configStore, 'templateData.xldhMoney.adList', []))
/**
 * @description 轮播图
 */
const xlHomeBanner = computed(() => $get(configStore, 'templateData.xlHomeBanner.adList', []))
/**
 * @description 轮播图
 */
const xldhBig = computed(() => $get(configStore, 'templateData.xldhBig.adList', []).map(item => {
    item.count = randomCount(50, 200)
    return item
})
)
/**
* @description 公告
*/
const AppNotify = computed(() => $get(configStore, 'configData.config.AppNotify', ''))
/**
 * @description 返回链接
 * 
 */
 const scrollPosition= ref('')
const jump = computed(() => $get(configStore, 'jump', {}))
const swipeRef = ref()
const active = ref(0)
const changeTab = (index) => {
    swipeRef.value?.swipeTo(index)
    changeSwipe(index)
}
const changeSwipe = (index) => {
    active.value = index
    document.getElementById('page').scrollTop=0
   
}
const fontList = ref([])

// 轮播图接口
const init = async () => {
    const listData = await getfontAd()
    configStore.navList = listData.result
    localStorage.setItem('navList', listData.result);
    fontList.value = listData.result
}


onMounted(() => {
    let url = $get(jump, 'value.url', '')
    console.log(url)
    if (url) {
        window.history.pushState('forward', null, '');
        window.addEventListener(
            'popstate',
            function (e) {
                if (!e.state.back) {
                    window.location.href = url;
                }
            },
            false
        );
    }
    init()

})
</script>
<style lang="less" scoped>
:deep(.van-tabs) {
    width: 100%;
    background-color: #fff;
}

:deep(.van-tabs__wrap) {
    width: 100%;
    height: 40px;

}

:deep(.van-tabs__nav) {
    display: flex;
    justify-content: space-between;
}

:deep(.van-tabs__line) {
    width: 20px;
    height: 3px;
    border-radius: 3px;

}

.recommendBox {
    background: #F9F8FC;
    display: flex;
    align-items: center;
    padding: 8px 10px;

    img {
        width: 18px;
        height: 18px;
        margin-right: 5px;
    }

    .hotTitle {
        font-family: PingFang SC;
        font-size: 14px;
        font-weight: 600;
        line-height: 20px;
        color: #FF2E7E;
        margin-right: 5px;
    }


    .hotEnglish {
        font-family: PingFang SC;
        font-size: 14px;
        font-weight: 400;
        line-height: 20px;
        color: #B9BBBF;

    }
}
</style>