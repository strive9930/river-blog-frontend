# 📚 RiverLi Blog Identity API 使用文档

## 🎯 面向普通用户的接口

本文档专门介绍**前端应用和普通用户**需要使用的 API 接口。

---

## 📋 目录

1. [快速开始](#快速开始)
2. [认证接口](#认证接口)
3. [用户信息接口](#用户信息接口)
4. [菜单和权限接口](#菜单和权限接口)
5. [响应格式说明](#响应格式说明)
6. [错误处理](#错误处理)
7. [前端集成示例](#前端集成示例)

---

## 🚀 快速开始

### 基础配置

- **API 基础地址**: `http://localhost:5001/api` (开发环境)
- **认证方式**: JWT Bearer Token
- **请求格式**: `application/json`
- **响应格式**: `application/json`

### 统一响应格式

所有接口都遵循以下响应格式：

```json
{
  "success": true,
  "message": "操作成功",
  "data": {},
  "errors": null
}
```

---

## 🔐 认证接口

### 1. 用户注册

**接口**: `POST /api/auth/register`

**请求示例**:
```bash
curl -X POST http://localhost:5001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "Password123!",
    "nickName": "张三",
    "phoneNumber": "13800138000"
  }'
```

**响应示例**:
```json
{
  "success": true,
  "message": "注册成功",
  "data": {
    "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "email": "user@example.com",
    "nickName": "张三",
    "phoneNumber": "13800138000",
    "isEnabled": true,
    "createTime": "2026-03-12T09:00:00Z"
  }
}
```

**字段说明**:
| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| email | string | ✅ | 邮箱（用作登录账号） |
| password | string | ✅ | 密码（至少 6 位） |
| nickName | string | ❌ | 昵称 |
| phoneNumber | string | ❌ | 手机号 |

---

### 2. 用户登录

**接口**: `POST /api/auth/login`

**请求示例**:
```bash
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "Password123!"
  }'
```

**响应示例**:
```json
{
  "success": true,
  "message": "登录成功",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 3600,
    "tokenType": "Bearer",
    "user": {
      "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "email": "user@example.com",
      "nickName": "张三"
    }
  }
}
```

**重要说明**:
- ⚠️ 登录成功后，需要将 `token` 保存到本地存储
- ⚠️ Token 有效期为 60 分钟（3600 秒）
- ⚠️ 后续请求需要在 Header 中携带 Token

**前端保存 Token 示例**:
```javascript
// 登录成功后
localStorage.setItem('auth_token', response.data.token);
localStorage.setItem('user_info', JSON.stringify(response.data.user));

// 设置 axios 默认请求头
axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
```

---

### 3. 获取当前用户信息

**接口**: `GET /api/auth/me`

**认证**: ✅ 需要登录

**请求示例**:
```bash
curl -X GET http://localhost:5001/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**响应示例**:
```json
{
  "success": true,
  "message": "获取成功",
  "data": {
    "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "email": "user@example.com",
    "nickName": "张三",
    "phoneNumber": "13800138000",
    "avatar": null,
    "isEnabled": true,
    "roles": ["User"],
    "permissions": ["article:view", "comment:create"]
  }
}
```

---

## 👤 用户信息接口

### 1. 获取用户基本信息

**接口**: `GET /api/userfrontend/info`

**认证**: ✅ 需要登录

**请求示例**:
```bash
curl -X GET http://localhost:5001/api/userfrontend/info \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**响应示例**:
```json
{
  "success": true,
  "message": "获取成功",
  "data": {
    "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "email": "user@example.com",
    "nickName": "张三",
    "avatar": "https://example.com/avatar.jpg",
    "phoneNumber": "13800138000",
    "isEnabled": true
  }
}
```

---

### 2. 获取用户角色列表

**接口**: `GET /api/userfrontend/roles`

**认证**: ✅ 需要登录

**请求示例**:
```bash
curl -X GET http://localhost:5001/api/userfrontend/roles \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**响应示例**:
```json
{
  "success": true,
  "message": "获取成功",
  "data": [
    {
      "id": "role-id-1",
      "name": "普通用户",
      "code": "User",
      "description": "普通用户角色",
      "isEnabled": true
    },
    {
      "id": "role-id-2",
      "name": "VIP 用户",
      "code": "VIP",
      "description": "VIP 会员角色",
      "isEnabled": true
    }
  ]
}
```

---

## 🎨 菜单和权限接口

### 1. 获取用户的菜单权限（树形结构）

**接口**: `GET /api/userfrontend/menus`

**认证**: ✅ 需要登录

**用途**: 
- 动态生成侧边栏菜单
- 根据权限过滤可访问的菜单项

**请求示例**:
```bash
curl -X GET http://localhost:5001/api/userfrontend/menus \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**响应示例**:
```json
{
  "success": true,
  "message": "获取成功",
  "data": [
    {
      "id": "menu-id-1",
      "name": "Dashboard",
      "title": "仪表盘",
      "path": "/dashboard",
      "component": "Layout",
      "icon": "dashboard",
      "sort": 1,
      "parentId": null,
      "children": [
        {
          "id": "menu-id-2",
          "name": "Analysis",
          "title": "分析页面",
          "path": "/dashboard/analysis",
          "component": "Dashboard/Analysis",
          "icon": null,
          "sort": 1,
          "parentId": "menu-id-1",
          "children": []
        }
      ]
    },
    {
      "id": "menu-id-3",
      "name": "Article",
      "title": "文章管理",
      "path": "/article",
      "component": "Layout",
      "icon": "file",
      "sort": 2,
      "parentId": null,
      "children": []
    }
  ]
}
```

**菜单树结构说明**:
- `parentId: null` 表示一级菜单
- `children` 数组包含子菜单
- 最多支持多级嵌套

---

### 2. 获取用户的权限码列表

**接口**: `GET /api/userfrontend/permissions`

**认证**: ✅ 需要登录

**用途**:
- 按钮级权限控制
- 功能访问权限判断

**请求示例**:
```bash
curl -X GET http://localhost:5001/api/userfrontend/permissions \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**响应示例**:
```json
{
  "success": true,
  "message": "获取成功",
  "data": [
    "article:view",
    "article:create",
    "article:edit",
    "comment:view",
    "comment:create",
    "comment:delete"
  ]
}
```

**前端使用示例**:
```javascript
// Vue 3 示例
const permissions = ref([]);

async function loadPermissions() {
  const response = await api.get('/userfrontend/permissions');
  permissions.value = response.data.data;
}

// 判断是否有权限
function hasPermission(code) {
  return permissions.value.includes(code);
}

// 组件中使用
// <button v-if="hasPermission('article:create')">发布文章</button>
```

---

### 3. 获取仪表盘统计数据

**接口**: `GET /api/userfrontend/dashboard/stats`

**认证**: ✅ 需要登录

**用途**: 首页仪表盘数据展示

**请求示例**:
```bash
curl -X GET http://localhost:5001/api/userfrontend/dashboard/stats \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**响应示例**:
```json
{
  "success": true,
  "message": "获取成功",
  "data": {
    "totalArticles": 15,
    "totalComments": 128,
    "totalViews": 3520,
    "recentVisits": [
      {
        "date": "2026-03-11",
        "count": 120
      },
      {
        "date": "2026-03-12",
        "count": 95
      }
    ]
  }
}
```

---

## 📦 响应格式说明

### 成功响应

```json
{
  "success": true,
  "message": "操作成功",
  "data": { /* 实际数据 */ },
  "errors": null
}
```

### 失败响应

```json
{
  "success": false,
  "message": "错误描述信息",
  "data": null,
  "errors": {
    "field1": ["错误 1"],
    "field2": ["错误 2"]
  }
}
```

### HTTP 状态码

| 状态码 | 说明 |
|--------|------|
| 200 OK | 请求成功 |
| 400 Bad Request | 请求参数错误 |
| 401 Unauthorized | 未授权或 Token 过期 |
| 403 Forbidden | 无权限访问 |
| 404 Not Found | 资源不存在 |
| 500 Internal Server Error | 服务器内部错误 |

---

## ❌ 错误处理

### 401 未授权（Token 过期）

当收到 401 错误时，说明 Token 已过期或无效：

```javascript
// axios 拦截器示例
axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response.status === 401) {
      // 清除本地 token
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_info');
      
      // 跳转到登录页
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

### 403 无权限

```javascript
if (error.response.status === 403) {
  // 显示无权限提示
  alert('您没有权限执行此操作');
}
```

---

## 💻 前端集成示例

### React + Axios 完整示例

```javascript
// src/utils/request.js
import axios from 'axios';

const request = axios.create({
  baseURL: 'http://localhost:5001/api',
  timeout: 10000,
});

// 请求拦截器 - 添加 Token
request.interceptors.request.use(
  config => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

// 响应拦截器 - 处理错误
request.interceptors.response.use(
  response => {
    const res = response.data;
    if (!res.success) {
      // 业务错误处理
      throw new Error(res.message || '请求失败');
    }
    return res;
  },
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default request;
```

```javascript
// src/hooks/useAuth.js
import { useState, useEffect } from 'react';
import request from '@/utils/request';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [permissions, setPermissions] = useState([]);
  const [menus, setMenus] = useState([]);

  // 登录
  const login = async (email, password) => {
    const response = await request.post('/auth/login', { email, password });
    const { token, user: userInfo } = response.data;
    
    localStorage.setItem('auth_token', token);
    localStorage.setItem('user_info', JSON.stringify(userInfo));
    setUser(userInfo);
    
    return response.data;
  };

  // 登出
  const logout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_info');
    setUser(null);
    setPermissions([]);
    setMenus([]);
  };

  // 加载用户信息
  const loadUserInfo = async () => {
    try {
      const [userRes, permRes, menuRes] = await Promise.all([
        request.get('/userfrontend/info'),
        request.get('/userfrontend/permissions'),
        request.get('/userfrontend/menus')
      ]);
      
      setUser(userRes.data);
      setPermissions(permRes.data);
      setMenus(menuRes.data);
    } catch (error) {
      console.error('加载用户信息失败:', error);
    }
  };

  // 检查权限
  const hasPermission = (code) => {
    return permissions.includes(code);
  };

  return {
    user,
    permissions,
    menus,
    login,
    logout,
    loadUserInfo,
    hasPermission,
  };
}
```

```javascript
// src/App.jsx
import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import Router from '@/router';

function App() {
  const { user, loadUserInfo } = useAuth();

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (token && !user) {
      loadUserInfo();
    }
  }, []);

  return <Router user={user} />;
}
```

```javascript
// src/router/index.jsx
import { useMemo } from 'react';
import { createBrowserRouter } from 'react-router-dom';

export default function Router({ user }) {
  // 根据菜单动态生成路由
  const router = useMemo(() => {
    return createBrowserRouter([
      {
        path: '/',
        element: <Layout />,
        children: user?.menus?.map(menu => ({
          path: menu.path,
          element: <Component key={menu.id} {...menu} />,
        })) || []
      }
    ]);
  }, [user?.menus]);

  return <RouterProvider router={router} />;
}
```

---

### Vue 3 + Pinia 示例

```javascript
// src/stores/user.js
import { defineStore } from 'pinia';
import api from '@/utils/api';

export const useUserStore = defineStore('user', {
  state: () => ({
    token: localStorage.getItem('auth_token') || '',
    userInfo: null,
    permissions: [],
    menus: [],
  }),

  getters: {
    isLoggedIn: (state) => !!state.token,
    hasPermission: (state) => (code) => state.permissions.includes(code),
  },

  actions: {
    async login(email, password) {
      const response = await api.post('/auth/login', { email, password });
      const { token, user } = response.data;
      
      this.token = token;
      this.userInfo = user;
      localStorage.setItem('auth_token', token);
      
      await this.loadUserInfo();
      return response.data;
    },

    logout() {
      this.token = '';
      this.userInfo = null;
      this.permissions = [];
      this.menus = [];
      localStorage.removeItem('auth_token');
    },

    async loadUserInfo() {
      const [userRes, permRes, menuRes] = await Promise.all([
        api.get('/userfrontend/info'),
        api.get('/userfrontend/permissions'),
        api.get('/userfrontend/menus')
      ]);
      
      this.userInfo = userRes.data;
      this.permissions = permRes.data;
      this.menus = menuRes.data;
    },
  },
});
```

---

## 🔧 自动生成的路由配置

### TypeScript 类型定义

```typescript
// src/types/api.d.ts
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

export interface UserInfo {
  id: string;
  email: string;
  nickName?: string;
  avatar?: string;
  phoneNumber?: string;
  isEnabled: boolean;
  roles: string[];
  permissions: string[];
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
```

### API Service 封装

```typescript
// src/services/api.ts
import axios from 'axios';
import type { 
  ApiResponse, 
  LoginRequest, 
  LoginResponse,
  UserInfo,
  MenuTree,
  DashboardStats 
} from '@/types/api';

const api = axios.create({
  baseURL: 'http://localhost:5001/api',
  timeout: 10000,
});

// 添加请求拦截器
api.interceptors.request.use(config => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authApi = {
  // 用户注册
  register(data: { email: string; password: string; nickName?: string }): Promise<ApiResponse> {
    return api.post('/auth/register', data);
  },

  // 用户登录
  login(data: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    return api.post('/auth/login', data);
  },

  // 获取当前用户信息
  getCurrentUser(): Promise<ApiResponse<UserInfo>> {
    return api.get('/auth/me');
  },
};

export const userFrontendApi = {
  // 获取用户信息
  getInfo(): Promise<ApiResponse<UserInfo>> {
    return api.get('/userfrontend/info');
  },

  // 获取用户菜单
  getMenus(): Promise<ApiResponse<MenuTree[]>> {
    return api.get('/userfrontend/menus');
  },

  // 获取用户权限
  getPermissions(): Promise<ApiResponse<string[]>> {
    return api.get('/userfrontend/permissions');
  },

  // 获取用户角色
  getRoles(): Promise<ApiResponse<Array<{ id: string; name: string; code: string }>>> {
    return api.get('/userfrontend/roles');
  },

  // 获取仪表盘统计
  getDashboardStats(): Promise<ApiResponse<DashboardStats>> {
    return api.get('/userfrontend/dashboard/stats');
  },
};

export default api;
```

---

## 📝 总结

### 接口清单

| 分类 | 接口数量 | 说明 |
|------|---------|------|
| 认证接口 | 3 个 | 注册、登录、获取当前用户 |
| 用户信息 | 2 个 | 基本信息、角色列表 |
| 菜单权限 | 3 个 | 菜单树、权限码、仪表盘 |
| **总计** | **8 个** | 全部需要前端调用的接口 |

### 最佳实践

1. ✅ **Token 管理**: 登录后保存 Token，登出时清除
2. ✅ **错误处理**: 统一处理 401、403 等错误
3. ✅ **权限控制**: 基于权限码实现按钮级控制
4. ✅ **动态路由**: 根据菜单树动态生成路由
5. ✅ **请求拦截**: 统一添加 Token 到请求头

### 安全建议

1. ⚠️ Token 存储在 localStorage 中（注意 XSS 风险）
2. ⚠️ 生产环境使用 HTTPS
3. ⚠️ 定期刷新 Token（避免过期）
4. ⚠️ 敏感操作需要二次验证

---

**文档版本**: v1.0  
**最后更新**: 2026-03-12  
**维护者**: RiverLi Team
