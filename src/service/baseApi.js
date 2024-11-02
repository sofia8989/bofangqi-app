
import axios from '../utils/axios'
const api = '/Api'

//热门标签
export function getHotLable(data) {
  return axios.post(`${api}/Video/type/hot`, data)
}

//免费视频
export function getFreeList(data) {
  return axios.post(`${api}/Video/video/videoFree`, data)
}
//点赞（视频）
export function getLike(data) {
  return axios.post(`${api}/Video/ShortVideoDy/like`, data)
}
//取消点赞（视频）
export function cancelLike(data) {
  return axios.post(`${api}/Video/ShortVideoDy/likeCancel`, data)
}
//短视频评论列表
export function commentList(data) {
  return axios.post(`${api}/Video/ShortVideoDy/replyList`, data)
}

//评论
export function sendComment(data) {
  return axios.post(`${api}/Video/ShortVideoDy/reply`, data)
}
//收藏（视频）
export function getCollect(data) {
  return axios.post(`${api}/Video/ShortVideoDy/collect`, data)
}
//取消收藏（视频）
export function cancelCollect(data) {
  return axios.post(`${api}/Video/ShortVideoDy/collectCancel`, data)
}
//发送帖子
export function sendRelease(data) {
  return axios.post(`${api}/Post/Post/release`, data)
}
//上传图片
export function upLoadImg(data) {
  return axios.post(`${api}/Home/Index/upload`, data)
}
//茶馆列表
export function teaList(data) {
  return axios.post(`${api}/Post/Post/list`, data)
}

//点赞茶馆
export function teaClick(data) {
  return axios.post(`${api}/Post/Post/click`, data)
}
//取消茶馆
export function teaCancelClick(data) {
  return axios.post(`${api}/Post/Post/clickCancel`, data)
}
//帖子回复
export function sendList(data) {
  return axios.post(`${api}/Post/Post/replay`, data)
}
//关注帖子
export function fllow(data) {
  return axios.post(`${api}/Post/Post/focus`, data)
}
//取消关注
export function cancelFllow(data) {
  return axios.post(`${api}/Post/Post/focusCancel`, data)
}
//个人中心 我的发布
export function mySend(data) {
  return axios.post(`${api}/Post/Post/personList`, data)
}
//帖子--详细内容：
export function info(data) {
  return axios.post(`${api}/Post/Post/info`, data)
}
//删除帖子：
export function deleteSc(data) {
  return axios.post(`${api}/Post/Post/delete`, data)
}
//修改密码
export function changePassWord(data) {
  return axios.post(`${api}/User/User/updatePass`, data)
}
// 修改资料接口
export function changeData(data) {
  return axios.post(`${api}/User/User/updateUserInfo`, data)
}

// 登录接口
export function login(data) {
  return axios.post(`${api}/User/Login/passWdLogin`, data)
}
// 注册接口
export function registe(data) {
  return axios.post(`${api}/User/Login/register`, data)
}
// 我的消息
export function notice(data) {
  return axios.post(`${api}/Notice/Notice/list`, data)
}

// 我的邀请码
export function inviteCode(data) {
  return axios.post(`${api}/User/User/inviteCode`, data)
}
// 识别身份卡
export function cardLogin(data) {
  return axios.post(`${api}/User/Login/identityCardLogin`, data)
}
// 反馈意见
export function add(data) {
  return axios.post(`${api}/FeedBack/FeedBack/add`, data)
}
// 反馈记录
export function feedList(data) {
  return axios.post(`${api}/FeedBack/FeedBack/list`, data)
}
// 联系我们
export function tgNum(data) {
  return axios.post(`${api}/CustomerService/CustomerService/list`, data)
}
// 关注博主
export function focusDy(data) {
  return axios.post(`${api}/Video/ShortVideoDy/focus`, data)
}
// 取消关注博主
export function focusCancel(data) {
  return axios.post(`${api}/Video/ShortVideoDy/focusCancel`, data)
}
// 收藏博主
export function focusList(data) {
  return axios.post(`${api}/User/User/focusDy`, data)
}












