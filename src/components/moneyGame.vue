<template>
    <div class="moneyGame">
        <div class="recommendBox">
            <img src="@/assets/images/nav/moneyGame.png" />
            <div class="hotTitle">赚钱游戏</div>
            <div class="hotEnglish">Casino Games</div>
        </div>
        <div class="grid grid-cols-2 mt-[5px] gap-y-[2px]" style="width:100%; padding: 0 5px;justify-items: center;">
            <div class="flex  mb-[5px] list" v-for="item,i in list" :key="i" @click="$clickAd(item)">
                <img class="leftImg" :style="list[i].imageUrl=='/assets/default.png' ?'object-fit: cover;':' '"  :src="list[i].imageUrl" @error="onImageError(i)"/>
                <div class="contentBox">
                    <div class="title">{{item.adName}}</div>
                    <div class="txt">{{item.introduce}}</div>
                </div>
                <img class="rightImg" src="@/assets/images/nav/right.png" />
            </div>
        </div>

    </div>

</template>
<script setup name="moneyGame">
import { onMounted, ref, computed, watch } from 'vue'
import { $clickAd, getImgUrl } from '@/utils';
import { getmoneyGame } from '@/service/community'
import { fetchImage } from '@/utils/imageUtils'; // 导入封装的函数
const list=ref([])
// 轮播图接口
const init = async () => {
    const listData = await getmoneyGame()
    list.value=listData.result
    listData.result.forEach((item,index)=>{
     fetchImage(item.imageUrl).then((val) => {
        list.value[index].imageUrl=val
        item.imageUrl
        });
     })
     
     
}
init()
const onImageError=(i)=> {
    list.value[i].imageUrl= '/assets/default.png'
    }


</script>
<style lang="less" scoped>
.moneyGame {
    width: 100%;
    background: #F9F8FC;
   

    .recommendBox {
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

    .list {
        width: 172px;
        height: 60px;
        border-radius: 10px;
        background: #FFFFFF;
        justify-content: space-between;

        .leftImg {
            width: 60px;
            height: 60px;
            border-radius: 10px;
            margin-right: 9px;
        }

        .contentBox {
            width: 84px;
            height: 42px;
            margin-top: 8px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            margin-top: 9px;

            .title {
                font-family: PingFang SC;
                font-size: 14px;
                font-weight: 600;
                line-height: 19.6px;
                color: #333333;
            }

            .txt {
                font-family: PingFang SC;
                font-size: 12px;
                font-weight: 400;
                line-height: 16.8px;
                color: #999999;
                width: 72px;

            }
        }

        .rightImg {
            width: 25px;
            height: 18px;
            margin-top: 10px;
        }

    }
}
</style>
