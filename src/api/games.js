import request from '@/utils/request'

/**
 * 获取游戏列表
 * @param {Object} params - 查询参数
 * @param {Number} params.page - 页码
 * @param {Number} params.page_size - 每页数量
 * @param {String} params.keyword - 搜索关键词
 * @param {Number} params.status - 状态：0下架，1上架
 * @param {String} params.order_by - 排序字段
 * @param {String} params.order - 排序方向
 * @returns {Promise}
 */
export const getGameList = (params) => {
  return request({
    url: '/admin/games',
    method: 'get',
    params
  })
}

/**
 * 获取游戏详情
 * @param {Number} gameId - 游戏ID
 * @returns {Promise}
 */
export const getGameDetail = (gameId) => {
  return request({
    url: `/admin/games/${gameId}`,
    method: 'get'
  })
}

/**
 * 创建游戏
 * @param {Object} data - 游戏数据
 * @param {String} data.game_name - 游戏名称
 * @param {String} data.game_icon - 游戏图标
 * @param {String} data.game_cover - 游戏封面
 * @param {String} data.description - 游戏描述
 * @param {Array} data.service_types - 支持的服务类型
 * @param {Array} data.ranks - 段位列表
 * @param {Number} data.sort - 排序
 * @param {Number} data.status - 状态：0下架，1上架
 * @returns {Promise}
 */
export const createGame = (data) => {
  return request({
    url: '/admin/games',
    method: 'post',
    data
  })
}

/**
 * 更新游戏
 * @param {Number} gameId - 游戏ID
 * @param {Object} data - 游戏数据
 * @returns {Promise}
 */
export const updateGame = (gameId, data) => {
  return request({
    url: `/admin/games/${gameId}`,
    method: 'put',
    data
  })
}

/**
 * 删除游戏
 * @param {Number} gameId - 游戏ID
 * @returns {Promise}
 */
export const deleteGame = (gameId) => {
  return request({
    url: `/admin/games/${gameId}`,
    method: 'delete'
  })
}

/**
 * 上架/下架游戏
 * @param {Number} gameId - 游戏ID
 * @param {Object} data - 状态数据
 * @param {Number} data.status - 状态：0下架，1上架
 * @returns {Promise}
 */
export const updateGameStatus = (gameId, data) => {
  return request({
    url: `/admin/games/${gameId}/status`,
    method: 'put',
    data
  })
}

/**
 * 获取游戏统计数据
 * @returns {Promise}
 */
export const getGameStats = () => {
  return request({
    url: '/admin/games/stats',
    method: 'get'
  })
}
