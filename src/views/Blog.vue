<template>
  <div class="blog-page">
    <div class="page-header">
      <div>
        <h1 class="page-title">Blog</h1>
        <p class="page-desc">Explore articles about frontend, backend, and software engineering.</p>
      </div>
      <el-button
        v-permission="'article:create'"
        type="primary"
        size="large"
        @click="createArticle"
        class="write-btn"
      >
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" style="margin-right: 6px;">
          <path d="M9 3v12M3 9h12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
        Write Article
      </el-button>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="articles-grid">
      <div v-for="n in 6" :key="n" class="skeleton-card">
        <div class="skeleton skeleton-image"></div>
        <div class="skeleton-body">
          <div class="skeleton skeleton-title"></div>
          <div class="skeleton skeleton-text"></div>
          <div class="skeleton skeleton-text short"></div>
        </div>
      </div>
    </div>

    <!-- Articles Grid -->
    <div v-else-if="articles.length" class="articles-grid">
      <ArticleCard
        v-for="article in articles"
        :key="article.id"
        :id="article.id"
        :title="article.title"
        :excerpt="article.excerpt"
        :cover-image="article.coverImage"
        :date="article.date"
        :tags="article.tags"
        :author="article.author"
        :read-time="article.readTime"
        :category="article.category"
      />
    </div>

    <!-- Empty State -->
    <el-empty v-else description="No articles yet. Check back soon!" />

    <!-- Pagination -->
    <div v-if="total > 6" class="pagination-wrapper">
      <el-pagination
        background
        layout="prev, pager, next"
        :total="total"
        :page-size="6"
        :current-page="currentPage"
        @current-change="handlePageChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import { useUserStore } from '@/stores/user';
import { usePermission } from '@/composables/usePermission';
import { useArticleStore } from '@/stores/article';
import ArticleCard from '@/components/ArticleCard.vue';

const userStore = useUserStore();
const { hasPermission } = usePermission();
const articleStore = useArticleStore();

const articles = ref(articleStore.articles);
const loading = ref(false);
const total = ref(0);
const currentPage = ref(1);

const loadArticles = async () => {
  loading.value = true;
  try {
    await articleStore.fetchArticles();
    articles.value = articleStore.articles;
    total.value = articleStore.total;
  } finally {
    loading.value = false;
  }
};

const createArticle = () => {
  if (!hasPermission('article:create')) {
    ElMessage.warning('You do not have permission to create articles');
    return;
  }
  ElMessage.success('Navigate to article editor');
};

const handlePageChange = (page: number) => {
  currentPage.value = page;
  loadArticles();
};

onMounted(() => {
  loadArticles();
  if (userStore.isLoggedIn && !userStore.permissions.length) {
    userStore.loadUserInfo().catch(err => {
      console.error('Failed to load user info:', err);
    });
  }
});
</script>

<style lang="scss" scoped>
.blog-page {
  animation: fade-in 0.5s ease;
}

// ---------- Page Header ----------
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--space-2xl);
}

.page-title {
  font-size: var(--font-size-4xl);
  font-weight: 700;
  margin-bottom: var(--space-sm);
}

.page-desc {
  color: var(--text-muted);
  font-size: var(--font-size-lg);
  margin: 0;
}

.write-btn {
  flex-shrink: 0;
}

// ---------- Articles Grid ----------
.articles-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-xl);
}

// ---------- Skeleton ----------
.skeleton-card {
  @include card-base;
  overflow: hidden;
}

.skeleton-image {
  aspect-ratio: 16 / 9;
  width: 100%;
}

.skeleton-body {
  padding: var(--space-lg);
}

.skeleton-title {
  height: 24px;
  width: 80%;
  margin-bottom: var(--space-sm);
}

.skeleton-text {
  height: 14px;
  width: 100%;
  margin-bottom: var(--space-sm);

  &.short {
    width: 60%;
  }
}

// ---------- Pagination ----------
.pagination-wrapper {
  display: flex;
  justify-content: center;
  margin-top: var(--space-2xl);
}

@media (max-width: 767px) {
  .page-header {
    flex-direction: column;
    gap: var(--space-md);
  }

  .articles-grid {
    grid-template-columns: 1fr;
  }
}
</style>
