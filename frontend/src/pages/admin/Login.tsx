// ============================================================================
// 登录页面
// ============================================================================
// 功能说明：
// 1. 管理员登录表单
// 2. 调用登录 API 验证用户名密码
// 3. 保存认证信息到本地存储
// 4. 登录成功后跳转到后台首页
//
// 安全说明：
// - 密码通过 HTTPS 传输（生产环境必须使用 HTTPS）
// - 登录成功后保存 JWT Token 到 localStorage
// - Token 会在后续请求中自动添加到 Authorization 头
// ============================================================================

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { API_BASE } from '../../api/config'
import { saveAuth } from '../../api/auth'

function Login() {
  // 表单状态
  const [form, setForm] = useState({ username: '', password: '' })
  // 提交状态
  const [loading, setLoading] = useState(false)
  // 错误信息
  const [error, setError] = useState('')
  // 导航钩子
  const navigate = useNavigate()

  /**
   * 处理登录表单提交
   * @param e 表单事件
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // 清除之前的错误信息
    setError('')
    
    // 表单验证
    if (!form.username || !form.password) {
      setError('请输入用户名和密码')
      return
    }
    
    setLoading(true)
    
    try {
      // 调用登录 API
      const res = await fetch(`${API_BASE}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      
      const data = await res.json()
      
      if (data.code === 0 && data.data) {
        // 登录成功，保存认证信息
        saveAuth(data.data.token, {
          username: data.data.username,
          role: data.data.role,
        })
        
        // 跳转到后台首页
        navigate('/admin')
      } else {
        // 登录失败
        setError(data.message || '登录失败，请重试')
      }
    } catch (err) {
      // 网络错误
      setError('网络错误，请检查网络连接')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center relative overflow-hidden">
      {/* 动态背景 */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-[#DC143C]/20 rounded-full blur-[200px] animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-[#FFD700]/15 rounded-full blur-[180px] animate-pulse delay-1000"></div>
      </div>

      <div className="relative w-full max-w-md px-8">
        {/* Logo */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-4 mb-6">
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-br from-[#DC143C] via-[#FF6B6B] to-[#FFD700] rounded-2xl rotate-12"></div>
              <div className="absolute inset-0 w-16 h-16 bg-black rounded-2xl flex items-center justify-center">
                <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#DC143C] to-[#FFD700]">烬</span>
              </div>
            </div>
          </div>
          <h1 className="text-4xl font-black tracking-tight">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#DC143C] to-[#FFD700]">烬火</span>
            <span className="text-white">科技</span>
          </h1>
          <p className="text-gray-500 mt-2">后台管理系统</p>
        </div>

        {/* 登录表单 */}
        <div className="relative p-8 rounded-3xl bg-gradient-to-b from-white/5 to-transparent border border-white/10 backdrop-blur-xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 错误提示 */}
            {error && (
              <div className="px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                {error}
              </div>
            )}
            
            <div>
              <label className="block text-white font-medium mb-2 text-sm">用户名</label>
              <input
                type="text"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#DC143C] focus:outline-none transition-colors placeholder-gray-600"
                placeholder="请输入用户名"
                required
                disabled={loading}
              />
            </div>
            <div>
              <label className="block text-white font-medium mb-2 text-sm">密码</label>
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#DC143C] focus:outline-none transition-colors placeholder-gray-600"
                placeholder="请输入密码"
                required
                disabled={loading}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl font-bold text-white bg-gradient-to-r from-[#DC143C] to-[#FFD700] hover:from-[#DC143C] hover:via-[#FF6B6B] hover:to-[#FFD700] transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-[#DC143C]/25 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '登录中...' : '登录'}
            </button>
          </form>
        </div>

        {/* 底部 */}
        <div className="text-center mt-8 text-gray-600 text-sm">
          © 2026 烬火科技
        </div>
      </div>
    </div>
  )
}

export default Login