<template>
    <van-swipe vertical :show-indicators="false" @change="change" class=" h-full w-full" :loop="false" lazy-render
        ref="vanswipe">
        <van-swipe-item v-for="id in data.list" :key="id">
            <liveDplayer :id="id" :key="id" :active="activeId"></liveDplayer>
        </van-swipe-item>
    </van-swipe>
</template>
<script setup name="liveDetail">
import { ref, onMounted, reactive,computed } from 'vue'
import liveDplayer from "@/views/liveDetail/components/dplayer.vue";
import { getLiveList } from "@/service/liveApi";
import { useRoute } from "vue-router"
import { config } from '@/store/config'
import { global } from '@/store/global'
import { $get } from '@/utils';
const route = useRoute()
const configStore = config()
const globalStore = global()
const isVip = computed(() => $get(configStore, "deviceUser.userGroupId", 1) == 3)
const data = reactive({
    page: 1,
    list: [],
    total: 0
})
const activeId = ref(0)
const list = new Set()
const getlivelist = async () => {
    let res = await getLiveList({ page: data.page, pageSize: 20 })
    res.result?.list.forEach(item => {
        list.add(item.liveId)
    })
    data.list = [...list]
    data.total = res.result.total
}
const change = (index) => {
    open_f()
    activeId.value = $get(data, `list.${index}`)
    if ((list.size - (index + 1)) <= 1 && data.total > list.size) {
        data.page++
        getlivelist()
    }
    
}
const setLiveCount = () => {
    let count = getLiveCount()
    window.localStorage.setItem('_LiveCount', ++count)
}
const getLiveCount = () => {
    return +window.localStorage.getItem("_LiveCount")
}
const open_f = () => {
    if (!isVip.value && getLiveCount() > 5) {
        globalStore.showRechargeDialog = true
        activeId.value = -1
        return
    }
    setLiveCount()
}
onMounted(() => {
    let id = +$get(route, 'params.id', 0)
    list.add(id)
    open_f()
    activeId.value = id
    getlivelist()
})

</script>
