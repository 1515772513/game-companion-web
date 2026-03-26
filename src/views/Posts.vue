<template>
  <div class="posts-container">
    <!-- 页面标题 -->
    <div class="page-header">
      <h1 class="page-title">动态管理</h1>
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
          <div class="filter-label">关键词搜索</div>
          <el-input
            v-model="searchForm.keyword"
            placeholder="搜索动态内容、用户"
            clearable
            class="filter-input"
            @keyup.enter="handleSearch"
          />
        </div>
        <div class="filter-item">
          <div class="filter-label">游戏圈子</div>
          <el-select v-model="searchForm.circle" placeholder="全部圈子" clearable class="filter-select">
            <el-option label="全部圈子" value="" />
            <el-option label="王者荣耀" value="wzry" />
            <el-option label="和平精英" value="peace" />
            <el-option label="原神" value="yuanshen" />
            <el-option label="英雄联盟" value="lol" />
          </el-select>
        </div>
        <div class="filter-item">
          <div class="filter-label">发布时间</div>
          <el-select v-model="searchForm.publishTime" placeholder="全部时间" clearable class="filter-select">
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

    <!-- 数据表格 -->
    <div class="data-card">
      <el-table :data="tableData" v-loading="loading" style="width: 100%">
        <el-table-column label="动态内容" width="380">
          <template #default="{ row }">
            <div class="post-content">
              <div class="post-text">{{ row.content }}</div>
              <div v-if="row.images && row.images.length" class="post-images">
                <div
                  v-for="(img, index) in row.images.slice(0, 3)"
                  :key="index"
                  class="post-image"
                >
                  📷
                </div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="userName" label="发布用户" width="120" />
        <el-table-column prop="circleName" label="圈子" width="120" />
        <el-table-column label="互动数据" width="160">
          <template #default="{ row }">
            <div class="post-stats">
              ❤️ {{ row.likeCount }} · 💬 {{ row.commentCount }} · ⭐ {{ row.favoriteCount }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="publishTime" label="发布时间" width="180" />
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
              v-if="row.status === 1"
              type="primary"
              link
              size="small"
              @click="handleHide(row)"
            >
              隐藏
            </el-button>
            <el-button
              v-if="row.status === 0"
              type="primary"
              link
              size="small"
              @click="handleShow(row)"
            >
              恢复
            </el-button>
            <el-button
              type="danger"
              link
              size="small"
              @click="handleDelete(row)"
            >
              删除
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
    <el-dialog v-model="dialogVisible" title="动态详情" width="700px">
      <div class="post-detail">
        <div class="detail-user">
          <el-avatar :size="48" :src="currentPost.userAvatar">
            {{ currentPost.userName?.charAt(0) }}
          </el-avatar>
          <div class="user-info">
            <div class="user-name">{{ currentPost.userName }}</div>
            <div class="post-time">{{ currentPost.publishTime }}</div>
          </div>
        </div>
        <div class="detail-content">
          {{ currentPost.content }}
        </div>
        <div v-if="currentPost.images && currentPost.images.length" class="detail-images">
          <div
            v-for="(img, index) in currentPost.images"
            :key="index"
            class="detail-image"
          >
            📷 图片 {{ index + 1 }}
          </div>
        </div>
        <div class="detail-stats">
          <span>❤️ {{ currentPost.likeCount }} 点赞</span>
          <span>💬 {{ currentPost.commentCount }} 评论</span>
          <span>⭐ {{ currentPost.favoriteCount }} 收藏</span>
        </div>
        <div class="detail-actions">
          <el-button
            v-if="currentPost.status === 1"
            type="warning"
            @click="handleHide(currentPost)"
          >
            隐藏动态
          </el-button>
          <el-button
            v-if="currentPost.status === 0"
            type="success"
            @click="handleShow(currentPost)"
          >
            恢复动态
          </el-button>
          <el-button type="danger" @click="handleDelete(currentPost)">
            删除动态
          </el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { getPostList, updatePostVisibility, deletePost } from '@/api/posts'
import { ElMessage, ElMessageBox } from 'element-plus'

const loading = ref(false)
const tableData = ref([])
const total = ref(0)
const dialogVisible = ref(false)
const currentPost = ref({})

const tabs = ref([
  { label: '全部动态', value: '' },
  { label: '正常显示', value: '1' },
  { label: '已隐藏', value: '0' },
  { label: '已删除', value: '2' },
  { label: '待审核', value: '3' }
])

const searchForm = reactive({
  keyword: '',
  circle: '',
  publishTime: '',
  status: '',
  page: 1,
  pageSize: 10
})

const getStatusType = (status) => {
  const typeMap = {
    0: 'danger',
    1: 'success',
    2: 'info',
    3: 'warning'
  }
  return typeMap[status] || 'info'
}

const getStatusText = (status) => {
  const textMap = {
    0: '已隐藏',
    1: '正常',
    2: '已删除',
    3: '待审核'
  }
  return textMap[status] || '未知'
}

const loadData = async () => {
  try {
    loading.value = true
    const res = await getPostList(searchForm)
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
  currentPost.value = { ...row }
  dialogVisible.value = true
}

const handleHide = async (row) => {
  try {
    await ElMessageBox.confirm('确认要隐藏该动态吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    const res = await updatePostVisibility(row.postId, { audit_status: 3 })

    if (res.code === 200) {
      ElMessage.success('动态已隐藏')
      dialogVisible.value = false
      loadData()
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('操作失败:', error)
      ElMessage.error('操作失败')
    }
  }
}

const handleShow = async (row) => {
  try {
    await ElMessageBox.confirm('确认要恢复该动态吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    const res = await updatePostVisibility(row.postId, { audit_status: 1 })

    if (res.code === 200) {
      ElMessage.success('动态已恢复')
      dialogVisible.value = false
      loadData()
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('操作失败:', error)
      ElMessage.error('操作失败')
    }
  }
}

const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm('确认要删除该动态吗？此操作不可恢复！', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    const res = await deletePost(row.postId)

    if (res.code === 200) {
      ElMessage.success('动态已删除')
      dialogVisible.value = false
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

.posts-container {
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

.post-content {
  max-width: 380px;
}

.post-text {
  font-size: 14px;
  line-height: 1.6;
  margin-bottom: 8px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  color: #333;
}

.post-images {
  display: flex;
  gap: 6px;
}

.post-image {
  width: 40px;
  height: 40px;
  background: #f0f0f0;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
}

.post-stats {
  font-size: 12px;
  color: #999;
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

.post-detail {
  .detail-user {
    display: flex;
    gap: 12px;
    margin-bottom: 20px;
    padding-bottom: 16px;
    border-bottom: 1px solid #f0f0f0;
  }

  .user-info {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .user-name {
    font-weight: 500;
    color: #333;
    margin-bottom: 4px;
  }

  .post-time {
    font-size: 12px;
    color: #999;
  }

  .detail-content {
    font-size: 15px;
    line-height: 1.8;
    color: #333;
    margin-bottom: 16px;
    white-space: pre-wrap;
  }

  .detail-images {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 12px;
    margin-bottom: 20px;
  }

  .detail-image {
    height: 120px;
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

  .detail-stats {
    display: flex;
    gap: 24px;
    padding: 16px;
    background: #f9f9f9;
    border-radius: 8px;
    margin-bottom: 20px;
    font-size: 14px;
    color: #666;
  }

  .detail-actions {
    display: flex;
    gap: 12px;
    justify-content: flex-end;
    padding-top: 16px;
    border-top: 1px solid #f0f0f0;
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
