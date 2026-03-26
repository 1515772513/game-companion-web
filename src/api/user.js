import request from '@/utils/request'

/**
 * 管理员登录
 * @param {Object} data - 登录数据
 * @param {String} data.username - 管理员账号
 * @param {String} data.password - 登录密码
 * @param {Boolean} data.remember_me - 是否记住登录状态
 * @returns {Promise}
 */
export const login = (data) => {
  return request({
    url: '/auth/login',
    method: 'post',
    data
  })
}

/**
 * 管理员登出
 * @returns {Promise}
 */
export const logout = () => {
  return request({
    url: '/auth/logout',
    method: 'post'
  })
}

/**
 * 刷新Token
 * @param {Object} data - 刷新token数据
 * @param {String} data.refresh_token - 刷新令牌
 * @returns {Promise}
 */
export const refreshToken = (data) => {
  return request({
    url: '/auth/refresh',
    method: 'post',
    data
  })
}

/**
 * 获取当前管理员信息
 * @returns {Promise}
 */
export const getUserInfo = () => {
  return request({
    url: '/auth/me',
    method: 'get'
  })
}
