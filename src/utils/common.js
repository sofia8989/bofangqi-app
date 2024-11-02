import { ref } from "vue"
/**
 * @description 获取URL参数
 * @param {string} variable  参数名称
 * @return {string} 获取的参数值
 */

export const getQueryVariable = (variable) => {
  var query = window.location.search.substring(1)
  var vars = query.split('&')
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split('=')
    if (pair[0] == variable) {
      return pair[1]
    }
  }
  return ''
}

// 设置密钥
var DECRYPT_KEY = '6176a1e024f316261ae36cafc6617c3d'

/**
 * @description 将一个带符号的十六进制数转换为带符号的二进制格式
 */
const hex2bin = function (hex) {
  var bytes = []
  for (var i = 0; i < hex.length - 1; i += 2) {
    bytes.push(parseInt(hex.substr(i, 2), 16))
  }
  return String.fromCharCode.apply(String, bytes)
}

/**
 * @description 获取URL参数
 * @param {string} variable  加密后的字符串
 * @param {string} key  秘钥
 * @return {string}  返回解密后的参数
 */
export const decrypt = (str) => {
  var hex2binStr = hex2bin(str)
  var strDecrypt = ''
  for (var i = 0; i < hex2binStr.length; i++) {
    var value = hex2binStr.charCodeAt(i) - DECRYPT_KEY.charCodeAt(i % 32)
    strDecrypt += String.fromCharCode(value - (i % 10))
  }
  return strDecrypt
}
/**
 * @description 获取当前设备类型
 */
export const deviceType = () => {
  var u = navigator.userAgent
  var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1 //android终端
  var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/) //ios终端
  if (isAndroid) {
    return 'Android'
  } else if (isiOS) {
    return 'IOS'
  } else {
    return 'other'
  }
}
/**
 * @description 判断是否是书签打开
 * @param {boolean} flag 
 * @returns 否是书签打开
 */
// 
export function isInStandaloneMode(flag = false) {
  if (
    window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone ||
    document.referrer.includes('android-app://')
  ) {
    if (flag) {
      if (!sessionStorage.getItem('isStandalone')) {
        return true
      } else {
        return false
      }
    } else {
      return true
    }
  }
  return false
} 
export const inStandaloneMode = ref(isInStandaloneMode())
/**
 * 对象数据去重
 * @param {array} arr 
 * @param {string} uniId 
 * @returns 
 */
export const uniqueFunc = (arr, uniId) => {
  const res = new Map();
  return arr.filter((item) => !res.has(item[uniId]) && res.set(item[uniId], 1));
}

export const img2base64 = (src) => {
  fetch(src)
    .then(response => response.blob())
    .then(imageBlob => {
      let reader = new FileReader();
      reader.readAsDataURL(imageBlob);
      reader.onloadend = function () {
        let base64data = reader.result;
        return base64data
      }
    })
    .catch(error => console.error(error));

}
