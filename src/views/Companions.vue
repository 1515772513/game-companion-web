<template>
  <div class="companions-container">
    <!-- 页面标题 -->
    <div class="page-header">
      <h1 class="page-title">陪玩认证审核</h1>
    </div>

    <!-- 标签切换 -->
    <div class="tabs">
      <!-- 全部选项 -->
      <div class="tab" :class="{ active: searchForm.status === '' }" @click="handleTabChange('')">全部</div>
      <div
        v-for="tab in tabs"
        :key="tab.dictValue"
        class="tab"
        :class="{ active: searchForm.status === tab.dictValue }"
        @click="handleTabChange(tab.dictValue)"
      >
        {{ tab.dictLabel }}
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
            <el-option
              v-for="item in serviceTypeOptions"
              :key="item.dictValue"
              :label="item.dictLabel"
              :value="item.dictValue"
            />
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
        <div class="filter-item">
          <div class="filter-label opacity-0">-</div>
          <el-button type="primary" class="search-btn" @click="handleSearch">
            🔍 搜索
          </el-button>
        </div>
      </div>
    </div>

    <!-- 申请列表 -->
    <div class="data-card">
      <el-table :data="tableData" v-loading="loading" style="width: 100%">
        <el-table-column label="申请人信息" min-width="260">
          <template #default="{ row }">
            <div class="applicant-info">
              <div class="applicant-avatar" :style="{ background: row.avatarColor }">
                {{ row.nickname?.charAt(0) }}
              </div>
              <div class="applicant-details">
                <div class="applicant-name">{{ row.nickname }}</div>
                <div class="applicant-id">ID: {{ row.id }}</div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="realName" label="真实姓名" min-width="120" />
        
        <!-- 擅长游戏 → 点击tag弹出详情 -->
        <el-table-column label="擅长游戏" min-width="200">
          <template #default="{ row }">
            <div class="game-tags">
              <el-tag
                v-for="game in row.games"
                :key="game.gameId"
                size="small"
                class="game-tag"
                @click="openGameDetail(game)"
              >
                {{ game.gameName }} | {{ game.gameLevel }}
              </el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="申请时间" min-width="180" />
        <el-table-column label="状态" min-width="110">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)" class="status-badge">
              {{ row.statusName }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="handleView(row)">
              详情
            </el-button>
            <!-- <el-button
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
            </el-button> -->
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

      <div class="panel-body">
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
            <template v-for="game in currentApplicant.games">
              <div class="info-value">{{ game.gameName }} | {{ game.gameLevel }}</div>
            </template>
          </div>
          <div class="info-item">
            <div class="info-label">服务类型</div>
            <div class="info-value">{{ currentApplicant.serviceType }}</div>
          </div>
          <div class="info-item">
            <div class="info-label">定价</div>
            <div class="price">¥{{ currentApplicant.pricePerGame }}/场</div>
            <div class="price">¥{{ currentApplicant.pricePerHour }}/小时</div>
          </div>
          <div class="info-item">
            <div class="info-label">申请时间</div>
            <div class="info-value">{{ currentApplicant.createdAt }}</div>
          </div>
        </div>

        <div class="detail-section">
          <div class="section-title">个人简介</div>
          <div class="tags">
            <el-tag v-for="tag in currentApplicant.tags" :key="tag" class="tag-item">
              {{ tag }}
            </el-tag>
          </div>
          <div class="intro-text">
            {{ currentApplicant.bio }}
          </div>
        </div>

        <div class="detail-section">
          <div class="section-title">身份证照片</div>
          <div class="id-card-preview">
            <div class="id-card">
              <el-image :src="currentApplicant.idCardFrontUrl" alt="身份证正面" :preview-src-list="[currentApplicant.idCardFrontUrl]" />
            </div>
            <div class="id-card">
              <el-image :src="currentApplicant.idCardBackUrl" alt="身份证反面" :preview-src-list="[currentApplicant.idCardBackUrl]" />
            </div>
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

    <!-- ======================
         游戏详情弹框（放在 template 内部最底部）
         ====================== -->
    <el-dialog
      v-model="gameDetailVisible"
      title="游戏服务详情"
      width="450px"
      :close-on-click-modal="false"
    >
      <div style="padding: 10px 0;">
        <div style="margin-bottom: 15px;">
          <div style="font-size:12px;color:#999;">游戏名称</div>
          <div style="font-size:15px;font-weight:bold;margin-top:5px;">{{ currentGame.gameName }}</div>
        </div>

        <div style="margin-bottom: 15px;">
          <div style="font-size:12px;color:#999;">游戏段位</div>
          <div style="font-size:15px;margin-top:5px;">{{ currentGame.gameLevel }}</div>
        </div>

        <div style="margin-bottom: 15px;">
          <div style="font-size:12px;color:#999;">服务类型</div>
          <div style="font-size:15px;margin-top:5px;color:#667eea;">
            {{ currentGame.serviceTypeName }}
          </div>
        </div>

        <div style="display: flex;gap:30px;margin-top:20px;">
          <div>
            <div style="font-size:12px;color:#999;">单局价格</div>
            <div style="font-size:16px;font-weight:bold;color:#f56c6c;margin-top:5px;">
              ¥{{ currentGame.pricePerGame }} /局
            </div>
          </div>
          <!-- <div>
            <div style="font-size:12px;color:#999;">小时价格</div>
            <div style="font-size:16px;font-weight:bold;color:#f56c6c;margin-top:5px;">
              ¥{{ currentGame.pricePerHour }} /小时
            </div>
          </div> -->
        </div>
      </div>

      <template #footer>
        <el-button @click="gameDetailVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { getCompanionApplications, auditCompanionApplication, getCompanionStats, getCompanionDetail } from '@/api/companions'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useDictStore } from '@/store/dict'

const loading = ref(false)
const tableData = ref([])
const total = ref(0)
const showDetail = ref(false)
const currentApplicant = ref({})
const rejectReason = ref('')
const dictStore = useDictStore()

// 游戏详情弹框
const gameDetailVisible = ref(false)
const currentGame = ref({})

const tabs = ref([])
const serviceTypeOptions = ref([])

const searchForm = reactive({
  keyword: '',
  gameType: '',
  serviceType: '',
  applyTime: '',
  status: '',
  page: 1,
  pageSize: 10
})

// 状态标签样式
const getStatusType = (status) => {
  const typeMap = { 0: 'warning', 1: 'success', 2: 'danger' }
  return typeMap[status] || 'info'
}

// 打开游戏详情弹框
const openGameDetail = (game) => {
  currentGame.value = { ...game }
  gameDetailVisible.value = true
}

// 加载列表数据
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

// 加载统计数量
const loadStatsCount = async () => {
  try {
    const res = await getCompanionStats()
    if (res.code === 200 && res.data) {
      for (const stat of res.data) {
        const tab = tabs.value.find(item => item.dictValue === String(stat.status))
        if (tab) {
          tab.count = stat.count
        }
      }
    }
  } catch (err) {
    console.error('加载统计数量失败', err)
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
  getDetail(row.id)
  rejectReason.value = ''
  showDetail.value = true
}

// 获取详情数据
const getDetail = async (companionId) => {
  try {
    const res = await getCompanionDetail(companionId)
    if (res.code === 200) {
      currentApplicant.value = { ...res.data }
    }
  } catch (error) {
    console.error('获取详情失败:', error)
    ElMessage.error('获取详情失败')
  }
}

const handleApprove = async (row) => {
  try {
    await ElMessageBox.confirm(
      '确认通过该申请人的认证？\n\n通过后，该用户将正式成为陪玩师，可以接单服务。',
      '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }
    )
    const res = await auditCompanionApplication(row.applicantId, { audit_status: 1, audit_reason: '' })
    if (res.code === 200) {
      ElMessage.success('✅ 已通过认证！')
      showDetail.value = false
      loadData()
      loadStatsCount()
    }
  } catch (error) {
    if (error !== 'cancel') ElMessage.error('操作失败')
  }
}

const handleReject = async () => {
  if (!rejectReason.value.trim()) {
    return ElMessage.warning('请输入拒绝原因')
  }
  try {
    await ElMessageBox.confirm(`确认拒绝该申请吗？\n\n拒绝原因: ${rejectReason.value}`, '提示', {
      confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'
    })
    const res = await auditCompanionApplication(currentApplicant.value.applicantId, {
      audit_status: 2, audit_reason: rejectReason.value
    })
    if (res.code === 200) {
      ElMessage.success('❌ 已拒绝申请')
      showDetail.value = false
      loadData()
      loadStatsCount()
    }
  } catch (error) {
    if (error !== 'cancel') ElMessage.error('操作失败')
  }
}

onMounted(async () => {
  serviceTypeOptions.value = await dictStore.getServiceType()
  tabs.value = await dictStore.getReviewStatus()
  await loadStatsCount()
  loadData()
})
</script>

<style scoped lang="scss">
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
  cursor: pointer;

  &:hover {
    background: #e1e1e1;
  }
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
  position: fixed;
  z-index: 2000;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 64px;
  margin-bottom: 24px;
  padding: 24px;
  border-bottom: 1px solid #f0f0f0;
}

.panel-body {
  max-height: calc(100vh - 64px - 24px);
  overflow-y: auto;
  padding: 0 24px 16px;
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

  .tags {
    margin: 12px 0;
    .el-tag {
      margin-left: 8px;

      &:first-child {
        margin-left: 0;
      }
    }
  }
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
  flex-wrap: wrap;
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
  width: 100%;
  display: flex;
  gap: 12px;
  padding: 8px 15px;
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
}
</style>