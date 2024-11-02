import axios from 'axios'
import { showLoadingToast, closeToast, showFailToast } from 'vant'
import router from '../router'
import { config as myconfig } from '@/store/config'
import { Decrypt, Encrypt } from '@/utils/encrypt'
import { $get } from '.'
const maxRetries = 3
const http = axios.create({
  baseURL: "https://api.dahuangua.com",
  //  baseURL: "http://18.166.164.117",
  timeout: 30000,
})

/*请求合并只出现一次loading*/
let needLoadingRequestCount = 0
function showFullScreenLoading() {
  if (needLoadingRequestCount === 0) {
    /*loading加载*/
    loading('start')
  }
  needLoadingRequestCount++
}

function tryHideFullScreenLoading() {
  if (needLoadingRequestCount <= 0) return
  needLoadingRequestCount--
  if (needLoadingRequestCount === 0) {
    /*200ms 间隔内的 loading 合并为一次*/
    setTimeout(tryCloseLoading, 200)
  }
}
const tryCloseLoading = () => {
  if (needLoadingRequestCount === 0) {
    loading('end') /*loading加载*/
  }
}

/*loading加载*/
function loading(str) {
  if (str == 'start') {
    showLoadingToast({
      message: '加载中...',
      forbidClick: true,
      duration: 0,
      className: 'loading-toast'
      // overlay: true,
    })
  } else if (str == 'end') {
    closeToast()
  }
}

/**
 * @description 重试机制
 * @param {*} error 
 * @returns  
 */
const currentRetry = (error)=>{
  // 获取当前请求的重试次数
  const currentRetryCount = error.config.retryCount || 0;

  // 如果重试次数超过最大值, 直接返回错误
  if (currentRetryCount >= maxRetries) {
    showFailToast({
      message: $get(error,'response.data.message','') || '服务端异常',
      forbidClick: true,
      duration: 2000,
      className: 'loading-toast'
    })
    return Promise.reject(error)
  }

  // 增加重试次数
  error.config.retryCount = currentRetryCount + 1;
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(http(error.config));
    }, 1000*currentRetryCount+1);
  });
}

// request拦截器
/*请求拦截*/
http.interceptors.request.use(
  (config) => {
    config.retryCount = config.retryCount || 0;
    if (window.localStorage.getItem('configKey')) {
      config.headers['key'] = window.localStorage.getItem('configKey')
    }
    const configStore = myconfig()
    if (config.url.includes("gameapi")) {
      config.headers = {
        "Game-Auth": `Bearer ${$get(configStore,'gameInfo.apiToken','')}`,
        HostKey: window.location.host || "",
        "Content-Type": "application/json",
        "Accept-Language": "zh",
        "Accept-Device": "m", //h5:m
        "Accept-Encrypt": "m",
        "Accept-Device-Version": "1.0.0",
        "Accept-uuid": configStore.uuid,
      };
    } else {
      if (config.method == 'post') {
        config.headers['Content-Type'] = 'multipart/form-data; boundary=----WebKitFormBoundaryYJApAV6YxGA1pClA'
      }
      
      config.headers['authorization'] = configStore.token
      console.log(configStore.token,"base configStore.token")
    }
    if (config.showLoading) {
      showFullScreenLoading()
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// response 拦截器
http.interceptors.response.use(
  (res) => {
    // 关闭loading
    tryHideFullScreenLoading()
    if (typeof res.data !== 'object') {
      return currentRetry(res)
    }
    // 1003 用户未登录 需要登录才有权限 清除token 重新注册用户信息
    if (res.data.code == '1003') {
      localStorage.removeItem('token')
      showLoadingToast({
        message: '登录失效，重新登录中...',
        forbidClick: true,
        duration: 3000,
        className: 'loading-toast'
      })
      router.push({ path: '/home' })
      return null
    }
    if (res.config.url.includes("gameapi") && res.data.code == 401) {
      myconfig().loginGameCreate()
    }
    if(res.data.hash){
      res.data.result = Decrypt(res.data.result)
    }
    return res.data
  },
  (error) => {
    //关闭loading
    tryHideFullScreenLoading()
    return currentRetry(error)
  }
)

export default http
