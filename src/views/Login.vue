<template>
  <div class="login-container">
    <!-- 背景装饰 -->
    <div class="bg-decoration">
      <div class="circle circle-1"></div>
      <div class="circle circle-2"></div>
      <div class="circle circle-3"></div>
    </div>

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
        <el-form-item prop="username" class="form-group">
          <label class="form-label">管理员账号</label>
          <div class="form-input-wrapper">
            <span class="form-input-icon">👤</span>
            <el-input
              v-model="loginForm.username"
              placeholder="请输入管理员账号"
              class="form-input"
              clearable
            />
          </div>
        </el-form-item>

        <el-form-item prop="password" class="form-group">
          <label class="form-label">登录密码</label>
          <div class="form-input-wrapper">
            <span class="form-input-icon">🔒</span>
            <el-input
              v-model="loginForm.password"
              type="password"
              placeholder="请输入登录密码"
              class="form-input"
              show-password
              @keyup.enter="handleLogin"
            />
          </div>
        </el-form-item>

        <div class="form-options">
          <el-checkbox v-model="loginForm.rememberMe" class="remember-me">
            记住我
          </el-checkbox>
          <a href="#" class="forgot-password" @click.prevent>忘记密码？</a>
        </div>

        <el-button
          type="primary"
          :loading="loading"
          class="login-btn"
          native-type="submit"
        >
          {{ loading ? '登录中...' : '登 录' }}
        </el-button>
      </el-form>

      <div class="footer">
        <p>© 2026 陪玩平台 · <a href="#">使用协议</a> · <a href="#">隐私政策</a></p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/store/user'
import { ElMessage } from 'element-plus'

const router = useRouter()
const userStore = useUserStore()

const loginFormRef = ref(null)
const loading = ref(false)
const showError = ref(false)
const errorMessage = ref('')

const REMEMBER_KEY = 'loginRemember'
// 记住我有效期：7 天
const REMEMBER_EXPIRE = 7 * 24 * 60 * 60 * 1000

// 登录表单
const loginForm = reactive({
  username: '',
  password: '',
  rememberMe: false
})

// 校验规则
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

// 简单编码/解码，避免密码以明文形式直接出现在 localStorage 中
const encode = (str) => {
  try {
    return btoa(encodeURIComponent(str))
  } catch {
    return ''
  }
}

const decode = (str) => {
  try {
    return decodeURIComponent(atob(str))
  } catch {
    return ''
  }
}

// 页面加载时读取本地存储的账号密码
onMounted(() => {
  const rememberData = localStorage.getItem(REMEMBER_KEY)
  if (!rememberData) return

  try {
    const { username, password, expire } = JSON.parse(rememberData)
    // 超过有效期则清除记录
    if (expire && Date.now() > expire) {
      localStorage.removeItem(REMEMBER_KEY)
      return
    }
    loginForm.username = username || ''
    loginForm.password = password ? decode(password) : ''
    loginForm.rememberMe = true
  } catch (e) {
    console.error('读取记住账号密码失败：', e)
    localStorage.removeItem(REMEMBER_KEY)
  }
})

// 登录成功后，根据「记住我」状态保存/清除本地记录
const saveRememberMe = () => {
  if (loginForm.rememberMe) {
    const data = {
      username: loginForm.username,
      password: encode(loginForm.password),
      expire: Date.now() + REMEMBER_EXPIRE
    }
    localStorage.setItem(REMEMBER_KEY, JSON.stringify(data))
  } else {
    localStorage.removeItem(REMEMBER_KEY)
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
    await loginFormRef.value.validate()
  } catch {
    return
  }

  loading.value = true
  try {
    // 调用登录API
    const res = await userStore.login({
      phone: loginForm.username,
      password: loginForm.password
    })

    if (res.code === 200) {
      saveRememberMe()
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
.login-container {
  position: relative;
  width: 100%;
  height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  overflow: hidden;
}

// 背景装饰圆
.bg-decoration {
  position: absolute;
  inset: 0;
  pointer-events: none;

  .circle {
    position: absolute;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.08);
    animation: float 8s ease-in-out infinite;
  }

  .circle-1 {
    width: 320px;
    height: 320px;
    top: -80px;
    left: -100px;
  }

  .circle-2 {
    width: 220px;
    height: 220px;
    bottom: -60px;
    right: -60px;
    animation-delay: -3s;
  }

  .circle-3 {
    width: 120px;
    height: 120px;
    top: 20%;
    right: 15%;
    animation-delay: -5s;
  }
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
}

.login-box {
  position: relative;
  width: 420px;
  max-width: calc(100vw - 32px);
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  padding: 48px;
  animation: slideUp 0.5s ease;

  @media (max-width: 480px) {
    padding: 32px 24px;
  }
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
  margin-bottom: 36px;
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
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.35);
}

.login-title {
  font-size: 26px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
}

.login-subtitle {
  font-size: 13px;
  color: #999;
  letter-spacing: 1px;
}

.error-message {
  background: #fef0f0;
  color: #f56c6c;
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
    display: block;
    margin-bottom: 22px;

    :deep(.el-form-item__content) {
      display: block;
    }

    :deep(.el-form-item__error) {
      padding-top: 4px;
    }
  }

  .form-label {
    display: block;
    font-size: 14px;
    font-weight: 500;
    color: #333;
    margin-bottom: 8px;
    line-height: 1.4;
  }

  .form-input-wrapper {
    position: relative;

    // 聚焦时图标变色（纯 CSS 实现）
    &:focus-within .form-input-icon {
      color: #667eea;
    }
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
    padding: 6px 12px 6px 44px;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    box-shadow: none;
    transition: border-color 0.3s ease, box-shadow 0.3s ease;

    &:hover {
      border-color: #c8c9f5;
    }

    &.is-focus {
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.12);
    }
  }

  .form-options {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
  }

  .remember-me {
    :deep(.el-checkbox__label) {
      font-size: 13px;
      color: #666;
    }

    :deep(.el-checkbox__input.is-checked .el-checkbox__inner) {
      background-color: #667eea;
      border-color: #667eea;
    }

    :deep(.el-checkbox__input.is-checked + .el-checkbox__label) {
      color: #667eea;
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
    height: 46px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 600;
    letter-spacing: 2px;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
    }

    &:active {
      transform: translateY(0);
    }

    &.is-loading {
      transform: none;
      box-shadow: none;
    }
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
