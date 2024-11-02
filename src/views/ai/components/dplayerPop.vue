<template>
    <van-popup v-model:show="showBottom" class="" teleport="body" style="--van-padding-md:0" @opened="playShow = true">
        <player v-if="playShow" ref="PlayerRef" :url="url"></player>
    </van-popup>
</template>
<script setup name="dplayerPop">
import { computed, ref, watch } from "vue";
import player from '@/views/ai/components/player.vue'
const props = defineProps({
    modelValue: Boolean,
    url: {
        type: String,
        default: ''
    }
});
const emits = defineEmits(['update:modelValue']);
const showBottom = computed({
    get() {
        return props.modelValue || false;
    },
    set() {
        close();
    },
});
const close = () => {
    emits("update:modelValue", false)
}
const playShow = ref(false)
watch(() => props.modelValue, val => {
    if (!val) {
        playShow.value = false
    }
})
</script>