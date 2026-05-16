<template>
  <div class="dynamic-view">
    <h1>{{ route.meta.title || '动态页面' }}</h1>
    <div class="content">
      <p>这是一个根据用户权限动态生成的页面</p>
      <p>当前路径: <code>{{ route.path }}</code></p>
      <p>页面名称: <code>{{ route.name }}</code></p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';

const route = useRoute();
</script>

<style scoped>
.dynamic-view {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.content {
  margin-top: 20px;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 4px;
}
</style>