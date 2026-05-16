<template>
  <div class="register-container">
    <div class="register-form">
      <h2>用户注册</h2>
      <el-form :model="registerForm" :rules="rules" ref="registerFormRef">
        <el-form-item prop="email">
          <el-input 
            v-model="registerForm.email" 
            placeholder="邮箱" 
            prefix-icon="User"
          />
        </el-form-item>
        <el-form-item prop="password">
          <el-input 
            v-model="registerForm.password" 
            type="password" 
            placeholder="密码" 
            prefix-icon="Lock"
          />
        </el-form-item>
        <el-form-item prop="confirmPassword">
          <el-input 
            v-model="registerForm.confirmPassword" 
            type="password" 
            placeholder="确认密码" 
            prefix-icon="Lock"
          />
        </el-form-item>
        <el-form-item prop="nickName">
          <el-input 
            v-model="registerForm.nickName" 
            placeholder="昵称" 
            prefix-icon="Avatar"
          />
        </el-form-item>
        <el-form-item prop="phoneNumber">
          <el-input 
            v-model="registerForm.phoneNumber" 
            placeholder="手机号" 
            prefix-icon="Phone"
          />
        </el-form-item>
        <el-form-item>
          <el-button 
            type="primary" 
            @click="handleRegister" 
            :loading="loading"
            style="width: 100%"
          >
            注册
          </el-button>
        </el-form-item>
        <div class="login-link">
          <span>已有账户？</span>
          <router-link to="/login">立即登录</router-link>
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
    callback(new Error('两次输入的密码不一致'));
  } else {
    callback();
  }
};

const rules = {
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能少于6位', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请确认密码', trigger: 'blur' },
    { validator: validateConfirmPassword, trigger: 'blur' }
  ],
  nickName: [
    { required: true, message: '请输入昵称', trigger: 'blur' }
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

    ElMessage.success('注册成功，请登录');
    router.push('/login');
  } catch (error: any) {
    console.error('注册失败:', error);
    if (error.message) {
      ElMessage.error(error.message);
    } else {
      ElMessage.error('注册失败，请重试');
    }
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;  /* 修改为min-height以适应没有导航栏的情况 */
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;  /* 添加一些内边距，防止在小屏幕上触顶触底 */
}

.register-form {
  width: 100%;
  max-width: 400px;  /* 限制最大宽度 */
  padding: 30px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.register-form h2 {
  text-align: center;
  margin-bottom: 30px;
  color: #333;
  font-weight: 600;
}

.login-link {
  text-align: center;
  margin-top: 20px;
}

.login-link a {
  color: #409EFF;
  text-decoration: none;
}

.login-link a:hover {
  text-decoration: underline;
}
</style>