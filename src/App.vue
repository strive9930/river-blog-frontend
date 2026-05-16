<template>
  <div id="app" :class="{ 'no-navbar': hideNavBar }">
    <NavBar v-if="!hideNavBar" />
    <router-view class="main-content" />
  </div>
</template>

<script setup lang="ts">
// 博客前端根组件
// NavBar组件通过自动导入插件自动注册，无需手动导入
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

// 计算属性：判断当前路由是否需要隐藏导航栏
const hideNavBar = computed(() => {
  return ['/login', '/register'].includes(route.path);
});
</script>

<style>
#app {
  height: 100vh;
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', '微软雅黑', Arial, sans-serif;
}

.main-content {
  margin-top: 60px; /* 为固定定位的导航栏留出空间 */
  min-height: calc(100vh - 60px);
}

/* 当不显示导航栏时，主内容不需要顶部边距 */
.no-navbar .main-content {
  margin-top: 0;
  min-height: 100vh;
}
</style>