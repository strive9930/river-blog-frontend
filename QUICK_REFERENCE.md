# 🚀 权限控制快速参考

## 📦 导入语句

```typescript
// Store
import { useUserStore } from '@/stores/user';

// Composables
import { usePermission, useMenu, useDashboard } from '@/composables/usePermission';

// API
import { authApi, userApi } from '@/utils/api';

// 指令（模板中直接使用）
// v-permission - 权限控制
// v-role - 角色控制
```

---

## 🎯 常用方法速查

### 权限检查

```typescript
const { hasPermission } = usePermission();

// 单个权限
hasPermission('article:create')

// 多个权限（满足任一）
hasPermission(['article:edit', 'article:delete'])
```

### 角色检查

```typescript
const { hasRole } = usePermission();

// 单个角色
hasRole('Admin')

// 多个角色（满足任一）
hasRole(['Admin', 'VIP'])
```

### 用户信息

```typescript
const { userInfo, permissions, roles } = usePermission();

userInfo.value      // 完整用户信息
permissions.value   // 权限码列表
roles.value         // 角色列表
```

### 菜单操作

```typescript
const { mainMenus, getChildMenus, findMenuByPath } = useMenu();

mainMenus.value                    // 一级菜单
getChildMenus('menu-id-1')         // 获取子菜单
findMenuByPath('/dashboard')       // 查找菜单
```

### 仪表盘数据

```typescript
const { stats, totalArticles, totalComments, totalViews } = useDashboard();

stats.value            // 完整统计数据
totalArticles.value    // 文章总数
totalComments.value    // 评论总数
totalViews.value       // 总访问量
```

---

## 🎨 模板指令用法

### v-permission 指令

```vue
<!-- 单个权限 -->
<button v-permission="'article:create'">发布文章</button>

<!-- 多个权限 -->
<button v-permission="['article:edit', 'article:delete']">
  编辑或删除
</button>
```

### v-role 指令

```vue
<!-- 单个角色 -->
<div v-role="'Admin'">管理员内容</div>

<!-- 多个角色 -->
<div v-role="['Admin', 'VIP']">管理员或 VIP</div>
```

---

## 💻 完整组件示例

```vue
<template>
  <div class="article-page">
    <!-- 权限按钮 -->
    <el-button 
      v-permission="'article:create'" 
      type="primary"
      @click="handleCreate"
    >
      发布文章
    </el-button>
    
    <!-- 角色按钮 -->
    <el-button 
      v-role="'Admin'" 
      type="warning"
      @click="handleAudit"
    >
      审核文章
    </el-button>
    
    <!-- 条件渲染 -->
    <div v-if="hasPermission('dashboard:view')">
      仪表盘面板
    </div>
  </div>
</template>

<script setup lang="ts">
import { usePermission } from '@/composables/usePermission';

const { hasPermission, hasRole, userInfo } = usePermission();

const handleCreate = () => { /* ... */ };
const handleAudit = () => { /* ... */ };
</script>
```

---

## 🔌 API 调用示例

### 登录流程

```typescript
import { useUserStore } from '@/stores/user';

const userStore = useUserStore();

// 登录
await userStore.login({
  email: 'user@example.com',
  password: 'password123'
});

// 登录后自动加载：
// - userInfo (用户信息)
// - permissions (权限码)
// - menus (菜单树)
// - roles (角色列表)
```

### 手动加载数据

```typescript
import { userApi } from '@/utils/api';

// 获取用户信息
const userInfo = await userApi.getInfo();

// 获取权限码
const permissions = await userApi.getPermissions();

// 获取菜单树
const menus = await userApi.getMenus();

// 获取角色列表
const roles = await userApi.getRoles();

// 获取仪表盘数据
const stats = await userApi.getDashboardStats();
```

---

## ⚡ 常用判断

```typescript
const { hasPermission, hasRole, isAdmin, isVIP } = usePermission();

// 检查权限
if (hasPermission('article:create')) { /* ... */ }

// 检查角色
if (hasRole('Admin')) { /* ... */ }

// 快捷判断
if (isAdmin.value) { /* 管理员操作 */ }
if (isVIP.value) { /* VIP 操作 */ }
```

---

## 🎯 最佳实践

### ✅ 推荐做法

```typescript
// 1. 使用 composables
const { hasPermission } = usePermission();

// 2. 模板中使用指令
<button v-permission="'article:create'">发布文章</button>

// 3. 批量检查权限
const canManage = hasPermission(['article:create', 'article:edit']);

// 4. 响应式使用
watch(() => userInfo.value, (newVal) => {
  console.log('用户信息变化:', newVal);
});
```

### ❌ 避免的做法

```typescript
// 1. 直接访问 localStorage
const permissions = JSON.parse(localStorage.getItem('user_info'));

// 2. 在循环中频繁调用 API
articles.forEach(async () => {
  await userApi.getPermissions(); // ❌ 应该提前加载
});

// 3. 忽略错误处理
try {
  await userApi.getInfo();
} catch (error) {
  console.error('加载失败:', error);
}
```

---

## 🔐 安全提醒

⚠️ **重要**: 前端权限控制仅为用户体验优化，不能替代后端验证！

- ✅ 所有敏感操作必须在后端验证权限
- ✅ Token 过期会自动跳转登录页
- ✅ 生产环境使用 HTTPS
- ⚠️ 注意 XSS 攻击风险

---

## 📚 更多资源

- [权限控制使用指南.md](./权限控制使用指南.md) - 详细文档
- [PROJECT_FIXES_REPORT.md](./PROJECT_FIXES_REPORT.md) - 修复报告
- [src/examples/api-examples.ts](./src/examples/api-examples.ts) - API 示例

---

**最后更新**: 2026-03-12  
**维护者**: RiverLi Team
