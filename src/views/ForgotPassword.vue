<template>
  <div class="forgot-password-container">
    <div class="forgot-password-form">
      <h2>找回密码</h2>
      <p class="subtitle">请输入您的邮箱，我们将发送重置密码的链接到您的邮箱</p>
      
      <el-form :model="formData" :rules="rules" ref="formRef">
        <el-form-item prop="email">
          <el-input 
            v-model="formData.email" 
            placeholder="请输入您的邮箱" 
            prefix-icon="Message"
          />
        </el-form-item>
        <el-form-item>
          <el-button 
            type="primary" 
            @click="handleSubmit" 
            :loading="loading"
            style="width: 100%"
          >
            发送重置链接
          </el-button>
        </el-form-item>
        <div class="form-links">
          <router-link to="/login" class="link">返回登录</router-link>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import axios from 'axios';

const router = useRouter();

const formData = reactive({
  email: ''
});

const loading = ref(false);

const rules = {
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
  ]
};

const formRef = ref();

const handleSubmit = async () => {
  try {
    await formRef.value.validate();
    loading.value = true;

    // 发送重置密码请求到后端
    const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api'}/auth/forgot-password`, {
      email: formData.email
    });
    
    if (response.data.success) {
      ElMessage.success('重置密码邮件已发送，请查收您的邮箱');
      // 2秒后重定向到登录页面
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } else {
      ElMessage.error(response.data.message || '发送失败，请稍后重试');
    }
  } catch (error: any) {
    console.error('找回密码失败:', error);
    if (error.response?.data?.message) {
      ElMessage.error(error.response.data.message);
    } else {
      ElMessage.error('发送失败，请稍后重试');
    }
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.forgot-password-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.forgot-password-form {
  width: 100%;
  max-width: 400px;
  padding: 30px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.forgot-password-form h2 {
  text-align: center;
  margin-bottom: 10px;
  color: #333;
  font-weight: 600;
}

.subtitle {
  text-align: center;
  color: #666;
  margin-bottom: 30px;
  font-size: 14px;
  line-height: 1.5;
}

.form-links {
  text-align: center;
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