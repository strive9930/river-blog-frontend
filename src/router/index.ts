import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { useUserStore } from '@/stores/user';
import { addDynamicRoutes } from '@/utils/routeUtils';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Home.vue'),
    meta: { title: '首页', requiresAuth: false }
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('@/views/About.vue'),
    meta: { title: '关于', requiresAuth: false }
  },
  {
    path: '/blog',
    name: 'Blog',
    component: () => import('@/views/Blog.vue'),
    meta: { title: '博客', requiresAuth: false }
  },
  {
    path: '/article/:id',
    name: 'Article',
    component: () => import('@/views/Article.vue'),
    meta: { title: '文章详情', requiresAuth: false },
    props: true
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue'),
    meta: { title: '登录', requiresAuth: false }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/Register.vue'),
    meta: { title: '注册', requiresAuth: false }
  },
  {
    path: '/forgot-password',
    name: 'ForgotPassword',
    component: () => import('@/views/ForgotPassword.vue'),
    meta: { title: '忘记密码', requiresAuth: false }
  },
  {
    path: '/test',
    name: 'Test',
    component: () => import('@/views/TestPage.vue'),
    meta: { title: 'API 测试', requiresAuth: false }
  },
  // 动态路由将通过 addRoute 动态添加
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFound.vue'),
    meta: { title: '页面未找到', requiresAuth: false }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// 路由守卫
router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore();
  const token = localStorage.getItem('auth_token');

  console.log('[路由守卫] 访问路径:', to.path);
  console.log('[路由守卫] Token:', !!token);
  console.log('[路由守卫] isLoggedIn:', userStore.isLoggedIn);
  console.log('[路由守卫] getUserInfo:', userStore.getUserInfo);

  // 如果路由需要认证且用户未登录
  if (to.meta.requiresAuth && !userStore.isLoggedIn && !token) {
    console.log('[路由守卫] 未登录，需要跳转到登录页');
    next('/login');
    return;
  }

  // 如果用户已登录但还没有加载完整的用户信息，则加载它
  // 注意：只在访问非登录/注册页面时才执行
  if ((userStore.isLoggedIn || token) && to.path !== '/login' && to.path !== '/register' && to.path !== '/forgot-password') {
    // 检查是否需要加载完整的用户信息（有 token 但没有 permissions）
    const needLoadFullInfo = !userStore.permissions || userStore.permissions.length === 0;
    
    console.log('[路由守卫] needLoadFullInfo:', needLoadFullInfo, 'token:', !!token);
    
    if (needLoadFullInfo && token) {
      try {
        console.log('[路由守卫] 开始加载完整用户信息...');
        await userStore.loadUserInfo();
        console.log('[路由守卫] 用户信息加载完成');
        
        // 根据用户权限动态添加路由
        if (userStore.menus && userStore.menus.length > 0) {
          const dynamicRoutes = addDynamicRoutes(userStore.menus);
          dynamicRoutes.forEach(route => {
            if (!router.hasRoute(route.name!)) {
              router.addRoute(route);
            }
          });
          console.log('[路由守卫] 添加了动态路由');
        }
        
        // 重新导航到目标路由（因为添加了新路由）
        console.log('[路由守卫] 重新导航到:', to.path);
        next({ ...to, replace: true });
        return;
      } catch (error) {
        // 如果加载用户信息失败，可能是 token 失效了
        console.error('[路由守卫] 加载用户信息失败:', error);
        // 继续执行，不阻止用户访问页面
      }
    }

    // 如果访问登录页面且已经登录，则重定向到首页
    if (to.name === 'Login' || to.name === 'Register' || to.name === 'ForgotPassword') {
      console.log('[路由守卫] 已登录，从登录页重定向到首页');
      next('/');
      return;
    }
  }

  // 设置页面标题
  if (to.meta?.title) {
    document.title = `${to.meta.title} - River Blog`
  }

  console.log('[路由守卫] 正常通过:', to.path);
  next();
})

export default router