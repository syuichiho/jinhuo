// ============================================================================
// 后台管理布局组件
// ============================================================================
// 功能说明：
// 1. 提供后台管理的整体布局结构
// 2. 侧边栏导航菜单
// 3. 用户认证检查（未登录自动跳转）
// 4. 用户信息显示和退出登录
//
// 布局结构：
// ┌──────────────────────────────────────┐
// │  侧边栏  │      主内容区             │
// │  - Logo  │                           │
// │  - 菜单  │      <Outlet />           │
// │  - 用户  │                           │
// └──────────────────────────────────────┘
// ============================================================================

import { useEffect } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { isLoggedIn, getUser, logout } from '../../api/auth'

function AdminLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  
  // 获取当前用户信息
  const user = getUser()

  // 侧边栏菜单项
  const menuItems = [
    { path: '/admin', label: '仪表盘', icon: '📊' },
    { path: '/admin/works', label: '作品管理', icon: '🎨' },
    { path: '/admin/articles', label: '资讯管理', icon: '📝' },
    { path: '/admin/inquiries', label: '咨询管理', icon: '💬' },
    { path: '/admin/admins', label: '账号管理', icon: '👤' },
  ]

  // 认证检查
  // 如果用户未登录，自动跳转到登录页
  useEffect(() => {
    if (!isLoggedIn()) {
      navigate('/admin/login')
    }
  }, [navigate])

  /**
   * 处理退出登录
   * 清除认证信息并跳转到登录页
   */
  const handleLogout = () => {
    logout()
    navigate('/admin/login')
  }

  return (
    <div className="min-h-screen bg-[#0D0D0D] flex">
      {/* ================================================================ */}
      {/* 侧边栏 */}
      {/* ================================================================ */}
      <aside className="w-64 bg-[#1A1A1A] border-r border-[#2A2A2A] flex flex-col">
        {/* Logo 区域 */}
        <div className="p-6 border-b border-[#2A2A2A]">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#DC143C] to-[#FFD700] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">烬</span>
            </div>
            <span className="text-xl font-bold tracking-tight">
              <span className="text-[#DC143C]">烬火</span>
              <span className="text-white">科技</span>
            </span>
          </Link>
        </div>
        
        {/* 导航菜单 */}
        <nav className="flex-1 py-6">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-6 py-3 text-gray-400 hover:text-white hover:bg-[#2A2A2A] transition-all ${
                location.pathname === item.path
                  ? 'text-white bg-[#2A2A2A] border-l-2 border-[#DC143C]'
                  : ''
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>
        
        {/* 用户信息区域 */}
        <div className="p-6 border-t border-[#2A2A2A]">
          {/* 用户名显示 */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#DC143C] to-[#FFD700] flex items-center justify-center">
              <span className="text-white font-bold">
                {user?.username?.charAt(0).toUpperCase() || 'A'}
              </span>
            </div>
            <div>
              <div className="text-white font-medium">{user?.username || 'Admin'}</div>
              <div className="text-gray-500 text-xs">{user?.role || 'admin'}</div>
            </div>
          </div>
          
          {/* 退出登录按钮 */}
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 text-gray-400 hover:text-white hover:bg-[#2A2A2A] rounded-lg transition-colors cursor-pointer"
          >
            <span>🚪</span>
            <span>退出登录</span>
          </button>
          
          {/* 返回前台链接 */}
          <Link 
            to="/" 
            className="mt-2 flex items-center justify-center gap-2 px-4 py-2 text-gray-500 hover:text-white transition-colors"
          >
            <span>←</span>
            <span>返回前台</span>
          </Link>
        </div>
      </aside>

      {/* ================================================================ */}
      {/* 主内容区 */}
      {/* 子路由内容会渲染在这里 */}
      {/* ================================================================ */}
      <main className="flex-1 p-8 overflow-auto">
        <Outlet />
      </main>
    </div>
  )
}

export default AdminLayout