import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    // 启用自动导入插件
    AutoImport({
      imports: ['vue', 'vue-router'],
      dirs: ['./src/composables'], // 自动导入 composables
      dts: 'auto-imports.d.ts', // 生成类型声明
    }),
    Components({
      dirs: ['src/components'], // 自动导入 src/components 下的组件
      extensions: ['vue'],
      dts: 'components.d.ts', // 生成组件类型声明
    }),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'https://localhost:7051', // 更新为实际的后端地址
        changeOrigin: true,
        secure: false, // 如果后端使用自签名证书，设置为 false
      },
    },
  },
})