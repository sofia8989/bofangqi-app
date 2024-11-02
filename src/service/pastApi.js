import axios from '../utils/axios'

const api = '/hyapi'
// 往期全部
export function getPastHistory(history_time, page) {
  return axios.get(`${api}/index/history?history_time=${history_time}&page=${page}`, {
    showLoading: false
  })
}

/**
 *  往期热门
 * @param {string} type   两种类型  标签搜索  关键字搜索
 * @param {string} keyword  查询的词
 * @param {number} page  页码
 */
export const getHotList = (type, keyword, page, showLoading) => {
  return axios.get(`${api}/index/api_search?${type}=${keyword}&page=${page}&vod_class=热门`, {
    showLoading
  })
}

/**
 * 获取历史
 * @param {id}   分类
 */
export const history = () => {
  return axios.get(`${api}/index/history`)
}
