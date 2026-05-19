<template>
  <article class="article-card" @click="$router.push(`/article/${id}`)">
    <div class="card-image-wrapper">
      <img
        :src="coverImage"
        :alt="title"
        class="card-image"
        loading="lazy"
        @error="handleImageError"
      />
      <span v-if="category" class="card-category">{{ category }}</span>
    </div>
    <div class="card-body">
      <h3 class="card-title">{{ title }}</h3>
      <p v-if="excerpt" class="card-excerpt">{{ excerpt }}</p>
      <div class="card-meta">
        <div class="card-meta-left">
          <span v-if="author" class="meta-author">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="5" r="2.5" stroke="currentColor" stroke-width="1.2"/><path d="M2 12c0-2.5 2-4.5 5-4.5s5 2 5 4.5" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg>
            {{ author }}
          </span>
          <span class="meta-date">{{ formattedDate }}</span>
          <span v-if="readTime" class="meta-read">{{ readTime }}</span>
        </div>
        <div v-if="tags?.length" class="card-meta-right">
          <span v-for="tag in tags.slice(0, 2)" :key="tag" class="tag-chip">{{ tag }}</span>
        </div>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  id: number | string;
  title: string;
  excerpt?: string;
  coverImage?: string;
  date?: string;
  tags?: string[];
  author?: string;
  readTime?: string;
  category?: string;
}

const props = withDefaults(defineProps<Props>(), {
  coverImage: '',
  excerpt: '',
  date: '',
  tags: () => [],
  author: '',
  readTime: '',
  category: '',
});

const formattedDate = computed(() => {
  if (!props.date) return '';
  return new Date(props.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
});

const handleImageError = (e: Event) => {
  const img = e.target as HTMLImageElement;
  img.src = `https://picsum.photos/800/420?random=${props.id}`;
};
</script>

<style lang="scss" scoped>
.article-card {
  @include card;
  overflow: hidden;
  cursor: pointer;
}

.card-image-wrapper {
  position: relative;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  background: var(--color-gray-100);
}

.card-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;

  .article-card:hover & {
    transform: scale(1.05);
  }
}

.card-category {
  position: absolute;
  top: var(--space-md);
  left: var(--space-md);
  padding: 4px 12px;
  background: var(--color-primary);
  color: var(--text-inverse);
  font-size: var(--font-size-xs);
  font-weight: 600;
  border-radius: var(--radius-full);
  letter-spacing: 0.03em;
}

.card-body {
  padding: var(--space-lg);
}

.card-title {
  font-size: var(--font-size-lg);
  font-weight: 600;
  margin-bottom: var(--space-sm);
  @include line-clamp(2);
  transition: color var(--transition-fast);

  .article-card:hover & {
    color: var(--color-primary);
  }
}

.card-excerpt {
  color: var(--text-secondary);
  font-size: var(--font-size-sm);
  line-height: 1.6;
  margin: 0 0 var(--space-md);
  @include line-clamp(3);
}

.card-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-sm);
  padding-top: var(--space-sm);
  border-top: 1px solid var(--border-color-light);
  font-size: var(--font-size-xs);
  color: var(--text-muted);
}

.card-meta-left {
  display: flex;
  align-items: center;
  gap: var(--space-md);
}

.meta-author {
  display: flex;
  align-items: center;
  gap: 4px;
  color: var(--text-secondary);
}

.meta-date {
  white-space: nowrap;
}

.meta-read {
  white-space: nowrap;

  &::before {
    content: '·';
    margin-right: var(--space-sm);
  }
}

.card-meta-right {
  display: flex;
  gap: var(--space-xs);
}

.tag-chip {
  padding: 2px 8px;
  background: var(--color-gray-100);
  border-radius: var(--radius-full);
  font-size: 11px;
  color: var(--text-secondary);
  white-space: nowrap;
}
</style>
