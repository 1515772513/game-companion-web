<template>
  <div class="companions-container">
    <!-- 页面标题 -->
    <div class="page-header">
      <h1 class="page-title">陪玩认证审核</h1>
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
        <span v-if="tab.count !== undefined" class="tab-badge">{{ tab.count }}</span>
      </div>
    </div>

    <!-- 筛选卡片 -->
    <div class="filter-card">
      <div class="filter-row">
        <div class="filter-item">
          <div class="filter-label">关键词搜索</div>
          <el-input
            v-model="searchForm.keyword"
            placeholder="搜索申请人姓名、昵称"
            clearable
            class="filter-input"
            @keyup.enter="handleSearch"
          />
        </div>
        <div class="filter-item">
          <div class="filter-label">擅长游戏</div>
          <el-select v-model="searchForm.gameType" placeholder="全部游戏" clearable class="filter-select">
            <el-option label="全部游戏" value="" />
            <el-option label="王者荣耀" value="wzry" />
            <el-option label="和平精英" value="peace" />
            <el-option label="原神" value="yuanshen" />
            <el-option label="英雄联盟" value="lol" />
          </el-select>
        </div>
        <div class="filter-item">
          <div class="filter-label">服务类型</div>
          <el-select v-model="searchForm.serviceType" placeholder="全部类型" clearable class="filter-select">
            <el-option label="全部类型" value="" />
            <el-option label="技术陪玩" value="tech" />
            <el-option label="娱乐陪玩" value="ent" />
            <el-option label="语音陪伴" value="voice" />
          </el-select>
        </div>
        <div class="filter-item">
          <div class="filter-label">申请时间</div>
          <el-select v-model="searchForm.applyTime" placeholder="全部时间" clearable class="filter-select">
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

    <!-- 申请列表 -->
    <div class="data-card">
      <el-table :data="tableData" v-loading="loading" style="width: 100%">
        <el-table-column label="申请人信息" width="260">
          <template #default="{ row }">
            <div class="applicant-info">
              <div class="applicant-avatar" :style="{ background: row.avatarColor }">
                {{ row.nickname?.charAt(0) }}
              </div>
              <div class="applicant-details">
                <div class="applicant-name">{{ row.nickname }}</div>
                <div class="applicant-id">ID: {{ row.applicantId }}</div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="realName" label="真实姓名" width="120" />
        <el-table-column label="擅长游戏" width="200">
          <template #default="{ row }">
            <div class="game-tags">
              <el-tag
                v-for="game in row.games"
                :key="game"
                size="small"
                class="game-tag"
              >
                {{ game }}
              </el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="serviceType" label="服务类型" width="120" />
        <el-table-column label="定价" width="120">
          <template #default="{ row }">
            <div class="price">¥{{ row.price }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="applyTime" label="申请时间" width="180" />
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)" class="status-badge">
              {{ getStatusText(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="220" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="handleView(row)">
              详情
            </el-button>
            <el-button
              v-if="row.status === 0"
              type="success"
              link
              size="small"
              @click="handleApprove(row)"
            >
              通过
            </el-button>
            <el-button
              v-if="row.status === 0"
              type="danger"
              link
              size="small"
              @click="handleShowReject(row)"
            >
              拒绝
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

    <!-- 审核详情面板 -->
    <div v-if="showDetail" class="detail-panel">
      <div class="panel-header">
        <h2 class="panel-title">认证申请详情</h2>
        <el-button type="text" @click="showDetail = false">
          ✕
        </el-button>
      </div>

      <div class="info-grid">
        <div class="info-item">
          <div class="info-label">申请人昵称</div>
          <div class="info-value">{{ currentApplicant.nickname }}</div>
        </div>
        <div class="info-item">
          <div class="info-label">真实姓名</div>
          <div class="info-value">{{ currentApplicant.realName }}</div>
        </div>
        <div class="info-item">
          <div class="info-label">身份证号</div>
          <div class="info-value">{{ currentApplicant.idCard }}</div>
        </div>
        <div class="info-item">
          <div class="info-label">联系电话</div>
          <div class="info-value">{{ currentApplicant.phone }}</div>
        </div>
        <div class="info-item">
          <div class="info-label">游戏段位</div>
          <div class="info-value">{{ currentApplicant.gameRank }}</div>
        </div>
        <div class="info-item">
          <div class="info-label">服务类型</div>
          <div class="info-value">{{ currentApplicant.serviceType }}</div>
        </div>
        <div class="info-item">
          <div class="info-label">定价</div>
          <div class="info-value">¥{{ currentApplicant.price }}</div>
        </div>
        <div class="info-item">
          <div class="info-label">申请时间</div>
          <div class="info-value">{{ currentApplicant.applyTime }}</div>
        </div>
      </div>

      <div class="detail-section">
        <div class="section-title">个人简介</div>
        <div class="intro-text">
          {{ currentApplicant.intro }}
        </div>
      </div>

      <div class="detail-section">
        <div class="section-title">身份证照片</div>
        <div class="id-card-preview">
          <div class="id-card">📷 身份证正面</div>
          <div class="id-card">📷 身份证反面</div>
        </div>
      </div>

      <div class="verify-actions">
        <div class="reject-reason">
          <div class="reject-label">拒绝原因（必填）</div>
          <el-input
            v-model="rejectReason"
            type="textarea"
            placeholder="请输入拒绝原因..."
            :rows="3"
          />
        </div>
        <div class="action-buttons">
          <el-button @click="showDetail = false">取消</el-button>
          <el-button type="danger" @click="handleReject">
            拒绝申请
          </el-button>
          <el-button type="success" @click="handleApprove(currentApplicant)">
            ✅ 通过认证
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { getCompanionApplications, auditCompanionApplication } from '@/api/companions'
import { ElMessage, ElMessageBox } from 'element-plus'

const loading = ref(false)
const tableData = ref([])
const total = ref(0)
const showDetail = ref(false)
const currentApplicant = ref({})
const rejectReason = ref('')

const tabs = ref([
  { label: '待审核', value: '0', count: 23 },
  { label: '已通过', value: '1', count: 856 },
  { label: '已拒绝', value: '2', count: 45 }
])

const searchForm = reactive({
  keyword: '',
  gameType: '',
  serviceType: '',
  applyTime: '',
  status: '0',
  page: 1,
  pageSize: 10
})

const getStatusType = (status) => {
  const typeMap = {
    0: 'warning',
    1: 'success',
    2: 'danger'
  }
  return typeMap[status] || 'info'
}

const getStatusText = (status) => {
  const textMap = {
    0: '待审核',
    1: '已通过',
    2: '已拒绝'
  }
  return textMap[status] || '未知'
}

const loadData = async () => {
  try {
    loading.value = true
    const res = await getCompanionApplications(searchForm)
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
  currentApplicant.value = { ...row }
  rejectReason.value = ''
  showDetail.value = true
}

const handleShowReject = (row) => {
  currentApplicant.value = { ...row }
  rejectReason.value = ''
  showDetail.value = true
}

const handleApprove = async (row) => {
  try {
    await ElMessageBox.confirm(
      '确认通过该申请人的认证？\n\n通过后，该用户将正式成为陪玩师，可以接单服务。',
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    const res = await auditCompanionApplication(row.applicantId, {
      audit_status: 1,
      audit_reason: ''
    })

    if (res.code === 200) {
      ElMessage.success('✅ 已通过认证！')
      showDetail.value = false
      loadData()
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('操作失败:', error)
      ElMessage.error('操作失败')
    }
  }
}

const handleReject = async () => {
  if (!rejectReason.value || rejectReason.value.trim() === '') {
    ElMessage.warning('请输入拒绝原因')
    return
  }

  try {
    await ElMessageBox.confirm(
      `确认拒绝该申请吗？\n\n拒绝原因: ${rejectReason.value}`,
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    const res = await auditCompanionApplication(currentApplicant.value.applicantId, {
      audit_status: 2,
      audit_reason: rejectReason.value
    })

    if (res.code === 200) {
      ElMessage.success('❌ 已拒绝申请')
      showDetail.value = false
      loadData()
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
})
</script>

<style scoped lang="scss">
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.companions-container {
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
  display: flex;
  align-items: center;
  gap: 6px;

  &:hover {
    background: #f5f7fa;
  }

  &.active {
    background: #667eea;
    color: white;
  }
}

.tab-badge {
  background: rgba(255,255,255,0.3);
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 12px;
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

.applicant-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.applicant-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 20px;
  font-weight: bold;
  flex-shrink: 0;
}

.applicant-details {
  flex: 1;
  min-width: 0;
}

.applicant-name {
  font-weight: 500;
  margin-bottom: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.applicant-id {
  font-size: 12px;
  color: #999;
}

.game-tags {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.game-tag {
  padding: 4px 10px;
  background: #f0f0f0;
  border-radius: 6px;
  font-size: 12px;
  color: #666;
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

.detail-panel {
  background: white;
  border-radius: 12px;
  padding: 24px;
  margin-top: 24px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f0f0f0;
}

.panel-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 24px;
}

.info-item {
  padding: 16px;
  background: #f9f9f9;
  border-radius: 8px;
}

.info-label {
  font-size: 12px;
  color: #999;
  margin-bottom: 6px;
}

.info-value {
  font-size: 15px;
  font-weight: 500;
  color: #333;
}

.detail-section {
  margin-top: 24px;
}

.section-title {
  font-size: 15px;
  font-weight: 600;
  color: #333;
  margin-bottom: 16px;
}

.intro-text {
  padding: 16px;
  background: #f9f9f9;
  border-radius: 8px;
  font-size: 14px;
  line-height: 1.8;
  color: #666;
}

.id-card-preview {
  display: flex;
  gap: 16px;
}

.id-card {
  width: 200px;
  height: 130px;
  background: #f0f0f0;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #e0e0e0;
  }
}

.verify-actions {
  display: flex;
  gap: 16px;
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid #f0f0f0;
  align-items: flex-end;
}

.reject-reason {
  flex: 1;
}

.reject-label {
  font-size: 13px;
  color: #666;
  margin-bottom: 8px;
}

.action-buttons {
  display: flex;
  gap: 12px;
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
