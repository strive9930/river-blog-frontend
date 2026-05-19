<template>
  <div class="floating-actions" :class="{ open: expanded }">
    <!-- Child actions (visible when expanded) -->
    <transition name="float-item">
      <button
        v-if="expanded && showBackToTop"
        class="float-btn float-btn-child"
        @click="scrollToTop"
        aria-label="Back to top"
        title="Back to top"
      >
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path d="M9 15V3M9 3L4 8M9 3l5 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
    </transition>

    <transition name="float-item">
      <button
        v-if="expanded"
        class="float-btn float-btn-child"
        @click="toggleTheme"
        :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
        :title="isDark ? 'Light mode' : 'Dark mode'"
      >
        <!-- Sun icon (dark mode → switch to light) -->
        <svg v-if="isDark" width="18" height="18" viewBox="0 0 18 18" fill="none">
          <circle cx="9" cy="9" r="4" stroke="currentColor" stroke-width="1.5"/>
          <path d="M9 1v2M9 15v2M1 9h2M15 9h2M3.3 3.3l1.4 1.4M13.3 13.3l1.4 1.4M3.3 14.7l1.4-1.4M13.3 4.7l1.4-1.4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
        <!-- Moon icon (light mode → switch to dark) -->
        <svg v-else width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path d="M15.5 11.4A6.5 6.5 0 016.6 2.5 7 7 0 1015.5 11.4z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
        </svg>
      </button>
    </transition>

    <!-- Main toggle button -->
    <button
      class="float-btn float-btn-main"
      :class="{ active: expanded }"
      @click="expanded = !expanded"
      aria-label="Quick actions"
      title="Quick actions"
    >
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path v-if="!expanded" d="M10 3a1.5 1.5 0 110 3 1.5 1.5 0 010-3zM10 8.5a1.5 1.5 0 110 3 1.5 1.5 0 010-3zM10 14a1.5 1.5 0 110 3 1.5 1.5 0 010-3z" fill="currentColor"/>
        <path v-else d="M6 6l8 8M6 14l8-8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useAppStore } from '@/stores/app';
import { useScrollToTop } from '@/composables/useScrollToTop';

const appStore = useAppStore();
const { isVisible: showBackToTop, scrollToTop } = useScrollToTop();

const expanded = ref(false);

const isDark = computed(() => appStore.theme === 'dark');

const toggleTheme = () => {
  appStore.toggleTheme();
};
</script>

<style lang="scss" scoped>
.floating-actions {
  position: fixed;
  bottom: var(--space-xl);
  right: var(--space-xl);
  z-index: var(--z-sticky);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-sm);
}

.float-btn {
  width: 44px;
  height: 44px;
  border-radius: var(--radius-full);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all var(--transition-base);
}

.float-btn-child {
  background: var(--bg-card);
  color: var(--text-secondary);
  box-shadow: var(--shadow-md);
  border: 1px solid var(--border-color-light);

  &:hover {
    color: var(--color-primary);
    box-shadow: var(--shadow-lg);
    transform: translateY(-2px);
  }
}

.float-btn-main {
  background: var(--color-primary);
  color: var(--text-inverse);
  box-shadow: var(--shadow-lg);

  &:hover {
    background: var(--color-primary-hover);
    box-shadow: var(--shadow-xl);
    transform: scale(1.05);
  }

  &.active {
    background: var(--text-secondary);
    transform: rotate(90deg);
  }
}

// ---------- Child button transitions ----------
.float-item-enter-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.float-item-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}

.float-item-enter-from {
  opacity: 0;
  transform: translateY(8px) scale(0.8);
}

.float-item-leave-to {
  opacity: 0;
  transform: translateY(4px) scale(0.9);
}
</style>
