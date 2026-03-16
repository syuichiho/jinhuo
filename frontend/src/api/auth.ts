// ============================================================================
// 认证工具模块
// ============================================================================
// 功能说明：
// 1. 管理 JWT Token 的存储和读取
// 2. 管理用户登录状态
// 3. 提供认证相关的工具函数
//
// 安全说明：
// - Token 存储在 localStorage，可能受到 XSS 攻击
// - 更安全的方式是使用 httpOnly Cookie（需要后端配合）
// - 本项目为演示目的，使用 localStorage 存储
// ============================================================================

import { TOKEN_KEY, USER_KEY } from './config'

// ============================================================================
// Token 管理
// ============================================================================

/**
 * 保存 Token 到本地存储
 * @param token JWT Token 字符串
 */
export function saveToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token)
}

/**
 * 从本地存储读取 Token
 * @returns Token 字符串，未登录返回 null
 */
export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

/**
 * 删除本地存储的 Token
 * 用于退出登录时清除
 */
export function removeToken(): void {
  localStorage.removeItem(TOKEN_KEY)
}

/**
 * 检查是否已登录
 * 通过检查 Token 是否存在来判断
 * @returns true 表示已登录
 */
export function isLoggedIn(): boolean {
  return !!getToken()
}

// ============================================================================
// 用户信息管理
// ============================================================================

/**
 * 用户信息类型定义
 */
export interface UserInfo {
  username: string
  role: string
}

/**
 * 保存用户信息到本地存储
 * @param user 用户信息对象
 */
export function saveUser(user: UserInfo): void {
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}

/**
 * 从本地存储读取用户信息
 * @returns 用户信息对象，未登录返回 null
 */
export function getUser(): UserInfo | null {
  const userStr = localStorage.getItem(USER_KEY)
  if (!userStr) return null
  try {
    return JSON.parse(userStr)
  } catch {
    return null
  }
}

/**
 * 删除本地存储的用户信息
 */
export function removeUser(): void {
  localStorage.removeItem(USER_KEY)
}

// ============================================================================
// 登录/登出
// ============================================================================

/**
 * 清除所有认证信息
 * 用于退出登录
 */
export function logout(): void {
  removeToken()
  removeUser()
}

/**
 * 保存认证信息（Token + 用户信息）
 * 用于登录成功后
 */
export function saveAuth(token: string, user: UserInfo): void {
  saveToken(token)
  saveUser(user)
}