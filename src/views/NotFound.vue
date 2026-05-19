<template>
  <div class="not-found-page">
    <div class="not-found-content">
      <h1 class="not-found-code">404</h1>
      <h2 class="not-found-title">Page Not Found</h2>
      <p class="not-found-desc">The page you're looking for doesn't exist or has been moved.</p>
      <router-link to="/" class="not-found-btn">Back to Home</router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>

<style lang="scss" scoped>
.not-found-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  text-align: center;
}

.not-found-content {
  max-width: 440px;
  animation: slide-up 0.5s ease;
}

.not-found-code {
  font-size: 120px;
  font-weight: 800;
  line-height: 1;
  margin-bottom: var(--space-md);
  @include gradient-text(#3b82f6, #8b5cf6);
}

.not-found-title {
  font-size: var(--font-size-3xl);
  font-weight: 700;
  margin-bottom: var(--space-md);
}

.not-found-desc {
  font-size: var(--font-size-lg);
  color: var(--text-muted);
  margin: 0 0 var(--space-2xl);
  line-height: 1.6;
}

.not-found-btn {
  display: inline-block;
  padding: 12px 32px;
  background: var(--color-primary);
  color: var(--text-inverse);
  font-weight: 600;
  font-size: var(--font-size-base);
  border-radius: var(--radius-xl);
  text-decoration: none;
  transition: all var(--transition-base);

  &:hover {
    background: var(--color-primary-hover);
    transform: translateY(-2px);
    box-shadow: var(--shadow-lg);
    color: var(--text-inverse);
  }
}
</style>
