<template>
    <div>
        <NavHeader :title="pageInfo.title"></NavHeader>
        <div class="list px-[10px] text-black">
            <ScrollList :loading="state.loading" :finished="state.finished" :refresh="state.refresh" :list="state.list"
                @onLoad="onLoad" @onRefresh="onRefresh">
                <template v-for="order in state.list" :key="order.orderNo">
                    <orderItem v-if="[1, 2].includes(pageInfo.type)" :order="order"></orderItem>
                    <gameOrderItem v-else-if="[3,4].includes(pageInfo.type)" :type="pageInfo.type" :order="order"></gameOrderItem>
                </template>
                <template v-slot:empty>
                    <div class="flex justify-center flex-col items-center relative h-[80vh]">
                        <img src="@/assets/images/empty/empty.png" class="w-[40px] mb-[18px]" alt="" srcset="">
                        <div>当前无记录</div>
                    </div>
                </template>
            </ScrollList>
        </div>
    </div>
</template>
<script setup name="record">
import { useRoute } from 'vue-router'
import { onMounted, ref, reactive } from 'vue';
import orderItem from "@/views/record/components/orderItem.vue";
import gameOrderItem from "@/views/record/components/gameOrderItem.vue";
import { getVipOrderList } from "@/service/payApi";
import { DepositRecords,WithdrawalRecords } from "@/service/game";
const route = useRoute()
const pageInfo = ref({
    title: "",
    left_title: "",
    type: 1
})
const state = reactive({
    loading: false,
    finished: true,
    refresh: false,
    first: true,
    pageNum: 1,
    total: 0,
    list: []
})
const onLoad = async () => {
    if (state.first) return
    if (state.list.length >= state.total) {
        state.finished = true
        return
    }
    state.loading = true
    state.pageNum++
    init()
}
const onRefresh = async () => {
    state.refresh = true
    state.pageNum = 1
    state.list = []
    await init()
}
const init = async () => {
    if (pageInfo.value.type === 1) {
        const res = await getVipOrderList({
            // status: 'OrderCompleted',
            page: state.pageNum,
            pageSize: 20
        })
        let { list, total } = res.result
        setData(list, total)
    } else if ( [3,4].includes(pageInfo.value.type)) {
        let api = pageInfo.value.type === 3 ? WithdrawalRecords : DepositRecords
        const res = await api({
            current: state.pageNum,
            size: 10,
            data: {
                queryTime: 3,
                transactionStatus: 0,
                transactionType: "ALL"
            }
        })
        let { list, total } = res.data
        setData(list, total)
    }

}
const setData = (list, total) => {
    if (state.pageNum == 1) {
        state.list = list || []
    } else {
        state.list.push(...list)
    }
    state.total = total
    state.refresh = false
    state.first = false
    state.loading = false
    state.finished = total <= state.list.length
}
onMounted(() => {
    let info = {}
    switch (route.name) {
        case 'rechargeRecord':
            info = {
                title: "充值记录",
                left_title: "会员时长",
                type: 1
            }
            break;
        case 'diamondDetails':
            info = {
                title: "钻石明细",
                left_title: "购买类型",
                type: 2
            }
            break;
        case 'withdrawalsRecord':
            info = {
                title: "提现记录",
                left_title: "",
                type: 3
            }
            break;
        case 'rechargeGameRecord':
            info = {
                title: "充值记录",
                left_title: "",
                type: 4
            }
            break;

        default:
            break;
    }
    pageInfo.value = info
    init()
})
</script>