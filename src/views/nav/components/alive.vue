<template>
    <div class="girl-item w-pull h-pull rounded-[10px] mb-[5px] font-normal bg-[#f2f3f5] text-[13px] overflow-hidden"
        style="background:#fff;" @click="$clickAd(item)">
        <div class="img-wrap relative w-pull ">
            <!-- 封面 -->
            <img class="w-[100%] h-[247px]" style="border-radius: 10px;object-fit: cover;" :src="item.cover"  @error="onImageError()" alt="">
            <div class="topBox">
                <!-- 左侧官方认证 -->
                <div class="leftBox">

                    <img class="gfrzBtn" src="@/assets/images/nav/bfl.png" />
                    <span class="rightTxt"  v-if="item.viewer<10000">{{ item.viewer }}人</span>
                    <span class="rightTxt" v-else>{{ item.viewer/10000 }}w人</span>
                </div>
                <img class="likeBtn" src="@/assets/images/nav/collent.png">
            </div>
        </div>
        <div class="grilInfo pt-[8px] pl-[8px] mt-[5px]  pr-[8px]">
            <div class="titleBox">{{ item.title }}</div>
            <div class="nameBoxLeft">

                <div class="nameBox">
                    <div class="dot"></div>
                    <span style="color:#00FF7C ;">{{ item.online }}</span>人在线
                </div>
                <div class="addressBox">
                    <img class="w-[10px] h-[10px] " src="@/assets/images/nav/zan.png" alt="">
                    <div class="addressTxt">{{ item.click }}</div>
                </div>

            </div>

        </div>

    </div>
</template>
<script setup name="grilItem">
import { $clickAd, getImgUrl } from "@/utils"
const props = defineProps({
    item: Object,
})
const computePic = (extension = {}) => {
    let str = ''
    if (extension.cost) {
        str = extension.cost
    } else {
        str = `${extension.costP}/p,${extension.cost2P}/2p,${extension.costN}/包夜`
    }
    return str
}
const onImageError=()=> {
    props.item.cover= '/assets/default.png'
    }
</script>
<style lang="less" scoped>
.topBox {
    width: 100%;
    display: flex;
    justify-content: space-between;
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
        margin-left: 5px;

        .gfrzBtn {
            width: 13px;
            height: 13px;
            margin-left: 10px;
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


    .likeBtn {
        width: 30px;
        height: 30px;
        margin-right: 5px;
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
    margin: 4px 0;
    width: 100%;

    .titleBox {
        font-family: PingFang SC;
        font-size: 16px;
        font-weight: 400;
        line-height: 22.4px;
        text-align: left;
        color: #333333;

    }

    .nameBoxLeft {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;



        .nameBox {
            display: flex;
            align-items: center;
            font-family: PingFang SC;
            font-size: 12px;
            font-weight: 400;
            color: #999;

            .dot {
                width: 4px;
                height: 4px;
                border-radius: 2px;
                background: #00FF7C;
                margin-left: 5px;
            }


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


}
</style>