import request from '@/utils/request'

/**
 * 获取陪玩师认证申请列表
 * @param {Object} params - 查询参数
 * @param {Number} params.page - 页码
 * @param {Number} params.page_size - 每页数量
 * @param {String} params.keyword - 搜索关键词
 * @param {Number} params.game_id - 游戏ID
 * @param {String} params.service_type - 服务类型
 * @param {Number} params.certification_status - 认证状态：0待审核，1已通过，2已拒绝
 * @param {String} params.apply_time_start - 申请开始时间
 * @param {String} params.apply_time_end - 申请结束时间
 * @returns {Promise}
 */
export const getCompanionApplications = (data) => {
  return request({
    url: '/companion/list',
    method: 'post',
    data
  })
}

/**
 * 获取陪玩师认证申请详情
 * @param {Number} applicationId - 申请ID
 * @returns {Promise}
 */
export const getApplicationDetail = (applicationId) => {
  return request({
    url: `/admin/companions/applications/${applicationId}`,
    method: 'get'
  })
}

/**
 * 审核陪玩师认证申请
 * @param {Number} applicationId - 申请ID
 * @param {Object} data - 审核数据
 * @param {Number} data.audit_status - 审核状态：1通过，2拒绝
 * @param {String} data.audit_reason - 审核原因（拒绝时必填）
 * @returns {Promise}
 */
export const auditCompanionApplication = (data) => {
  return request({
    url: `/companion/audit`,
    method: 'post',
    data
  })
}

/**
 * 获取陪玩师列表（已认证）
 * @param {Object} params - 查询参数
 * @param {Number} params.page - 页码
 * @param {Number} params.page_size - 每页数量
 * @param {Number} params.game_id - 游戏ID
 * @param {String} params.service_type - 服务类型
 * @param {String} params.level - 等级：silver-银牌，gold-金牌，diamond-钻石，king-王者
 * @param {Number} params.online_status - 在线状态：0-离线，1-在线
 * @param {String} params.keyword - 搜索关键词
 * @param {String} params.sort_by - 排序字段
 * @param {String} params.sort_order - 排序方向
 * @returns {Promise}
 */
export const getCompanionList = (params) => {
  return request({
    url: '/admin/companions',
    method: 'get',
    params
  })
}

/**
 * 获取陪玩师详情
 * @param {Number} companionId - 陪玩师ID
 * @returns {Promise}
 */
export const getCompanionDetail = (companionId) => {
  return request({
    url: `/companion/detail/${companionId}`,
    method: 'get'
  })
}

/**
 * 更新陪玩师信息
 * @param {Number} companionId - 陪玩师ID
 * @param {Object} data - 更新数据
 * @returns {Promise}
 */
export const updateCompanion = (companionId, data) => {
  return request({
    url: `/admin/companions/${companionId}`,
    method: 'put',
    data
  })
}

/**
 * 封禁/解封陪玩师
 * @param {Number} companionId - 陪玩师ID
 * @param {Object} data - 状态数据
 * @param {Number} data.ban_status - 封禁状态：0正常，1已封禁
 * @param {String} data.ban_reason - 封禁原因
 * @returns {Promise}
 */
export const banCompanion = (companionId, data) => {
  return request({
    url: `/admin/companions/${companionId}/ban`,
    method: 'put',
    data
  })
}

/**
 * 获取陪玩师统计数据
 * @returns {Promise}
 */
export const getCompanionStats = () => {
  return request({
    url: '/companion/stats',
    method: 'get'
  })
}

/**
 * 导出陪玩师数据
 * @param {Object} data - 筛选条件
 * @returns {Promise}
 */
export const exportCompanions = (data) => {
  return request({
    url: '/admin/companions/export',
    method: 'post',
    data
  })
}

/**
 * 获取陪玩师收益数据
 * @param {Object} params - 查询参数
 * @returns {Promise}
 */
export const getCompanionEarnings = (params) => {
  return request({
    url: '/admin/companions/earnings',
    method: 'get',
    params
  })
}

/**
 * 审核陪玩师提现申请
 * @param {Number} withdrawId - 提现ID
 * @param {Object} data - 审核数据
 * @param {Number} data.audit_status - 审核状态：1通过，2拒绝
 * @param {String} data.audit_reason - 审核原因
 * @returns {Promise}
 */
export const auditWithdraw = (withdrawId, data) => {
  return request({
    url: `/admin/companions/withdrawals/${withdrawId}/audit`,
    method: 'post',
    data
  })
}

/**
 * 获取提现申请列表
 * @param {Object} params - 查询参数
 * @returns {Promise}
 */
export const getWithdrawList = (params) => {
  return request({
    url: '/admin/companions/withdrawals',
    method: 'get',
    params
  })
}
