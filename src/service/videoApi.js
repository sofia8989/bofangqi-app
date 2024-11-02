import axios from '../utils/axios'

const api = '/hyapi'
/**
 *  搜索列表
 * @param {string} type   两种类型  标签搜索  关键字搜索
 * @param {string} keyword  查询的词
 * @param {number} page  页码
 */
export function getSearchList({ type, keyword, page, vod_type, showLoading = false }) {
  const params = {
    [type]: keyword,
    page
  }
  if (vod_type) {
    params.vod_type = vod_type
  }
  return axios.get(`${api}/index/api_search`, { params, showLoading })
}

/**
 *  搜索列表
 * @param {string} id   视频或文章的ID
 */
export function getVideoDetail({ id, type, rnd, showLoading = true }) {
  let params = {
    id
  }
  if (type) {
    params.vod_type = type
  }
  if (rnd) {
    params.by = rnd
  }
  return axios.get(`${api}/index/api_detail`, { params, showLoading })
}

/**
 *  获取导航栏 吃瓜投稿等详情数据
 * @param {string} id     导航类别ID
 */
export function getArtDetail(id) {
  return axios.get(`${api}/index/api_art?id=${id}`, { showLoading: true })
}

/**
 *  获取视频分类数据
 */
export function getVideoCategory(params, showLoading = false) {
  return axios.get(`${api}/index/category2`, { params, showLoading })
}
/**
 *  获取视频页面数据
 */
export function getVideoHome(params, showLoading = false) {
  return axios.get(`${api}/index/vod_index`, { params, showLoading })
}
