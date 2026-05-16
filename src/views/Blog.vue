<template>
  <div class="blog-container">
    <h1>博客列表</h1>
    
    <div class="controls" v-permission="'article:create'">
      <el-button type="primary" @click="createArticle">写文章</el-button>
    </div>
    
    <el-table :data="articles" style="width: 100%; margin-top: 20px;">
      <el-table-column prop="id" label="ID" width="100" />
      <el-table-column prop="title" label="标题" />
      <el-table-column prop="author" label="作者" />
      <el-table-column prop="date" label="日期" width="150" />
      <el-table-column label="操作" width="200">
        <template #default="scope">
          <el-button size="small" @click="viewArticle(scope.row.id)">查看</el-button>
          
          <el-button 
            v-permission="'article:edit'" 
            size="small" 
            type="primary" 
            @click="editArticle(scope.row.id)"
          >
            编辑
          </el-button>
          
          <el-button 
            v-permission="'article:delete'" 
            size="small" 
            type="danger" 
            @click="deleteArticle(scope.row.id)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';
import { usePermission } from '@/composables/usePermission';

const router = useRouter();
const userStore = useUserStore();
const { hasPermission } = usePermission();

// 模拟文章数据
const articles = ref([
  { id: 1, title: 'Vue 3 新特性详解', author: 'RiverLi', date: '2026-03-10' },
  { id: 2, title: 'TypeScript 实践指南', author: 'RiverLi', date: '2026-03-08' },
  { id: 3, title: '前端工程化思考', author: 'Guest Author', date: '2026-03-05' },
]);

const createArticle = () => {
  if (!hasPermission('article:create')) {
    ElMessage.warning('您没有权限创建文章');
    return;
  }
  ElMessage.success('进入创建文章页面');
  // 实际项目中应该跳转到创建文章页面
};

const viewArticle = (id: number) => {
  router.push(`/article/${id}`);
};

const editArticle = (id: number) => {
  if (!hasPermission('article:edit')) {
    ElMessage.warning('您没有权限编辑文章');
    return;
  }
  ElMessage.success(`编辑文章 ${id}`);
  // 实际项目中应该跳转到编辑文章页面
};

const deleteArticle = async (id: number) => {
  if (!hasPermission('article:delete')) {
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
    
    // 模拟删除操作
    articles.value = articles.value.filter(article => article.id !== id);
    ElMessage.success('删除成功');
  } catch {
    // 用户取消删除
  }
};

onMounted(() => {
  // 检查用户权限
  if (userStore.isLoggedIn && !userStore.permissions.length) {
    userStore.loadUserInfo().catch(err => {
      console.error('加载用户信息失败:', err);
    });
  }
});
</script>

<style scoped>
.blog-container {
  padding: 20px;
}

.controls {
  margin-bottom: 20px;
}
</style>