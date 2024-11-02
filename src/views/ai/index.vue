<template>
    <div class="ai-page relative h-[100vh] text-white overflow-hidden">
        <NavHeader class="h-[44px]" title="AI脱衣" bg="#fff" :callBack="() => $router.push({ name: 'mine' })">
            <template v-slot="left">
                <div @click="show = true">
                    <van-icon name="todo-list-o" class="pr-[5px]" color="#2F2F42" size="14px" />
                    <span class="text-[#2F2F42]">生成记录</span>
                </div>
            </template>
        </NavHeader>
        <div class="w-full h-full overflow-hidden pt-[9px]">
            <van-tabs class="h-full" type="card" background="#212121" title-inactive-color="#979797"
                title-active-color="#fff" shrink line-height="0" line-width="0" v-model:active="state.type" lazy-render
                swipeable @change="change">
                <van-tab v-for="item in aiTypeList" :key="item.value" line-height="0" line-width="0" :name="item.value"
                    :title="item.name">
                    <div class="py-[30px] px-[10px] w-full h-[calc(100vh-160px)] overflow-y-auto scrollbar">
                        <div>
                            <template v-if="state.type === 3 && item.value == 3">
                                <div class="flex justify-center">
                                    <van-uploader :upload-icon="updateIcon" v-model="fileList" multiple :max-size="2 * 1024"
                                        :max-count="1" deletable :before-read="beforeRead" />
                                </div>
                                <Tips class="ml-[11px] mt-[26px]" />
                                <div
                                    class="px-[20px] h-[150px] mt-[24px] border-[1px] border-[#868485] border-solid rounded-[6px] bg-[#fff]">

                                </div>
                            </template>
                            <template v-else>
                                <div class="text-[16px] mb-[12px]">选择模板</div>
                                <ScrollList :loading="temState.loading" :finished="temState.finished"
                                    :refresh="temState.refresh" :list="temState.temList" @onLoad="onLoad"
                                    @onRefresh="onRefresh">
                                    <div class="w-full grid gap-y-[8px] gap-x-[10px] grid-cols-2 pt-0 pb-[14px]">
                                        <div class="px-[5px] " @click="selectTemp(item)"
                                            v-for="item in temState.temList" :key="item.picName">
                                            <div class="relative">
                                                <img class="w-full rounded-[5px] border-solid border-[2px] border-[#F2F3F5]"
                                                    :class="{ '!border-[#FF3E84]': item.picCode == state.picCode }"
                                                    v-olazyload="getImgUrl({ ...item, fileType: 'awsS3' }, 'picName')"
                                                    alt="" srcset="">
                                                <svg-icon v-if="state.type === 3" @click.stop="previewVideo(item)" name="ai-play" color="#fff"
                                                    class="w-[40px] h-[40px] absolute top-[50%] left-[50%] translate-x-[-20px] translate-y-[-20px]"></svg-icon>
                                            </div>
                                            <div class="flex justify-between mt-[5px] text-[#979797]">
                                                <div class="flex justify-start items-center">
                                                    <van-icon v-if="item.picCode == state.picCode" name="checked"
                                                        size="12px" color="#FF3E84" />
                                                    <van-icon v-else name="circle" size="12px" color="#979797" />
                                                    <div class="pl-[5px]">选择模板</div>
                                                </div>
                                                <div>{{ item.count }}人使用</div>
                                            </div>
                                        </div>
                                    </div>
                                </ScrollList>
                            </template>
                        </div>
                    </div>
                </van-tab>
            </van-tabs>
            <div
                class="w-full h-[116px] bg-[#F2F3F5] absolute bottom-0 left-0 px-[20px] pt-[8px] pb-[27px] flex flex-col justify-between items-center">
                <div class="text-[14px]">可使用次数{{ aiCount }}</div>
                <van-button color="linear-gradient(90deg, #2D57CC 0%, #AC63FF 100%)" block
                    @click="generate">生成</van-button>
            </div>
        </div>
        <aiRecordListPop v-model="show" />
        <dplayerPop v-model="dplayerShow" :url="getVideoUrl(tempData)" />
        <generatePop v-model="generateShow" @updatePic="beforeRead" @createdAi="createdAi" :type="state.type"
            :data="tempData" />
    </div>
</template>
<script setup name="ai">
import { computed, ref, reactive } from "vue";
import { submitAi, picTempPageList, videoTempPageList } from "@/service/AIApi"
import { config } from '@/store/config'
import Tips from '@/views/ai/components/tips.vue'
import aiRecordListPop from '@/views/ai/components/aiRecordListPop.vue'
import dplayerPop from '@/views/ai/components/dplayerPop.vue'
import generatePop from '@/views/ai/components/generatePop.vue'
import updateIcon from '@/assets/images/ai/update-icon.png'
import { showToast,showDialog } from "vant";
import { $get, getImgUrl, randomCount,getVideoUrl } from "@/utils";
import { aiTypeList } from "@/data/aiShareData"
import { useRouter } from "vue-router";
const router =  useRouter()
const configStore = config()
/**
 * @description 用户信息
 */
const userId = computed(() => $get(configStore, 'deviceUser.userId', {}))

const state = reactive({
    type: 3,
    pic: "",
    videoCode: "",
    picCode: "",
})
const fileList = ref([])
const temState = reactive({
    page: 1,
    loading: false,
    finished: false,
    refresh: false,
    first: true,
    temList: [], // 视频列表数据
    total: 0
})
const aiCount = computed(() => {
    switch (state.type) {
        case 1:
            return $get(configStore, 'deviceUser.AiPicture', 0)

        case 2:
            return $get(configStore, 'deviceUser.AiFaceVideo', 0)

        default:
            return $get(configStore, 'deviceUser.AiFaceImg', 0)
    }
})
const beforeRead = (file, type) => {
    if (type !== 1) {
        fileList.value[0] = { url: window.URL.createObjectURL(file), file }
    }
    state.pic = file
}
const change = async (type) => {
    Object.assign(state, { pic: "", videoCode: "", picCode: "" })
    temState.page = 1
    temState.finished = false
    temState.first = true
    fileList.value = []
    tempData.value = {}
    if ([2, 1].includes(type)) {
        await getTemList()
    }
}
// 上拉加载
const onLoad = async () => {
    if (temState.first) return
    if (temState.temList.length >= state.total) {
        temState.finished = true
        return
    }
    temState.loading = true
    temState.page++
    await getTemList()
}
// 下拉刷新
const onRefresh = async () => {
    temState.refresh = true
    temState.page = 1
    temState.temList = []
    await getTemList()
}
const getTemList = async () => {
    let api = state.type == 1 ? picTempPageList : videoTempPageList
    let res = await api({ page: temState.page, pageSize: 20 })
    let { total = 0, list = [] } = res.result || {}
    list.forEach(item => {
        item.count = randomCount(10, 150)
    })
    if (temState.page == 1) {
        temState.temList = list
    } else {
        temState.temList.push(...list)
    }
    temState.total = total
    temState.refresh = false
    temState.first = false
    temState.loading = false
    temState.finished = total <= temState.temList.length
}
const createdAi = async () => {
    if (!state.pic) return showToast({
        type: "fail",
        message: "请先上传图片"
    })
    let params = {}
    if (state.type == 3) {
        params = {
            type: state.type,
            pic: state.pic,
        }
    } else if (state.type == 2) {
        params = {
            type: state.type,
            pic: state.pic,
            videoCode: state.videoCode
        }
    } else {
        params = {
            type: state.type,
            pic: state.pic,
            picCode: state.picCode
        }
    }
    let res = await submitAi(params)
    if (res.code == 200) {
        showToast({
            type: "success",
            message: "提交成功，请耐心等待！"
        })
    }
}




const show = ref(false)
const dplayerShow = ref(false)
const tempData = ref({})
const selectTemp=(item)=>{
    tempData.value = item
    if(state.type == 1){
        state.picCode = item.picCode
    }else{
        state.videoCode = item.videoCode
    }
}
const previewVideo = (item) => {
    videoUrl.value = item.videoUrl
    dplayerShow.value = true
}
const generateShow = ref(false)
const generate = () => {
    if(aiCount.value === 0){
        showDialog({
        title: '提示',
        message: '没有可生成的次数,请充值',
        className:'aiTip'
        }).then(() => {
            router.push({name:"aiRecharge",query:{type:state.type}})
        });
        return 
    }
    if (state.type === 3) return createdAi()
    if (state.type == 1 && !state.picCode) return showToast({
        type: "fail",
        message: "请先选择图片模板"
    })
    if (state.type == 2 && !state.videoCode) return showToast({
        type: "fail",
        message: "请先选择视频模板"
    })
    generateShow.value = true
}
</script>
<style lang="less" scoped>
:deep(.van-uploader) {
    --van-uploader-size: 90px;

    .van-uploader__upload {
        border-radius: 6px;
        border: 1px solid #868485;
        background-color: #fff;
    }
}

:deep(.van-tabs--card) {
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

        .van-tab__text {
            font-size: 14px;
        }
    }

    .van-tabs__wrap {
        display: flex;
        justify-content: center;
    }

}
</style>
<style lang="less">
.aiTip{
    --van-dialog-background:#fff;
    --van-text-color:#fff;
    --van-dialog-has-title-message-text-color:#fff;
    .van-dialog__confirm{
        --van-button-default-background:#212121;
        --van-dialog-confirm-button-text-color:#fff;
    }
}
</style>