import { createRouter, createWebHashHistory } from 'vue-router';
import { defineAsyncComponent, nextTick } from 'vue';
import { global } from '@/store/global'
import { cachedComponents } from "@/utils"
let scrollInfo = {}
const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'layout',
      // redirect: '/nav'
    },
    {
      path: '/nav',
      name: 'nav',
      component: () => import('@/views/nav/nav.vue'),
      meta: {
        index: 1,
        keepAlive: true,
        navfooter: true
      }
    },
    // 首页
    {
      path: '/home/:typeId?',
      name: 'home',
      component: () => import('@/views/home/home.vue'),
      meta: {
        index: 1,
        keepAlive: true,
        navfooter: true
      }
    },
    // 已改成内页
    // {
    //   path: '/welfare',
    //   name: 'welfare',
    //   component: () => import('@/views/welfare/welfare.vue'),
    //   meta: {
    //     index: 1,
    //     keepAlive: true,
    //   }
    // },
    {
      path: '/welfare',
      name: 'welfare',
      component: () => import('@/views/welfare/content.vue'),
      meta: {
        index: 1,
        keepAlive: true,
      }
    },
    

    // 游戏
    {
      path: '/game',
      name: 'game',
      component: () => import('@/views/game/game.vue'),
      meta: {
        index: 1,
        keepAlive: true,
        navfooter: true
      }
    },
     // 其他游戏
     {
      path: '/othergame',
      name: 'othergame',
      component: () => import('@/views/othergame/othergame.vue'),
      meta: {
        index: 1,
        keepAlive: true,
        navfooter: true
      }
    },
    // 我的页面
    {
      path: '/mine',
      name: 'mine',
      component: () => import('@/views/mine/mine.vue'),
      meta: {
        index: 1,
        keepAlive: true,
        navfooter: true
      }
    },
    // 意见反馈
      {
        path: '/proposal',
        name: 'proposal',
        component: () => import('@/views/mine/proposal.vue'),
        meta: {
          index: 1,
          keepAlive: true,
        }
    },
    // 猎奇
    {
      path: '/lieqi',
      name: 'lieqi',
      component: () => import('@/views/lieqi/lieqi.vue'),
      meta: {
        index: 1,
        keepAlive: true,
        navfooter: true
      }
    },
     // 猎奇
     {
      path: '/lieqiShort',
      name: 'lieqiShort',
      component: () => import('@/views/lieqi/index.vue'),
      meta: {
        index: 1,
        keepAlive: true,
      }
    },
    // 短视频
    {
      path: '/shortVideo',
      name: 'shortVideo',
      component: () => import('@/views/shortVideo/index.vue'),
      meta: {
        index: 1,
        keepAlive: true,
        navfooter: true
      }
    },
    //我的中心
    {
      path: '/myCenter',
      name: 'myCenter',
      component: () => import('@/views/shortVideo/myCenter.vue'),
      meta: {
        index: 1,
        keepAlive: false,
      }
    },

    // {
    //   path: '/short-video/:id?',
    //   name: 'short-video',
    //   component: () => import('@/views/shortVideo/index.vue'),
    //   meta: {
    //     keepAlive: false,
    //     navfooter: true
    //   }
    // },
    // {
    //   path: '/liveDetail/:id?',
    //   name: 'liveDetail',
    //   component: () => import('@/views/liveDetail/index.vue'),
    //   meta: {
    //     keepAlive: false,
    //     navfooter: false
    //   }
    // },
    // AV视频详情页面
    {
      path: '/video-detail/:id',
      name: 'video-detail',
      component: () => import('@/views/detail/index.vue'),
      meta: {
        index: 2,
        keepAlive: false,
      }
    },
    //搜索
    {
      path: '/search',
      name: 'search',
      component: () => import('@/views/search/search.vue'),
      meta: {
        index: 1,
        keepAlive: true,
      }
    },
     //发帖
     {
      path: '/send',
      name: 'send',
      component: () => import('@/views/send/index.vue'),
      meta: {
        index: 1,
        keepAlive: true,
      }
    },
     //同城 点进去的回复页面
     {
      path: '/reply',
      name: 'reply',
      component: () => import('@/views/reply/index.vue'),
      meta: {
        index: 1,
        keepAlive: true,
      }
    },
     //最热
     {
      path: '/hot',
      name: 'hot',
      component: () => import('@/views/hot/hot.vue'),
      meta: {
        index: 1,
        keepAlive: true,
      }
    },
     //回复（视频）
     {
      path: '/comment',
      name: 'comment',
      component: () => import('@/views/shortVideo/comment.vue'),
      meta: {
        index: 1,
        keepAlive: true,
      }
    },
    // av搜索
    {
      path: '/searchav/:type',
      name: 'searchav',
      component: () => import('@/views/Searchav.vue'),
      meta: {
        keepAlive: false,
        navfooter: false

      }
    },
    //分享
    {
      path: '/share',
      name: 'share',
      component: () => import('@/views/share/index.vue'),
      meta: {
        index: 13,
      }
    },
    // 实战
    {
      path: '/actual',
      name: 'actual',
      component: () => import('@/views/actual/actual.vue'),
      meta: {
        keepAlive: true,
        navfooter: true
      }
    },
    // ai
    {
      path: '/ai',
      name: 'ai',
      component: () => import('@/views/ai/index.vue'),
    },
    // 实战搜索
    {
      path: '/actualSearch',
      name: 'actualSearch',
      component: () => import('@/views/actualSearch/index.vue'),
      meta: {
        index: 13,
      }
    },
    // 充值
    {
      path: '/recharge',
      name: 'recharge',
      component: () => import('@/views/recharge/index.vue'),
      meta: {
        index: 13,
      }
    },
     // 登录
     {
      path: '/login',
      name: 'login',
      component: () => import('@/views/login/login.vue'),
      meta: {
        index: 13,
      }
    },
    // 充值记录
    {
      path: '/rechargeRecord',
      name: 'rechargeRecord',
      component: () => import('@/views/record/index.vue'),
      meta: {
        index: 13,
      }
    },
    // 用户信息
    {
      path: '/myMessage',
      name: 'myMessage',
      component: () => import('@/views/message/index.vue'),
      meta: {
        index: 13,
      }
    },
    // 个人信息
    {
      path: '/information',
      name: 'information',
      component: () => import('@/views/information/index.vue'),
      meta: {
        index: 13,
      }
    },
    // 修改密码
    {
      path: '/changePassword',
      name: 'changePassword',
      component: () => import('@/views/information/changePassword.vue'),
      meta: {
        index: 13,
      }
    },
    // 钻石明细
    {
      path: '/diamondDetails',
      name: 'diamondDetails',
      component: () => import('@/views/record/index.vue'),
      meta: {
        index: 13,
      }
    },
    // 提现记录
    {
      path: '/withdrawalsRecord',
      name: 'withdrawalsRecord',
      component: () => import('@/views/record/index.vue'),
      meta: {
        index: 13,
      }
    },
    // 充值记录
    {
      path: '/rechargeGameRecord',
      name: 'rechargeGameRecord',
      component: () => import('@/views/record/index.vue'),
      meta: {
        index: 13,
      }
    },
    // 充值记录
    {
      path: '/aiRecharge',
      name: 'aiRecharge',
      component: () => import('@/views/aiRecharge/index.vue'),
      meta: {
        index: 13,
      }
    },
    // 影片记录
    {
      path: '/history/:type',
      name: 'history',
      component: () => import('@/views/history/index.vue'),
      meta: {
        index: 13,
      }
    },
    // 充值记录
    {
      path: '/myMessage/:type',
      name: 'myMessage',
      component: () => import('@/views/message/index.vue'),
      meta: {
        index: 13,
      }
    },
  ],

  scrollBehavior(to, from, savedPosition) {
    console.log(to, from, savedPosition,scrollInfo[to.name],'66666668888888')
    if (scrollInfo[to.name]) {
      nextTick(() => {
        document.querySelector('.h-page').scrollTop = scrollInfo[to.name]
        console.log(scrollInfo[to.name],to.name,'6666666666666666')
      })
    }
    // if (savedPosition) {
    //   console.log(savedPosition,'666666')
    //   return savedPosition;
    // } else {
    //   // 否则返回到顶部
    //   return { top: 0 };
    // }
  }
})
let Loadingtime = null
let loadingeds = [];
router.beforeEach((to, from, next) => {
  if (cachedComponents.value.includes(from.name)) {
    scrollInfo[from.name] = document.querySelector('.h-page').scrollTop || 0
  }
  if (!loadingeds.includes(to.name) && to.name !='layout' ) {
    const globalStore = global()
    globalStore.setShowLoading(true)
    loadingeds.push(to.name)
    if (Loadingtime) {
      clearTimeout(Loadingtime)
    }
    Loadingtime = setTimeout(() => {
      globalStore.setShowLoading(false)
    }, 1000)
  }
  next()
})

export default router
