<template>
    <div class="girl-item w-pull h-pull rounded-[10px] mb-[5px] font-normal bg-[#f2f3f5] text-[13px] overflow-hidden"
        style="background:#fff;"  @click="$clickAd(item)">
        <div class="img-wrap relative w-pull ">
            <!-- 封面 -->
            <img class="w-[100%] h-[173px]" style="border-radius: 10px;object-fit: cover;" @error="onImageError" :src="item.cover" alt="">
        </div>
        <div class="grilInfo pt-[8px] pl-[8px] mt-[5px]  pr-[8px]">
            <div class="titleBox">{{item.title}}</div>
            <div class="nameBoxLeft">
                <div class="nameBox">
                    ￥{{item.price}}
                </div>
                <div class="addressBox">
                    已售<span class="num">{{item.sale}}+</span>件
                </div>
            </div>
            <div class="nameBoxLeft">
                <img src="@/assets/images/nav/star.png" />
                <div class="addressBox">
                    <span class="num">{{item.reply}}+</span>评价
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
const onImageError=(i)=> {
    props.item.cover = '/assets/default.png'
    }

</script>
<style lang="less" scoped>
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
        font-size: 18px;
        font-weight: 600;
        line-height: 25.2px;
        text-align: left;
        color: #333333;
        margin-bottom: 5px;
    }

    .nameBoxLeft {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        margin-bottom: 5px;

        img {
            width: 63px;
            height: 11px;
        }



        .nameBox {
            font-family: PingFang SC;
            font-size: 14px;
            font-weight: 600;
            line-height: 19.6px;
            text-align: left;
            color: #FF757F;
        }

        .addressBox {
            font-family: PingFang SC;
            font-size: 12px;
            font-weight: 400;
            line-height: 16.8px;
            color: #666666;
        }

        .num {
            font-weight: 600;
        }

    }


}
</style>