// ============================================================================
// API 请求封装模块
// ============================================================================
// 功能说明：
// 1. 封装 fetch 请求
// 2. 自动添加 Token 认证头
// 3. 统一处理响应和错误
// 4. 支持请求超时
//
// 使用方式：
// import { request, authRequest } from '../api/request'
//
// // 普通请求（不需要认证）
// const data = await request('/api/works')
//
// // 认证请求（需要 Token）
// const data = await authRequest('/api/admin/works', { method: 'POST', body: ... })
// ============================================================================

import { API_BASE, REQUEST_TIMEOUT } from './config'
import { getToken } from './auth'

// ============================================================================
// 请求错误类型
// ============================================================================

/**
 * API 错误类
 * 用于统一处理 API 返回的错误
 */
export class ApiError extends Error {
  code: number
  
  constructor(message: string, code: number = 500) {
    super(message)
    this.code = code
    this.name = 'ApiError'
  }
}

// ============================================================================
// 请求函数
// ============================================================================

/**
 * 发起 API 请求
 * @param url 请求路径（不含基础地址）
 * @param options fetch 选项
 * @returns 响应数据
 */
export async function request<T = any>(
  url: string, 
  options: RequestInit = {}
): Promise<T> {
  // 构建完整 URL
  const fullUrl = url.startsWith('http') ? url : `${API_BASE}${url}`
  
  // 默认请求头
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...((options.headers as Record<string, string>) || {}),
  }
  
  // 创建请求配置
  const config: RequestInit = {
    ...options,
    headers,
  }
  
  // 创建超时控制器
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT)
  config.signal = controller.signal
  
  try {
    // 发送请求
    const response = await fetch(fullUrl, config)
    
    // 解析 JSON 响应
    const data = await response.json()
    
    // 检查业务状态码
    if (data.code !== 0) {
      throw new ApiError(data.message || '请求失败', data.code)
    }
    
    return data
  } catch (error) {
    // 超时错误
    if (error instanceof Error && error.name === 'AbortError') {
      throw new ApiError('请求超时，请稍后重试', 408)
    }
    throw error
  } finally {
    clearTimeout(timeoutId)
  }
}

/**
 * 发起需要认证的 API 请求
 * 自动添加 Authorization 请求头
 * @param url 请求路径
 * @param options fetch 选项
 * @returns 响应数据
 */
export async function authRequest<T = any>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  // 获取 Token
  const token = getToken()
  
  // 未登录处理
  if (!token) {
    throw new ApiError('未登录，请先登录', 401)
  }
  
  // 添加认证头
  const headers: Record<string, string> = {
    ...((options.headers as Record<string, string>) || {}),
    'Authorization': `Bearer ${token}`,
  }
  
  // 发送请求
  try {
    return await request<T>(url, { ...options, headers })
  } catch (error) {
    // Token 过期或无效
    if (error instanceof ApiError && error.code === 401) {
      // 清除过期的认证信息
      localStorage.removeItem('jinhuo_admin_token')
      localStorage.removeItem('jinhuo_admin_user')
      // 跳转到登录页
      window.location.href = '/admin/login'
    }
    throw error
  }
}

// ============================================================================
// 便捷方法
// ============================================================================

/** GET 请求 */
export async function get<T = any>(url: string, needAuth = false): Promise<T> {
  return needAuth ? authRequest<T>(url) : request<T>(url)
}

/** POST 请求 */
export async function post<T = any>(url: string, data?: any, needAuth = false): Promise<T> {
  const options: RequestInit = {
    method: 'POST',
    body: data ? JSON.stringify(data) : undefined,
  }
  return needAuth ? authRequest<T>(url, options) : request<T>(url, options)
}

/** PUT 请求（需要认证） */
export async function put<T = any>(url: string, data?: any): Promise<T> {
  const options: RequestInit = {
    method: 'PUT',
    body: data ? JSON.stringify(data) : undefined,
  }
  return authRequest<T>(url, options)
}

/** DELETE 请求（需要认证） */
export async function del<T = any>(url: string): Promise<T> {
  const options: RequestInit = {
    method: 'DELETE',
  }
  return authRequest<T>(url, options)
}