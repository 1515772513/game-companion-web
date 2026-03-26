import request from '@/utils/request'

/**
 * 创建消息推送
 * @param {Object} data - 推送数据
 * @param {String} data.title - 推送标题
 * @param {String} data.content - 推送内容
 * @param {String} data.target_type - 推送对象类型
 * @param {Object} data.target_criteria - 自定义筛选条件
 * @param {String} data.jump_url - 点击后跳转链接
 * @param {String} data.push_type - 推送方式
 * @param {String} data.schedule_time - 定时推送时间
 * @returns {Promise}
 */
export const sendMessage = (data) => {
  return request({
    url: '/messages/send',
    method: 'post',
    data
  })
}

/**
 * 获取推送记录列表
 * @param {Object} params - 查询参数
 * @param {Number} params.page - 页码
 * @param {Number} params.page_size - 每页数量
 * @param {String} params.keyword - 搜索关键词
 * @param {String} params.target_type - 推送对象类型
 * @param {String} params.status - 状态
 * @param {String} params.start_time - 创建开始时间
 * @param {String} params.end_time - 创建结束时间
 * @param {String} params.order_by - 排序字段
 * @param {String} params.order - 排序方向
 * @returns {Promise}
 */
export const getMessageList = (params) => {
  return request({
    url: '/messages/records',
    method: 'get',
    params
  })
}

/**
 * 获取推送统计
 * @returns {Promise}
 */
export const getMessageStats = () => {
  return request({
    url: '/messages/stats',
    method: 'get'
  })
}

/**
 * 取消推送
 * @param {Number} pushId - 推送记录ID
 * @returns {Promise}
 */
export const cancelMessage = (pushId) => {
  return request({
    url: `/messages/${pushId}/cancel`,
    method: 'post'
  })
}

/**
 * 重新发送消息
 * @param {Number} pushId - 推送记录ID
 * @returns {Promise}
 */
export const resendMessage = (pushId) => {
  return request({
    url: `/messages/${pushId}/resend`,
    method: 'post'
  })
}
