<template>
  <div class="dashboard">
    <el-row :gutter="20">
      <el-col :span="6" v-for="item in statisticsCards" :key="item.title">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon" :style="{ backgroundColor: item.color }">
              <el-icon :size="30" color="#fff">
                <component :is="item.icon" />
              </el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-title">{{ item.title }}</div>
              <div class="stat-value">{{ item.value }}</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :span="12">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>订单趋势</span>
            </div>
          </template>
          <div class="chart-container" style="height: 300px">
            <div class="chart-placeholder">图表区域 - 订单趋势</div>
          </div>
        </el-card>
      </el-col>

      <el-col :span="12">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>收入统计</span>
            </div>
          </template>
          <div class="chart-container" style="height: 300px">
            <div class="chart-placeholder">图表区域 - 收入统计</div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :span="24">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>最近订单</span>
            </div>
          </template>
          <el-table :data="recentOrders" style="width: 100%">
            <el-table-column prop="orderNo" label="订单号" />
            <el-table-column prop="userName" label="用户" />
            <el-table-column prop="companionName" label="陪玩师" />
            <el-table-column prop="amount" label="金额" />
            <el-table-column prop="status" label="状态">
              <template #default="{ row }">
                <el-tag :type="getStatusType(row.status)">
                  {{ row.status }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="createTime" label="创建时间" />
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getStatistics } from '@/api/dashboard'

const statisticsCards = ref([
  {
    title: '总用户数',
    value: '0',
    icon: 'User',
    color: '#409EFF'
  },
  {
    title: '陪玩师数',
    value: '0',
    icon: 'UserFilled',
    color: '#67C23A'
  },
  {
    title: '总订单数',
    value: '0',
    icon: 'ShoppingCart',
    color: '#E6A23C'
  },
  {
    title: '总收入',
    value: '0',
    icon: 'Wallet',
    color: '#F56C6C'
  }
])

const recentOrders = ref([])

const getStatusType = (status) => {
  const statusMap = {
    '待支付': 'warning',
    '进行中': 'primary',
    '已完成': 'success',
    '已取消': 'danger'
  }
  return statusMap[status] || 'info'
}

const loadData = async () => {
  try {
    const res = await getStatistics()
    if (res.code === 200) {
      // 更新统计数据
      statisticsCards.value[0].value = res.data.totalUsers || 0
      statisticsCards.value[1].value = res.data.totalCompanions || 0
      statisticsCards.value[2].value = res.data.totalOrders || 0
      statisticsCards.value[3].value = res.data.totalRevenue || 0

      recentOrders.value = res.data.recentOrders || []
    }
  } catch (error) {
    console.error('加载数据失败:', error)
  }
}

onMounted(() => {
  loadData()
})
</script>

<style scoped lang="scss">
.dashboard {
  .stat-card {
    .stat-content {
      display: flex;
      align-items: center;

      .stat-icon {
        width: 60px;
        height: 60px;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 20px;
      }

      .stat-info {
        flex: 1;

        .stat-title {
          font-size: 14px;
          color: #999;
          margin-bottom: 10px;
        }

        .stat-value {
          font-size: 24px;
          font-weight: bold;
          color: #333;
        }
      }
    }
  }

  .card-header {
    font-weight: bold;
  }

  .chart-container {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .chart-placeholder {
    color: #999;
    font-size: 14px;
  }
}
</style>
