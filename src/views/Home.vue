<template>
  <div class="home-page">
    <!-- Hero Section -->
    <HeroSection
      title="Welcome to River Blog"
      subtitle="A place to share knowledge, explore technology, and connect with fellow developers."
      :show-cta="true"
      cta-text="Start Reading"
      cta-link="/blog"
    />

    <!-- Stats Dashboard (Logged In) -->
    <section v-if="userStore.isLoggedIn" class="stats-section">
      <div class="stats-grid">
        <div class="stat-card stat-card-blue">
          <div class="stat-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
          </div>
          <div class="stat-info">
            <span class="stat-number">{{ dashboard.totalArticles.value }}</span>
            <span class="stat-label">Articles</span>
          </div>
        </div>
        <div class="stat-card stat-card-green">
          <div class="stat-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
          </div>
          <div class="stat-info">
            <span class="stat-number">{{ dashboard.totalComments.value }}</span>
            <span class="stat-label">Comments</span>
          </div>
        </div>
        <div class="stat-card stat-card-purple">
          <div class="stat-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
          </div>
          <div class="stat-info">
            <span class="stat-number">{{ dashboard.totalViews.value }}</span>
            <span class="stat-label">Views</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Featured Articles -->
    <section class="featured-section">
      <div class="section-header">
        <h2 class="section-title">Featured Articles</h2>
        <p class="section-subtitle">Hand-picked articles worth your time</p>
      </div>
      <div class="articles-grid">
        <ArticleCard
          v-for="post in featuredPosts"
          :key="post.id"
          :id="post.id"
          :title="post.title"
          :excerpt="post.excerpt"
          :cover-image="post.coverImage"
          :date="post.date"
          :tags="post.tags"
          :author="post.author"
          :read-time="post.readTime"
          :category="post.category"
        />
      </div>
    </section>

    <!-- Latest Articles -->
    <section class="latest-section">
      <div class="section-header">
        <h2 class="section-title">Latest Posts</h2>
        <p class="section-subtitle">Stay up to date with the newest content</p>
      </div>
      <div class="articles-grid">
        <ArticleCard
          v-for="post in latestPosts"
          :key="post.id"
          :id="post.id"
          :title="post.title"
          :excerpt="post.excerpt"
          :cover-image="post.coverImage"
          :date="post.date"
          :tags="post.tags"
          :author="post.author"
          :read-time="post.readTime"
          :category="post.category"
        />
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useUserStore } from '@/stores/user';
import { useDashboard } from '@/composables/usePermission';
import ArticleCard from '@/components/ArticleCard.vue';
import HeroSection from '@/components/HeroSection.vue';

const userStore = useUserStore();
const dashboard = useDashboard();

interface Post {
  id: number;
  title: string;
  excerpt: string;
  coverImage: string;
  date: string;
  tags: string[];
  author: string;
  readTime: string;
  category: string;
}

const featuredPosts = ref<Post[]>([
  {
    id: 1,
    title: 'Building Modern Web Apps with Vue 3 and TypeScript',
    excerpt: 'A comprehensive guide to building scalable web applications using Vue 3 Composition API, TypeScript, and modern tooling.',
    coverImage: 'https://picsum.photos/800/420?random=1',
    date: '2026-03-15',
    tags: ['Vue', 'TypeScript'],
    author: 'River Li',
    readTime: '8 min read',
    category: 'Frontend',
  },
  {
    id: 2,
    title: 'The Complete Guide to TypeScript Generics',
    excerpt: 'Master TypeScript generics with practical examples and real-world patterns used in large-scale applications.',
    coverImage: 'https://picsum.photos/800/420?random=2',
    date: '2026-03-10',
    tags: ['TypeScript', 'Programming'],
    author: 'River Li',
    readTime: '12 min read',
    category: 'Frontend',
  },
  {
    id: 3,
    title: 'Modern Frontend Architecture Patterns',
    excerpt: 'Explore the latest architectural patterns for building maintainable and performant frontend applications at scale.',
    coverImage: 'https://picsum.photos/800/420?random=3',
    date: '2026-03-05',
    tags: ['Architecture', 'Engineering'],
    author: 'River Li',
    readTime: '10 min read',
    category: 'Architecture',
  },
]);

const latestPosts = ref<Post[]>([
  {
    id: 4,
    title: 'Getting Started with Docker for Frontend Developers',
    excerpt: 'Learn how to containerize your frontend applications and streamline your development workflow with Docker.',
    coverImage: 'https://picsum.photos/800/420?random=4',
    date: '2026-02-28',
    tags: ['Docker', 'DevOps'],
    author: 'River Li',
    readTime: '6 min read',
    category: 'DevOps',
  },
  {
    id: 5,
    title: 'State Management with Pinia in Vue 3',
    excerpt: 'A deep dive into Pinia, the official state management library for Vue 3, with practical examples and best practices.',
    coverImage: 'https://picsum.photos/800/420?random=5',
    date: '2026-02-20',
    tags: ['Vue', 'Pinia'],
    author: 'River Li',
    readTime: '9 min read',
    category: 'Frontend',
  },
  {
    id: 6,
    title: 'CSS Grid and Flexbox: When to Use Which',
    excerpt: 'Understanding the differences between CSS Grid and Flexbox, and knowing which layout tool to use for different scenarios.',
    coverImage: 'https://picsum.photos/800/420?random=6',
    date: '2026-02-15',
    tags: ['CSS', 'Layout'],
    author: 'River Li',
    readTime: '7 min read',
    category: 'Frontend',
  },
]);

onMounted(async () => {
  if (userStore.isLoggedIn) {
    try {
      await userStore.loadDashboardStats();
    } catch (error: any) {
      if (error.response?.status !== 401) {
        console.error('Failed to load dashboard stats:', error);
      }
    }
  }
});
</script>

<style lang="scss" scoped>
.home-page {
  animation: fade-in 0.5s ease;
}

// ---------- Stats Section ----------
.stats-section {
  @include section;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-lg);
}

.stat-card {
  display: flex;
  align-items: center;
  gap: var(--space-lg);
  padding: var(--space-xl);
  border-radius: var(--radius-xl);
  color: var(--text-inverse);

  &-blue { background: linear-gradient(135deg, #3b82f6, #2563eb); }
  &-green { background: linear-gradient(135deg, #10b981, #059669); }
  &-purple { background: linear-gradient(135deg, #8b5cf6, #7c3aed); }
}

.stat-icon {
  opacity: 0.8;
  flex-shrink: 0;
}

.stat-number {
  display: block;
  font-size: var(--font-size-3xl);
  font-weight: 700;
  line-height: 1.2;
}

.stat-label {
  font-size: var(--font-size-sm);
  opacity: 0.85;
}

// ---------- Sections ----------
.featured-section,
.latest-section {
  @include section;
}

.section-header {
  text-align: center;
  margin-bottom: var(--space-2xl);
}

.section-title {
  font-size: var(--font-size-3xl);
  font-weight: 700;
  margin-bottom: var(--space-sm);
}

.section-subtitle {
  color: var(--text-muted);
  font-size: var(--font-size-lg);
  margin: 0;
}

// ---------- Articles Grid ----------
.articles-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-xl);
}

@media (max-width: 1023px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }

  .articles-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 767px) {
  .articles-grid {
    grid-template-columns: 1fr;
  }
}
</style>
