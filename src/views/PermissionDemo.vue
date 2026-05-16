<template>
  <div class="permission-demo">
    <h2>权限控制示例</h2>
    
    <!-- 使用 v-permission 指令 -->
    <div class="demo-section">
      <h3>1. 权限控制 (v-permission)</h3>
      
      <!-- 单个权限 -->
      <el-button 
        v-permission="'article:create'"
        type="primary"
      >
        发布文章 (需要 article:create 权限)
      </el-button>
      
      <el-button 
        v-permission="'article:edit'"
        type="success"
      >
        编辑文章 (需要 article:edit 权限)
      </el-button>
      
      <!-- 多个权限（满足任一即可） -->
      <el-button 
        v-permission="['article:delete', 'admin:delete']"
        type="danger"
      >
        删除文章 (需要 article:delete 或 admin:delete 权限)
      </el-button>
      
      <!-- 没有权限时隐藏 -->
      <el-button 
        v-permission="'super:admin'"
        type="warning"
      >
        超级管理员按钮 (需要 super:admin 权限)
      </el-button>
    </div>
    
    <!-- 使用 v-role 指令 -->
    <div class="demo-section">
      <h3>2. 角色控制 (v-role)</h3>
      
      <!-- 单个角色 -->
      <el-button 
        v-role="'Admin'"
        type="primary"
      >
        管理员功能 (需要 Admin 角色)
      </el-button>
      
      <el-button 
        v-role="'VIP'"
        color="#626AEB"
      >
        VIP 专属功能 (需要 VIP 角色)
      </el-button>
      
      <!-- 多个角色（满足任一即可） -->
      <el-button 
        v-role="['Admin', 'SuperAdmin']"
        type="success"
      >
        管理功能 (需要 Admin 或 SuperAdmin 角色)
      </el-button>
    </div>
    
    <!-- 使用 usePermission 组合式函数 -->
    <div class="demo-section">
      <h3>3. 组合式函数 (usePermission)</h3>
      
      <el-card class="info-card">
        <template #header>
          <span>当前用户信息</span>
        </template>
        
        <div class="user-info">
          <p><strong>邮箱:</strong> {{ permission.userInfo.value?.email }}</p>
          <p><strong>昵称:</strong> {{ permission.userInfo.value?.nickName || '未设置' }}</p>
          <p><strong>角色:</strong> {{ permission.roles.value.join(', ') || '无' }}</p>
          <p><strong>权限码:</strong></p>
          <el-tag 
            v-for="perm in permission.permissions.value" 
            :key="perm"
            size="small"
            style="margin-right: 8px; margin-bottom: 8px;"
          >
            {{ perm }}
          </el-tag>
        </div>
        
        <div class="permission-checks">
          <el-alert
            title="权限检查结果"
            type="info"
            :closable="false"
            show-icon
          >
            <ul>
              <li>是否有 article:view 权限：{{ permission.hasPermission('article:view') ? '✅' : '❌' }}</li>
              <li>是否有 article:create 权限：{{ permission.hasPermission('article:create') ? '✅' : '❌' }}</li>
              <li>是否是管理员：{{ permission.isAdmin.value ? '✅' : '❌' }}</li>
              <li>是否是 VIP：{{ permission.isVIP.value ? '✅' : '❌' }}</li>
            </ul>
          </el-alert>
        </div>
      </el-card>
    </div>
    
    <!-- 使用 useMenu 组合式函数 -->
    <div class="demo-section">
      <h3>4. 菜单控制 (useMenu)</h3>
      
      <el-card class="menu-card">
        <template #header>
          <span>动态菜单树</span>
        </template>
        
        <el-tree
          :data="menus.allMenus.value"
          :props="{ label: 'title', children: 'children' }"
          node-key="id"
          default-expand-all
        />
      </el-card>
    </div>
    
    <!-- 条件渲染示例 -->
    <div class="demo-section">
      <h3>5. 条件渲染示例</h3>
      
      <div v-if="permission.hasPermission('dashboard:view')">
        <el-alert
          title="仪表盘面板"
          type="success"
          description="您有权限查看仪表盘数据"
          :closable="false"
        />
      </div>
      
      <div v-if="!permission.hasPermission('dashboard:view')">
        <el-alert
          title="无权限提示"
          type="warning"
          description="您没有权限查看仪表盘数据"
          :closable="false"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { usePermission, useMenu } from '@/composables/usePermission';

const permission = usePermission();
const menus = useMenu();
</script>

<style scoped>
.permission-demo {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.demo-section {
  margin-bottom: 30px;
}

.demo-section h3 {
  margin-bottom: 15px;
  color: #333;
}

.demo-section .el-button {
  margin-right: 10px;
  margin-bottom: 10px;
}

.info-card, .menu-card {
  margin-top: 15px;
}

.user-info p {
  margin: 10px 0;
  line-height: 1.6;
}

.permission-checks {
  margin-top: 20px;
}

.permission-checks ul {
  list-style: none;
  padding: 0;
}

.permission-checks li {
  padding: 8px 0;
  border-bottom: 1px solid #eee;
}

.permission-checks li:last-child {
  border-bottom: none;
}
</style>
