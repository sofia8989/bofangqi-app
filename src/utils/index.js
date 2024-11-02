import { config } from '@/store/config'
import { click } from '@/service/home'
import useClipboard from 'vue-clipboard3'
import { showToast,showFailToast } from "vant";
import { computed } from 'vue'
import router from "@/router"
export const cachedComponents = computed(() => {
	const routes = router.getRoutes()
	return routes.filter((route) => route.meta.keepAlive && typeof route.name === 'string').map((route) => route.name)
})
export const getImgUrl = (item = {}, key = "imageUrl") => {
	// let { fileType, imageUrl = item[key]  } = item
	
	// if (!imageUrl) {
	// 	return ''
	// }
	// const configStore = config()
	// const prefixImgUrl1 = import.meta.env.DEV ? configStore.configData.config.CDN : location.origin
	// // const prefixImgUrl1 = "https://frontweb.sinaav.co"
	// const prefixImgUrl2 = configStore.configData.config.AwsS3Host || location.origin
	// let prefix = fileType == 'up' ? prefixImgUrl1 : fileType == 'awsS3' ? prefixImgUrl2 : ''
	// return prefix + imageUrl
	return item
}
export const getVideoCover = (url)=>{
	return url;
	
	// return url.replace(/.[^/.]+$/, '.xyz')
}
export const getVideoUrl = (item) => {
	return item.url
}
export const openLink = (src, type = "_blank") => {
	setTimeout(() => window.open(src, type));
};

export const $clickAd = (advertise = {}, key = 'adId') => {
	let { adId, url } = advertise
	if (!adId) {
		adId = advertise[key]
	}
	const deviceId = config().uuid
	const myScreen = `${screen.availWidth}x${screen.availHeight}`
	let pageName = window.localStorage.getItem("_pageName") || 'index.html'
	// _czc && _czc.push(["_trackEvent",'广告点击',pageName,adId]);
	click({ adId, pageName, screen: myScreen, deviceId }).then(res => {}).catch(err=>{
		showFailToast({
			message: '广告点击失败',
			forbidClick: true,
			duration: 2000,
			className: 'loading-toast'
		  })
	    // _czc && _czc.push(["_trackEvent",'广告点击失败',pageName,adId]);
	})
	if (url.startsWith('http')) {
		url = url.replace('{channelCode}', 'xl' + pageName)
		openLink(url)
	}
}
export const deepClone = (source) => {
	if (typeof source !== 'object' || source == null) {
		return source;
	}
	const target = Array.isArray(source) ? [] : {};
	for (const key in source) {
		if (Object.prototype.hasOwnProperty.call(source, key)) {
			if (typeof source[key] === 'object' && source[key] !== null) {
				target[key] = deepClone(source[key]);
			} else {
				target[key] = source[key];
			}
		}
	}
	return target;
}

const formatPath = (path) => {
	// 若是数组，则直接返回
	if (Array.isArray(path)) return path;
	// 若有 '[',']'，则替换成将 '[' 替换成 '.',去掉 ']'
	return path.replace(/\[/g, ".").replace(/\]/g, "").split(".");
};

export const $set = (object, path, value) => {
	if (typeof object !== "object") return object;
	formatPath(path).reduce((p, c, i, _) => {
		if (i === _.length - 1) {
			p[c] = value;
			return null;
		} else if (c in p) {
			return p[c];
		} else {
			p[c] = /^[0-9]{1,}$/.test(_[i + 1]) ? [] : {};
			return p[c];
		}
	}, object);
	return object;
};
export const $get = (object, path, defaultValue) => {
	if (typeof object !== "object") return defaultValue;
	return formatPath(path).reduce((p, c) => (p || {})[c], object) || defaultValue;
};
export const inject_video = (list = [], VideoInsertion = [], interval = 6) => {
	let _list = deepClone(list)
	_list.length > 0 && VideoInsertion.forEach((item, i) => {
		let index = (i + 1) * interval - 1
		if (_list[index]) {
			_list.splice(index, 0, item)
		}
	})
	return _list
}
export const inject_ad_home_swper = (list, VideoInsertion, interval = 6) => {
	let _list = deepClone(list)
	if (_list.length && VideoInsertion.length) {
		VideoInsertion.forEach((item, i) => {
			let index = i == 0 ? 0 : i * interval - 1
			if (_list[index]) {
				_list.splice(index, 0, item)
			}
		})
	}
	return _list
}

export const inject_advertise = (list = [], advertise, interval = 6) => {
	let _list = deepClone(list)
	let length = _list.length
	if (length > 0 && advertise) {
		let num = Math.floor(_list.length / interval)
		if (num > interval - 1) {
			num += Math.floor(num / interval - 1)
		}
		for (let i = 0; i < num; i++) {
			let index = (i + 1) * interval - 1
			if (_list[index]) {
				_list.splice(index, 0, advertise)
			}
		}
	}
	return _list
}
export const inject_shortVideo_advertise = (list = [], advertise, interval = 6) => {
	let _list = deepClone(list)
	let length = _list.length
	if (length > 0 && advertise) {
		let num = Math.floor(_list.length / interval)
		if (num > interval - 1) {
			num += Math.floor(num / interval - 1)
		}
		for (let i = 0; i < num; i++) {
			let index = i * interval - 1
			if (_list[index]) {
				_list.splice(index, 0, advertise)
			}
		}
	}
	return _list
}
export const inject_advertise_swiper = (list = [], advertise = [], choiceVideoList = [], interval = 6, inVideoCount = 7) => {
	
	let _list = deepClone(list)

	let length = _list.length
	
	if (length > 0) {
		!choiceVideoList.length && (_list[0] = { type: 2, ..._list[0] })
		let num = Math.floor(_list.length / interval)
		if (num > interval - 1) {
			num += Math.floor(num / interval - 1)
		}
		if (advertise.length) {
			let advertise_index = 0
			for (let i = 1; i <= num; i++) {
				let index = i * interval - 1
				if (_list[index]) {
					if (!advertise[advertise_index]) {
						advertise_index = 0
					}
					_list.splice(index, 0, advertise[advertise_index])
					advertise_index++
					//  _list.splice(index, 0, { type: 1, list: advertise })
					console.log(_list,'1111111111')
				}
			}
		}

		if (choiceVideoList.length) {
			let n = Math.floor(_list.length / inVideoCount)
			if (n > inVideoCount - 1) {
				n += Math.floor(n / inVideoCount - 1)
			}
			
			for (let i = 0; i <= n; i++) {
				let index = i * inVideoCount
				let item = choiceVideoList[i]
				if (_list[index] && item) {
					// _list.splice(index, 0, { type: 2, ...item })
					_list.forEach((item,i) =>{
						if(index==i){
							item.type=2
						}
					})
				}
			}
			
		}
	}
	return _list
}
export const inject_advertise_live_swiper = (list = [], advertise = [], interval = 6) => {
	let _list = deepClone(list)
	let length = _list.length
	if (length > 0 && advertise.length > 0) {
		let num = Math.floor(_list.length / interval)
		if (num > interval - 1) {
			num += Math.floor(num / interval - 1)
		}
		for (let i = 1; i <= num; i++) {
			let index = i * interval - 1
			if (_list[index]) {
				_list.splice(index, 0, advertise)
			}
		}
	}
	return _list
}
export const setVideoType = (list = []) => {
	let _list = deepClone(list)
	let length = _list.length
	if (length > 0) {
		_list[0] = { type: 2, ..._list[0] }
	}
	return _list
}

export const randomCount = (min, max) => {
	try {
		min = Math.floor(min)
		max = Math.floor(max)
		if (min >= max) return max
		let count = Math.floor(Math.random() * max)
		return count < min ? randomCount(min, max) : count
	} catch (error) {
		return min
	}
}

export const copyString = async (text) => {
	const { toClipboard } = useClipboard()
	console.log(text,'url')
	try {
		await toClipboard(text)
		showToast('复制成功')
	} catch (error) {
		showToast('复制失败')
	}
}
export const turestart = () => {
	let lastTouchEnd = 0;
	document.documentElement.addEventListener('touchend', function (event) {
		var now = Date.now();
		if (now - lastTouchEnd <= 300) {
			event.preventDefault();
		}
		lastTouchEnd = now;
	}, false);
}


export const getHashPageName = () => {
	let params = {
		pageName: "index.html"
	};
	try {
		let str = (location.href.split('?')[1] || '').split('#')[0]
		if (str) {
			let paramsArr = str.split('&')
			for (let i = 0, len = paramsArr.length; i < len; i++) {
				let [key, value] = paramsArr[i].split('=')
				params[key] = value;
			}
		}
		if (params.pageName !== "index.html") {
			window.localStorage.setItem("_pageName", params.pageName)
		}
	} catch (error) {
		console.error('error :>> ', error);
	}

	return params
}
export const fillIn = (num) => {
	return num > 9 ? num : '0' + num
}
export const setExpiration = () => {
	window.localStorage.setItem("_expirationTime", `${new Date().getMonth()}-${new Date().getDate()}`)
}
export const checkExpiration = () => {
	let cur_time = `${new Date().getMonth()}-${new Date().getDate()}`
	let lastTime = window.localStorage.getItem('_expirationTime')
	if (cur_time != lastTime) {
		window.localStorage.removeItem("_videoIdList")
		window.localStorage.removeItem("shortVideoCount")
		window.localStorage.removeItem("_live_id")
		window.localStorage.removeItem("_LiveCount")
	}
	setExpiration()
}

export const loadApp = () => {
	let channelCode = window.localStorage.getItem("_pageName") || "f001"
	let downloadPageUrl = $get(config(), 'appConfig.DownloadPageUrl', "").split('?')[0]
	if (downloadPageUrl) {
	  downloadPageUrl = `${downloadPageUrl}?channelCode=${channelCode}`
	}
	const url = downloadPageUrl || `${window.location.origin}/landpage?channelCode=${channelCode}`
	openLink(url)
}

export const formatter = (val, val1) => {
	if (val) {
		let num = +val
		return num > val1 ? val1 + '' : val
	} else {
		return ''
	}


}


export const downloadFile = (content, fileName) => {
	let base64ToBlob = function (code) {
		let parts = code.split(';base64,');
		let contentType = parts[0].split(':')[1];
		let raw = window.atob(parts[1]);
		let rawLength = raw.length;
		let uInt8Array = new Uint8Array(rawLength);
		for (let i = 0; i < rawLength; ++i) {
			uInt8Array[i] = raw.charCodeAt(i);
		}
		return new Blob([uInt8Array], {
			type: contentType
		});
	};
	let aLink = document.createElement('a');
	let blob = base64ToBlob(content); //new Blob([content]);
	aLink.download = fileName;
	aLink.href = URL.createObjectURL(blob);
	aLink.click();
};

export const downloadApp = ()=>{
	let src= $get(config(),'configData.config.AndroidDownloadUrl','') 
	if(src){
	let iframe = document.createElement('iframe')
		iframe.style.display = 'none'
		iframe.src = "javascript: '<script>location.href=\"" + src + "\"<\/script>'";
		document.getElementsByTagName('body')[0].appendChild(iframe)
	}

}
