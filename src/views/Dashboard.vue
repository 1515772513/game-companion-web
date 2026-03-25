<template>
  <div class="dashboard">
    <!-- 统计卡片 -->
    <div class="stats-grid">
      <div
        v-for="item in statisticsCards"
        :key="item.title"
        class="stat-card"
        @click="handleCardClick(item)"
      >
        <div class="stat-header">
          <div class="stat-icon" :class="item.type">{{ item.icon }}</div>
        </div>
        <div class="stat-value">{{ item.value }}</div>
        <div class="stat-label">{{ item.title }}</div>
        <div class="stat-change" :class="item.changeClass">
          {{ item.change }}
        </div>
      </div>
    </div>

    <!-- 图表行 -->
    <div class="charts-row">
      <div class="chart-card">
        <div class="card-header">
          <div class="card-title">收入趋势</div>
          <div class="card-action">查看详情 ›</div>
        </div>
        <div class="chart-placeholder">
          📈 收入趋势图表（近30天）
        </div>
      </div>
      <div class="chart-card">
        <div class="card-header">
          <div class="card-title">订单状态分布</div>
          <div class="card-action">查看详情 ›</div>
        </div>
        <div class="chart-placeholder">
          📊 订单状态饼图
        </div>
      </div>
    </div>

    <!-- 快捷操作 -->
    <div class="quick-actions">
      <div class="card-header">
        <div class="card-title">快捷操作</div>
      </div>
      <div class="actions-grid">
        <div
          v-for="action in quickActions"
          :key="action.name"
          class="quick-action"
          @click="handleQuickAction(action)"
        >
          <div class="action-icon">{{ action.icon }}</div>
          <div class="action-name">{{ action.name }}</div>
        </div>
      </div>
    </div>

    <!-- 最新订单表格 -->
    <div class="data-table">
      <div class="table-header">
        <div class="table-title">最新订单</div>
        <div class="view-all" @click="router.push('/orders')">查看全部 ›</div>
      </div>
      <el-table :data="recentOrders" v-loading="loading" style="width: 100%">
        <el-table-column prop="orderNo" label="订单号" width="180" />
        <el-table-column prop="userName" label="用户" width="120" />
        <el-table-column prop="companionName" label="陪玩师" width="120" />
        <el-table-column prop="amount" label="金额" width="100">
          <template #default="{ row }">
            <div class="price">¥{{ row.amount }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)" class="status-badge">
              {{ row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="180" />
        <el-table-column label="操作" width="150">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="handleViewOrder(row)">
              查看
            </el-button>
            <el-button type="primary" link size="small" @click="handleEditOrder(row)">
              编辑
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getStats, getLatestOrders } from '@/api/dashboard'

const router = useRouter()
const loading = ref(false)

const statisticsCards = ref([
  {
    title: '总用户数',
    value: '12,580',
    icon: '👥',
    type: 'users',
    change: '↑ 12.5% 较上周',
    changeClass: 'positive'
  },
  {
    title: '订单总数',
    value: '3,268',
    icon: '📦',
    type: 'orders',
    change: '↑ 8.3% 较上周',
    changeClass: 'positive'
  },
  {
    title: '总收入',
    value: '¥58.6万',
    icon: '💰',
    type: 'revenue',
    change: '↑ 15.2% 较上周',
    changeClass: 'positive'
  },
  {
    title: '陪玩师数量',
    value: '856',
    icon: '🎮',
    type: 'companions',
    change: '↑ 5.8% 较上周',
    changeClass: 'positive'
  }
])

const quickActions = ref([
  { name: '认证审核', icon: '✅', route: '/companions' },
  { name: '退款处理', icon: '💰', route: '/orders' },
  { name: '发送通知', icon: '📢', route: '/messages' },
  { name: '黑名单管理', icon: '🚫', route: '/users' },
  { name: '内容审核', icon: '👁️', route: '/posts' },
  { name: '数据导出', icon: '📥', route: '/dashboard' }
])

const recentOrders = ref([])

const getStatusType = (status) => {
  const statusMap = {
    '进行中': 'primary',
    '待付款': 'warning',
    '已完成': 'success',
    '退款中': 'danger'
  }
  return statusMap[status] || 'info'
}

const loadData = async () => {
  try {
    loading.value = true

    // 并行加载统计数据和最新订单
    const [statsRes, ordersRes] = await Promise.all([
      getStats(),
      getLatestOrders({ limit: 5 })
    ])

    if (statsRes.code === 200) {
      // 更新统计卡片数据
      const data = statsRes.data
      statisticsCards.value[0].value = data.totalUsers || '12,580'
      statisticsCards.value[1].value = data.totalOrders || '3,268'
      statisticsCards.value[2].value = `¥${data.totalRevenue || '58.6'}万`
      statisticsCards.value[3].value = data.totalCompanions || '856'
    }

    if (ordersRes.code === 200) {
      recentOrders.value = ordersRes.data.list || []
    }
  } catch (error) {
    console.error('加载数据失败:', error)

    // 使用模拟数据作为降级
    recentOrders.value = [
      {
        orderNo: 'PW20260325001',
        userName: '游戏玩家小明',
        companionName: '小雨酱',
        amount: '62',
        status: '进行中',
        createTime: '2026-03-25 18:30'
      },
      {
        orderNo: 'PW20260325002',
        userName: '阿杰游戏',
        companionName: '萌萌小可爱',
        amount: '92',
        status: '待付款',
        createTime: '2026-03-25 17:15'
      },
      {
        orderNo: 'PW20260324001',
        userName: '大神带你飞',
        companionName: '阿杰游戏',
        amount: '47',
        status: '已完成',
        createTime: '2026-03-24 21:00'
      }
    ]
  } finally {
    loading.value = false
  }
}

const handleCardClick = (item) => {
  if (item.title.includes('用户')) {
    router.push('/users')
  } else if (item.title.includes('订单')) {
    router.push('/orders')
  } else if (item.title.includes('陪玩')) {
    router.push('/companions')
  }
}

const handleQuickAction = (action) => {
  if (action.route) {
    router.push(action.route)
  }
}

const handleViewOrder = (row) => {
  console.log('查看订单:', row.orderNo)
  // 可以跳转到订单详情页面
}

const handleEditOrder = (row) => {
  console.log('编辑订单:', row.orderNo)
  // 可以打开编辑对话框
}

onMounted(() => {
  loadData()
})
</script>

<style scoped lang="scss">
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.dashboard {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  background: #f5f7fa;
  padding: 32px;
  color: #333;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
}

.stat-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 16px rgba(0,0,0,0.1);
  }
}

.stat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;

  &.users {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  }

  &.orders {
    background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  }

  &.revenue {
    background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  }

  &.companions {
    background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
  }
}

.stat-value {
  font-size: 32px;
  font-weight: 700;
  color: #333;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 14px;
  color: #999;
}

.stat-change {
  font-size: 12px;
  margin-top: 8px;

  &.positive {
    color: #52c41a;
  }

  &.negative {
    color: #f5576c;
  }
}

.charts-row {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;
  margin-bottom: 32px;
}

.chart-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.card-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.card-action {
  font-size: 13px;
  color: #667eea;
  cursor: pointer;
  transition: color 0.3s ease;

  &:hover {
    color: #764ba2;
  }
}

.chart-placeholder {
  height: 300px;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  font-size: 14px;
}

.quick-actions {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  margin-bottom: 32px;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 16px;
}

.quick-action {
  padding: 16px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    border-color: #667eea;
    background: rgba(102, 126, 234, 0.05);
    transform: translateY(-2px);
  }
}

.action-icon {
  font-size: 32px;
  margin-bottom: 8px;
}

.action-name {
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.data-table {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.table-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.view-all {
  font-size: 13px;
  color: #667eea;
  cursor: pointer;
  transition: color 0.3s ease;

  &:hover {
    color: #764ba2;
  }
}

.price {
  font-size: 16px;
  font-weight: 600;
  color: #3b82f6;
}

:deep(.el-table) {
  font-size: 14px;
  th {
    background: #fafafa;
    color: #666;
    font-weight: 600;
  }
  td {
    border-bottom: 1px solid #f5f7fa;
  }
  &:hover {
    td {
      background: #fafafa !important;
    }
  }
}

.status-badge {
  font-size: 12px;
  padding: 6px 14px;
  border-radius: 12px;
  font-weight: 500;
}
</style>
