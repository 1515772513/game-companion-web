<template>
  <div class="withdrawals-container">
    <el-card>
      <!-- 搜索表单 -->
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="陪玩师名称">
          <el-input v-model="searchForm.companionName" placeholder="请输入陪玩师名称" clearable />
        </el-form-item>
        <el-form-item label="审核状态">
          <el-select v-model="searchForm.auditStatus" placeholder="请选择审核状态" clearable>
            <el-option label="待审核" value="0" />
            <el-option label="已通过" value="1" />
            <el-option label="已拒绝" value="2" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>

      <!-- 数据表格 -->
      <el-table :data="tableData" v-loading="loading" border style="width: 100%">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="companionName" label="陪玩师" width="120" />
        <el-table-column prop="amount" label="提现金额(元)" width="130" />
        <el-table-column prop="bankName" label="开户银行" width="150" />
        <el-table-column prop="bankCard" label="银行卡号" width="180" />
        <el-table-column prop="accountName" label="开户人" width="120" />
        <el-table-column prop="auditStatus" label="审核状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getAuditStatusType(row.auditStatus)">
              {{ getAuditStatusText(row.auditStatus) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="申请时间" width="180" />
        <el-table-column label="操作" fixed="right" width="200">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="handleView(row)">查看</el-button>
            <el-button
              v-if="row.auditStatus === 0"
              type="success"
              size="small"
              @click="handleAudit(row, 1)"
            >
              通过
            </el-button>
            <el-button
              v-if="row.auditStatus === 0"
              type="danger"
              size="small"
              @click="handleAudit(row, 2)"
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
        style="margin-top: 20px; justify-content: flex-end"
      />
    </el-card>

    <!-- 查看详情对话框 -->
    <el-dialog v-model="dialogVisible" title="提现详情" width="700px">
      <el-descriptions :column="2" border>
        <el-descriptions-item label="提现ID">{{ withdrawalInfo.id }}</el-descriptions-item>
        <el-descriptions-item label="陪玩师">{{ withdrawalInfo.companionName }}</el-descriptions-item>
        <el-descriptions-item label="提现金额">
          <span style="color: #f56c6c; font-weight: bold">¥{{ withdrawalInfo.amount }}</span>
        </el-descriptions-item>
        <el-descriptions-item label="审核状态">
          <el-tag :type="getAuditStatusType(withdrawalInfo.auditStatus)">
            {{ getAuditStatusText(withdrawalInfo.auditStatus) }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="开户银行">{{ withdrawalInfo.bankName }}</el-descriptions-item>
        <el-descriptions-item label="银行卡号">{{ withdrawalInfo.bankCard }}</el-descriptions-item>
        <el-descriptions-item label="开户人">{{ withdrawalInfo.accountName }}</el-descriptions-item>
        <el-descriptions-item label="申请时间" :span="2">
          {{ withdrawalInfo.createTime }}
        </el-descriptions-item>
        <el-descriptions-item v-if="withdrawalInfo.auditStatus !== 0" label="审核时间" :span="2">
          {{ withdrawalInfo.auditTime }}
        </el-descriptions-item>
        <el-descriptions-item v-if="withdrawalInfo.auditStatus === 2" label="拒绝原因" :span="2">
          {{ withdrawalInfo.rejectReason }}
        </el-descriptions-item>
      </el-descriptions>
    </el-dialog>

    <!-- 审核对话框 -->
    <el-dialog v-model="auditDialogVisible" title="提现审核" width="500px">
      <el-form :model="auditForm" label-width="100px">
        <el-form-item label="审核结果">
          <el-radio-group v-model="auditForm.status">
            <el-radio :label="1">通过</el-radio>
            <el-radio :label="2">拒绝</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="auditForm.status === 2" label="拒绝原因">
          <el-input
            v-model="auditForm.rejectReason"
            type="textarea"
            :rows="4"
            placeholder="请输入拒绝原因"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="auditDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmAudit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { getWithdrawalList, auditWithdrawal } from '@/api/withdrawals'
import { ElMessage, ElMessageBox } from 'element-plus'

const loading = ref(false)
const tableData = ref([])
const total = ref(0)
const dialogVisible = ref(false)
const auditDialogVisible = ref(false)
const withdrawalInfo = ref({})
const currentWithdrawalId = ref(null)

const searchForm = reactive({
  companionName: '',
  auditStatus: '',
  page: 1,
  pageSize: 10
})

const auditForm = reactive({
  status: 1,
  rejectReason: ''
})

const getAuditStatusType = (status) => {
  const statusMap = {
    0: 'warning',
    1: 'success',
    2: 'danger'
  }
  return statusMap[status] || 'info'
}

const getAuditStatusText = (status) => {
  const statusMap = {
    0: '待审核',
    1: '已通过',
    2: '已拒绝'
  }
  return statusMap[status] || '未知'
}

const loadData = async () => {
  try {
    loading.value = true
    const res = await getWithdrawalList(searchForm)
    if (res.code === 200) {
      tableData.value = res.data.list || []
      total.value = res.data.total || 0
    }
  } catch (error) {
    console.error('加载数据失败:', error)
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  searchForm.page = 1
  loadData()
}

const handleReset = () => {
  searchForm.companionName = ''
  searchForm.auditStatus = ''
  searchForm.page = 1
  loadData()
}

const handleView = (row) => {
  withdrawalInfo.value = { ...row }
  dialogVisible.value = true
}

const handleAudit = (row, status) => {
  currentWithdrawalId.value = row.id
  auditForm.status = status
  auditForm.rejectReason = ''
  auditDialogVisible.value = true
}

const confirmAudit = async () => {
  try {
    if (auditForm.status === 2 && !auditForm.rejectReason) {
      ElMessage.warning('请输入拒绝原因')
      return
    }

    const res = await auditWithdrawal(currentWithdrawalId.value, auditForm)

    if (res.code === 200) {
      ElMessage.success('审核成功')
      auditDialogVisible.value = false
      loadData()
    }
  } catch (error) {
    console.error('审核失败:', error)
  }
}

onMounted(() => {
  loadData()
})
</script>

<style scoped lang="scss">
.withdrawals-container {
  .search-form {
    margin-bottom: 20px;
  }
}
</style>
