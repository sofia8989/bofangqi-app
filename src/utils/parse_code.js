import  QrCode from 'qrcode-decoder'
export const getQrUrl = (file)=>{
    const url = window.webkitURL.createObjectURL(file)
    const qr = new QrCode()
    return qr.decodeFromImage(url)
}
