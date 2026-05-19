<template>
  <div class="auth-card">
    <div class="auth-card-header">
      <div class="auth-icon">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2"/>
          <circle cx="9" cy="7" r="4"/>
          <path d="M19 8v6M22 11h-6"/>
        </svg>
      </div>
      <h2 class="auth-title">Create Account</h2>
      <p class="auth-subtitle">Join our community of developers</p>
    </div>
    <el-form :model="registerForm" :rules="rules" ref="registerFormRef" size="large">
      <el-form-item prop="email">
        <el-input
          v-model="registerForm.email"
          placeholder="Email address"
          prefix-icon="User"
        />
      </el-form-item>
      <el-form-item prop="nickName">
        <el-input
          v-model="registerForm.nickName"
          placeholder="Display name"
          prefix-icon="UserFilled"
        />
      </el-form-item>
      <el-form-item prop="phoneNumber">
        <el-input
          v-model="registerForm.phoneNumber"
          placeholder="Phone (optional)"
          prefix-icon="Phone"
        />
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          v-model="registerForm.password"
          type="password"
          placeholder="Password"
          prefix-icon="Lock"
          show-password
        />
      </el-form-item>
      <el-form-item prop="confirmPassword">
        <el-input
          v-model="registerForm.confirmPassword"
          type="password"
          placeholder="Confirm password"
          prefix-icon="Lock"
          show-password
        />
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          @click="handleRegister"
          :loading="loading"
          class="auth-submit-btn"
        >
          Create Account
        </el-button>
      </el-form-item>
      <div class="auth-links">
        <span class="auth-link-text">Already have an account?</span>
        <router-link to="/login" class="auth-link">Sign in</router-link>
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

const registerForm = reactive({
  email: '',
  password: '',
  confirmPassword: '',
  nickName: '',
  phoneNumber: ''
});

const loading = ref(false);

const validateConfirmPassword = (rule: any, value: string, callback: any) => {
  if (value !== registerForm.password) {
    callback(new Error('Passwords do not match'));
  } else {
    callback();
  }
};

const rules = {
  email: [
    { required: true, message: 'Please enter your email', trigger: 'blur' },
    { type: 'email', message: 'Please enter a valid email address', trigger: ['blur', 'change'] }
  ],
  password: [
    { required: true, message: 'Please enter your password', trigger: 'blur' },
    { min: 6, message: 'Password must be at least 6 characters', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: 'Please confirm your password', trigger: 'blur' },
    { validator: validateConfirmPassword, trigger: 'blur' }
  ],
  nickName: [
    { required: true, message: 'Please enter your display name', trigger: 'blur' }
  ]
};

const registerFormRef = ref();

const handleRegister = async () => {
  try {
    await registerFormRef.value.validate();
    loading.value = true;

    await userStore.register({
      email: registerForm.email,
      password: registerForm.password,
      nickName: registerForm.nickName,
      phoneNumber: registerForm.phoneNumber
    });

    ElMessage.success('Registration successful! Please sign in.');
    router.push('/login');
  } catch (error: any) {
    console.error('Registration failed:', error);
    if (error.message) {
      ElMessage.error(error.message);
    } else {
      ElMessage.error('Registration failed, please try again');
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
  max-height: calc(100vh - var(--space-2xl) * 2);
  overflow-y: auto;
}

.auth-card-header {
  text-align: center;
  margin-bottom: var(--space-xl);
}

.auth-icon {
  width: 56px;
  height: 56px;
  border-radius: var(--radius-xl);
  background: var(--color-accent-light);
  color: var(--color-accent);
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
  display: flex;
  gap: var(--space-xs);
  justify-content: center;
  align-items: center;
}

.auth-link-text {
  font-size: var(--font-size-sm);
  color: var(--text-muted);
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
