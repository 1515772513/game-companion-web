import request from '@/utils/request'

/**
 * 获取数据概览统计
 * @returns {Promise}
 */
export const getStats = () => {
  return request({
    url: '/admin/dashboard/stats',
    method: 'get'
  })
}

/**
 * 获取收入趋势
 * @param {Object} params - 查询参数
 * @param {String} params.time_range - 时间范围：today-今天，week-本周，month-本月，year-本年，custom-自定义
 * @param {String} params.start_date - 自定义开始日期
 * @param {String} params.end_date - 自定义结束日期
 * @returns {Promise}
 */
export const getRevenueTrend = (params) => {
  return request({
    url: '/admin/dashboard/revenue-trend',
    method: 'get',
    params
  })
}

/**
 * 获取订单分布
 * @param {Object} params - 查询参数
 * @param {String} params.time_range - 时间范围
 * @returns {Promise}
 */
export const getOrderDistribution = (params) => {
  return request({
    url: '/admin/dashboard/order-distribution',
    method: 'get',
    params
  })
}

/**
 * 获取最新订单
 * @param {Object} params - 查询参数
 * @param {Number} params.limit - 数量限制
 * @returns {Promise}
 */
export const getLatestOrders = (params) => {
  return request({
    url: '/admin/dashboard/latest-orders',
    method: 'get',
    params
  })
}

/**
 * 获取用户增长趋势
 * @param {Object} params - 查询参数
 * @param {String} params.time_range - 时间范围
 * @returns {Promise}
 */
export const getUserGrowth = (params) => {
  return request({
    url: '/admin/dashboard/user-growth',
    method: 'get',
    params
  })
}

/**
 * 获取陪玩师统计
 * @returns {Promise}
 */
export const getCompanionStats = () => {
  return request({
    url: '/admin/dashboard/companion-stats',
    method: 'get'
  })
}

/**
 * 获取游戏热度排行
 * @param {Object} params - 查询参数
 * @param {Number} params.limit - 数量限制
 * @returns {Promise}
 */
export const getGameRanking = (params) => {
  return request({
    url: '/admin/dashboard/game-ranking',
    method: 'get',
    params
  })
}

/**
 * 获取待处理事项
 * @returns {Promise}
 */
export const getPendingTasks = () => {
  return request({
    url: '/admin/dashboard/pending-tasks',
    method: 'get'
  })
}

/**
 * 获取实时数据
 * @returns {Promise}
 */
export const getRealtimeData = () => {
  return request({
    url: '/admin/dashboard/realtime',
    method: 'get'
  })
}
