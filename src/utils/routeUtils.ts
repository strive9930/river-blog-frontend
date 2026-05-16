import type { MenuTree } from '@/types/api';
import { RouteRecordRaw } from 'vue-router';

/**
 * 将菜单树转换为路由配置
 */
export function convertMenuToRoutes(menus: MenuTree[], parentPath = ''): RouteRecordRaw[] {
  const routes: RouteRecordRaw[] = [];
  
  menus.forEach(menu => {
    const fullPath = parentPath ? `${parentPath}/${menu.path.replace(/^\//, '')}` : menu.path;
    
    // 创建路由配置
    const route: RouteRecordRaw = {
      path: menu.path,
      name: menu.name,
      component: () => import(`@/views/DynamicView.vue`), // 使用动态视图组件
      meta: { 
        title: menu.title,
        requiresAuth: true,
        icon: menu.icon,
        menuId: menu.id,
        parentId: menu.parentId
      }
    };
    
    // 如果有子菜单，递归处理并添加到 children
    if (menu.children && menu.children.length > 0) {
      route.children = convertMenuToRoutes(menu.children, fullPath);
    }
    
    routes.push(route);
  });
  
  return routes;
}

/**
 * 根据权限过滤路由
 */
export function filterRoutesByPermissions(routes: RouteRecordRaw[], permissions: string[]): RouteRecordRaw[] {
  return routes.filter(route => {
    // 如果路由没有权限要求，默认允许访问
    if (!route.meta?.permission) return true;
    
    // 检查是否具有访问该路由的权限
    return permissions.some(p => route.meta?.permission === p);
  });
}

/**
 * 动态添加路由到路由器
 */
export function addDynamicRoutes(menus: MenuTree[]) {
  return convertMenuToRoutes(menus);
}

/**
 * 生成侧边栏菜单树（用于前端展示）
 */
export function generateSidebarMenu(menus: MenuTree[]): MenuTree[] {
  return menus.map(menu => ({
    ...menu,
    children: menu.children ? generateSidebarMenu(menu.children) : []
  }));
}