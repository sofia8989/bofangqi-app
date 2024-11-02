import axios from '../utils/axios'

const api = '/Api'



export const home = (params) => {
  return axios.post(api + '/Home/index/index', params);
}

export const click = (params) => {
  return axios.post(api + '/Home/index/click', params);
}
export const downClick = (params) => {
  return axios.post(api + '/Home/Channel/downClick', params);
}

export const install = (params) => {
  return axios.post(api + '/Home/Channel/install', params);
}

/**
 * 通过设备登陆，获取token
 */
export const reqdeviceLogin = (params) => {
  return axios.post(api + '/User/Login/deviceLogin', params)
}


export const recordViewApi = (params) => {
  return axios.post(api + '/Home/Index/recordView', params);
}


/**
 *  @description 获取 app 下载链接
 * 
 */
export const getConfigApp = () =>  axios.post(`/Api/Home/Config/app`, {})


/**
 *  @description 导航统计
 * 
 */
export const dhView = (params) =>  axios.post(`/Api/Home/Index/dhView`, params)

/**
 *  @description 播放器统计
 * 
 */
export const welfareView = (params) =>  axios.post(`/Api/Home/Index/welfareView`, params)