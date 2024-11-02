<template>
    <swiper :modules="[EffectCoverflow, Navigation, Pagination, Scrollbar, A11y]" centeredSlides :slidesPerView="1"
        :spaceBetween="-40" :effect="effect" @touchstart.stop @swiper="on_swiper" @slideChange="slideChange"
        @reachEnd="reachEnd">
        <swiper-slide v-for="(item, index) in list" :key="index">
            <slot :item="item"></slot>
        </swiper-slide>
    </swiper>
</template>
<script setup>
import { ref, computed, watch } from 'vue'
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import { Swiper, SwiperSlide } from 'swiper/vue'
import { EffectCoverflow, Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules'
const props = defineProps({
    list: {
        type: Array,
        default: () => ([])
    },
    effect: {
        type: String,
        default: 'fade'
    },
    modelValue: {
        type: Number,
        default: 0
    }
})
const emits = defineEmits(['update:modelValue'])
const mySwiper = ref()
const on_swiper = (swiper) => {
    mySwiper.value = swiper
}
const slideChange = (data) => {
    emits("update:modelValue", data.activeIndex)
}
const reachEnd = (data) => {
}
const slideTo = (index) => {
    mySwiper.value?.slideTo(index, index == 0 ? 0 : 1000, false)
}
watch(() => props.modelValue, (val) => {
    slideTo(val)
})
</script>
<style lang="less" scoped>
:deep(.swiper-wrapper) {
    text-align: center;

    .swiper-slide {
        transform: scale(0.85) !important;

        &.swiper-slide-active {
            z-index: 10 !important;
        }

        &.swiper-slide-prev,
        &.swiper-slide-next {
            transform: scale(0.7) !important;
        }
    }

}</style>