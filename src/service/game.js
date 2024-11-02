import axios from '@/utils/axios'
const Api = '/gameapi'
/**
 * @description 登录
 * @param {*} params 
 * @returns 
 */
export const GameCreate = (params) => axios.post(`${Api}/xl/user/create`,params)
/**
 * @description 游戏列表
 * @param {*} params 
 * @returns 
 */
export const GetGameList = (params) => axios.post(`${Api}/v1/platform/slotGameList`,params)
/**
 * @description 登录3方游戏
 * @param {*} params 
 * @returns 
 */
export const PlatformLogin = (params) => axios.post(`${Api}/v1/platform/login`,params)
/**
 * @description 提现
 * @param {*} params 
 * @returns 
 */
export const Withdrawal = (params) => axios.post(`${Api}/xl/user/withdrawal`,params)
/**
 * @description 银行列表
 * @param {*} params 
 * @returns 
 */
export const GetbankList = (params) => axios.post(`${Api}/v1/wallet/bankList`,params)

/**
 * @description 查询余额
 * @param {*} params 
 * @returns 
 */
export const AllQueryBalance = (params) => axios.post(`${Api}/v1/platform/allQueryBalance`,params)
/**
 * @description 划转
 * @param {*} params 
 * @returns 
 */
export const CoinTransfer = (params) => axios.post(`${Api}/v1/platform/coinTransfer`,params)
/**
 * @description 充值金额
 * @param {*} params 
 * @returns 
 */
export const AmountList = (params) => axios.post(`${Api}/v1/pay/amountList`,params)

/**
 * @description 充值通道列表
 * @param {*} params 
 * @returns 
 */
export const PayOnLineList = (params) => axios.post(`${Api}/v1/pay/payOnLineList`,params)
/**
 * @description 充值接口
 * @param {*} params 
 * @returns 
 */
export const OnlinePay = (params) => axios.post(`${Api}/v1/pay/onlinePay`,params)
/**
 * @description 充值记录
 * @param {*} params 
 * @returns 
 */
export const DepositRecords = (params) => axios.post(`${Api}/v1/depositAndWithdrawal/depositRecords`,params)
/**
 * @description 虚拟币协议
 * @param {*} params 
 * @returns 
 */
export const VcTypeBox = (params) => axios.post(`${Api}/v1/wallet/vcTypeBox`,params)
/**
 * @description 提现
 * @param {*} params 
 * @returns 
 */
export const WithdrawalRecords = (params) => axios.post(`${Api}/v1/depositAndWithdrawal/withdrawalRecords`,params)