export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
  errors?: Record<string, string[]>;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  expiresIn: number;
  tokenType: string;
  user: UserInfo;
}

export interface RegisterRequest {
  email: string;
  password: string;
  nickName?: string;
  phoneNumber?: string;
}

export interface UserInfo {
  id: string;
  email: string;
  nickName?: string;
  avatar?: string;
  phoneNumber?: string;
  isEnabled: boolean;
  roles?: string[];  // 角色列表
  permissions?: string[];  // 权限码列表
}

export interface MenuTree {
  id: string;
  name: string;
  title: string;
  path: string;
  component: string;
  icon?: string;
  sort: number;
  parentId?: string;
  children: MenuTree[];
}

export interface DashboardStats {
  totalArticles: number;
  totalComments: number;
  totalViews: number;
  recentVisits: Array<{
    date: string;
    count: number;
  }>;
}

export interface RoleInfo {
  id: string;
  name: string;
  code: string;
  description: string;
  isEnabled: boolean;
}
