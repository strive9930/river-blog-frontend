<template>
  <div class="dynamic-page">
    <div class="page-header">
      <nav class="breadcrumb">
        <router-link to="/">Home</router-link>
        <span class="breadcrumb-sep">/</span>
        <span class="breadcrumb-current">{{ route.meta.title || route.name }}</span>
      </nav>
      <h1 class="page-title">{{ route.meta.title || route.name }}</h1>
    </div>
    <div class="dynamic-content">
      <el-card>
        <p>This page is dynamically loaded based on your user permissions.</p>
        <p class="dynamic-meta">
          <strong>Route Path:</strong> {{ route.path }}<br />
          <strong>Route Name:</strong> {{ route.name }}
        </p>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';

const route = useRoute();
</script>

<style lang="scss" scoped>
.dynamic-page {
  animation: fade-in 0.5s ease;
}

.page-header {
  margin-bottom: var(--space-2xl);
}

.breadcrumb {
  font-size: var(--font-size-sm);
  color: var(--text-muted);
  margin-bottom: var(--space-sm);

  a {
    color: var(--text-muted);
    text-decoration: none;

    &:hover {
      color: var(--color-primary);
    }
  }
}

.breadcrumb-sep {
  margin: 0 var(--space-sm);
}

.page-title {
  font-size: var(--font-size-3xl);
  font-weight: 700;
}

.dynamic-meta {
  margin-top: var(--space-lg);
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  line-height: 1.8;
}
</style>
