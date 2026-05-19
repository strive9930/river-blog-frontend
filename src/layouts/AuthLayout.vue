<template>
  <div class="auth-layout">
    <div class="auth-background">
      <div class="bg-shape bg-shape-1"></div>
      <div class="bg-shape bg-shape-2"></div>
      <div class="bg-shape bg-shape-3"></div>
    </div>
    <div class="auth-card-wrapper">
      <router-view />
    </div>
  </div>
</template>

<script setup lang="ts">
</script>

<style lang="scss" scoped>
.auth-layout {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.auth-background {
  position: fixed;
  inset: 0;
  z-index: -1;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.bg-shape {
  position: absolute;
  border-radius: 50%;
  opacity: 0.1;
  background: var(--color-white);
  animation: float 20s infinite ease-in-out;

  &-1 {
    width: 600px;
    height: 600px;
    top: -200px;
    right: -100px;
    animation-delay: 0s;
  }

  &-2 {
    width: 400px;
    height: 400px;
    bottom: -100px;
    left: -50px;
    animation-delay: -7s;
    animation-duration: 25s;
  }

  &-3 {
    width: 300px;
    height: 300px;
    top: 50%;
    left: 50%;
    animation-delay: -14s;
    animation-duration: 18s;
  }
}

.auth-card-wrapper {
  width: 100%;
  max-width: 440px;
  padding: var(--space-lg);
  z-index: 1;
}
</style>
