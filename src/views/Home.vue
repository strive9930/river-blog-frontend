<template>
  <div class="home-page">
    <main class="main-content-home">
      <div class="hero-section">
        <div class="container">
          <h2>欢迎来到 River Blog</h2>
          <p>这里是一个分享知识和技术的平台。</p>
          <el-button type="primary" @click="$router.push('/blog')">开始阅读</el-button>
        </div>
      </div>

      <section v-if="userStore.isLoggedIn" class="dashboard-stats">
        <div class="container">
          <h3>仪表盘统计</h3>
          <div class="stats-grid">
            <div class="stat-card">
              <h4>文章总数</h4>
              <p>{{ dashboard.totalArticles.value }}</p>
            </div>
            <div class="stat-card">
              <h4>评论总数</h4>
              <p>{{ dashboard.totalComments.value }}</p>
            </div>
            <div class="stat-card">
              <h4>访问量</h4>
              <p>{{ dashboard.totalViews.value }}</p>
            </div>
          </div>
        </div>
      </section>
      
      <div v-else class="featured-posts container">
        <h3>精选文章</h3>
        <div class="posts-grid">
          <div class="post-card" v-for="post in featuredPosts" :key="post.id">
            <img :src="post.cover" :alt="post.title" class="post-cover">
            <div class="post-content">
              <h4>{{ post.title }}</h4>
              <p class="post-excerpt">{{ post.excerpt }}</p>
              <div class="post-meta">
                <span class="date">{{ formatDate(post.date) }}</span>
                <span class="tags">{{ post.tags.join(', ') }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
    
    <footer class="footer">
      <div class="container">
        <p>&copy; 2024 River Blog. All rights reserved.</p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useDashboard } from '@/composables/usePermission'

// 使用用户状态管理
const userStore = useUserStore()
const router = useRouter()

// 使用组合式函数
const dashboard = useDashboard()

interface Post {
  id: number
  title: string
  excerpt: string
  cover: string
  date: string
  tags: string[]
}

const featuredPosts = ref<Post[]>([
  {
    id: 1,
    title: 'Vue 3 实战指南',
    excerpt: '深入学习 Vue 3 的核心概念和最佳实践...',
    cover: 'https://picsum.photos/400/200?random=1',
    date: '2024-01-15',
    tags: ['Vue', '前端']
  },
  {
    id: 2,
    title: 'TypeScript 进阶技巧',
    excerpt: '掌握 TypeScript 的高级特性和应用场景...',
    cover: 'https://picsum.photos/400/200?random=2',
    date: '2024-01-10',
    tags: ['TypeScript', '编程']
  },
  {
    id: 3,
    title: '现代化前端架构',
    excerpt: '探讨现代前端项目的架构设计和工程化实践...',
    cover: 'https://picsum.photos/400/200?random=3',
    date: '2024-01-05',
    tags: ['架构', '工程化']
  }
])

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('zh-CN')
}

onMounted(async () => {
  // 如果用户已登录，尝试加载仪表盘数据
  if (userStore.isLoggedIn) {
    try {
      await userStore.loadDashboardStats()
    } catch (error) {
      console.error('加载仪表盘数据失败:', error)
    }
  }
  
  // 显示当前登录状态（用于调试）
  console.log('=== 首页加载完成 ===');
  console.log('Token:', localStorage.getItem('auth_token') ? '✅ 存在' : '❌ 不存在');
  console.log('用户信息:', userStore.userInfo);
  console.log('====================');
  
  console.log('博客首页已加载')
})
</script>

<style scoped>
.home-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content-home {
  flex: 1;
  margin-top: 60px; /* 为固定定位的导航栏留出空间 */
}

.hero-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  text-align: center;
  padding: 4rem 0;
}

.hero-section h2 {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.hero-section p {
  font-size: 1.2rem;
  margin-bottom: 2rem;
}

.featured-posts {
  padding: 4rem 0;
}

.featured-posts h3 {
  text-align: center;
  margin-bottom: 2rem;
  font-size: 2rem;
}

.posts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
}

.post-card {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  transition: transform 0.3s ease;
}

.post-card:hover {
  transform: translateY(-5px);
}

.post-cover {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.post-content {
  padding: 1.5rem;
}

.post-content h4 {
  margin: 0 0 1rem 0;
  font-size: 1.3rem;
}

.post-excerpt {
  color: #666;
  margin-bottom: 1rem;
  line-height: 1.6;
}

.post-meta {
  display: flex;
  justify-content: space-between;
  color: #999;
  font-size: 0.9rem;
}

.dashboard-stats {
  padding: 4rem 0;
}

.dashboard-stats h3 {
  text-align: center;
  margin-bottom: 2rem;
  font-size: 2rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}

.stat-card {
  background: white;
  border-radius: 4px;
  padding: 1rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  text-align: center;
}

.stat-card h4 {
  margin: 0 0 0.5rem 0;
  color: #606266;
}

.stat-card p {
  font-size: 1.5rem;
  margin: 0;
  color: #303133;
}

.footer {
  background: #333;
  color: white;
  text-align: center;
  padding: 2rem 0;
  margin-top: auto;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
}
</style>