import axios from 'axios';
import type { 
  ApiResponse, 
  LoginRequest, 
  LoginResponse,
  LoginResponseData,
  UserInfo,
  MenuTree,
  DashboardStats,
  RegisterRequest,
  RoleInfo
} from '@/types/api';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api', // 使用环境变量
  timeout: 10000,
});

// 请求拦截器 - 自动添加Token
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

// 响应拦截器 - 处理401错误
api.interceptors.response.use(
  response => {
    const res = response.data;
    if (!res.success) {
      // 业务错误处理
      return Promise.reject(new Error(res.message || '请求失败'));
    }
    return res;
  },
  error => {
    if (error.response?.status === 401) {
      // 清除本地token
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_info');
      
      // 跳转到登录页
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  // 用户注册
  register: (data: RegisterRequest) => 
    api.post<ApiResponse>('/auth/register', data),

  // 用户登录（返回包含完整用户信息的数据）
  login: (data: LoginRequest) => 
    api.post<ApiResponse<LoginResponseData>>('/auth/login', data),

  // 获取当前用户信息
  getCurrentUser: () => 
    api.get<ApiResponse<UserInfo>>('/auth/me'),
};

export const userApi = {
  // 获取用户信息
  // 注意：推荐使用 authApi.getCurrentUser() 代替此方法
  getInfo: () => api.get<ApiResponse<UserInfo>>('/userfrontend/info'),

  // 获取用户菜单
  // 注意：如果后端未实现此接口，将返回空数组
  getMenus: () => api.get<ApiResponse<MenuTree[]>>('/userfrontend/menus'),

  // 获取用户权限
  // 注意：推荐使用 authApi.getCurrentUser() 从其中获取 permissions
  getPermissions: () => api.get<ApiResponse<string[]>>('/userfrontend/permissions'),

  // 获取用户角色
  // 注意：推荐使用 authApi.getCurrentUser() 从其中获取 roles
  getRoles: () => api.get<ApiResponse<RoleInfo[]>>('/userfrontend/roles'),

  // 获取仪表盘统计
  getDashboardStats: () => api.get<ApiResponse<DashboardStats>>('/userfrontend/dashboard/stats'),
};

// 权限检查辅助函数
export const hasPermission = (permissionCode: string): boolean => {
  const userInfoStr = localStorage.getItem('user_info');
  if (!userInfoStr) return false;
  
  try {
    const userInfo = JSON.parse(userInfoStr);
    const permissions = userInfo.permissions || [];
    return Array.isArray(permissions) && permissions.includes(permissionCode);
  } catch (e) {
    console.error('解析用户信息失败:', e);
    return false;
  }
};

export default api;