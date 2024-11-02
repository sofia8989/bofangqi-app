import { setBgImg } from "@/utils/convertImg"
const loadbg = {
    mounted(el, binding) {
        setBgImg(el,binding.value)
    },
    updated(el,binding){
        setBgImg(el,binding.value)
    }
};

export default loadbg;