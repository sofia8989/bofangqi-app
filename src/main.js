import { createApp } from 'vue'
import 'lib-flexible/flexible'
import 'virtual:svg-icons-register'
import App from './App.vue'
import router from './router'
import store from './store'
import install from './install'
import { Lazyload } from 'vant'
import olazyload from "@/directives/lazyload"
import loadbg from "@/directives/loadbg"
// import '@vant/touch-emulator'

import '@/assets/css/reset.css'
import '@/assets/css/tailwind.css'
import 'vant/es/toast/index.css'
// import 'vant/lib/index.css'

import loadimage from '@/assets/images/lazy-default.jpg'
import errorimage from '@/assets/images/lazy-default.jpg'
import { $clickAd ,turestart} from "@/utils"
const app = createApp(App)
app.directive('olazyload',olazyload)
app.directive('loadbg',loadbg)
app.use(Lazyload, {
	loading: loadimage, //图片加载中时显示的默认图片
	error: errorimage //图片加载失败后显示的图片
})
if (import.meta.env.DEV || location.search.includes('console')) {
	var script = document.createElement('script');
	script.src = "https://cdn.jsdelivr.net/npm/eruda";
	document.body.append(script);
	script.onload = function () { eruda.init(); }
}

turestart()
app.config.globalProperties.$clickAd = $clickAd
app.use(store) // 挂载pina
app.use(router)
app.use(install)
app.mount('#app')
