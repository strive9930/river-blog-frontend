<template>
  <transition name="back-to-top-fade">
    <button
      v-show="isVisible"
      class="back-to-top-btn"
      @click="scrollToTop"
      aria-label="Back to top"
    >
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M10 16V4M10 4L4 10M10 4L16 10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </button>
  </transition>
</template>

<script setup lang="ts">
import { useScrollToTop } from '@/composables/useScrollToTop';

const { isVisible, scrollToTop } = useScrollToTop();
</script>

<style lang="scss" scoped>
.back-to-top-btn {
  position: fixed;
  bottom: var(--space-xl);
  right: var(--space-xl);
  z-index: var(--z-sticky);
  width: 44px;
  height: 44px;
  border-radius: var(--radius-full);
  border: none;
  background: var(--color-primary);
  color: var(--text-inverse);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--shadow-lg);
  transition: all var(--transition-base);

  &:hover {
    background: var(--color-primary-hover);
    transform: translateY(-2px);
    box-shadow: var(--shadow-xl);
  }

  &:active {
    transform: translateY(0);
  }
}

.back-to-top-fade-enter-active,
.back-to-top-fade-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}

.back-to-top-fade-enter-from,
.back-to-top-fade-leave-to {
  opacity: 0;
  transform: translateY(12px);
}
</style>
