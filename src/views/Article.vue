<template>
  <div class="article-container">
    <div v-if="article" class="article-content">
      <h1 class="article-title">{{ article.title }}</h1>
      <div class="article-meta">
        <span>作者：{{ article.author }}</span>
        <span>发布时间：{{ formatDate(article.date) }}</span>
        <span>阅读量：{{ article.views || 0 }}</span>
      </div>
      
      <div class="article-body">
        <p>{{ article.content }}</p>
      </div>
      
      <div class="article-actions">
        <el-button 
          v-permission="'comment:create'" 
          type="primary" 
          @click="toggleCommentForm"
        >
          {{ showCommentForm ? '取消评论' : '发表评论' }}
        </el-button>
        
        <el-button 
          v-permission="'article:edit'" 
          type="success" 
          @click="editArticle"
        >
          编辑文章
        </el-button>
        
        <el-button 
          v-permission="'article:delete'" 
          type="danger" 
          @click="deleteArticle"
        >
          删除文章
        </el-button>
      </div>
      
      <!-- 评论区 -->
      <div v-if="showCommentForm" class="comment-form">
        <el-input 
          v-model="newComment" 
          type="textarea" 
          :rows="4" 
          placeholder="请输入您的评论..."
        />
        <el-button 
          type="primary" 
          @click="submitComment" 
          :disabled="!newComment.trim()"
          style="margin-top: 10px;"
        >
          发表评论
        </el-button>
      </div>
      
      <!-- 评论列表 -->
      <div v-if="comments && comments.length > 0" class="comments-list">
        <h3>评论列表 ({{ comments.length }})</h3>
        <div 
          v-for="comment in comments" 
          :key="comment.id" 
          class="comment-item"
        >
          <div class="comment-header">
            <strong>{{ comment.author }}</strong>
            <span class="comment-date">{{ formatDate(comment.date) }}</span>
            
            <el-button 
              v-permission="'comment:delete'" 
              type="danger" 
              size="small" 
              @click="deleteComment(comment.id)"
            >
              删除
            </el-button>
          </div>
          <div class="comment-content">{{ comment.content }}</div>
        </div>
      </div>
    </div>
    
    <div v-else class="loading">
      <p>正在加载文章...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ElMessage, ElMessageBox } from 'element-plus';
import { useUserStore } from '@/stores/user';

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();

// 模拟文章数据
const article = ref<any>(null);
const comments = ref([
  { id: 1, author: 'Alice', content: '非常好的文章！', date: '2026-03-11' },
  { id: 2, author: 'Bob', content: '学到了很多新知识', date: '2026-03-12' },
]);
const showCommentForm = ref(false);
const newComment = ref('');

// 模拟文章数据
const mockArticles = [
  {
    id: 1,
    title: 'Vue 3 新特性详解',
    author: 'RiverLi',
    date: '2026-03-10',
    content: 'Vue 3 是 Vue.js 的最新版本，带来了许多令人兴奋的新特性。其中最重要的是 Composition API，它允许我们以更灵活的方式组织组件逻辑。此外，还有 Teleport、Suspense 等新功能，以及性能方面的显著提升。',
    views: 125
  },
  {
    id: 2,
    title: 'TypeScript 实践指南',
    author: 'RiverLi',
    date: '2026-03-08',
    content: 'TypeScript 是一种由微软开发的开源编程语言，它是 JavaScript 的超集，添加了静态类型检查功能。在大型项目中使用 TypeScript 可以显著提高代码质量和开发效率。',
    views: 98
  }
];

const loadArticle = () => {
  const id = parseInt(route.params.id as string);
  article.value = mockArticles.find(a => a.id === id) || null;
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const toggleCommentForm = () => {
  if (!userStore.hasPermission('comment:create')) {
    ElMessage.warning('您没有权限发表评论');
    return;
  }
  showCommentForm.value = !showCommentForm.value;
};

const submitComment = () => {
  if (!newComment.value.trim()) {
    ElMessage.warning('评论内容不能为空');
    return;
  }
  
  const comment = {
    id: comments.value.length + 1,
    author: userStore.userInfo?.nickName || '匿名用户',
    content: newComment.value,
    date: new Date().toISOString().split('T')[0]
  };
  
  comments.value.unshift(comment);
  newComment.value = '';
  showCommentForm.value = false;
  ElMessage.success('评论发表成功');
};

const editArticle = () => {
  if (!userStore.hasPermission('article:edit')) {
    ElMessage.warning('您没有权限编辑文章');
    return;
  }
  ElMessage.success('进入编辑页面');
  // 实际项目中应跳转到编辑页面
};

const deleteArticle = async () => {
  if (!userStore.hasPermission('article:delete')) {
    ElMessage.warning('您没有权限删除文章');
    return;
  }
  
  try {
    await ElMessageBox.confirm(
      '确定要删除这篇文章吗？',
      '警告',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    );
    
    ElMessage.success('文章已删除');
    router.push('/blog');
  } catch {
    // 用户取消删除
  }
};

const deleteComment = async (commentId: number) => {
  if (!userStore.hasPermission('comment:delete')) {
    ElMessage.warning('您没有权限删除评论');
    return;
  }
  
  try {
    await ElMessageBox.confirm(
      '确定要删除这条评论吗？',
      '警告',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    );
    
    comments.value = comments.value.filter(c => c.id !== commentId);
    ElMessage.success('评论已删除');
  } catch {
    // 用户取消删除
  }
};

onMounted(() => {
  loadArticle();
  
  // 检查用户权限
  if (userStore.isLoggedIn && !userStore.permissions.length) {
    userStore.loadUserInfo().catch(err => {
      console.error('加载用户信息失败:', err);
    });
  }
});
</script>

<style scoped>
.article-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.article-title {
  font-size: 2em;
  margin-bottom: 10px;
}

.article-meta {
  color: #666;
  margin-bottom: 20px;
}

.article-meta span {
  margin-right: 20px;
}

.article-body {
  line-height: 1.8;
  margin: 30px 0;
  padding: 20px 0;
  border-top: 1px solid #eee;
  border-bottom: 1px solid #eee;
}

.article-actions {
  margin: 30px 0;
}

.comment-form {
  margin: 30px 0;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 4px;
}

.comments-list {
  margin-top: 40px;
}

.comment-item {
  padding: 15px;
  border: 1px solid #eee;
  border-radius: 4px;
  margin-bottom: 10px;
}

.comment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5px;
}

.comment-date {
  color: #999;
  font-size: 0.9em;
}

.comment-content {
  line-height: 1.6;
}
</style>