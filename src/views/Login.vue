<template>
  <div class="login-container">
    <div class="login-form">
      <h2>用户登录</h2>
      <el-form :model="loginForm" :rules="rules" ref="loginFormRef">
        <el-form-item prop="email">
          <el-input 
            v-model="loginForm.email" 
            placeholder="邮箱" 
            prefix-icon="User"
          />
        </el-form-item>
        <el-form-item prop="password">
          <el-input 
            v-model="loginForm.password" 
            type="password" 
            placeholder="密码" 
            prefix-icon="Lock"
          />
        </el-form-item>
        <el-form-item>
          <el-button 
            type="primary" 
            @click="handleLogin" 
            :loading="loading"
            style="width: 100%"
          >
            登录
          </el-button>
        </el-form-item>
        <div class="form-links">
          <router-link to="/register" class="link">注册账号</router-link>
          <router-link to="/forgot-password" class="link">忘记密码？</router-link>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { useUserStore } from '@/stores/user';

const router = useRouter();
const userStore = useUserStore();

const loginForm = reactive({
  email: '',
  password: ''
});

const loading = ref(false);

const rules = {
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能少于6位', trigger: 'blur' }
  ]
};

const loginFormRef = ref();

const handleLogin = async () => {
  try {
    await loginFormRef.value.validate();
    loading.value = true;

    console.log('[登录] 步骤 1: 开始登录...');
    
    // 等待登录完全完成（包括加载用户信息）
    const result = await userStore.login({
      email: loginForm.email,
      password: loginForm.password
    });

    console.log('[登录] 步骤 2: ✅ 登录 API 调用成功');
    console.log('[登录] 完整响应:', result);
    console.log('[登录] result.data:', result?.data);
    console.log('[登录] Token:', result?.data?.token);
    console.log('[登录] localStorage 检查:', localStorage.getItem('auth_token') ? '✅ 已保存' : '❌ 未保存');
    
    ElMessage.success('登录成功');
    
    // 使用 router.replace 而不是 push，避免重复添加历史记录
    // replace 会替换当前历史记录，而不是创建新的
    console.log('[登录] 步骤 3: 准备跳转到首页...');
    await router.replace('/');
    console.log('[登录] ✅ 跳转完成');
  } catch (error: any) {
    console.error('[登录] ❌ 登录失败:', error);
    if (error.message) {
      ElMessage.error(error.message);
    } else {
      ElMessage.error('登录失败，请检查用户名和密码');
    }
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.login-form {
  width: 100%;
  max-width: 400px;
  padding: 30px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.login-form h2 {
  text-align: center;
  margin-bottom: 30px;
  color: #333;
  font-weight: 600;
}

.form-links {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.form-links .link {
  color: #409EFF;
  text-decoration: none;
  font-size: 14px;
}

.form-links .link:hover {
  text-decoration: underline;
}
</style>