<!-- av搜索页 -->

<template>
    <div class="search_page_container bg-white" >
        <!-- 搜索框开始 -->
        <div class="flex items-center py-[10px] pl-[14px]  w-[100%] pr-[6px] justify-between sticky top-0 z-10 " style="background: #fff;">
            <img src="../../assets/images/search/return.svg" @click="changePage">
            <van-search v-model="searchTxt" show-action autofocus class=" rounded-[4px] h-[34px] w-[80%]"
                style="border-radius:60px;background-color: #F6F6F6;color: #000;" placeholder="请输入搜索关键词" @search="onSearch"
                @focus="showHot = true" background="#fff">
                <template #action>
                    <div class="w-[68px] h-[34PX]"
                        style="background-color: #F83E3C;color: #fff;border-radius: 62px;text-align: center;padding: 0;"
                        @click="onSearch(searchTxt)">搜索</div>
                </template>
            </van-search>
            <div class="w-[30px] h-[30PX]" @click="goBackSearch()"
                style="background-color: #F1F1F1;border-radius: 50%;display: flex;justify-content: center;align-items: center;">
                <img src="../../assets/images/search/clean.svg" />
            </div>

            <!-- <span class="ml-[8px] text-[#EC366E] text-[14px]" @click="changePage">取消</span> -->
        </div>
        <!-- 搜索框结束 -->
         <HotList  v-if="isResultPage == false"></HotList>
        <!-- 最近搜索开始 -->
         <div v-if="false">
            <div class="history" v-if="configStore.searchList.length > 0">
            <!-- 搜索历史 -->
            <div class="navBox w-[100%]">
                <div class="left">
                    <div class="w-[3px] h-[14PX] block"></div>
                    <div class="text">搜索历史</div>
                </div>
                <!-- 删除 -->
                <img src="../../assets/images/search/delete.svg" @click="deLete" />
            </div>
            <!-- 标签盒子 -->
            <div class="labelBox">
                <div class="label" v-for="item in configStore.searchList"  @click="onSearch(item)" >{{ item }}</div>
                
            </div>

        </div>

         </div>
        
        <!-- 最近搜索结束 -->
        <!-- 轮播图开始 -->
        <swiper v-if="false"></swiper>
        <!-- 轮播图结束 -->
        <!--热门搜索开始  -->
        <div class="hotSearch" v-if="false">
            <div class="hotNav">
                <div class="navName" @click="changeHot(1)">
                    <div class="name" :class="hotIndex == 1 ? 'chooseName' : 'name'">热门搜索词</div>
                    <div class="line" :class="hotIndex == 1 ? 'chooseLine' : 'line'"></div>
                </div>
                <div class="navName" @click="changeHot(0)">
                    <div class="name" :class="hotIndex == 0 ? 'chooseName' : 'name'">热门标签</div>
                    <div class="line" :class="hotIndex == 0 ? 'chooseLine' : 'line'"></div>
                </div>
            </div>
            <div class="hotList" >
                <!-- 热门标签 -->
                <div class="hotLabel" v-if="hotIndex == 0">
                    <div class="label" v-for="item,index in hotList" :key="index" @click="goVideoList(item)">{{item.type_name}}</div>
                </div>
                <!-- 热门搜索词 -->
                <div class="hotText" v-if="hotIndex == 1">
                    <div class="leftBox">
                        <div class="label"  v-for="item,index in nearSearchLeft" :key="index"  @click="onSearch(item)">
                            <div class="one num" v-if="index==0">1</div>
                            <div class="two num" v-if="index==1">2</div>
                            <div class="three num" v-if="index==2">3</div>
                            <div class="four num" v-if="index > 2">{{index+1}}</div>
                            <div class="text" >{{ item }}</div>
                        </div>
                    </div>
                    <div class="rightBox">
                        <div class="label" v-for="item,index in nearSearchright" :key="index" >
                            <div class="four num"  >{{index+9}}</div>
                            <div class="text"  >{{item}}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!--热门搜索结束  -->

        <!-- <div class="sticky top-[54px] z-10" @click="showHot = false">
            <HotSearch v-show="showHot" @search="onSearch" class="absolute top-0 left-0 w-full z-10"></HotSearch>
        </div> -->
        <!-- <SwipeAd :list="xlAVBanner" /> -->
        <!-- 搜索结结果页 -->
        <template v-if="isResultPage == true" >
        <ScrollList  :loading="listObj.isloading" :finished="listObj.isfinished" :refresh="listObj.isRefreshing"
          :list="listObj.listData" @onLoad="onLoad" @onRefresh="onRefresh">
          <div class="grid gap-y-[8px] gap-x-[10px] grid-cols-2 pt-0 pb-[14px] px-[10px]" style="margin-top:10px;">
            <DetailItem v-for="(item, i) in listObj.listData" :item="item" :key="item.vodId" class="ppp" ></DetailItem>
          </div>
        </ScrollList>
      </template>
        <!-- <Welfare  v-if="!isResultPage" /> -->
    </div>
</template>

<script setup>
import { ref, computed, reactive, onMounted, watch } from 'vue'
import { config } from '@/store/config'
import { reqsearchKeyWords, getAdultList } from '@/service/community'
import { showLoadingToast, closeToast } from 'vant';
import Welfare from '@/views/welfare/welfare.vue'
import { $get,inject_video } from '@/utils'
import router from '@/router'
import { getHotLable } from '@/service/baseApi'
import HotList from '@/views/hot/hot.vue'
import { showToast } from 'vant'
const xlHomeTextList = computed(() => $get(configStore, 'templateData.xlHomeTextList.adList', []))

const nearSearchLeft = ref([])
const nearSearchright = ref([])
const nearSearchList = computed(() => inject_video(nearSearch.value, xlHomeTextList.value, 3).slice(0, 24))
const get_keyword = async () => {
    let res = await reqsearchKeyWords()
    nearSearchLeft.value=res.result.slice(0, 8)
    nearSearchright.value=res.result.slice(9, 17)
    console.log(nearSearchright.value,'+++++++++++++')
}
const configStore = config()
const searchTxt = ref('')
const isResultPage = ref(false)
const historySearch = ref([])
const avtiveTab = ref(1)
const showHot = ref(false)
/**
 * @description 轮播图
 */
const swipeRef = ref()
const changeTab = (index) => {
    swipeRef.value?.swipeTo(index)
}
const xlAVBanner = computed(() => $get(configStore, 'templateData.xlAVBanner.adList', []))
const searchHistor=reactive([])
const onSearch = (val) => {

    if(searchTxt.value==''){
            showToast({
            message: "请输入搜索内容"
        })
        return
        }
    searchTxt.value=val
    configStore.searchList.unshift(searchTxt.value)
    if ( configStore.searchList.length > 12) {
        // 截断数组，只保留前 12 个元素
        configStore.searchList =  configStore.searchList.slice(0, 12);
    }
    isResultPage.value = true
    Object.assign(listObj, initListObj())
    showHot.value = false
    if (typeof val === 'string') {
        searchTxt.value = val
    }
    loadList()
}
const goVideoList=(item)=>{
    router.push({ name: 'welfare', query:{...item}});
}
// 删除最近搜索
const deLete = () => {
    configStore.searchList=[]
}
// 热门标签接口
const hotList = reactive([])
const gethotLableList = async () => {
    hotList.splice(0)
    const listData = await getHotLable({
        pageSize: 12
    })
    hotList.push(...listData.result)
}
// 热门搜索切换
const hotIndex = ref(1)
const changeHot = (index) => {
    hotIndex.value = index
    if(hotIndex.value==0){
        gethotLableList()
    }else{
        get_keyword()
    }
}
const goBackSearch=()=>{
    isResultPage.value=false
    searchTxt.value=''
}
const initListObj = () => ({
    listData: [],
    pageNum: 1,
    pageSize: 20,
    pageAount: 0,
    isRefreshing: false,
    isloading: false,
    isfinished: false
})
// 列表数据对象
const listObj = reactive(initListObj())

/**
 * 加载搜索数据
 */
const loadList = async () => {
    if (!searchTxt.value) return
    try {
       
        listObj.isloading = true
        setHistoryRecords(searchTxt.value)
        let res = {}
        let params = { vodName: searchTxt.value, page: listObj.pageNum, pageSize: 10 }
        res = await getAdultList(params)
        isResultPage.value = true
        if (res?.result?.list?.length) {
            if (avtiveTab.value != 1) {
                res.result.list.forEach(item => {
                    item.commit = Math.floor(Math.random() * 500) + 1
                })
            }
            listObj.listData.push(...res.result.list)

        }
        listObj.isfirst = false
        listObj.pageAount = res.result.total
        listObj.isfinished = res.result.total <= listObj.listData.length
    } catch (error) {
        console.error(error)
    }
    listObj.isloading = false
    listObj.isRefreshing = false
}

/**
 * 下拉刷新
 */
const onRefresh = async () => {
    if (listObj.isloading) return
    Object.assign(listObj, initListObj())
    listObj.isRefreshing = true
    loadList()
}

/**
 * 上拉加载更多
 */
const onLoad = async () => {
    if (listObj.isfirst) return
    if (listObj.listData.length >= listObj.pageAount) {
        listObj.isfinished = true
        return
    }
    listObj.pageNum++
    loadList()
}

const changePage = () => {
    router.push({ name: 'home' });
    if (isResultPage.value) {
        searchTxt.value = ''
        isResultPage.value = false
        historySearch.value = getHistoryRecords()
        showHot.value = false
        return
    }
   
}
const clearHistory = () => {
    localStorage.searchItems = ''
    historySearch.value = []
}
/**
 * 从缓存中获取搜索数据
 */
const getHistoryRecords = () => {
    const it = localStorage.searchItems
    return it ? [...new Set(JSON.parse(it))].slice(-15) : []
}
/**
 * 存储搜索数据到浏览器
 * @param {string} txt 
 */
const setHistoryRecords = (txt) => {
    if (typeof txt === 'string' && txt) {
        let it = getHistoryRecords()
        localStorage.searchItems = JSON.stringify(it.concat(txt))
    }
}


watch(() => listObj.isloading, (nv) => {
    if (nv) {
        showLoadingToast({
            duration: 0,
            forbidClick: true,
            message: '加载中...',
        });
    } else {
        closeToast()
    }
})

watch(avtiveTab, () => {
    Object.assign(listObj, initListObj())
    loadList()
})

onMounted(async () => {
    gethotLableList()
})

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
:deep(.van-field__control){
    color: #000;
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
                border-radius: 3px;
                // background-color: #fff;
                margin-top: 5px;

            }

            .chooseLine {
                width: 20px;
                height: 3px;
                border-radius: 3px;
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
        .leftBox ,.rightBox{
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
                .four{
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