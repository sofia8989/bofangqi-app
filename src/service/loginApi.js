import axios from '../utils/axios'

const api = '/Api'

/**
 *  @description 获取短信验证码
 * @param {Object} data  
 */
export const getMessageCode = (params) => axios.get(`${api}/Common/VerifyCode/getMessageCode`,{ params })
/**
 *  @description 通过短信登陆
 * @param {Object} data  
 */
export const messageLogin = (data) => axios.post(`${api}/User/Login/messageLogin`,data)
/**
 *  @description 绑定手机号
 * @param {Object} data 
 */
export const bindCellPhone = (data) => axios.post(`${api}/User/User/bindCellPhone`,data)
/**
 *  @description 身份卡登录
 * @param {Object} data 
 */
export const identityCardLogin = (data) => axios.post(`${api}/User/Login/identityCardLogin`,data)
/**
 *  @description 刷新 用户信息
 * @param {Object} data 
 */ 
export const getUserInfo = (params ={}) => axios.get(`${api}/User/User/getUserInfo`,{params})