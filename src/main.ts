import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

import App from './App.vue'
import router from './router'
import permissionDirective from './directives/permission'
import { useUserStore } from '@/stores/user'

const app = createApp(App)
const pinia = createPinia()

// 注册所有图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

// 使用自定义指令
app.use(permissionDirective)

app.use(pinia)
app.use(router)
app.use(ElementPlus)

// 初始化用户状态（从 localStorage 恢复）
const userStore = useUserStore()

// 尝试从 localStorage 恢复用户状态
const storedToken = localStorage.getItem('auth_token')
const storedUserInfo = localStorage.getItem('user_info')

console.log('[Main] 应用启动，检查用户状态...')
console.log('[Main] Token:', !!storedToken)
console.log('[Main] UserInfo:', !!storedUserInfo)

if (storedToken && storedUserInfo && storedUserInfo !== 'undefined') {
  try {
    const userInfo = JSON.parse(storedUserInfo)
    console.log('[Main] ✅ 从 localStorage 恢复用户状态')
    console.log('[Main] 用户ID:', userInfo.id)
    console.log('[Main] 邮箱:', userInfo.email)
    console.log('[Main] 权限数量:', userInfo.permissions?.length || 0)
    console.log('[Main] 菜单数量:', userInfo.menus?.length || 0)
    
    // 直接设置 Store 状态
    userStore.token = storedToken
    userStore.userInfo = userInfo
    userStore.permissions = userInfo.permissions || []
    userStore.menus = userInfo.menus || []
  } catch (e) {
    console.warn('[Main] ⚠️ 解析用户信息失败:', e)
    // 清除无效数据
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user_info')
  }
} else {
  console.log('[Main] ℹ️ 没有找到存储的用户状态')
}

// 监听用户状态变化，自动同步到 localStorage
userStore.$subscribe((mutation, state) => {
  if (state.token) {
    localStorage.setItem('auth_token', state.token)
  } else {
    localStorage.removeItem('auth_token')
  }
  
  if (state.userInfo) {
    localStorage.setItem('user_info', JSON.stringify(state.userInfo))
  } else {
    localStorage.removeItem('user_info')
  }
})

app.mount('#app')