import { observe } from "@/utils/observer";
import loadimage from '@/assets/images/lazy-default.jpg'
import { videoCoverMap } from '@/data/videoCover'
const lazyload = {
    mounted(el, binding) {
        if (binding.value) {
            el.setAttribute('data-src', binding.value)
        }
        if (!el.getAttribute('no-default')) {
            el.src = loadimage
        }
        (binding.value && videoCoverMap.has(binding.value)) ? (el.src = videoCoverMap.get(binding.value)) : observe(el)
    },
    updated(el, binding) {
        if (binding.value == el.getAttribute('data-src')) return
        if (binding.value) {
            el.setAttribute('data-src', binding.value)
        }
        if (!el.getAttribute('no-default')) {
            el.src = loadimage
        }
        observe(el)
    },
};

export default lazyload;