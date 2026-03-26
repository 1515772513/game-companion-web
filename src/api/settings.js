import request from '@/utils/request'

/**
 * 获取系统配置
 * @returns {Promise}
 */
export const getSettings = () => {
  return request({
    url: '/admin/settings',
    method: 'get'
  })
}

/**
 * 更新系统配置
 * @param {Object} data - 配置数据
 * @param {String} data.site_name - 网站名称
 * @param {String} data.site_logo - 网站Logo
 * @param {String} data.contact_email - 联系邮箱
 * @param {String} data.contact_phone - 联系电话
 * @param {Object} data.commission_config - 佣金配置
 * @returns {Promise}
 */
export const updateSettings = (data) => {
  return request({
    url: '/admin/settings',
    method: 'put',
    data
  })
}

/**
 * 获取管理员列表
 * @param {Object} params - 查询参数
 * @param {Number} params.page - 页码
 * @param {Number} params.page_size - 每页数量
 * @param {String} params.keyword - 搜索关键词
 * @param {Number} params.status - 状态：0禁用，1启用
 * @returns {Promise}
 */
export const getAdminList = (params) => {
  return request({
    url: '/admin/settings/admins',
    method: 'get',
    params
  })
}

/**
 * 创建管理员
 * @param {Object} data - 管理员数据
 * @param {String} data.username - 管理员账号
 * @param {String} data.password - 密码
 * @param {String} data.real_name - 真实姓名
 * @param {String} data.email - 邮箱
 * @param {String} data.phone - 手机号
 * @param {Number} data.role_id - 角色ID
 * @returns {Promise}
 */
export const createAdmin = (data) => {
  return request({
    url: '/admin/settings/admins',
    method: 'post',
    data
  })
}

/**
 * 更新管理员
 * @param {Number} adminId - 管理员ID
 * @param {Object} data - 管理员数据
 * @returns {Promise}
 */
export const updateAdmin = (adminId, data) => {
  return request({
    url: `/admin/settings/admins/${adminId}`,
    method: 'put',
    data
  })
}

/**
 * 删除管理员
 * @param {Number} adminId - 管理员ID
 * @returns {Promise}
 */
export const deleteAdmin = (adminId) => {
  return request({
    url: `/admin/settings/admins/${adminId}`,
    method: 'delete'
  })
}

/**
 * 获取角色列表
 * @returns {Promise}
 */
export const getRoleList = () => {
  return request({
    url: '/admin/settings/roles',
    method: 'get'
  })
}

/**
 * 创建角色
 * @param {Object} data - 角色数据
 * @param {String} data.role_name - 角色名称
 * @param {String} data.description - 角色描述
 * @param {Array} data.permissions - 权限列表
 * @returns {Promise}
 */
export const createRole = (data) => {
  return request({
    url: '/admin/settings/roles',
    method: 'post',
    data
  })
}

/**
 * 更新角色
 * @param {Number} roleId - 角色ID
 * @param {Object} data - 角色数据
 * @returns {Promise}
 */
export const updateRole = (roleId, data) => {
  return request({
    url: `/admin/settings/roles/${roleId}`,
    method: 'put',
    data
  })
}

/**
 * 删除角色
 * @param {Number} roleId - 角色ID
 * @returns {Promise}
 */
export const deleteRole = (roleId) => {
  return request({
    url: `/admin/settings/roles/${roleId}`,
    method: 'delete'
  })
}

/**
 * 获取操作日志
 * @param {Object} params - 查询参数
 * @param {Number} params.page - 页码
 * @param {Number} params.page_size - 每页数量
 * @param {String} params.keyword - 搜索关键词
 * @param {Number} params.admin_id - 管理员ID
 * @param {String} params.start_time - 开始时间
 * @param {String} params.end_time - 结束时间
 * @returns {Promise}
 */
export const getOperationLogs = (params) => {
  return request({
    url: '/admin/settings/logs',
    method: 'get',
    params
  })
}
