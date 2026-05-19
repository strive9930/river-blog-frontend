<template>
  <div class="auth-card">
    <div class="auth-card-header">
      <div class="auth-icon">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <rect x="3" y="11" width="18" height="11" rx="2"/>
          <path d="M7 11V7a5 5 0 019.9-1"/>
        </svg>
      </div>
      <h2 class="auth-title">Reset Password</h2>
      <p class="auth-subtitle">Enter your email and we'll send you a reset link</p>
    </div>

    <!-- Success State -->
    <div v-if="successSent" class="auth-success">
      <div class="success-icon">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
          <polyline points="22 4 12 14.01 9 11.01"/>
        </svg>
      </div>
      <p class="success-message">Reset link sent to your email. Redirecting to login...</p>
    </div>

    <!-- Form -->
    <el-form v-else :model="formData" :rules="rules" ref="formRef" size="large">
      <el-form-item prop="email">
        <el-input
          v-model="formData.email"
          placeholder="Email address"
          prefix-icon="Message"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          @click="handleSubmit"
          :loading="loading"
          class="auth-submit-btn"
        >
          Send Reset Link
        </el-button>
      </el-form-item>
      <div class="auth-links">
        <router-link to="/login" class="auth-link">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style="vertical-align: -3px;">
            <path d="M10 12L6 8l4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          Back to Login
        </router-link>
      </div>
    </el-form>
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
const successSent = ref(false);

const rules = {
  email: [
    { required: true, message: 'Please enter your email', trigger: 'blur' },
    { type: 'email', message: 'Please enter a valid email address', trigger: ['blur', 'change'] }
  ]
};

const formRef = ref();

const handleSubmit = async () => {
  try {
    await formRef.value.validate();
    loading.value = true;

    const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api'}/auth/forgot-password`, {
      email: formData.email
    });

    if (response.data.success) {
      successSent.value = true;
      ElMessage.success('Password reset link sent to your email');
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } else {
      ElMessage.error(response.data.message || 'Failed to send reset link');
    }
  } catch (error: any) {
    console.error('Forgot password failed:', error);
    if (error.response?.data?.message) {
      ElMessage.error(error.response.data.message);
    } else {
      ElMessage.error('Failed to send reset link');
    }
  } finally {
    loading.value = false;
  }
};
</script>

<style lang="scss" scoped>
.auth-card {
  background: var(--bg-card);
  border-radius: var(--radius-2xl);
  padding: var(--space-2xl);
  box-shadow: var(--shadow-xl);
}

.auth-card-header {
  text-align: center;
  margin-bottom: var(--space-2xl);
}

.auth-icon {
  width: 56px;
  height: 56px;
  border-radius: var(--radius-xl);
  background: #fef3c7;
  color: #f59e0b;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto var(--space-md);
}

.auth-title {
  font-size: var(--font-size-2xl);
  font-weight: 700;
  margin-bottom: var(--space-xs);
}

.auth-subtitle {
  font-size: var(--font-size-sm);
  color: var(--text-muted);
  margin: 0;
}

.auth-submit-btn {
  width: 100%;
  height: 44px;
  font-size: var(--font-size-base);
  font-weight: 600;
  border-radius: var(--radius-lg);
}

.auth-links {
  text-align: center;
}

.auth-link {
  font-size: var(--font-size-sm);
  color: var(--color-primary);
  text-decoration: none;

  &:hover {
    color: var(--color-primary-hover);
    text-decoration: underline;
  }
}

// ---------- Success State ----------
.auth-success {
  text-align: center;
  animation: fade-in 0.4s ease;
}

.success-icon {
  width: 64px;
  height: 64px;
  border-radius: var(--radius-full);
  background: #ecfdf5;
  color: #10b981;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto var(--space-md);
}

.success-message {
  color: var(--text-secondary);
  margin: 0;
  line-height: 1.6;
}
</style>
