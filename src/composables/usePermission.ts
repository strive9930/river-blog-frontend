import { computed } from 'vue';
import { useUserStore } from '@/stores/user';

/**
 * 权限和角色相关的组合式函数
 */
export function usePermission() {
  const userStore = useUserStore();

  // 检查是否有某个权限
  const hasPermission = (permissionCode: string | string[]): boolean => {
    const codes = Array.isArray(permissionCode) ? permissionCode : [permissionCode];
    return codes.some(code => userStore.hasPermission(code));
  };

  // 检查是否有某个角色
  const hasRole = (roleCode: string | string[]): boolean => {
    const codes = Array.isArray(roleCode) ? roleCode : [roleCode];
    const userRoles = userStore.userInfo?.roles || [];
    return codes.some(code => userRoles.includes(code));
  };

  // 检查是否是管理员
  const isAdmin = computed(() => {
    const userRoles = userStore.userInfo?.roles || [];
    return userRoles.includes('Admin') || userRoles.includes('admin');
  });

  // 检查是否是 VIP 用户
  const isVIP = computed(() => {
    const userRoles = userStore.userInfo?.roles || [];
    return userRoles.includes('VIP') || userRoles.includes('vip');
  });

  return {
    hasPermission,
    hasRole,
    isAdmin,
    isVIP,
    userInfo: computed(() => userStore.userInfo),
    permissions: computed(() => userStore.permissions),
    roles: computed(() => userStore.userInfo?.roles || []),
  };
}

/**
 * 菜单相关的组合式函数
 */
export function useMenu() {
  const userStore = useUserStore();

  // 获取一级菜单
  const mainMenus = computed(() => {
    return userStore.menus.filter(menu => !menu.parentId);
  });

  // 获取子菜单
  const getChildMenus = (parentId: string) => {
    return userStore.menus.filter(menu => menu.parentId === parentId);
  };

  // 根据路径查找菜单
  const findMenuByPath = (path: string): any => {
    const findMenu = (menus: any[], targetPath: string): any => {
      for (const menu of menus) {
        if (menu.path === targetPath) {
          return menu;
        }
        if (menu.children && menu.children.length > 0) {
          const found = findMenu(menu.children, targetPath);
          if (found) return found;
        }
      }
      return null;
    };
    
    return findMenu(userStore.menus, path);
  };

  return {
    mainMenus,
    getChildMenus,
    findMenuByPath,
    allMenus: computed(() => userStore.menus),
  };
}

/**
 * 仪表盘相关的组合式函数
 */
export function useDashboard() {
  const userStore = useUserStore();

  const loadStats = async () => {
    return await userStore.loadDashboardStats();
  };

  return {
    stats: computed(() => userStore.dashboardStats),
    loadStats,
    totalArticles: computed(() => userStore.dashboardStats?.totalArticles || 0),
    totalComments: computed(() => userStore.dashboardStats?.totalComments || 0),
    totalViews: computed(() => userStore.dashboardStats?.totalViews || 0),
  };
}
