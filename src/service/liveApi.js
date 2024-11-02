import axios from '../utils/axios'

const api = '/Api'


/**
 *  @description 获取直播列表
 * @param {Object} data  
 */
export const getLiveList = (params) => axios.get(`${api}/Live/Live/liveList`,{ params })
/**
 *  @description 获取直播详情
 * @param {Object} data  
 */
export const getLiveDetail = (params) => axios.get(`${api}/Live/Live/liveDetail`,{ params })