import axios from '../utils/axios'

const api = '/Api'

/**
 *  搜索列表
 * @param {string} id   视频或文章的ID
 */
export function getVideoDetail(id) {
	return axios.get(`${api}/Video/Adult/adultDetail?vodId=${id}`, { showLoading: true })
}


export function getVideoHome(data) {
	return axios.post(`${api}/Video/Video/index`, data, { showLoading: true })
}


export function searchVideo(data) {
	return axios.post(`${api}/Video/Video/videoList`, data, { showLoading: true })
}

export function videoDetail(id) {
	return axios.get(`${api}/Video/Video/videoDetail?vodId=${id}`, { showLoading: true })
}


export function getRecommendedList(data) {
	return axios.post(`${api}/Video/Video/getRecommendedList`, data)
}

// 二级分类
export const getTopSubTypeList = (data) => axios.post(`${api}/Video/Adult/getTopSubTypeList`, data)



