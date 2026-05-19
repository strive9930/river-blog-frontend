<template>
  <div class="article-page">
    <!-- Loading -->
    <div v-if="!article" class="article-loading">
      <div class="skeleton skeleton-title-lg"></div>
      <div class="skeleton skeleton-meta"></div>
      <div class="skeleton skeleton-image-lg"></div>
      <div class="skeleton skeleton-line"></div>
      <div class="skeleton skeleton-line"></div>
      <div class="skeleton skeleton-line short"></div>
    </div>

    <!-- Article Content -->
    <template v-else>
      <article class="article-content">
        <!-- Header -->
        <header class="article-header">
          <span v-if="article.category" class="article-category">{{ article.category }}</span>
          <h1 class="article-title">{{ article.title }}</h1>
          <div class="article-meta">
            <div class="meta-author">
              <img
                :src="`https://api.dicebear.com/7.x/initials/svg?seed=${article.author}`"
                :alt="article.author"
                class="meta-avatar"
              />
              <div>
                <span class="meta-name">{{ article.author }}</span>
                <div class="meta-info">
                  <span>{{ formatDate(article.date) }}</span>
                  <span class="meta-separator">·</span>
                  <span>{{ article.readTime || '8 min read' }}</span>
                </div>
              </div>
            </div>
            <div class="meta-stats">
              <span class="meta-views">{{ article.views || 0 }} views</span>
            </div>
          </div>
        </header>

        <!-- Cover Image -->
        <div v-if="article.coverImage" class="article-cover">
          <img :src="article.coverImage" :alt="article.title" />
        </div>

        <!-- Body -->
        <div class="article-body">
          <p>{{ article.content }}</p>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
          <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
          <h2>Key Takeaways</h2>
          <ul>
            <li>Understand the core concepts and how they fit together</li>
            <li>Learn best practices from real-world implementations</li>
            <li>Apply these patterns in your own projects immediately</li>
          </ul>
          <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.</p>
        </div>

        <!-- Tags -->
        <div v-if="article.tags?.length" class="article-tags">
          <span v-for="tag in article.tags" :key="tag" class="article-tag">{{ tag }}</span>
        </div>

        <!-- Actions -->
        <div class="article-actions">
          <el-button
            v-permission="'comment:create'"
            type="primary"
            @click="toggleCommentForm"
          >
            {{ showCommentForm ? 'Cancel' : 'Leave a Comment' }}
          </el-button>
          <el-button
            v-permission="'article:edit'"
            type="success"
            @click="editArticle"
          >
            Edit Article
          </el-button>
          <el-button
            v-permission="'article:delete'"
            type="danger"
            @click="deleteArticle"
          >
            Delete Article
          </el-button>
        </div>
      </article>

      <!-- Comment Form -->
      <div v-if="showCommentForm" class="comment-form-card">
        <h3 class="comment-form-title">Write a Comment</h3>
        <el-input
          v-model="newComment"
          type="textarea"
          :rows="4"
          placeholder="Share your thoughts..."
          maxlength="1000"
          show-word-limit
        />
        <div class="comment-form-actions">
          <el-button @click="showCommentForm = false">Cancel</el-button>
          <el-button
            type="primary"
            @click="submitComment"
            :disabled="!newComment.trim()"
          >
            Submit Comment
          </el-button>
        </div>
      </div>

      <!-- Comments List -->
      <div v-if="comments.length" class="comments-section">
        <h3 class="comments-heading">Comments ({{ comments.length }})</h3>
        <div
          v-for="comment in comments"
          :key="comment.id"
          class="comment-card"
        >
          <div class="comment-header">
            <div class="comment-author">
              <img
                :src="`https://api.dicebear.com/7.x/initials/svg?seed=${comment.author}`"
                :alt="comment.author"
                class="comment-avatar"
              />
              <div>
                <span class="comment-name">{{ comment.author }}</span>
                <span class="comment-date">{{ formatDate(comment.date) }}</span>
              </div>
            </div>
            <el-button
              v-permission="'comment:delete'"
              type="danger"
              size="small"
              text
              @click="deleteComment(comment.id)"
            >
              Delete
            </el-button>
          </div>
          <p class="comment-content">{{ comment.content }}</p>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ElMessage, ElMessageBox } from 'element-plus';
import { useUserStore } from '@/stores/user';
import { useArticleStore } from '@/stores/article';

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();
const articleStore = useArticleStore();

const article = ref<any>(null);
const showCommentForm = ref(false);
const newComment = ref('');

const comments = ref([
  { id: 1, author: 'Alice', content: 'Great article! Very well explained.', date: '2026-03-16' },
  { id: 2, author: 'Bob', content: 'This helped me understand the topic much better. Thanks for writing!', date: '2026-03-17' },
]);

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const loadArticle = async () => {
  const id = parseInt(route.params.id as string);
  // Use article store mock data
  await articleStore.fetchArticleById(id);
  article.value = articleStore.currentArticle;
  if (!article.value) {
    // Fallback to inline mock
    article.value = {
      id,
      title: 'Sample Article',
      author: 'River Li',
      date: '2026-03-10',
      content: 'This is the article content...',
      category: 'Frontend',
      tags: ['Vue', 'TypeScript'],
      readTime: '8 min read',
      views: 1250,
      coverImage: `https://picsum.photos/1200/600?random=${id}`,
    };
  }
};

const toggleCommentForm = () => {
  if (!userStore.hasPermission('comment:create')) {
    ElMessage.warning('You do not have permission to post comments');
    return;
  }
  showCommentForm.value = !showCommentForm.value;
};

const submitComment = () => {
  if (!newComment.value.trim()) {
    ElMessage.warning('Comment cannot be empty');
    return;
  }
  comments.value.unshift({
    id: Date.now(),
    author: userStore.userInfo?.nickName || 'Anonymous',
    content: newComment.value,
    date: new Date().toISOString().split('T')[0],
  });
  newComment.value = '';
  showCommentForm.value = false;
  ElMessage.success('Comment posted successfully');
};

const editArticle = () => {
  if (!userStore.hasPermission('article:edit')) {
    ElMessage.warning('You do not have permission to edit articles');
    return;
  }
  ElMessage.success('Navigating to article editor...');
};

const deleteArticle = async () => {
  if (!userStore.hasPermission('article:delete')) {
    ElMessage.warning('You do not have permission to delete articles');
    return;
  }
  try {
    await ElMessageBox.confirm('Are you sure you want to delete this article?', 'Confirm Delete', {
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel',
      type: 'warning',
    });
    ElMessage.success('Article deleted');
    router.push('/blog');
  } catch { /* cancelled */ }
};

const deleteComment = async (commentId: number) => {
  if (!userStore.hasPermission('comment:delete')) {
    ElMessage.warning('You do not have permission to delete comments');
    return;
  }
  try {
    await ElMessageBox.confirm('Delete this comment?', 'Confirm', {
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel',
      type: 'warning',
    });
    comments.value = comments.value.filter(c => c.id !== commentId);
    ElMessage.success('Comment deleted');
  } catch { /* cancelled */ }
};

onMounted(() => {
  loadArticle();
  if (userStore.isLoggedIn && !userStore.permissions.length) {
    userStore.loadUserInfo().catch(err => console.error('Failed to load user info:', err));
  }
});
</script>

<style lang="scss" scoped>
.article-page {
  max-width: 800px;
  margin: 0 auto;
  animation: fade-in 0.5s ease;
}

// ---------- Loading ----------
.article-loading {
  .skeleton {
    background: linear-gradient(90deg, var(--color-gray-100) 25%, var(--color-gray-50) 50%, var(--color-gray-100) 75%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
    border-radius: var(--radius-md);
    margin-bottom: var(--space-md);

    &-title-lg { height: 40px; width: 70%; }
    &-meta { height: 20px; width: 40%; }
    &-image-lg { height: 400px; width: 100%; border-radius: var(--radius-xl); }
    &-line { height: 16px; width: 100%; &.short { width: 60%; } }
  }
}

// ---------- Header ----------
.article-header {
  margin-bottom: var(--space-2xl);
}

.article-category {
  display: inline-block;
  padding: 4px 12px;
  background: var(--color-primary-50);
  color: var(--color-primary);
  font-size: var(--font-size-xs);
  font-weight: 600;
  border-radius: var(--radius-full);
  margin-bottom: var(--space-md);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.article-title {
  font-size: var(--font-size-5xl);
  font-weight: 800;
  line-height: 1.2;
  letter-spacing: -0.02em;
  margin-bottom: var(--space-lg);
}

.article-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.meta-author {
  display: flex;
  align-items: center;
  gap: var(--space-md);
}

.meta-avatar {
  width: 44px;
  height: 44px;
  border-radius: var(--radius-full);
  object-fit: cover;
  background: var(--color-gray-200);
}

.meta-name {
  display: block;
  font-weight: 600;
  color: var(--text-primary);
  font-size: var(--font-size-base);
}

.meta-info {
  font-size: var(--font-size-sm);
  color: var(--text-muted);
}

.meta-separator {
  margin: 0 var(--space-xs);
}

.meta-stats {
  font-size: var(--font-size-sm);
  color: var(--text-muted);
}

// ---------- Cover ----------
.article-cover {
  margin-bottom: var(--space-2xl);
  border-radius: var(--radius-xl);
  overflow: hidden;

  img {
    width: 100%;
    max-height: 500px;
    object-fit: cover;
  }
}

// ---------- Body ----------
.article-body {
  font-size: var(--font-size-lg);
  line-height: 1.85;
  color: var(--text-primary);
  margin-bottom: var(--space-2xl);

  p {
    margin: 0 0 var(--space-lg);
  }

  h2 {
    font-size: var(--font-size-2xl);
    margin: var(--space-2xl) 0 var(--space-md);
  }

  ul {
    margin: var(--space-md) 0;
    padding-left: var(--space-xl);

    li {
      margin-bottom: var(--space-sm);
    }
  }
}

// ---------- Tags ----------
.article-tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-sm);
  margin-bottom: var(--space-2xl);
  padding-bottom: var(--space-2xl);
  border-bottom: 1px solid var(--border-color);
}

.article-tag {
  padding: 6px 14px;
  background: var(--color-gray-100);
  color: var(--text-secondary);
  font-size: var(--font-size-sm);
  border-radius: var(--radius-full);
}

// ---------- Actions ----------
.article-actions {
  display: flex;
  gap: var(--space-md);
  margin-bottom: var(--space-2xl);
}

// ---------- Comment Form ----------
.comment-form-card {
  background: var(--bg-card);
  border-radius: var(--radius-xl);
  padding: var(--space-xl);
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--border-color-light);
  margin-bottom: var(--space-2xl);
}

.comment-form-title {
  font-size: var(--font-size-lg);
  font-weight: 600;
  margin-bottom: var(--space-md);
}

.comment-form-actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--space-sm);
  margin-top: var(--space-md);
}

// ---------- Comments ----------
.comments-section {
  margin-bottom: var(--space-3xl);
}

.comments-heading {
  font-size: var(--font-size-xl);
  font-weight: 600;
  margin-bottom: var(--space-lg);
}

.comment-card {
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  padding: var(--space-lg);
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--border-color-light);
  margin-bottom: var(--space-md);
}

.comment-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--space-sm);
}

.comment-author {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
}

.comment-avatar {
  width: 36px;
  height: 36px;
  border-radius: var(--radius-full);
  background: var(--color-gray-200);
}

.comment-name {
  display: block;
  font-weight: 600;
  font-size: var(--font-size-sm);
}

.comment-date {
  font-size: var(--font-size-xs);
  color: var(--text-muted);
}

.comment-content {
  margin: 0;
  font-size: var(--font-size-base);
  line-height: 1.6;
  color: var(--text-secondary);
}

@media (max-width: 767px) {
  .article-title {
    font-size: var(--font-size-3xl);
  }

  .article-actions {
    flex-wrap: wrap;
  }
}
</style>
