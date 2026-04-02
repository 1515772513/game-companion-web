import request from '@/utils/request'

/**
 * 获取字典下拉列表（通用）
 * @param {String} dictType - 字典类型：review_status / service_type 等
 * @returns {Promise}
 */
export const getDictList = (dictType) => {
  return request({
    url: '/dict/list',
    method: 'get',
    params: { dictType }
  })
}

/**
 * 获取审核状态列表
 * @returns {Promise}
 */
export const getReviewStatusList = () => {
  return request({
    url: '/dict/review-status',
    method: 'get'
  })
}

/**
 * 获取服务类型列表
 * @returns {Promise}
 */
export const getServiceTypeList = () => {
  return request({
    url: '/dict/service-type',
    method: 'get'
  })
}