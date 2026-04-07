import request from '@/utils/request'

// 分页查询
export function getConfigPage(params) {
  return request({
    url: '/system-config/page',
    method: 'get',
    params
  })
}

// 新增
export function addConfig(data) {
  return request({
    url: '/system-config',
    method: 'post',
    data: {
      ...data,
      id: null
    }
  })
}

// 修改
export function updateConfig(data) {
  return request({
    url: '/system-config',
    method: 'put',
    data
  })
}

// 删除
export function deleteConfig(id) {
  return request({
    url: '/system-config/' + id,
    method: 'delete'
  })
}