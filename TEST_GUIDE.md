# 🧪 登录测试指南

## 📋 测试账号信息

**后端已启动测试账号：**
- 📧 邮箱：`admin@example.com`
- 🔑 密码：`Admin123!`

---

## 🚀 快速开始

### 方式一：使用登录页面测试（推荐）

1. **打开浏览器访问**: http://localhost:3001/login
2. **输入测试账号**:
   - 邮箱：`admin@example.com`
   - 密码：`Admin123!`
3. **点击"登录"按钮**
4. **观察结果**:
   - ✅ 登录成功后会跳转到首页
   - ✅ 首页会显示用户信息和仪表盘数据
   - ✅ 侧边栏会显示动态菜单

### 方式二：使用专用测试页面

1. **访问测试页面**: http://localhost:3001/test
2. **点击"🚀 运行完整登录测试"按钮**
3. **查看测试结果**:
   - 登录响应
   - 用户详细信息
   - 权限码列表
   - 菜单树结构
   - 角色列表
   - 仪表盘统计

### 方式三：使用浏览器控制台

1. **打开任意页面**: http://localhost:3001/
2. **按 F12 打开浏览器控制台**
3. **在控制台输入**:
   ```javascript
   await testLogin()
   ```
4. **查看详细日志输出**

---

## 📊 预期结果

### 1. 登录接口响应

```json
{
  "success": true,
  "message": "登录成功",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 3600,
    "tokenType": "Bearer",
    "user": {
      "id": "xxx",
      "email": "admin@example.com",
      "nickName": "管理员"
    }
  }
}
```

### 2. 用户信息

```json
{
  "success": true,
  "data": {
    "id": "xxx",
    "email": "admin@example.com",
    "nickName": "管理员",
    "isEnabled": true,
    "roles": ["Admin"],
    "permissions": ["article:*", "user:*", ...]
  }
}
```

### 3. 权限码列表

管理员账号应该包含以下权限：
- ✅ `article:view` - 查看文章
- ✅ `article:create` - 创建文章
- ✅ `article:edit` - 编辑文章
- ✅ `article:delete` - 删除文章
- ✅ `user:manage` - 用户管理
- ✅ 其他管理权限...

### 4. 菜单树

应该返回完整的后台管理菜单结构

### 5. 角色列表

```json
[
  {
    "id": "xxx",
    "name": "管理员",
    "code": "Admin",
    "description": "系统管理员",
    "isEnabled": true
  }
]
```

### 6. 仪表盘统计

```json
{
  "totalArticles": 0,
  "totalComments": 0,
  "totalViews": 0,
  "recentVisits": []
}
```

---

## 🔍 测试检查清单

### 基础功能测试
- [ ] 能够成功登录
- [ ] 登录后 Token 正确保存到 localStorage
- [ ] 用户信息正确保存
- [ ] 能够获取到用户详细信息
- [ ] 能够获取到权限码列表
- [ ] 能够获取到菜单树
- [ ] 能够获取到角色列表
- [ ] 能够获取到仪表盘数据

### 权限控制测试
- [ ] v-permission 指令正常工作
- [ ] v-role 指令正常工作
- [ ] 有权限的按钮正常显示
- [ ] 无权限的按钮被隐藏
- [ ] usePermission 组合式函数正常

### 路由测试
- [ ] 登录后可以访问需要认证的页面
- [ ] 未登录时访问需要认证的页面会跳转到登录页
- [ ] 动态路由正确添加
- [ ] 菜单导航正常工作

### UI/UX 测试
- [ ] 登录表单验证正常
- [ ] 错误提示友好
- [ ] 加载状态显示正确
- [ ] 成功消息提示正常

---

## ⚠️ 常见问题排查

### 问题 1: 登录失败，提示网络错误

**原因**: 后端 API 未启动或地址不正确

**解决方案**:
1. 确认后端服务已启动在 `http://localhost:5001`
2. 检查 `.env` 文件中的 `VITE_API_BASE_URL` 配置
3. 检查浏览器控制台是否有 CORS 错误

### 问题 2: 收到 401 错误

**原因**: Token 无效或过期

**解决方案**:
1. 清除 localStorage 中的数据
2. 重新登录
3. 检查后端 JWT 配置

### 问题 3: 收到 403 错误

**原因**: 用户没有权限访问该资源

**解决方案**:
1. 检查用户的权限码列表
2. 确认后端是否正确配置了权限
3. 使用管理员账号测试

### 问题 4: 登录后看不到菜单

**原因**: 菜单接口返回空数组

**解决方案**:
1. 检查后端是否正确配置了菜单
2. 查看浏览器控制台的网络请求
3. 确认用户是否具有任何菜单权限

### 问题 5: 权限控制不生效

**原因**: 权限指令或组合式函数使用错误

**解决方案**:
1. 检查是否正确导入和使用指令
2. 确认权限码拼写正确
3. 查看浏览器控制台是否有错误

---

## 🔧 调试技巧

### 1. 查看 localStorage

打开浏览器控制台，输入：
```javascript
// 查看 Token
localStorage.getItem('auth_token')

// 查看用户信息
JSON.parse(localStorage.getItem('user_info'))
```

### 2. 查看网络请求

1. 打开浏览器的 Network (网络) 面板
2. 执行登录操作
3. 查看 `/api/auth/login` 请求
4. 检查请求头和响应数据

### 3. 查看 Vuex/Pinia 状态

打开浏览器控制台，输入：
```javascript
// 如果使用了 Pinia DevTools
// 可以在浏览器开发者工具中查看 Pinia 状态
```

### 4. 手动测试 API

在浏览器控制台中：
```javascript
import { authApi, userApi } from '@/utils/api';

// 测试登录
const result = await authApi.login({
  email: 'admin@example.com',
  password: 'Admin123!'
});
console.log(result);

// 测试获取用户信息
const userInfo = await userApi.getInfo();
console.log(userInfo);
```

---

## 📝 测试报告模板

完成测试后，可以填写以下报告：

```
测试时间：__________
测试人员：__________

✅ 通过的测试项：
1. ________________
2. ________________
3. ________________

❌ 失败的测试项：
1. ________________
2. ________________

⚠️ 发现的问题：
1. ________________
2. ________________

💡 改进建议：
1. ________________
2. ________________
```

---

## 🎯 下一步

测试通过后，可以：

1. ✅ 使用真实业务场景测试权限控制
2. ✅ 测试不同角色的权限差异
3. ✅ 测试 Token 刷新机制
4. ✅ 进行性能测试
5. ✅ 编写自动化测试用例

---

**测试页面**: http://localhost:3001/test  
**登录页面**: http://localhost:3001/login  
**首页**: http://localhost:3001/

如有问题，请查看浏览器控制台日志或联系开发团队。
