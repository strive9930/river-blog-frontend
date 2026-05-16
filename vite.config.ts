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
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
})