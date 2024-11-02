<!-- av搜索页 -->

<template>
    <div class="search_page_container bg-white h-page">
        <!-- 搜索框开始 -->
        <div class="flex items-center py-[10px] pl-[14px]  w-[100%] pr-[6px] justify-between sticky top-0 z-10">
            <img src="../../assets/images/search/return.svg" @click="changePage">
            <div class="name">意见反馈</div>
            <div class="h-[30PX]" @click="router.push({ name: 'myMessage', params: { type: 2 } })">反馈记录</div>
        </div>
        <!-- 搜索框结束 -->
        <!--热门搜索开始  -->
        <div class="hotSearch">
            <div class="hotNav">
                <div class="navName" @click="changeHot(1)">
                    <div class="name" :class="hotIndex == 1 ? 'chooseName' : 'name'">反馈问题</div>
                    <div class="line" :class="hotIndex ==1 ? 'chooseLine' : 'line'"></div>
                </div>
                <div class="navName" @click="changeHot(2)">
                    <div class="name" :class="hotIndex == 2 ? 'chooseName' : 'name'">提交意见</div>
                    <div class="line" :class="hotIndex == 2 ? 'chooseLine' : 'line'"></div>
                </div>
                <div class="navName" @click="changeHot(3)">
                    <div class="name" :class="hotIndex == 3 ? 'chooseName' : 'name'">寻求影片</div>
                    <div class="line" :class="hotIndex == 3 ? 'chooseLine' : 'line'"></div>
                </div>
            </div>

        </div>
        <div class="hotList">
            <div class="nameBox">
                <div class="txt" v-if="hotIndex == 1">问题说明</div>
                <div class="txt" v-if="hotIndex == 2">意见说明</div>
                <div class="txt" v-if="hotIndex == 3">影片信息</div>
                <div class="txt">{{ charCount }}<span style="color: #999999;">/{{ maxCharCount }}字</span></div>
            </div>
            <textarea class="textarea" @input="checkCharCount" v-model="inputValue"></textarea>
            <div class="nameBox">
                <div class="txt">联系方式</div>
            </div>
            <van-field type="Number" v-model="phoneNum" placeholder="请输入联系方式" :style="{ borderColor: '#F0F0F0', borderWidth: '2px' }"
                style="width:100%;height: 36px;background-color: #F6F6F6;border: 1px solid #F0F0F0;border-radius: 5px;line-height: 36px; padding: 0 5px;color: #000;" />


        </div>
        <div class="submitBtn">
            <div class="submit" @click="submitBtn">提交</div>
        </div>

        <!--热门搜索结束  -->

    </div>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'
import { useRoute, } from 'vue-router'
import router from '@/router'
import { add} from '@/service/baseApi'
import { showToast } from 'vant'
// 热门搜索切换
const hotIndex = ref(1)
const route = useRoute()
const changeHot = (index) => {
    hotIndex.value = index
}
const changePage = () => {
    router.go(-1)
}
const submitBtn = async () => {
    if(inputValue.value==''){
        showToast({
            message: "请填写反馈内容！"
        })
        return
    }
    if(phoneNum.value==''){
        showToast({
            message: "请填写联系方式！"
        })
        return
    }
   
    const listData = await add({
        type:hotIndex.value,
        content:inputValue.value,
        contact:phoneNum.value,

    })
    if (listData.code == 200) {
        showToast({
            message: "提交成功！"
        })
        phoneNum.value=''
        inputValue.value=''
        router.go(-1)
    }else{
        showToast({
            message: "请填写正确的提交信息！"
        })
    }
}
const maxCharCount = 500; // 设置最大字数
const inputValue = ref('');
const charCount = ref(0);

// 检查字数
const checkCharCount = () => {
    charCount.value = inputValue.value.length;
}
const phoneNum =ref()

watch(() => inputValue, (val, old) => {
    console.log(val)
    if (val.length > maxCharCount) {
        inputValue.value = val.slice(0, maxCharCount);
    }
    checkCharCount(); // 更新字数
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
    color:#000;
}
.name {
    font-family: PingFang SC;
    font-size: 16px;
    font-weight: 600;
    line-height: 22px;
    text-align: center;

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
                border-radius: 3px ;
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

    .textarea {
        width: 100%;
        height: 109px;
        border-radius: 5px;
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

    .nameBox {
        display: flex;
        justify-content: space-between;

        .txt {
            font-family: PingFang SC;
            font-size: 12px;
            font-weight: 400;
            line-height: 25px;

        }
    }

}

.submitBtn {
        width: 100%;
        height:70px;
        position: fixed;
        bottom: 0px;
        padding: 10px ;
    .submit {
        width: 100%;
        height: 44px;
        border-radius: 38px;
        background: var(--main-1, #F83E3C);
        font-family: PingFang SC;
        font-size: 14px;
        font-weight: 600;
        line-height: 44px;
        text-align: center;
        color: #F0F0F0;

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