<!-- 联系弹窗 -->
<template>
    <van-popup v-model:show="showBottom" class="!bg-white scrollbar !overflow-y-hidden text-[#2F2F42]" position="bottom"
        round :style="{ height: '60%' }" teleport="body" close-on-click-overlay>
        <div class="sticky top-0 left-0 right-0  py-[16px] px-[23px] flex justify-between title">
            <div class="w-[20px]"></div>
            <div>联系我们</div>
            <van-icon class="" name="close" color="#2F2F42" size="20" @click="showBottom = false" />
        </div>
        <div class="w-full h-[600px] overflow-y-auto scrollbar px-[23px] chooseList">
            <div class="lable" v-for="item,index in tgList" :key="index">
                <div class="text" v-if="item.use_type==1">
                    广告合作
                </div>
                <div class="text" v-if="item.use_type==2">
                    商务合作
                </div>
                <div class="text" v-if="item.use_type==3">
                    客服
                </div>
                <div class="content">
                    <img src="@/assets/images/mine/telegram.svg" />
                    <div class="tgNum">{{item.name}}</div>
                    <div class="copy" @click="copyUrl(item.name)">点击复制</div>
                </div>
            </div>



        </div>

    </van-popup>
</template>
<script setup>
import { computed, onMounted,reactive,ref } from "vue";
import { tgNum } from '@/service/baseApi'
import { copyString } from '@/utils'

const props = defineProps({
    cur_vip: {
        type: Object,
        default: () => ({})
    },
    modelValue: {
        type: Boolean,
        default: false
    },
})
const emits = defineEmits(['update:modelValue', 'payConfirm'])
 const tgList=reactive([])
const init = async () => {
    tgList.value=[]
    let params = {
    }
    const res = await tgNum(params)
    if (res.code == 200) {
        tgList.push(...res.result)

    }

}
const copyUrl = (url) => {
  copyString(url)
}
onMounted(() => {
    
    init()
})

const showBottom = computed({
    set(val) {
        emits("update:modelValue", val)
       
    },
    get() {
        return props.modelValue
        
    }
})




</script>
<style lang="less" scoped>
.title {
    font-family: PingFang SC;
    font-size: 16px;
    font-weight: 600;
    line-height: 22.4px;
    text-align: center;
    color: var(--c3, #333333);


}

.chooseList {
    padding: 10px 10px 20px 10px;

    .lable {
        .text {
            font-family: PingFang SC;
            font-size: 14px;
            font-weight: 400;
            line-height: 20px;
            text-align: center;
            color: var(--c9, #999999);
            margin: 10px 0;
        }

        .content {
            width: 351px;
            height: 60px;
            background: #F2F2FE;
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: space-around;

            .tgNum {
                font-family: PingFang SC;
                font-size: 20px;
                font-weight: 600;
                line-height: 28px;
                text-align: center;
                color: var(--c3, #333333);

            }

            .copy {
                font-family: PingFang SC;
                font-size: 14px;
                font-weight: 400;
                line-height: 19.6px;
                text-align: center;
                color: var(--c9, #999999);

            }

        }

    }
}
</style>