<template>
  <div v-if="showMatchaAppLaunch" class="matchaAppLaunch z-[2001]">
    <div @click="myTime = 0" class="right">跳过{{ myTime }}</div>
    <img v-if="getImgUrl(xlHomeAppLaunch)" v-olazyload="getImgUrl(xlHomeAppLaunch)" />
  </div>
  <div v-else class=" bg-white h-full">
    <router-view v-slot="{ Component, route }">
      <keep-alive :include="cachedComponents" :max="10">
        <component :is="Component" :key="route.name" />
      </keep-alive>
    </router-view>
    <MatchaDialog />
    <NoVipDialog />
    <!-- <PopUps /> -->
    <!-- <AiLevitate /> -->
    <!-- <BFloating v-if="$route.name == 'home' && !inStandaloneMode  && !globalStore.showMainDialog && !globalStore.showPopUps"/> -->
    <NavFooter :style="{ visibility: route.meta.navfooter ? 'visible' : 'hidden' }" />
    <Loading v-show="globalStore.showLoading" />
  </div>

</template>
<script setup name="app">
import { nextTick, onBeforeMount, onMounted, ref, watch, computed } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import { deviceType, inStandaloneMode } from '@/utils/common.js'
import router from '@/router'
import { config } from '@/store/config'
import { global } from '@/store/global'
import MatchaDialog from './components/MatchaDialog.vue'
// import NoVipDialog from './components/NoVipDialog.vue'
import useClipboard from 'vue-clipboard3'
import { getImgUrl, $get, checkExpiration, cachedComponents } from "@/utils"
import PopUps from '@/components/PopUps.vue'
import { useChoiceList } from '@/store/choiceList'

// 安卓修改状态栏 创建或修改 meta 标签
let metaThemeColor = document.querySelector("meta[name=theme-color]");
if (metaThemeColor) {
  metaThemeColor.setAttribute("content", "#ffffff");
} else {
  metaThemeColor = document.createElement("meta");
  metaThemeColor.name = "theme-color";
  metaThemeColor.content = "#ffffff";
  document.head.appendChild(metaThemeColor);
}
// ios修改状态栏
const statusBarStyle = ref('default');
statusBarStyle.value = 'light';
document.body.style.setProperty('--status-bar-style', 'light');

const route = useRoute()
const configStore = config()
const globalStore = global()
const choiceList = useChoiceList()
const showMatchaAppLaunch = ref(false)
const hiddenProperty =
  'hidden' in document
    ? 'hidden'
    : 'webkitHidden' in document
      ? 'webkitHidden'
      : 'mozHidden' in document
        ? 'mozHidden'
        : null
const visibilityChangeEvent = hiddenProperty.replace(/hidden/i, 'visibilitychange')
let Loadingtime = null
onBeforeMount(async () => {
  await configStore.init() // 设置基本配置信息
  choiceList.getChoiceList()
  router.push({ name: 'nav' });
  // if(!route.name) return;
  // console.log('route name: ', route.name)

})


// 进入项目复制内容
const getUrlContent = () => {

}

/**
 * @description 轮播图
 */
const xlHomeAppLaunch = computed(() => $get(configStore, 'templateData.xlHomeAppLaunch.adList.0', {}))
const myTime = ref(null)
const myInterVal = ref()
const load = () => {
  if (xlHomeAppLaunch.value?.imageUrl) {
    showMatchaAppLaunch.value = true
    const time = ref(Number(xlHomeAppLaunch.value.extension[xlHomeAppLaunch.value?.adGroupId].countdown))
    myTime.value = time.value
    myInterVal.value = setInterval(() => {
      myTime.value--
    }, 1000)
  } else {
    setTimeout(() => {
      load()
    }, 500)
  }
}

const contentTxt = ref()
// const getZt = async () => {
//   try {
//     // 获取粘贴板内容
//     contentTxt.value = await navigator.clipboard.readText();
//     // 如果有pageName:
//     if (contentTxt.value.includes('pageName:')) {
//       // 为空的时候设置_pageName=index.html 不为空获取粘贴板里的内容
//       if (contentTxt.value.slice(9) == '') {
//         window.localStorage.setItem("_pageName", 'index.html')
//       } else {
//         window.localStorage.setItem("_pageName", contentTxt.value.slice(9))
//       }

//     } else {
//       // 粘贴板里没有pageName的时候 为index.html
//       window.localStorage.setItem("_pageName", 'index.html')
//     }
//     console.log('1111111111111111111111111')

//     console.log('粘贴成功', contentTxt.value, window.localStorage.getItem("_pageName"))

//   } catch (err) {
//     console.log('粘贴失败', contentTxt.value)
//   }
// };

const isLoad = ref(false)
onMounted(() => {


  const meta = document.createElement('meta');
  meta.name = 'apple-mobile-web-app-status-bar-style';
  meta.content = 'white';
  document.head.appendChild(meta);
  if (inStandaloneMode.value) {
    load()
  } else {
    setTimeout(() => {
      if (['home', 'nav'].includes(route.name)) {
        globalStore.showMainDialog = true
      }
    }, 500)
  }
  window.addEventListener('resize', () => {
    configStore.setDevice() // 设置设备信息
  })
  isLoad.value = true
  checkExpiration()
})

watch(
  () => myTime.value,
  () => {
    if (myTime.value === 0) {
      clearInterval(myInterVal.value)
      showMatchaAppLaunch.value = false
      nextTick(() => {
        globalStore.showMainDialog = true
      })
    }
  })

watch(() => route.name, (val, old) => {
  if (isLoad.value && old) {
    configStore.runCode()
    if (val == 'mine') {
      configStore.updateUserInfo()
    }
  }
})
</script>
<style lang="less" scoped>
/* 根据状态栏样式设置CSS变量 */
body {
  --status-bar-style: 'default';
  /* 更多样式 */
}

/* 暗色样式的情况 */
body[data-status-bar-style='dark'] {
  --status-bar-style: 'dark';
  /* 更多样式 */
}

/* 亮色样式的情况 */
body[data-status-bar-style='light'] {
  --status-bar-style: 'light';
  /* 更多样式 */
}

#editor—wrapper {
  border: 1px solid @border;
  z-index: 100;
  /* 按需定义 */
}

#toolbar-container {
  border-bottom: 1px solid @border;
}

#editor-container {
  height: 500px;
}

.matchaAppLaunch {
  width: 100%;
  height: 100vh;
  position: relative;

  .right {
    position: absolute;
    right: 15px;
    top: 15px;
    background: rgba(0, 0, 0, 0.5);
    border-radius: 6px;
    display: inline-flex;
    padding: 6px 10px;
    justify-content: center;
    align-items: center;
    gap: 10px;
    color: #fff;
    text-align: center;
    font-family: PingFang SC;
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
  }

  img {
    width: 100%;
    height: 100%;
  }
}
</style>

<style>
@font-face {
  font-family: PingFang;
  src: url(./assets/style/PingFangSC-Semibold.woff2);
}
</style>
