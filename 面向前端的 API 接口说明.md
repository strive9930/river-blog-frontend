# 📚 RiverLi Blog Identity API - 面向前端用户

## ✅ 已完成

### 1. 详细使用文档
**文件位置**: `API 使用文档.md`

**包含内容**:
- ✅ 快速开始指南
- ✅ 认证接口详细说明（注册、登录）
- ✅ 用户信息接口（获取信息、角色）
- ✅ 菜单和权限接口（动态菜单、权限控制）
- ✅ 响应格式规范
- ✅ 错误处理指南
- ✅ React + Axios 集成示例
- ✅ Vue 3 + Pinia 集成示例
- ✅ TypeScript 类型定义

### 2. 自动化工具（可选）
**文件位置**: `Helpers/FrontendRouteGenerator.cs`  
**用途**: 如果需要自动生成路由配置，可以使用此工具类

---

## 🎯 核心接口清单（8 个）

### 认证相关（3 个）
```typescript
POST   /api/auth/register      // 用户注册
POST   /api/auth/login         // 用户登录  
GET    /api/auth/me            // 获取当前用户信息（需认证）
```

### 用户前端数据（5 个）
```typescript
GET    /api/userfrontend/info          // 获取用户基本信息（需认证）
GET    /api/userfrontend/menus         // 获取用户菜单树（需认证）
GET    /api/userfrontend/permissions   // 获取用户权限码（需认证）
GET    /api/userfrontend/roles         // 获取用户角色列表（需认证）
GET    /api/userfrontend/dashboard/stats // 获取仪表盘统计（需认证）
```

---

## 🔐 认证流程

```javascript
// 1. 登录获取 Token
const loginResponse = await api.post('/auth/login', {
  email: 'user@example.com',
  password: 'password123'
});

const { token, user } = loginResponse.data;

// 2. 保存 Token
localStorage.setItem('auth_token', token);

// 3. 后续请求自动携带 Token
api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

// 4. 获取用户信息和权限
const [userInfo, menus, permissions] = await Promise.all([
  api.get('/userfrontend/info'),
  api.get('/userfrontend/menus'),
  api.get('/userfrontend/permissions')
]);

// 5. 基于权限渲染菜单和控制按钮
renderMenus(menus.data);
setupPermissionChecks(permissions.data);
```

---

## 📦 统一响应格式

所有接口都遵循以下格式：

```json
{
  "success": true,
  "message": "操作成功",
  "data": { /* 实际数据 */ },
  "errors": null
}
```

失败响应：

```json
{
  "success": false,
  "message": "错误描述",
  "data": null,
  "errors": {
    "field": ["错误信息"]
  }
}
```

---

## 💻 前端集成模板

### TypeScript 类型定义

```typescript
// src/types/api.d.ts
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
}

export interface UserInfo {
  id: string;
  email: string;
  nickName?: string;
  permissions: string[];
  roles: string[];
}

export interface MenuTree {
  id: string;
  name: string;
  title: string;
  path: string;
  children: MenuTree[];
}
```

### API Service 封装

```typescript
// src/services/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5001/api',
});

// 请求拦截器 - 自动添加 Token
api.interceptors.request.use(config => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 响应拦截器 - 处理 401
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  login: (data: any) => api.post('/auth/login', data),
  register: (data: any) => api.post('/auth/register', data),
  getCurrentUser: () => api.get('/auth/me'),
};

export const userApi = {
  getInfo: () => api.get('/userfrontend/info'),
  getMenus: () => api.get('/userfrontend/menus'),
  getPermissions: () => api.get('/userfrontend/permissions'),
  getRoles: () => api.get('/userfrontend/roles'),
  getDashboardStats: () => api.get('/userfrontend/dashboard/stats'),
};

export default api;
```

---

## 🚀 快速开始

### 步骤 1：查看完整文档
打开 `API 使用文档.md` 查看详细的接口说明、请求示例和集成代码。

### 步骤 2：复制集成代码
根据你的技术栈（React 或 Vue），复制对应的集成示例代码。

### 步骤 3：配置 API 地址
修改 `src/services/api.ts` 中的 `baseURL` 为实际的 API 地址。

### 步骤 4：开始开发
使用提供的 TypeScript 类型定义和 API Service 开始开发。

---

## 📝 常见问题

### Q: Token 过期了怎么办？
A: 当收到 401 错误时，清除本地存储的 Token 并跳转到登录页。

### Q: 如何实现按钮级权限控制？
A: 
1. 调用 `/userfrontend/permissions` 获取权限码列表
2. 在组件中检查权限码：`hasPermission('article:create')`
3. 根据结果显示/隐藏按钮

### Q: 动态路由如何生成？
A:
1. 登录后调用 `/userfrontend/menus` 获取菜单树
2. 根据菜单树动态生成路由配置
3. 使用路由库的 `addRoutes` 或类似方法注册

---

## 🔗 相关资源

- **完整文档**: `API 使用文档.md`
- **类型定义**: 参见文档中的 TypeScript Definitions 章节
- **示例代码**: 参见文档中的前端集成示例部分

---

**最后更新**: 2026-03-12  
**维护者**: RiverLi Team
