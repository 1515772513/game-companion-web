import request from '@/utils/request'

// 获取统计数据
export const getStatistics = () => {
  return request({
    url: '/dashboard/statistics',
    method: 'get'
  })
}

// 获取图表数据
export const getChartData = (params) => {
  return request({
    url: '/dashboard/chart',
    method: 'get',
    params
  })
}
