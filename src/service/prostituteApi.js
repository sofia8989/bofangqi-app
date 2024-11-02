import axios from '../utils/axios'

const api = '/Api'

/**
 *  @description 楼凤列表
 * @param {string} params
 */
export const getProstituteList = (params)=> axios.get(`${api}/Prostitute/Prostitute/prostituteList`, { params })
/**
 * @description 楼凤分类
 * @param {*} params 
 * @returns 
 */
export const getProstituteTypeList = (params)=> axios.get(`${api}/Prostitute/ProstituteType/prostituteTypeList`, { params })
/**
 * @description 楼凤详情
 * @param {*} params 
 * @returns 
 */
export const getProsituteDetail = ( params ) => axios.get(`${api}/Prostitute/Prostitute/prostituteDetail`, { params })

/**
 * @description 楼凤的联系方式点击
 * @param {*} params 
 * @returns 
 */
export const prostituteClick= ( params ) => axios.post(`${api}/Prostitute/Prostitute/prostituteClick`, params)