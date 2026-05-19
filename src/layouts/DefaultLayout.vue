<template>
  <div class="default-layout">
    <NavBar />
    <div class="content-wrapper">
      <main class="main-area">
        <router-view v-slot="{ Component, route }">
          <transition name="page-fade" mode="out-in">
            <component :is="Component" :key="route.path" />
          </transition>
        </router-view>
      </main>
      <aside v-if="showSidebar" class="sidebar-area">
        <Sidebar />
      </aside>
    </div>
    <Footer />
    <FloatingActions />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import Footer from '@/components/Footer.vue';
import FloatingActions from '@/components/FloatingActions.vue';
import Sidebar from '@/components/Sidebar.vue';

const route = useRoute();

const showSidebar = computed(() => route.meta.showSidebar === true);
</script>

<style lang="scss" scoped>
.default-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.content-wrapper {
  @include container;
  display: flex;
  gap: var(--space-xl);
  flex: 1;
  margin-top: var(--navbar-height);
  padding-top: var(--space-xl);
  padding-bottom: var(--space-3xl);
}

.main-area {
  flex: 1;
  min-width: 0;
}

.sidebar-area {
  width: var(--sidebar-width);
  flex-shrink: 0;
  position: sticky;
  top: calc(var(--navbar-height) + var(--space-xl));
  align-self: flex-start;
  max-height: calc(100vh - var(--navbar-height) - var(--space-xl));
  overflow-y: auto;
}

@include responsive(lg) {
  .content-wrapper {
    padding-top: var(--space-2xl);
  }
}

@media (max-width: 1023px) {
  .content-wrapper {
    flex-direction: column;
  }

  .sidebar-area {
    width: 100%;
    position: static;
    max-height: none;
  }
}
</style>
