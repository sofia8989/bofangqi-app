<template>
    <div ref="videoRef" class="min-w-[100vw]"></div>
</template>
<script setup name="dplayer">
// import { ref, onMounted, onUnmounted } from "vue";
// import Hls from 'hls.js'
// import DPlayer from 'dplayer'
// const props = defineProps({
//     url: {
//         type: String,
//         default: ''
//     }
// });
// const videoRef = ref()
// let dp = null
// const initP = () => {
//     let url = props.url
//     if (!videoRef.value || !url) return
//     dp = new DPlayer({
//         container: videoRef.value,
//         preload: 'metadata',
//         autoplay: true,
//         live: false,
//         theme: '#2C2A2A',
//         loop: false,
//         screenshot: true,
//         airplay: true,
//         chromecast: true,
//         hotkey: true,
//         volume: 0,
//         mutex: true,
//         lang: 'zh-cn',
//         video: {
//             url,
//             // pic: pic,
//             type: 'customHls',
//             customType: {
//                 customHls: function (video, player) {
//                     const hls = new Hls()
//                     hls.loadSource(video.src || url)
//                     hls.attachMedia(video)
//                     hls.on(Hls.Events.MANIFEST_LOADED, () => {
//                         video.play()
//                     })
//                 }
//             }
//         }
//     })
// }
// const destroyP = () => {
//     dp && dp.destroy()
// }
// onMounted(() => {
//     initP()
// })
// onUnmounted(() => {
//     destroyP()
// })

</script>