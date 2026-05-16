# River Blog Frontend

基于 Vue 3 和 TypeScript 的现代化博客前端系统

## 项目简介

River Blog Frontend 是一个基于 Vue 3、TypeScript 和 Element Plus 构建的现代化博客前端系统。该项目实现了完整的用户认证、权限管理和动态路由功能，提供了丰富的博客功能。

## 功能特性

- ✅ 响应式设计，支持多终端访问
- ✅ 用户注册/登录/注销功能
- ✅ 基于 JWT 的身份认证
- ✅ RBAC 权限管理系统
- ✅ 动态菜单和路由
- ✅ 权限指令（v-permission）
- ✅ 用户信息管理
- ✅ 博客文章管理
- ✅ 评论系统
- ✅ 仪表盘统计

## 技术栈

- **框架**: Vue 3 (Composition API)
- **语言**: TypeScript
- **状态管理**: Pinia
- **路由**: Vue Router 4
- **UI 库**: Element Plus
- **HTTP 客户端**: Axios
- **构建工具**: Vite
- **样式**: Sass

## 安装与运行

### 环境要求

- Node.js >= 18.0.0
- npm 或 yarn

### 安装步骤

1. 克隆项目
   ```bash
   git clone https://gitee.com/your-repo/river-blog-frontend.git
   cd river-blog-frontend
   ```

2. 安装依赖
   ```bash
   npm install
   ```

3. 配置环境变量
   ```bash
   # 修改 .env 文件中的 API 地址
   VITE_API_BASE_URL=http://localhost:5001/api
   ```

4. 启动开发服务器
   ```bash
   npm run dev
   ```

5. 构建生产版本
   ```bash
   npm run build
   ```

6. 预览生产构建
   ```bash
   npm run preview
   ```

## 项目结构

```
src/
├── assets/           # 静态资源
├── components/       # 通用组件
├── router/           # 路由配置
├── stores/           # Pinia 状态管理
├── types/            # TypeScript 类型定义
├── utils/            # 工具函数
├── views/            # 页面组件
└── main.ts          # 入口文件
```

## API 接口

本项目使用 RiverLi Blog Identity API，具体接口文档请参阅：
- `API 使用文档.md`
- `面向前端的 API 接口说明.md`

## 权限系统

项目实现了基于角色的权限控制系统（RBAC）：

- **权限指令**: 使用 `v-permission="'permission-code'"` 控制元素显示
- **路由守卫**: 自动检查路由访问权限
- **动态菜单**: 根据用户权限动态生成菜单

## 贡献

欢迎提交 Issue 和 Pull Request。

## 许可证

MIT
