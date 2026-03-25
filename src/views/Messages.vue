<template>
  <div class="messages-container">
    <!-- 页面标题 -->
    <div class="page-header">
      <h1 class="page-title">消息推送</h1>
      <el-button type="primary" @click="showSendDialog = true">
        ➕ 发送新消息
      </el-button>
    </div>

    <!-- 统计卡片 -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-value">{{ messageStats.total }}</div>
        <div class="stat-label">总发送数</div>
      </div>
      <div class="stat-card">
        <div class="stat-value" style="color: #52c41a;">{{ messageStats.success }}</div>
        <div class="stat-label">成功送达</div>
      </div>
      <div class="stat-card">
        <div class="stat-value" style="color: #f5576c;">{{ messageStats.failed }}</div>
        <div class="stat-label">发送失败</div>
      </div>
      <div class="stat-card">
        <div class="stat-value" style="color: #3b82f6;">{{ messageStats.rate }}%</div>
        <div class="stat-label">送达率</div>
      </div>
    </div>

    <!-- 标签切换 -->
    <div class="tabs">
      <div
        v-for="tab in tabs"
        :key="tab.value"
        class="tab"
        :class="{ active: searchForm.type === tab.value }"
        @click="handleTabChange(tab.value)"
      >
        {{ tab.label }}
      </div>
    </div>

    <!-- 筛选卡片 -->
    <div class="filter-card">
      <div class="filter-row">
        <div class="filter-item">
          <div class="filter-label">关键词搜索</div>
          <el-input
            v-model="searchForm.keyword"
            placeholder="搜索消息标题、内容"
            clearable
            class="filter-input"
            @keyup.enter="handleSearch"
          />
        </div>
        <div class="filter-item">
          <div class="filter-label">推送类型</div>
          <el-select v-model="searchForm.msgType" placeholder="全部类型" clearable class="filter-select">
            <el-option label="全部类型" value="" />
            <el-option label="系统通知" value="system" />
            <el-option label="活动通知" value="activity" />
            <el-option label="订单提醒" value="order" />
            <el-option label="营销推送" value="marketing" />
          </el-select>
        </div>
        <div class="filter-item">
          <div class="filter-label">发送时间</div>
          <el-select v-model="searchForm.sendTime" placeholder="全部时间" clearable class="filter-select">
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

    <!-- 消息列表 -->
    <div class="data-card">
      <el-table :data="tableData" v-loading="loading" style="width: 100%">
        <el-table-column prop="title" label="消息标题" width="280" />
        <el-table-column label="消息类型" width="120">
          <template #default="{ row }">
            <el-tag :type="getTypeColor(row.msgType)" size="small">
              {{ getTypeText(row.msgType) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="目标用户" width="120">
          <template #default="{ row }">
            {{ row.targetType === 'all' ? '全部用户' : `指定用户(${row.targetCount})` }}
          </template>
        </el-table-column>
        <el-table-column label="发送情况" width="180">
          <template #default="{ row }">
            <div class="send-stats">
              <span class="success">成功: {{ row.successCount }}</span>
              <span class="failed">失败: {{ row.failedCount }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="sendTime" label="发送时间" width="180" />
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 'success' ? 'success' : 'danger'" size="small">
              {{ row.status === 'success' ? '已完成' : '发送中' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="handleView(row)">
              查看
            </el-button>
            <el-button
              v-if="row.status === 'success'"
              type="primary"
              link
              size="small"
              @click="handleResend(row)"
            >
              重发
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

    <!-- 发送消息对话框 -->
    <el-dialog v-model="showSendDialog" title="发送新消息" width="600px">
      <el-form :model="sendForm" label-width="100px">
        <el-form-item label="消息标题" required>
          <el-input v-model="sendForm.title" placeholder="请输入消息标题" />
        </el-form-item>
        <el-form-item label="消息类型" required>
          <el-select v-model="sendForm.msgType" placeholder="请选择消息类型" style="width: 100%;">
            <el-option label="系统通知" value="system" />
            <el-option label="活动通知" value="activity" />
            <el-option label="订单提醒" value="order" />
            <el-option label="营销推送" value="marketing" />
          </el-select>
        </el-form-item>
        <el-form-item label="目标用户" required>
          <el-radio-group v-model="sendForm.targetType">
            <el-radio value="all">全部用户</el-radio>
            <el-radio value="specific">指定用户</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="消息内容" required>
          <el-input
            v-model="sendForm.content"
            type="textarea"
            :rows="5"
            placeholder="请输入消息内容"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showSendDialog = false">取消</el-button>
        <el-button type="primary" @click="handleSend" :loading="sending">
          立即发送
        </el-button>
      </template>
    </el-dialog>

    <!-- 查看详情对话框 -->
    <el-dialog v-model="dialogVisible" title="消息详情" width="600px">
      <div class="message-detail">
        <div class="detail-item">
          <span class="detail-label">消息标题:</span>
          <span class="detail-value">{{ currentMessage.title }}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">消息类型:</span>
          <el-tag :type="getTypeColor(currentMessage.msgType)" size="small">
            {{ getTypeText(currentMessage.msgType) }}
          </el-tag>
        </div>
        <div class="detail-item">
          <span class="detail-label">目标用户:</span>
          <span class="detail-value">
            {{ currentMessage.targetType === 'all' ? '全部用户' : `指定用户(${currentMessage.targetCount})` }}
          </span>
        </div>
        <div class="detail-item">
          <span class="detail-label">发送情况:</span>
          <span class="detail-value">
            成功: {{ currentMessage.successCount }} | 失败: {{ currentMessage.failedCount }}
          </span>
        </div>
        <div class="detail-item">
          <span class="detail-label">发送时间:</span>
          <span class="detail-value">{{ currentMessage.sendTime }}</span>
        </div>
        <el-divider />
        <div class="detail-content">
          <div class="detail-label">消息内容:</div>
          <div class="content-text">{{ currentMessage.content }}</div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { getMessageList, getMessageStats, sendMessage, resendMessage } from '@/api/messages'
import { ElMessage } from 'element-plus'

const loading = ref(false)
const tableData = ref([])
const total = ref(0)
const dialogVisible = ref(false)
const showSendDialog = ref(false)
const sending = ref(false)
const currentMessage = ref({})

const messageStats = ref({
  total: '12,580',
  success: '11,856',
  failed: '724',
  rate: '94.2'
})

const tabs = ref([
  { label: '全部消息', value: '' },
  { label: '系统通知', value: 'system' },
  { label: '活动通知', value: 'activity' },
  { label: '订单提醒', value: 'order' },
  { label: '营销推送', value: 'marketing' }
])

const searchForm = reactive({
  keyword: '',
  msgType: '',
  sendTime: '',
  type: '',
  page: 1,
  pageSize: 10
})

const sendForm = reactive({
  title: '',
  msgType: '',
  targetType: 'all',
  content: ''
})

const getTypeColor = (type) => {
  const colorMap = {
    system: '',
    activity: 'success',
    order: 'warning',
    marketing: 'danger'
  }
  return colorMap[type] || ''
}

const getTypeText = (type) => {
  const textMap = {
    system: '系统通知',
    activity: '活动通知',
    order: '订单提醒',
    marketing: '营销推送'
  }
  return textMap[type] || '未知'
}

const loadData = async () => {
  try {
    loading.value = true
    const res = await getMessageList(searchForm)
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
    const res = await getMessageStats()
    if (res.code === 200) {
      const data = res.data
      messageStats.value = {
        total: data.total || '12,580',
        success: data.success || '11,856',
        failed: data.failed || '724',
        rate: data.rate || '94.2'
      }
    }
  } catch (error) {
    console.error('加载统计数据失败:', error)
  }
}

const handleTabChange = (value) => {
  searchForm.type = value
  searchForm.page = 1
  loadData()
}

const handleSearch = () => {
  searchForm.page = 1
  loadData()
}

const handleView = (row) => {
  currentMessage.value = { ...row }
  dialogVisible.value = true
}

const handleSend = async () => {
  if (!sendForm.title || !sendForm.msgType || !sendForm.content) {
    ElMessage.warning('请填写完整的消息信息')
    return
  }

  try {
    sending.value = true
    const res = await sendMessage(sendForm)
    if (res.code === 200) {
      ElMessage.success('消息发送成功')
      showSendDialog.value = false
      // 重置表单
      sendForm.title = ''
      sendForm.msgType = ''
      sendForm.targetType = 'all'
      sendForm.content = ''
      loadData()
      loadStats()
    }
  } catch (error) {
    console.error('发送失败:', error)
    ElMessage.error('发送失败')
  } finally {
    sending.value = false
  }
}

const handleResend = async (row) => {
  try {
    await ElMessageBox.confirm('确认要重新发送该消息吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    const res = await resendMessage(row.id)
    if (res.code === 200) {
      ElMessage.success('消息已重新发送')
      loadData()
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('重发失败:', error)
      ElMessage.error('重发失败')
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

.messages-container {
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

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 20px;
  margin-bottom: 24px;
}

.stat-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  text-align: center;
}

.stat-value {
  font-size: 32px;
  font-weight: 700;
  color: #333;
  margin-bottom: 8px;
}

.stat-label {
  font-size: 14px;
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

.send-stats {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 12px;

  .success {
    color: #52c41a;
  }

  .failed {
    color: #f5576c;
  }
}

.pagination {
  margin-top: 24px;
  display: flex;
  justify-content: flex-end;
}

.message-detail {
  .detail-item {
    display: flex;
    align-items: center;
    margin-bottom: 16px;

    .detail-label {
      font-size: 14px;
      color: #666;
      width: 100px;
      flex-shrink: 0;
    }

    .detail-value {
      font-size: 14px;
      color: #333;
    }
  }

  .detail-content {
    margin-top: 20px;

    .detail-label {
      font-size: 14px;
      color: #666;
      margin-bottom: 12px;
    }

    .content-text {
      padding: 16px;
      background: #f9f9f9;
      border-radius: 8px;
      font-size: 14px;
      line-height: 1.8;
      color: #333;
      white-space: pre-wrap;
    }
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
