
import axios from '../utils/axios'
const api = '/Api'


// 获取AV分类列表
export function getTypeList(data) {

  return axios.post(`${api}/Video/Adult/getTypeList`, data)
}

//获取轮播图列表
export function getbannerList(data) {

  return axios.post(`${api}/Home/banner/list`, data)
}

/**
 * AV列表
 */
export function getAdultList(data) {

  return axios.post(`${api}/Video/Adult/adultList`, data)
}

// AV推荐列表
export function getRecommendedList(data) {

  return axios.post(`${api}/Video/Adult/getRecommendedList`, data)
}
// AV收藏
export const favoriteVideo =(data)=> axios.post(`${api}/Video/Video/favoriteVideo`, data)
// AV收藏
export const getvideoRecordList =(data)=> axios.post(`${api}/Video/Video/videoRecordList`, data)


/**
 * 获取性闻列表、性闻搜索
 * @param {object} data 入参数据对象
 */
export function reqarticleList(data) {
  return axios.post(`${api}/Article/Article/articleList`, data)
}

/**
 * 获取性闻文章详情
 * @param {number} id 文章id
 */
export function reqarticleDetail(id) {
  return axios.get(`${api}/Article/Article/articleDetail?articleId=${id}`)
}
/**
 * 获取性闻文章详情
 * @param {object} params 入参数据对象
 */
export function reqArticleLike(params) {
  return axios.get(`${api}/Api/Article/Article/like`,{params})
}
/**
 * 获取文章分类列表
 * @param {object} data 入参数据对象
 */
export function reqarticletypelist(params) {
  return axios.get(`${api}/Article/Article/getArticleTypeyList`, {params})
}
/**
 * 获取热门搜索关键词
 */
export function reqsearchKeyWords() {
  return axios.get(`${api}/Video/Adult/searchKeyWords`)
}
/**
 * 获取短视频列表
 * @param {object} data 入参数据对象
 */
export function reqvideoList(data) {
  return axios.post(`${api}/Video/ShortVideoDy/videoList`, data)
}


/**
 * 获取短视频列表
 * @param {object} data 入参数据对象
 */
export function getlqList(data) {
  return axios.post(`${api}/Video/ShortVideo/tag`, data)
}
/**
 * 获取短视频列表
 * @param {object} data 入参数据对象
 */
export function getlqShort(data) {
  return axios.post(`${api}/Video/ShortVideo/videoList`, data)
}

//获取轮播图列表
export function getfontAd(data) {

  return axios.post(`${api}/Home/index/fontAd`, data)
}
//获取赚钱游戏列表
export function getmoneyGame(data) {

  return axios.post(`${api}/Home/index/moneyAd`, data)
}
//获取同城交友列表
export function getscFriend(data) {

  return axios.post(`${api}/Home/index/jiaoyouAd`, data)
}
//获取直播列表
export function getAlive(data) {

  return axios.post(`${api}/Home/index/liveAd`, data)
}
//获取买药列表
export function getQqList(data) {
  return axios.post(`${api}/Home/index/qingquAd`, data)
}
//获取游戏列表
export function getgameList(data) {
  return axios.post(`${api}/Home/Index/gameColumn`, data)
}

/**
 * 文章点赞
 * @param {string} id 文章id
 */
// export function reqArticleLike(id) {
//   return axios.post(`${api}/Article/Article/like`, {articleId: id})
// }
/**
 * 短视频点赞
 * @param {string} id 短视频id
 */
// export function reqShortVideoLike(id) {
//   return axios.post(`${api}/Video/ShortVideo/like`, {vodId: id})
// }








