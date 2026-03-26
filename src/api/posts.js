import request from '@/utils/request'

/**
 * 获取动态列表
 * @param {Object} params - 查询参数
 * @param {Number} params.page - 页码
 * @param {Number} params.page_size - 每页数量
 * @param {String} params.keyword - 搜索关键词
 * @param {Number} params.game_id - 游戏圈子ID
 * @param {Number} params.audit_status - 审核状态
 * @param {Number} params.status - 状态
 * @param {Number} params.user_id - 发布用户ID
 * @param {String} params.start_time - 发布开始时间
 * @param {String} params.end_time - 发布结束时间
 * @param {String} params.order_by - 排序字段
 * @param {String} params.order - 排序方向
 * @returns {Promise}
 */
export const getPostList = (params) => {
  return request({
    url: '/posts',
    method: 'get',
    params
  })
}

/**
 * 获取动态详情
 * @param {Number} postId - 动态ID
 * @returns {Promise}
 */
export const getPostDetail = (postId) => {
  return request({
    url: `/posts/${postId}`,
    method: 'get'
  })
}

/**
 * 审核动态
 * @param {Number} postId - 动态ID
 * @param {Object} data - 审核数据
 * @param {String} data.action - 操作：approve通过，hide隐藏，delete删除
 * @param {String} data.audit_reason - 审核原因
 * @returns {Promise}
 */
export const auditPost = (postId, data) => {
  return request({
    url: `/posts/${postId}/audit`,
    method: 'post',
    data
  })
}

/**
 * 隐藏/恢复动态
 * @param {Number} postId - 动态ID
 * @param {Object} data - 可见性数据
 * @param {Number} data.audit_status - 1已通过（恢复），3已隐藏（隐藏）
 * @returns {Promise}
 */
export const updatePostVisibility = (postId, data) => {
  return request({
    url: `/posts/${postId}/visibility`,
    method: 'put',
    data
  })
}

/**
 * 删除动态
 * @param {Number} postId - 动态ID
 * @returns {Promise}
 */
export const deletePost = (postId) => {
  return request({
    url: `/posts/${postId}`,
    method: 'delete'
  })
}
