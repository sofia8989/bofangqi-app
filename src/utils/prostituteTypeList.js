import { ref } from "vue";
import { getProstituteTypeList } from '@/service/prostituteApi'
let isReq = false
let prostituteTypeList = ref([])
export const get_prostitute_type_list = ()=>{
    const getData = async()=>{
        let res = await getProstituteTypeList({})
	     prostituteTypeList.value = (res.result || [])
         isReq = true
    }
    !isReq && getData() 
    return { prostituteTypeList }
}