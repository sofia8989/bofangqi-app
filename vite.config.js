import path from "path";
import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import Components from "unplugin-vue-components/vite";
import AutoImport from 'unplugin-auto-import/vite';
import { VantResolver } from "unplugin-vue-components/resolvers";
import legacy from "@vitejs/plugin-legacy";
import { createSvgIconsPlugin } from "vite-plugin-svg-icons";
import viteCompression from "vite-plugin-compression";
import { createHtmlPlugin } from "vite-plugin-html";
import { visualizer } from "rollup-plugin-visualizer";
// import { VitePWA } from "vite-plugin-pwa";
let timeStamp = new Date().getTime()
// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd()); // 获取 .env里面定义是参数

  return {
    server: {
      port: 8099,
      host: "0.0.0.0",
      proxy: {
        // 本地开发环境通过代理实现跨域，生产环境使用 nginx 转发
        // 正则表达式写法
        "^/Api": {
          // target: "https://mzx9.cc", // 后端服务实际地址
          // target: "https://frontweb.bmjj.cc:82", // 后端服务实际地址
          // target: "https://mochaav.com", // 测试环境
          // target: "https://zy.y0h2gr.com", // 测试环境
          // target: "https://5yer.cc", // 后端服务实际地址
          // target: "https://frontweb.sinaav.live", // 后端服务实际地址
          // target: "http://zztestfront.72f2de.com", // 后端服务实际地址
          // target: "https://zzh5.qqqqcem.cn", // 后端服务实际地址
          target: "https://364tig9.wbwkbn.cn", // 后端服务实际地址
          changeOrigin: true, //开启代理
          rewrite: (path) => {

            return path.replace(/^\/api/, "")
          },
        },
        "^/gameapi": {
          // target: "https://hygq1.xyz/api", // 后端服务实际地址
          target: "https://www.zzvideo.vip",
          changeOrigin: true, //开启代理
          rewrite: (path) => {
            return path
          },
        },
      },
    },
    plugins: [
      createSvgIconsPlugin({
        // 指定需要缓存的图标文件夹
        iconDirs: [path.resolve(process.cwd(), "src/icons/svg")],
        // 指定symbolId格式
        symbolId: "icon-[dir]-[name]",
      }),
      vue(),
      Components({
        resolvers: [VantResolver()],
        dts: 'src/components.d.ts'
      }),
      AutoImport({
        resolvers: [VantResolver()],
        dts: 'src/auto-imports.d.ts'
      }),
      legacy({
        targets: ["defaults", "ie >= 11", "chrome 55"], //需要兼容的目标列表，可以设置多个
        additionalLegacyPolyfills: ["regenerator-runtime/runtime"],
        renderLegacyChunks: true,
        polyfills: [
          "es.symbol",
          "es.array.filter",
          "es.promise",
          "es.promise.finally",
          "es/map",
          "es/set",
          "es.array.for-each",
          "es.object.define-properties",
          "es.object.define-property",
          "es.object.get-own-property-descriptor",
          "es.object.get-own-property-descriptors",
          "es.object.keys",
          "es.object.to-string",
          "web.dom-collections.for-each",
          "esnext.global-this",
          "esnext.string.match-all",
        ],
      }),
      createHtmlPlugin({
        minify: true,
        inject: {
          data: {
            title: env.VITE_APP_TITLE,
            script: generateScript(env),
          },
        },
      }),
      viteCompression({
        threshold: 10240, // 对大于 10kb 的文件进行压缩
      }),
      // visualizer({
      //   gzipSize: true,
      //   brotliSize: true,
      //   emitFile: false,
      //   filename: "test.html", //分析图生成的文件名
      //   open:true //如果存在本地服务端口，将在打包后自动展示
      // }),
      // VitePWA({
      //   manifest: {

      //     theme_color: "#2c2a2a",
      //   },
      //   registerType: "autoUpdate",
      //   workbox: {
      //     globPatterns: ["assets/**/*.{js,css,html,ico,png,svg}"], //缓存相关静态资源
      //     runtimeCaching: [
      //       {
      //         handler: "StaleWhileRevalidate",
      //         urlPattern: /(.*?)\.(png|jpe?g|svg|gif|bmp|psd|tiff|tga|eps)/,
      //         options: {
      //           cacheName: "cgweb-js", //创建缓存名称
      //           expiration: {
      //             maxEntries: 200,
      //             maxAgeSeconds: 60 * 60 * 12 , // <== 12 hour
      //           },
      //           cacheableResponse: {
      //             statuses: [0, 200],
      //           },
      //         },
      //       },
      //     ],
      //   },
      //   devOptions: {
      //     enabled: true,
      //   },
      // }),
    ],
    build: {
      minify: "terser",
      chunkSizeWarningLimit: 1500,
      cssCodeSplit: true, //css 拆分
      sourcemap: false, //不生成sourcemap
      terserOptions: {
        compress: {
          //生产环境时移除console
          drop_console: true,
          drop_debugger: true,
        },
      },
      rollupOptions: {
        output: {
          manualChunks(id) {
          //   if (id.includes('src/components')) { // 把 components 文件里面的文件都打包到 components.js 中 
          //     return 'components'
          //  }
            if (id.includes("node_modules")) {
              if(['lib-flexible','tslib','axios','@vant','crypto-js','dayjs','pinia','qrcode-decoder','clipboard','qrcode.vue','vue-demi','vue-router'].some(value=>id.includes(value))){
                return 'vendor'
              }
              return id
                .toString()
                .split("node_modules/")[1]
                .split("/")[0]
                .toString();
            }
          },
          // manualChunks: {
          //   vendor: ['lib-flexible', 'axios', 'crypto-js','dayjs','pinia','qrcode-decoder','vue-clipboard3','html2canvas'].some(value=>id.includes(value))// 提取第三方库
          // },
          chunkFileNames: (chunkInfo) => {
            const facadeModuleId = chunkInfo.facadeModuleId
              ? chunkInfo.facadeModuleId.split("/")
              : [];
            const fileName =
              facadeModuleId[facadeModuleId.length - 2] || "[name]";
            return `js/${fileName}/[name].[hash].${timeStamp}.js`;
          },
        },
      },
      assetsInlineLimit: 5000, //小于该值 图片将打包成Base64
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    css: {
      preprocessorOptions: {
        less: {
          additionalData: '@import "@/assets/style/index.less";',
        },
      },
    },
    // optimizeDeps: {
    //   // exclude:["lib-flexible/flexible"]
    // }
  };
});

// 生成script标签
function generateScript(env) {


}
