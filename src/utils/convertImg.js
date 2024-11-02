import loadimage from '@/assets/images/lazy-default.jpg'
import { videoCoverMap } from '@/data/videoCover'
const fatchOption = {
    headers: {
        'Cache-Control': 'public, max-age=31536000',
        'Pragma': 'public, max-age=31536000',
        'Cache-directive':'public, max-age=31536000'
    }
}
export const setImgSrc =  (img, url = '') => {
    if (url && (url.endsWith('.xyz') || url.endsWith('.js')) && !url.startsWith('data:image')) {
        fetch(url,fatchOption).then(res=>res.blob()
            ).then((blob) =>{
                let flie = blob.slice(3, blob.size)
                let videoCoverKey = img.getAttribute('data-src')
                let imageUrl = URL.createObjectURL(flie) 
                img.src = imageUrl
                if(videoCoverKey){
                    videoCoverMap.set(videoCoverKey,imageUrl) 
                }
            }).catch(error=>{
                img.src = loadimage
                console.log(error);
            })
    } else {
        img.src = url
        img.onerror = () => {
            img.src = loadimage
        }
    }
}
export const setBgImg = (tag,url = '')=>{
    if (url && (url.endsWith('.xyz') || url.endsWith('.js'))) {
        fetch(url,fatchOption).then(res=>res.blob()).then((blob)=>{
            let flie = blob.slice(3, blob.size)
            tag.style.backgroundImage =  `url(${URL.createObjectURL(flie)})`
        }).catch(err=>{
            console.log(err);
            tag.style.backgroundImage = `url(${loadimage})`
        })
    } else {
        tag.style.backgroundImage = `url(${url})`
    }
}