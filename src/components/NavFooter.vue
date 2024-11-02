<template>
  <van-tabbar :active-color="navActive" fixed  z-index="99" v-model="active" id="navTab" class="nav-footer"
   :style="route.name === 'shortVideo'?'background:#000':''">
    <van-tabbar-item name="nav" @click="handleChange('nav')">
      <span :class="['icon-text', route.name === 'nav' && 'active']">导航</span>
      <template #icon="props">
        <img class="icon" :src="route.name === 'nav'? iconNavActive : iconNav" />
      </template>
    </van-tabbar-item>
    <van-tabbar-item name="home" @click="handleChange('home')">
      <span :class="['icon-text', route.name === 'home' && 'active']">视频</span>
      <template #icon="props">
        <img class="icon" :src="route.name === 'home'? iconHomeActive : iconHome" :style="route.name === 'home'? '' : 'width:25px;height:25px;margin-top:6px;'" />
      </template>
    </van-tabbar-item>
    <van-tabbar-item name="shortVideo" @click="handleChange('shortVideo')"  :style="route.name === 'shortVideo'?'background:#000':''">
      <span :class="['icon-text', route.name === 'shortVideo' && 'active']">短视频</span>
      <template #icon="props">
        <img class="icon" :src="route.name === 'shortVideo'? iconWelfareActive : iconWelfare" />
      </template> 
    </van-tabbar-item>
    
     <!-- <van-tabbar-item name="short-video" @click="handleChange('short-video')">
      <span :class="['icon-text', route.name === 'short-video' && 'active']">短视频</span>
      <template #icon="props">
        <img class="icon" :src="route.name === 'actual'? iconPastActive : iconPast" />
      </template> -->
    <!-- </van-tabbar-item> -->
    <van-tabbar-item name="othergame" @click="handleChange('othergame')">
      <span :class="['icon-text', route.name === 'othergame' && 'active']">游戏</span>
      <template #icon="props">
        <img class="icon" :src="route.name === 'othergame'? iconGameActive : iconGame"  />
      </template>
    </van-tabbar-item>
    <van-tabbar-item name="lieqi" @click="handleChange('lieqi')">
      <span :class="['icon-text', route.name === 'lieqi' && 'active']">猎奇</span>
      <template #icon="props">
        <img class="icon" :src="route.name === 'lieqi'? iconActualActive : iconActual" />
      </template>
    </van-tabbar-item>
   
    
    <van-tabbar-item  name="mine" @click="handleChange('mine')">
      <span :class="['icon-text',['mine'].includes(route.name)  && 'active']">我的</span>
      <template #icon="props">
        <img class="icon" :src="route.name === 'mine'? iconMineActive : iconMine" />
      </template>
    </van-tabbar-item>
  </van-tabbar>
</template>
<script setup name="NavFooter">
import { navActive } from '@/assets/style/index.module.less'
import { global } from '@/store/global'
import { storeToRefs } from 'pinia'
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import iconHomeActive from '@/assets/images/bottomBar/icon-home-active.svg'
// import iconHome from '@/assets/images/bottomBar/icon-home.svg'
import iconHome from '@/assets/images/bottomBar/icon-home.gif'
import iconMineActive from '@/assets/images/bottomBar/icon-my-active.svg'
import iconMine from '@/assets/images/bottomBar/icon-my.svg'
import iconPastActive from '@/assets/images/bottomBar/icon-past-active.png'
import iconPast from '@/assets/images/bottomBar/icon-past.png'
import iconWelfareActive from '@/assets/images/bottomBar/icon-welfare-active.svg'
import iconWelfare from '@/assets/images/bottomBar/icon-welfare.svg'
import iconActual from '@/assets/images/bottomBar/icon-community.svg'
import iconActualActive from '@/assets/images/bottomBar/icon-community-active.svg'
import iconGame from '@/assets/images/bottomBar/icon-game.svg'
import iconGameActive from '@/assets/images/bottomBar/icon-game-active.svg'
import iconNav from '@/assets/images/bottomBar/icon-nav.svg'
import iconNavActive from '@/assets/images/bottomBar/icon-nav-active.svg'
import { config } from '@/store/config'
const configStore = config()
const active = ref(0)
const globalStore = global()
const { homeCache } = storeToRefs(globalStore)
const router = useRouter()
const route = useRoute()
const setRoute = () => {
  switch (route.name) {
    case 'home':
    case 'pe-game':
    case 'shortVideo':
    case 'past':
    case 'mine':
    case 'community':
    // case 'chigua':
    case 'xingwen':
    // case 'actual':
    case 'nav':
    case 'othergame':
    // case 'short-video':
      active.value = route.name
      break
    case 'video-detail':
      active.value = 'shortVideo'
      break
    case 'movie-detail':
      active.value = 'past'
      break
  }
}

const handleChange = (name) => {
  switch (name) {
    case 'home':
      if (route.name == 'home') {
        globalStore.setHomeCache({
          scrollTop: 0,
          page: 1,
          typeId: ''
        })
        router.replace({ name: 'home' })
      } else {
        let query = {}
        if (homeCache.value.typeId) {
          query.typeId = homeCache.value.typeId
        }
        if (homeCache.value.page > 1) {
          query.page = homeCache.value.page
        }
        router.replace({ name: 'home', query })
      }
      break
    default:
      router.push({ name })
      break
  }
  if (route.name == ['home','shortVideo','past','community','chigua','xingwen','lieqi']) {
    configStore.scroll[route.name] = document.documentElement.scrollTop
  }

}

watch(
  () => route.name,
  () => {
    setRoute()
  }
)

onMounted(() => {
  setRoute()
})
</script>
<style lang="less" scoped>
.van-tabbar {
  height: 65px;
  // height: var(--mc-header-height);
  max-width: 375px;
  width: 100%;
  left: 50%;
  transform: translateX(-50%);
  padding-bottom: constant(safe-area-inset-bottom); /* 兼容 iOS < 11.2 */
  padding-bottom: env(safe-area-inset-bottom); /* 兼容 iOS >= 11.2 */
  bottom: -0.5px !important;
  // box-shadow: 0px -2px 2px 0px #0000000F;
  background-color: #fff;
  --van-background-2: #fff
  --van-tabbar-background: #fff;
  --van-border-color: #f4f4f4;

  .van-tabbar-item {
    justify-content: start;
    padding-top: 10px;

    :deep(.van-tabbar-item--active ){
      // background-color: #fff;
    }
  }

  .icon-text {
    color:#6B6C7F;
    text-align: center;
    font-family: PingFang TC;
    font-size: 12px;
    font-style: normal;
    font-weight: 500;
    line-height: normal;

    &.active {
      // background-image: linear-gradient(90deg, #2D57CC 0%, #AC63FF 100%);
      // -webkit-background-clip: text;
      color: #F83E3C;
    }
  }

  .icon {
    width: 28px;
    height: 28px;
  }
}</style>
