<template>
  <div class="login-container">
    <div class="login-box">
      <div class="login-header">
        <div class="logo">🎮</div>
        <h1 class="login-title">后台管理系统</h1>
        <p class="login-subtitle">Admin Management System</p>
      </div>

      <div class="error-message" :class="{ show: showError }">
        {{ errorMessage }}
      </div>

      <el-form
        ref="loginFormRef"
        :model="loginForm"
        :rules="loginRules"
        class="login-form-container"
        @submit.prevent="handleLogin"
      >
        <div class="form-group">
          <label class="form-label">管理员账号</label>
          <div class="form-input-wrapper">
            <span class="form-input-icon">👤</span>
            <el-input
              v-model="loginForm.username"
              placeholder="请输入管理员账号"
              class="form-input"
              @focus="handleFocus('username')"
              @blur="handleBlur('username')"
            />
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">登录密码</label>
          <div class="form-input-wrapper">
            <span class="form-input-icon">🔒</span>
            <el-input
              v-model="loginForm.password"
              type="password"
              placeholder="请输入登录密码"
              class="form-input"
              show-password
              @focus="handleFocus('password')"
              @blur="handleBlur('password')"
              @keyup.enter="handleLogin"
            />
          </div>
        </div>

        <div class="form-options">
          <label class="remember-me">
            <input type="checkbox" v-model="loginForm.rememberMe">
            <span>记住我</span>
          </label>
          <a href="#" class="forgot-password" @click.prevent>忘记密码？</a>
        </div>

        <el-button
          type="primary"
          :loading="loading"
          class="login-btn"
          @click="handleLogin"
        >
          {{ loading ? '登录中...' : '登 录' }}
        </el-button>
      </el-form>

      <div class="divider">
        <span class="divider-text">其他登录方式</span>
      </div>

      <div class="other-login">
        <div class="login-methods">
          <div class="login-method" title="微信登录">💬</div>
          <div class="login-method" title="钉钉登录">📱</div>
          <div class="login-method" title="扫码登录">📷</div>
        </div>
      </div>

      <div class="footer">
        <p>© 2026 陪玩平台 · <a href="#">使用协议</a> · <a href="#">隐私政策</a></p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/store/user'
import { ElMessage } from 'element-plus'

const router = useRouter()
const userStore = useUserStore()

const loginFormRef = ref(null)
const loading = ref(false)
const showError = ref(false)
const errorMessage = ref('')

const loginForm = reactive({
  username: '',
  password: '',
  rememberMe: false
})

const loginRules = {
  username: [
    { required: true, message: '请输入管理员账号', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度在 3 到 20 个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度在 6 到 20 个字符', trigger: 'blur' }
  ]
}

const handleFocus = (field) => {
  const icon = document.querySelector(`.form-input-wrapper:nth-child(${field === 'username' ? 1 : 2}) .form-input-icon`)
  if (icon) {
    icon.style.color = '#667eea'
  }
}

const handleBlur = (field) => {
  const icon = document.querySelector(`.form-input-wrapper:nth-child(${field === 'username' ? 1 : 2}) .form-input-icon`)
  if (icon) {
    icon.style.color = '#999'
  }
}

const showErrorMsg = (msg) => {
  errorMessage.value = msg
  showError.value = true
  setTimeout(() => {
    showError.value = false
  }, 3000)
}

const handleLogin = async () => {
  try {
    const valid = await loginFormRef.value.validate()
    if (!valid) return

    loading.value = true

    // 调用登录API
    const res = await userStore.login({
      username: loginForm.username,
      password: loginForm.password
    })

    if (res.code === 200) {
      ElMessage.success('登录成功')
      router.push('/')
    } else {
      showErrorMsg(res.message || '账号或密码错误')
    }
  } catch (error) {
    console.error('登录失败:', error)
    showErrorMsg('账号或密码错误，请重试')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped lang="scss">
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.login-container {
  width: 100%;
  height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
}

.login-box {
  width: 420px;
  background-color: #fff;
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  padding: 48px;
  animation: slideUp 0.5s ease;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.login-header {
  text-align: center;
  margin-bottom: 40px;
}

.logo {
  width: 64px;
  height: 64px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  font-size: 32px;
}

.login-title {
  font-size: 28px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
}

.login-subtitle {
  font-size: 14px;
  color: #999;
}

.error-message {
  background: #fee;
  color: #c33;
  padding: 10px 14px;
  border-radius: 8px;
  font-size: 13px;
  margin-bottom: 16px;
  display: none;
}

.error-message.show {
  display: block;
  animation: shake 0.5s ease;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-10px); }
  75% { transform: translateX(10px); }
}

.login-form-container {
  .form-group {
    margin-bottom: 24px;
  }

  .form-label {
    display: block;
    font-size: 14px;
    font-weight: 500;
    color: #333;
    margin-bottom: 8px;
  }

  .form-input-wrapper {
    position: relative;
  }

  .form-input-icon {
    position: absolute;
    left: 14px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 18px;
    color: #999;
    z-index: 1;
    transition: color 0.3s ease;
  }

  :deep(.el-input__wrapper) {
    padding-left: 44px;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    box-shadow: none;
    transition: all 0.3s ease;

    &:hover {
      border-color: #e0e0e0;
    }

    &.is-focus {
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }
  }

  .form-options {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
  }

  .remember-me {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    color: #666;
    cursor: pointer;

    input[type="checkbox"] {
      cursor: pointer;
    }
  }

  .forgot-password {
    font-size: 13px;
    color: #667eea;
    text-decoration: none;
    transition: color 0.3s ease;

    &:hover {
      color: #764ba2;
    }
  }

  .login-btn {
    width: 100%;
    padding: 14px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    margin-bottom: 20px;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
    }

    &:active {
      transform: translateY(0);
    }
  }
}

.divider {
  text-align: center;
  position: relative;
  margin: 24px 0;

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    width: 100%;
    height: 1px;
    background: #e0e0e0;
  }

  .divider-text {
    background: white;
    padding: 0 16px;
    position: relative;
    font-size: 13px;
    color: #999;
  }
}

.other-login {
  text-align: center;
}

.login-methods {
  display: flex;
  justify-content: center;
  gap: 16px;
}

.login-method {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 1px solid #e0e0e0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    border-color: #667eea;
    background: rgba(102, 126, 234, 0.1);
  }
}

.footer {
  text-align: center;
  margin-top: 24px;
  font-size: 12px;
  color: #999;

  a {
    color: #667eea;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
}
</style>
