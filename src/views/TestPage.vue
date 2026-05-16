<template>
  <div class="test-page">
    <h1>🧪 API 接口测试</h1>
    
    <div class="test-section">
      <h2>测试账号信息</h2>
      <el-card>
        <p><strong>邮箱:</strong> admin@example.com</p>
        <p><strong>密码:</strong> Admin123!</p>
      </el-card>
    </div>
    
    <div class="test-section">
      <h2>测试操作</h2>
      <el-button 
        type="primary" 
        @click="runLoginTest"
        :loading="isTesting"
        size="large"
      >
        🚀 运行完整登录测试
      </el-button>
      
      <el-button 
        type="success"
        @click="runPermissionTest"
        :loading="isTesting"
        size="large"
      >
        🔐 测试权限检查
      </el-button>
      
      <el-button 
        type="warning"
        @click="clearTestData"
        size="large"
      >
        🗑️ 清除测试数据
      </el-button>
    </div>
    
    <div class="test-section" v-if="testResults.length > 0">
      <h2>测试结果</h2>
      <el-collapse accordion>
        <el-collapse-item 
          v-for="(result, index) in testResults" 
          :key="index"
          :title="result.title"
        >
          <div class="result-content">
            <pre>{{ JSON.stringify(result.data, null, 2) }}</pre>
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>
    
    <div class="test-section">
      <h2>控制台输出</h2>
      <el-alert
        title="查看浏览器控制台 (F12) 获取详细日志"
        type="info"
        :closable="false"
        show-icon
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { ElMessage } from 'element-plus';
import { authApi, userApi } from '@/utils/api';
import { useUserStore } from '@/stores/user';

const userStore = useUserStore();
const isTesting = ref(false);
const testResults = ref<any[]>([]);

// 测试账号
const TEST_ACCOUNT = {
  email: 'admin@example.com',
  password: 'Admin123!'
};

/**
 * 运行完整登录测试
 */
const runLoginTest = async () => {
  isTesting.value = true;
  testResults.value = [];
  
  try {
    console.log('========================================');
    console.log('🧪 开始测试登录流程');
    console.log('========================================');
    console.log('测试账号:', TEST_ACCOUNT.email);
    
    // 步骤 1: 登录
    console.log('\n📝 步骤 1: 执行登录...');
    const loginResponse = await authApi.login(TEST_ACCOUNT);
    console.log('✅ 登录成功!');
    
    testResults.value.push({
      title: '1. 登录响应',
      data: loginResponse.data
    });
    
    // 步骤 2: 获取用户信息
    console.log('\n📝 步骤 2: 获取用户信息...');
    const userInfoResponse = await userApi.getInfo();
    console.log('✅ 用户信息获取成功!');
    
    testResults.value.push({
      title: '2. 用户详细信息',
      data: userInfoResponse
    });
    
    // 步骤 3: 获取权限
    console.log('\n📝 步骤 3: 获取用户权限...');
    const permissionsResponse = await userApi.getPermissions();
    console.log('✅ 权限获取成功!');
    console.log('权限码:', permissionsResponse.data);
    
    testResults.value.push({
      title: '3. 权限码列表',
      data: permissionsResponse.data
    });
    
    // 步骤 4: 获取菜单
    console.log('\n📝 步骤 4: 获取用户菜单...');
    const menusResponse = await userApi.getMenus();
    console.log('✅ 菜单获取成功!');
    console.log('菜单树:', menusResponse.data);
    
    testResults.value.push({
      title: '4. 菜单树',
      data: menusResponse.data
    });
    
    // 步骤 5: 获取角色
    console.log('\n📝 步骤 5: 获取用户角色...');
    const rolesResponse = await userApi.getRoles();
    console.log('✅ 角色获取成功!');
    console.log('角色列表:', rolesResponse.data);
    
    testResults.value.push({
      title: '5. 角色列表',
      data: rolesResponse.data
    });
    
    // 步骤 6: 获取仪表盘数据
    console.log('\n📝 步骤 6: 获取仪表盘数据...');
    const dashboardResponse = await userApi.getDashboardStats();
    console.log('✅ 仪表盘数据获取成功!');
    console.log('统计数据:', dashboardResponse.data);
    
    testResults.value.push({
      title: '6. 仪表盘统计',
      data: dashboardResponse.data
    });
    
    console.log('\n========================================');
    console.log('🎉 测试完成！所有接口调用成功!');
    console.log('========================================');
    
    ElMessage.success('测试完成！请查看下方结果和控制台日志');
    
  } catch (error: any) {
    console.error('\n❌ 测试失败!');
    console.error('错误信息:', error.message);
    
    if (error.response) {
      console.error('响应状态:', error.response.status);
      console.error('响应数据:', error.response.data);
    }
    
    ElMessage.error('测试失败：' + error.message);
  } finally {
    isTesting.value = false;
  }
};

/**
 * 运行权限检查测试
 */
const runPermissionTest = async () => {
  isTesting.value = true;
  testResults.value = [];
  
  try {
    console.log('\n========================================');
    console.log('🧪 开始测试权限检查功能');
    console.log('========================================');
    
    // 先登录
    await authApi.login(TEST_ACCOUNT);
    
    // 获取权限
    const permissionsResponse = await userApi.getPermissions();
    const permissions = permissionsResponse.data;
    
    console.log('当前用户权限码:', permissions);
    
    // 测试常见权限
    const testPermissions = [
      'article:view',
      'article:create',
      'article:edit',
      'article:delete',
      'user:manage'
    ];
    
    console.log('\n权限检查结果:');
    const results: any = {};
    testPermissions.forEach(perm => {
      const hasPerm = permissions.includes(perm);
      results[perm] = hasPerm ? '✅' : '❌';
      console.log(`├─ ${perm}: ${hasPerm ? '✅' : '❌'}`);
    });
    
    testResults.value.push({
      title: '权限检查结果',
      data: results
    });
    
    console.log('\n✅ 权限检查测试完成!');
    ElMessage.success('权限检查完成！请查看控制台日志');
    
  } catch (error: any) {
    console.error('❌ 权限检查测试失败:', error.message);
    ElMessage.error('测试失败：' + error.message);
  } finally {
    isTesting.value = false;
  }
};

/**
 * 清除测试数据
 */
const clearTestData = () => {
  localStorage.removeItem('auth_token');
  localStorage.removeItem('user_info');
  testResults.value = [];
  userStore.logout();
  ElMessage.success('测试数据已清除');
  console.log('✅ 测试数据已清除');
};
</script>

<style scoped>
.test-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.test-section {
  margin-bottom: 30px;
}

.test-section h2 {
  margin-bottom: 15px;
  color: #333;
}

.result-content {
  background: #f5f7fa;
  padding: 15px;
  border-radius: 4px;
  max-height: 400px;
  overflow: auto;
}

.result-content pre {
  margin: 0;
  font-family: 'Courier New', Courier, monospace;
  font-size: 12px;
  line-height: 1.5;
  white-space: pre-wrap;
  word-wrap: break-word;
}

.el-button {
  margin-right: 10px;
}
</style>
