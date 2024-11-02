<!-- av搜索页 -->

<template>
    <div class="search_page_container bg-white h-page">
        <!-- 搜索框开始 -->
        <div class="flex items-center py-[10px] pl-[14px]  w-[100%] pr-[6px] justify-between sticky top-0 z-10">
            <img src="../../assets/images/search/return.svg" @click="changePage">
            <div class="name">回复</div>
            <div class="w-[30px] h-[30PX]"></div>
        </div>
        <!-- 搜索框结束 -->
        <content :itemList="item"></content>

    </div>
</template>

<script setup name="reply">
import { ref, reactive, onMounted, nextTick, computed, watch, onBeforeUnmount, shallowRef } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getVideoDetail } from '@/service/video'
import { getRecommendedList } from '@/service/community'
import router from '@/router'
import content from './components/content.vue'
const route = useRoute();


// 热门搜索切换
const hotIndex = ref(1)
const changeHot = (index) => {
    hotIndex.value = index
    if (hotIndex.value == 0) {
        recommendedList()
    }
}

const list = reactive([])
const changePage = () => {
    router.go(-1);

}
// 上拉加载
const onLoad = async () => {
    if (params.first) return
    if (params.pageNum >= params.pagecount) {
        params.finished = true
        return
    }
    params.loading = true
    params.pageNum++
    recommendedList()
}
// 下拉刷新
const onRefresh = async () => {
    params.refresh = true
    params.pageNum = 1
    params.videoList = []
    await recommendedList()
}
// 猜你喜欢
const recommendedList = async () => {
    getRecommendedList({ page: params.pageNum, pageSize: 8, vodId: route.params.id }).then((res) => {
        list.push(...res.result.list)
        params.videoList.push(...res.result.list)
        params.pagecount = res.result.total
        params.refresh = false
        params.first = false
        params.loading = false
        params.finished = params.pagecount <= params.videoList.length
    })
}
const params = reactive({
    pageNum: 1,
    loading: false,
    finished: false,
    refresh: false,
    first: true,
    videoList: [], // 视频列表数据
    pagecount: 0
})
 const item= ref();
item.value=route.query


</script>

<style scoped lang="less">
.search_page_container {
    --van-search-content-background: transparent;
    --van-search-action-text-color: #969798;
    --van-field-input-text-color: #c8c9cc;
    --van-search-action-padding: 0;

    .van-search {
        border: 1px solid #F0F0F0;

    }
}

.name {
    font-family: PingFang SC;
    font-size: 16px;
    font-weight: 600;
    line-height: 22px;
    text-align: center;

}

.history {
    padding: 0 12px;

    .navBox {
        display: flex;
        justify-content: space-between;
        align-items: center;


        .left {
            display: flex;
            align-items: center;

            .block {
                background-color: #FE2B54;
                border-radius: 3px;
                margin-right: 4px;
            }

            .text {
                font-family: PingFang SC;
                font-size: 13px;
                font-weight: 600;
                text-align: left;

            }
        }
    }

    .labelBox {
        display: flex;
        justify-content: flex-start;
        flex-wrap: wrap;
        margin: 5px 0 15px 0;

        .label {
            background-color: #FFE9E9;
            padding: 8px 10px;
            min-width: 58px;
            margin: 7px 10px 7px 0px;
            border-radius: 25px;
            font-family: PingFang SC;
            font-size: 13px;
            font-weight: 600;
            text-align: center;

        }

    }

}

// 热门 切换
.hotSearch {
    width: 375px;
    height: 40px;
    margin-top: 15px;


    .hotNav {
        display: flex;
        justify-content: center;
        align-items: flex-end;
        border-bottom: 1px #eee solid;

        .navName {
            display: flex;
            flex-direction: column;
            align-items: center;
            width: 100px;


            .name {
                font-family: PingFang SC;
                font-size: 14px;
                font-weight: 400;
                line-height: 22px;
                text-align: center;
                color: #333;
            }

            .chooseName {
                font-family: PingFang SC;
                font-size: 14px;
                font-weight: 600;
                line-height: 22px;
                text-align: center;
                color: #FE2B54;
            }

            .line {
                width: 20px;
                height: 3px;
                border-radius: 3px 0px 0px 0px;
                // background-color: #fff;
                margin-top: 5px;

            }

            .chooseLine {
                width: 20px;
                height: 3px;
                border-radius: 3px 0px 0px 0px;
                background-color: #FE2B54;
                margin-top: 5px;
            }
        }
    }
}

// 热门列表
.hotList {
    padding: 0 12px;

    // 热门标签
    .hotLabel {
        display: flex;
        justify-content: flex-start;
        flex-wrap: wrap;
        margin: 5px 0 15px 0;

        .label {
            background-color: #F7F7F7;
            padding: 8px 10px;
            min-width: 58px;
            margin: 7px 10px 7px 0px;
            border-radius: 25px;
            font-family: PingFang SC;
            font-size: 13px;
            font-weight: 600;
            text-align: center;

        }

    }

    // 热门搜索词
    .hotText {
        display: flex;
        padding: 12px 0;

        .leftBox,
        .rightBox {
            width: 50%;

            .label {
                display: flex;
                align-items: center;
                height: 22px;
                line-height: 22px;
                margin: 6px 0;

                .one {
                    background-color: #D9001A;
                }

                .two {
                    background-color: #FF4A20;
                }

                .three {
                    background-color: #FFA825;
                }

                .four {
                    background-color: #888888;
                }

                .num {
                    width: 16px;
                    height: 16px;
                    border-radius: 8px;
                    color: #fff;
                    text-align: center;
                    line-height: 16px;
                    font-family: PingFang SC;
                    font-size: 10px;
                    font-weight: 600;
                    margin-right: 12px;

                }

                .text {
                    font-family: PingFang SC;
                    font-size: 14px;
                    font-weight: 600;
                    line-height: 22px;
                    text-align: left;
                }
            }
        }
    }

}


.swipe-imgbox {
    height: 90px;
    width: 100%;
    background: no-repeat center center/100% 100%;
}

.custom-indicator {
    position: absolute;
    bottom: 15px;
    left: 50%;
    display: flex;
    transform: translate(-50%);
    border-radius: 5px;

    .item {
        width: 6px;
        height: 6px;
        background-color: #EDEDEF;
        border-radius: 5px;
        margin: 0 3px;
    }

    .active {
        background-color: #FE2B54;
    }
}
</style>