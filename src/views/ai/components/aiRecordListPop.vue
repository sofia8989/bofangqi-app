<template>
    <van-popup position="right" teleport="body" class="h-full w-full !overflow-hidden !bg-white"
        v-model:show="showBottom">
        <NavHeader title="生成记录" :callBack="close"></NavHeader>
        <div class="text-[#2F2F42]">
            <van-tabs type="card" background="#fff" title-inactive-color="#2F2F42" title-active-color="#fff" shrink
                v-model:active="state.type" line-height="0" line-width="0" lazy-render swipeable @change="onRefresh">
                <van-tab v-for="item in aiTypeList" :key="item.value" :name="item.value" :title="item.name">
                    <div class="w-full h-[38px] mt-[12px] flex justify-center items-center">
                        <div class="pl-[24px] text-[16px] font-normal" @click="changeStatus(j.value)"
                            :class="{ 'text-[#AC63FF] font-semibold': state.status == j.value }" v-for="j in statusList"
                            :key="j.value">{{ j.name }}</div>
                    </div>
                    <ScrollList :loading="recordState.loading" :finished="recordState.finished"
                        :refresh="recordState.refresh" :list="recordState.list" @onLoad="onLoad" @onRefresh="onRefresh">
                        <div class="w-full mb-[10px] px-[10px]">
                            <template v-if="[1, 3].includes(state.type)">
                                <div class="h-[94px] w-full rounded-[6px] flex justify-between p-[10px] bg-[#2b2b2b] mb-[8px]"
                                    v-for="(r, i) in recordState.list" :key="i">
                                    <img class="max-h-[74px] w-[104px]" v-olazyload="`data:image/png;base64,` + r.contents"
                                        alt="" srcset="">
                                    <div class="text-center">
                                        <div class="mb-[24px]" :style="`color:${getStatusName(r.status).color};`">{{
                                            getStatusName(r.status).name || '未知' }}</div>
                                        <div class="w-[110px]">
                                            <van-button v-if="[2].includes(r.status)" class="!h-[30px]"
                                                color="linear-gradient(90deg, #2D57CC 0%, #AC63FF 100%)" block
                                                @click="downloadFile(`data:image/png;base64,` + r.contents, r.code)">点击下载</van-button>
                                            <van-button v-if="[3].includes(r.status)" class="!h-[30px]"
                                                color="linear-gradient(90deg, #2D57CC 0%, #AC63FF 100%)" block
                                                @click="close">重新生成</van-button>
                                        </div>
                                    </div>
                                </div>
                            </template>
                            <template v-else>
                                22222
                            </template>
                        </div>
                        <template v-slot:empty>
                            <div class="flex justify-center flex-col items-center relative h-[80vh]">
                                <img src="@/assets/images/empty/empty.png" class="w-[40px] mb-[18px]" alt="" srcset="">
                                <div>当前无记录</div>
                            </div>
                        </template>
                    </ScrollList>
                </van-tab>
            </van-tabs>
        </div>

    </van-popup>
</template>
<script setup name="aiRecordListPop">
import { computed, ref, watch, reactive } from "vue";
import { config } from '@/store/config'
import { aiRecordList } from "@/service/AIApi"
import { showToast } from "vant";
import { downloadFile } from "@/utils";
import { aiTypeList } from "@/data/aiShareData"
const configStore = config()
const props = defineProps({
    modelValue: Boolean,
});
const emits = defineEmits(['update:modelValue']);
const showBottom = computed({
    get() {
        return props.modelValue || false;
    },
    set() {
        close();
    },
});
const close = () => {
    emits("update:modelValue", false)
}
const state = reactive({
    type: 3,
    status: 2,
    page: 1,
    pageSize: 20
})
const statusList = reactive([
    {
        name: "生成成功",
        value: 2,
        color: "#1AAC19"
    },
    {
        name: "生成失败",
        value: 3,
        color: "#FF3B30"
    },
    {
        name: "处理中",
        value: 1,
        color: "#FF7A19"
    },
])
const changeStatus = (status) => {
    if (state.status !== status) {
        state.status = status
        onRefresh()
    }
}
const getStatusName = (status) => (statusList.find(item => item.value == status) || {})
const recordState = reactive({
    loading: false,
    finished: false,
    refresh: false,
    first: true,
    list: [], // 视频列表数据
    total: 0
})
// 上拉加载
const onLoad = async () => {
    if (recordState.first) return
    if (recordState.list.length >= state.total) {
        recordState.finished = true
        return
    }
    recordState.loading = true
    recordState.page++
    get_aiRecordList()
}
// 下拉刷新
const onRefresh = async () => {
    recordState.refresh = true
    recordState.page = 1
    recordState.list = []
    recordState.first = true
    await get_aiRecordList()
}
const get_aiRecordList = async () => {
    let res = await aiRecordList(state)
    let { total = 0, list = [] } = res.result || {}
    if (state.page == 1) {
        recordState.list = list
    } else {
        recordState.list.push(...list)
    }
    recordState.total = total
    recordState.refresh = false
    recordState.first = false
    recordState.loading = false
    recordState.finished = total <= recordState.list.length
}
watch(() => props.modelValue, (val) => {
    if (val) {
        onRefresh()
    }
})
</script>
<style lang="less" scoped>
:deep(&.van-tabs--card) {
    --van-tabs-default-color: transparent;
    --van-tabs-card-height: 38px;

    .van-tabs__nav {
        background-color: #fff !important;
        border-radius: 20px;
        padding: 2px;

        .van-tab--active {
            border-radius: 20px;
            background: linear-gradient(90deg, #2D57CC 0%, #AC63FF 100%);
        }
    }

    .van-tabs__wrap {
        display: flex;
        justify-content: center;
    }

}
</style>