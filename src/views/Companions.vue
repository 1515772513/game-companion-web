<template>
  <div class="companions-container">
    <el-card>
      <!-- 搜索表单 -->
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="陪玩师名称">
          <el-input v-model="searchForm.name" placeholder="请输入陪玩师名称" clearable />
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
        <el-table-column prop="name" label="陪玩师名称" width="120" />
        <el-table-column prop="avatar" label="头像" width="100">
          <template #default="{ row }">
            <el-avatar :size="50" :src="row.avatar" />
          </template>
        </el-table-column>
        <el-table-column prop="phone" label="手机号" width="130" />
        <el-table-column prop="gameType" label="游戏类型" width="100" />
        <el-table-column prop="price" label="单价(元/小时)" width="130" />
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
    <el-dialog v-model="dialogVisible" title="陪玩师详情" width="700px">
      <el-descriptions :column="2" border>
        <el-descriptions-item label="陪玩师ID">{{ companionInfo.id }}</el-descriptions-item>
        <el-descriptions-item label="陪玩师名称">{{ companionInfo.name }}</el-descriptions-item>
        <el-descriptions-item label="头像" :span="2">
          <el-avatar :size="80" :src="companionInfo.avatar" />
        </el-descriptions-item>
        <el-descriptions-item label="手机号">{{ companionInfo.phone }}</el-descriptions-item>
        <el-descriptions-item label="游戏类型">{{ companionInfo.gameType }}</el-descriptions-item>
        <el-descriptions-item label="单价">¥{{ companionInfo.price }}/小时</el-descriptions-item>
        <el-descriptions-item label="审核状态">
          <el-tag :type="getAuditStatusType(companionInfo.auditStatus)">
            {{ getAuditStatusText(companionInfo.auditStatus) }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="个人简介" :span="2">
          {{ companionInfo.intro }}
        </el-descriptions-item>
        <el-descriptions-item label="申请时间" :span="2">
          {{ companionInfo.createTime }}
        </el-descriptions-item>
      </el-descriptions>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { getCompanionList, auditCompanion } from '@/api/companions'
import { ElMessage, ElMessageBox } from 'element-plus'

const loading = ref(false)
const tableData = ref([])
const total = ref(0)
const dialogVisible = ref(false)
const companionInfo = ref({})

const searchForm = reactive({
  name: '',
  auditStatus: '',
  page: 1,
  pageSize: 10
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
    const res = await getCompanionList(searchForm)
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
  searchForm.name = ''
  searchForm.auditStatus = ''
  searchForm.page = 1
  loadData()
}

const handleView = (row) => {
  companionInfo.value = { ...row }
  dialogVisible.value = true
}

const handleAudit = async (row, status) => {
  try {
    const action = status === 1 ? '通过' : '拒绝'
    await ElMessageBox.confirm(`确定要${action}该陪玩师的申请吗?`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    const res = await auditCompanion(row.id, { status })

    if (res.code === 200) {
      ElMessage.success(`${action}成功`)
      loadData()
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('操作失败:', error)
    }
  }
}

onMounted(() => {
  loadData()
})
</script>

<style scoped lang="scss">
.companions-container {
  .search-form {
    margin-bottom: 20px;
  }
}
</style>
