export default {
  plugins: {
    "postcss-pxtorem": {
      rootValue: 37.5, // Vant 官方根字体大小是 37.5
      propList: ['*'],
      selectorBlackList: ['.norem', '.pc'] // 过滤掉.norem-开头的class，不进行rem转换
    },
    tailwindcss: {},
    autoprefixer: {},
  },
}
