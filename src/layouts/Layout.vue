<template>
  <el-container class="layout-container">
    <!-- 侧边栏 -->
    <el-aside :width="isCollapse ? '64px' : '200px'" class="sidebar">
      <div class="logo">
        <span class="logo-icon">🎮</span>
        <h2 v-if="!isCollapse">木子</h2>
      </div>
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :collapse-transition="false"
        router
      >
        <el-menu-item
          v-for="item in menuList"
          :key="item.path"
          :index="item.path"
        >
          <el-icon><component :is="item.meta.icon" /></el-icon>
          <template #title>{{ item.meta.title }}</template>
        </el-menu-item>
      </el-menu>
    </el-aside>

    <!-- 主内容区 -->
    <el-container>
      <!-- 顶部导航 -->
      <el-header class="header">
        <div class="header-left">
          <el-icon class="collapse-icon" @click="toggleCollapse">
            <Fold v-if="!isCollapse" />
            <Expand v-else />
          </el-icon>
          <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item v-if="currentRoute.meta.title">
              {{ currentRoute.meta.title }}
            </el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <div class="header-right">
          <el-dropdown @command="handleCommand">
            <span class="user-info">
              <el-avatar :size="32" :src="userStore.userInfo.avatar || defaultAvatar" />
              <span class="username">{{ userStore.userInfo.username || '管理员' }}</span>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="logout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>

      <!-- 内容区 -->
      <el-main class="main-content">
        <router-view v-slot="{ Component }">
          <transition name="fade-transform" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/store/user'
import { ElMessage } from 'element-plus'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const isCollapse = ref(false)
const defaultAvatar = 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'

// 菜单列表
const menuList = computed(() => {
  return router.getRoutes()
    .filter(route => route.path.startsWith('/') && route.meta && route.meta.icon && route.path !== '/login')
    .map(route => ({
      path: route.path,
      meta: route.meta
    }))
})

// 当前激活的菜单
const activeMenu = computed(() => {
  return route.path
})

// 当前路由
const currentRoute = computed(() => route)

// 切换侧边栏
const toggleCollapse = () => {
  isCollapse.value = !isCollapse.value
}

// 处理下拉菜单命令
const handleCommand = (command) => {
  if (command === 'logout') {
    userStore.logout()
    ElMessage.success('退出登录成功')
    router.push('/login')
  }
}
</script>

<style scoped lang="scss">
.layout-container {
  width: 100%;
  height: 100vh;
}

.sidebar {
  background: #232946;
  transition: width 0.3s;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;

  .logo {
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    color: #fff;
    flex-shrink: 0;

    .logo-icon {
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 8px;
      font-size: 18px;
    }

    h2 {
      font-size: 18px;
      font-weight: 600;
      letter-spacing: 2px;
      white-space: nowrap;
    }
  }

  .el-menu {
    --el-menu-bg-color: transparent;
    --el-menu-text-color: #a3aed0;
    --el-menu-active-color: #fff;
    --el-menu-hover-bg-color: rgba(255, 255, 255, 0.06);
    border-right: none;
    flex: 1;
    padding: 8px;
  }

  :deep(.el-menu-item) {
    height: 46px;
    margin-bottom: 4px;
    border-radius: 8px;
    transition: all 0.25s ease;

    &:hover {
      color: #fff;
    }

    &.is-active {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
    }
  }
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  padding: 0 20px;
  z-index: 1;

  .header-left {
    display: flex;
    align-items: center;

    .collapse-icon {
      font-size: 20px;
      cursor: pointer;
      margin-right: 20px;
      padding: 6px;
      border-radius: 6px;
      transition: all 0.25s ease;

      &:hover {
        color: #667eea;
        background: #f0f2fd;
      }
    }
  }

  .header-right {
    .user-info {
      display: flex;
      align-items: center;
      cursor: pointer;
      padding: 4px 10px;
      border-radius: 8px;
      transition: background 0.25s ease;

      &:hover {
        background: #f5f7fa;
      }

      .username {
        margin-left: 10px;
        font-size: 14px;
        color: #333;
      }
    }
  }
}

.main-content {
  background-color: #f5f7fa;
  padding: 20px;
  overflow-y: auto;
}

/* 页面切换动画 */
.fade-transform-enter-active,
.fade-transform-leave-active {
  transition: all 0.3s;
}

.fade-transform-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}

.fade-transform-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
