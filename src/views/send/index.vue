<!-- av搜索页 -->

<template>
    <div class="search_page_container bg-white h-page overflow-y-auto scrollbar">
        <!-- 导航栏开始 -->
        <div class="flex items-center py-[10px] pl-[14px]  w-[100%] pr-[6px] justify-between sticky top-0 z-10">
            <img src="../../assets/images/search/return.svg" @click="changePage">
            <div class="name">发帖</div>
            <div class="w-[30px] h-[30PX]"></div>
        </div>
        <!-- 导航栏结束 -->

        <!-- 内容开始 -->
        <div class="content">
            <div class="send">
                发布到
                <div class="chooseBox" @click="chooseBtn(0)" :class="chooseIndex == 0 ? 'chooseTxt' : 'noChoose'">
                    <img src="../../assets/images/send/noChoose.svg" v-if="chooseIndex == 1" />
                    <img src="../../assets/images/send/choose.svg" v-else />
                    茶馆
                </div>
                <div class="chooseBox" @click="chooseBtn(1)" :class="chooseIndex == 1 ? 'chooseTxt' : 'noChoose'">
                    <img src="../../assets/images/send/noChoose.svg" v-if="chooseIndex == 0" />
                    <img src="../../assets/images/send/choose.svg" v-else />
                    同城
                </div>

            </div>
            <textarea class="textarea" v-model="text"></textarea>
            <!-- <div v-if="chooseIndex == 1" class="addBtn"> -->
            <van-uploader v-model="fileList" multiple :max-size="2 * 1024" :max-count="9" deletable  v-if="chooseIndex == 1"
                :before-read="beforeRead" class="addBtn"><img src="../../assets/images/send/picture.svg">添加图片
            </van-uploader>
            <!-- </div> -->
            <div class="addXz" v-if="chooseIndex == 1"> 只能添加9张图片</div>
            <div class="imgBox" v-if="chooseIndex == 1">
                <div class="img" v-for="(item,index) in imgList">
                    <img class="cover" :src="item" />
                    <img class="del" src="../../assets/images/send/imgDel.svg"  @click="deleteImg(index)" />
                </div>

            </div>
            <div class="sendBox">
                <div class="sendBtn" @click="sendBtn">
                    发帖
                </div>

            </div>
        </div>


    </div>
</template>

<script setup name="send">
import { ref, reactive, onMounted, nextTick, computed, watch, onBeforeUnmount, shallowRef } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getVideoDetail } from '@/service/video'
import { getRecommendedList } from '@/service/community'
import { sendRelease, upLoadImg } from '@/service/baseApi'
import { showToast } from 'vant'
import { config } from '@/store/config'
import router from '@/router'
import http from '@/utils/axios'
const configStore = config()
const deviceUser = computed(() => $get(configStore, 'deviceUser', {}))
const baseURL = http.defaults.baseURL; // 获取 baseURL
const route = useRoute();
const text = ref('')
const videoList = '[]';
const fileList = ref([])
const imgList = reactive([]);
const imgBox= reactive([]);
// 发送按钮
const sendBtn = async () => {
    if(text.value==''){
        showToast({
            message: "请输入发送内容"
        })
        return
    }
    const listData = await sendRelease({
        title: text.value,
        type: typeIndex.value,
        vodio_src: videoList,
        img_src: JSON.stringify(imgBox),
    })
    if (listData.code == 200) {
        showToast({
            message: "发送成功!"
        })
        const userId = '123';
        // 存储userId
        sessionStorage.setItem('userId', userId);
        changePage()
        

    } else {
        showToast({
            message: "发送失败!"
        })
    }
}
// 删除图片
const deleteImg=(index)=>{
    imgList.splice(index, 1);
    imgBox.splice(index,1)
}
const fileVal = ref()
// 添加图片
const beforeRead = (file, type) => {
    if (file.length > 0) {
        file.forEach(element => {
            // fileVal.value = element
             upload(element)
        });
    }else{
        upload(file)
    }
    
    
}
async function fetchData() {
  let data = await upload()
  return data; 
}
// 上传图片
const upload = async (file) => {
console.log(file,'--------file----------')
    const listData = await upLoadImg({
        file: file
    })
    if (listData.code == 200) {
        // let url = baseURL + listData.result.path

         imgList.push(window.URL.createObjectURL(file))
         imgBox.push(listData.result.path)
    }else{
        showToast({
            type: "fail",
            message: "发送失败"
        })
    }
}

const typeIndex = ref(4)

// 发布切换
const chooseIndex = ref(0)
const chooseBtn = (index) => {
    text.value=''
    imgList.value=[]
    imgBox.value=[]
    chooseIndex.value = index
    console.log(chooseIndex.value,index,'index')
    if (index==0) {
       console.log("茶馆")
        typeIndex.value = 4
    } else {
        console.log("同城")
        typeIndex.value = 3
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
const item = ref();
item.value = route.query

onMounted(() => {
    // 设置 itemId

    // itemId= route.query;
    console.log(route.query, '88888888')
});


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

    .name {
        font-family: PingFang SC;
        font-size: 16px;
        font-weight: 600;
        line-height: 22px;
        text-align: center;

    }

    .content {
        padding: 10px;

        .send {
            margin: 0 5px;
            font-family: PingFang SC;
            font-size: 12px;
            font-weight: 400;
            line-height: 16.8px;
            text-align: left;
            color: #666666;
            display: flex;
        }

        .chooseBox {
            display: flex;

            img {
                margin: 0 3px;
            }


        }

        .chooseTxt {
            font-family: PingFang SC;
            font-size: 12px;
            font-weight: 600;
            line-height: 16.8px;
            text-align: left;
            color: #000000;

        }

        .noChoose {
            font-size: 12px;
            font-weight: 400;
            line-height: 16.8px;
            text-align: left;
            color: #666666;
        }

        .textarea {
            margin-top: 10px;
            width: 100%;
            height: 200px;
            border-radius: 10px;
            border: 1px solid #F0F0F0;
            background: #F6F6F6;
            font-family: PingFang SC;
            font-size: 14px;
            font-weight: 400;
            line-height: 28px;
            text-align: left;
            color: #333;
            padding: 10px;
        }

        :deep(.van-uploader__wrapper) {
            margin-top: 10px;
            width: 100%;
            height: 40px;
            background: #58328D;
            border-radius: 20px;
            color: #FFFFFF;
            line-height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;

        }

        :deep(.van-image) {
            display: none;
        }

        :deep(.van-uploader__preview) {
            display: none;
        }

        :deep(.van-uploader__input-wrapper) {
            width: 100%;
            border-radius: 20px;
            color: #FFFFFF;
            line-height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;


        }

        .addBtn {
            margin-top: 10px;
            width: 100%;
            height: 40px;
            background: #58328D;
            border-radius: 20px;
            color: #FFFFFF;
            line-height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;

            :deep(.van-uploader__wrapper) {
                margin-top: 10px;
                width: 100%;
                height: 40px;
                background: #58328D;
                border-radius: 20px;
                color: #FFFFFF;
                line-height: 40px;
                display: flex;
                align-items: center;
                justify-content: center;

            }

            :deep(.van-uploader__input-wrapper .uploader__input) {
                width: 100%;
                border-radius: 20px;
                color: #FFFFFF;
                line-height: 40px;
                display: flex;
                align-items: center;
                justify-content: center;


            }

        }

        .addXz {
            font-family: PingFang SC;
            font-size: 12px;
            font-weight: 400;
            line-height: 30px;
            text-align: center;
            color: #999999;

        }

        .imgBox {
            display: flex;
            justify-content: flex-start;
            flex-wrap: wrap;


            .img {
                width: 106px;
                height: 106px;
                border-radius: 5px;
                position: relative;
                margin: 6px;

                .cover {
                    width: 100%;
                    height: 100%;
                }

                .del {
                    position: absolute;
                    right: -10px;
                    top: -10px;
                }
            }
        }

        .sendBox {
            width: 100%;
            // height: 50px;
            background-color: #fff;
            border: 1px solid #fff;
            position: fixed;
            bottom: 0px;
            left: 0;
            padding: 10px;

            .sendBtn {
                margin-bottom: 10px;
                width: 100%;
                height: 40px;
                background: #F83E3C;
                border-radius: 20px;
                color: #FFFFFF;
                line-height: 40px;
                text-align: center;

            }

        }



    }
}
</style>