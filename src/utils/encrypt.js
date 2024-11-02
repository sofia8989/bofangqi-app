import CryptoJS from 'crypto-js'

const key = CryptoJS.enc.Utf8.parse("80k36418d029ydzw")  //十六位十六进制数作为密钥
// const iv = CryptoJS.enc.Utf8.parse('ABCDEF1234123412');   //十六位十六进制数作为密钥偏移量

//解密方法
export function Decrypt(encryptedData) {
    try {
        let decodedData = CryptoJS.enc.Base64.parse(encryptedData);
        let decryptedData = CryptoJS.AES.decrypt({ ciphertext: decodedData }, key, { mode: CryptoJS.mode.ECB }).toString(CryptoJS.enc.Utf8);
        return JSON.parse(decryptedData) ;
    } catch (error) {
        console.error(error)
        return {}
    }
    
}

//加密方法
export function Encrypt(word) {
    let srcs = CryptoJS.enc.Utf8.parse(word);
    let encrypted = CryptoJS.AES.encrypt(srcs, key, { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 });
    return encrypted.ciphertext.toString().toUpperCase();
}

export default {
    Decrypt,
    Encrypt
}