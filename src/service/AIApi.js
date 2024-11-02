import http from '@/utils/axios'

/**
 * @description  Ai 生成
 * @param {*} params 
 * @returns 
 */
export const submitAi = (params) => http.post('/Api/User/User/ai', params)
/**
 * @description  Ai 记录
 * @param {*} params 
 * @returns 
 */
export const aiRecordList = (params) => http.get('/Api/User/User/aiRecordList', { params })
/**
 * @description  图片模版列表
 * @param {*} params 
 * @returns 
 */
export const picTempPageList = (params) => http.get('/Api/User/User/picTempPageList', { params })
/**
 * @description  视频模版列表
 * @param {*} params 
 * @returns 
 */
export const videoTempPageList = (params) => http.get('/Api/User/User/videoTempPageList', { params })
