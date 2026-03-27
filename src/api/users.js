import request from '@/utils/request'

/**
 * 获取用户列表
 * @param {Object} params - 查询参数
 * @param {Number} params.page - 页码
 * @param {Number} params.page_size - 每页数量
 * @param {String} params.keyword - 搜索关键词
 * @param {Number} params.account_status - 账号状态
 * @param {Number} params.vip_level - VIP等级
 * @param {String} params.register_start - 注册开始时间
 * @param {String} params.register_end - 注册结束时间
 * @param {String} params.order_by - 排序字段
 * @param {String} params.order - 排序方向
 * @returns {Promise}
 */
export const getUserList = (data) => {
  return request({
    url: '/user/list',
    method: 'post',
    data
  })
}

/**
 * 获取用户详情
 * @param {Number} userId - 用户ID
 * @returns {Promise}
 */
export const getUserDetail = (userId) => {
  return request({
    url: `/users/${userId}`,
    method: 'get'
  })
}

/**
 * 更新用户状态（封禁/解封）
 * @param {Number} userId - 用户ID
 * @param {Object} data - 状态数据
 * @param {Number} data.account_status - 账号状态：1禁用，2封禁，0解封
 * @param {String} data.reason - 封禁原因
 * @returns {Promise}
 */
export const updateUserStatus = (userId, data) => {
  return request({
    url: `/users/${userId}/status`,
    method: 'put',
    data
  })
}

/**
 * 编辑用户信息
 * @param {Number} userId - 用户ID
 * @param {Object} data - 用户信息
 * @returns {Promise}
 */
export const updateUser = (userId, data) => {
  return request({
    url: `/users/${userId}`,
    method: 'put',
    data
  })
}

/**
 * 获取用户订单列表
 * @param {Number} userId - 用户ID
 * @param {Object} params - 查询参数
 * @returns {Promise}
 */
export const getUserOrders = (userId, params) => {
  return request({
    url: `/users/${userId}/orders`,
    method: 'get',
    params
  })
}

/**
 * 获取用户统计数据
 * @returns {Promise}
 */
export const getUserStats = () => {
  return request({
    url: '/user/stats',
    method: 'get'
  })
}

/**
 * 导出用户数据
 * @param {Object} data - 筛选条件
 * @returns {Promise}
 */
export const exportUsers = (data) => {
  return request({
    url: '/users/export',
    method: 'post',
    data
  })
}

/**
 * 重置用户密码
 * @param {Number} userId - 用户ID
 * @param {Object} data - 密码数据
 * @param {String} data.new_password - 新密码
 * @returns {Promise}
 */
export const resetUserPassword = (userId, data) => {
  return request({
    url: `/users/${userId}/reset-password`,
    method: 'post',
    data
  })
}
