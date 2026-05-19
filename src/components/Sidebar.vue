<template>
  <aside class="sidebar">
    <!-- User Profile Card (when logged in) -->
    <div v-if="userStore.isLoggedIn && userStore.userInfo" class="sidebar-card profile-card">
      <img
        :src="userStore.userInfo.avatar || 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'"
        :alt="userStore.userInfo.nickName || 'User'"
        class="profile-avatar"
      />
      <h3 class="profile-name">{{ userStore.userInfo.nickName || userStore.userInfo.email }}</h3>
      <p v-if="userStore.userInfo.isAdmin" class="profile-badge">Admin</p>
      <div class="profile-stats">
        <div class="stat-item">
          <span class="stat-value">{{ dashboard.totalArticles.value }}</span>
          <span class="stat-label">Articles</span>
        </div>
        <div class="stat-item">
          <span class="stat-value">{{ dashboard.totalComments.value }}</span>
          <span class="stat-label">Comments</span>
        </div>
        <div class="stat-item">
          <span class="stat-value">{{ dashboard.totalViews.value }}</span>
          <span class="stat-label">Views</span>
        </div>
      </div>
    </div>

    <!-- Categories -->
    <div class="sidebar-card">
      <h4 class="sidebar-heading">Categories</h4>
      <ul class="category-list">
        <li v-for="cat in categories" :key="cat.name" class="category-item">
          <a href="#" class="category-link">
            <span class="category-name">{{ cat.name }}</span>
            <span class="category-count">{{ cat.count }}</span>
          </a>
        </li>
      </ul>
    </div>

    <!-- Tags Cloud -->
    <div class="sidebar-card">
      <h4 class="sidebar-heading">Tags</h4>
      <div class="tags-cloud">
        <a v-for="tag in tags" :key="tag.name" href="#" class="tag-cloud-item">{{ tag.name }}</a>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { useUserStore } from '@/stores/user';
import { useDashboard } from '@/composables/usePermission';

const userStore = useUserStore();
const dashboard = useDashboard();

const categories = [
  { name: 'Frontend', count: 12 },
  { name: 'Backend', count: 8 },
  { name: 'DevOps', count: 5 },
  { name: 'Architecture', count: 6 },
  { name: 'TypeScript', count: 9 },
  { name: 'Vue.js', count: 7 },
];

const tags = [
  { name: 'Vue' },
  { name: 'TypeScript' },
  { name: 'JavaScript' },
  { name: 'CSS' },
  { name: 'Node.js' },
  { name: 'Docker' },
  { name: 'Git' },
  { name: 'React' },
  { name: 'API' },
  { name: 'Testing' },
];
</script>

<style lang="scss" scoped>
.sidebar {
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
}

.sidebar-card {
  background: var(--bg-card);
  border-radius: var(--radius-xl);
  padding: var(--space-lg);
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--border-color-light);
}

.sidebar-heading {
  font-size: var(--font-size-base);
  font-weight: 600;
  margin-bottom: var(--space-md);
  padding-bottom: var(--space-sm);
  border-bottom: 2px solid var(--color-gray-100);
}

// ---------- Profile Card ----------
.profile-card {
  text-align: center;
}

.profile-avatar {
  width: 72px;
  height: 72px;
  border-radius: var(--radius-full);
  object-fit: cover;
  margin: 0 auto var(--space-sm);
  border: 3px solid var(--color-primary-100);
}

.profile-name {
  font-size: var(--font-size-base);
  font-weight: 600;
  margin-bottom: var(--space-xs);
}

.profile-badge {
  display: inline-block;
  padding: 2px 10px;
  background: var(--color-primary-50);
  color: var(--color-primary);
  font-size: var(--font-size-xs);
  font-weight: 600;
  border-radius: var(--radius-full);
  margin-bottom: var(--space-md);
}

.profile-stats {
  display: flex;
  justify-content: center;
  gap: var(--space-lg);
  padding-top: var(--space-md);
  border-top: 1px solid var(--border-color-light);
}

.stat-item {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: var(--font-size-lg);
  font-weight: 700;
  color: var(--text-primary);
}

.stat-label {
  font-size: var(--font-size-xs);
  color: var(--text-muted);
}

// ---------- Categories ----------
.category-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.category-item {
  margin-bottom: 2px;
}

.category-link {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-sm) var(--space-md);
  text-decoration: none;
  color: var(--text-secondary);
  font-size: var(--font-size-sm);
  border-radius: var(--radius-md);
  transition: all var(--transition-fast);

  &:hover {
    background: var(--color-primary-50);
    color: var(--color-primary);

    .category-count {
      background: var(--color-primary);
      color: var(--text-inverse);
    }
  }
}

.category-count {
  background: var(--color-gray-100);
  padding: 2px 8px;
  border-radius: var(--radius-full);
  font-size: var(--font-size-xs);
  min-width: 24px;
  text-align: center;
  transition: all var(--transition-fast);
}

// ---------- Tags Cloud ----------
.tags-cloud {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-sm);
}

.tag-cloud-item {
  padding: 4px 12px;
  background: var(--color-gray-50);
  color: var(--text-secondary);
  font-size: var(--font-size-xs);
  border-radius: var(--radius-full);
  text-decoration: none;
  transition: all var(--transition-fast);

  &:hover {
    background: var(--color-primary);
    color: var(--text-inverse);
  }
}
</style>
