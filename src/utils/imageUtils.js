import { ref, computed } from 'vue'
import { config } from '@/store/config'
import { $get} from '@/utils';
const configStore = config()
const configData = computed(() => $get(configStore, 'configData', {}))

const imageBase64 = ref()
const imgUrl = ref('')
const convertBase64ToUrl = (fileContent) => {
        const byteCharacters = atob(fileContent); // 解码 Base64
        const byteNumbers = new Uint8Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const blob = new Blob([byteNumbers], { type: 'image/png' }); // 根据实际类型修改
        return URL.createObjectURL(blob); // 创建 URL
  
}
export const fetchImage = async(url) => {
    if(url==''){
          return
    }
    // imgUrl.value = configData.value.config.AwsS3Host +url
    if (url.substring(0, 4)=='http') {
        console.log('zheli',url)
        imgUrl.value = url
    } else if(url.substring(0, 4)=='bold' ){
        return
    }else {
        imgUrl.value = configData.value.config.AwsS3Host  + url
    }
    // console.log(imgUrl.value,'------------------------1------------------')
    
    const response = await fetch(imgUrl.value);
    // console.log(response,'------------------------3------------------')
    if (!response.ok) {
        // console.log("55555555555555")
        return 
    }
     imageBase64.value =await response.text()
      let baseVal='data:image/jpeg;base64,'+imageBase64.value
    // let localUrl=convertBase64ToUrl(imageBase64.value)
   
    //  console.log(baseVal,'------------------------4------------------')
    return baseVal
    
} 


