import axios from '../utils/axios'

const api = '/Api'

/**
 *  @description vip订单列表
 * @param {Object} params  
 */
export const getVipOrderList = (params) => axios.get(`${api}/Market/Vip/getVipOrderList`,{ params })
/**
 *  @description 创建开通VIP订单
 * @param {Object} data  
 */
export const createVipOrder = (data) => axios.post(`${api}/Market/Vip/createVipOrder`,data)
/**
 *  @description vip订单状态列表
 * @param {Object} params  
 */
export const getVipOrderStatus = (params) => axios.get(`${api}/Market/Vip/getVipOrderStatus`,{ params })
/**
 *  @description 支付渠道列表
 * @param {Object} params  
 */
export const paymentChannelList = (params= {}) => axios.get(`${api}/Payment/PaymentChannel/paymentChannelList`,{ params })

/**
 *  @description 支付渠道列表
 * @param {Object} params  
 */
export const getVipGoodsList = (params= {}) => axios.get(`${api}/Market/VipGoods/vipGoodsList`,{ params })


/**
 *  @description AI 商品列表
 * @param {Object} params  
 */
export const getAiGoodsList = (params ={}) => axios.get(`${api}/Market/VipGoods/aiGoodsList`,{ params })