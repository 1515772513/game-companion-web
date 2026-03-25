import request from '@/utils/request'

// 获取系统配置
export const getSettings = () => {
  return request({
    url: '/settings',
    method: 'get'
  })
}

// 更新系统配置
export const updateSettings = (data) => {
  return request({
    url: '/settings',
    method: 'put',
    data
  })
}
