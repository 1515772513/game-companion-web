import request from '@/utils/request'

// 获取订单列表
export const getOrderList = (params) => {
  return request({
    url: '/orders',
    method: 'get',
    params
  })
}

// 获取订单详情
export const getOrderDetail = (id) => {
  return request({
    url: `/orders/${id}`,
    method: 'get'
  })
}

// 更新订单状态
export const updateOrderStatus = (id, status) => {
  return request({
    url: `/orders/${id}/status`,
    method: 'put',
    data: { status }
  })
}
