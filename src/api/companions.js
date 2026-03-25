import request from '@/utils/request'

// 获取陪玩师列表
export const getCompanionList = (params) => {
  return request({
    url: '/companions',
    method: 'get',
    params
  })
}

// 获取陪玩师详情
export const getCompanionDetail = (id) => {
  return request({
    url: `/companions/${id}`,
    method: 'get'
  })
}

// 审核陪玩师
export const auditCompanion = (id, data) => {
  return request({
    url: `/companions/${id}/audit`,
    method: 'put',
    data
  })
}
