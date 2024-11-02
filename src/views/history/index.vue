<template>
    <div class="h-full">
        <NavHeader :title="pageInfo.title"></NavHeader>
        <div style="margin-top: 20px;">
            <!--热门搜索开始  -->
            <div class="hotSearch" v-if="pageInfo.type == 1">
                <div class="hotNav">
                    <div class="navName" @click="changeHot(0)">
                        <div class="name" :class="hotIndex == 0 ? 'chooseName' : 'name'">影片</div>
                        <div class="line" :class="hotIndex == 0 ? 'chooseLine' : 'line'"></div>
                    </div>
                    <div class="navName" @click="changeHot(1)">
                        <div class="name" :class="hotIndex == 1 ? 'chooseName' : 'name'">演员</div>
                        <div class="line" :class="hotIndex == 1 ? 'chooseLine' : 'line'"></div>
                    </div>
                    <div class="navName" @click="changeHot(2)">
                        <div class="name" :class="hotIndex == 2 ? 'chooseName' : 'name'">博主</div>
                        <div class="line" :class="hotIndex == 2 ? 'chooseLine' : 'line'"></div>
                    </div>
                </div>
            </div>
            <filmItem :type="pageInfo.type" v-if="hotIndex == 0"></filmItem>
            <div class="actor" v-if="hotIndex == 2">
                <div class="actorBox" v-for="item,index in actorList" :key="index">
                    <img class="w-[49px]" :src="item.img_src" alt="">
                    <div class="actorTitle">{{item.username}}</div>
                </div>
            </div>

            <div class="flex justify-center flex-col items-center relative h-[80vh]">
                <template v-if="pageInfo.type == 2">
                    <img src="@/assets/images/empty/history-empty.png" class="w-[240px] mb-[18px]" alt="" srcset="">
                </template>
                <template v-else>
                    <img src="@/assets/images/empty/history-empty.png" class="w-[240px] mb-[18px]" alt="" srcset="" v-if="actorList.length == 0">
                </template>
            </div>
            <!-- </template> -->
        </div>
    </div>
</template>
<script setup name="history">
import { useRoute } from 'vue-router'
import { onMounted, ref, reactive, computed } from 'vue';
import filmItem from "@/views/history/components/filmItem.vue";
import Welfare from '@/views/welfare/welfare.vue'
import { getvideoRecordList, favoriteVideo } from "@/service/community";
import { showToast } from 'vant'
import { $get, getImgUrl, inject_ad_home_swper } from '@/utils'
import { config } from '@/store/config'
import { focusList} from '@/service/baseApi'
import { fetchImage } from '@/utils/imageUtils'; // 导入封装的函数
const configStore = config()
const xlHomeVideoInsertion = computed(() => $get(configStore, 'templateData.xlHomeVideoInsertion.adList', []))
const computedVideoList = computed(() => inject_ad_home_swper(state.list, xlHomeVideoInsertion.value))
const route = useRoute()
const pageInfo = ref({
    title: "",
    left_title: "",
    type: 2
})
const state = reactive({
    loading: false,
    finished: true,
    refresh: false,
    first: true,
    pageNum: 1,
    total: 0,
    list: []
})
const actorList=ref([])
// 热门搜索切换
const hotIndex = ref(0)
const changeHot = (index) => {
    hotIndex.value = index
    actorList.value=[]
    if(hotIndex.value==2){
        getActor()
    }
}

const getActor = async () => {
    const listData = await focusList({})
    if (listData.code == 200) {
        listData.result.list.forEach(item => {
            fetchImage(item.img_src).then((val) => {
                
                item.img_src=val
                actorList.value.push(item)
        });
        });
    }
}
const onLoad = async () => {
    if (state.first) return
    if (state.list.length >= state.total) {
        state.finished = true
        return
    }
    state.loading = true
    state.pageNum++
    init()
}
const onRefresh = async () => {
    state.refresh = true
    state.pageNum = 1
    state.list = []
    await init()
}
const init = async () => {
    state.loading = true
    const res = await getvideoRecordList({
        page: state.pageNum,
        pageSize: 20,
        type: pageInfo.value.type
    })
    console.log(res.result)
    let { list, total } = res.result

    setData(list, total)
}
const setData = (list, total) => {
    if (state.pageNum == 1) {
        state.list = list || []
    } else {
        state.list.push(...list)
    }
    console.log(state.list)
    state.total = total
    state.refresh = false
    state.first = false
    state.loading = false
    state.finished = total <= state.list.length
}
const deleteItem = async (vodId, i) => {
    let res = await favoriteVideo({ vodId, type: pageInfo.value.type })
    if (res.code == 200) {
        showToast({
            type: "succrss",
            message: "操作成功"
        })
        state.list.splice(i, 1)
    }

}

onMounted(() => {
    let info = {}
    switch (route.params.type) {
        case '2':
            info = {
                title: "观影记录",
                type: 2
            }
            break;
        case '1':
            info = {
                title: "我的收藏",
                type: 1
            }
            break;

        default:
            break;
    }
    pageInfo.value = info
    init()
})
</script>
<style scoped lang="less">
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

.actor {
    display: flex;
    flex-wrap: wrap;

    .actorBox {
        width: 25%;
        display: flex;
        flex-direction: column;
        align-items: center;

        img {
            width: 70px;
            height: 70px;
            border-radius: 35px;
        }

        .actorTitle {
            font-family: PingFang SC;
            font-size: 14px;
            font-weight: 400;
            line-height: 20px;

        }
    }
}
</style>