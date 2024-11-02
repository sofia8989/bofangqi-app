<template>
    <div class="mx-[10px] mt-[6px] !mb-[8px] flex items-center flex-auto flex-grow-0 flex-shrink-0 all">
        <div class="left">
            <div class="bg-icon w-[3px] h-[10px] rounded-[16px] mr-[9px]"></div>
            <div class="font-semibold text-[16px] mr-[15px] title-color">{{ title }}</div>
            <div @click="clickTab(item)" v-for="(item, i) in btns" :key="i"
                class="px-[5px] bg-[#454545] text-[11px] h-[23px] flex items-center text-[#C6C6C6] rounded-[3px] mr-[15px]">
                {{ item[keyname] }}</div>

        </div>
        

        <div class="right">
            <img class="w-[18px] h-[18px]  mr-[12px]" src="./news.svg" @click="refresh">
            <div class="more-color text-[13px]" @click="goVideoList">更多</div>
            <img class="w-[18px] h-[18px]" src="./more.svg" />
        </div>
    </div>
</template>
<script setup name="titleItem">
import { defineEmits } from 'vue'
const router = useRouter()
import { useRouter } from 'vue-router'
const emit = defineEmits(['updateData'])

const props = defineProps({
    title: {
        type: String,
        default: ""
    },
    btns: {
        type: Array,
        default: () => ([])
    },
    keyname: {
        type: String,
        default: ""
    },
    click: {
        type: Function
    },
    list:{
        type: Object
    }
})

console.log(props.list,'56465456')
const clickTab = (item) => {
    if (props.click) {
        props.click(item)
    }
}
const refresh = () => {
    const data = 'some data'
    emit('updateData', data)
}
// const list=ref([

// ])
const goVideoList=(item)=>{
    router.push({ name: 'welfare', query: {...props.list}});
}
</script>
<style lang="less" scoped>
.bg-icon {
    // background: linear-gradient(90deg, #2D57CC 0%, #AC63FF 100%);
    background: #F83E3C;

}

.title-color {
    // background-image: linear-gradient(90deg, #2D57CC 0%, #AC63FF 100%);
    //-webkit-background-clip: text;
    //color: transparent;
    color: #000;
}

.more-color {
    color: #999999;
}

.right {
    display: flex;
}

.left {
    display: flex;
    align-items: center;
}

.all {
    display: flex;
    justify-content: space-between;
}
</style>