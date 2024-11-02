<template>
  <van-sticky>
    <van-nav-bar :style="`--van-border-width:0;--van-nav-bar-title-text-color:${textcolor};--van-nav-bar-background:${bg};`"
      :title="title" :left-arrow="leftArrow" @click-left="onClickLeft">
      <template #left>
        <img  src="@/assets/images/left.svg"/>
        <!-- <svg-icon class="h-[24px] w-[24px]" :color="textcolor" name="w-back" /> -->
      </template>
      <template #right>
        <slot></slot>
      </template>
    </van-nav-bar>
  </van-sticky>
</template>
<script setup name="NavHeader">
import { useRouter } from 'vue-router'
const router = useRouter()
const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  leftArrow: {
    type: Boolean,
    default: true
  },
  callBack: {
    type: Function,
    default: null
  },
  bg: {
    type: String,
    default: '#fff'
  },
  textcolor:{
    type: String,
    default: '#2F2F42'
  }
})
const onClickLeft = () => {
  if (props.callBack) {
    props.callBack()
  } else {
    // router.back()
    router.go(-1)
  }
}
</script>
<style lang="less" scoped>
:deep(.van-nav-bar__left) {
  padding-left: 10px;
}

:deep(.van-nav-bar__arrow) {
  font-size: 22px;
  color: @white !important;
}

:deep(.van-nav-bar__title) {
  font-weight: 400;
  font-size: 15px;
}</style>
