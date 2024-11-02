// import SvgIcon from '@/components/SvgIcon.vue'



import DetailItem from '@/components/DetailItem.vue'
import swipeAd from "@/components/swipeAd.vue";


import NavFooter from '@/components/NavFooter.vue'
import NavHeader from '@/components/NavHeader.vue'


import ScrollList from '@/components/ScrollList.vue'


export default {
	install(app) {
		// app.component('SvgIcon', SvgIcon)
		app.component('DetailItem', DetailItem)
		app.component('NavFooter', NavFooter)
		app.component('NavHeader', NavHeader)
		app.component('ScrollList', ScrollList)
		app.component('SwipeAd', swipeAd)
		// app.component('imgBox', imgBox)

	}
}
