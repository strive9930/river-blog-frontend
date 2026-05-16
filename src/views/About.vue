<template>
  <div class="about-container">
    <h1>关于我们</h1>
    <div class="about-content">
      <p>River Blog 是一个专注于技术分享的博客平台，致力于提供高质量的技术文章和实践经验。</p>
      
      <h2>项目特点</h2>
      <ul>
        <li>现代化技术栈：Vue 3 + TypeScript + Element Plus</li>
        <li>权限管理系统：基于角色的访问控制（RBAC）</li>
        <li>响应式设计：支持多种设备访问</li>
        <li>良好的用户体验：直观的界面和流畅的操作</li>
      </ul>
      
      <h2>联系方式</h2>
      <p>如果您有任何问题或建议，欢迎通过以下方式联系我们：</p>
      <ul>
        <li>邮箱：<a href="mailto:contact@riverblog.com">contact@riverblog.com</a></li>
        <li>GitHub：<a href="https://github.com/riverli/river-blog-frontend" target="_blank">River Blog Frontend</a></li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
// 关于页面组件
</script>

<style scoped>
.about-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.about-content {
  line-height: 1.8;
}

.about-content h2 {
  margin-top: 30px;
}

.about-content ul {
  padding-left: 20px;
}

.about-content li {
  margin-bottom: 10px;
}

.about-content a {
  color: #409eff;
  text-decoration: none;
}

.about-content a:hover {
  text-decoration: underline;
}
</style>