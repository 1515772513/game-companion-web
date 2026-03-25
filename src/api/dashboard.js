import request from '@/utils/request'

// 获取统计数据
export const getStats = () => {
  return request({
    url: '/dashboard/stats',
    method: 'get'
  })
}

// 获取收入趋势
export const getRevenueTrend = (params) => {
  return request({
    url: '/dashboard/revenue-trend',
    method: 'get',
    params
  })
}

// 获取订单分布
export const getOrderDistribution = () => {
  return request({
    url: '/dashboard/order-distribution',
    method: 'get'
  })
}

// 获取最新订单
export const getLatestOrders = (params) => {
  return request({
    url: '/dashboard/latest-orders',
    method: 'get',
    params
  })
}

// 获取快捷操作
export const getQuickActions = () => {
  return request({
    url: '/dashboard/quick-actions',
    method: 'get'
  })
}
