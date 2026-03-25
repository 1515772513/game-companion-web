<template>
  <div class="settings-container">
    <!-- 页面标题 -->
    <div class="page-header">
      <h1 class="page-title">系统设置</h1>
    </div>

    <div class="settings-layout">
      <!-- 左侧菜单 -->
      <div class="settings-sidebar">
        <div
          v-for="item in menuItems"
          :key="item.value"
          class="menu-item"
          :class="{ active: activeTab === item.value }"
          @click="handleMenuChange(item.value)"
        >
          <span class="menu-icon">{{ item.icon }}</span>
          <span class="menu-label">{{ item.label }}</span>
        </div>
      </div>

      <!-- 右侧内容 -->
      <div class="settings-content">
        <!-- 基本设置 -->
        <div v-show="activeTab === 'basic'" class="setting-section">
          <div class="section-title">基本设置</div>
          <div class="setting-card">
            <el-form :model="basicForm" label-width="120px">
              <el-form-item label="平台名称">
                <el-input v-model="basicForm.platformName" placeholder="请输入平台名称" />
              </el-form-item>
              <el-form-item label="平台Logo">
                <el-upload
                  class="logo-uploader"
                  action="/api/upload"
                  :show-file-list="false"
                >
                  <img v-if="basicForm.platformLogo" :src="basicForm.platformLogo" class="logo-preview" />
                  <div v-else class="upload-placeholder">
                    <span class="upload-icon">📷</span>
                    <span>上传Logo</span>
                  </div>
                </el-upload>
              </el-form-item>
              <el-form-item label="客服电话">
                <el-input v-model="basicForm.servicePhone" placeholder="请输入客服电话" />
              </el-form-item>
              <el-form-item label="客服邮箱">
                <el-input v-model="basicForm.serviceEmail" placeholder="请输入客服邮箱" />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="handleSaveBasic">保存设置</el-button>
              </el-form-item>
            </el-form>
          </div>
        </div>

        <!-- 支付设置 -->
        <div v-show="activeTab === 'payment'" class="setting-section">
          <div class="section-title">支付设置</div>
          <div class="setting-card">
            <el-form :model="paymentForm" label-width="150px">
              <el-form-item label="平台抽成比例(%)">
                <el-input-number
                  v-model="paymentForm.commissionRate"
                  :min="0"
                  :max="100"
                  :precision="2"
                />
                <span class="form-tip">陪玩订单中平台抽取的佣金比例</span>
              </el-form-item>
              <el-form-item label="最低提现金额(元)">
                <el-input-number v-model="paymentForm.minWithdrawAmount" :min="0" :precision="2" />
                <span class="form-tip">陪玩师提现的最低金额限制</span>
              </el-form-item>
              <el-form-item label="提现手续费率(%)">
                <el-input-number
                  v-model="paymentForm.withdrawFeeRate"
                  :min="0"
                  :max="100"
                  :precision="2"
                />
                <span class="form-tip">陪玩师提现时收取的手续费比例</span>
              </el-form-item>
              <el-form-item label="VIP会员价格(元/月)">
                <el-input-number v-model="paymentForm.vipPrice" :min="0" :precision="2" />
              </el-form-item>
              <el-form-item label="SVIP会员价格(元/月)">
                <el-input-number v-model="paymentForm.svipPrice" :min="0" :precision="2" />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="handleSavePayment">保存设置</el-button>
              </el-form-item>
            </el-form>
          </div>
        </div>

        <!-- 协议设置 -->
        <div v-show="activeTab === 'agreement'" class="setting-section">
          <div class="section-title">协议设置</div>
          <div class="setting-card">
            <el-form :model="agreementForm" label-width="120px">
              <el-form-item label="用户协议">
                <el-input
                  v-model="agreementForm.userAgreement"
                  type="textarea"
                  :rows="8"
                  placeholder="请输入用户协议内容"
                />
              </el-form-item>
              <el-form-item label="隐私政策">
                <el-input
                  v-model="agreementForm.privacyPolicy"
                  type="textarea"
                  :rows="8"
                  placeholder="请输入隐私政策内容"
                />
              </el-form-item>
              <el-form-item label="关于我们">
                <el-input
                  v-model="agreementForm.aboutUs"
                  type="textarea"
                  :rows="6"
                  placeholder="请输入关于我们内容"
                />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="handleSaveAgreement">保存设置</el-button>
              </el-form-item>
            </el-form>
          </div>
        </div>

        <!-- 安全设置 -->
        <div v-show="activeTab === 'security'" class="setting-section">
          <div class="section-title">安全设置</div>
          <div class="setting-card">
            <el-form :model="securityForm" label-width="180px">
              <el-form-item label="启用验证码">
                <el-switch v-model="securityForm.enableCaptcha" />
                <span class="form-tip">登录时是否需要验证码验证</span>
              </el-form-item>
              <el-form-item label="登录失败限制次数">
                <el-input-number v-model="securityForm.maxLoginAttempts" :min="3" :max="10" />
                <span class="form-tip">连续登录失败达到此次数后将锁定账号</span>
              </el-form-item>
              <el-form-item label="账号锁定时长(分钟)">
                <el-input-number v-model="securityForm.lockDuration" :min="5" :max="120" />
                <span class="form-tip">账号被锁定后的解锁时间</span>
              </el-form-item>
              <el-form-item label="启用操作日志">
                <el-switch v-model="securityForm.enableOperationLog" />
                <span class="form-tip">是否记录管理员的操作日志</span>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="handleSaveSecurity">保存设置</el-button>
              </el-form-item>
            </el-form>
          </div>
        </div>

        <!-- 系统日志 -->
        <div v-show="activeTab === 'logs'" class="setting-section">
          <div class="section-title">
            系统日志
            <el-button type="primary" size="small" style="margin-left: auto;" @click="loadLogs">
              刷新
            </el-button>
          </div>
          <div class="setting-card">
            <el-table :data="logs" v-loading="loadingLogs" style="width: 100%">
              <el-table-column prop="operator" label="操作人" width="120" />
              <el-table-column prop="action" label="操作内容" width="200" />
              <el-table-column prop="ip" label="IP地址" width="140" />
              <el-table-column prop="createTime" label="操作时间" width="180" />
              <el-table-column prop="status" label="状态" width="100">
                <template #default="{ row }">
                  <el-tag :type="row.status === 'success' ? 'success' : 'danger'" size="small">
                    {{ row.status === 'success' ? '成功' : '失败' }}
                  </el-tag>
                </template>
              </el-table-column>
            </el-table>
            <el-pagination
              v-model:current-page="logsPage"
              :page-size="10"
              :total="logsTotal"
              layout="prev, pager, next"
              @current-change="loadLogs"
              class="pagination"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { getSettings, updateSettings, getOperationLogs } from '@/api/settings'
import { ElMessage } from 'element-plus'

const activeTab = ref('basic')
const loadingLogs = ref(false)
const logsPage = ref(1)
const logsTotal = ref(0)
const logs = ref([])

const menuItems = ref([
  { label: '基本设置', value: 'basic', icon: '⚙️' },
  { label: '支付设置', value: 'payment', icon: '💰' },
  { label: '协议设置', value: 'agreement', icon: '📄' },
  { label: '安全设置', value: 'security', icon: '🔒' },
  { label: '系统日志', value: 'logs', icon: '📝' }
])

const basicForm = reactive({
  platformName: '',
  platformLogo: '',
  servicePhone: '',
  serviceEmail: ''
})

const paymentForm = reactive({
  commissionRate: 0,
  minWithdrawAmount: 0,
  withdrawFeeRate: 0,
  vipPrice: 0,
  svipPrice: 0
})

const agreementForm = reactive({
  userAgreement: '',
  privacyPolicy: '',
  aboutUs: ''
})

const securityForm = reactive({
  enableCaptcha: true,
  maxLoginAttempts: 5,
  lockDuration: 30,
  enableOperationLog: true
})

const handleMenuChange = (value) => {
  activeTab.value = value
  if (value === 'logs') {
    loadLogs()
  }
}

const loadData = async () => {
  try {
    const res = await getSettings()
    if (res.code === 200) {
      const data = res.data
      Object.assign(basicForm, data.basic || {})
      Object.assign(paymentForm, data.payment || {})
      Object.assign(agreementForm, data.agreement || {})
      Object.assign(securityForm, data.security || {})
    }
  } catch (error) {
    console.error('加载配置失败:', error)
  }
}

const loadLogs = async () => {
  try {
    loadingLogs.value = true
    const res = await getOperationLogs({ page: logsPage.value, pageSize: 10 })
    if (res.code === 200) {
      logs.value = res.data.list || []
      logsTotal.value = res.data.total || 0
    }
  } catch (error) {
    console.error('加载日志失败:', error)
  } finally {
    loadingLogs.value = false
  }
}

const handleSaveBasic = async () => {
  try {
    const res = await updateSettings({ type: 'basic', data: basicForm })
    if (res.code === 200) {
      ElMessage.success('保存成功')
    }
  } catch (error) {
    ElMessage.error('保存失败')
  }
}

const handleSavePayment = async () => {
  try {
    const res = await updateSettings({ type: 'payment', data: paymentForm })
    if (res.code === 200) {
      ElMessage.success('保存成功')
    }
  } catch (error) {
    ElMessage.error('保存失败')
  }
}

const handleSaveAgreement = async () => {
  try {
    const res = await updateSettings({ type: 'agreement', data: agreementForm })
    if (res.code === 200) {
      ElMessage.success('保存成功')
    }
  } catch (error) {
    ElMessage.error('保存失败')
  }
}

const handleSaveSecurity = async () => {
  try {
    const res = await updateSettings({ type: 'security', data: securityForm })
    if (res.code === 200) {
      ElMessage.success('保存成功')
    }
  } catch (error) {
    ElMessage.error('保存失败')
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

.settings-container {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  background: #f5f7fa;
  padding: 32px;
  color: #333;
}

.page-header {
  margin-bottom: 24px;
}

.page-title {
  font-size: 24px;
  font-weight: 600;
  color: #333;
}

.settings-layout {
  display: flex;
  gap: 24px;
  align-items: flex-start;
}

.settings-sidebar {
  width: 200px;
  background: white;
  border-radius: 12px;
  padding: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  flex-shrink: 0;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 4px;
  font-size: 14px;
  color: #666;

  &:hover {
    background: #f5f7fa;
  }

  &.active {
    background: #667eea;
    color: white;
  }

  .menu-icon {
    font-size: 18px;
    width: 20px;
    text-align: center;
  }

  .menu-label {
    flex: 1;
  }
}

.settings-content {
  flex: 1;
  min-width: 0;
}

.setting-section {
  margin-bottom: 24px;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
}

.setting-card {
  background: white;
  border-radius: 12px;
  padding: 32px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);

  :deep(.el-form-item) {
    margin-bottom: 24px;
  }

  :deep(.el-form-item__label) {
    font-weight: 500;
    color: #333;
  }
}

.logo-uploader {
  .logo-preview {
    width: 120px;
    height: 120px;
    border-radius: 8px;
    object-fit: cover;
  }

  :deep(.el-upload) {
    border: 2px dashed #e0e0e0;
    border-radius: 8px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: all 0.3s;
    width: 120px;
    height: 120px;
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover {
      border-color: #667eea;
    }
  }

  .upload-placeholder {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    color: #999;

    .upload-icon {
      font-size: 32px;
    }
  }
}

.form-tip {
  margin-left: 12px;
  font-size: 12px;
  color: #999;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
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
