<template>
  <van-pull-refresh v-model="refreshLoading" @refresh="emit('onRefresh')">
    <van-list
      v-model:loading="listLoading"
      :finished="finished"
      :immediate-check="false"
      loading-text="加载中"
      @load="emit('onLoad')"
    >
      <!-- 列表上面的内容 -->
      <template v-if="$slots.top">
        <slot name="top"></slot>
      </template>
      <template #finished>
        <span v-if="list.length > 0 && finished">没有更多数据了</span>
      </template>
      <!-- 加载完成并且没有数据的情况 -->
      <template v-if="list.length == 0 && finished">
        <!-- 父级传过来的无数据展示 -->
        <template v-if="$slots.empty">
          <slot name="empty"></slot>
        </template>
        <!-- 默认无数据展示 -->
        <template v-else>
          <van-empty :description="emptyText" />
        </template>
      </template>
      <!-- 开始加载时显示的骨架屏 -->
      <template v-if="list.length == 0 && !finished">
        <template v-if="showSkeleton">
          <!-- 父级传过来的骨架屏 -->
          <template v-if="$slots.skeleton">
            <slot name="skeleton"></slot>
          </template>
          <!-- 默认骨架屏 -->
          <template v-else>
            <div class="pb-[5px] mb-[10px] shadow" v-for="(item, i) in 10">
              <van-skeleton-paragraph class="h-[130px!important] !bg-[#fff]" />
              <div class="mx-[16px] my-[12px]">
                <van-skeleton-paragraph class="h-[45px] !bg-[#fff]" />
                <van-skeleton-paragraph class="h-[18px] !bg-[#fff]" row-width="70%" style="margin-top: 5px" />
              </div>
            </div>
          </template>
        </template>
      </template>
      <!-- 数据显示 -->
      <template v-else>
        <slot></slot>
        <!-- <Pagination
        v-if="list.length > 0"
        :page="pageNum"
        :pagecount="pagecount"
        @changePage="changePage"
      >
      </Pagination> -->
      </template>
    </van-list>
  </van-pull-refresh>
</template>
<script setup name="ScrollList">
import { computed, ref, watch } from 'vue'
const props = defineProps({
  loading: {
    type: Boolean,
    default: false
  },
  refresh: {
    type: Boolean,
    default: false
  },
  finished: {
    type: Boolean,
    default: false
  },
  list: {
    type: Array,
    default: () => []
  },
  pageNum: {
    type: [Number, String],
    default: 0
  },
  pagecount: {
    type: [Number, String],
    default: 0
  },
  emptyText: {
    type: String,
    default: '暂无数据'
  },
  showSkeleton: {
    type: Boolean,
    default: true
  }
})
const listLoading = ref(props.loading)
const refreshLoading = ref(props.refresh)
const emit = defineEmits(['onLoad', 'changePage'])

const changePage = (type) => {
  emit('changePage', type)
}
watch(
  () => props.loading,
  (val) => {
    listLoading.value = val
  },
  {
    deep: true
  }
)

watch(
  () => props.refresh,
  (val) => {
    refreshLoading.value = val
  },
  {
    deep: true
  }
)
</script>
