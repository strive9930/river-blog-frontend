<template>
  <header class="navbar-header">
    <div class="navbar-container">
      <div class="logo-section" 
           @mouseenter="showMobileMenuOnHover = true" 
           @mouseleave="handleMouseLeave"
           :class="{ 'hovered': showMobileMenuOnHover && isSmallScreen }">
        <router-link to="/" class="logo-link">
          <span class="logo-text">{{ siteTitle }}</span>
        </router-link>
        
        <!-- 悬浮菜单 -->
        <nav class="hover-menu" v-if="showMobileMenuOnHover && isSmallScreen">
          <ul class="hover-nav-list">
            <!-- 固定菜单项 -->
            <li class="nav-item" v-for="item in staticNavItems" :key="item.name">
              <router-link 
                :to="item.path" 
                class="nav-link" 
                :class="{ active: isActiveRoute(item.path) }"
                @click="hideHoverMenu"
              >
                {{ item.name }}
              </router-link>
            </li>
            
            <!-- 动态菜单项（如果用户已登录） -->
            <li class="nav-item" v-for="item in dynamicMenuItems" :key="item.name">
              <router-link 
                :to="item.path" 
                class="nav-link" 
                :class="{ active: isActiveRoute(item.path) }"
                @click="hideHoverMenu"
              >
                {{ item.title || item.name }} <!-- 显示title字段，如果没有则显示name字段 -->
              </router-link>
            </li>
            
            <!-- 静态菜单项（如果用户未登录） -->
            <template v-if="!userStore.isLoggedIn">
              <li class="nav-item">
                <router-link to="/login" class="nav-link btn login-btn" @click="hideHoverMenu">登录</router-link>
              </li>
              <li class="nav-item">
                <router-link to="/register" class="nav-link btn register-btn" @click="hideHoverMenu">注册</router-link>
              </li>
            </template>
            
            <!-- 用户信息（如果已登录） -->
            <li class="user-info" v-if="userStore.isLoggedIn">
              <div class="user-trigger" @click="toggleUserDropdown">
                <div class="user-profile">
                  <img 
                    :src="userAvatar || userStore.userInfo?.avatar || 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'" 
                    :alt="userStore.userInfo?.nickName || '用户头像'"
                    class="user-avatar"
                  />
                  <span class="username">{{ userStore.userInfo?.nickName || userStore.userInfo?.email || '用户' }}</span>
                </div>
              </div>
              
              <div class="dropdown-menu" v-show="userDropdownOpen">
                <ul class="dropdown-list">
                  <li><a href="#" @click.prevent="handleLogout">退出登录</a></li>
                </ul>
              </div>
            </li>
          </ul>
        </nav>
      </div>

      <div class="nav-menu-toggle" @click="toggleMobileMenu" v-if="!isSmallScreenHoverEnabled">
        <div class="hamburger-menu">
          <span :class="{ 'line-1': true, 'close-line-1': mobileMenuOpen }"></span>
          <span :class="{ 'line-2': true, 'close-line-2': mobileMenuOpen }"></span>
          <span :class="{ 'line-3': true, 'close-line-3': mobileMenuOpen }"></span>
        </div>
      </div>

      <nav class="nav-menu" :class="{ 'mobile-open': mobileMenuOpen }" v-if="!isSmallScreenHoverEnabled">
        <ul class="nav-list">
          <!-- 固定菜单项 -->
          <li class="nav-item" v-for="item in staticNavItems" :key="item.name">
            <router-link 
              :to="item.path" 
              class="nav-link" 
              :class="{ active: isActiveRoute(item.path) }"
            >
              {{ item.name }}
            </router-link>
          </li>
          
          <!-- 动态菜单项（如果用户已登录） -->
          <li class="nav-item" v-for="item in dynamicMenuItems" :key="item.name">
            <router-link 
              :to="item.path" 
              class="nav-link" 
              :class="{ active: isActiveRoute(item.path) }"
            >
              {{ item.title || item.name }} <!-- 显示title字段，如果没有则显示name字段 -->
            </router-link>
          </li>
          
          <!-- 静态菜单项（如果用户未登录） -->
          <template v-if="!userStore.isLoggedIn">
            <li class="nav-item">
              <router-link to="/login" class="nav-link btn login-btn">登录</router-link>
            </li>
            <li class="nav-item">
              <router-link to="/register" class="nav-link btn register-btn">注册</router-link>
            </li>
          </template>
          
          <!-- 用户信息（如果已登录） -->
          <li class="user-info" v-if="userStore.isLoggedIn">
            <div class="user-dropdown">
              <div class="user-trigger" @click="toggleUserDropdown">
                <div class="user-profile">
                  <img 
                    :src="userAvatar || userStore.userInfo?.avatar || 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'" 
                    :alt="userStore.userInfo?.nickName || '用户头像'"
                    class="user-avatar"
                  />
                  <span class="username">{{ userStore.userInfo?.nickName || userStore.userInfo?.email || '用户' }}</span>
                </div>
              </div>
              
              <div class="dropdown-menu" v-show="userDropdownOpen">
                <ul class="dropdown-list">
                  <li><a href="#" @click.prevent="handleLogout">退出登录</a></li>
                </ul>
              </div>
            </div>
          </li>
        </ul>
      </nav>
    </div>
    
    <!-- 移动端遮罩层 -->
    <div 
      class="mobile-overlay" 
      v-if="!isSmallScreenHoverEnabled && showMobileMenu && mobileMenuOpen" 
      @click="toggleMobileMenu"
    ></div>
  </header>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { useUserStore } from '@/stores/user';
import { useRoute, useRouter } from 'vue-router';
import { userApi } from '@/utils/api';
import type { MenuTree } from '@/types/api';

// Props
interface Props {
  siteTitle?: string;
  logoUrl?: string;
  staticNavItems?: Array<{ name: string; path: string }>;
  userAvatar?: string;
}

const props = withDefaults(defineProps<Props>(), {
  siteTitle: 'River Blog',
  staticNavItems: () => [
    { name: '首页', path: '/' },
    { name: '博客', path: '/blog' },
    { name: '关于', path: '/about' }
  ],
  userAvatar: ''
});

// 响应式数据
const mobileMenuOpen = ref(false);
const userDropdownOpen = ref(false);
const dynamicMenuItems = ref<Array<{ name: string; path: string; title?: string }>>([]);
const showMobileMenuOnHover = ref(false);
const hoverTimeout = ref<number | null>(null);

// Store 和路由
const userStore = useUserStore();
const route = useRoute();
const router = useRouter();

// 检测是否为移动端/小屏幕
const isSmallScreen = computed(() => {
  return window.innerWidth < 1024; // 改为1024px，更符合常见响应式断点
});

// 是否启用了小屏hover模式
const isSmallScreenHoverEnabled = computed(() => {
  return isSmallScreen.value && !mobileMenuOpen.value;
});

// 隐藏悬浮菜单
const hideHoverMenu = () => {
  showMobileMenuOnHover.value = false;
};

// 处理鼠标离开事件
const handleMouseLeave = () => {
  // 设置一个延迟，防止鼠标经过下拉菜单时消失
  if (hoverTimeout.value) {
    clearTimeout(hoverTimeout.value);
  }
  hoverTimeout.value = setTimeout(() => {
    showMobileMenuOnHover.value = false;
  }, 300); // 300ms 后隐藏菜单
};

// 清除隐藏菜单的定时器
const cancelHideMenu = () => {
  if (hoverTimeout.value) {
    clearTimeout(hoverTimeout.value);
    hoverTimeout.value = null;
  }
};

// 切换移动端菜单
const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value;
  
  // 关闭用户下拉菜单（如果打开）
  if (userDropdownOpen.value) {
    userDropdownOpen.value = false;
  }
  
  // 关闭悬浮菜单（如果打开）
  if (showMobileMenuOnHover.value) {
    showMobileMenuOnHover.value = false;
  }
};

// 切换用户下拉菜单
const toggleUserDropdown = () => {
  userDropdownOpen.value = !userDropdownOpen.value;
  
  // 关闭移动端菜单（如果打开）
  if (mobileMenuOpen.value) {
    mobileMenuOpen.value = false;
  }
  
  // 关闭悬浮菜单（如果打开）
  if (showMobileMenuOnHover.value) {
    showMobileMenuOnHover.value = false;
  }
};

// 检查当前路由是否激活
const isActiveRoute = (path: string) => {
  return route.path === path;
};

// 处理退出登录
const handleLogout = async () => {
  await userStore.logout();
  router.push('/login');
};

// 加载用户菜单
const loadUserMenus = async () => {
  try {
    if (userStore.isLoggedIn) {
      const response = await userApi.getMenus();
      if (response.success && response.data) {
        // 转换菜单数据格式
        const transformedMenus = transformMenuData(response.data);
        dynamicMenuItems.value = transformedMenus;
      } else {
        // 如果API返回空数据，也清空动态菜单
        dynamicMenuItems.value = [];
      }
    } else {
      // 用户未登录时清空动态菜单
      dynamicMenuItems.value = [];
    }
  } catch (error) {
    console.error('加载用户菜单失败:', error);
    // 出错时清空动态菜单，只保留静态菜单
    dynamicMenuItems.value = [];
  }
};

// 转换菜单数据格式
const transformMenuData = (menus: MenuTree[]): Array<{ name: string; path: string; title?: string }> => {
  const result: Array<{ name: string; path: string; title?: string }> = [];
  
  const traverse = (menuList: MenuTree[], parentPath = '') => {
    for (const menu of menuList) {
      const fullPath = parentPath ? `${parentPath}/${menu.path}` : menu.path;
      
      result.push({
        name: menu.name,
        path: fullPath.startsWith('/') ? fullPath : `/${fullPath}`,
        title: menu.title || menu.name  // 优先使用title字段，如果没有则使用name字段
      });
      
      if (menu.children && menu.children.length > 0) {
        traverse(menu.children, fullPath);
      }
    }
  };
  
  traverse(menus);
  return result;
};

// 监听窗口大小变化
const handleResize = () => {
  if (window.innerWidth >= 1024) {
    mobileMenuOpen.value = false;
    userDropdownOpen.value = false;
    showMobileMenuOnHover.value = false;
  }
};

// 添加事件监听器
window.addEventListener('resize', handleResize);

let unwatch: () => void;

// 组件挂载时加载菜单
onMounted(async () => {
  await loadUserMenus();
  
  // 监听用户登录状态变化
  unwatch = watch(() => userStore.isLoggedIn, async () => {
    await loadUserMenus();
  });
});

// 组件卸载时清理监听器
onUnmounted(() => {
  unwatch?.();
  window.removeEventListener('resize', handleResize);
});
</script>

<style scoped>
.navbar-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background-color: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(12px);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 0.8rem 0;
  transition: all 0.3s ease;
}

.navbar-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo-section {
  display: flex;
  align-items: center;
  position: relative;
}

.logo-section.hovered {
  position: relative;
}

.logo-link {
  display: flex;
  align-items: center;
  text-decoration: none;
  color: #333;
  font-weight: bold;
  font-size: 1.5rem;
  transition: color 0.3s;
  position: relative;
  z-index: 1001;
}

.logo-link:hover {
  color: #409eff;
}

.logo-text {
  font-size: 1.6rem;
  font-weight: 700;
  color: #2c3e5e;
  letter-spacing: -0.5px;
}

.hover-menu {
  position: absolute;
  top: 100%;
  left: 0;
  width: 250px;
  background: white;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
  border-radius: 8px;
  overflow: hidden;
  z-index: 999;
  margin-top: 0.5rem;
}

.hover-nav-list {
  list-style: none;
  padding: 0.8rem 0;
  margin: 0;
}

.nav-menu {
  display: flex;
  align-items: center;
}

.nav-list {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
  align-items: center;
}

.nav-item {
  margin-left: 1.8rem;
  position: relative;
}

.nav-link {
  text-decoration: none;
  color: #34495e;
  font-weight: 500;
  padding: 0.5rem 0.8rem;
  border-radius: 6px;
  transition: all 0.3s ease;
  display: block;
  position: relative;
}

.nav-link:hover {
  color: #409eff;
  background-color: rgba(64, 158, 255, 0.1);
}

.nav-link.active {
  color: #409eff;
  font-weight: 600;
}

.nav-link.btn {
  border-radius: 20px;
  padding: 0.5rem 1.2rem;
  font-size: 0.9rem;
}

.login-btn {
  background-color: transparent;
  border: 1px solid #dcdfe6;
  color: #606266;
}

.login-btn:hover {
  background-color: #ecf5ff;
  border-color: #c6e2ff;
  color: #409eff;
}

.register-btn {
  background-color: #409eff;
  color: white !important;
  border: 1px solid #409eff;
}

.register-btn:hover {
  background-color: #66b1ff;
  border-color: #66b1ff;
  color: white !important;
}

.user-info {
  margin-left: 1.2rem;
  position: relative;
}

.user-trigger {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 0.3rem;
  border-radius: 50px;
  transition: background-color 0.3s;
  height: 42px;
}

.user-trigger:hover {
  background-color: rgba(64, 158, 255, 0.1);
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.user-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #e4e7ed;
  flex-shrink: 0;
}

.username {
  font-weight: 500;
  color: #333;
  font-size: 0.95rem;
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  border-radius: 8px;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
  overflow: hidden;
  z-index: 1000;
  margin-top: 0.5rem;
  min-width: 160px;
}

.dropdown-list {
  list-style: none;
  padding: 0.5rem 0;
  margin: 0;
}

.dropdown-list li {
  margin: 0;
}

.dropdown-list a {
  display: block;
  padding: 0.7rem 1.2rem;
  text-decoration: none;
  color: #333;
  font-weight: 400;
  transition: background-color 0.2s;
  font-size: 0.9rem;
  width: 100%;
}

.dropdown-list a:hover {
  background-color: #f5f7fa;
}

.nav-menu-toggle {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  width: 30px;
  height: 30px;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  box-sizing: border-box;
}

.hamburger-menu {
  width: 24px;
  height: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.hamburger-menu span {
  display: block;
  width: 100%;
  height: 3px;
  background: #333;
  border-radius: 2px;
  transition: all 0.3s ease;
}

.line-1.close-line-1 {
  transform: rotate(45deg) translate(6px, 6px);
}

.line-2.close-line-2 {
  opacity: 0;
}

.line-3.close-line-3 {
  transform: rotate(-45deg) translate(6px, -6px);
}

.mobile-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 99;
}

/* 移动端/小屏幕适配 - 在1024px断点切换为汉堡菜单 */
@media (max-width: 1023px) {
  .navbar-container {
    padding: 0 1rem;
  }

  .nav-menu {
    position: fixed;
    top: 60px;
    left: 0;
    right: 0;
    background: white;
    box-shadow: 0 10px 15px -5px rgba(0, 0, 0, 0.1);
    max-height: calc(100vh - 60px);
    overflow-y: auto;
    transform: translateY(-100%);
    opacity: 0;
    visibility: hidden;
    transition: all 0.4s cubic-bezier(0.22, 0.61, 0.36, 1);
    z-index: 99;
  }

  .nav-menu.mobile-open {
    transform: translateY(0);
    opacity: 1;
    visibility: visible;
  }

  .nav-list {
    flex-direction: column;
    padding: 1rem 0;
    align-items: stretch;
  }

  .nav-item {
    margin: 0;
    width: 100%;
    padding: 0.2rem 1.5rem;
  }

  .nav-link {
    padding: 0.9rem 0.8rem;
    border-radius: 6px;
    margin: 0.2rem 0;
  }

  .nav-link.btn {
    display: inline-block;
    text-align: center;
    margin: 0.8rem auto 0 auto;
    width: fit-content;
  }

  .user-info {
    margin-left: 0;
    padding: 1rem 1.5rem 0 1.5rem;
    width: 100%;
  }

  .user-trigger {
    width: 100%;
    justify-content: flex-start;
  }

  .user-profile {
    width: 100%;
  }

  .username {
    margin-right: auto;
  }
  
  /* 悬浮菜单样式 */
  .hover-menu {
    width: calc(100vw - 2rem);
    left: 0;
    right: 0;
    margin: 0 auto;
    z-index: 999;
  }
  
  .hover-nav-list {
    display: flex;
    flex-direction: column;
  }
}

/* 桌面端样式：导航菜单靠右对齐 */
@media (min-width: 1024px) {
  .nav-list {
    margin-left: auto; /* 这使得导航列表靠右对齐 */
  }
  
  .nav-item:first-child {
    margin-left: 1.8rem;
  }
}
</style>