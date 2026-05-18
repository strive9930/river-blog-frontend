import { defineStore } from 'pinia';
import { authApi, userApi } from '@/utils/api';
import type { 
  UserInfo, 
  MenuTree, 
  DashboardStats, 
  LoginRequest,
  RegisterRequest,
  LoginResponseData
} from '@/types/api';

export const useUserStore = defineStore('user', {
  state: () => ({
    token: localStorage.getItem('auth_token') || '',
    userInfo: null as UserInfo | null,
    permissions: [] as string[],
    menus: [] as MenuTree[],
    dashboardStats: null as DashboardStats | null,
  }),

  getters: {
    isLoggedIn: (state) => !!state.token,
    hasPermission: (state) => (code: string) => state.permissions.includes(code),
    getUserInfo: (state) => state.userInfo,
    getMenuTree: (state) => state.menus,
  },

  actions: {
    async login(credentials: LoginRequest) {
      console.log('[Store.login] 开始调用登录 API...');
      
      // 调用登录接口，后端应返回完整数据（token + 用户信息 + 权限 + 菜单 + 角色）
      const response = await authApi.login(credentials);
      
      console.log('[Store.login] API 返回数据:', response);
      console.log('[Store.login] response.success:', response?.success);
      console.log('[Store.login] response.data:', response?.data);
      
      if (!response?.success || !response?.data) {
        console.error('[Store.login] ❌ 登录失败');
        throw new Error(response?.message || '登录失败');
      }
      
      const loginData: LoginResponseData = response.data;
      
      // 检查必要字段
      if (!loginData.token) {
        console.error('[Store.login] ❌ Token 不存在！');
        throw new Error('登录失败：未收到 Token');
      }
      
      console.log('[Store.login] ✅ 收到响应，Token:', loginData.token.substring(0, 20) + '...');
      console.log('[Store.login] 用户ID:', loginData.userId);
      console.log('[Store.login] 用户名:', loginData.username);
      console.log('[Store.login] 角色数量:', loginData.roles?.length || 0);
      console.log('[Store.login] 权限数量:', loginData.permissions?.length || 0);
      console.log('[Store.login] 菜单数量:', loginData.menus?.length || 0);
      console.log('[Store.login] 是否管理员:', loginData.isAdmin);
      
      // 构建完整的用户信息对象
      const userInfo: UserInfo = {
        id: loginData.userId,
        email: loginData.email || credentials.email,
        nickName: loginData.nickname,
        nickname: loginData.nickname,
        avatar: loginData.avatar,
        isEnabled: true,
        roles: loginData.roles?.map(r => r.code || r.name) || [],
        permissions: loginData.permissions || [],
        menus: loginData.menus || [],
        isAdmin: loginData.isAdmin || false
      };
      
      console.log('[Store.login] 设置的用户信息:', userInfo);
      
      // 存储 token 和用户信息
      this.token = loginData.token;
      this.userInfo = userInfo;
      this.permissions = loginData.permissions || [];
      this.menus = loginData.menus || [];
      
      // 持久化到 localStorage
      localStorage.setItem('auth_token', loginData.token);
      localStorage.setItem('user_info', JSON.stringify(userInfo));
      
      console.log('[Store.login] ✅ 已保存到 localStorage');
      console.log('[Store.login] localStorage 验证:', localStorage.getItem('auth_token') ? '✅ 成功' : '❌ 失败');
      
      return response;
    },

    async register(userData: RegisterRequest) {
      const response = await authApi.register(userData);
      return response.data;
    },

    logout() {
      this.token = '';
      this.userInfo = null;
      this.permissions = [];
      this.menus = [];
      this.dashboardStats = null;
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_info');
    },

    async loadUserInfo() {
      try {
        console.log('[loadUserInfo] 开始加载用户信息...');
        
        // 使用 /api/auth/me 接口获取用户信息
        const authResponse = await authApi.getCurrentUser();
        console.log('[loadUserInfo] ✅ 获取到用户信息:', authResponse.data);
        
        this.userInfo = authResponse.data;
        this.permissions = authResponse.data.permissions || [];
        
        // 尝试获取菜单（可选，失败不影响）
        try {
          console.log('[loadUserInfo] 尝试获取菜单...');
          const menuResponse = await userApi.getMenus();
          this.menus = menuResponse.data;
          console.log('[loadUserInfo] ✅ 获取到菜单:', this.menus.length, '个');
        } catch (menuError: any) {
          console.warn('[loadUserInfo] ⚠️ 获取菜单失败:', menuError.message);
          this.menus = [];
        }
        
        console.log('[loadUserInfo] ✅ 用户信息加载完成');
        return authResponse.data;
      } catch (error: any) {
        console.error('[loadUserInfo] ❌ 加载用户信息失败:', error);
        throw error;
      }
    },

    async loadDashboardStats() {
      try {
        const response = await userApi.getDashboardStats();
        this.dashboardStats = response.data;
        return response.data;
      } catch (error) {
        console.error('加载仪表盘数据失败:', error);
        throw error;
      }
    },

    async refreshPermissionsAndMenus() {
      try {
        const [permRes, menuRes] = await Promise.all([
          userApi.getPermissions(),
          userApi.getMenus()
        ]);
        
        this.permissions = permRes.data;
        this.menus = menuRes.data;
      } catch (error) {
        console.error('刷新权限和菜单失败:', error);
        throw error;
      }
    }
  },
});