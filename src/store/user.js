import { defineStore } from 'pinia'
import { ref } from 'vue'
import { login as loginApi, logout as logoutApi } from '@/api/user'

export const useUserStore = defineStore(
  'user',
  () => {
    const token = ref(localStorage.getItem('token') || '')
    const userInfo = ref(
      JSON.parse(localStorage.getItem('userInfo') || '{}')
    )

    // 设置token
    const setToken = (newToken) => {
      token.value = newToken
      localStorage.setItem('token', newToken)
    }

    // 设置用户信息
    const setUserInfo = (info) => {
      userInfo.value = info
      localStorage.setItem('userInfo', JSON.stringify(info))
    }

    // 登录
    const login = async (loginData) => {
      try {
        const res = await loginApi(loginData)

        if (res.code === 200) {
          // 保存token
          setToken(res.data.access_token)

          // 保存用户信息
          setUserInfo(res.data.admin_info)

          return res
        }

        return res
      } catch (error) {
        console.error('登录失败:', error)
        throw error
      }
    }

    // 登出
    const logout = async () => {
      try {
        // 调用登出API
        await logoutApi()
      } catch (error) {
        console.error('登出API调用失败:', error)
      } finally {
        // 无论API调用成功与否，都清除本地数据
        token.value = ''
        userInfo.value = {}
        localStorage.removeItem('token')
        localStorage.removeItem('userInfo')
      }
    }

    return {
      token,
      userInfo,
      setToken,
      setUserInfo,
      login,
      logout
    }
  },
  {
    persist: true
  }
)
