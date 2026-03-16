// ============================================================================
// API 配置模块
// ============================================================================
// 功能说明：
// 1. 统一管理 API 请求地址
// 2. 配置请求超时时间
// 3. 支持开发/生产环境切换
//
// 使用方式：
// import { API_BASE } from '../api/config'
// fetch(`${API_BASE}/api/works`)
// ============================================================================

// API 基础地址
// 开发环境使用本地地址
// 生产环境应该修改为实际的服务器地址
//
// 生产环境配置方式：
// 1. 直接修改此文件
// 2. 或使用环境变量（需要配置 Vite 环境变量）
//    const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8080'
export const API_BASE = 'http://localhost:8080'

// 请求超时时间（毫秒）
// 超过此时间的请求将被取消
export const REQUEST_TIMEOUT = 30000

// Token 存储的 Key
// 用于在 localStorage 中存储 JWT Token
export const TOKEN_KEY = 'jinhuo_admin_token'

// 用户信息存储的 Key
export const USER_KEY = 'jinhuo_admin_user'