import { defineStore } from 'pinia';
import { ref } from 'vue';

export interface Article {
  id: number;
  title: string;
  excerpt: string;
  coverImage: string;
  date: string;
  tags: string[];
  author: string;
  readTime: string;
  category: string;
  content?: string;
  views?: number;
}

export const useArticleStore = defineStore('article', () => {
  const articles = ref<Article[]>([]);
  const featuredArticles = ref<Article[]>([]);
  const currentArticle = ref<Article | null>(null);
  const loading = ref(false);
  const total = ref(0);

  const mockArticles: Article[] = [
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
      content: 'Vue 3 introduces the Composition API, which provides a more flexible way to organize component logic. Combined with TypeScript, it offers excellent developer experience and type safety...',
      views: 1250,
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
      content: 'TypeScript generics are one of the most powerful features of the language. They allow you to write reusable, type-safe code that works with a variety of data types...',
      views: 980,
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
      content: 'Modern frontend architecture has evolved significantly. From component-based design to micro-frontends, there are many patterns to choose from...',
      views: 756,
    },
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
      views: 632,
    },
    {
      id: 5,
      title: 'State Management with Pinia in Vue 3',
      excerpt: 'A deep dive into Pinia, the official state management library for Vue 3, with practical examples and best practices.',
      coverImage: 'https://picsum.photos/800/420?random=5',
      date: '2026-02-20',
      tags: ['Vue', 'Pinia', 'State Management'],
      author: 'River Li',
      readTime: '9 min read',
      category: 'Frontend',
      views: 890,
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
      views: 1120,
    },
  ];

  const fetchArticles = async () => {
    loading.value = true;
    try {
      // TODO: Replace with real API call
      await new Promise(resolve => setTimeout(resolve, 300));
      articles.value = mockArticles;
      total.value = mockArticles.length;
    } finally {
      loading.value = false;
    }
  };

  const fetchArticleById = async (id: number) => {
    loading.value = true;
    try {
      // TODO: Replace with real API call
      await new Promise(resolve => setTimeout(resolve, 200));
      currentArticle.value = mockArticles.find(a => a.id === id) || null;
    } finally {
      loading.value = false;
    }
  };

  const fetchFeaturedArticles = async () => {
    try {
      // TODO: Replace with real API call
      await new Promise(resolve => setTimeout(resolve, 200));
      featuredArticles.value = mockArticles.slice(0, 3);
    } catch {
      featuredArticles.value = [];
    }
  };

  return {
    articles,
    featuredArticles,
    currentArticle,
    loading,
    total,
    fetchArticles,
    fetchArticleById,
    fetchFeaturedArticles,
  };
});
