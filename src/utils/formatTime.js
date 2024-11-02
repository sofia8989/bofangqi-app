// import Decimal from 'decimal.js'
// import moment from 'moment'
// import 'moment/locale/zh-cn'
import dayjs from 'dayjs'
// /**
//  * @description add  加
//  * @description sub  减
//  * @description mul  乘
//  * @description div  除
//  */
// export const Decimals = {
//   add: (a, b) => Number(new Decimal(Number(a)).add(new Decimal(Number(b)))),
//   sub: (a, b) => Number(new Decimal(Number(a)).sub(new Decimal(Number(b)))),
//   mul: (a, b) => Number(new Decimal(Number(a)).mul(new Decimal(Number(b)))),
//   div: (a, b) => Number(new Decimal(Number(a)).div(new Decimal(Number(b))))
// }

// /**
//  * 时间转换
//  * @params {String | Number} 时间字符串或者时间戳
//  */
// export const formatTimeAgo = time => {
//   moment.updateLocale('zh-cn', {
//     relativeTime: {
//       future: '%s内',
//       past: '%s前',
//       s: '%d秒',
//       m: '1分钟',
//       mm: '%d分钟',
//       h: '1小时',
//       hh: '%d小时',
//       d: '1天',
//       dd: '%d天',
//       M: '1个月',
//       MM: '%d个月',
//       y: '1年',
//       yy: '%d年'
//     }
//   })
//   time = time.replace(/-/g, '/')
//   const datetime = new Date(time)
//   const difftime = new Date()
//   const diff = Decimals.div(Decimals.sub(difftime.getTime(), datetime.getTime()), 1000)
//   if (Math.ceil(diff) <= 60) {
//     return '刚刚'
//   } else {
//     return moment(datetime).fromNow()
//   }
// }

// // 格式化时间
// export function parseTime(time, cFormat) {
//   if (arguments.length === 0) {
//     return null
//   }
//   const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
//   let date
//   if (typeof time === 'object') {
//     date = time
//   } else {
//     if (typeof time === 'string' && /^[0-9]+$/.test(time)) {
//       time = parseInt(time)
//     }
//     if (typeof time === 'number' && time.toString().length === 10) {
//       time = time * 1000
//     }
//     date = new Date(time)
//   }
//   const formatObj = {
//     y: date.getFullYear(),
//     m: date.getMonth() + 1,
//     d: date.getDate(),
//     h: date.getHours(),
//     i: date.getMinutes(),
//     s: date.getSeconds(),
//     a: date.getDay()
//   }
//   const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
//     let value = formatObj[key]
//     // Note: getDay() returns 0 on Sunday
//     if (key === 'a') {
//       return ['日', '一', '二', '三', '四', '五', '六'][value]
//     }
//     if (result.length > 0 && value < 10) {
//       value = '0' + value
//     }
//     return value || 0
//   })
//   return time_str
// }
// /**
//  * 时间转换
//  * @params {String | Number} 时间字符串或者时间戳
//  */
// export const formatTime = time => {
//   if (typeof time === 'string') {
//     time = time.replace(/-/g, '/')
//   }
//   // 拿到当前的时间戳（毫秒) -- 转换为秒
//   let currentTime = new Date()
//   let currentTimestamp = parseInt(currentTime.getTime() / 1000)
//   // 传进来的时间戳（毫秒)
//   let t = new Date(time)
//   let oldTimestamp = parseInt(t.getTime() / 1000)
//   // 年
//   let oldY = t.getFullYear()
//   // 月
//   let oldM = t.getMonth() + 1
//   // 日
//   let oldD = t.getDate()
//   // 时
//   let oldH = t.getHours()
//   // 分
//   let oldi = t.getMinutes()
//   // 秒
//   let olds = t.getSeconds()
//   // 相隔多少秒
//   let timestampDiff = currentTimestamp - oldTimestamp
//   if (timestampDiff < 60) {
//     // 一分钟以内
//     return '刚刚'
//   }
//   if (timestampDiff < 60 * 60) {
//     // 一小时以内
//     return Math.floor(timestampDiff / 60) + '分钟前'
//   }
//   // 今天的时间
//   if (
//     oldY === currentTime.getFullYear() &&
//     oldM === currentTime.getMonth() + 1 &&
//     oldD === currentTime.getDate()
//   ) {
//     // 10:22
//     return `${zeroize(oldH)}:${zeroize(oldi)}`
//   }
//   // 剩下的，就是昨天及以前的数据
//   return `${oldY}/${zeroize(oldM)}/${zeroize(oldD)} ${zeroize(oldH)}:${zeroize(oldi)}`
// }
// // 补0
// function zeroize(num) {
//   return num < 10 ? '0' + num : num
// }

export const formatTimeGame = (time ,type = 'YYYY-MM-DD HH:mm:ss')=> dayjs(time).format(type)
