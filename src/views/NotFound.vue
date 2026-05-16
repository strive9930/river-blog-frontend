<template>
  <div class="not-found-container">
    <div class="not-found-content">
      <h1>404 - 页面未找到</h1>
      <p>抱歉，您访问的页面不存在。</p>
      <el-button type="primary" @click="goHome">返回首页</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { ElButton } from 'element-plus';

const router = useRouter();

const goHome = () => {
  router.push('/');
};
</script>

<style scoped>
.not-found-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100%;
}

.not-found-content {
  text-align: center;
  padding: 2rem;
  border-radius: 8px;
  background-color: #f8f9fa;
}

.not-found-content h1 {
  color: #dc3545;
  margin-bottom: 1rem;
}

.not-found-content p {
  margin-bottom: 1.5rem;
}
</style>