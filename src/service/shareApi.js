import axios from '../utils/axios'

const api = '/Api'

/**
 *  @description 邀请列表
 * @param {string} params
 */
export const getMyInvitationList = (params)=> axios.get(`${api}/User/User/myInvitationList`, { params })