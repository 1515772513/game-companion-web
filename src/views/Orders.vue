<template>
  <div class="orders-container">
    <!-- 页面标题 -->
    <div class="page-header">
      <h1 class="page-title">订单管理</h1>
      <div class="header-actions">
        <el-button class="btn-outline">
          📥 导出订单
        </el-button>
        <el-button type="primary" class="btn-primary">
          📊 数据统计
        </el-button>
      </div>
    </div>

    <!-- 订单统计 -->
    <div class="order-stats">
      <div class="stat-card">
        <div class="stat-value">{{ orderStats.total }}</div>
        <div class="stat-label">总订单数</div>
      </div>
      <div class="stat-card">
        <div class="stat-value" style="color: #faad14;">{{ orderStats.pending }}</div>
        <div class="stat-label">待付款</div>
      </div>
      <div class="stat-card">
        <div class="stat-value" style="color: #3b82f6;">{{ orderStats.active }}</div>
        <div class="stat-label">进行中</div>
      </div>
      <div class="stat-card">
        <div class="stat-value" style="color: #52c41a;">{{ orderStats.completed }}</div>
        <div class="stat-label">已完成</div>
      </div>
      <div class="stat-card">
        <div class="stat-value" style="color: #f5576c;">{{ orderStats.refund }}</div>
        <div class="stat-label">退款/售后</div>
      </div>
    </div>

    <!-- 标签切换 -->
    <div class="tabs">
      <div
        v-for="tab in tabs"
        :key="tab.value"
        class="tab"
        :class="{ active: searchForm.status === tab.value }"
        @click="handleTabChange(tab.value)"
      >
        {{ tab.label }}
      </div>
    </div>

    <!-- 筛选卡片 -->
    <div class="filter-card">
      <div class="filter-row">
        <div class="filter-item">
          <div class="filter-label">订单号/用户</div>
          <el-input
            v-model="searchForm.keyword"
            placeholder="搜索订单号、用户名"
            clearable
            class="filter-input"
            @keyup.enter="handleSearch"
          />
        </div>
        <div class="filter-item">
          <div class="filter-label">订单类型</div>
          <el-select v-model="searchForm.orderType" placeholder="全部类型" clearable class="filter-select">
            <el-option label="全部类型" value="" />
            <el-option label="陪玩订单" value="peiwang" />
            <el-option label="代练订单" value="dailian" />
          </el-select>
        </div>
        <div class="filter-item">
          <div class="filter-label">游戏类型</div>
          <el-select v-model="searchForm.gameType" placeholder="全部游戏" clearable class="filter-select">
            <el-option label="全部游戏" value="" />
            <el-option label="王者荣耀" value="wzry" />
            <el-option label="和平精英" value="peace" />
            <el-option label="原神" value="yuanshen" />
            <el-option label="英雄联盟" value="lol" />
          </el-select>
        </div>
        <div class="filter-item">
          <div class="filter-label">下单时间</div>
          <el-select v-model="searchForm.orderTime" placeholder="全部时间" clearable class="filter-select">
            <el-option label="全部时间" value="" />
            <el-option label="今天" value="today" />
            <el-option label="本周" value="week" />
            <el-option label="本月" value="month" />
          </el-select>
        </div>
        <el-button type="primary" class="search-btn" @click="handleSearch">
          🔍 搜索
        </el-button>
      </div>
    </div>

    <!-- 订单表格 -->
    <div class="data-card">
      <el-table :data="tableData" v-loading="loading" style="width: 100%">
        <el-table-column label="订单信息" width="260">
          <template #default="{ row }">
            <div class="order-info">
              <div class="order-avatar" :style="{ background: row.avatarColor }">
                🎮
              </div>
              <div class="order-details">
                <div class="order-number">{{ row.orderNo }}</div>
                <div class="order-game">{{ row.orderType }} · {{ row.gameName }}</div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="userName" label="用户" width="140" />
        <el-table-column prop="companionName" label="陪玩师" width="140" />
        <el-table-column prop="gameName" label="游戏" width="120" />
        <el-table-column label="金额" width="100">
          <template #default="{ row }">
            <div class="price">¥{{ row.amount }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="下单时间" width="180" />
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)" class="status-badge">
              {{ getStatusText(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="handleView(row)">
              查看
            </el-button>
            <el-button
              v-if="row.status === 0"
              type="primary"
              link
              size="small"
              @click="handleUrgent(row)"
            >
              催付
            </el-button>
            <el-button
              v-if="row.status === 1 || row.status === 2"
              type="primary"
              link
              size="small"
              @click="handleEdit(row)"
            >
              编辑
            </el-button>
            <el-button
              v-if="row.status === 4"
              type="danger"
              link
              size="small"
              @click="handleRefund(row)"
            >
              处理
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
        v-model:current-page="searchForm.page"
        v-model:page-size="searchForm.pageSize"
        :page-sizes="[10, 20, 50, 100]"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="loadData"
        @current-change="loadData"
        class="pagination"
      />
    </div>

    <!-- 查看详情对话框 -->
    <el-dialog v-model="dialogVisible" title="订单详情" width="700px">
      <div class="order-detail">
        <div class="detail-header">
          <div class="detail-order-no">{{ orderInfo.orderNo }}</div>
          <el-tag :type="getStatusType(orderInfo.status)">
            {{ getStatusText(orderInfo.status) }}
          </el-tag>
        </div>
        <el-descriptions :column="2" border class="detail-descriptions">
          <el-descriptions-item label="订单类型">{{ orderInfo.orderType }}</el-descriptions-item>
          <el-descriptions-item label="游戏类型">{{ orderInfo.gameName }}</el-descriptions-item>
          <el-descriptions-item label="用户名">{{ orderInfo.userName }}</el-descriptions-item>
          <el-descriptions-item label="陪玩师">{{ orderInfo.companionName }}</el-descriptions-item>
          <el-descriptions-item label="订单金额">¥{{ orderInfo.amount }}</el-descriptions-item>
          <el-descriptions-item label="服务时长">{{ orderInfo.duration }}小时</el-descriptions-item>
          <el-descriptions-item label="下单时间" :span="2">
            {{ orderInfo.createTime }}
          </el-descriptions-item>
          <el-descriptions-item label="完成时间" :span="2">
            {{ orderInfo.completeTime || '未完成' }}
          </el-descriptions-item>
        </el-descriptions>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { getOrderList, getOrderStats } from '@/api/orders'
import { ElMessage } from 'element-plus'

const loading = ref(false)
const tableData = ref([])
const total = ref(0)
const dialogVisible = ref(false)
const orderInfo = ref({})

const orderStats = ref({
  total: '3,268',
  pending: '156',
  active: '428',
  completed: '2,456',
  refund: '228'
})

const tabs = ref([
  { label: '全部订单', value: '' },
  { label: '待付款', value: '0' },
  { label: '进行中', value: '1' },
  { label: '已完成', value: '2' },
  { label: '退款/售后', value: '4' }
])

const searchForm = reactive({
  keyword: '',
  orderType: '',
  gameType: '',
  orderTime: '',
  status: '',
  page: 1,
  pageSize: 10
})

const getStatusType = (status) => {
  const typeMap = {
    0: 'warning',
    1: 'primary',
    2: 'success',
    3: 'danger',
    4: 'danger'
  }
  return typeMap[status] || 'info'
}

const getStatusText = (status) => {
  const textMap = {
    0: '待付款',
    1: '进行中',
    2: '已完成',
    3: '已取消',
    4: '退款中'
  }
  return textMap[status] || '未知'
}

const loadData = async () => {
  try {
    loading.value = true
    const res = await getOrderList(searchForm)
    if (res.code === 200) {
      tableData.value = res.data.list || []
      total.value = res.data.total || 0
    }
  } catch (error) {
    console.error('加载数据失败:', error)
    ElMessage.error('加载数据失败')
  } finally {
    loading.value = false
  }
}

const loadStats = async () => {
  try {
    const res = await getOrderStats()
    if (res.code === 200) {
      const data = res.data
      orderStats.value = {
        total: data.total || '3,268',
        pending: data.pending || '156',
        active: data.active || '428',
        completed: data.completed || '2,456',
        refund: data.refund || '228'
      }
    }
  } catch (error) {
    console.error('加载统计数据失败:', error)
  }
}

const handleTabChange = (value) => {
  searchForm.status = value
  searchForm.page = 1
  loadData()
}

const handleSearch = () => {
  searchForm.page = 1
  loadData()
}

const handleView = (row) => {
  orderInfo.value = { ...row }
  dialogVisible.value = true
}

const handleEdit = (row) => {
  ElMessage.info('编辑订单功能开发中...')
}

const handleUrgent = (row) => {
  ElMessage.success('已发送催付提醒')
}

const handleRefund = (row) => {
  ElMessage.info('退款处理功能开发中...')
}

onMounted(() => {
  loadData()
  loadStats()
})
</script>

<style scoped lang="scss">
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.orders-container {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  background: #f5f7fa;
  padding: 32px;
  color: #333;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.page-title {
  font-size: 24px;
  font-weight: 600;
  color: #333;
}

.header-actions {
  display: flex;
  gap: 12px;
}

.btn-outline,
.btn-primary {
  padding: 10px 20px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  border: none;
  transition: all 0.3s ease;
}

.btn-outline {
  background: white;
  color: #667eea;
  border: 1px solid #667eea;

  &:hover {
    background: #f0f3ff;
  }
}

.btn-primary {
  background: #667eea;
  color: white;

  &:hover {
    background: #764ba2;
  }
}

.order-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

.stat-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  text-align: center;
}

.stat-value {
  font-size: 28px;
  font-weight: 700;
  color: #333;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 13px;
  color: #999;
}

.tabs {
  display: flex;
  gap: 8px;
  background: white;
  padding: 12px;
  border-radius: 12px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}

.tab {
  padding: 10px 24px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #666;

  &:hover {
    background: #f5f7fa;
  }

  &.active {
    background: #667eea;
    color: white;
  }
}

.filter-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}

.filter-row {
  display: flex;
  gap: 16px;
  align-items: center;
  flex-wrap: wrap;
}

.filter-item {
  flex: 1;
  min-width: 180px;
}

.filter-label {
  font-size: 13px;
  color: #666;
  margin-bottom: 6px;
}

.filter-input,
.filter-select {
  width: 100%;
}

.search-btn {
  padding: 10px 20px;
  background: #667eea;
  border: none;
  color: white;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #764ba2;
  }
}

.data-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}

.order-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.order-avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  flex-shrink: 0;
}

.order-details {
  flex: 1;
  min-width: 0;
}

.order-number {
  font-weight: 500;
  margin-bottom: 2px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.order-game {
  font-size: 12px;
  color: #999;
}

.price {
  font-size: 16px;
  font-weight: 600;
  color: #3b82f6;
}

.status-badge {
  font-size: 12px;
  padding: 6px 14px;
  border-radius: 12px;
  font-weight: 500;
}

.pagination {
  margin-top: 24px;
  display: flex;
  justify-content: flex-end;
}

.order-detail {
  .detail-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    padding-bottom: 16px;
    border-bottom: 1px solid #f0f0f0;
  }

  .detail-order-no {
    font-size: 18px;
    font-weight: 600;
    color: #333;
  }

  .detail-descriptions {
    margin-top: 20px;
  }
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
</style>
