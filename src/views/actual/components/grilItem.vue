<template>
    <div class="girl-item w-pull  rounded-[10px] mb-[5px] font-normal bg-[#f2f3f5] text-[13px] overflow-hidden"
        style="background:#fff;">
        <!-- <template v-if="!item.id">
            <img class="w-full" @click.stop="$clickAd(item)" v-olazyload="getImgUrl(item)" alt="" srcset="">
            <div
                class="pl-[5px] mt-[5px]  pr-[12px] overflow-hidden text-[16px] font-medium text-ellipsis whitespace-nowrap text-[#2F2F42]">
                {{ item.adName }}</div>
        </template> -->
        <!-- <template > -->
            <div class="img-wrap relative w-pull " @click="$clickAd(item)">
                <!-- 封面 -->
                <img class="w-[100%] h-[250px]" :src="item.cover" style="object-fit: cover;"  @error="onImageError()" alt="">
                <div class="topBox">
                    <!-- 左侧官方认证 -->
                    <div class="leftBox">
                        <img class="gfrzBtn" src="@/assets/images/nav/gfrz.png" />
                        <span class="rightTxt">官方认证</span>
                    </div>
                    <!-- 右侧喜欢 -->
                    <div class="rightBox">
                        <img class="likeBtn" src="@/assets/images/nav/like.png">
                        <span class="rightTxt">{{item.viewer}}</span>
                    </div>

                </div>
                <div class="bottomBox">
                    <div style=" width:100%;display: flex;justify-content: space-between;">
                        <!-- 左边播放按钮 -->
                        <img class="bfBtn" src="@/assets/images/nav/bf.svg" />
                        <!-- 右侧点击约会 -->
                        <img class="likeBtn" src="@/assets/images/nav/submitYhBtn.png">

                    </div>
                </div>
                <!-- <img class="w-[15px] absolute bottom-[7px] left-[7px]" src="@/assets/images/actual/gril-map.png" alt=""> -->
            </div>
            <div class="grilInfo  pl-[8px] mt-[5px]  pr-[8px]">
                <div class="nameBoxLeft">
                    <div class="overflow-hidden text-[16px] font-medium text-ellipsis whitespace-nowrap nameBox">
                        {{item.title}}
                    </div>
                    <div class="addressBox">
                        <img class="w-[10px] h-[10px] " src="@/assets/images/nav/address.png" alt="">
                        <div class="addressTxt">附近{{item.distance}}km</div>
                    </div>

                </div>

                <div class="bodyInfo">{{item.introduce }}</div>
                <div class="xmBox ">
                    <span class="title">项目</span>
                    <span class="content">{{item.project}}</span>
                </div>
                <div class="xmBox ">
                    <span class="title">特色</span>
                    <span class="content">{{item.feature}}</span>
                </div>
            </div>
        <!-- </template> -->
    </div>
</template>
<script setup name="grilItem">
import { onMounted, ref, computed, watch } from 'vue'
import { $clickAd, getImgUrl } from "@/utils"
import { fetchImage } from '@/utils/imageUtils'; // 导入封装的函数
const props = defineProps({
    item: Object,
})
const propsCopy= ref(props.item)

fetchImage(propsCopy.value.cover).then((val) => {
    console.log(val)
    propsCopy.value.cover=val
        });

const computePic = (extension = {}) => {
    let str = ''
    if (extension.cost) {
        str = extension.cost
    } else {
        str = `${extension.costP}/p,${extension.cost2P}/2p,${extension.costN}/包夜`
    }
    return str
}
const onImageError=(i)=> {
    propsCopy.value.cover= '/assets/default.png'
    }

</script>
<style lang="less" scoped>
.topBox {
    width: 100%;
    display: flex;
    justify-content: space-around;
    position: absolute;
    top: 5px;

    .leftBox {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 87px;
        height: 30px;
        border-radius: 32px;
        border: 1px solid #FFFFFF1A;
        background: #0000004D;
        backdrop-filter: blur(4px);
        padding-right: 5px;

        .gfrzBtn {
            width: 30px;
            height: 30px;
        }

        .rightTxt {
            font-family: DIN Alternate;
            font-size: 12px;
            font-weight: 700;
        }
    }

    .bottomBox {
        display: flex;

        .bfBtn {
            width: 30px;
            height: 30px;

        }

    }

    .rightBox {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 58px;
        height: 30px;
        border-radius: 32px;
        border: 1px solid #FFFFFF1A;
        background: #0000004D;
        backdrop-filter: blur(4px);
        padding-right: 3px;

        .likeBtn {
            width: 30px;
            height: 30px;
        }

        .rightTxt {
            font-family: DIN Alternate;
            font-size: 12px;
            font-weight: 700;
        }

    }

}

.bottomBox {
    width: 100%;
    position: absolute;
    bottom: -15px;

    .bfBtn {
        width: 30px;
        height: 30px;
        margin-left: 5px;
    }

    .likeBtn {
        width: 123px;
        height: 30px;
        margin-right: 5px;
    }
}

.grilInfo {
    margin-top: 20px;
    width: 100%;

    .nameBoxLeft {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;

        .nameBox {
            width: 80px;
            font-family: PingFang SC;
            font-size: 14px;
            font-weight: 400;
            line-height: 19.6px;
            color: #333333;
        }

        .addressBox {
            display: flex;
            align-items: center;

            .addressTxt {
                font-family: PingFang SC;
                font-size: 10px;
                font-weight: 400;
                line-height: 14px;
                color: #9FA3C2;

            }

        }

    }

    .bodyInfo {
        font-family: PingFang SC;
        font-size: 13px;
        font-weight: 600;
        color: #E78C89;
        margin: 6px 0;
    }

    .xmBox {
        width: 100%;
        display: flex;
        margin-bottom:5px ;

        .title {
            font-family: PingFang SC;
            font-size: 12px;
            font-weight: 400;
            line-height: 16.8px;
            color: #7C85CE;
            margin-right: 5px;
        }

        .content {
            width: 80%;
            overflow: hidden;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            font-family: PingFang SC;
            font-size: 12px;
            font-weight: 400;
            line-height: 16.8px;
            text-align: left;
            color: #999999;
        }
    }

}
</style>