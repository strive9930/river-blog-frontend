<template>
  <div class="auth-card">
    <div class="auth-card-header">
      <div class="auth-icon">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <rect x="3" y="11" width="18" height="11" rx="2"/>
          <path d="M7 11V7a5 5 0 0110 0v4"/>
        </svg>
      </div>
      <h2 class="auth-title">Welcome Back</h2>
      <p class="auth-subtitle">Sign in to your account to continue</p>
    </div>
    <el-form :model="loginForm" :rules="rules" ref="loginFormRef" size="large">
      <el-form-item prop="email">
        <el-input
          v-model="loginForm.email"
          placeholder="Email address"
          prefix-icon="User"
        />
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          v-model="loginForm.password"
          type="password"
          placeholder="Password"
          prefix-icon="Lock"
          show-password
        />
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          @click="handleLogin"
          :loading="loading"
          class="auth-submit-btn"
        >
          Sign In
        </el-button>
      </el-form-item>
      <div class="auth-links">
        <router-link to="/register" class="auth-link">Create account</router-link>
        <router-link to="/forgot-password" class="auth-link">Forgot password?</router-link>
      </div>
    </el-form>
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
    { required: true, message: 'Please enter your email', trigger: 'blur' },
    { type: 'email', message: 'Please enter a valid email address', trigger: ['blur', 'change'] }
  ],
  password: [
    { required: true, message: 'Please enter your password', trigger: 'blur' },
    { min: 6, message: 'Password must be at least 6 characters', trigger: 'blur' }
  ]
};

const loginFormRef = ref();

const handleLogin = async () => {
  try {
    await loginFormRef.value.validate();
    loading.value = true;

    console.log('[Login] Step 1: Starting login...');

    const result = await userStore.login({
      email: loginForm.email,
      password: loginForm.password
    });

    console.log('[Login] Step 2: Login successful');
    console.log('[Login] Full response:', result);
    console.log('[Login] Token:', result?.data?.token);
    console.log('[Login] localStorage check:', localStorage.getItem('auth_token') ? 'Saved' : 'Not saved');

    ElMessage.success('Login successful');

    console.log('[Login] Step 3: Redirecting to home...');
    await router.replace('/');
    console.log('[Login] Redirect complete');
  } catch (error: any) {
    console.error('[Login] Login failed:', error);
    if (error.message) {
      ElMessage.error(error.message);
    } else {
      ElMessage.error('Login failed, please check your credentials');
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
  background: var(--color-primary-50);
  color: var(--color-primary);
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
  display: flex;
  justify-content: space-between;
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
</style>
