import { defineStore } from 'pinia'
import { home, install, reqdeviceLogin, recordViewApi, getConfigApp } from '@/service/home'
import { identityCardLogin } from "@/service/loginApi"
import { getUserInfo } from '@/service/loginApi'
import { GameCreate } from '@/service/game'
import { inStandaloneMode } from '@/utils/common.js'
import FingerprintJS from "@fingerprintjs/fingerprintjs";
import { $get, $set, getHashPageName } from '@/utils'
import mobile from 'mobile-detect'
const MobileDetect = mobile;
const setTemplateData = (templateData = [], obj = {}) => {
  templateData.forEach(item => {
    obj[item.zoneKey || item.adGroupKey] = item
    if (item?.adGroup && item?.adGroup instanceof Array) {
      setTemplateData(item.adGroup, obj)
    }
  })
  return obj
}
export const config = defineStore({
  id: 'config',
  state: () => {
    return {
      token: '',
      configData: {
        config: {}, // 配置
        page: {}, // 文章列表
        template: {}, // 页面信息
        imgUrl: '',
        hy: {},
      },
      searchList: [],
      jump: {},
      templateData: {},
      navList: {},
      deviceUser: null,
      device: {
        isMobile: true,
        isSafari: true
      },
      fuilData: {
        list: [],
        gridList: [],
        marquee: '  ',
        swiperTop: [],
        swiperCenter: [],

      },
      Channel: {
        deviceId: '',// 设备id 随机生成
        channelKey: '',// 渠道key
      },
      loading: false,
      uuid: "",
      appConfig: {},
      gameInfo: {
        id: "",
        username: '',
        oldUsername: '',
        accountState: '',
        accountStates: [],
        nickname: '',
        avatar: '',
        coin: '0.00',
        fcoin: '0.00',
        requireCoin: '0.00',
        role: 0,
        levelId: 0,
        riskId: 1,
        credit: 0,
        realName: '',
        birthday: '',
        status: 10,
        areaCode: null,
        mobile: null,
        sex: 2,
        bindBank: 0,
        score: 0,
        promoCode: null,
        apiToken: '',
        passwordHash: '',
        passwordCoin: '',
        createdAt: '',
        autoTransfer: 0,
        upgradeBalance: '0.00',
        days: 1,
        nicknameUpdate: 1,
        totalDepositCount: 0,
        totalDeposit: '0.00',
        totalWithdrawalsCount: 0,
        totalWithdrawals: '0.00',
        parentId: 0
      },
      scrollInfo: {},
    }
  },
  actions: {
    /**
     * @description 获取广告配置
     * @param {string} pageName  渠道号
     */







    async setConfig(pageName) {
      let { result, systemTimestamp } = await home({ pageName })
      const code = result.page.code.split('</script>').filter(item => item).map(item => item.trim())
      const timeList = result.config.WebsiteStatisticConfig.split(';').filter(item => item)
      // 获取当前分钟
      let myDate = new Date(systemTimestamp * 1000).getMinutes() + new Date(systemTimestamp * 1000).getHours() * 60
      // 是否在区间内
      let haveInterval = false
      // 是否是扣量
      let isEnabled = false
      // 是否加载 三种状态 加载 不加载 和重置 jz bjz cz
      let isLoad = 'cz'
      if (localStorage.getItem('isInit')) {
        const json = JSON.parse(localStorage.getItem('isInit'))
        isLoad = json.isInit
        if (new Date(json.time).getDate() != new Date(systemTimestamp * 1000).getDate()) {
          isLoad = 'cz'
        }
      }
      // 计量 加载统计代码 recordViewApi 传 1	扣量 不加载统计代码 recordViewApi 传 0
      if (result.config.WebsiteStatisticEnabled == 1) {
        if (isLoad == 'jz') {
          this.runCode(code)
          recordViewApi({ pageName, state: 1 })
        } else if (isLoad == 'cz') {
          timeList.forEach(item => {
            const rangeList = item.split('#')
            if (Number(rangeList[0]) <= myDate && Number(rangeList[1]) >= myDate) {
              // 开始随机 随机数大于等于配置的随机数为扣量
              isEnabled = Math.floor(Math.random() * 101) > Number(rangeList[2])
              localStorage.setItem('isInit', JSON.stringify({ isInit: isEnabled ? 'bjz' : 'jz', time: systemTimestamp * 1000 }))
              if (!isEnabled) {
                this.runCode(code)
              }
              haveInterval = true
            }
          })
          recordViewApi({ pageName, state: isEnabled ? 0 : 1 })
          if (!haveInterval) {
            localStorage.setItem('isInit', JSON.stringify({ isInit: 'jz', time: systemTimestamp * 1000 }))
            this.runCode(code)
          }
        } else {
          recordViewApi({ pageName, state: 0 })
        }

      } else {
        this.runCode(code)
        // 新增页面访问记录接口
        recordViewApi({ pageName, state: 1 })
      }

      document.getElementsByTagName("title")[0].innerText = result.config.WebsiteTitle;
      const keywords = document.createElement('meta');
      keywords.content = result.config.WebsiteKeywords;
      keywords.name = 'keywords';

      document.getElementsByTagName('head')[0].appendChild(keywords);
      const Description = document.createElement('meta');
      Description.content = result.config.WebsiteDescription;
      Description.name = 'description';
      document.getElementsByTagName('head')[0].appendChild(Description);

      var link = document.querySelector("link[rel*='icon']") || document.createElement('link');

      link.rel = 'icon';

      link.href = result.config.Favicon;
      document.getElementsByTagName('head')[0].appendChild(link);

      this.configData.config = result.config
      this.jump = result.jump
      this.configData.page = result.page
      this.configData.template = result.template
      // this.isverifyDomain()
      this.templateData = setTemplateData(result.templateData)
    },
    async isverifyDomain() {
      let url = $get(this, 'configData.config.AwsS3Host', '')
      let url1 = $get(this, 'configData.config.EMail', '')
      let promises = [fetch(url)]
      if (url1.startsWith('http')) {
        promises.push(fetch(url1))
      }
      try {
        let res = await Promise.any(promises)
        $set(this, 'configData.config.AwsS3Host', res.url.substring(0, res.url.lastIndexOf('/')))
      } catch (error) {
        console.log(error);
      }
    },
    setDevice() {
      let isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      )
      let isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent)
      this.device.isMobile = isMobile
      this.device.isSafari = isSafari
    },
    /**
     * @description 初始化 获取浏览器指纹 登录 获取下载配置
     * @returns 
     */
    async init() {
      if (!this.uuid || this.uuid.length !== 32) {
      const fp = await FingerprintJS.load()
      const res = await fp.get()
      this.uuid = res.visitorId.slice(0, 28) +'a1b2'
      localStorage.setItem('_uuid', this.uuid)
      console.log(res, this.uuid, '---------------------uuid--------------')
      }


      try {
        if (!window.localStorage.getItem("_pageName")) {
          // 获取粘贴板内容
          let contentTxt = await navigator.clipboard.readText()
          alert(contentTxt)
          // 如果有pageName:
          if (contentTxt.slice(0, 9) == 'pageName:') {
            // 为空的时候设置_pageName=index.html 不为空获取粘贴板里的内容
            if (contentTxt.slice(9) == '') {
              console.log('粘贴板为空')
              window.localStorage.setItem("_pageName", 'index.html')
              window.localStorage.setItem("kong", 'obj')
            } else if (contentTxt.slice(9) == 'null') {
              console.log('pageName为null')
              window.localStorage.setItem("_pageName", 'index.html')
              window.localStorage.setItem("isNull", 'msg')
            } else {
              console.log('pageName内容')
              window.localStorage.setItem("_pageName", contentTxt.slice(9))
            }

          } else {

            console.log('粘贴板里没有pageName', contentTxt.slice(0, 9))
            // 粘贴板里没有pageName的时候 为index.html
            window.localStorage.setItem("_pageName", 'index.html')
            window.localStorage.setItem("err", 'alll')
          }

          console.log('粘贴成功', contentTxt, window.localStorage.getItem("_pageName"))

        }


      } catch (err) {
        window.localStorage.setItem("_pageName", 'index.html')
        console.log('粘贴失败', err)
        window.localStorage.setItem("err", err)
        alert('err:',err)
      }
      // let data = getHashPageName()
      //获取_pageName  如果为空设置为index.html
      let data = {
        pageName: window.localStorage.getItem("_pageName") || "index.html"
      };
      const params = {
        source: '',
        operatingSystem: '',
        operatingSystemVersion: '',
      }
      console.log('123456')
      await this.Login(data)
      await this.setConfig(data.pageName)
      this.getAppConfig()
      const deviceInfo = {
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        appVersion: navigator.appVersion,
        language: navigator.language
      };

      // 创建一个 MobileDetect 对象
      const md = new MobileDetect(window.navigator.userAgent);
      var model = "";
      model = md.mobile();
      var os = md.os(); //获取系统
      var sss = deviceInfo.userAgent.split(";");
      var i = sss.indexOf("Build/");
      if (i) {
        model = sss[-i].slice(0, sss[-i].indexOf("Build/"));
      }
      console.log(model + '||' + os, '打印系统版本和手机型号')

      if (deviceInfo.userAgent.includes('iPhone')) {
        params.source = 'IOSBookmark'
        params.operatingSystem = 'iphone'
        params.operatingSystemVersion = md.version('iPhone')
      } else {
        params.source = 'Android'
        params.operatingSystem = 'android'
        params.operatingSystemVersion = model
      }
      params.channelKey = data.pageName
      params.deviceId = this.uuid
      if (!localStorage.getItem('noFirst')) {
        install(params).then(res => {
          localStorage.setItem('noFirst', true)
        })
      }

    },
    /**
     * @description 设备登录
     * @param {string} pageName  渠道号
     */
    async Login(data) {
      var url = window.location.href;
      let queryParams = {};
      var index = url.indexOf('?');
      var result = url.substring(index + 1);
      // 分割字符串得到所有的键值对
      let pairs = result.split("&");
      pairs.forEach(function (pair) {
        let [key, value] = pair.split("=");
        // 解码并添加到结果对象
        queryParams[decodeURIComponent(key)] = decodeURIComponent(value);
      });

      let { pageName, inviteCode } = queryParams
      if (!pageName) {
        pageName = 'index.html'
      }
      if(window.localStorage.getItem("_pageName")){
        pageName =window.localStorage.getItem("_pageName")
      }
      let identityCard = this.deviceUser?.identityCard
      let api = identityCard ? identityCardLogin : reqdeviceLogin
      let params = identityCard ? { identityCard } : { deviceId: this.uuid || '11', pageName, inviteCode }
      const lres = await api(params)

      this.updatedUserInfo(lres?.result)
    },
    async loginGameCreate() {
      let res = await GameCreate({
        username: this.deviceUser.userId,
        model: "h5"
      })
      this.gameInfo = res.data
    },
    async updatedUserInfo(info) {
      if (info.userInfo) {
        this.token = info.token ?? ''
        this.deviceUser = info.userInfo
        // await this.loginGameCreate()
      } else {
        this.token = ''
        this.deviceUser = {}
      }
    },
    runCode(code) {
      if (!code) {
        code = $get(this, 'configData.page.code', '').split('</script>').filter(item => item).map(item => item.trim())
      }
      let scriptList = []
      let flagCodeSrc = false
      for (let item of code) {
        if (!item) return

        if (item.indexOf('>') - item.indexOf('<script') <= 15) {
          const script = document.createElement('script');
          script.innerHTML = item.replace('<script>', '')
          // setTimeout(() => { document.body.appendChild(script) }, 1000)
          scriptList.push(script)
        } else {
          flagCodeSrc = true
          const script = document.createElement('script');


          const scriptItem = item.replace('<script', '').replace('>', '')
          const scriptItemArr = scriptItem.split(' ').filter(item => item).map(item => {
            return [item.substr(0, item.indexOf('=')), item.substr(item.indexOf('=') + 1).replaceAll('"', '')]

          })
          for (let it of scriptItemArr) {
            script[it[0]] = it[1]
          }
          script.onload = function () {
            for (let item of scriptList) {
              document.body.appendChild(item)
            }
            scriptList = []
          }
          document.body.appendChild(script)


        }
      }
      if (!flagCodeSrc) {
        for (let item of scriptList) {
          document.body.appendChild(item)
        }
        scriptList = []
      }
    },
    /**
     * @description 获取下载链接
     * 
     */
    async getAppConfig() {
      const res = await getConfigApp()
      this.appConfig = res.result
    },
    async updateUserInfo() {
      let res = await getUserInfo()
      if (res?.result) {
        this.deviceUser = res?.result
      }
    }
  },
  persist: {
    enabled: true,
    strategies: [
      {
        key: 'config',
        storage: localStorage
      }
    ]
  }
})
