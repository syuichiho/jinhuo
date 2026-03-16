// ============================================================================
// 仪表盘页面
// ============================================================================
// 功能说明：
// 1. 显示统计数据（作品、资讯、咨询、访问量）
// 2. 数据从后端 API 获取
// ============================================================================

import { useState, useEffect } from 'react'
import { API_BASE } from '../../api/config'
import { getToken } from '../../api/auth'

interface Stats {
  works_count: number
  articles_count: number
  inquiries_count: number
  visits_today: number
  visits_total: number
}

function Dashboard() {
  const [stats, setStats] = useState<Stats>({
    works_count: 0,
    articles_count: 0,
    inquiries_count: 0,
    visits_today: 0,
    visits_total: 0,
  })

  // 获取认证请求头
  const getAuthHeaders = () => {
    const token = getToken()
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    }
  }

  // 获取统计数据
  const fetchStats = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/admin/dashboard`, {
        headers: getAuthHeaders(),
      })
      const data = await res.json()
      if (data.code === 0) {
        setStats(data.data)
      } else if (data.code === 401) {
        // Token 过期，跳转登录
        window.location.href = '/admin/login'
      }
    } catch (err) {
      console.error('获取统计数据失败:', err)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [])

  const statsCards = [
    { label: '作品数量', value: stats.works_count, icon: '🎨', color: 'text-[#DC143C]' },
    { label: '资讯数量', value: stats.articles_count, icon: '📝', color: 'text-[#FFD700]' },
    { label: '咨询数量', value: stats.inquiries_count, icon: '💬', color: 'text-blue-400' },
    { label: '累计访问', value: stats.visits_total, icon: '👁️', color: 'text-green-400' },
  ]

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-8">仪表盘</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statsCards.map((stat) => (
          <div key={stat.label} className="p-6 rounded-2xl bg-[#1A1A1A] border border-[#2A2A2A]">
            <div className="flex items-center justify-between mb-4">
              <span className="text-3xl">{stat.icon}</span>
              <span className={`text-3xl font-bold ${stat.color}`}>{stat.value}</span>
            </div>
            <div className="text-gray-400">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="p-6 rounded-2xl bg-[#1A1A1A] border border-[#2A2A2A]">
        <h2 className="text-xl font-bold text-white mb-4">访问趋势</h2>
        <div className="h-64 flex items-center justify-center text-gray-500 border border-dashed border-[#2A2A2A] rounded-xl">
          📈 图表区域（待接入数据）
        </div>
      </div>
    </div>
  )
}

export default Dashboard