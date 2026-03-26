import request from '@/utils/request'

/**
 * 获取订单列表
 * @param {Object} params - 查询参数
 * @param {Number} params.page - 页码
 * @param {Number} params.page_size - 每页数量
 * @param {String} params.keyword - 搜索关键词（订单号、用户名、陪玩师昵称）
 * @param {Number} params.game_id - 游戏ID
 * @param {String} params.service_type - 服务类型
 * @param {Number} params.order_status - 订单状态：1待接单，2进行中，3待确认，4已完成，5已取消，6退款中，7已退款
 * @param {String} params.start_time - 下单开始时间
 * @param {String} params.end_time - 下单结束时间
 * @param {String} params.order_by - 排序字段
 * @param {String} params.order - 排序方向
 * @returns {Promise}
 */
export const getOrderList = (params) => {
  return request({
    url: '/admin/orders',
    method: 'get',
    params
  })
}

/**
 * 获取订单详情
 * @param {Number} orderId - 订单ID
 * @returns {Promise}
 */
export const getOrderDetail = (orderId) => {
  return request({
    url: `/admin/orders/${orderId}`,
    method: 'get'
  })
}

/**
 * 创建订单
 * @param {Object} data - 订单数据
 * @param {Number} data.companion_id - 陪玩师ID
 * @param {Number} data.game_id - 游戏ID
 * @param {String} data.service_type - 服务类型
 * @param {Number} data.service_count - 服务数量（时长/局数）
 * @param {String} data.appointment_time - 预约时间
 * @param {String} data.remark - 备注信息
 * @returns {Promise}
 */
export const createOrder = (data) => {
  return request({
    url: '/admin/orders',
    method: 'post',
    data
  })
}

/**
 * 取消订单
 * @param {Number} orderId - 订单ID
 * @param {Object} data - 取消数据
 * @param {String} data.cancel_reason - 取消原因
 * @returns {Promise}
 */
export const cancelOrder = (orderId, data) => {
  return request({
    url: `/admin/orders/${orderId}/cancel`,
    method: 'post',
    data
  })
}

/**
 * 处理退款
 * @param {Number} orderId - 订单ID
 * @param {Object} data - 退款数据
 * @param {String} data.refund_reason - 退款原因
 * @param {Number} data.refund_amount - 退款金额
 * @returns {Promise}
 */
export const refundOrder = (orderId, data) => {
  return request({
    url: `/admin/orders/${orderId}/refund`,
    method: 'post',
    data
  })
}

/**
 * 确认订单完成
 * @param {Number} orderId - 订单ID
 * @returns {Promise}
 */
export const confirmOrder = (orderId) => {
  return request({
    url: `/admin/orders/${orderId}/confirm`,
    method: 'post'
  })
}

/**
 * 更新订单状态
 * @param {Number} orderId - 订单ID
 * @param {Object} data - 状态数据
 * @param {Number} data.order_status - 订单状态
 * @returns {Promise}
 */
export const updateOrderStatus = (orderId, data) => {
  return request({
    url: `/admin/orders/${orderId}/status`,
    method: 'put',
    data
  })
}

/**
 * 获取订单统计数据
 * @returns {Promise}
 */
export const getOrderStats = () => {
  return request({
    url: '/admin/orders/stats',
    method: 'get'
  })
}

/**
 * 导出订单数据
 * @param {Object} data - 筛选条件
 * @returns {Promise}
 */
export const exportOrders = (data) => {
  return request({
    url: '/admin/orders/export',
    method: 'post',
    data
  })
}

/**
 * 获取订单评价
 * @param {Number} orderId - 订单ID
 * @returns {Promise}
 */
export const getOrderReview = (orderId) => {
  return request({
    url: `/admin/orders/${orderId}/review`,
    method: 'get'
  })
}
