<template>
  <div class="users-container">
    <!-- 统计卡片 -->
    <div class="stats-grid">
      <div
        v-for="item in statisticsCards"
        :key="item.title"
        class="stat-card"
        @click="handleCardClick(item)"
      >
        <div class="stat-header">
          <div class="stat-icon" :class="'total'">{{ item.icon }}</div>
        </div>
        <div class="stat-value">{{ item.value }}</div>
        <div class="stat-label">{{ item.title }}</div>
        <div class="stat-change" :class="'positive'">
          {{ item.change }}
        </div>
      </div>
    </div>

    <!-- 筛选卡片 -->
    <div class="filter-card">
      <div class="filter-row">
        <div class="filter-item">
          <div class="filter-label">关键词搜索</div>
          <el-input
            v-model="searchForm.keyword"
            placeholder="搜索用户昵称、手机号"
            clearable
            class="filter-input"
            @keyup.enter="handleSearch"
          />
        </div>
        <div class="filter-item">
          <div class="filter-label">账号状态</div>
          <el-select v-model="searchForm.status" placeholder="全部状态" clearable class="filter-select">
            <el-option label="全部状态" value="" />
            <el-option label="正常" value="1" />
            <el-option label="已禁用" value="0" />
          </el-select>
        </div>
        <div class="filter-item">
          <div class="filter-label">会员等级</div>
          <el-select v-model="searchForm.vipLevel" placeholder="全部等级" clearable class="filter-select">
            <el-option label="全部等级" value="" />
            <el-option label="普通会员" value="0" />
            <el-option label="VIP会员" value="1" />
            <el-option label="SVIP会员" value="2" />
          </el-select>
        </div>
        <div class="filter-item">
          <div class="filter-label">注册时间</div>
          <el-date-picker
            v-model="searchForm.registerTime"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="选择注册时间"
            class="filter-select"
          />
        </div>
        
        <div class="filter-item">
          <div class="filter-label opacity-0">-- </div>
          <el-button type="primary" class="search-btn" @click="handleSearch">
            🔍 搜索
          </el-button>
        </div>
      </div>
    </div>

    <!-- 数据表格 -->
    <div class="data-card">
      <el-table :data="tableData" v-loading="loading" style="width: 100%">
        <el-table-column label="用户信息" width="280">
          <template #default="{ row }">
            <div class="user-info">
              <el-avatar :size="48" :src="row.avatar" class="user-avatar">
                {{ row.nickname?.charAt(0) }}
              </el-avatar>
              <div class="user-details">
                <div class="user-name">{{ row.nickname || row.username }}</div>
                <div class="user-phone">{{ row.phone || '未绑定手机' }}</div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="id" label="用户ID" width="120" />
        <el-table-column label="账户余额" width="120">
          <template #default="{ row }">
            <div class="price">¥{{ row.balance || '0.00' }}</div>
          </template>
        </el-table-column>
        <el-table-column label="积分" width="100">
          <template #default="{ row }">
            <div class="points">⭐ {{ row.points || '0' }}</div>
          </template>
        </el-table-column>
        <el-table-column label="会员等级" width="120">
          <template #default="{ row }">
            <el-tag :type="getVipType(row.vipLevel)" class="vip-badge">
              {{ getVipLevelText(row.vipLevel) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="注册时间" width="180" />
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'danger'" class="status-badge">
              {{ row.status === 1 ? '正常' : '已禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="handleView(row)">
              查看
            </el-button>
            <el-button type="primary" link size="small" @click="handleEdit(row)">
              编辑
            </el-button>
            <el-button
              :type="row.status === 1 ? 'danger' : 'success'"
              link
              size="small"
              @click="handleToggleStatus(row)"
            >
              {{ row.status === 1 ? '禁用' : '启用' }}
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
    <el-dialog v-model="dialogVisible" title="用户详情" width="700px">
      <div class="user-detail">
        <div class="detail-header">
          <el-avatar :size="80" :src="userInfo.avatar" class="detail-avatar">
            {{ userInfo.nickname?.charAt(0) }}
          </el-avatar>
          <div class="detail-info">
            <div class="detail-name">{{ userInfo.nickname || userInfo.username }}</div>
            <div class="detail-id">ID: {{ userInfo.userId }}</div>
          </div>
        </div>
        <el-descriptions :column="2" border class="detail-descriptions">
          <el-descriptions-item label="手机号">{{ userInfo.phone || '未绑定' }}</el-descriptions-item>
          <el-descriptions-item label="会员等级">
            <el-tag :type="getVipType(userInfo.vipLevel)">
              {{ getVipLevelText(userInfo.vipLevel) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="账户余额">¥{{ userInfo.balance || '0.00' }}</el-descriptions-item>
          <el-descriptions-item label="积分">⭐ {{ userInfo.points || '0' }}</el-descriptions-item>
          <el-descriptions-item label="订单数">{{ userInfo.orderCount || '0' }}</el-descriptions-item>
          <el-descriptions-item label="状态">
            <el-tag :type="userInfo.status === 1 ? 'success' : 'danger'">
              {{ userInfo.status === 1 ? '正常' : '已禁用' }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="注册时间" :span="2">
            {{ userInfo.registerTime }}
          </el-descriptions-item>
        </el-descriptions>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getUserList, getUserStats, updateUserStatus } from '@/api/users'
import { ElMessage, ElMessageBox } from 'element-plus'

const router = useRouter()
const loading = ref(false)
const tableData = ref([])
const total = ref(0)
const dialogVisible = ref(false)
const userInfo = ref({})

const statisticsCards = ref([])

const searchForm = reactive({
  keyword: '',
  status: '',
  vipLevel: '',
  registerTime: '',
  page: 1,
  pageSize: 10
})

const getVipType = (level) => {
  const typeMap = {
    0: '',
    1: 'warning',
    2: 'danger'
  }
  return typeMap[level] || ''
}

const getVipLevelText = (level) => {
  const textMap = {
    0: '普通会员',
    1: 'VIP会员',
    2: 'SVIP会员'
  }
  return textMap[level] || '普通会员'
}

const loadData = async () => {
  try {
    loading.value = true
    const res = await getUserList(searchForm)
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
    const res = await getUserStats()
    if (res.code === 200) {
      const data = res.data
      statisticsCards.value = data || []
    }
  } catch (error) {
    console.error('加载统计数据失败:', error)
  }
}

const handleSearch = () => {
  searchForm.page = 1
  loadData()
}

const handleCardClick = (item) => {
  // 点击卡片可以跳转到对应的筛选状态
  if (item.title.includes('VIP')) {
    searchForm.vipLevel = '1'
    handleSearch()
  } else if (item.title.includes('禁用')) {
    searchForm.status = '0'
    handleSearch()
  } else if (item.title.includes('活跃')) {
    searchForm.status = '1'
    handleSearch()
  }
}

const handleView = (row) => {
  userInfo.value = { ...row }
  dialogVisible.value = true
}

const handleEdit = (row) => {
  router.push(`/users/edit/${row.id}`)
}

const handleToggleStatus = async (row) => {
  try {
    const action = row.status === 1 ? '禁用' : '启用'
    await ElMessageBox.confirm(
      `确定要${action}该用户吗？${action === '禁用' ? '禁用后用户将无法登录和使用系统功能。' : ''}`,
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    const newStatus = row.status === 1 ? 0 : 1
    const res = await updateUserStatus(row.userId, { status: newStatus })

    if (res.code === 200) {
      ElMessage.success(`${action}成功`)
      loadData()
      loadStats()
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('操作失败:', error)
      ElMessage.error('操作失败')
    }
  }
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

.users-container {
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
  padding-bottom: 2px;

  &.total {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  }

  &.active {
    background: linear-gradient(135deg, #52c41a 0%, #73d13d 100%);
  }

  &.vip {
    background: linear-gradient(135deg, #faad14 0%, #ffc53d 100%);
  }

  &.banned {
    background: linear-gradient(135deg, #f5576c 0%, #f093fb 100%);
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

.opacity-0 {
  opacity: 0;
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

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-avatar {
  flex-shrink: 0;
}

.user-details {
  flex: 1;
  min-width: 0;
}

.user-name {
  font-weight: 500;
  margin-bottom: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.user-phone {
  font-size: 12px;
  color: #999;
}

.price {
  font-size: 16px;
  font-weight: 600;
  color: #3b82f6;
}

.points {
  font-size: 14px;
  color: #faad14;
}

.vip-badge,
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

.user-detail {
  .detail-header {
    display: flex;
    align-items: center;
    gap: 20px;
    margin-bottom: 24px;
    padding-bottom: 20px;
    border-bottom: 1px solid #f0f0f0;
  }

  .detail-avatar {
    flex-shrink: 0;
  }

  .detail-info {
    flex: 1;
  }

  .detail-name {
    font-size: 20px;
    font-weight: 600;
    color: #333;
    margin-bottom: 4px;
  }

  .detail-id {
    font-size: 14px;
    color: #999;
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
