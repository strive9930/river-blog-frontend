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

export interface LoginResponseData {
  token: string;
  expiresIn: number;
  tokenType: string;
  userId: string;
  username: string;
  nickname?: string;
  email?: string;
  avatar?: string;
  roles: RoleInfo[];
  permissions: string[];
  menus: MenuTree[];
  isAdmin: boolean;
  createdAt?: string;
  user?: UserInfo; // 兼容旧格式
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
  nickname?: string; // 兼容后端返回的nickname字段
  avatar?: string;
  phoneNumber?: string;
  isEnabled: boolean;
  roles?: string[];  // 角色列表
  permissions?: string[];  // 权限码列表
  menus?: MenuTree[];  // 菜单树
  isAdmin?: boolean;  // 是否管理员
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
