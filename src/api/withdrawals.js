import request from '@/utils/request'

// 获取提现申请列表
export const getWithdrawalList = (params) => {
  return request({
    url: '/withdrawals',
    method: 'get',
    params
  })
}

// 获取提现详情
export const getWithdrawalDetail = (id) => {
  return request({
    url: `/withdrawals/${id}`,
    method: 'get'
  })
}

// 审核提现申请
export const auditWithdrawal = (id, data) => {
  return request({
    url: `/withdrawals/${id}/audit`,
    method: 'put',
    data
  })
}
