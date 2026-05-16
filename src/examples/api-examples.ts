/**
 * API 调用示例集合
 * 
 * 本文档展示如何调用后端 API 接口
 */

import { authApi, userApi } from '@/utils/api';
import type { LoginRequest, RegisterRequest } from '@/types/api';

// ============================================
// 1. 认证相关 API 调用示例
// ============================================

/**
 * 用户注册
 */
export async function registerExample() {
  try {
    const registerData: RegisterRequest = {
      email: 'newuser@example.com',
      password: 'Password123!',
      nickName: '新用户',
      phoneNumber: '13800138000'
    };
    
    const response = await authApi.register(registerData);
    console.log('注册成功:', response.data);
    return response.data;
  } catch (error) {
    console.error('注册失败:', error);
    throw error;
  }
}

/**
 * 用户登录
 */
export async function loginExample() {
  try {
    const loginData: LoginRequest = {
      email: 'user@example.com',
      password: 'Password123!'
    };
    
    const response = await authApi.login(loginData);
    console.log('登录成功:', response.data);
    
    // 登录成功后，token 会自动保存到 localStorage
    // 用户信息也会保存到 userStore
    
    return response.data;
  } catch (error) {
    console.error('登录失败:', error);
    throw error;
  }
}

/**
 * 获取当前登录用户信息
 */
export async function getCurrentUserExample() {
  try {
    const response = await authApi.getCurrentUser();
    console.log('当前用户信息:', response.data);
    return response.data;
  } catch (error) {
    console.error('获取用户信息失败:', error);
    throw error;
  }
}

// ============================================
// 2. 用户信息 API 调用示例
// ============================================

/**
 * 获取用户基本信息
 */
export async function getUserInfoExample() {
  try {
    const response = await userApi.getInfo();
    console.log('用户信息:', response.data);
    return response.data;
  } catch (error) {
    console.error('获取用户信息失败:', error);
    throw error;
  }
}

/**
 * 获取用户菜单树
 */
export async function getUserMenusExample() {
  try {
    const response = await userApi.getMenus();
    console.log('用户菜单:', response.data);
    
    // 处理菜单树
    response.data.forEach(menu => {
      console.log(`一级菜单：${menu.title} (${menu.path})`);
      
      if (menu.children && menu.children.length > 0) {
        menu.children.forEach(child => {
          console.log(`  └─ 子菜单：${child.title} (${child.path})`);
        });
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('获取菜单失败:', error);
    throw error;
  }
}

/**
 * 获取用户权限码列表
 */
export async function getUserPermissionsExample() {
  try {
    const response = await userApi.getPermissions();
    console.log('用户权限码:', response.data);
    
    // 检查特定权限
    const hasArticleCreate = response.data.includes('article:create');
    console.log('是否有文章创建权限:', hasArticleCreate);
    
    return response.data;
  } catch (error) {
    console.error('获取权限失败:', error);
    throw error;
  }
}

/**
 * 获取用户角色列表
 */
export async function getUserRolesExample() {
  try {
    const response = await userApi.getRoles();
    console.log('用户角色:', response.data);
    
    response.data.forEach(role => {
      console.log(`角色：${role.name} (${role.code})`);
      if (role.description) {
        console.log(`  描述：${role.description}`);
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('获取角色失败:', error);
    throw error;
  }
}

/**
 * 获取仪表盘统计数据
 */
export async function getDashboardStatsExample() {
  try {
    const response = await userApi.getDashboardStats();
    console.log('仪表盘数据:', response.data);
    
    const stats = response.data;
    console.log('文章总数:', stats.totalArticles);
    console.log('评论总数:', stats.totalComments);
    console.log('总访问量:', stats.totalViews);
    
    if (stats.recentVisits) {
      console.log('最近访问:');
      stats.recentVisits.forEach(visit => {
        console.log(`  ${visit.date}: ${visit.count} 次`);
      });
    }
    
    return response.data;
  } catch (error) {
    console.error('获取仪表盘数据失败:', error);
    throw error;
  }
}

// ============================================
// 3. 完整业务流程示例
// ============================================

/**
 * 完整的登录流程
 * 1. 登录获取 token
 * 2. 加载用户信息
 * 3. 加载权限和菜单
 * 4. 加载仪表盘数据
 */
export async function completeLoginFlow(email: string, password: string) {
  try {
    console.log('开始登录流程...');
    
    // 步骤 1: 登录
    console.log('步骤 1: 登录');
    const loginResponse = await authApi.login({ email, password });
    console.log('✅ 登录成功，Token 已保存');
    
    // 步骤 2: 加载用户信息、权限和菜单
    console.log('步骤 2: 加载用户信息、权限和菜单');
    const [userInfo, permissions, menus] = await Promise.all([
      userApi.getInfo(),
      userApi.getPermissions(),
      userApi.getMenus()
    ]);
    
    console.log('✅ 用户信息已加载:', userInfo.data);
    console.log('✅ 权限已加载:', permissions.data.length, '个权限码');
    console.log('✅ 菜单已加载:', menus.data.length, '个一级菜单');
    
    // 步骤 3: 加载仪表盘数据
    console.log('步骤 3: 加载仪表盘数据');
    const dashboardStats = await userApi.getDashboardStats();
    console.log('✅ 仪表盘数据已加载');
    
    console.log('\n🎉 登录流程完成!');
    console.log('=================================');
    console.log('用户信息:', userInfo.data);
    console.log('权限码数量:', permissions.data.length);
    console.log('菜单数量:', menus.data.length);
    console.log('文章总数:', dashboardStats.data.totalArticles);
    console.log('=================================');
    
    return {
      login: loginResponse.data,
      userInfo: userInfo.data,
      permissions: permissions.data,
      menus: menus.data,
      dashboardStats: dashboardStats.data
    };
  } catch (error) {
    console.error('❌ 登录流程失败:', error);
    throw error;
  }
}

/**
 * 登出流程
 */
export function logoutExample() {
  console.log('开始登出...');
  
  // 清除本地存储
  localStorage.removeItem('auth_token');
  localStorage.removeItem('user_info');
  
  console.log('✅ 本地数据已清除');
  console.log('✅ 即将跳转到登录页');
  
  // 跳转到登录页
  window.location.href = '/login';
}

// ============================================
// 4. 错误处理示例
// ============================================

/**
 * 带错误处理的 API 调用示例
 */
export async function apiCallWithErrorHandling() {
  try {
    const response = await userApi.getInfo();
    return response.data;
  } catch (error: any) {
    // 处理不同类型的错误
    if (error.response) {
      // 服务器返回错误响应
      const status = error.response.status;
      
      switch (status) {
        case 401:
          console.error('错误 401: 未授权或 Token 过期');
          // 清除本地数据并跳转登录页
          logoutExample();
          break;
          
        case 403:
          console.error('错误 403: 无权限访问');
          alert('您没有权限执行此操作');
          break;
          
        case 404:
          console.error('错误 404: 资源不存在');
          break;
          
        default:
          console.error(`错误 ${status}: 服务器错误`);
      }
    } else if (error.request) {
      // 请求已发送但没有收到响应
      console.error('网络错误：无法连接到服务器');
    } else {
      // 其他错误
      console.error('请求错误:', error.message);
    }
    
    throw error;
  }
}

// ============================================
// 5. 实际使用场景示例
// ============================================

/**
 * 场景 1: 根据权限显示按钮
 */
export function checkPermissionBeforeAction(permissionCode: string): boolean {
  const permissions = JSON.parse(localStorage.getItem('user_info')?.permissions || '[]');
  const hasPermission = permissions.includes(permissionCode);
  
  if (!hasPermission) {
    console.warn(`用户没有 ${permissionCode} 权限`);
    return false;
  }
  
  return true;
}

/**
 * 场景 2: 根据角色过滤内容
 */
export function filterContentByRole(content: any[], allowedRoles: string[]): any[] {
  const userInfoStr = localStorage.getItem('user_info');
  if (!userInfoStr) return [];
  
  const userInfo = JSON.parse(userInfoStr);
  const userRoles = userInfo.roles || [];
  
  // 检查用户是否有允许的角色
  const hasAllowedRole = allowedRoles.some(role => userRoles.includes(role));
  
  if (!hasAllowedRole) {
    console.warn(`用户没有以下角色权限：${allowedRoles.join(', ')}`);
    return [];
  }
  
  return content;
}

/**
 * 场景 3: 动态生成侧边栏
 */
export function generateSidebarFromMenus(menus: any[]): any[] {
  return menus.map(menu => {
    const menuItem = {
      id: menu.id,
      title: menu.title,
      path: menu.path,
      icon: menu.icon,
      children: [] as any[]
    };
    
    if (menu.children && menu.children.length > 0) {
      menuItem.children = generateSidebarFromMenus(menu.children);
    }
    
    return menuItem;
  });
}
