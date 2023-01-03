import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import Components from 'unplugin-vue-components/vite'
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers'
import OptimizationPersist from 'vite-plugin-optimize-persist'
import PkgConfig from 'vite-plugin-package-config'
import vueI18n from '@intlify/vite-plugin-vue-i18n'
import { createHtmlPlugin } from 'vite-plugin-html'
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, 'env')
  const title = ``
  return {
    plugins: [
      vue(),
      PkgConfig(),
      OptimizationPersist(),
      Components({
        resolvers: [AntDesignVueResolver()],
      }),
      createHtmlPlugin({
        injectHtml: true,
        inject: {
          env: env,
          data: {
            title,
            injectScript: ``,
          },
        }
      }),
      vueI18n({
        include: path.resolve(__dirname, './src/locales/**'),
        compositionOnly: false,
      }),
    ],
    resolve: {
      extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue'],
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@components': path.resolve(__dirname, './src/components'),
        '@util': path.resolve(__dirname, './src/util'),
      },
    },
    // 打包配置
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              return id.toString().split('node_modules/')[1].split('/')[0].toString()
            }
          }
        }
      },
      target: 'modules',
      outDir: 'dist', // 指定输出路径
      assetsDir: 'assets', // 指定生成静态资源的存放路径
      minify: 'terser' // 混淆器，terser构建后文件体积更小
    },
  }
})
