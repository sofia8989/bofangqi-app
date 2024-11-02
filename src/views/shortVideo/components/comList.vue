<!-- 联系弹窗 -->
<template>
  <van-popup v-model:show="showBottom" class="!bg-white scrollbar !overflow-y-hidden text-[#2F2F42]" position="bottom"
    round :style="{ height: '60%' }" teleport="body" close-on-click-overlay>
    <div class="sticky top-0 left-0 right-0  py-[16px] px-[23px] flex justify-between title">
      <div class="w-[20px]"></div>
      <div>评论</div>
      <van-icon class="" name="close" color="#2F2F42" size="20" @click="showBottom = false" />
    </div>
    <div class="w-full h-[600px] overflow-y-auto scrollbar chooseList">

      <div class="leaveList  px-[23px]">
        <div class="leave" v-for="item, index in tgList" :key="index">
          <div class="nav">
            <div class="left">
              <img :src="item.avatar" />
              <div class="name">{{ item.nickname }}</div>
            </div>
          </div>
          <div class="content">
            {{ item.content }}
          </div>
        </div>


      </div>
      <div class="reply">
        <van-field v-model="sendMessage" placeholder="请输入内容" :style="{ borderColor: '#F0F0F0', borderWidth: '2px' }"
          style="width: 283px;height: 36px;background-color: #F6F6F6;
     border: 1px solid #F0F0F0;border-radius: 10px;" />
        <div class="btn" @click="gosendBtn">评论</div>
      </div>

    </div>


  </van-popup>
</template>
<script setup>
import { computed, onMounted, ref } from "vue";
import { commentList, sendComment } from '@/service/baseApi'
import { copyString, $get } from '@/utils'
import { config } from '@/store/config'

const deviceUser = computed(() => $get(configStore, 'deviceUser', {}))
const configStore = config()
const props = defineProps({
  cur_vip: {
    type: Object,
    default: () => ({})
  },
  modelValue: {
    type: Boolean,
    default: false
  },
  id: {
    type: Number,
    required: true,
  }
})
const emits = defineEmits(['update:modelValue', 'payConfirm'])
const tgList = ref([])
const isInitialized = ref(false) // 新增的变量，用于标记是否已初始化

const init = async () => {
  if (isInitialized.value) return; // 如果已初始化，直接返回
  tgList.value = []
  
  let params = {
    vodId: props.id,
  }
  const res = await commentList(params)
  if (res.code == 200) {
    tgList.value.push(...res.result.list)
    isInitialized.value = true; // 标记为已初始化
  }
}

const sendMessage = ref('')
const gosendBtn = async () => {
  const listData = await sendComment({
    vodId: props.id,
    content: sendMessage.value
  })

  if (listData.code == 200) {
    let Obj = {
      nickname: deviceUser.value.nickname,
      content: sendMessage.value,
      avatar: deviceUser.value.avatar,
    }
    tgList.value.push(Obj)
    sendMessage.value = ''
  }
}

const copyUrl = (url) => {
  copyString(url)
}
console.log(props.id, '88888')
init()
onMounted(() => {
 
})

// 控制弹窗显示的计算属性
const showBottom = computed({
  set(val) {
    emits("update:modelValue", val)
  },
  get() {
    return props.modelValue
  }
})
</script>
<style lang="less" scoped>
.title {
  font-family: PingFang SC;
  font-size: 16px;
  font-weight: 600;
  line-height: 22.4px;
  text-align: center;
  color: var(--c3, #333333);


}

.leaveList {
  overflow: scroll;
  height: 60%;
  padding-bottom: 30px;

  .leave {
    .nav {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .left {
        display: flex;
        align-items: center;

        img {
          width: 40px;
          height: 40px;
          border-radius: 20px;
          margin-right: 10px;
        }

        .name {
          font-family: PingFang SC;
          font-size: 14px;
          font-weight: 600;
          line-height: 19.6px;
          text-align: left;

        }

      }

      .right {
        display: flex;

        img {
          width: 16px;
          height: 16px;
          margin-right: 10px;

        }

        .text {
          font-family: PingFang SC;
          font-size: 12px;
          font-weight: 400;
          line-height: 16.8px;
          text-align: center;

        }

      }

    }

    .content {
      width: calc(100% - 50px);
      padding: 10px 0;
      margin-left: 50px;
      font-family: PingFang SC;
      font-size: 16px;
      font-weight: 400;
      line-height: 26px;
      text-align: left;
      border-bottom: 1px solid #F0F0F0;
    }
  }


}

.reply {
  width: 100%;
  height: 50px;
  border-top: 1px solid #F0F0F0;
  position: fixed;
  bottom: 0px;
  padding-right: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px;

  .btn {
    width: 60px;
    height: 36px;
    border-radius: 38px;
    line-height: 36px;
    text-align: center;
    background: var(--main-1, #F83E3C);
    font-family: PingFang SC;
    font-size: 14px;
    font-weight: 600;
    color: #F0F0F0;
  }
}
</style>