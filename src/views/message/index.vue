<!-- 我的消息 -->
<template>
    <div class="h-full">
        <NavHeader :title="pageInfo.title" ></NavHeader>
        <div style="margin-top: 20px;">
            <list :type="pageInfo.type" ></list>
                
                    
                <!-- </template> -->
        </div>
    </div>
</template>
<script setup name="myMessage">
import { useRoute } from 'vue-router'
import { onMounted, ref, reactive,computed } from 'vue';
import list from "@/views/message/components/list.vue";
import Welfare from '@/views/welfare/welfare.vue'
import { getvideoRecordList, favoriteVideo } from "@/service/community";
import { showToast } from 'vant'
import { $get, getImgUrl, inject_ad_home_swper } from '@/utils'
import { config } from '@/store/config'
const configStore = config()
const xlHomeVideoInsertion = computed(() => $get(configStore, 'templateData.xlHomeVideoInsertion.adList', []))
const computedVideoList = computed(() =>inject_ad_home_swper(state.list, xlHomeVideoInsertion.value))
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
                title: "反馈记录",
                type: 2
            }
            break;
        case '1':
            info = {
                title: "我的消息",
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