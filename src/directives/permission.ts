import type { App, Directive } from 'vue';
import { useUserStore } from '@/stores/user';

/**
 * 权限指令 v-permission
 * 用法：v-permission="'article:create'" 或 v-permission="['article:create', 'article:edit']"
 */
const permission: Directive = {
  mounted(el, binding) {
    const userStore = useUserStore();
    const { value } = binding;
    
    if (!value) {
      console.warn('权限指令需要提供权限码');
      el.parentNode?.removeChild(el);
      return;
    }
    
    // 支持单个权限码或权限码数组
    const requiredPermissions = Array.isArray(value) ? value : [value];
    
    // 检查是否有任一权限
    const hasPermission = requiredPermissions.some(permission => 
      userStore.hasPermission(permission)
    );
    
    if (!hasPermission) {
      // 如果没有权限，移除元素
      el.parentNode?.removeChild(el);
    }
  },
  
  // 在组件更新时重新检查权限（当权限状态变化时）
  updated(el, binding) {
    const userStore = useUserStore();
    const { value } = binding;
    
    if (!value) {
      el.parentNode?.removeChild(el);
      return;
    }
    
    const requiredPermissions = Array.isArray(value) ? value : [value];
    const hasPermission = requiredPermissions.some(permission => 
      userStore.hasPermission(permission)
    );
    
    if (!hasPermission) {
      el.style.display = 'none';
    } else {
      el.style.display = '';
    }
  }
};

/**
 * 角色指令 v-role
 * 用法：v-role="'Admin'" 或 v-role="['Admin', 'VIP']"
 */
const role: Directive = {
  mounted(el, binding) {
    const userStore = useUserStore();
    const { value } = binding;
    
    if (!value) {
      console.warn('角色指令需要提供角色码');
      el.parentNode?.removeChild(el);
      return;
    }
    
    // 支持单个角色或角色数组
    const requiredRoles = Array.isArray(value) ? value : [value];
    
    // 检查用户是否有任一角色
    const userRoles = userStore.userInfo?.roles || [];
    const hasRole = requiredRoles.some(role => userRoles.includes(role));
    
    if (!hasRole) {
      el.parentNode?.removeChild(el);
    }
  },
  
  updated(el, binding) {
    const userStore = useUserStore();
    const { value } = binding;
    
    if (!value) {
      el.parentNode?.removeChild(el);
      return;
    }
    
    const requiredRoles = Array.isArray(value) ? value : [value];
    const userRoles = userStore.userInfo?.roles || [];
    const hasRole = requiredRoles.some(role => userRoles.includes(role));
    
    if (!hasRole) {
      el.style.display = 'none';
    } else {
      el.style.display = '';
    }
  }
};

/**
 * 注册全局指令
 */
export function setupDirectives(app: App) {
  app.directive('permission', permission);
  app.directive('role', role);
}

export default {
  install(app: App) {
    setupDirectives(app);
  }
};
